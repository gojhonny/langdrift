import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const local = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic' } },
  resolve: {
    alias: {
      '@atoms': local('./apps/dashboard/app/lib/state/atoms/index.ts'),
      '@domain': local('./apps/dashboard/app/lib/state/domain/index.ts'),
      '@template': local('./apps/dashboard/app/lib/template'),
      '@components': local('./apps/dashboard/app/lib/components'),
      '@i18n': local('./apps/dashboard/app/lib/i18n'),
      '@views': local('./apps/dashboard/app/lib/views/index.ts')
    }
  },
  test: {
    environment: 'jsdom',
    include: ['apps/dashboard/**/*.test.tsx', 'packages/react/**/*.test.tsx']
  }
})
