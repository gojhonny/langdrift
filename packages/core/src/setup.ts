import {
  findRepositoryRoot,
  resolveSafePath,
  readProjectFile,
  SCHEMA_VERSION,
  validateProject,
  type Project
} from '@langdrift/sdk'
import { constants } from 'node:fs'
import {
  lstat,
  mkdir,
  open,
  realpath,
  stat,
  type FileHandle
} from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { createProtocolTemplate, PROJECT_PATH } from './template.js'
import { generator } from './version.js'
import {
  SetupError,
  type SetupFile,
  type SetupOptions,
  type SetupPlan,
  type SetupResult
} from './types.js'

function hasCode(error: unknown, code: string): boolean {
  return error instanceof Error && 'code' in error && error.code === code
}

async function locateRoot(explicitRoot?: string): Promise<string> {
  const candidate = explicitRoot
    ? resolve(explicitRoot)
    : await findRepositoryRoot()
  try {
    const root = await realpath(candidate)
    if (!(await stat(root)).isDirectory()) throw new Error('Not a directory')
    return root
  } catch {
    throw new SetupError(
      'ROOT_INVALID',
      'Choose an existing project directory with --root.'
    )
  }
}

// Reject even in-root symlinks for package-managed paths. This avoids writing
// through an alias and preserves customer-owned links for manual inspection.
async function managedPath(
  root: string,
  relativePath: string
): Promise<string> {
  const safePath = await resolveSafePath(root, relativePath)
  const segments = relativePath.split('/')
  let current = root
  for (let index = 0; index < segments.length; index += 1) {
    current = join(current, segments[index])
    try {
      const entry = await lstat(current)
      if (entry.isSymbolicLink()) {
        throw new SetupError(
          'SETUP_PATH_CONFLICT',
          'A managed path is a symbolic link; inspect it manually.'
        )
      }
      if (index < segments.length - 1 && !entry.isDirectory()) {
        throw new SetupError(
          'SETUP_PATH_CONFLICT',
          'A required parent path is not a directory.'
        )
      }
    } catch (error) {
      if (hasCode(error, 'ENOENT')) break
      throw error
    }
  }
  return safePath
}

interface InspectedFile {
  exists: boolean
  value?: unknown
  conflict?: string
}

async function inspectJson(
  root: string,
  relativePath: string
): Promise<InspectedFile> {
  try {
    const path = await managedPath(root, relativePath)
    const entry = await lstat(path)
    if (!entry.isFile()) {
      return { exists: true, conflict: 'Expected a regular JSON file.' }
    }
    const content = await readProjectFile(root, relativePath)
    try {
      return { exists: true, value: JSON.parse(content) }
    } catch {
      return { exists: true, conflict: 'Existing file is not valid JSON.' }
    }
  } catch (error) {
    if (hasCode(error, 'ENOENT')) return { exists: false }
    return {
      exists: true,
      conflict:
        error instanceof SetupError
          ? error.message
          : 'Cannot safely inspect this path. Check its type, links and permissions.'
    }
  }
}

function projectFromOptions(
  options: SetupOptions,
  existing?: Project
): Project {
  const identity = {
    projectId: options.projectId ?? existing?.id,
    accountId: options.accountId ?? existing?.account_id,
    name: options.name ?? existing?.name
  }
  const missing = Object.entries(identity)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key)
  if (missing.length > 0) {
    throw new SetupError(
      'SETUP_ARGUMENT_MISSING',
      'Provide --project-id, --account-id and --name, or run setup in an interactive terminal.',
      [],
      missing
    )
  }

  const installationId =
    options.githubInstallationId ??
    existing?.integrations.github.installation_id
  const repository =
    options.githubRepository ?? existing?.integrations.github.repository
  const githubRequested =
    options.githubInstallationId !== undefined ||
    options.githubRepository !== undefined
  if (
    githubRequested &&
    (!installationId ||
      !/^\d+$/.test(installationId) ||
      !repository ||
      !/^[A-Za-z0-9][A-Za-z0-9_.-]*\/[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(
        repository
      ))
  ) {
    throw new SetupError(
      'SETUP_ARGUMENT_INVALID',
      'GitHub requires --github-installation-id with a numeric ID and --github-repository in owner/repository form. Do not provide tokens or URLs.'
    )
  }

  return validateProject({
    ...existing,
    ...(existing ? {} : { generator }),
    schema_version: SCHEMA_VERSION,
    id: identity.projectId,
    account_id: identity.accountId,
    name: identity.name,
    integrations: {
      ...existing?.integrations,
      langdrift: existing?.integrations.langdrift ?? { enabled: true },
      github: {
        ...(existing?.integrations.github ?? { enabled: false }),
        ...(githubRequested
          ? {
              enabled: true,
              installation_id: installationId,
              repository
            }
          : {})
      },
      linear: {
        ...existing?.integrations.linear,
        enabled:
          options.linear ?? existing?.integrations.linear.enabled ?? false
      },
      obsidian: {
        ...existing?.integrations.obsidian,
        enabled:
          options.obsidian ?? existing?.integrations.obsidian.enabled ?? false
      }
    }
  })
}

