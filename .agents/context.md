# LangDrift project context

This document consolidates repository knowledge that was previously split across the root entrypoint and `.agents/context/`. It is the project context for the next context-rebuilding step. It does not mean a new harness has been designed or validated.

The vocabulary section is the only region that domain modeling updates. The other sections are consolidated technical context and stay in place when a term changes.

## Provenance

- Consolidated on 2026-09-25.
- Inspected commit: `275666c47dce3b0c4bccc4470d223369892999df` on `main`.
- Remote: `git@github.com:gojhonny/langdrift.git`.
- Preflight working tree: clean. No staged, unstaged, or untracked changes, and no files deleted locally relative to that commit.
- Sources read from that tree: the root entrypoint as it existed before this bootstrap, `.agents/context/`, `.agents/README.md`, and `.agents/rules/` (`000-globals.rule.md` and `rules/README.md`).
- `.cursor/` was already absent at this commit. The parent commit `3dd63d59af8390280af88bbd0e4c24b5531eddec` still contains the previous Cursor adapter. That adapter is historical git history, not active configuration, and this document does not keep its instructions as policy.
- Earlier fragment reviews cite `176af22` on 2026-09-21. That review is historical. This consolidation uses the preflight commit above.

## How to read a statement

- **Observed:** present in the tree or manifests at the inspected commit.
- **Decision:** an explicit product or repository choice recorded in those sources.
- **Intention:** a direction that is not an implemented product behavior.
- **Historical:** a past measurement, audit, or removed setup. It is not current verification.
- **Unconfirmed:** a point the sources leave unresolved.

Code, config, and schema remain the implementation source of truth. An explicit owner decision overrides an inferred convention. This file does not turn observed behavior into a new obligation.

<!-- langdrift-vocabulary:start -->

## Vocabulary

**Vision**:
The intended product direction.
_Avoid_: roadmap as a substitute name for the intended direction

**Product Vision**:
The explainable, decomposable, auditable executive state of the current product relative to recorded vision and decisions.
_Avoid_: Product Integrity, AI probability

**Drift**:
Movement between the intended direction and current product reality. Movement is not automatically a failure.
_Avoid_: defect, regression

**Intentional Evolution**:
A consciously decided change with recorded rationale and responsibility.
_Avoid_: approved drift

**Unexplained Drift**:
A meaningful change without a clearly recorded product decision or rationale.
_Avoid_: bug

**Unknown / Under Review**:
A detected difference not yet classifiable with confidence.
_Avoid_: error

**Attribution**:
The people, teams, agents, and actions connected to a change.
_Avoid_: blame

<!-- langdrift-vocabulary:end -->

## Product

LangDrift is a multi-tenant visual product-intelligence platform for founders, CEOs, and leadership. It explains how a product changes over time relative to the vision and the recorded decisions that shaped it.

The primary executive question is how far the product has drifted from the vision that was intended. The executive sequence is Product Vision, then how it moved, why, who, whether that was intentional, and where to look next. The public README states the same arc as Vision, Loop, and Evidence.

Decision, still open as a formula: Product Vision is not an AI probability, and illustrative percentages do not define it. The formula itself remains unresolved.

Product principles recorded for the product:

1. Executive first.
2. Visual-first for truth.
3. Voice-first for inquiry.
4. Explain every important number.
5. Evolution is not automatically failure.
6. Attribution matters.
7. Deterministic first.
8. Methodology agnostic.
9. Technical complexity stays underneath.
10. Same truth, different abstraction by role.
11. Important scores are auditable.
12. Important changes are attributable when possible.
13. Product UI should feel analytical, not magical.
14. The Product Vision / Drift Curve is a signature visual.
15. The Voice Orb is a signature interaction surface.
16. Orange is brand identity, not warning, error, or drift severity.

Canonical colors recorded with the product:

