import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  stat,
  symlink,
  writeFile
} from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { planSetup, setupProject, SetupError } from '../dist/index.js'

const bin = fileURLToPath(new URL('../dist/bin.js', import.meta.url))
const identity = {
  projectId: 'proj_fixture',
  accountId: 'acc_fixture',
  name: 'Customer project'
}
const managedFiles = [
  '.drifts/project.json',
  '.drifts/vision/schema.json',
  '.drifts/loop/schema.json',
  '.drifts/evidence/schema.json'
]

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'langdrift-setup-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  return root
}

async function jsonFile(root, path) {
  return JSON.parse(await readFile(join(root, path), 'utf8'))
}

async function absent(path) {
  await assert.rejects(stat(path), { code: 'ENOENT' })
}

function cli(root, args = []) {
  const result = spawnSync(
    process.execPath,
    [bin, 'setup', '--root', root, ...args],
    {
      cwd: root,
      encoding: 'utf8',
      timeout: 5000
    }
  )
  assert.equal(result.error, undefined)
  return result
}

const identityArgs = [
  '--project-id',
  identity.projectId,
  '--account-id',
  identity.accountId,
  '--name',
  identity.name
]

test('setup creates only the four supported protocol files and defaults optional integrations off', async (t) => {
  const root = await fixture(t)
  const result = await setupProject({ root, ...identity })
  assert.equal(result.changed, true)
  assert.deepEqual(
    result.files.map((file) => file.path),
    managedFiles
  )
  assert.ok(result.files.every((file) => file.status === 'create'))
  assert.deepEqual((await readdir(root)).sort(), ['.drifts'])
  assert.deepEqual((await readdir(join(root, '.drifts'))).sort(), [
    'evidence',
    'loop',
    'project.json',
    'vision'
  ])
  const project = await jsonFile(root, managedFiles[0])
  assert.equal(project.schema_version, 1)
  assert.deepEqual(project.generator, {
    name: '@langdrift/setup',
    version: '0.1.0'
  })
  assert.equal(project.id, identity.projectId)
  assert.equal(project.account_id, identity.accountId)
  assert.deepEqual(project.integrations, {
    langdrift: { enabled: true },
    github: { enabled: false },
    linear: { enabled: false },
    obsidian: { enabled: false }
  })
  for (const pillar of ['vision', 'loop', 'evidence']) {
    assert.deepEqual(await readdir(join(root, '.drifts', pillar)), [
      'schema.json'
    ])
    const schema = await jsonFile(root, `.drifts/${pillar}/schema.json`)
    assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema')
    assert.ok(schema.$defs)
  }
})

test('repeated setup reuses existing config and preserves exact file bytes and timestamps', async (t) => {
  const root = await fixture(t)
  await setupProject({ root, ...identity })
  const before = await Promise.all(
    managedFiles.map(async (path) => ({
      path,
      bytes: await readFile(join(root, path), 'utf8'),
      mtime: (await stat(join(root, path))).mtimeMs
    }))
  )
  const result = await setupProject({ root })
  assert.equal(result.changed, false)
  assert.ok(result.files.every((file) => file.status === 'preserve'))
  for (const entry of before) {
    assert.equal(await readFile(join(root, entry.path), 'utf8'), entry.bytes)
    assert.equal((await stat(join(root, entry.path))).mtimeMs, entry.mtime)
  }
})

test('missing schemas are repaired while Markdown and user directories remain unchanged', async (t) => {
  const root = await fixture(t)
  await setupProject({ root, ...identity })
  const document = join(root, '.drifts/vision/prd/PRD-customer.md')
  await mkdir(dirname(document), { recursive: true })
  const markdown = '# Customer direction\n\nKeep Unicode: visão 方向.\n'
  await writeFile(document, markdown)
  await rm(join(root, '.drifts/loop/schema.json'))
  const result = await setupProject({ root })
  assert.equal(result.changed, true)
  assert.deepEqual(
    result.files
      .filter((file) => file.status === 'create')
      .map((file) => file.path),
    ['.drifts/loop/schema.json']
  )
  assert.equal(await readFile(document, 'utf8'), markdown)
  assert.ok(await jsonFile(root, '.drifts/loop/schema.json'))
})

