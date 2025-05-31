import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true, // Allow access from network
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'c27f-197-248-248-91.ngrok-free.app' // 👈 Add your ngrok host here
    ],
    proxy: {
      '/api': {
        target: 'https://7142-197-248-248-91.ngrok-free.app',
        changeOrigin: true
      }
    }
  }
})
