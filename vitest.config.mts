import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

interface PathsConfiguration {
  compilerOptions: {
    paths: Record<string, string[]>
  }
}

const websiteRoot = fileURLToPath(new URL('./apps/website', import.meta.url))
const pathsConfiguration = JSON.parse(
  readFileSync(resolve(websiteRoot, 'tsconfig.paths.json'), 'utf8')
) as PathsConfiguration
const websiteAliases = Object.fromEntries(
  Object.entries(pathsConfiguration.compilerOptions.paths).map(
    ([alias, targets]) => [
      alias.replace(/\/\*$/, ''),
      resolve(websiteRoot, targets[0].replace(/\/\*$/, ''))
    ]
  )
)

export default defineConfig({
  resolve: { alias: websiteAliases },
  test: {
    include: ['apps/website/components/early-access/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      thresholds: { statements: 90, branches: 85 },
      include: ['apps/website/components/early-access/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/*.types.ts']
    }
  }
})