test('dry-run produces a deterministic complete plan without creating directories', async (t) => {
  const root = await fixture(t)
  const options = { root, ...identity, dryRun: true }
  const result = await setupProject(options)
  assert.equal(result.dryRun, true)
  assert.equal(result.changed, false)
  assert.deepEqual(result.files, (await planSetup(options)).files)
  assert.ok(result.files.every((file) => file.status === 'create'))
  assert.deepEqual(await readdir(root), [])
})

test('explicit configuration conflicts prevent missing schema creation', async (t) => {
  const root = await fixture(t)
  await setupProject({ root, ...identity })
  await rm(join(root, '.drifts/evidence/schema.json'))
  const before = await readFile(join(root, '.drifts/project.json'), 'utf8')
  await assert.rejects(
    setupProject({ root, name: 'Different project' }),
    (error) => {
      assert.ok(error instanceof SetupError)
      assert.equal(error.code, 'SETUP_CONFLICT')
      assert.equal(
        error.files.find((file) => file.path === managedFiles[0]).status,
        'conflict'
      )
      assert.equal(
        error.files.find((file) => file.path === '.drifts/evidence/schema.json')
          .status,
        'create'
      )
      return true
    }
  )
  assert.equal(
    await readFile(join(root, '.drifts/project.json'), 'utf8'),
    before
  )
  await absent(join(root, '.drifts/evidence/schema.json'))
})

test('schema conflicts are reported before project or other schemas are created', async (t) => {
  const root = await fixture(t)
  await mkdir(join(root, '.drifts/loop'), { recursive: true })
  await writeFile(join(root, '.drifts/loop/schema.json'), '{"custom":true}\n')
  await assert.rejects(setupProject({ root, ...identity }), (error) => {
    assert.equal(error.code, 'SETUP_CONFLICT')
    assert.equal(error.files.length, 4)
    assert.equal(
      error.files.find((file) => file.path === '.drifts/loop/schema.json')
        .status,
      'conflict'
    )
    return true
  })
  await absent(join(root, '.drifts/project.json'))
  await absent(join(root, '.drifts/vision'))
  assert.equal(
    await readFile(join(root, '.drifts/loop/schema.json'), 'utf8'),
    '{"custom":true}\n'
  )
})

test('semantically identical JSON with different key order or whitespace is preserved', async (t) => {
  const root = await fixture(t)
  await setupProject({ root, ...identity })
  const project = await jsonFile(root, '.drifts/project.json')
  const reformatted = JSON.stringify(
    Object.fromEntries(Object.entries(project).reverse())
  )
  await writeFile(join(root, '.drifts/project.json'), reformatted)
  const result = await setupProject({ root })
  assert.equal(result.changed, false)
  assert.equal(
    await readFile(join(root, '.drifts/project.json'), 'utf8'),
    reformatted
  )
})

test('future versions and malformed project JSON are refused without writing missing files', async (t) => {
  const root = await fixture(t)
  await setupProject({ root, ...identity })
  const project = await jsonFile(root, '.drifts/project.json')
  await rm(join(root, '.drifts/loop/schema.json'))
  for (const content of [
    JSON.stringify({ ...project, schema_version: 999 }),
    '{ broken'
  ]) {
    await writeFile(join(root, '.drifts/project.json'), content)
    await assert.rejects(setupProject({ root }), { code: 'SETUP_CONFLICT' })
    await absent(join(root, '.drifts/loop/schema.json'))
    assert.equal(
      await readFile(join(root, '.drifts/project.json'), 'utf8'),
      content
    )
  }
})

test('legacy execution layout requires manual migration and is never renamed', async (t) => {
  const root = await fixture(t)
  await mkdir(join(root, '.drifts/execution'), { recursive: true })
  const document = join(root, '.drifts/execution/customer.md')
  await writeFile(document, 'preserve me')
  await assert.rejects(setupProject({ root, ...identity }), (error) => {
    assert.equal(error.code, 'SETUP_CONFLICT')
    assert.match(
      error.files.find((file) => file.path === '.drifts/execution').reason,
      /Legacy execution/
    )
    return true
  })
  assert.equal(await readFile(document, 'utf8'), 'preserve me')
  await absent(join(root, '.drifts/project.json'))
  await absent(join(root, '.drifts/loop'))
  await assert.rejects(setupProject({ root }), { code: 'SETUP_CONFLICT' })
})

