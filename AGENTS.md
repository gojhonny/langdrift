# LangDrift — Repository Agent Context

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
- Console / Dashboard
- SSO / Auth / Plans preview
- Mobile / PWA
- shared React UI

Current maturity:

- frontend prototype / demo;
- no canonical backend contract yet;
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

The frontend must not invent a backend contract. There is no backend/API workspace in this repository yet.

## Surface boundaries

### Website

Public acquisition and explanation.

- Cohere-inspired composition + LangDrift tokens.
- First viewport must explain Product Vision movement visually.
- Marketing language uses founder outcomes, not internal route taxonomy.
- Technical infrastructure remains secondary.
- Early access currently validates email locally only; it sends no requests and does not create a lead, account, subscription or trial.

### Console / Dashboard

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
- No backend/API workspace until architecture explicitly introduces one.
- Do not silently turn design references into copied branding.
- Preserve light/dark support and accessibility across surfaces.
- Jotai owns shared application state on Website/SSO/Mobile; Zustand owns Console state. Website feature-local forms use React `useState` with Immer `produce` and Zod validation. See [Website local state and forms](apps/website/docs/local-state-and-forms.md); this does not require migrating other surfaces.
- Important shared state changes remain inspectable through the existing state loggers. Keep email and other entered form data out of atoms, logs, URLs, analytics and browser persistence.

## Harness bootstrap

The harness is being rebuilt from selected Amarelo reference files. Code-design rules live under `.agents/rules/code-design/`; template prompts live under `.agents/prompts/`; local skills live under `.agents/skills/`.

Copied rules, templates, and skills retain their source content for deliberate iteration. Their Amarelo-specific references and pending workflow dependencies still need adaptation. They do not establish new LangDrift product decisions or trigger a repository-wide code-conformance migration.

Planning now lives in `.agents/workflow/`; see [.agents/README.md](.agents/README.md) for artifact ownership and [.agents/workflow/README.md](.agents/workflow/README.md) for the draft lifecycle. Status belongs inside documents, not status-named folders. Retained templates are centralized in `.agents/templates/`.

`.drifts/` holds the draft portable JSON integration contract and future Obsidian/MCP placeholders. It references factory documents but does not own their approval status. No integration is running.

`.audits/` has placeholder folders for checks and evidence. `drift check` targets `.audits/checks/` and remains unavailable until real checker files are introduced. Website implementation and Sinapsi publication are outside this scaffold.

## Verification

A frontend change is not repository-ready until it passes:

```text
drift doctor --ci
Biome lint
typecheck
build
```
