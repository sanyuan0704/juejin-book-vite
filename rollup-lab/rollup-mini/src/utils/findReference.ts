import { Statement } from '../Statement';
import { walk } from './walk';
import { Reference } from '../ast/Reference';

function isReference(node: any, parent: any) {
  if (node.type === 'Identifier') {
    if (parent.type === 'ExportSpecifier' && node !== parent.local)
      return false;
    return true;
  }
  return false;
}

export function findReference(statement: Statement) {
  const { references, scope: initialScope, node } = statement;
  let scope = initialScope;
  walk(node, {
    enter(node: any, parent: any, prop: string) {
      if (node._scope) scope = node._scope;
      if (isReference(node, parent)) {
        // const obj = { a }
        const isShorthandProperty =
          parent.type === 'Property' && parent.shorthands;
        if (
          isShorthandProperty &&
          parent.key === parent.value &&
          prop === 'key'
        ) {
          return;
        }
        const reference = new Reference(node, scope, statement);
        references.push(reference);
      }
    },
    leave(node: any, parent: any) {
      if (node._scope && scope.parent) {
        scope = scope.parent;
      }
    }
  });
}
