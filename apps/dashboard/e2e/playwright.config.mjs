import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { defineConfig } from '@playwright/test'

const require = createRequire(import.meta.url)
const appDirectory = resolve(import.meta.dirname, '..')
const repository = resolve(appDirectory, '../..')
const evidenceDirectory = resolve(
  process.env.DASHBOARD_EVIDENCE_DIR ||
    resolve(repository, '.audits/runs/dashboard-tailwind-candidate')
)
const baselineDirectory = resolve(
  process.env.DASHBOARD_BASELINE_DIR ||
    resolve(repository, '.audits/runs/dashboard-tailwind-baseline-verified')
)

export default defineConfig({
  testDir: './tests',
  outputDir: resolve(evidenceDirectory, 'results'),
  snapshotPathTemplate: `${baselineDirectory}/{projectName}/{arg}{ext}`,
  updateSnapshots: 'none',
  workers: 1,
  retries: 0,
  timeout: 45000,
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      threshold: 0.15,
      maxDiffPixels: 20
    }
  },
  reporter: [
    ['list'],
    ['json', { outputFile: resolve(evidenceDirectory, 'results.json') }]
  ],
  use: {
    baseURL: 'http://127.0.0.1:13101',
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'UTC',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: `"${process.execPath}" "${require.resolve('next/dist/bin/next')}" start --hostname 127.0.0.1 --port 13101`,
    cwd: appDirectory,
    url: 'http://127.0.0.1:13101/overview',
    reuseExistingServer: false,
    timeout: 60000
  }
})
