const { rollup } = require("../rollup/dist/rollup");
const fs = require("fs");

rollup("./src/index.js").then((bundle) => {
  // possible convenience method
  bundle.write("dist/bundle.js", {
    format: "es6",
  });
});
