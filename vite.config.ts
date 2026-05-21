import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'propojos_host',
      shared: ['react', 'react-dom', 'zustand']
    })
  ],
  build: {
    target: 'esnext'
  }
})
