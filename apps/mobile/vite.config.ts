import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const developmentServer = {
  host: '127.0.0.1',
  port: 3003,
  strictPort: true
} as const

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      manifest: {
        id: '/',
        name: 'Lang Drift',
        short_name: 'Lang Drift',
        description: 'Executive product intelligence for product evolution and drift.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0B0B0C',
        theme_color: '#F97316',
        icons: []
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: []
      },
      devOptions: { enabled: false }
    })
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  server: developmentServer,
  preview: developmentServer
})
