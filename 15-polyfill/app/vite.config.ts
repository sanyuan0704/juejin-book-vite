import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    react(),
    legacy({
      targets: ['ie >= 11'],
      // modernPolyfills: true
    })
  ]
})
