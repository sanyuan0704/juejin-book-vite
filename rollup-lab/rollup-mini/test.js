const { parse } = require('acorn');

const res = parse('import a from "a";', {
  ecmaVersion: 6,
  sourceType: 'module'
});
console.log(res);