```text
Brand / Primary          #F97316
Dark Background          #0B0B0C
Dark Surface             #151517
Primary Text on Dark     #F5F5F5
Muted Text on Dark       #A1A1AA
Light Background         #FAFAFA
Light Surface            #FFFFFF
Light Ink                #171717
Light Hairline           #EBEBEB
Intentional Evolution    #3B82F6
Healthy / Aligned        #16A34A
Unexplained Drift        #DC2626
Unknown / Review         #A855F7
```

## Repository maturity

Observed frontend surfaces: Website, Dashboard, SSO / Auth / Plans preview, Mobile / PWA, and shared React UI. Docs exists as an app and is called out under Surfaces.

Observed maturity at this commit:

- The frontend is a prototype / demo.
- Early Access has a narrow messaging contract. There is no general product backend contract.
- Product Vision values in the product UI are illustrative demo data.
- The Product Vision formula is open.
- Website offers name a 15-day free trial starting at access activation, plus Plus and Pro. Prices, limits, billing cadence, and exact entitlements are open.
- The auth provider and the exact auth methods are open.

An open choice is not canonical product policy.

## Surfaces

Ports below are the dev ports recorded for the current apps.

- **Website** (`apps/website`, package `website`, port 3000). Public acquisition and explanation. Observed Early Access path: Zod validation, a Next.js Server Function, server-only Axios, then the Go runtime. Durable acceptance does not create an account, subscription, or activated trial. Composition is Cohere-inspired with LangDrift tokens. The first viewport is meant to show Product Vision movement. Marketing language uses founder outcomes. Technical infrastructure stays secondary.
- **Dashboard** (`apps/dashboard`, package `dashboard`, port 3001). Authenticated analysis, Vercel-inspired precision with LangDrift tokens. Primary navigation is Overview, Evolution, Decisions, People, Reports, then Settings. Evidence is contextual drill-down. Team and Product Area are dimensions. Intentional, Unexplained, and Under Review are classifications and filters. Product Vision is meant to expose movement and provenance.
- **SSO** (`apps/sso`, package `sso`, port 3002). Account, then organization, then plan or trial, then product setup. Do not invent the auth provider, prices, limits, or billing cadence. Technical integration stays out of the first identity form.
- **Mobile** (`apps/mobile`, package `mobile`, port 3003). Installed companion. Glance, then ask, then analyze. Product Vision summary and the Voice Orb belong above the fold. The full curve is available through detail. Mobile uses tap equivalents rather than desktop hover.
- **Docs** (`apps/docs`, package `docs`, port 3004). Documentation site, deployed on Vercel. CI does not build `apps/docs/Dockerfile`; that file is not part of the local runtime image set.
- **Shared UI.** First-party concepts belong under `packages/react/src/ui`. SmoothUI, shadcn, and Orbz are implementation foundations, not product-domain vocabulary. Shared promotion targets are Product Vision Curve, Drift Event, Attribution, Vision Summary, Executive Report, and Voice Inquiry.

Demo data policy: until a real data model exists, values such as `73%`, `91%`, `14 points`, or `4 points` stay inside an explicitly demo or illustrative context. They do not define the Product Vision formula.

## Architecture direction

The intended flow is structured sources, deterministic ingestion, rules and audits, normalized events, a product model, Product Vision and Drift, executive views, then deterministic Voice query.

The recorded principle is to reason over changes, not repositories.

Observed boundary: the frontend does not own a general backend contract. The only backend-style runtime in the tree is the Early Access Go runtime at `messaging/runtime/early-access`. Shared event envelopes live in `packages/events/envelopes`. There is no general backend or API workspace. Older notes that say the repository has no backend are superseded by this runtime; the current CLI readme already describes that narrow runtime.

Repository constraints recorded with the product:

