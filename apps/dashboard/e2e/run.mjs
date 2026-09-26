import { execFileSync, spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { chromium } from '@playwright/test'

const require = createRequire(import.meta.url)
const appDirectory = resolve(import.meta.dirname, '..')
const repository = resolve(appDirectory, '../..')
const mode = process.argv[2]
if (!['capture', 'compare'].includes(mode)) {
  throw new Error('Usage: node e2e/run.mjs capture|compare')
}

const baselineDirectory = resolve(
  process.env.DASHBOARD_BASELINE_DIR ||
    resolve(repository, '.audits/runs/dashboard-tailwind-baseline-verified')
)
const evidenceDirectory = resolve(
  process.env.DASHBOARD_EVIDENCE_DIR ||
    resolve(repository, `.audits/runs/dashboard-tailwind-${mode}`)
)
const baselineManifest = resolve(baselineDirectory, 'manifest.json')
if (mode === 'capture' && existsSync(baselineDirectory)) {
  throw new Error(
    'Baseline directory already exists. Use a new location; never overwrite an accepted baseline.'
  )
}
if (mode === 'compare' && !existsSync(baselineManifest)) {
  throw new Error('A completed pre-migration baseline capture is required.')
}

function git(...args) {
  return execFileSync('git', args, { cwd: repository, encoding: 'utf8' }).trim()
}

function snapshot() {
  const files = git(
    'ls-files',
    '-co',
    '--exclude-standard',
    '-z',
    '--',
    'apps/dashboard',
    'packages/react',
    'packages/design-tokens',
    'pnpm-lock.yaml',
    'biome.json',
    'vitest.web-quality.config.mts'
  )
    .split('\0')
    .filter(Boolean)
  const hashes = {}

  for (const file of [...new Set(files)].sort()) {
    if (/(^|\/)\.env($|\.)/.test(file)) continue
    const absolute = resolve(repository, file)
    hashes[file] = existsSync(absolute)
      ? createHash('sha256').update(readFileSync(absolute)).digest('hex')
      : 'deleted'
  }

  return {
    head: git('rev-parse', 'HEAD'),
    status: git('status', '--short'),
    hashes
  }
}

function imageHashes(directory) {
  if (!existsSync(directory)) return {}
  const hashes = {}

  for (const file of readdirSync(directory, { recursive: true }).sort()) {
    if (!file.endsWith('.png')) continue
    hashes[file] = createHash('sha256')
      .update(readFileSync(resolve(directory, file)))
      .digest('hex')
  }

  return hashes
}

const browser = await chromium.launch()

const conditions = {
  node: process.version,
  platform: process.platform,
  architecture: process.arch,
  playwright: require('@playwright/test/package.json').version,
  chromium: browser.version(),
  deviceScaleFactor: 1,
  locale: 'en-US',
  timezone: 'UTC',
  pixelThreshold: 0.15,
  maxDiffPixels: 20
}

await browser.close()

if (mode === 'compare') {
  const baseline = JSON.parse(readFileSync(baselineManifest, 'utf8'))
  if (
    !baseline.passed ||
    JSON.stringify(baseline.conditions) !== JSON.stringify(conditions)
  ) {
    throw new Error(
      'Baseline is incomplete or capture conditions differ. Reproduce the baseline environment; do not overwrite it.'
    )
  }
}

mkdirSync(evidenceDirectory, { recursive: true })
const before = snapshot()
const cliArguments = [
  require.resolve('@playwright/test/cli'),
  'test',
  '--config',
  'e2e/playwright.config.mjs'
]
if (mode === 'capture') cliArguments.push('--update-snapshots=all')
const result = spawnSync(process.execPath, cliArguments, {
  cwd: appDirectory,
  stdio: 'inherit',
  env: {
    ...process.env,
    DASHBOARD_BASELINE_DIR: baselineDirectory,
    DASHBOARD_EVIDENCE_DIR: evidenceDirectory
  }
})
const after = snapshot()
const unchanged = JSON.stringify(before.hashes) === JSON.stringify(after.hashes)
const report = {
  mode,
  timestamp: new Date().toISOString(),
  conditions,
  command: `pnpm --filter dashboard ${mode === 'capture' ? 'test:browser:baseline' : 'test:browser'}`,
  baselineDirectory,
  buildId: readFileSync(resolve(appDirectory, '.next/BUILD_ID'), 'utf8').trim(),
  baselineImages: imageHashes(baselineDirectory),
  candidateImages: imageHashes(resolve(evidenceDirectory, 'results')),
  snapshot: before,
  sourceUnchangedDuringRun: unchanged,
  exitCode: result.status,
  passed: result.status === 0 && unchanged
}
writeFileSync(
  resolve(evidenceDirectory, 'manifest.json'),
  `${JSON.stringify(report, null, 2)}\n`
)
if (mode === 'capture') {
  mkdirSync(baselineDirectory, { recursive: true })
  writeFileSync(baselineManifest, `${JSON.stringify(report, null, 2)}\n`)
}
if (!report.passed) process.exitCode = result.status || 1
