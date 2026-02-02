import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith('/') && !req.url.startsWith('/@') && !req.url.includes('.')) {
            req.url = '/index.html'
          }
          next()
        })
      },
    },
  ],
})