- Automation scripts are POSIX `.sh` files.
- No `.codex` directory and no `ai` workspace.
- Do not turn a design reference into copied branding.
- Light and dark support and accessibility stay across surfaces.
- Jotai owns shared application state on Website, SSO, and Mobile. Zustand owns Dashboard state. Website feature-local forms use React `useState` with Immer `produce` and Zod validation. That Website choice does not require migrating other surfaces. See `apps/website/README.md`.
- Important shared state changes stay inspectable through the existing state loggers. Email and other entered form data stay out of atoms, logs, URLs, analytics, and browser persistence.
- `.drifts/` is present and was not used as a source for this consolidation.

## Topology and toolchain

Observed from manifests at this commit:

- pnpm workspace patterns: `apps/*`, `packages/*`, `messaging/*`, and `messaging/runtime/early-access/e2e`. Workspace membership is a tooling boundary, not product ownership.
- Node `>=24`. Package manager pin: `pnpm@10.32.1`.
- Go module `github.com/gojhonny/langdrift` at Go 1.27.1.
- `packages/` holds shared JavaScript packages and the Go event envelopes.
- `messaging/` holds the Early Access runtime and its NATS and MinIO infrastructure.
- `cli/` is the POSIX `drift` control plane.
- `.github/workflows/` includes `ci.yml`, `harness-score.yml`, and `main-source-guard.yml`.
- The Early Access Playwright package lives at `messaging/runtime/early-access/e2e`. The isolated Compose file is `messaging/runtime/early-access/containers/e2e/docker-compose.yml`.

## Packages

Read `package.json` or `go.mod` before changing a package boundary. The directory name is not the package name.

| Directory | Identity | Role observed in the tree |
| --- | --- | --- |
| `packages/core` | `@langdrift/setup` | Local, non-destructive `langdrift setup` command. It does not publish itself, create an account, or call a network. |
| `packages/sdk` | `@langdrift/sdk` | Deterministic Vision, Loop, and Evidence protocol for Node 24. Public entries are `.`, `./schema`, `./mcp`, and `./integrations`. |
| `packages/design-tokens` | `@repo/design-tokens` | Tokens only. Components live in `@repo/react`. |
| `packages/react` | `@repo/react` | Shared UI foundation. Its readme still defers product components. |
| `packages/events` | Go package `envelopes` | Shared event envelopes in the root module. There is no `package.json`. |

`@langdrift/setup` depends on `@langdrift/sdk`. Both READMEs are the product documentation for those packages. Both say they are unpublished. Packing the workspace does not publish them. Setup does not connect GitHub, Linear, or Obsidian. Names such as `@pack/*` or `packages/kernel` do not match this table.

## Early Access runtime and environment

Observed Website path:

```text
Zod validation
→ Next.js Server Function
→ server-only Axios
→ email-store
→ NATS JetStream email.received
→ MinIO contact object
→ email.stored
→ email-sender
→ Resend
```

Production actors are `email-store` and `email-sender`. Infrastructure lives at `messaging/infrastructure/broker/nats` and `messaging/infrastructure/storage/minio`.

Required names, with no values recorded here. `email-store` requires `EMAIL_SERVICE_API_KEY`, `API_ADDR`, `NATS_URL`, `MINIO_ENDPOINT`, `MINIO_BUCKET`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_USE_SSL`, and `EARLY_ACCESS_MODE`. `email-sender` requires `NATS_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `RESEND_API_URL`, `HEALTH_ADDR`, and `EARLY_ACCESS_MODE`. Development points at an in-compose Resend mock. The Website also validates Turnstile server-side before forwarding to Go.

Both actors expose `GET /healthz` and `GET /readyz`. `POST /v1/emails` returns 202 only after JetStream accepts `email.received`. MinIO conditional create preserves the first contact and event identity across repeat submissions. `email.sent` means Resend accepted an email request. Neither 202 nor `email.sent` means inbox delivery.

Environment files: tracked `.env.development` holds safe local values. Ignored `.env` holds private values. `.gitignore` ignores `.env`, `.env.local`, and `.env.*.local`, and keeps `.env.development`. Required website values throw when missing. `apps/website/src/env.ts` has no hardcoded runtime fallback.

