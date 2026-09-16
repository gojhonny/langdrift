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
        name: 'LangDrift',
        short_name: 'LangDrift',
        description: 'Product Vision and Drift inquiry for leadership.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#f7f6f2',
        theme_color: '#f97316',
        icons: [
          {
            src: '/icons/pwa.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
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
