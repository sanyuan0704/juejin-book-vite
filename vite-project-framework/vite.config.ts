import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import windi from 'vite-plugin-windicss';
import path from 'path';
import imp from 'vite-plugin-imp';
import { viteMockServe } from 'vite-plugin-mock';

const variablePath = path.resolve('./src/variable.scss');

export default defineConfig({
  css: {
    postcss: {},
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "${variablePath}";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  optimizeDeps: {},
  server: {
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:3300/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    windi(),
    // viteMockServe({
    // 	mockPath: "mock"
    // }),
    imp({
      libList: [
        {
          libName: 'antd',
          libDirectory: 'es',
          style: (name) => `antd/es/${name}/style/css.js`
        }
      ]
    })
  ]w
});
