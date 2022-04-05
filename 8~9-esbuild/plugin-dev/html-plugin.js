const fs = require("fs/promises");
const path = require("path");
const { createScript, createLink, generateHTML } = require("./util");

module.exports = () => {
  return {
    name: "esbuild:html",
    setup(build) {
      build.onEnd(async (buildResult) => {
        if (buildResult.errors.length) {
          return;
        }
        const { metafile } = buildResult;
        // 拿到 metafile 后获取所有的 js 和 css 产物路径、拼接 HTML
        const scripts = [];
        const links = [];
        if (metafile) {
          const { outputs } = metafile;
          const assets = Object.keys(outputs);

          assets.forEach((asset) => {
            if (asset.endsWith(".js")) {
              scripts.push(createScript(asset));
            } else if (asset.endsWith(".css")) {
              links.push(createLink(asset));
            }
          });
        }
        const templatePath = path.join(process.cwd(), "index.html");
        const templateContent = generateHTML(scripts, links);
        await fs.writeFile(templatePath, templateContent);
      });
    },
  };
};
