import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000, // Poll cada segundo para detectar cambios más rápido
    },
    host: true, // Esto es vital para Docker
    strictPort: true,
    port: 5173,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
  }
})