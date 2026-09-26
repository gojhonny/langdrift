import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { after, test } from 'node:test'
import { fileURLToPath } from 'node:url'

// These fixtures exercise the installed config without rewriting repository code.
const repository = fileURLToPath(new URL('../../', import.meta.url))
const executable = join(repository, 'node_modules/.bin/biome')
const sandbox = mkdtempSync(join(tmpdir(), 'langdrift-biome-'))
writeFileSync(join(sandbox, 'biome.json'), readFileSync(join(repository, 'biome.json')))
for (const workspace of ['apps/dashboard', 'packages/react']) {
  mkdirSync(join(sandbox, workspace), { recursive: true })
  writeFileSync(join(sandbox, workspace, 'package.json'), readFileSync(join(repository, workspace, 'package.json')))
}
after(() => rmSync(sandbox, { recursive: true, force: true }))

function run(args, source, relativePath = 'apps/dashboard/fixture.ts') {
  const fixturePath = join(sandbox, relativePath)
  mkdirSync(dirname(fixturePath), { recursive: true })
  writeFileSync(fixturePath, source)
  const result = spawnSync(executable, [...args, '--config-path', sandbox, fixturePath], {
    cwd: sandbox,
    encoding: 'utf8'
  })
  assert.equal(result.error, undefined)
  return { ...result, source: readFileSync(fixturePath, 'utf8') }
}

function restricted(source, relativePath) {
  const result = run(['lint', '--only=style/noRestrictedImports', '--reporter=json'], source, relativePath)
  const report = JSON.parse(result.stdout)
  assert.equal(report.summary.changed, 0)
  assert.equal(report.summary.unchanged, 1)
  assert.equal(report.summary.skipped, 0)
  assert.ok(report.diagnostics.every((diagnostic) => diagnostic.category === 'lint/style/noRestrictedImports'), result.stdout)
  assert.equal(result.status, report.summary.errors === 0 ? 0 : 1)
  return report.diagnostics.filter((diagnostic) => diagnostic.category === 'lint/style/noRestrictedImports')
}

test('installed Biome version is the version used to validate this promotion', () => {
  const result = spawnSync(executable, ['--version'], { encoding: 'utf8' })
  assert.equal(result.status, 0)
  assert.equal(result.stdout.trim(), 'Version: 2.3.15')
})

test('rejects direct, nested and embedded parent traversal in supported import forms', () => {
  const paths = ['..', '../parent', '../../parent', './nested/../peer', './nested/..', '@components/../peer']
  const forms = [
    (source) => `import { item } from '${source}'\nexport { item }\n`,
    (source) => `import type { Item } from '${source}'\nexport type { Item }\n`,
    (source) => `export { item } from '${source}'\n`,
    (source) => `export * from '${source}'\n`,
    (source) => `import '${source}'\n`,
    (source) => `export const modulePromise = import('${source}')\n`,
    (source) => `import loaded = require('${source}')\nexport { loaded }\n`
  ]
  for (const source of paths) {
    for (const form of forms) {
      const fixture = form(source)
      assert.equal(restricted(fixture).length, 1, fixture)
    }
  }
})

test('records native enforcement limits instead of treating them as covered', () => {
  const unsupported = [
    "export const loaded = require('../parent')\n",
    "const segment = '../parent'\nexport const loaded = import(segment)\n",
    "export type Item = import('../parent').Item\n",
    "export const loaded = import(`../parent`)\n",
    "export { item } from '..\\\\parent'\n"
  ]
  for (const fixture of unsupported) {
    assert.equal(restricted(fixture).length, 0, fixture)
  }
})

test('permits local descendants, absolute subpaths and third-party packages', () => {
  const paths = ['./peer', './nested/child', '@components', '@components/child', '@/domain/product', 'react', '@testing-library/react', 'node:path']
  for (const source of paths) {
    assert.equal(restricted(`export { item } from '${source}'\n`).length, 0, source)
  }
})

test('frontend import restriction applies to shared React and tokens, not SDK/core', () => {
  for (const relativePath of ['apps/website/fixture.ts', 'packages/react/fixture.ts', 'packages/design-tokens/fixture.ts']) {
    assert.equal(restricted("export { item } from '../parent'\n", relativePath).length, 1, relativePath)
  }
  for (const relativePath of ['packages/sdk/fixture.ts', 'packages/core/fixture.ts', 'messaging/fixture.ts']) {
    assert.equal(restricted("export { item } from '../parent'\n", relativePath).length, 0, relativePath)
  }
})

