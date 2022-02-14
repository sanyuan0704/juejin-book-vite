import { Scope } from './Scope';
import { Statement } from '../Statement';
import { Declaration } from './Declaration';

export class Reference {
  node: any;
  scope: Scope;
  statement: Statement;
  // declaration 信息在构建依赖图的部分补充
  declaration: Declaration | null = null;
  name: string;
  start: number;
  end: number;
  constructor(node: any, scope: Scope, statement: Statement) {
    this.node = node;
    this.scope = scope;
    this.statement = statement;
    this.name = node.name;
    this.start = node.start;
    this.end = node.end;
  }
}
