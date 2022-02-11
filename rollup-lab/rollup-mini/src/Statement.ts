import MagicString from 'magic-string';
import type Module from './Module';
import Scope from './ast/Scope';
import { walk } from './ast/walk';

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
  isInclude: boolean = false;
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
    const ms = this.magicString;
    // 1. 构建作用域链
    walk(this.node, {
      enter: (node: any) => {
        let newScope: Scope | undefined;
        const addToScope = (
          declarator: Declaration,
          isBlock: boolean = false
        ) => {
          const name = declarator.id.name;
          this.scope.add(name, isBlock);
          if (!this.scope.parent) {
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
              parent: this.scope,
              block: false
            });
            break;
          case 'BlockStatement':
            newScope = new Scope({
              parent: this.scope,
              block: true
            });
            break;
          case 'VariableDeclaration':
            (node as VariableDeclaration).declarations.forEach((item) => {
              if (item.kind === 'let' || item.kind === 'const') {
                addToScope(item, true);
              } else {
                addToScope(item, false);
              }
            });
        }
        if (newScope) {
          Object.defineProperty(node, '_scope', { value: newScope });
          this.scope = newScope;
        }
      },
      leave: (node: any) => {
        if (node._scope) {
          this.scope = node._scope;
        }
      }
    });
  }
}
