import MagicString from 'magic-string';
import type { Module } from 'Module';
import { Scope } from 'ast/Scope';
import { Statement as StatementNode, ExportDeclaration, FunctionDeclaration, ExportAllDeclaration, ExportNamedDeclaration } from 'ast-parser';
import {
  isFunctionDeclaration,
  isExportDeclaration,
  isImportDeclaration
} from 'utils/isFunctionDeclaration';
import { buildScope } from 'utils/buildScope';
import { Reference } from 'ast/Reference';
import { findReference } from 'utils/findReference';

export class Statement {
  // acorn type problem
  node: StatementNode;
  magicString: MagicString;
  module: Module;
  scope: Scope;
  start: number;
  next: number;
  isImportDeclaration: boolean;
  isExportDeclaration: boolean;
  isReexportDeclaration: boolean;
  isFunctionDeclaration: boolean;
  isIncluded: boolean = false;
  defines: Set<string> = new Set();
  modifies: Set<string> = new Set();
  dependsOn: Set<string> = new Set();
  references: Reference[] = [];
  constructor(node: StatementNode, magicString: MagicString, module: Module) {
    this.magicString = magicString;
    this.node = node;
    this.module = module;
    this.scope = new Scope({
      statement: this
    });
    this.start = node.start;
    this.next = 0;
    this.isImportDeclaration = isImportDeclaration(node);
    this.isExportDeclaration = isExportDeclaration(node as ExportDeclaration);
    this.isReexportDeclaration = this.isExportDeclaration && !!(node as (ExportAllDeclaration | ExportNamedDeclaration)).source;
    this.isFunctionDeclaration = isFunctionDeclaration(node as FunctionDeclaration);
  }

  analyse() {
    if (this.isImportDeclaration) return;
    // 1、构建作用域链，记录 Declaration 节点表
    buildScope(this);
    // 2. 寻找引用依赖，记录 Reference 节点表
    findReference(this);
  }

  mark() {
    if (this.isIncluded) {
      return;
    }
    this.isIncluded = true;
    this.references.forEach(
      (ref: Reference) => ref.declaration && ref.declaration.use()
    );
  }
}
