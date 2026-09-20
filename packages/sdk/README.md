# @langdrift/sdk

Deterministic **Vision → Loop → Evidence** protocol for Node.js 24+. ESM and TypeScript declarations; no React, backend or LLM dependency. Version 0.1.0 supports protocol/schema version 1. This is an unpublished release candidate; scope ownership still needs verification before release.

```ts
import { loadProject, discoverArtifacts, resolveReferences, createPayload } from '@langdrift/sdk'

const root = '/absolute/customer/repository'
const project = await loadProject(root)
const artifacts = await discoverArtifacts(root)
const resolution = await resolveReferences(root, artifacts, [
  { type: 'vision-target', id: 'VT-001' } // explicitly registered external identity
])
if (resolution.issues.length) throw new Error('Resolve artifact references before sending')
const payload = createPayload(project, artifacts[0])
```

`loadProject`, `discoverArtifacts` and `resolveReferences` are asynchronous filesystem operations. `parseArtifact(text, relativePath)`, validators, `createRecord`, `createDrift` and `createPayload` are synchronous. Validators throw `LangDriftError` with `code`, a safe message and field-specific `issues: {path, message}[]`; they do not coerce, strip fields, fill missing facts or migrate unknown versions.

For diagnostics, pass failures to `reportError(error, logger)` with a `Logger` implementing `write(diagnostic)`. The result contains an error code, a generic message and validation issues; unknown exception bodies and stacks are omitted. The SDK has no implicit console logger or persistent log store. Applications can serialize these diagnostics as JSON or render their field paths.

## Protocol

All schemas use JSON Schema Draft 2020-12, reusable definitions and explicit `schema_version: 1`. Exported from `@langdrift/sdk/schema`: `schemas`, `projectSchema`, `pillarSchemas`, `SCHEMA_VERSION`. Each pillar schema is self-contained; serialize it to JSON to use it with another compliant validator. `x-langdrift` contains document type, source glob, Markdown namespace, reference fields and MCP resource name. Those directives describe interpretation; they are separate from standard JSON Schema assertions.

| Pillar | Types |
| --- | --- |
| Vision | `research`, `prd`, `context` |
| Loop | `triage`, `design-document`, `spec`, `ticket` |
| Evidence | `adr`, `audit`, `record`, `drift` |

The nine document families use `langdrift` YAML frontmatter:

```md
---
langdrift:
  type: prd
  schema_version: 1
  id: PRD-001
  title: Product Vision Dashboard
  owners: [user_42]
  research: [RES-002]
  vision_targets: [VT-001]
---

# Product Vision Dashboard

Rich context remains Markdown.
```

Markdown envelope payloads are `{ metadata, body }`, so the metadata remains independently schema-valid. Record and Drift envelope payloads are the validated JSON event itself, with no extra Markdown fields.

IDs are nonempty strings without whitespace. `owners` are identifiers, not embedded profiles. Optional metadata includes descriptions, status, questions, tags, timestamps and explicit relationships. Unknown metadata is rejected. Markdown bodies retain Unicode and original line endings and are never executed. YAML custom tags, aliases and duplicate keys are rejected. No headings are used to infer identity.

`record` and `drift` use JSON envelopes. Place documents in `.drifts/<pillar>/<type>/**/*.md`, Records and Drifts in corresponding `**/*.json`. Audit documents can live under `evidence/audit/runs` or `reports`; no permanent PR/commit folder is required. Schema source globs are package-owned in v1; arbitrary custom globs are not supported. Discovery is sorted, limited to 1 MiB per file and defaults to 1,000 files and 1,000 directories. Options can lower/raise those count limits. It never crawls the whole repository, reads hidden secrets or follows symlinks. Local project content must not be modified concurrently by an untrusted process while reading or setting up.

`resolveReferences` indexes explicit `(type,id)` identities, checks local paths, reports missing targets and cycles, and rejects duplicate identities. External references require `integration` plus `external_id`; known backend identities can be supplied explicitly as the third argument. No remote lookups occur. Resolution is a separate gate: creating/sending one payload cannot prove that its references exist remotely.

## Records and Drift

```ts
import { createRecord, createDrift } from '@langdrift/sdk'

const record = createRecord({
  id: 'REC-001', kind: 'github.pull_request.merged',
  occurred_at: '2026-09-19T18:00:00Z',
  source: { integration: 'github', repository: 'org/product', external_id: '481' },
  actors: [{ type: 'human', external_id: 'github:12345' }],
  references: [{ type: 'spec', id: 'SPEC-001' }], data: { number: 481 }
})
const drift = createDrift({
  id: 'DRIFT-001', vision_target_id: 'VT-001', state: 'expected',
  impact: { unit: 'score_points', before: 10, delta: 2, after: 12 },
  actors: [{ type: 'human', id: 'user_42' }],
  references: [{ type: 'record', id: record.id }],
  reasoning: { method: 'human', evidence_refs: [record.id], schema_version: 1 }
})
```

These functions add only the envelope type/version and validate caller-supplied facts. They never generate timestamps or scores. Record kinds are extensible and `data` is JSON-compatible source detail. Drift states are `expected` and `unexpected`; units are `percentage_points`, `ratio` and `score_points`. Before/delta/after must be consistent. LLM reasoning requires model identity and linked evidence IDs. Unsupported model output is rejected. Product Vision formula, reasoning engine, entity persistence and identity authorization are unresolved backend responsibilities.

## Integrations and transport

`recordFromGitHubPullRequest` in `@langdrift/sdk/integrations` converts a merged-PR webhook/API-shaped fixture into a deterministic Record. It maps numeric identity, actors, branches, timestamps, labels and requested reviewers, plus optional explicit commit/file facts. It does not extract links from prose, fetch APIs, receive webhooks or authenticate a GitHub App. Supply explicit Spec/Ticket references separately. `RecordSourceAdapter` is an ingestion-only extension interface; Linear and Obsidian adapters are not implemented.

```ts
import { sendPayload } from '@langdrift/sdk/mcp'

await sendPayload(project, record, {
  async send(envelope, { authorization }) {
    // Your authenticated MCP/backend client goes here.
    // Account/project IDs route the payload; they do not authorize it.
    return { correlationId: 'your-request-id' }
  }
}, { credentialRef: 'env:LANGDRIFT_TOKEN' })
```

The example intentionally supplies a transport interface, not an existing MCP server. The SDK validates before invoking it and passes the runtime credential separately from the envelope. No endpoint/topology, HTTP client, persistence, batching, automatic retry, background queue or automatic upload is provided. `createPayload(project, artifactOrEvent, source?)` includes routing, version, resource/id, source provenance, explicit references and validated payload. Drift requires explicit source provenance. `TransportError(status)` distinguishes rejected authorization (401/403), rejected payload (other 4xx) and unavailable transport. Raw remote errors are not forwarded. Do not put secrets in document bodies or Record data; these are intended payload content.

## Development

```sh
pnpm --filter @langdrift/sdk build
./cli/drift verify packages
```
