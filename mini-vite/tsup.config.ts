import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/node/index.ts",
    cli: "src/node/cli.ts",
    client: "src/client/client.ts",
  },
  format: ["esm", "cjs"],
  sourcemap: true,
  splitting: false,
});
