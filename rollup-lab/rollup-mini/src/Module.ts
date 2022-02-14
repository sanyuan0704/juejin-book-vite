import type { Bundle } from './Bundle';
import MagicString from 'magic-string';
import { parse, Node } from 'acorn';
import { Statement } from './Statement';
import { ModuleLoader } from './ModuleLoader';
import { Declaration } from './ast/Declaration';
import { keys } from './utils/obejct';
import { debug } from 'console';

export interface ModuleOptions {
  path: string;
  bundle: Bundle;
  loader: ModuleLoader;
  code: string;
}

interface ImportOrExportInfo {
  source?: string;
  localName: string;
  name: string;
  statement?: Statement;
  isDeclaration?: boolean;
  module?: Module;
}

interface Specifier {
  type: string;
  local: {
    name: string;
  };
  imported: {
    name: string;
  };
  exported: {
    name: string;
  };
}

type Imports = Record<string, ImportOrExportInfo>;
type Exports = Record<string, ImportOrExportInfo>;

export class Module {
  id: string;
  path: string;
  bundle: Bundle;
  moduleLoader: ModuleLoader;
  code: string;
  magicString: MagicString;
  statements: Statement[];
  imports: Imports;
  exports: Exports;
  reexports: Exports;
  exportAllSources: string[] = [];
  exportAllModules: Module[] = [];
  declarations: Record<string, Declaration>;
  dependencies: string[] = [];
  dependencyModules: Module[] = [];
  referencedModules: Module[] = [];
  constructor({ path, bundle, code, loader }: ModuleOptions) {
    this.id = path;
    this.bundle = bundle;
    this.moduleLoader = loader;
    this.path = path;
    this.code = code;
    this.magicString = new MagicString(code);
    this.imports = {};
    this.exports = {};
    this.reexports = {};
    this.declarations = {};
    try {
      const ast = parse(code, {
        ecmaVersion: 6,
        sourceType: 'module'
      }) as any;

      const nodes = ast.body as Node[];
      this.statements = nodes.map((node) => {
        const magicString = this.magicString.snip(node.start, node.end);
        return new Statement(node, magicString, this);
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    this.analyseAST();
  }

  analyseAST() {
    this.statements.forEach((statement) => {
      statement.analyse();
      if (statement.isImportDeclaration) {
        this.addImports(statement);
      } else if (statement.isExportDeclaration) {
        this.addExports(statement);
      }
      // 注册顶层声明
      if (!statement.scope.parent) {
        statement.scope.eachDeclaration((name, declaration) => {
          this.declarations[name] = declaration;
        });
      }
    });
    const statements = this.statements;
    let next = this.code.length;
    for (let i = statements.length - 1; i >= 0; i--) {
      statements[i].next = next;
      next = statements[i].start;
    }
    // console.log('module:', this.path, this.declarations);
  }

  addDependencies(source: string) {
    if (!this.dependencies.includes(source)) {
      this.dependencies.push(source);
    }
  }

  addImports(statement: Statement) {
    const node = statement.node as any;
    const source = node.source.value;
    // import
    node.specifiers.forEach((specifier: Specifier) => {
      const isDefault = specifier.type === 'ImportDefaultSpecifier';
      const localName = specifier.local.name;
      const name = isDefault ? 'default' : specifier.imported.name;
      this.imports[localName] = { source, name, localName };
    });
    this.addDependencies(source);
  }

  addExports(statement: Statement) {
    const node = statement.node as any;
    const source = node.source && node.source.value;
    if (node.type === 'ExportNamedDeclaration') {
      // export { a, b } from 'mod'
      if (node.specifiers.length) {
        node.specifiers.forEach((specifier: Specifier) => {
          const localName = specifier.local.name;
          const exportedName = specifier.exported.name;
          this.exports[exportedName] = {
            localName,
            name: exportedName
          };
          if (source) {
            this.reexports[localName] = {
              statement,
              source,
              localName,
              name: localName,
              module: undefined
            };
            this.imports[localName] = {
              source,
              localName,
              name: localName
            };
            this.addDependencies(source);
          }
        });
      } else {
        const declaration = node.declaration;
        let name;
        if (declaration.type === 'VariableDeclaration') {
          // export const foo = 2;
          name = declaration.declarations[0].id.name;
        } else {
          // export function foo() {}
          name = declaration.id.name;
        }
        this.exports[name] = {
          statement,
          localName: name,
          name
        };
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      const identifier =
        // export default foo;
        (node.declaration.id && node.declaration.id.name) ||
        // export defualt function foo(){}
        node.declaration.name;

      this.exports['default'] = {
        statement,
        localName: identifier,
        name: 'default'
      };
    } else if (node.type === 'ExportAllDeclaration') {
      // export * from 'mod'
      if (source) {
        this.exportAllSources.push(source);
        this.addDependencies(source);
      }
    }
  }

  bind() {
    this.bindImportSpecifiers();
    this.bindReferences();
  }

  bindImportSpecifiers() {
    [...Object.values(this.imports), ...Object.values(this.reexports)].forEach(
      (specifier) => {
        specifier.module = this._getModuleBySource(specifier.source!);
      }
    );
    this.exportAllModules = this.exportAllSources.map(
      this._getModuleBySource.bind(this)
    );
    // 建立模块依赖图
    this.dependencyModules = this.dependencies.map(
      this._getModuleBySource.bind(this)
    );
    this.dependencyModules.forEach((module) => {
      module.referencedModules.push(this);
    });
  }

  bindReferences() {
    this.statements.forEach((statement) => {
      statement.references.forEach((reference) => {
        // 根据引用寻找声明的位置
        // 寻找顺序: 1. statement 2. 当前模块 3. 依赖模块
        const declaration =
          reference.scope.findDeclaration(reference.name) ||
          this.trace(reference.name);
        if (declaration) {
          reference.declaration = declaration;
        }
      });
    });
  }

  trace(name: string) {
    if (this.declarations[name]) {
      // 从当前模块找
      return this.declarations[name];
    }
    if (this.imports[name]) {
      const importSpecifier = this.imports[name];
      const importModule = importSpecifier.module!;
      // 从依赖模块找
      const declaration = importModule.traceExport(importSpecifier.name);
      if (declaration) {
        return declaration;
      }
    }
    return null;
  }

  traceExport(name: string): Declaration | null {
    // 1. reexport
    // export { foo as bar } from './mod'
    const reexportDeclaration = this.reexports[name];
    if (reexportDeclaration) {
      // 说明是从其它模块 reexport 出来的
      // 经过 bindImportSpecifier 方法处理，现已绑定 module
      const declaration = reexportDeclaration.module!.traceExport(
        reexportDeclaration.localName
      );
      if (!declaration) {
        throw new Error(
          `${reexportDeclaration.localName} is not exported by module ${
            reexportDeclaration.module!.path
          }(imported by ${this.path})`
        );
      }
      return declaration;
    }
    // 2. export
    // export { foo }
    const exportDeclaration = this.exports[name];
    if (exportDeclaration) {
      const declaration = this.trace(name);
      if (declaration) {
        return declaration;
      }
    }
    // 3. export all
    for (let exportAllModule of this.exportAllModules) {
      const declaration = exportAllModule.trace(name);
      if (declaration) {
        return declaration;
      }
    }
    return null;
  }

  render() {
    const source = this.magicString.clone().trim();
    this.statements.forEach((statement) => {
      if (!statement.isIncluded) {
        source.remove(statement.start, statement.next);
        return;
      }
      if (statement.isExportDeclaration) {
        // export { foo, bar }
        if (statement.node.type === 'ExportNamedDeclaration') {
          if (statement.node.specifiers.length) {
            source.remove(statement.node.start, statement.node.end);
          }
        }
        // remove `export` from `export const foo = 42`
        if (
          statement.node.type === 'ExportNamedDeclaration' &&
          statement.node.declaration.type === 'VariableDeclaration'
        ) {
          source.remove(statement.node.start, statement.node.declaration.start);
        }

        if (statement.node.type === 'ExportDefaultDeclaration') {
          // export default functon foo() {};
          if (!statement.node.declaration.id) {
            const defaultName = statement.module.path + '__defualt';
            // export default () = {}
            // export default function () {}
            source.overwrite(
              statement.node.start,
              statement.node.declaration.start + 8,
              `var ${defaultName} = `
            );
          } else {
            // export default function a() {}
            const defaultName =
              statement.node.declaration.id.name + '__defualt';

            source.overwrite(
              statement.node.start,
              statement.node.declaration.start + 8,
              `var ${defaultName} = `
            );
          }
        }
      }
    });
    return source;
  }

  getExports(): string[] {
    return [
      ...keys(this.exports),
      ...keys(this.reexports),
      ...this.exportAllModules
        .map((module) =>
          module.getExports().filter((name: string) => name !== 'default')
        )
        .flat()
    ];
  }

  private _getModuleBySource(source: string) {
    const id = this.moduleLoader.resolveId(source!, this.path) as string;
    return this.bundle.getModuleById(id);
  }
}