test('symlinked protocol directories cannot escape the customer root', async (t) => {
  const root = await fixture(t)
  const outside = await fixture(t)
  await symlink(outside, join(root, '.drifts'), 'dir')
  await assert.rejects(setupProject({ root, ...identity }), {
    code: 'SETUP_CONFLICT'
  })
  assert.deepEqual(await readdir(outside), [])
})

test('symlinked schema and non-directory pillar paths are rejected before repair', async (t) => {
  const root = await fixture(t)
  const outside = await fixture(t)
  const source = join(outside, 'schema.json')
  await writeFile(source, '{}')
  await mkdir(join(root, '.drifts/vision'), { recursive: true })
  await symlink(source, join(root, '.drifts/vision/schema.json'))
  await writeFile(join(root, '.drifts/loop'), 'customer content')
  await assert.rejects(setupProject({ root, ...identity }), {
    code: 'SETUP_CONFLICT'
  })
  await absent(join(root, '.drifts/project.json'))
  assert.equal(await readFile(source, 'utf8'), '{}')
  assert.equal(
    await readFile(join(root, '.drifts/loop'), 'utf8'),
    'customer content'
  )
})

test('safe GitHub and optional interface configuration is persisted without secrets', async (t) => {
  const root = await fixture(t)
  await setupProject({
    root,
    ...identity,
    githubInstallationId: '12345',
    githubRepository: 'customer/product',
    linear: true,
    obsidian: true
  })
  const { integrations } = await jsonFile(root, '.drifts/project.json')
  assert.deepEqual(integrations.github, {
    enabled: true,
    installation_id: '12345',
    repository: 'customer/product'
  })
  assert.equal(integrations.linear.enabled, true)
  assert.equal(integrations.obsidian.enabled, true)
  assert.equal((await setupProject({ root })).changed, false)
})

test('incomplete or unsafe GitHub references are rejected before files exist', async (t) => {
  const root = await fixture(t)
  for (const options of [
    { githubInstallationId: '12345' },
    { githubRepository: 'owner/repo' },
    { githubInstallationId: 'token-value', githubRepository: 'owner/repo' },
    {
      githubInstallationId: '12345',
      githubRepository: 'https://token@github.com/owner/repo'
    }
  ]) {
    await assert.rejects(setupProject({ root, ...identity, ...options }), {
      code: 'SETUP_ARGUMENT_INVALID'
    })
    assert.deepEqual(await readdir(root), [])
  }
})

test('CLI without a TTY returns a useful missing-input error instead of waiting', async (t) => {
  const root = await fixture(t)
  const result = cli(root, ['--json'])
  assert.equal(result.status, 1)
  const output = JSON.parse(result.stdout)
  assert.equal(output.ok, false)
  assert.equal(output.error.code, 'SETUP_ARGUMENT_MISSING')
  assert.match(output.error.message, /--project-id/)
  assert.equal(result.stderr, '')
  assert.deepEqual(await readdir(root), [])
})

test('CLI help and JSON dry-run work without creating files', async (t) => {
  const root = await fixture(t)
  const help = cli(root, ['--help'])
  assert.equal(help.status, 0)
  assert.match(help.stdout, /@langdrift\/setup setup/)
  assert.match(help.stdout, /--dry-run/)
  const result = cli(root, [...identityArgs, '--json', '--dry-run'])
  assert.equal(result.status, 0, result.stderr || result.stdout)
  const output = JSON.parse(result.stdout)
  assert.equal(output.ok, true)
  assert.equal(output.dryRun, true)
  assert.equal(output.files.length, 4)
  assert.equal('project' in output, false)
  assert.deepEqual(await readdir(root), [])
})

