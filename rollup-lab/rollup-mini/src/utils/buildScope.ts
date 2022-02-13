import { walk } from './walk';
import { Scope } from '../ast/Scope';
import { Statement } from '../Statement';
import { Declaration } from '../ast/Declaration';

export function buildScope(statement: Statement) {
  const { node, scope: initialScope } = statement;
  let scope = initialScope;
  walk(node, {
    enter(node: any, parent: any) {
      // function foo () {...}
      // class Foo {...}
      if (/(Function|Class)Declaration/.test(node.type)) {
        scope.addDeclaration(node, false);
      }
      // var let const
      if (node.type === 'VariableDeclaration') {
        const isBlockDeclaration = node.kind !== 'var';
        node.declarations.forEach((declarator: Declaration) => {
          scope.addDeclaration(declarator, isBlockDeclaration);
        });
      }

      let newScope;

      // function scope
      if (/(Function|Class)/.test(node.type)) {
        newScope = new Scope({
          parent: scope,
          block: false,
          paramNodes: node.params,
          statement
        });
      }

      // new block state
      if (node.type === 'BlockStatement') {
        newScope = new Scope({
          parent: scope,
          block: true,
          statement
        });
      }

      if (newScope) {
        Object.defineProperty(node, '_scope', {
          value: newScope,
          configurable: true
        });

        scope = newScope;
      }
    },
    leave(node: any) {
      // 当前 scope 即 node._scope
      if (node._scope && scope.parent) {
        scope = scope.parent;
      }
    }
  });
}
