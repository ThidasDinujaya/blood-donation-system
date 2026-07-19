import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Same-origin proxy avoids browser CORS failures (localhost vs 127.0.0.1).
    proxy: {
      '/user': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/campaign': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/inventory': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/request': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/notification': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
