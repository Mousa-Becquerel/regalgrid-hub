import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` = the URL prefix baked into every asset URL. Set VITE_BASE=/regalgrid/
// at build time when serving the hub under that path on a parent domain.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5175,
    strictPort: true,
  },
})
