import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',          // Output to client/dist
    emptyOutDir: true,       // Clean the dist folder before building
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    port: 5173,              // Optional: customize dev port
    host: true               // Required for Render & other cloud platforms
  }
})
