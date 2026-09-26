# Frontend Structure — Ticket 0009 Audit

Contract: spec 0003 v1; prerequisite Ticket 0009 only.
Review: `.audits/reviews/frontend-structure-ticket-0009-2026-09-26.md`.
Base/HEAD: `1cdede8a39f56c62a57b63e9933c85df5e7f8850`; working status
and exact source hashes are retained in that Review and candidate manifest.

## Snapshot and baseline

- Origin source manifest SHA-256: `d060099961bc28494cf872eda7020f2f7d6b8bb475112af861720e22e1d37a0f`.
- Origin archive SHA-256: `084713b1e6ba404536435d66a398379f7158a932b10e67054d0b88af7c2f7d4e`.
- Dashboard pre-extraction comparison manifest: `.audits/runs/dashboard-structure-baseline/manifest.json`, SHA `1d1eb7483fc2a444f4e918667305fcd6bc33689847075af2a4e4a5fed9f557b6`.
- Website accepted capture: `.audits/runs/website-structure-baseline-v7/manifest.json`, SHA `3c9db9a188150ae6487f987feb3e9f440e4080f55abc8e0b325dd7cde69fc226`.
- Website final default comparison: `.audits/runs/website-structure-ticket9-final/manifest.json`, SHA `2f323a5f489265aa327f8d37246ddf845766b76042225a42df87fb6d6eea9370`, build `39oUOORfxxnpzvlV_WvGP`.

The origin includes completed uncommitted N12. All archived production paths are
unchanged; only Website package metadata and lockfile gained test dependencies.
No environment file is archived. Accepted screenshots remain immutable.
Website v7 capture plus three comparisons pass; source/baseline integrity flags
are true. Runtime: Node26.9.0, Chromium153.0.8010.12, Playwright1.63.0,
darwin/arm64, DPR1, UTC, en-US; exact software-rendering flags in manifest.

## Commands and actual outcomes

Logs live in `.audits/runs/frontend-structure-origin/` unless named otherwise.

| Command / harness | Result / exit | Observation |
| --- | --- | --- |
| `./cli/drift doctor` | passed / 0 | required tools/workspaces available |
| `pnpm lint` | **failed / 1** | 18 traversal errors + 1 info, baseline external debt |
| `pnpm typecheck` | passed / 0 | repository typecheck |
| `pnpm build` initial | **failed / 1** | simultaneous Website build lock; orchestration failure |
| `pnpm build` sequential retry | passed / 0 | 9 successful tasks |
| `pnpm test:web-quality` | passed / 0 | 7 files, 31 tests |
| `pnpm coverage:early-access` | passed / 0 | 42 tests; statements95.12%, branches90.52%, functions88.23%, lines95.72% |
| `./cli/drift test early-access integration` | passed / 0 | actual Docker topology, durable chain, dedup/concurrency/canonical/provider, outages and restarts; coverage retained in early-access.mplLzA/integration |
| Dashboard `test:browser` | passed / 0 | 35 tests against unchanged original N12 comparator |
| Website `test:browser:baseline` v7 | passed / 0 | 11 tests, 26 reference images |
| Website `test:browser` v7, repeat, final defaults | passed / 0 each | 11 tests each; all 26 comparisons; locale/header/demo/inspector/chart/URL/focus behavior |
| `pnpm exec biome check apps/website/e2e apps/website/package.json --files-ignore-unknown=true` | passed / 0 | 5 files, no fixes |
| `node --test .agents/guardrails/biome.test.mjs` | passed / 0 | 12 enforcement fixtures |
| `git diff --check` | passed / 0 | whitespace |
| tampered disposable baseline manifest | expected rejection / 1 | incorrect image identity blocks before browser execution |

Failed development captures/comparisons remain failed, retained and classified in
the execution research record. They exposed harness assumptions/rasterization,
not production regressions. Integer clips, font readiness and software rendering
were established before extraction, without changing tolerance0.15/20.
The successful v6 first comparison did not erase its failed repeat.

## External lint provenance

The current-cycle origin run independently reproduces the 18 errors already
catalogued in `dashboard-tailwind-external-lint-2026-09-26.md`: Docs8, SSO7,
shared React3, all noRestrictedImports. A byte-hash comparison against the actual
origin manifest finds only Website package.json and lockfile changed. Thus the
affected files and Biome/root command are unchanged, and this harness neither
caused nor worsened those failures. They remain **failed**, nonblocking under
spec0003 AC-12; they are not implementation scope.

## Acceptance boundary

AC-01 and prerequisite characterization contributions to AC-08/09/14 are satisfied.
AC-10–12 baseline results/environment availability are recorded, not final-cycle
completion. The full Early Access browser harness has **not run in this ticket**;
it remains required in final Ticket0013, not waived or replaced by integration
alone. Structural AC-02–07 and final preservation/refinement remain later tickets.
Ticket0009 can be gates-complete; this does not close the cycle.
