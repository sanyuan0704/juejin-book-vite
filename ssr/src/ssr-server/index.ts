import express, { RequestHandler, Express } from 'express';
import { ViteDevServer } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import serve from 'serve-static';
import { renderToString } from 'react-dom/server';
import { performance, PerformanceObserver } from 'perf_hooks';
import { resolveTemplatePath, loadSsrEntryModule, matchPageUrl, isProd, cwd } from './util';
// 工程化考虑: 路由、状态管理、缓存、 CSR 降级、CSS in JS、按需加载、浏览器 API、自定义 Header

const perfObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach(entry => { 
    console.log('[performance]', entry.name, entry.duration.toFixed(2), 'ms');
  });
  performance.clearMarks();
});

perfObserver.observe({ entryTypes: ["measure"] })



async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
  let vite: ViteDevServer | null = null;
  if (!isProd) { 
    // vite-dev-server
    vite = await (await import('vite')).createServer({
      root: process.cwd(),
      server: {
        middlewareMode: 'ssr',
        watch: {
          usePolling: true,
          interval: 100
        }
      }
    })
    // 注册 Vite Middlewares
    // 处理客户端资源
    app.use(vite.middlewares);
  }
  return async (req, res, next) => {
    try {
      const url = req.originalUrl;
      if (!matchPageUrl(url)) {
        return await next();
      }
      // 1. 加载服务端入口组件模块
      const { ServerEntry, fetchData } = await loadSsrEntryModule(vite);
      // 2. 数据预取
      const data = await fetchData();
      // 3. 「核心」: 渲染服务端组件 -> 字符串
      performance.mark('render-start');
      const appHtml = renderToString(React.createElement(ServerEntry, { data }));
      performance.mark('render-end');
      performance.measure('renderToString', 'render-start', 'render-end');
      // console.log('renderToString 执行时间: ', renderTime.duration.toFixed(2), 'ms');
   
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
      // TODO: preload links
      res.status(200).setHeader('Content-Type', 'text/html').end(html);
    } catch (e: any) {
      vite?.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  };
}

async function createServer() {
  const app = express();
  // 加入 Vite SSR 中间件
  app.use(await createSsrMiddleware(app));

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