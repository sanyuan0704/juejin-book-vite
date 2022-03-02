import express, { RequestHandler, Express } from 'express';
import { ViteDevServer } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import serve from 'serve-static';
import { renderToString } from 'react-dom/server';

const isProd = process.env.NODE_ENV === 'production';
const cwd = process.cwd();

async function loadSsrEntryModule(vite: ViteDevServer | null) {
  if (isProd) {
    const entryPath = path.join(cwd, 'dist/server/entry-server.js');
    return require(entryPath);
  } else {
    const entryPath = path.join(cwd, 'src/entry-server.tsx');
    return vite!.ssrLoadModule(entryPath)
  }
}

function resolveTemplatePath() {
  return isProd ?
    path.join(cwd, 'dist/client/index.html') :
    path.join(cwd, 'index.html');
}

function matchPageUrl(url: string) {
  if (url === '/') {
    return true;
  }
}

function createSsrMiddleware(app: Express): RequestHandler {
  let vite: ViteDevServer | null = null;
  if (!isProd) { 
    // vite-dev-server
    vite = require('vite').createServer({
      root: process.cwd(),
      server: {
        middlewareMode: 'ssr',
        watch: {
          usePolling: true,
          interval: 100
        }
      }
    });
    // 注册 Vite Middlewares
    // 处理客户端资源
    app.use(vite!.middlewares);
  }
  return async (req, res, next) => {
    const url = req.originalUrl;
    if (!matchPageUrl(url)) {
      return await next();
    }
    // 1. 加载服务端入口组件模块
    const { ServerEntry } = await loadSsrEntryModule(vite);
    // 2. 数据预取
    const data = { a: 2 };
    // 3. 「核心」: 渲染服务端组件 -> 字符串
    const appHtml = renderToString(React.createElement(ServerEntry, { data }));
    // 4. 拼接完整 HTML 字符串，返回客户端
    const templatePath = resolveTemplatePath();
    let template = await fs.readFileSync(templatePath, 'utf-8');
    if (!isProd && vite) {
      template = await vite.transformIndexHtml(url, template);
    }
    const html = template
      .replace('<!-- SSR_APP -->', appHtml)
      .replace(
        '<!-- SSR_DATA -->',
        `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
    );
    res.status(200).setHeader('Content-Type', 'text/html').end(html);
  };
}

async function createServer() {
  const app = express();
  // 加入 Vite SSR 中间件
  app.use(createSsrMiddleware(app));

  // 生产环境端处理客户端资源
  if (isProd) {
    app.use(serve(path.join(cwd, 'dist/client')))
  }

  app.listen(3000, () => {
    console.log('Node 服务器已启动~')
    console.log('http://localhost:3000');
  });
}

createServer();