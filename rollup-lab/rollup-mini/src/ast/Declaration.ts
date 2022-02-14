import { Statement } from '../Statement';
import { Reference } from './Reference';

export class Declaration {
  isFunctionDeclaration: boolean = false;
  functionNode: any;
  statement: Statement;
  name: string | null = null;
  isParam: boolean = false;
  isUsed: boolean = false;
  isReassigned: boolean = false;
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

  render() {
    return this.name;
  }
}

export class SyntheticDefaultDeclaration extends Declaration {
  original: Declaration | null;
  exportName: string | null;
  constructor(node: any, name: string, statement: Statement) {
    super(node, false, statement);
    this.original = null;
    this.exportName = '';
    this.name = name;
  }

  render() {
    return this.original?.render() || this.name;
  }

  bind(declaration: Declaration) {
    this.original = declaration;
  }
}
