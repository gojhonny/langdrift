# Core packages: build, verification and release

The public setup and deterministic SDK are separate from the repository's POSIX `cli/drift`. The core source is package-owned; repository `.agents`, `.drifts` and `.audits` were not inspected, migrated or used as templates for this implementation.

Working package names are `@langdrift/setup` and `@langdrift/sdk`, both initially `0.1.0`. The unscoped npm name `langdrift` is already another project's package (registry checked September 20, 2026); never publish to it or recommend `npx langdrift` for this code. Scope ownership/authentication must be confirmed before publication. These artifacts have not been published.

## Source and package contents

```text
packages/sdk/
  src/{types,errors,diagnostics,schema,validation,paths,project,artifacts,references,records,mcp,integrations,index}.ts
  tests/*.test.mjs
  README.md, CHANGELOG.md, package.json, tsconfig.json
packages/langdrift/
  src/                  Setup plan, template, CLI and exported entry point
  tests/*.test.mjs
  README.md, CHANGELOG.md, package.json, tsconfig.json
```

Both tarballs allow only compiled `dist` JavaScript/declarations, package metadata, README and changelog. Schemas/templates are compiled from package source, so there is no runtime dependency on repository scaffolds. ESM only, Node 24+. The setup tarball has an executable `langdrift` bin and depends on the SDK. It has no postinstall/prepare hook.

## Verification

Use Node 24 and pnpm 10.32.1:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm lint
pnpm typecheck
pnpm build
pnpm test
./scripts/verify-packages.sh
```

The last command builds and packs both packages, rejects unexpected archive paths, installs actual tarballs into a new temporary consumer, checks installation has no setup side effect, runs the public bin twice, typechecks the installed public declarations, and exercises Markdown → schema → references → normalized envelope → authenticated mock transport through installed exports. Temporary consumer state is removed afterward. No real credentials or external destination are used. Existing scaffold audits and `drift doctor` are deliberately excluded while those repository directories are being restructured.

## Release procedure

Use linked versions for this first pair: update both manifests and changelogs together. Package version and protocol `schema_version` are independent. Keep schema version 1 until deliberately introducing a protocol change with migration guidance. `workspace:^` becomes the normal SDK semver dependency in the packed setup manifest.

1. Verify ownership of the chosen npm scope, release authorization and package licensing. The initial implementation does not select a new license on the owner's behalf.
2. Run the verification above from a clean checkout. Inspect `pnpm --filter @langdrift/sdk pack` and `pnpm --filter @langdrift/setup pack` outputs before release. Never include consumer configs, credentials or fixtures.
3. Create the release commit and a version tag such as `packages-v0.1.0` only for the approved release.
4. Publish the verified SDK tarball first with `npm publish <sdk.tgz> --access public --tag latest`, then the setup tarball. Reuse the same inspected artifacts; do not rebuild between inspection and publication. Use registry authentication from the release environment. If using supported trusted CI, enable npm provenance there; local verification does not claim provenance.
5. Verify registry versions/exports and install from the registry in a clean consumer. Record actual publication/tag results in the changelogs.

For prereleases, choose explicit versions and use `--tag next` or another intentional prerelease tag. A failed or partial publish must be reported accurately, not hidden behind a release tag.

## Migration and backend boundaries

Setup generates only `.drifts/project.json` plus `vision/schema.json`, `loop/schema.json` and `evidence/schema.json`. Artifact directories are created as content is authored. Repeated setup preserves matching files and repairs missing required files. Any differing schema/config, unsupported version, symlink or legacy `execution` layout is a preflight conflict; no Markdown is overwritten and no history is renamed/deleted.

Existing `.audits` and repository `.drifts` data require a separately reviewed migration. The package does not inspect `.audits`; move chosen historical reports under Evidence only after their ownership and schema are known. There is no automatic migration for historical data yet.

GitHub is a fixture/API-data mapper, not live ingestion. Linear/Obsidian are extension interfaces. MCP is a validated envelope plus injected authenticated transport, not a deployed backend or MCP persistence server. Backend routing/authentication, tenant persistence, source syncing, Vision Target registration and Product Vision scoring remain outside this implementation.
