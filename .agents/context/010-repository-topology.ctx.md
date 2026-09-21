---
context: repository-topology
status: current
source_branch: main
reviewed_at: 2026-09-21
sources:
  - package.json
  - pnpm-workspace.yaml
  - go.mod
  - apps/website/package.json
  - apps/dashboard/package.json
  - apps/sso/package.json
  - apps/mobile/package.json
  - apps/docs/package.json
---

# Repository topology

Workspace membership is a pnpm tooling boundary. It does not decide product ownership. The patterns in `pnpm-workspace.yaml` are `apps/*`, `packages/*`, and `messaging/*`.

The root package requires Node `>=24` and pins `pnpm@10.32.1`. The Go module is `github.com/gojhonny/langdrift` at Go 1.27.1.

## Apps

| Directory | Package name | Dev port |
| --- | --- | --- |
| `apps/website` | `website` | 3000 |
| `apps/dashboard` | `dashboard` | 3001 |
| `apps/sso` | `sso` | 3002 |
| `apps/mobile` | `mobile` | 3003 |
| `apps/docs` | `docs` | 3004 |

Docs is a Vercel app. CI does not build `apps/docs/Dockerfile`; that file is not part of the local runtime image set.

## Other roots

- `packages/` — shared JavaScript packages and the Go event envelopes. Identities are in [030-packages-and-contracts.ctx.md](030-packages-and-contracts.ctx.md).
- `messaging/` — the Early Access runtime and its NATS and MinIO infrastructure. See [040-messaging-runtime-and-environment.ctx.md](040-messaging-runtime-and-environment.ctx.md).
- `cli/` — the POSIX `drift` control plane.
- `.agents/` — context, rules, and skills.
- `.cursor/` — Cursor hooks and a reviewer. It is an adapter, not a second policy.
- `.github/workflows/` — `ci.yml`, `harness-score.yml`, and `main-source-guard.yml`.

`pnpm-workspace.yaml` also includes `messaging/runtime/early-access/e2e`. That package holds Playwright fixtures. The isolated Compose file is `messaging/runtime/early-access/containers/e2e/docker-compose.yml`.
