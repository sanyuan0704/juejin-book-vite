import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import windi from 'vite-plugin-windicss'
import path from 'path';
import imp from 'vite-plugin-imp';

const variablePath = path.resolve('./src/variable.scss');

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablePath}";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  optimizeDeps: {
    
  },
  plugins: [
    react(),
    windi(),
    imp({
      libList: [
        {
          libName: 'antd',
          libDirectory: 'es',
          style: (name) => `antd/es/${name}/style/css.js`,
        }
      ]
    })
  ]
})