test('CLI discovers the Git root from a nested directory and refuses implicit non-repository roots', async (t) => {
  const root = await fixture(t)
  await mkdir(join(root, '.git'))
  const nested = join(root, 'apps/customer')
  await mkdir(nested, { recursive: true })
  const result = spawnSync(
    process.execPath,
    [bin, 'setup', ...identityArgs, '--json'],
    {
      cwd: nested,
      encoding: 'utf8',
      timeout: 5000
    }
  )
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.equal(JSON.parse(result.stdout).root, await realpath(root))
  assert.ok(await jsonFile(root, '.drifts/project.json'))
  await absent(join(nested, '.drifts'))

  const outside = await fixture(t)
  const rejected = spawnSync(
    process.execPath,
    [bin, 'setup', ...identityArgs, '--json'],
    {
      cwd: outside,
      encoding: 'utf8',
      timeout: 5000
    }
  )
  assert.equal(rejected.error, undefined)
  assert.equal(rejected.status, 1)
  assert.match(JSON.parse(rejected.stdout).error.message, /--root/)
  assert.deepEqual(await readdir(outside), [])
})

test('CLI diagnostics omit unknown option values and project configuration', async (t) => {
  const root = await fixture(t)
  const marker = 'secret-marker-must-not-be-printed'
  const rejected = cli(root, ['--github-token', marker, '--json'])
  assert.equal(rejected.status, 1)
  assert.ok(!`${rejected.stdout}${rejected.stderr}`.includes(marker))
  assert.equal(JSON.parse(rejected.stdout).error.code, 'SETUP_ARGUMENT_INVALID')

  const created = cli(root, [...identityArgs, '--json'])
  assert.equal(created.status, 0, created.stderr || created.stdout)
  assert.ok(!created.stdout.includes(identity.projectId))
  const rerun = cli(root, ['--json'])
  assert.equal(rerun.status, 0)
  assert.equal(JSON.parse(rerun.stdout).changed, false)
})

test('oversized existing JSON is rejected before any missing files are written', async (t) => {
  const root = await fixture(t)
  await mkdir(join(root, '.drifts'))
  await writeFile(
    join(root, '.drifts/project.json'),
    ' '.repeat(1024 * 1024 + 1)
  )
  await assert.rejects(setupProject({ root, ...identity }), {
    code: 'SETUP_CONFLICT'
  })
  assert.deepEqual(await readdir(join(root, '.drifts')), ['project.json'])
})

test('a Git worktree marker file supports root discovery', async (t) => {
  const root = await fixture(t)
  await writeFile(join(root, '.git'), 'gitdir: /unused/worktree/reference\n')
  const nested = join(root, 'src')
  await mkdir(nested)
  const result = spawnSync(
    process.execPath,
    [bin, 'setup', ...identityArgs, '--json', '--dry-run'],
    {
      cwd: nested,
      encoding: 'utf8',
      timeout: 5000
    }
  )
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, result.stderr || result.stdout)
  assert.equal(JSON.parse(result.stdout).root, await realpath(root))
  await absent(join(root, '.drifts'))
})

test('concurrent conflicting setup calls preserve whichever project was exclusively created', async (t) => {
  const root = await fixture(t)
  const outcomes = await Promise.allSettled([
    setupProject({ root, ...identity, name: 'First identity' }),
    setupProject({ root, ...identity, name: 'Second identity' })
  ])
  const successes = outcomes.filter((outcome) => outcome.status === 'fulfilled')
  assert.equal(successes.length, 1)
  const project = await jsonFile(root, '.drifts/project.json')
  assert.equal(project.name, successes[0].value.project.name)
  const rejected = outcomes.find((outcome) => outcome.status === 'rejected')
  assert.ok(
    ['SETUP_CONFLICT', 'SETUP_CONCURRENT_CHANGE'].includes(rejected.reason.code)
  )
  assert.equal((await setupProject({ root })).changed, false)
})

test('existing projects without generator provenance are not rewritten', async (t) => {
  const root = await fixture(t)
  await setupProject({ root, ...identity })
  const project = await jsonFile(root, '.drifts/project.json')
  delete project.generator
  const original = JSON.stringify(project)
  await writeFile(join(root, '.drifts/project.json'), original)
  const result = await setupProject({ root })
  assert.equal(result.changed, false)
  assert.equal(
    await readFile(join(root, '.drifts/project.json'), 'utf8'),
    original
  )
})
