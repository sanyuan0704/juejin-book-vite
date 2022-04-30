import { NextHandleFunction } from "connect";
import { ServerContext } from "../index";
import path from "path";
import { pathExists, readFile } from "fs-extra";
import { CLIENT_PUBLIC_PATH } from "../../constants";

export function indexHtmlMiddware(
  serverContext: ServerContext
): NextHandleFunction {
  const transformIndexHtml = (raw: string): string => {
    return raw.replace(
      /([ \t]*)<head[^>]*>/i,
      `$1<script type="module" src="${CLIENT_PUBLIC_PATH}"></script>`
    );
  };
  return async (req, res, next) => {
    if (req.url === "/") {
      const { root } = serverContext;
      const indexHtmlPath = path.join(root, "index.html");
      if (await pathExists(indexHtmlPath)) {
        const rawHtml = await readFile(indexHtmlPath, "utf8");
        const html = await transformIndexHtml(rawHtml);

        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        return res.end(html);
      }
    }
    return next();
  };
}
