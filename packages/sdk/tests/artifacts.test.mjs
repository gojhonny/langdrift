import assert from 'node:assert/strict'
import {
  mkdtemp,
  mkdir,
  realpath,
  rm,
  symlink,
  writeFile
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { test } from 'node:test'
import {
  discoverArtifacts,
  findRepositoryRoot,
  loadProject,
  parseArtifact,
  readProjectFile,
  resolveReferences,
  resolveSafePath
} from '../dist/index.js'

const markdown = (type = 'prd', id = 'PRD-001', extra = '') =>
  `---\nlangdrift:\n  type: ${type}\n  schema_version: 1\n  id: ${id}\n  title: Visão do produto\n  owners: [user_42]\n${extra}---\n# Visão 🎯\n\nRich **body** stays intact.\n`
async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), 'langdrift-sdk-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  return realpath(root)
}
async function put(root, name, text) {
  await mkdir(path.dirname(path.join(root, name)), { recursive: true })
  await writeFile(path.join(root, name), text)
}

test('Markdown preserves Unicode, exact body and CRLF; no inferred identity', () => {
  for (const eol of ['\n', '\r\n']) {
    const text = markdown().replaceAll('\n', eol)
    const parsed = parseArtifact(text, '.drifts/vision/prd/file with spaces.md')
    assert.equal(
      parsed.body,
      `# Visão 🎯${eol}${eol}Rich **body** stays intact.${eol}`
    )
    assert.equal(parsed.resource, 'vision.prd')
    assert.equal(parsed.metadata.id, 'PRD-001')
  }
  for (const invalid of [
    '# PRD-001',
    markdown().replace('  id: PRD-001\n', ''),
    markdown().replace('langdrift:', 'other:'),
    markdown().replace('type: prd', 'type: execution')
  ]) {
    assert.throws(() => parseArtifact(invalid, 'example.md'), {
      code: 'ARTIFACT_INVALID'
    })
  }
})

test('invalid YAML, duplicate keys, aliases and custom tags are rejected', () => {
  for (const extra of [
    '  owners: [other]\n',
    '  description: *missing\n',
    '  description: !execute something\n'
  ]) {
    assert.throws(
      () => parseArtifact(markdown('prd', 'PRD-001', extra), 'a.md'),
      { code: 'ARTIFACT_INVALID' }
    )
  }
})

test('find root supports worktree .git files and fails outside repository', async (t) => {
  const root = await fixture(t)
  await put(root, '.git', 'gitdir: /not-read')
  await mkdir(path.join(root, 'a/b'), { recursive: true })
  assert.equal(await findRepositoryRoot(path.join(root, 'a/b')), root)
  const outside = await fixture(t)
  await assert.rejects(findRepositoryRoot(outside), {
    code: 'PROJECT_NOT_FOUND'
  })
})

test('safe paths reject traversal, secret paths and symlink escapes', async (t) => {
  const root = await fixture(t)
  const outside = await fixture(t)
  await symlink(outside, path.join(root, 'link'))
  for (const name of [
    '../secret.md',
    '/tmp/secret',
    '.env',
    '.ssh/key.md',
    '.agents/readme.md',
    'a/../../secret',
    'a\\b.md',
    'node_modules/x',
    'link/file.md'
  ]) {
    await assert.rejects(resolveSafePath(root, name), {
      code: 'PATH_OUTSIDE_ROOT'
    })
  }
  assert.equal(
    await resolveSafePath(root, '.drifts/vision/prd/new.md'),
    path.join(root, '.drifts/vision/prd/new.md')
  )
})

test('reads are capped and discovery stays within package source globs', async (t) => {
  const root = await fixture(t)
  await put(root, '.drifts/vision/prd/z file.md', markdown())
  await put(root, '.drifts/vision/prd/a.md', markdown('prd', 'PRD-002'))
  await put(root, '.drifts/vision/prd/.env', 'not markdown')
  await put(root, 'unrelated/invalid.md', 'never read')
  await put(
    root,
    '.drifts/vision/prd/secrets.json',
    'not a JSON document source'
  )
  const found = await discoverArtifacts(root)
  assert.deepEqual(
    found.map((a) => a.metadata.id),
    ['PRD-002', 'PRD-001']
  )
  await assert.rejects(discoverArtifacts(root, { maxFiles: 1 }), /file limit/)
  await assert.rejects(
    discoverArtifacts(root, { maxDirectories: 1 }),
    /directory limit/
  )
  await assert.rejects(
    readProjectFile(root, '.drifts/vision/prd/a.md', 5),
    /at most/
  )
  await put(root, '.drifts/vision/prd/wrong.md', markdown('spec', 'SPEC-001'))
  await assert.rejects(discoverArtifacts(root), /does not match/)
})

test('discovery rejects symlinked artifact directories and files', async (t) => {
  const root = await fixture(t)
  const outside = await fixture(t)
  await put(outside, 'secret.md', markdown())
  await mkdir(path.join(root, '.drifts/vision/prd'), { recursive: true })
  await symlink(
    path.join(outside, 'secret.md'),
    path.join(root, '.drifts/vision/prd/link.md')
  )
  await assert.rejects(discoverArtifacts(root), { code: 'PATH_OUTSIDE_ROOT' })
})

test('references resolve local/external identities and report missing refs and cycles', async (t) => {
  const root = await fixture(t)
  const prd = parseArtifact(
    markdown(
      'prd',
      'PRD-001',
      '  research: [RES-001]\n  vision_targets: [VT-001]\n'
    ),
    '.drifts/vision/prd/a.md'
  )
  const research = parseArtifact(
    markdown('research', 'RES-001', '  prds: [PRD-001]\n'),
    '.drifts/vision/research/b.md'
  )
  const result = await resolveReferences(
    root,
    [prd, research],
    [{ type: 'vision-target', id: 'VT-001' }]
  )
  assert.equal(result.resolved.length, 2)
  assert.equal(result.external.length, 1)
  assert.deepEqual(
    result.issues.map(({ code }) => code),
    ['REFERENCE_CYCLE']
  )
  const missing = await resolveReferences(root, [prd])
  assert.equal(missing.issues.length, 2)
  await assert.rejects(resolveReferences(root, [prd, prd]), /Duplicate/)
  prd.references = [{ type: 'research', id: 'RES-001', path: '../escape.md' }]
  await assert.rejects(resolveReferences(root, [prd, research]), {
    code: 'PATH_OUTSIDE_ROOT'
  })
})

test('project loading rejects invalid JSON, missing config and unsupported versions', async (t) => {
  const root = await fixture(t)
  await assert.rejects(loadProject(root), { code: 'PROJECT_NOT_FOUND' })
  await put(root, '.drifts/project.json', 'invalid')
  await assert.rejects(loadProject(root), { code: 'PROJECT_INVALID' })
  await put(root, '.drifts/project.json', '{"schema_version":2}')
  await assert.rejects(loadProject(root), { code: 'SCHEMA_UNSUPPORTED' })
})

test('reference keys cannot collide across type and ID boundaries', async (t) => {
  const root = await fixture(t)
  const target = parseArtifact(
    markdown('prd', 'part:123'),
    '.drifts/vision/prd/target.md'
  )
  const source = parseArtifact(
    markdown('spec', 'SPEC-001'),
    '.drifts/loop/spec/source.md'
  )
  source.references = [{ type: 'prd:part', id: '123' }]
  const result = await resolveReferences(root, [source, target])
  assert.equal(result.resolved.length, 0)
  assert.equal(result.issues[0].code, 'REFERENCE_NOT_FOUND')
})
