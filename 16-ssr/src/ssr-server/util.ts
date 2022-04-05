import { ViteDevServer } from 'vite';
import * as fs from 'fs';
import * as path from 'path';

export const isProd = process.env.NODE_ENV === 'production';
export const cwd = process.cwd();

export async function loadSsrEntryModule(vite: ViteDevServer | null) {
  if (isProd) {
    const entryPath = path.join(cwd, 'dist/server/entry-server.js');
    return require(entryPath);
  } else {
    const entryPath = path.join(cwd, 'src/entry-server.tsx');
    return vite!.ssrLoadModule(entryPath)
  }
}

export function resolveTemplatePath() {
  return isProd ?
    path.join(cwd, 'dist/client/index.html') :
    path.join(cwd, 'index.html');
}


export function matchPageUrl(url: string) {
  if (url === '/') {
    return true;
  }
}
