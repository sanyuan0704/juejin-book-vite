interface ScopeOptions {
  parent?: Scope;
  names?: string[];
  block?: boolean;
}

export default class Scope {
  parent?: Scope;
  depth: number;
  names: string[];
  isBlockScope?: boolean;
  constructor(options: ScopeOptions = {}) {
    const { parent, names, block } = options;
    this.parent = parent;
    this.depth = parent ? parent.depth + 1 : 0;
    this.names = names || [];
    this.isBlockScope = !!block;
  }

  add(name: string, isBlockDeclaration: boolean = false) {
    // e.g var、function
    if (!isBlockDeclaration && this.isBlockScope && this.parent) {
      this.parent.add(name, isBlockDeclaration);
    } else {
      this.names.push(name);
    }
  }

  contains(name: string): boolean {
    return this.findDefiningScope(name);
  }

  findDefiningScope(name: string): boolean {
    if (this.names.includes(name)) {
      return true;
    }
    if (this.parent && this.parent.findDefiningScope(name)) {
      return true;
    }
    return false;
  }
}
