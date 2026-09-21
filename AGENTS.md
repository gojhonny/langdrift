# LangDrift — Repository Agent Context

## Source of truth and precedence

1. Current repository code, config, and schema are the implementation source of truth.
2. An explicit owner decision overrides an inferred convention.
3. This file owns repository-wide operating invariants.
4. `.agents/context/*.ctx.md` describes scoped repository context. Start at [.agents/context/000-fragmented-context.ctx.md](.agents/context/000-fragmented-context.ctx.md).
5. `.agents/rules/*.rule.md` applies only when its scope matches current LangDrift code and it does not contradict a higher invariant.
6. `.agents/skills/` are procedures. A foreign or stale path in a skill does not create LangDrift architecture.
7. `.cursor/` adapts this harness to Cursor. It is not a second policy.

`.drifts/` is restricted. Do not create, edit, move, delete, normalize, format, or populate files under `.drifts/` unless the owner explicitly authorizes that scope.

## Product

LangDrift is a multi-tenant visual product-intelligence platform for founders, CEOs, and leadership. It explains how a product changes over time relative to the vision and recorded decisions that shaped it.

The primary executive question is:

> How far has the product drifted from the vision we intended to build?

The executive product sequence is:

```text
Product Vision
  → how did it move?
  → why?
  → who?
  → was it intentional?
  → show me more
```

## Current repository maturity

Implemented frontend surfaces:

- Website
- Dashboard
- SSO / Auth / Plans preview
- Mobile / PWA
- shared React UI

Current maturity:

- frontend prototype / demo;
- a narrow Early Access messaging contract; no general product backend contract yet;
- Product Vision values are illustrative demo data;
- Product Vision formula remains open;
- Website offers are a 15-day free trial (starting at access activation), Plus and Pro; prices, limits, billing cadence and exact entitlements remain open;
- auth provider and exact auth methods remain open.

Do not present an open implementation choice as canonical product policy.

## Canonical language

- **Vision:** intended product direction.
- **Product Vision:** explainable, decomposable, auditable executive state/index of the current product relative to recorded vision and decisions. It is not an AI probability.
- **Drift:** movement between intended direction and current product reality; drift is not automatically negative.
- **Intentional Evolution:** consciously decided change with recorded rationale and responsibility.
- **Unexplained Drift:** meaningful change without a clearly recorded product decision or rationale.
- **Unknown / Under Review:** detected difference not yet classifiable with confidence.
- **Attribution:** people, teams, agents, and actions connected to a change.

Do not reintroduce the superseded term **Product Integrity** except when explicitly discussing historical terminology. Use **Product Vision**.

## Product principles

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
16. Orange is brand identity, not warning/error severity.

## Architecture direction

Prefer:

```text
structured sources
  → deterministic ingestion
  → rules / audits
  → normalized events
  → product model
  → Product Vision / Drift
  → executive views
  → deterministic Voice query
```

Canonical principle: **reason over changes, not repositories**.

The frontend must not invent a backend contract. Early Access uses the canonical two-actor Go runtime under `messaging/runtime/early-access`; shared event envelopes live in `packages/events/envelopes`. There is no general backend/API workspace.

## Surface boundaries

### Website

Public acquisition and explanation.

- Cohere-inspired composition + LangDrift tokens.
- First viewport must explain Product Vision movement visually.
- Marketing language uses founder outcomes, not internal route taxonomy.
- Technical infrastructure remains secondary.
- Early access validates locally and in a Server Function, then submits via server-only Axios to the Go messaging runtime. Success requires durable acceptance; this does not create an account, subscription or activated trial.

### Dashboard

Authenticated analytical product.

- Vercel-inspired precision + LangDrift tokens.
- Primary navigation stays shallow: Overview, Evolution, Decisions, People, Reports, then Settings.
- Evidence is contextual drill-down, not a primary executive destination.
- Team/Product Area are dimensions/groupings.
- Intentional/Unexplained/Under Review are classifications/filters.
- Product Vision must expose its movement and provenance.

### Mobile / PWA

Installed executive companion.

