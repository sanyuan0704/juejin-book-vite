export function isFunctionDeclaration(node: any): boolean {
  if (!node) return false;

  return (
    // function foo() {}
    node.type === 'FunctionDeclaration' ||
    // function cosnt foo = function() {}
    (node.type === 'VariableDeclaration' &&
      node.init &&
      /FunctionExpression/.test(node.init.type)) ||
    // export function ...
    (isExportDeclaration(node) && isFunctionDeclaration(node.declaration))
  );
}

export function isExportDeclaration(node: any) {
  return /^Export/.test(node.type);
}

export function isImportDeclaration(node: any) {
  return node.type === 'ImportDeclaration';
}
