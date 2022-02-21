import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import virtual from './plugins/virtual-module';
import svgr from './plugins/svgr';
import inspect from 'vite-plugin-inspect';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), virtual(), svgr({ defaultExport: 'component' }), inspect()],
  build: {
    sourcemap: true,
    minify: false
  }
})