- Glance first. Ask second. Analyze on demand.
- Product Vision summary and Orb belong above the fold.
- Full curve is available through detail, not dominant on home.
- Mobile uses tap equivalents rather than desktop hover assumptions.

### SSO / Auth / Plans

Acquisition/identity family adjacent to Website.

- Do not invent provider strategy, plan names, prices, limits, or billing cadence.
- Represent account → organization → plan/trial → product setup progressively.
- Keep technical integration out of the first identity form.

### Shared React UI

- First-party LangDrift concepts belong under `packages/react/src/ui`.
- SmoothUI/shadcn/Orbz are implementation foundations, not product-domain vocabulary.
- Promote Product Vision Curve, Drift Event, Attribution, Vision Summary, Executive Report, and Voice Inquiry as first-party concepts when shared.

## Demo data policy

Until a real data model exists, values such as `73%`, `91%`, `14 points`, or `4 points` must live inside an explicitly demo/illustrative context.

Never imply that illustrative values define the final Product Vision formula.

## Canonical colors

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

Orange is LangDrift identity/focus. It is not generic warning/error/drift severity.

## Repository constraints

- Repository automation scripts are POSIX `.sh` files.
- No `.codex` directory.
- No `ai` workspace.
- No general backend/API workspace. The only current backend-style runtime is `messaging/runtime/early-access`. Do not invent a second one, and do not remove that runtime because an older note says the repository has no backend.
- Do not silently turn design references into copied branding.
- Preserve light/dark support and accessibility across surfaces.
- Jotai owns shared application state on Website/SSO/Mobile; Zustand owns Dashboard state. Website feature-local forms use React `useState` with Immer `produce` and Zod validation. See [Website environment and local form state](apps/website/readme.md); this does not require migrating other surfaces.
- Important shared state changes remain inspectable through the existing state loggers. Keep email and other entered form data out of atoms, logs, URLs, analytics and browser persistence.

## Repository topology

```text
apps/       product surfaces
packages/   shared packages and contracts
messaging/  Early Access runtime and its infrastructure
cli/        repository-local POSIX control plane
.agents/    context, rules, and skills
.cursor/    Cursor adapter
```

Ports, workspace globs, and toolchain versions are in [.agents/context/010-repository-topology.ctx.md](.agents/context/010-repository-topology.ctx.md). Surface rules stay in this file.

## Package identity

Do not infer a package name from its folder. Read `package.json` or `go.mod` before changing a boundary.

```text
packages/core          → @langdrift/setup
packages/sdk           → @langdrift/sdk
packages/react         → @repo/react
packages/design-tokens → @repo/design-tokens
packages/events        → Go envelopes in the root module
```

Detail is in [.agents/context/030-packages-and-contracts.ctx.md](.agents/context/030-packages-and-contracts.ctx.md). The setup and SDK READMEs are the product docs for those two packages.

## Environment

```text
tracked safe local config → .env.development
private local values      → .env
required env              → fail fast
no hardcoded fallback
```

The Early Access path and the exact required names are in [.agents/context/040-messaging-runtime-and-environment.ctx.md](.agents/context/040-messaging-runtime-and-environment.ctx.md).

## Harness

`AGENTS.md` and `.agents/` are canonical. The directories that exist are `.agents/context/`, `.agents/rules/`, and `.agents/skills/`. `.cursor/` is Cursor-native enforcement and feedback. The map is [.agents/README.md](.agents/README.md).

Copied rules and skills can still name Amarelo, NestJS, or paths that are not in this repository. Those references are unadapted scaffolding. They do not authorize new architecture and they do not require a repository-wide conformance migration.

```sh
./cli/drift harness --min-level 4
```

That gate measures harness maturity. It does not prove correctness. See [.agents/context/050-harness-and-agent-runtime.ctx.md](.agents/context/050-harness-and-agent-runtime.ctx.md).

## Verification

The minimum check depends on the surface you changed. Read [.agents/context/060-verification.ctx.md](.agents/context/060-verification.ctx.md) before calling a change repository-ready. Harness maturity is a separate gate from build and runtime verification.

The usual baseline is:

```text
./cli/drift doctor --ci
pnpm lint
pnpm typecheck
pnpm build
./cli/drift harness --min-level 4
```
