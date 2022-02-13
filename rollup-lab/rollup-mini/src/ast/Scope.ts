import { Statement } from '../Statement';
import { Declaration } from './Declaration';
import { keys } from '../utils/obejct';

interface ScopeOptions {
  parent?: Scope;
  paramNodes?: any[];
  block?: boolean;
  statement: Statement;
  isTopLevel?: boolean;
}

export class Scope {
  parent?: Scope;
  paramNodes: any[];
  isBlockScope?: boolean;
  statement: Statement;
  declarations: Record<string, Declaration> = {};
  constructor(options: ScopeOptions) {
    const { parent, paramNodes, block, statement } = options;
    this.parent = parent;
    this.paramNodes = paramNodes || [];
    this.statement = statement;
    this.isBlockScope = !!block;
    this.paramNodes.forEach(
      (node) =>
        (this.declarations[node.name] = new Declaration(
          node,
          true,
          this.statement
        ))
    );
  }

  addDeclaration(node: any, isBlockDeclaration: boolean) {
    // block scope & var, 向上追溯，直到顶层作用域
    if (this.isBlockScope && !isBlockDeclaration && this.parent) {
      this.parent.addDeclaration(node, isBlockDeclaration);
    } else {
      this.declarations[node.id.name] = new Declaration(
        node,
        false,
        this.statement
      );
    }
  }

  eachDeclaration(fn: (name: string, dec: Declaration) => void) {
    keys(this.declarations).forEach((key) => {
      fn(key, this.declarations[key]);
    });
  }

  contains(name: string): Declaration {
    return this.findDeclaration(name);
  }

  findDeclaration(name: string): Declaration {
    return (
      this.declarations[name] ||
      (this.parent && this.parent.findDeclaration(name))
    );
  }
}
