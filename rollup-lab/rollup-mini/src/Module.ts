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
  constructor({ path, bundle, source }: ModuleOptions) {
    this.bundle = bundle;
    this.path = path;
    this.source = source;
    this.magicString = new MagicString(source);
    this.imports = {};
    this.exports = {};

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
      // this.statements = ast.body.map(node)
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

  collectImportAndExportsInfo() {
    // 收集 imports 和 exports
    this.statements.forEach((statement) => {
      const node = statement.node as any;
      const source = node.source.value;
      if (statement.isImportDeclaration) {
        // import
        node.specifiers.forEach((specifier: Specifier) => {
          const isDefault = specifier.type === 'ImportDefaultSpecifier';
          const localName = specifier.local.name;
          const name = isDefault ? 'default' : specifier.imported.name;
          this.imports[localName] = { source, name, localName };
        });
      } else if (statement.isExportDeclaration) {
        // export
        // export defualt function foo(){}
        // export default foo;
        // export default 11;

        const isDefault = node.type === 'ExportDefaultDeclaration';
        const isNamed = node.type === 'ExportNamedDeclaration';
        // if (isDefault) {
        //   this.exports['default'] = {
        //     statement,
        //     localName
        //   };
        // }
        if (isNamed) {
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
    });
  }

  analyse() {
    this.statements.forEach((statement) => {
      statement.analyse();
    });
  }
}
