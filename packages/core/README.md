# @langdrift/setup

Explicit, local setup for the LangDrift portable project protocol. Requires Node.js 24. The package exposes the `langdrift` binary and uses `@langdrift/sdk` for schemas, validation and safe path handling.

```sh
npx @langdrift/setup setup \
  --root /path/to/product \
  --project-id proj_example \
  --account-id acc_example \
  --name 'Example Product'
```

This is the intended command once the package is published. Building or packing the workspace does not publish it. For a locally installed package, run `langdrift setup` through the project's package manager.

Omit `--root` to discover the nearest ancestor with a `.git` directory or worktree marker. In a directory outside a Git repository, provide an explicit existing `--root`. Missing project ID, account ID and name are prompted only when stdin and stderr are interactive terminals. Noninteractive runs and `--json` require missing values as flags and fail promptly with instructions.

Project and account IDs are routing metadata. Setup does not create an account, authenticate those IDs, or pair them with a remote service.

## Generated files

The versioned scaffold is a deterministic package-owned function using the SDK's bundled schemas:

```text
.drifts/
  project.json
  vision/schema.json
  loop/schema.json
  evidence/schema.json
```

Create artifact directories as needed when adding documents; setup does not generate empty artifact trees, agent harnesses, placeholder integrations or customer Markdown. It does not read a template from the LangDrift repository. Each pillar schema bundles the definitions needed for its supported artifact types.

New projects record the setup package name/version as generator provenance, use protocol version `1`, enable the LangDrift integration configuration, and leave GitHub, Linear and Obsidian configurations disabled. An enabled setting represents local configuration only. No install lifecycle script performs setup, and setup makes no network requests.

## Preview and repeat safely

```sh
langdrift setup --root /path/to/product --dry-run --json
langdrift setup --root /path/to/product
```

For a new project, also provide its identity flags when previewing. For an existing valid project, omitted flags reuse the stored configuration. Repeated setup preserves existing JSON bytes, formatting and timestamps, and leaves all customer Markdown unchanged. Missing required schemas are recreated.

Before writing, setup inspects every managed file and produces a per-file `create`, `preserve` or `conflict` plan. JSON equality ignores object key order and whitespace. A changed project configuration, incompatible schema, malformed JSON, unsupported protocol version, non-file destination or symlink produces a conflict. Nothing is written when preflight has a conflict, including when other required files are missing. Existing files are never overwritten.

The legacy `.drifts/execution` layout is refused with a manual migration message. This release does not migrate, rename or remove old layouts. It does not modify standalone audit or agent harness directories.

Writes use exclusive file creation. If another process changes a destination after preflight, setup preserves that destination and fails when it cannot confirm matching content. Files already created before an I/O or concurrent-change failure can remain; this is not a filesystem transaction. Rerun setup to inspect the resulting plan and repair missing files. Invalid or truncated existing files require manual review.

## Optional integration references

```sh
langdrift setup \
  --root /path/to/product \
  --project-id proj_example \
  --account-id acc_example \
  --name 'Example Product' \
  --github-installation-id 12345 \
  --github-repository owner/repository \
  --linear \
  --obsidian
```

GitHub flags must supply both a numeric installation ID and an `owner/repository` reference, or reuse the missing counterpart from an existing valid configuration. URLs and tokens are not accepted. This stores non-secret references; it does not install a GitHub App, authorize repository access or ingest events.

`--linear`, `--no-linear`, `--obsidian` and `--no-obsidian` control optional interface configuration. Neither provider is connected by this command. No credential is requested or stored. Changing these settings on an existing project is a configuration conflict; setup does not silently rewrite them.

## Programmatic API

```ts
import { planSetup, setupProject, SetupError } from '@langdrift/setup'

const options = {
  root: '/path/to/product',
  projectId: 'proj_example',
  accountId: 'acc_example',
  name: 'Example Product'
}

const plan = await planSetup(options)
// plan.files contains each planned operation, including conflicts.
const result = await setupProject({ ...options, dryRun: true })
// result.changed is false for dry runs and unchanged reruns.
```

`SetupOptions` also accepts `githubInstallationId`, `githubRepository`, `linear`, `obsidian` and `dryRun`. `planSetup` reads and validates without writing. It can return `project: null` with a conflict plan when the stored project cannot be validated. Missing arguments and invalid new project input throw validation errors.

`setupProject` rejects conflicting plans with `SetupError`, which exposes `code`, `files` and `fields`. It returns `{ root, project, files, dryRun, changed }` on success. The returned files describe the preflight plan; `create` entries were created during a normal successful run or would be created during a dry run.

CLI JSON output omits project configuration and prints one object with `ok`, the result summary or a structured error. Human output lists each file operation. Diagnostics omit raw option values, provider credentials and configuration dumps. Run `langdrift setup --help` for all flags.

## Limits

No live provider, backend persistence, MCP connection, npm publication or remote project pairing is established by this package. These require separately configured and implemented runtime integrations.
