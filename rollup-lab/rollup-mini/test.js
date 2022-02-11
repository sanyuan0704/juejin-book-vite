// const { parse } = require('acorn');

// const res = parse('import a from "a";', {
//   ecmaVersion: 6,
//   sourceType: 'module'
// });
// console.log(res);

const { rollup } = require('./dist/rollup');


async function build() {
  const bundle = await rollup({
    input: './test/index.js'
  });
  const { code } = bundle.generate();
  console.log(code);
}

build();

// const { rollup } = require('rollup');

// rollup({
//   entry: './example.js'
// }).then((bundle) => {
// console.log(bundle.generate())

// })
// const { code } = bundle.generate();
// console.log(code)