import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project at /newinfra/; dev stays at root.
  base: command === 'build' ? '/newinfra/' : '/',
  plugins: [react()],
  // Pinned port so it never silently drifts off a taken 5173.
  server: { port: 5180, strictPort: true },
  preview: { port: 4180, strictPort: true },
}))
