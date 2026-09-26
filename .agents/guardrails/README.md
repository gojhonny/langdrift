# Guardrails

Canonical frontend obligations approved by the owner in the Frontend Standards Extraction cycle. These are the policy sources; the [research record](../../.artifacts/research/frontend-standards-extraction-2026-09-26.md#canonicalization-record) owns provenance, candidate disposition and verification evidence, not a second policy copy.

## Select by scope

| When authoring or reviewing | Read |
| --- | --- |
| React surfaces, frontend modules, app configuration or app documentation | [frontend.md](frontend.md) |
| Next.js application structure, routes, navigation, server boundaries or localization | [nextjs.md](nextjs.md), in addition to frontend |
| Application/shared UI styling, class composition or theme integration | [tailwind.md](tailwind.md) |
| State in an application that has chosen Jotai | [jotai.md](jotai.md) |

Specializations refer to the general frontend document instead of repeating it. Mechanical configuration lives in `biome.json`; Cursor files are only activation pointers.

## Adoption and enforcement

Promotion does not certify that the current tree complies. The remaining Dashboard work is a future validation set; its refactor and removal of `apps/dashboard/AGENT_NOTES.md` still require completion of that cycle. Canonicalization does not start another SDD phase or authorize Git publication.

The installed Biome checks only a subset of these obligations. Named props/body handling, component/hook counts, semantic ownership, async-result handling, statement spacing, routing, CSS necessity and state architecture still require review. Syntactic portions could gain small custom checks later; none are implied to exist now.

The promotion's [verification record](../../.artifacts/research/frontend-standards-extraction-2026-09-26.md#mechanical-verification) distinguishes native coverage, unsupported forms and existing violations. Keep command capabilities distinct: `biome lint` does not run import-organizing assists or JSON formatting.

## Check the configured enforcement

Run from the repository root after installing workspace dependencies:

```sh
node --test .agents/guardrails/biome.test.mjs
node_modules/.bin/biome check biome.json
node_modules/.bin/biome lint . --files-ignore-unknown=true
node_modules/.bin/biome check apps packages/react packages/design-tokens --formatter-enabled=false --linter-enabled=false --files-ignore-unknown=true
```

Use `biome format` without `--write` to check the JSON configuration files in scope. The fixture suite tests the installed configuration in disposable temporary files; it is not a custom policy-checker framework or a new CI/hook integration.

The frontend overrides in `biome.json` define enforcement scope. Import-group matching must stay aligned with the application's actual aliases and first-party package names as developers evolve them; the matcher list is configuration, not an approved alias vocabulary. Biome preserves side-effect and detached-comment boundaries rather than proving that every import in a file belongs to one globally ordered block.
