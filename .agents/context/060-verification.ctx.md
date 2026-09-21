---
context: verification
status: current
source_branch: main
reviewed_at: 2026-09-21
sources:
  - .github/workflows/ci.yml
  - .github/workflows/harness-score.yml
  - .github/workflows/main-source-guard.yml
  - cli/src/commands/doctor.sh
  - cli/src/commands/harness.sh
---

# Verification

Pick the commands that match the files you changed. A green result means only what that command checks.

## Repository job

```sh
./cli/drift doctor --ci
pnpm lint
pnpm typecheck
pnpm build
```

`drift doctor --ci` checks that `git`, `node`, and `pnpm` exist, that Node is 24 or newer, and that the app, package, messaging, CLI, and `.agents` paths it lists are present. `pnpm lint` runs Biome. `pnpm typecheck` and `pnpm build` run through Turbo.

## Go job

```sh
go build ./...
go test ./...
go test -race ./...
go vet ./...
gofmt -l packages/events messaging/runtime/early-access
```

A clean Go job means the module builds, tests pass with the race detector, `go vet` is quiet, and those two trees are gofmt-clean.

## Container and Early Access jobs

CI builds the Dockerfiles for website, dashboard, SSO, NATS, MinIO, email-store, and email-sender. It does not build a docs image.

The Early Access job checks Compose config, store health, the `EARLY_ACCESS` stream, a synthetic HTTP 202 after the sender is stopped, MinIO contact persistence, and the two durable consumers. The proof profile then runs the isolated chain against the test provider and requires exactly one send. That is runtime smoke. It is not a live Resend delivery test.

## Separate gates

```sh
./cli/drift harness --min-level 4
```

Harness L4 means the recognized harness is self-correcting. It does not mean the product is correct. A green build does not mean production readiness. Runtime smoke does not mean a live-provider end-to-end test.

`main-source-guard.yml` rejects a pull request into `main` whose head branch is also named `main`.
