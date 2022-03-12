import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import windi from 'vite-plugin-windicss';
import path from 'path';
import { viteMockServe } from 'vite-plugin-mock';
import viteStylelint from '@amatlash/vite-plugin-stylelint';
import viteEslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import viteImagemin from 'vite-plugin-imagemin';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import createStyleImportPlugin from 'vite-plugin-style-import';
import AutoImport from 'unplugin-auto-import/vite';

const variablePath = path.resolve('./src/variable.scss');

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
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
      // 适配 antd
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
    viteEslint({
      exclude: ['**/*.spec.ts']
    }),
    viteStylelint({
      exclude: /windicss|node_modules/
    }),
    createStyleImportPlugin({
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
    }),
    // 配合 Vitest 使用
    AutoImport({
      imports: ['vitest'],
      dts: true
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
