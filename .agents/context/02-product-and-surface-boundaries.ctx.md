---
context: product-and-surface-boundaries
status: current
source_branch: staging
reviewed_at: 2026-09-21
sources:
  - AGENTS.md
  - README.md
  - apps/website/README.md
---

# Product and surface boundaries

The enforced language, principles, colors, and surface rules live in [AGENTS.md](../../AGENTS.md). This fragment is the map. It does not add product policy.

The executive question is how far the product has moved from the vision that was intended. The sequence is Product Vision, then how it moved, why, who, whether that was intentional, and where to look next. The public README states the same arc as Vision, Loop, and Evidence.

Use Product Vision, Drift, Intentional Evolution, Unexplained Drift, Unknown / Under Review, and Attribution. Drift is movement, not an automatic failure. Do not revive the term Product Integrity except when discussing that old name.

Illustrative scores such as `73%` stay labeled as demo data. They do not define the Product Vision formula.

## Surfaces

- Website (`apps/website`, port 3000) — public acquisition. Early Access validates in the app, then a Server Function posts with server-only Axios. Durable acceptance does not create an account, subscription, or activated trial.
- Dashboard (`apps/dashboard`, port 3001) — authenticated analysis. Navigation stays Overview, Evolution, Decisions, People, Reports, then Settings.
- SSO (`apps/sso`, port 3002) — account, organization, plan or trial, then product setup. Do not invent the auth provider, prices, limits, or billing cadence.
- Mobile (`apps/mobile`, port 3003) — installed companion. Summary and the Voice Orb come before the full curve.
- Docs (`apps/docs`, port 3004) — documentation site, deployed on Vercel rather than as a local runtime image. Public docs use the same four locales as the Website. Nextra-generated links stay in the active locale. The public Website origin comes from environment configuration. Decision records stay English-only, and unprefixed `/decisions/*` URLs redirect to the English locale URL.
- Shared UI — first-party concepts live under `packages/react/src/ui`. SmoothUI, shadcn, and Orbz are implementation foundations.

Open choices that must stay open are listed in [07-open-decisions.ctx.md](07-open-decisions.ctx.md).
