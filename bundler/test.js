const fs = require('fs');
const { rollup } = require('./dist/rollup');

async function build() {
  const bundle = await rollup({
    input: './test/index.js'
  });
  const res = bundle.generate();
  fs.writeFileSync('./test/bundle.js', res.code);
}

build();