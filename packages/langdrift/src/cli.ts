import { LangDriftError } from '@langdrift/sdk'
import { createInterface } from 'node:readline/promises'
import { parseArgs } from 'node:util'
import { setupProject } from './setup.js'
import { SetupError, type SetupOptions, type SetupResult } from './types.js'

const HELP = `LangDrift setup — local project scaffolding

Usage:
  npx @langdrift/setup setup [options]

Options:
  --root <directory>              Existing project directory; otherwise find .git
  --project-id <id>               LangDrift project routing ID
  --account-id <id>               LangDrift account routing ID
  --name <name>                   Project display name
  --github-installation-id <id>   Non-secret GitHub App installation ID
  --github-repository <owner/repo> GitHub repository reference (requires ID)
  --linear / --no-linear          Optional interface configuration only
  --obsidian / --no-obsidian      Optional interface configuration only
  --dry-run                      Validate and show the plan without writing
  --json                         Machine-readable output; never prompt
  --help                         Show this help

Missing identity values are prompted only in an interactive terminal.
Existing valid configuration is reused when corresponding options are omitted.
Only missing protocol files are created. Conflicts require manual review.
This command makes no network requests, creates no account and connects no provider.
`

interface ParsedCommand {
  help: boolean
  json: boolean
  options: SetupOptions
}

function parseCommand(argv: string[]): ParsedCommand {
  let parsed: ReturnType<typeof parseArgs>
  try {
    parsed = parseArgs({
      args: argv,
      allowPositionals: true,
      strict: true,
      options: {
        root: { type: 'string' },
        'project-id': { type: 'string' },
        'account-id': { type: 'string' },
        name: { type: 'string' },
        'github-installation-id': { type: 'string' },
        'github-repository': { type: 'string' },
        linear: { type: 'boolean' },
        'no-linear': { type: 'boolean' },
        obsidian: { type: 'boolean' },
        'no-obsidian': { type: 'boolean' },
        'dry-run': { type: 'boolean' },
        json: { type: 'boolean' },
        help: { type: 'boolean', short: 'h' }
      }
    })
  } catch {
    throw new SetupError(
      'SETUP_ARGUMENT_INVALID',
      'Unknown option or missing option value. Run langdrift setup --help for supported arguments. Secrets are not accepted.'
    )
  }
  const { values, positionals } = parsed
  if (
    positionals.length > 1 ||
    (positionals.length === 1 && positionals[0] !== 'setup')
  ) {
    throw new SetupError(
      'SETUP_ARGUMENT_INVALID',
      'The supported command is setup. Run langdrift setup --help.'
    )
  }
  if (
    (values.linear && values['no-linear']) ||
    (values.obsidian && values['no-obsidian'])
  ) {
    throw new SetupError(
      'SETUP_ARGUMENT_INVALID',
      'Choose either the enabled or disabled flag for each optional integration.'
    )
  }
  const stringValue = (key: string): string | undefined => {
    const value = values[key]
    return typeof value === 'string' ? value : undefined
  }
  return {
    help:
      values.help === true || (positionals.length === 0 && argv.length === 0),
    json: values.json === true,
    options: {
      root: stringValue('root'),
      projectId: stringValue('project-id'),
      accountId: stringValue('account-id'),
      name: stringValue('name'),
      githubInstallationId: stringValue('github-installation-id'),
      githubRepository: stringValue('github-repository'),
      linear: values.linear ? true : values['no-linear'] ? false : undefined,
      obsidian: values.obsidian
        ? true
        : values['no-obsidian']
          ? false
          : undefined,
      dryRun: values['dry-run'] === true
    }
  }
}

async function askForIdentity(
  options: SetupOptions,
  fields: string[]
): Promise<SetupOptions> {
  const input = createInterface({
    input: process.stdin,
    output: process.stderr
  })
  const updated = { ...options }
  const questions = [
    ['projectId', 'Project routing ID: '],
    ['accountId', 'Account routing ID: '],
    ['name', 'Project name: ']
  ] as const
  try {
    for (const [field, question] of questions) {
      if (fields.includes(field)) {
        updated[field] = (await input.question(question)).trim()
      }
    }
  } finally {
    input.close()
  }
  return updated
}

function printResult(result: SetupResult, json: boolean): void {
  const summary = {
    ok: true,
    root: result.root,
    dryRun: result.dryRun,
    changed: result.changed,
    files: result.files
  }
  if (json) {
    process.stdout.write(`${JSON.stringify(summary)}\n`)
    return
  }
  process.stdout.write(
    `${result.dryRun ? 'Setup plan (no files written)' : 'Setup complete'}\n`
  )
  for (const file of result.files) {
    const label =
      file.status === 'create'
        ? result.dryRun
          ? 'Create'
          : 'Created'
        : 'Preserved'
    process.stdout.write(`  ${label}: ${file.path}\n`)
  }
  process.stdout.write(
    'Optional integration settings are local references; no remote connection or upload was made.\n'
  )
}

function printFailure(error: unknown, json: boolean): void {
  const failure =
    error instanceof SetupError
      ? {
          code: error.code,
          message: error.message,
          ...(error.fields.length ? { fields: error.fields } : {}),
          ...(error.files.length ? { files: error.files } : {})
        }
      : error instanceof LangDriftError
        ? {
            code: error.code,
            message:
              'Project input or location is invalid. Check the supplied options and project configuration; use --root when outside a Git repository.',
            fields: [...new Set(error.issues?.map((issue) => issue.path) ?? [])]
          }
        : {
            code: 'SETUP_FAILED',
            message:
              'Setup could not complete. Check the project directory and permissions, then retry.'
          }
  if (json) {
    process.stdout.write(`${JSON.stringify({ ok: false, error: failure })}\n`)
    return
  }
  process.stderr.write(`${failure.code}: ${failure.message}\n`)
  if ('files' in failure && failure.files) {
    for (const file of failure.files) {
      process.stderr.write(
        `  ${file.status}: ${file.path}${file.reason ? ` — ${file.reason}` : ''}\n`
      )
    }
  }
  if ('fields' in failure && failure.fields?.length) {
    process.stderr.write(`  Fields: ${failure.fields.join(', ')}\n`)
  }
}

export async function runCli(
  argv: string[] = process.argv.slice(2)
): Promise<number> {
  let json = argv.includes('--json')
  try {
    const parsed = parseCommand(argv)
    json = parsed.json
    if (parsed.help) {
      process.stdout.write(
        json ? `${JSON.stringify({ ok: true, help: HELP })}\n` : HELP
      )
      return 0
    }
    let result: SetupResult
    try {
      result = await setupProject(parsed.options)
    } catch (error) {
      if (
        error instanceof SetupError &&
        error.code === 'SETUP_ARGUMENT_MISSING' &&
        process.stdin.isTTY &&
        process.stderr.isTTY &&
        !json
      ) {
        const options = await askForIdentity(parsed.options, error.fields)
        result = await setupProject(options)
      } else {
        throw error
      }
    }
    printResult(result, json)
    return 0
  } catch (error) {
    printFailure(error, json)
    return 1
  }
}
