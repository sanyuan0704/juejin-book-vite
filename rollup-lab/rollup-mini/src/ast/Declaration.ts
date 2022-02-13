import { Statement } from '../Statement';
import { Reference } from './Reference';

export class Declaration {
  isFunctionDeclaration: boolean = false;
  functionNode: any;
  statement: Statement;
  name: string | null = null;
  isParam: boolean = false;
  alias: Declaration[] = [];
  isUsed: boolean = false;
  constructor(node: any, isParam: boolean, statement: Statement) {
    if (node) {
      if (node.type === 'FunctionDeclaration') {
        this.isFunctionDeclaration = true;
        this.functionNode = node;
      } else if (
        node.type === 'VariableDeclarator' &&
        node.init &&
        /FunctionExpression/.test(node.init.type)
      ) {
        this.isFunctionDeclaration = true;
        this.functionNode = node.init;
      }
    }
    this.statement = statement;
    this.isParam = isParam;
  }

  addAlias(declaration: Declaration) {
    this.alias.push(declaration);
  }

  addReference(reference: Reference) {
    reference.declaration = this;
    this.name = reference.name;
  }

  use() {
    this.isUsed = true;
    if (this.statement) {
      this.statement.mark();
    }
  }
}
