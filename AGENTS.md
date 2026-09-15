# Lang Drift — Repository Agent Context

## Product

Lang Drift is a multi-tenant visual product-intelligence platform for founders, CEOs, and leadership. It explains how a product changes over time relative to the vision and recorded decisions that shaped it.

The primary executive question is:

> How far has the product drifted from the vision we intended to build?

## Canonical language

- **Vision:** intended product direction.
- **Product Vision:** explainable, decomposable, auditable executive index of alignment with recorded vision, decisions, implementation, and evidence. It is not an AI probability.
- **Drift:** movement between intended direction and current product reality; drift is not automatically negative.
- **Intentional Evolution:** consciously decided change with recorded rationale and responsibility.
- **Unexplained Drift:** meaningful change without a clearly recorded product decision or rationale.
- **Unknown / Under Review:** detected difference not yet classifiable with confidence.

Do not reintroduce the superseded term “Product Integrity.” Use **Product Vision**.

## Product principles

1. Executive first.
2. Visual-first for truth.
3. Voice-first for inquiry.
4. Explain every number.
5. Evolution is not automatically failure.
6. Attribution matters.
7. Deterministic first.
8. Methodology agnostic.
9. Technical complexity stays underneath.
10. Same data, different abstraction by role.
11. Important scores are auditable.
12. Important changes are attributable when possible.

## Architecture direction

Prefer:

```text
structured artifacts
  -> deterministic rules / audits
  -> normalized events
  -> product model
  -> executive visualization
```

Canonical principle: **reason over changes, not repositories**.

The frontend scaffold must not invent a backend contract. There is no backend app in this repository yet.

## Workspace boundaries

- `apps/website`: public acquisition surface. Cohere-inspired composition, Lang Drift tokens.
- `apps/console`: authenticated dashboard/product. Vercel-inspired precision, Lang Drift tokens.
- `apps/sso`: sign-in/sign-up/SSO boundary, visually adjacent to the Website family.
- `apps/mobile`: installed PWA/mobile executive experience, same product language as the authenticated app.
- `packages/react`: shared tokens, styles, and future React UI primitives. SmoothUI is the preferred metric/data-motion source.
- `.agents`: harness artifact folders. Keep placeholders only until the harness redesign is finalized.
- `.audits`: audit placeholder only until the harness redesign is finalized.

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

Orange is brand identity, not warning/error/drift severity. Semantic colors must retain their meanings.

## Implementation constraints for this scaffold

- Repository automation scripts are POSIX `.sh` files.
- No `.codex` directory.
- No `ai` workspace.
- No backend / API workspace.
- No product pages or React components in this scaffolding PR.
- Keep `.agents` and `.audits` as empty structure with `.gitkeep` placeholders.
- Do not silently turn design references into copied branding.