What the Early Access CI job is written to prove: it validates the dev and e2e Compose files, starts the dev stack, checks store health and the `EARLY_ACCESS` stream, stops `email-sender`, posts a synthetic registration, and checks for a MinIO contact plus both durable consumers. A separate proof profile runs the isolated chain against the in-compose test provider and requires exactly one send. That job does not call live Resend. Operational detail is in `messaging/runtime/early-access/README.md`.

A 2026-09-22 proof note, historical and not re-run here: binding the dev server to `127.0.0.1` looped because Next.js rewrote the locale to `localhost`. The proof kept the server off that bind.

## Verification commands

These commands existed at the inspected commit. A green result means only what that command checks. This bootstrap did not re-run them.

Repository job:

```sh
./cli/drift doctor --ci
pnpm lint
pnpm typecheck
pnpm build
```

`drift doctor --ci` checks that `git`, `node`, and `pnpm` exist, that Node is 24 or newer, and that the app, package, messaging, CLI, and `.agents` paths it lists are present. `pnpm lint` runs Biome. `pnpm typecheck` and `pnpm build` run through Turbo.

Go job: `go build ./...`, `go test ./...`, `go test -race ./...`, `go vet ./...`, `staticcheck` at `honnef.co/go/tools/cmd/staticcheck@v0.8.1`, `govulncheck` at `golang.org/x/vuln/cmd/govulncheck@v1.8.0`, and `gofmt -l` on `packages/events` and `messaging/runtime/early-access`.

`./cli/drift audit early-access` reports Go coverage and dependency findings. `pnpm coverage:early-access` reports Website form and action coverage. `pnpm audit` in CI is a dependency check, not a product-audit document.

CI builds Dockerfiles for website, dashboard, SSO, NATS, MinIO, email-store, and email-sender. It does not build a docs image.

`./cli/drift harness --min-level 4` runs pinned `harness-score@1.5.2` and measures recognized harness infrastructure. It does not prove tests, correctness, or product readiness. `.github/workflows/harness-score.yml` still runs that gate. This bootstrap removes infrastructure that gate was scoring and does not claim the gate still passes.

`main-source-guard.yml` rejects a pull request into `main` whose head branch is also named `main`.

## Open decisions

Unresolved in the docs and code at this commit. Do not close them by choosing a value in an unrelated change.

- The Product Vision formula is open. Demo percentages are not that formula.
- Website offers name a 15-day free trial, Plus, and Pro. Prices, limits, billing cadence, and exact entitlements are open.
- The auth provider and the exact auth methods are open.
- There is no general product backend contract. The Early Access messaging runtime is a narrow use case, not that contract.
- `@langdrift/sdk` and `@langdrift/setup` are unpublished.
- Setup does not connect GitHub, Linear, or Obsidian. Live platform integrations are not generally available from these packages.
- Hosting for the Early Access production runtime is undecided. The runtime README lists TLS, private NATS and MinIO, scoped credentials, edge limits, backup and restore, credential rotation, operator handling of expired or exhausted deliveries, contact retention, and one controlled live-provider smoke as checks before public signup.

## Historical notes

`messaging/runtime/early-access/AUDIT.md` remains in the tree. Its own status says implementation was in progress on PR #54 and not merge-ready. Baseline measurements are dated 2026-09-21 against `c164eac`, with local integration and e2e notes dated 2026-09-22. Those results were not re-executed for this consolidation. Release gates listed there, including combined coverage, image scans, hosting, live Turnstile and Resend, and contact retention, stay open unless a later check says otherwise. The existence of that file is not proof that those gates passed.

At this commit, `.agents/rules/README.md` still catalogs `000-foundation-stone` through `018`, while the tree only contains `000-globals.rule.md`, whose entire body is the heading "Global Rules". That catalog and the stub disagree. The rule files were not restored. Their text is not policy in this document.

Copied skills that remain outside the selected upstream set can still name paths this repository does not use. A path named by an unadapted skill does not create that structure.
