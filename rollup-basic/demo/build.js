const rollup = require("rollup");

const inputOptions = {
  input: "./src/index.js",
};

const outputOptionsList = [
  {
    dir: "dist/es",
    format: "esm",
  },
  {
    dir: "dist/cjs",
    format: "cjs",
  },
];

build();

async function build() {
  let bundle;
  let buildFailed = false;
  try {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);

    await generateOutputs(bundle);
  } catch (error) {
    buildFailed = true;
    console.error(error);
  }
  if (bundle) {
    await bundle.close();
  }
  process.exit(buildFailed ? 1 : 0);
}

async function generateOutputs(bundle) {
  for (const outputOptions of outputOptionsList) {
    const { output } = await bundle.generate(outputOptions);

    for (const chunkOrAsset of output) {
      if (chunkOrAsset.type === "asset") {
        console.log("Asset", chunkOrAsset);
      } else {
        console.log("Chunk", chunkOrAsset.modules);
      }
    }
    await bundle.write(outputOptions);
  }
}
