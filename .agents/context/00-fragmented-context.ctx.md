---
context: fragmented-context
status: current
source_branch: staging
reviewed_at: 2026-09-21
reviewed_sha: 039027341836ba9a98a2753f2bee8348e89bdbdd
sources:
  - AGENTS.md
  - .agents/README.md
---

# Fragmented context

Load [AGENTS.md](../../AGENTS.md) first. Then load only the fragments that match the task. Context describes the current repository. It does not invent requirements, and it does not outrank code, an owner decision, or `AGENTS.md`.

When code and a fragment disagree, inspect the code and update the fragment. Do not copy secrets into context. Do not use `.drifts/` as a source for this set.

Last full refresh: staging `039027341836ba9a98a2753f2bee8348e89bdbdd` on 2026-09-21.

## Catalog

- [01-repository-topology.ctx.md](01-repository-topology.ctx.md) — apps, packages, messaging, CLI, toolchain, and workspace membership.
- [02-product-and-surface-boundaries.ctx.md](02-product-and-surface-boundaries.ctx.md) — Product Vision language and what each surface owns.
- [03-packages-and-contracts.ctx.md](03-packages-and-contracts.ctx.md) — package identities taken from manifests.
- [04-messaging-runtime-and-environment.ctx.md](04-messaging-runtime-and-environment.ctx.md) — the Early Access Go runtime and environment files.
- [05-harness-and-agent-runtime.ctx.md](05-harness-and-agent-runtime.ctx.md) — `AGENTS.md`, `.agents/`, `.cursor/`, and Harness Score.
- [06-verification.ctx.md](06-verification.ctx.md) — commands in CI and what each one proves.
- [07-open-decisions.ctx.md](07-open-decisions.ctx.md) — choices the repository still leaves open.