const unsortedImports = [
  "import local from './local'",
  "import atoms from '@atoms'",
  "import React from 'react'",
  "import scoped from '@testing-library/react'",
  "import shared from '@repo/react'",
  "import alias from '@/domain/product'",
  "import nested from '@components/child'",
  "import type { Product } from '@domain'",
  "import request from '@i18n/request'",
  "import sdk from '@langdrift/sdk'",
  "import template from '@template/ui'",
  '',
  'export { local, atoms, React, scoped, shared, alias, nested, request, sdk, template }',
  'export type { Product }',
  ''
].join('\n')
const groupedImports = [
  "import scoped from '@testing-library/react'",
  "import React from 'react'",
  '',
  "import atoms from '@atoms'",
  "import nested from '@components/child'",
  "import type { Product } from '@domain'",
  "import request from '@i18n/request'",
  "import sdk from '@langdrift/sdk'",
  "import shared from '@repo/react'",
  "import template from '@template/ui'",
  "import alias from '@/domain/product'",
  '',
  "import local from './local'",
  '',
  'export { local, atoms, React, scoped, shared, alias, nested, request, sdk, template }',
  'export type { Product }',
  ''
].join('\n')
const assistOnly = ['check', '--linter-enabled=false', '--formatter-enabled=false']

test('groups third-party, first-party absolute and relative imports with blank lines', () => {
  const rejected = run(assistOnly, unsortedImports)
  assert.notEqual(rejected.status, 0)
  assert.match(rejected.stdout + rejected.stderr, /organizeImports/)
  const organized = run([...assistOnly, '--write'], unsortedImports)
  assert.equal(organized.status, 0)
  assert.equal(organized.source, groupedImports)
  assert.equal(run(assistOnly, groupedImports).status, 0)
})

test('organizing imports preserves the order and boundaries of side-effect imports', () => {
  const source = "import 'z-setup'\nimport './globals.css'\nimport 'a-setup'\n"
  const result = run([...assistOnly, '--write'], source)
  assert.equal(result.status, 0)
  assert.equal(result.source, source)
  const mixed = "import before from './before'\nimport React from 'react'\nimport './setup'\nimport after from './after'\nimport atoms from '@atoms'\n"
  const mixedResult = run([...assistOnly, '--write'], mixed)
  assert.equal(mixedResult.status, 0)
  const barrierIndex = mixedResult.source.indexOf("import './setup'")
  assert.ok(mixedResult.source.indexOf('import React') < barrierIndex)
  assert.ok(mixedResult.source.indexOf('import before') < barrierIndex)
  assert.ok(mixedResult.source.indexOf('import atoms') > barrierIndex)
  assert.ok(mixedResult.source.indexOf('import after') > barrierIndex)
})

test('preserves the existing shared React noImgElement override', () => {
  const source = 'export function ImageFixture() { return <img alt="Fixture" src="/fixture.png" /> }\n'
  for (const [relativePath, expectedCount] of [['packages/react/image-fixture.tsx', 0], ['apps/dashboard/image-fixture.tsx', 1]]) {
    const result = run(['lint', '--reporter=json'], source, relativePath)
    const report = JSON.parse(result.stdout)
    assert.equal(report.summary.unchanged, 1)
    assert.ok(report.diagnostics.every((diagnostic) => diagnostic.category === 'lint/performance/noImgElement'), result.stdout)
    assert.equal(report.diagnostics.length, expectedCount)
  }
})

test('attached comments move with imports, detached comments retain group boundaries', () => {
  const attached = "import local from './local'\n// Package-specific intent.\nimport React from 'react'\nimport atoms from '@atoms'\n"
  const attachedResult = run([...assistOnly, '--write'], attached)
  assert.equal(attachedResult.status, 0)
  assert.equal(attachedResult.source, "// Package-specific intent.\nimport React from 'react'\n\nimport atoms from '@atoms'\n\nimport local from './local'\n")
  const detached = "import local from './local'\n\n// Separate execution group.\n\nimport React from 'react'\nimport atoms from '@atoms'\n"
  const detachedResult = run([...assistOnly, '--write'], detached)
  assert.equal(detachedResult.status, 0)
  assert.equal(detachedResult.source, "import local from './local'\n\n// Separate execution group.\n\nimport React from 'react'\n\nimport atoms from '@atoms'\n")
})

test('does not impose frontend import grouping on SDK/core', () => {
  for (const relativePath of ['packages/sdk/fixture.ts', 'packages/core/fixture.ts']) {
    assert.equal(run(assistOnly, unsortedImports, relativePath).status, 0)
  }
})

test('expands frontend JSON objects and arrays, preserving content and accepting expanded output', () => {
  const compact = '{"compilerOptions":{"paths":{"@domain":["./domain.ts"]}}}\n'
  for (const relativePath of ['apps/dashboard/fixture.json', 'packages/react/fixture.json', 'packages/design-tokens/fixture.json']) {
    assert.notEqual(run(['format'], compact, relativePath).status, 0)
    const expanded = run(['format', '--write'], compact, relativePath)
    assert.equal(expanded.status, 0)
    assert.deepEqual(JSON.parse(expanded.source), JSON.parse(compact))
    assert.match(expanded.source, /"@domain": \[\n/)
    assert.equal(run(['format'], expanded.source, relativePath).status, 0)
  }
})

test('does not change JSON expansion for backend and root configuration', () => {
  const source = '{ "values": ["one", "two"] }\n'
  for (const relativePath of ['packages/sdk/fixture.json', 'packages/core/fixture.json', 'messaging/fixture.json', 'fixture.json']) {
    const result = run(['format', '--write'], source, relativePath)
    assert.equal(result.status, 0)
    assert.equal(result.source, source)
  }
})
