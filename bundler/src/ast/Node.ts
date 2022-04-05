import { Scope } from 'ast/Scope';
import { Node as ASTNode } from 'ast-parser';

export interface Node extends ASTNode {
  parent?: Node;
  _scope?: Scope;
}
