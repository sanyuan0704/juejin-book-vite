import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/node/cli.ts",
    client: "src/client/client.ts",
  },
  format: ["esm", "cjs"],
  target: "es2020",
  sourcemap: true,
  splitting: false,
  external: ["@babel/core", "react-refresh"],
});
