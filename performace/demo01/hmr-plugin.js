import { FSWatcher } from "vite";
import * as fs from 'fs';
export function hmr() {
  const changedFiles = new Set();
  return {
    name: 'hmr',
    buildStart() {
      process.on('SIGINT', () => { 
        fs.writeFileSync('.hmr-files.json', JSON.stringify([...changedFiles]));
        process.exit(0);
      })
    },
    handleHotUpdate(ctx) {
      changedFiles.add(ctx.file);
    },
  }
}