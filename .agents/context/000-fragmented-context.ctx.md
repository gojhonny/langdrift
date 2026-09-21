---
context: fragmented-context
status: current
source_branch: main
reviewed_at: 2026-09-21
reviewed_sha: 176af22ba38b2b5167b1804d32e81d520c676eeb
sources:
  - AGENTS.md
  - .agents/README.md
---

# Fragmented context

Load [AGENTS.md](../../AGENTS.md) first. Then load only the fragments that match the task. Context describes the current repository. It does not invent requirements, and it does not outrank code, an owner decision, or `AGENTS.md`.

When code and a fragment disagree, inspect the code and update the fragment. Do not copy secrets into context. Do not use `.drifts/` as a source for this set.

Last full refresh: main `176af22ba38b2b5167b1804d32e81d520c676eeb` on 2026-09-21.

## Catalog

- [010-repository-topology.ctx.md](010-repository-topology.ctx.md) — apps, packages, messaging, CLI, toolchain, and workspace membership.
- [020-product-and-surface-boundaries.ctx.md](020-product-and-surface-boundaries.ctx.md) — Product Vision language and what each surface owns.
- [030-packages-and-contracts.ctx.md](030-packages-and-contracts.ctx.md) — package identities taken from manifests.
- [040-messaging-runtime-and-environment.ctx.md](040-messaging-runtime-and-environment.ctx.md) — the Early Access Go runtime and environment files.
- [050-harness-and-agent-runtime.ctx.md](050-harness-and-agent-runtime.ctx.md) — `AGENTS.md`, `.agents/`, `.cursor/`, and Harness Score.
- [060-verification.ctx.md](060-verification.ctx.md) — commands in CI and what each one proves.
- [070-open-decisions.ctx.md](070-open-decisions.ctx.md) — choices the repository still leaves open.
