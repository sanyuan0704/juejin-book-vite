import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import windi from 'vite-plugin-windicss';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';
import viteStylelint from '@amatlash/vite-plugin-stylelint';
import viteEslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import viteImagemin from 'vite-plugin-imagemin';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import styleImport from 'vite-plugin-style-import';

const createStyleImportPlugin = styleImport;
const variablePath = path.resolve('./src/variable.scss');

export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
  },
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
      // 代理配置
      // '/api/': {
      //   target: 'http://127.0.0.1:3300/',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, '')
      // }
    }
  },
  build: {
    minify: false
  },
  plugins: [
    svgr(),
    react(),
    windi(),
    // mock 配置
    viteMockServe({
      mockPath: 'mock'
    }),
    viteEslint(),
    viteStylelint({
      exclude: /windicss|node_modules/
    }),
    createStyleImportPlugin({
      // If you don’t have the resolve you need, you can write it directly in the lib, or you can provide us with PR
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: (name) => {
            return `antd/es/${name}/style/index`;
          }
        }
      ]
    }),
    viteImagemin({
      optipng: {
        optimizationLevel: 7
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      }
    }),
    createSvgIconsPlugin({
      iconDirs: [path.join(__dirname, 'src/assets/icons')]
    })
  ]
});
