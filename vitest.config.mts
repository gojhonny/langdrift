import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'apps/website/src/components/early-access/**/*.test.{ts,tsx}',
      'apps/website/src/turnstile-verify-url.test.ts'
    ],
    coverage: {
      provider: 'v8',
      thresholds: { statements: 90, branches: 85 },
      include: ['apps/website/src/components/early-access/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.types.ts']
    }
  }
})
