const { build, buildSync, serve } = require("esbuild");

// async function runBuild() {
//   const result = await build({
//     absWorkingDir: process.cwd(),
//     entryPoints: ["./src/index.jsx"],
//     // bundle: true,
//     format: "esm",
//     // external: ["react", "react-dom"],
//     logLevel: "error",
//     splitting: true,
//     sourcemap: true,
//     outdir: "dist",
//     ignoreAnnotations: true,
//     metafile: true,
//     minify: true,
//   });
//   console.log(result);
// }

// function runBuild() {
//   const result = buildSync({
//     absWorkingDir: process.cwd(),
//     entryPoints: ["./src/index.jsx"],
//     // bundle: true,
//     format: "esm",
//     // external: ["react", "react-dom"],
//     logLevel: "error",
//     splitting: true,
//     sourcemap: true,
//     outdir: "dist",
//     ignoreAnnotations: true,
//     metafile: true,
//     minify: true,
//   });
//   console.log(result);
// }

function runBuild() {
  serve(
    {
      port: 8000,
      // servedir: "./dist",
    },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ["./src/index.jsx"],
      bundle: true,
      format: "esm",
      // external: ["react", "react-dom"],
      logLevel: "error",
      splitting: true,
      sourcemap: true,
      // outdir: "dist",
      ignoreAnnotations: true,
      metafile: true,
      // minify: false,
    }
  ).then((server) => {
    console.log("HTTP Server starts at port", server.port);
  });
}

runBuild();
