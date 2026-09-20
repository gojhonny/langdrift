# Core SDK implementation — September 20, 2026

Branch: `codex/core-sdk-setup`, based on `staging` after website PR #24.

## Delivered contract

Working npm names: `@langdrift/sdk@0.1.0` and `@langdrift/setup@0.1.0`. These are unpublished candidates; ownership of the npm scope has not been verified. The unscoped `langdrift` name belongs to another project, so the intended public command is `npx @langdrift/setup setup` after publication. Packages use linked initial versions, ESM, TypeScript declarations and Node 24+.

Protocol version 1 uses JSON Schema Draft 2020-12 and the pillars Vision → Loop → Evidence. Supported artifact types: research, prd, context, triage, design-document, spec, ticket, adr, audit, record and drift. Each schema has explicit type/version, reusable definitions and `x-langdrift` source/reference/resource directives. Standalone schema validation checks structure; the SDK additionally checks safe JSON input, impact arithmetic and evidence membership.

The source/package trees and release procedure are in [packages-release.md](packages-release.md). SDK tarballs contain `dist/*.js`, `dist/*.d.ts`, package metadata, README and changelog. Setup tarballs contain the same classes of files, including `dist/bin.js` and compiled template/schema access. No source fixtures, consumer configs, secrets or repository harness folders are packaged.

New consumer setup produces only:

```text
.drifts/
  project.json
  vision/schema.json
  loop/schema.json
  evidence/schema.json
```

Artifact folders are materialized when documents are authored. Setup accepts project/account routing IDs and a display name, prompting for missing identity only in a TTY. Optional GitHub flags store installation/repository identity; Linear/Obsidian flags configure future interfaces. JSON output never prompts. Setup plans all four files before writing, preserves existing matching content and Markdown, repairs missing files, and refuses conflicts/unknown versions/legacy execution layouts. Exclusive writes avoid replacing files created concurrently; an interrupted write sequence is not a multi-file transaction.

Example generated project:

```json
{
  "schema_version": 1,
  "id": "project_fixture",
  "account_id": "account_fixture",
  "name": "Fixture Product",
  "integrations": {
    "langdrift": { "enabled": true },
    "github": { "enabled": false },
    "linear": { "enabled": false },
    "obsidian": { "enabled": false }
  },
  "generator": { "name": "@langdrift/setup", "version": "0.1.0" }
}
```

Only `env:NAME` credential references are supported. Credentials are resolved at explicit send time, passed separately to the injected transport, and never written back to project files. IDs route payloads but do not authorize them. Installation and setup perform no upload.

## Verified results

Executed with Node 24.21.0 and pnpm 10.32.1:

| Command | Result |
| --- | --- |
| `pnpm install --ignore-scripts` | Installed workspace dependencies without running repository scaffold lifecycle hooks |
| `pnpm lint` | Passed, 230 files checked |
| `pnpm typecheck` | Passed, 9 tasks including dependency build |
| `pnpm build` | Passed, all 8 package/application builds |
| `pnpm test` | Passed, 48 SDK tests and 21 setup tests |
| `./scripts/verify-packages.sh` | Both actual tarballs passed contents allowlist, clean consumer install, executable CLI, installed declarations, repeat setup and full local payload flow |
| `git diff --check` | Passed |

Focused tests cover all 11 schema types, required/unknown/wrong fields, future versions, model output/provenance, exact Markdown body preservation, CRLF/Unicode, bounded reads/JSON complexity, traversal/symlinks/secrets exclusion, reference cycles/missing IDs, non-colliding reference keys, stable GitHub event identity across repository rename, payload routing and out-of-band credentials, remote error redaction, setup idempotency/repair/conflicts/concurrency and non-TTY behavior.

The packed consumer exercised setup → authored PRD → discovery/parse → validation → reference resolution → payload → authenticated mock transport. A separate SDK integration test exercised a merged GitHub PR → normalized Record → explicit Spec/Ticket references → Evidence payload. These are local fixtures, not production ingestion.

## Deliberately unresolved

GitHub support is a deterministic mapper for supplied webhook/API facts; it does not fetch GitHub or install an App. MCP support is a typed validated envelope and injected transport contract; no server, persistence or destination endpoint exists here. Linear and Obsidian have extension interfaces only. Backend authorization, tenant storage, project pairing, Vision Target registration, scheduling/synchronization and Product Vision scoring/reasoning are still separate work.

No npm package was published and no release tag was created. Registry ownership, licensing and release authorization remain prerequisites for publication. Repository `.agents`, `.drifts` and `.audits` were not inspected or changed, and scaffold audits/`drift doctor` were not run, following the owner's explicit restructuring constraint. Legacy `.drifts/execution` is detected only in consumer setup; no automatic history migration is claimed. Internal dogfooding used temporary consumer projects rather than the protected repository scaffold.
