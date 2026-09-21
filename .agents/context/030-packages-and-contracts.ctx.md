---
context: packages-and-contracts
status: current
source_branch: staging
reviewed_at: 2026-09-21
sources:
  - packages/core/package.json
  - packages/core/README.md
  - packages/sdk/package.json
  - packages/sdk/README.md
  - packages/react/package.json
  - packages/react/readme.md
  - packages/design-tokens/package.json
  - packages/design-tokens/README.md
  - packages/events/envelopes/envelope.go
  - go.mod
---

# Packages and contracts

Read the manifest before changing a package boundary. The directory name is not the package name.

| Directory | Identity | Role in the current tree |
| --- | --- | --- |
| `packages/core` | `@langdrift/setup` | Local, non-destructive `langdrift setup` command. It does not publish itself, create an account, or call a network. |
| `packages/sdk` | `@langdrift/sdk` | Deterministic Vision, Loop, and Evidence protocol for Node 24. Public entries are `.`, `./schema`, `./mcp`, and `./integrations`. |
| `packages/design-tokens` | `@repo/design-tokens` | Tokens only. Components live in `@repo/react`. |
| `packages/react` | `@repo/react` | Shared UI foundation. Product components are still deferred in its readme. |
| `packages/events` | Go package `envelopes` | Shared event envelopes in the root module `github.com/gojhonny/langdrift`. There is no `package.json`. |

`@langdrift/setup` depends on `@langdrift/sdk`. Both READMEs are the product documentation for those packages. Both say they are unpublished. Do not describe either package as a released npm product.

Older package rules that mention `@pack/*` or `packages/kernel` do not match this table.
