import type Bundle from './Bundle';
import MagicString from 'magic-string';
import { parse, Node } from 'acorn';
import { Statement } from './Statement';

export interface ModuleOptions {
  path: string;
  bundle: Bundle;
  source: string;
}

interface ImportOrExportInfo {
  source?: string;
  localName: string;
  name: string;
  statement?: Statement;
  isDeclaration?: boolean;
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

export default class Module {
  path: string;
  bundle: Bundle;
  source: string;
  magicString: MagicString;
  statements: Statement[];
  imports: Imports;
  exports: Exports;
  definitions: Record<string, Statement>;
  constructor({ path, bundle, source }: ModuleOptions) {
    this.bundle = bundle;
    this.path = path;
    this.source = source;
    this.magicString = new MagicString(source);
    this.imports = {};
    this.exports = {};
    this.definitions = {};
    try {
      const ast = parse(source, {
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
    this.collectImportAndExportsInfo();
    this.analyse();
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
  }

  addExports(statement: Statement) {
    const node = statement.node as any;
    const source = node.source && node.source.value;
    // export
    // export defualt function foo(){}
    // export default foo;
    // export default 11;

    const isDefaultExport = node.type === 'ExportDefaultDeclaration';
    const isNamedExport = node.type === 'ExportNamedDeclaration';
    // if (isDefault) {
    //   this.exports['default'] = {
    //     statement,
    //     localName
    //   };
    // }
    if (isNamedExport) {
      if (node.specifiers.length) {
        node.specifiers.forEach((specifier: Specifier) => {
          const localName = specifier.local.name;
          const exportedName = specifier.exported.name;
          this.exports[exportedName] = {
            localName,
            name: exportedName
          };
          if (source) {
            this.imports[localName] = {
              source,
              localName,
              name: localName
            };
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
    } 
  }

  collectImportAndExportsInfo() {
    // 收集 imports 和 exports
    this.statements.forEach((statement) => {
      if (statement.isImportDeclaration) {
        this.addImports(statement);
      } else if (statement.isExportDeclaration) {
        this.addExports(statement);
      }
    });
  }

  analyse() {
    this.statements.forEach((statement) => {
      statement.analyse();
      statement.defines.forEach(name => {
        // 收集到当前模块的 definitions 语句
        this.definitions[name] = statement;
      })
    });
  }

  async expandAllStatements(): Promise<Statement[]> {
    const statements = [];
    for (const statement of this.statements) {
      // skip import
      if (statement.isImportDeclaration) {
        continue;
      }
      if (statement.node.type === 'VariableDeclaration') {
        continue;
      }
      const statementWithDeps = await statement.expand()
      statements.push(...statementWithDeps);
    }
    return statements;
  }

  async fetchDependencies(names: string[]): Promise<Statement[]> {
    if (!names || !names.length) {
      return [];
    }
    const statements = [];
    for (const name of names) {
      // 如果是外部依赖
      if (!this.definitions[name] && this.imports[name]) {
        const source = this.imports[name].source!;
        const module = await this.bundle.fetchModule(source, this.path)
        const statement = module.exports[name].statement!;
        const statementWithDeps = await statement.expand();
        statements.push(...statementWithDeps);
      }
      else if (this.definitions[name]) {
        // 当前模块定义
        const statementWithDeps = await this.definitions[name].expand();
        statements.push(...statementWithDeps);
      }
      else {
        throw new Error('Duplicated name defination!')
      }
    }
    return statements;
  }
}
