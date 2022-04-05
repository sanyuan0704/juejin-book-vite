import fs from 'fs';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { loadSsrEntryModule, resolveTemplatePath } from '../src/ssr-server/util';

async function ssg() {
  const { ServerEntry, fetchData } = await loadSsrEntryModule(null);
  const data = await fetchData();
  const appHtml = renderToString(React.createElement(ServerEntry, { data }));
  const template = await resolveTemplatePath();
  const templateHtml = await fs.readFileSync(template, 'utf-8');
  const html = templateHtml
  .replace('<!-- SSR_APP -->', appHtml)
  .replace(
    '<!-- SSR_DATA -->',
    `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
  ); 
  fs.mkdirSync('./dist/client', { recursive: true });
  console.log('html', html);
  fs.writeFileSync('./dist/client/index.html', html);
}

ssg();

