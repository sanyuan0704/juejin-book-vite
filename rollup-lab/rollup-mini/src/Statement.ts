import MagicString from 'magic-string';
import type Module from './Module';
import Scope from './ast/Scope';
import { walk } from './utils/walk';

interface Declaration {
  id: {
    name: string;
  };
  kind: string;
}

interface VariableDeclaration extends Declaration {
  declarations: Declaration[];
}

export class Statement {
  // acorn type problem
  node: any;
  magicString: MagicString;
  module: Module;
  scope: Scope;
  isImportDeclaration: boolean;
  isExportDeclaration: boolean;
  isIncluded: boolean = false;
  defines: Set<string> = new Set();
  modifies: Set<string> = new Set();
  dependsOn: Set<string> = new Set();
  constructor(node: any, magicString: MagicString, module: Module) {
    this.magicString = magicString;
    this.node = node;
    this.module = module;
    this.scope = new Scope();
    this.isImportDeclaration = node.type === 'ImportDeclaration';
    this.isExportDeclaration = /^Export/.test(node.type);
  }

  analyse() {
    if (this.isImportDeclaration) return;
    const ms = this.magicString;
    let scope = this.scope;
    // 1. 构建作用域链
    walk(this.node, {
      enter: (node: any) => {
        let newScope: Scope | undefined;
        const addToScope = (
          declarator: Declaration,
          isBlock: boolean = false
        ) => {
          const name = declarator.id.name;
          scope.add(name, isBlock);
          if (!scope.parent) {
            this.defines.add(name);
          }
        };
        ms.addSourcemapLocation(node.start);
        switch (node.type) {
          case 'FunctionExpression':
          case 'FunctionDeclaration':
          case 'ArrowFunctionExpression':
            // function foo() {}
            if (node.type === 'FunctionDeclaration') {
              addToScope(node);
            }
            newScope = new Scope({
              parent: scope,
              block: false,
              names: node.params.map((item: { name: string }) => item.name)
            });
            break;
          case 'BlockStatement':
            newScope = new Scope({
              parent: scope,
              block: true
            });
            break;
          case 'VariableDeclaration':
            (node as VariableDeclaration).declarations.forEach((item) => {
              if (node.kind === 'let' || node.kind === 'const') {
                addToScope(item, true);
              } else {
                addToScope(item, false);
              }
            });
        }
        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope });
          scope = newScope;
        }
      },
      leave: (node: any) => {
        // 当前 scope 即 node._scope，离开时 scope 需要向上回溯
        if (node._scope && scope.parent) {
          scope = scope.parent;
        }
      }
    });
    // 2. 记录外部依赖
    walk(this.node, {
      enter: (node: any) => {
        if (node._scope) {
          scope = node._scope;
        }
        this.checkForReads(scope, node);
      },
      leave(node: any) {
        // 当前 scope 即 node._scope，离开时 scope 需要向上回溯
        if (node._scope && scope.parent) {
          scope = scope.parent;
        }
      }
    }) 
  }

  checkForReads(scope: Scope, node: any) {
    if (node.type === 'Identifier') {
      const inCurrentScope = scope.contains(node.name);
      if (!this.defines.has(node.name) && !inCurrentScope) {
        this.dependsOn.add(node.name);
      }
    }
  }

  async expand(): Promise<Statement[]> {
    // Statement 已经包含到 bundle 中，不考虑
    if (this.isIncluded) {
      return [];
    }
    this.isIncluded = true;
    const statements: Statement[] = [];
    const dependencies = Array.from(this.dependsOn);

    const depStatements = await this.module.fetchDependencies(dependencies);
    // 先加依赖，再加自身
    statements.push(
      ...depStatements,
      this
    )
    return statements;
  }
}