function filePlan(
  path: string,
  inspected: InspectedFile,
  expected: unknown
): SetupFile {
  if (inspected.conflict) {
    return { path, status: 'conflict', reason: inspected.conflict }
  }
  if (!inspected.exists) return { path, status: 'create' }
  if (isDeepStrictEqual(inspected.value, expected)) {
    return { path, status: 'preserve' }
  }
  return {
    path,
    status: 'conflict',
    reason:
      'Existing content differs from the requested configuration or bundled schema. No automatic migration is available.'
  }
}

export async function planSetup(
  options: SetupOptions = {}
): Promise<SetupPlan> {
  const root = await locateRoot(options.root)
  const files: SetupFile[] = []
  try {
    const legacy = await managedPath(root, '.drifts/execution')
    await lstat(legacy)
    files.push({
      path: '.drifts/execution',
      status: 'conflict',
      reason:
        'Legacy execution layout detected. This version uses loop and does not migrate or rename existing data.'
    })
  } catch (error) {
    if (!hasCode(error, 'ENOENT')) {
      files.push({
        path: '.drifts/execution',
        status: 'conflict',
        reason: 'Cannot safely inspect the legacy execution path.'
      })
    }
  }

  const inspected = await inspectJson(root, PROJECT_PATH)
  let existing: Project | undefined
  if (inspected.exists && !inspected.conflict) {
    try {
      existing = validateProject(inspected.value)
    } catch {
      inspected.conflict =
        'Existing project configuration is invalid or has an unsupported schema version. No automatic migration is available.'
    }
  }

  let project: Project | null = null
  let inputError: unknown
  if (!inspected.conflict) {
    try {
      project = projectFromOptions(options, existing)
    } catch (error) {
      inputError = error
    }
  }
  for (const [path, content] of createProtocolTemplate(
    project ?? existing ?? null
  )) {
    const current =
      path === PROJECT_PATH ? inspected : await inspectJson(root, path)
    files.push(filePlan(path, current, content))
  }
  if (inputError && !files.some((file) => file.status === 'conflict')) {
    throw inputError
  }
  return { root, project, files }
}

async function writeMissingFile(
  root: string,
  relativePath: string,
  content: unknown
): Promise<boolean> {
  let destination = await managedPath(root, relativePath)
  await mkdir(dirname(destination), { recursive: true })
  destination = await managedPath(root, relativePath)
  let handle: FileHandle
  try {
    handle = await open(
      destination,
      constants.O_CREAT |
        constants.O_EXCL |
        constants.O_WRONLY |
        constants.O_NOFOLLOW,
      0o644
    )
  } catch (error) {
    if (hasCode(error, 'EEXIST')) {
      const current = await inspectJson(root, relativePath)
      if (!current.conflict && isDeepStrictEqual(current.value, content)) {
        return false
      }
      throw new SetupError(
        'SETUP_CONCURRENT_CHANGE',
        'A destination changed after preflight. Existing content was preserved; rerun setup to inspect the new plan.'
      )
    }
    throw error
  }
  try {
    await handle.writeFile(`${JSON.stringify(content, null, 2)}\n`, 'utf8')
    await handle.sync()
  } finally {
    await handle.close()
  }
  return true
}

export async function setupProject(
  options: SetupOptions = {}
): Promise<SetupResult> {
  const plan = await planSetup(options)
  if (!plan.project || plan.files.some((file) => file.status === 'conflict')) {
    throw new SetupError(
      'SETUP_CONFLICT',
      'Setup found conflicting files. Nothing was written; inspect the per-file plan before making changes.',
      plan.files
    )
  }
  if (options.dryRun) {
    return { ...plan, project: plan.project, dryRun: true, changed: false }
  }

  const template = createProtocolTemplate(plan.project)
  let changed = false
  try {
    for (const file of plan.files) {
      if (file.status === 'create') {
        changed =
          (await writeMissingFile(
            plan.root,
            file.path,
            template.get(file.path)
          )) || changed
      }
    }
  } catch (error) {
    if (error instanceof SetupError) throw error
    throw new SetupError(
      'SETUP_WRITE_FAILED',
      'Setup could not finish writing. Existing files were not overwritten; inspect the destination and rerun setup to repair missing files.',
      plan.files
    )
  }
  return { ...plan, project: plan.project, dryRun: false, changed }
}
