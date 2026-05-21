import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'propojos_host',
      remotes: {
        dummy: 'http://localhost/dummy.js' // Forces generation of virtual:__federation__
      },
      shared: ['react', 'react-dom', 'zustand']
    })
  ],
  build: {
    target: 'esnext'
  }
})
