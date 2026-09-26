import { resolve } from 'node:path'
import { defineConfig } from '@playwright/test'

import { captureConditions } from './capture-conditions.mjs'

const appDirectory = resolve(import.meta.dirname, '..')
const repository = resolve(appDirectory, '../..')
const evidenceDirectory = resolve(
  process.env.WEBSITE_EVIDENCE_DIR ||
    resolve(repository, '.audits/runs/website-structure-candidate')
)
const baselineDirectory = resolve(
  process.env.WEBSITE_BASELINE_DIR ||
    resolve(repository, '.audits/runs/website-structure-baseline-v7')
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
      threshold: captureConditions.pixelThreshold,
      maxDiffPixels: captureConditions.maxDiffPixels
    }
  },
  reporter: [
    ['list'],
    ['json', { outputFile: resolve(evidenceDirectory, 'results.json') }]
  ],
  use: {
    launchOptions: { args: captureConditions.launchArguments },
    baseURL: 'http://localhost:13100',
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: captureConditions.deviceScaleFactor,
    locale: captureConditions.locale,
    timezoneId: captureConditions.timezone,
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'sh ../../cli/src/runtime/next-start.sh 13100 localhost',
    cwd: appDirectory,
    url: 'http://localhost:13100/en',
    reuseExistingServer: false,
    timeout: 60000
  }
})
