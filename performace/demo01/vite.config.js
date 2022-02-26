import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import { hmr } from './hmr-plugin';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert(),  hmr()],
  server: {
    headers: {
      'Cache-Control': 'max-age=0, stale-while-revalidate=86400',
      Etag: ''
    },
    // https: true
  }
})
