# Lang Drift

Lang Drift is a visual product-intelligence platform for founders and leadership. It makes product evolution understandable relative to the vision and recorded decisions that shaped the product.

The executive question is simple:

> How far has the product drifted from the vision we intended to build?

Lang Drift is **visual-first for truth** and **voice-first for inquiry**. The product surfaces Product Vision, the Drift Curve, attribution, decisions, Intentional Evolution, Unexplained Drift, and Unknown / Under Review states while keeping engineering complexity underneath.

## Monorepo

```text
apps/
  console/   Executive and management web product
  website/   Public website, auth-adjacent marketing, and plans surface
  sso/       Authentication / SSO surface
  mobile/    Installed PWA experience
packages/
  react/     Shared Lang Drift design foundation and future React primitives
cli/
  drift      POSIX-shell repository CLI
.agents/     Agentic factory: rules, skills, templates, and workflow planning
.audits/     Audit checks and verification evidence (placeholders)
.drifts/     Portable initiative JSON and future integration contracts
assets/
  images/    Shared image assets
```

There is intentionally no backend application in this scaffold.

The [factory harness](.agents/README.md), [planning workflow](.agents/workflow/README.md), and [Drift Manifest](.drifts/README.md) are drafts. Obsidian/MCP adapters and autonomous delivery are not implemented.

## Design foundations

- **Website / public acquisition:** Cohere DESIGN.md composition adapted to Lang Drift.
- **Console / authenticated product:** Vercel DESIGN.md precision adapted to Lang Drift.
- **Mobile / PWA:** the same Vercel-derived product language, adapted for installed/mobile use.
- **Metrics and data motion:** SmoothUI primitives and interaction language.
- **Voice presence:** Orbz, with the Amarelo interaction as a reference when Voice work begins.

Canonical brand primary: `#F97316`. Orange is identity, never a generic warning/error color.

## Tooling

- Node.js 24
- pnpm 10
- Turborepo
- TypeScript
- Biome
- Husky + Commitlint + lint-staged
- Next.js 16 / React 19 for `website`, `console`, and `sso`
- Vite + React 19 + Vite PWA for `mobile`

## CLI

The repository CLI is `drift`:

```sh
./cli/drift --help
./cli/drift doctor
./cli/drift bootstrap
./cli/drift adr my-decision
./cli/drift spec product-vision-curve
```

The CLI is implemented with POSIX shell scripts only.
