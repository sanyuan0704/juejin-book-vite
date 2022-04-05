const { transform } = require("esbuild");

async function runTransform() {
  const content = await transform(
    "const isNull = (str: string): boolean => str.length > 0;",
    {
      sourcemap: true,
      loader: "",
    }
  );
  console.log(content);
}

runTransform();
