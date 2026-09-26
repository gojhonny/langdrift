# Website Foundation Alignment — Ticket 0004 review

- **Ticket:** `.artifacts/tickets/0004-complete-root-nextjs-foundation.ticket.md`
- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1)
- **Resolved base:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **HEAD:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **Committed range:** empty
- **Snapshot:** uncommitted working tree recorded below

The independent review covered the complete four-ticket delivery, with Tickets
0001–0003 as integrated context and Ticket 0004 as the final contraction onto
the root Next.js foundation. The review and subsequent tracker/audit metadata
do not change the reviewed product source.

## Snapshot status

```text
 M .artifacts/README.md
 M .artifacts/specs/README.md
 M .artifacts/tickets/README.md
 M apps/docs/content/decisions/2026-09-20-integrations-and-docs-navigation.mdx
 M apps/website/next.config.ts
 M apps/website/package.json
 D apps/website/src/.gitkeep
 D apps/website/src/app/[locale]/layout.tsx
 D apps/website/src/app/[locale]/page.tsx
 D apps/website/src/app/[locale]/pricing/page.tsx
 D apps/website/src/app/app-links.ts
 D apps/website/src/app/favicon.ico
 D apps/website/src/app/followup.css
 D apps/website/src/app/globals.css
 D apps/website/src/app/hero.css
 D apps/website/src/app/responsive.css
 D apps/website/src/app/state-logger.tsx
 D apps/website/src/app/voice-preview.css
 D apps/website/src/app/voice-preview.tsx
 D apps/website/src/components/conversion.css
 D apps/website/src/components/early-access/early-access.css
 D apps/website/src/components/early-access/env.server.test.ts
 D apps/website/src/components/early-access/form-state.data.ts
 D apps/website/src/components/early-access/form.action.test.ts
 D apps/website/src/components/early-access/form.action.ts
 D apps/website/src/components/early-access/form.handlers.test.ts
 D apps/website/src/components/early-access/form.handlers.ts
 D apps/website/src/components/early-access/form.mappers.ts
 D apps/website/src/components/early-access/form.test.tsx
 D apps/website/src/components/early-access/form.tsx
 D apps/website/src/components/early-access/form.types.ts
 D apps/website/src/components/early-access/form.validation.test.ts
 D apps/website/src/components/early-access/form.validation.ts
 D apps/website/src/components/early-access/section.tsx
 D apps/website/src/components/early-access/turnstile.validation.test.ts
 D apps/website/src/components/early-access/turnstile.validation.ts
 D apps/website/src/components/executive-review-demo.tsx
 D apps/website/src/components/executive-review-panels.tsx
 D apps/website/src/components/executive-review-section.tsx
 D apps/website/src/components/executive-review.css
 D apps/website/src/components/faq-section.tsx
 D apps/website/src/components/hero-chart.tsx
 D apps/website/src/components/hero-demo.css
 D apps/website/src/components/hero-sinapsi-graph.tsx
 D apps/website/src/components/integrations-section.css
 D apps/website/src/components/integrations-section.tsx
 D apps/website/src/components/plans-section.tsx
 D apps/website/src/components/roi-section.tsx
 D apps/website/src/components/selected-movement.tsx
 D apps/website/src/components/vision-loop-evidence-demo.tsx
 D apps/website/src/components/vision-loop-evidence-section.tsx
 D apps/website/src/components/vision-loop-evidence.css
 D apps/website/src/components/website-footer.css
 D apps/website/src/components/website-footer.tsx
 D apps/website/src/components/website-header.css
 D apps/website/src/components/website-header.tsx
 D apps/website/src/env.server.ts
 D apps/website/src/env.ts
 D apps/website/src/i18n/navigation.ts
 D apps/website/src/i18n/request.ts
 D apps/website/src/i18n/routing.ts
 D apps/website/src/lib/executive-review-data.ts
 D apps/website/src/lib/hero-demo-data.ts
 D apps/website/src/lib/vision-loop-content.ts
 D apps/website/src/messages/conversion.ts
 D apps/website/src/messages/demo.ts
 D apps/website/src/messages/early-access.ts
 D apps/website/src/messages/executive-review/en.ts
 D apps/website/src/messages/executive-review/index.ts
 D apps/website/src/messages/executive-review/ja.ts
 D apps/website/src/messages/executive-review/pt-br.ts
 D apps/website/src/messages/executive-review/zh-hant.ts
 D apps/website/src/messages/header.ts
 D apps/website/src/messages/home.ts
 D apps/website/src/messages/index.ts
 D apps/website/src/messages/integrations.ts
 D apps/website/src/messages/vision-loop/en.ts
 D apps/website/src/messages/vision-loop/index.ts
 D apps/website/src/messages/vision-loop/ja.ts
 D apps/website/src/messages/vision-loop/pt-br.ts
 D apps/website/src/messages/vision-loop/zh-hant.ts
 D apps/website/src/proxy.ts
 D apps/website/src/state.ts
 M apps/website/tsconfig.json
 M apps/website/tsconfig.paths.json
 D apps/website/turbo.json
 M biome.json
 M messaging/runtime/early-access/e2e/tests/registration.spec.ts
 M vitest.config.mts
?? .artifacts/specs/0001-website-foundation-alignment.spec.md
?? .artifacts/tickets/0001-establish-website-import-and-test-boundaries.ticket.md
?? .artifacts/tickets/0002-consolidate-website-localization-ownership.ticket.md
?? .artifacts/tickets/0003-lift-website-owned-application-concerns.ticket.md
?? .artifacts/tickets/0004-complete-root-nextjs-foundation.ticket.md
?? .audits/reports/website-foundation-ticket-0001-2026-09-26.md
?? .audits/reports/website-foundation-ticket-0002-2026-09-26.md
?? .audits/reports/website-foundation-ticket-0003-2026-09-26.md
?? .audits/reviews/website-foundation-ticket-0001-2026-09-26.md
?? .audits/reviews/website-foundation-ticket-0002-2026-09-26.md
?? .audits/reviews/website-foundation-ticket-0003-2026-09-26.md
?? apps/website/app/
?? apps/website/components/
?? apps/website/env.server.ts
?? apps/website/env.ts
?? apps/website/lib/
?? apps/website/proxy.ts
?? apps/website/state.ts
?? cli/src/runtime/
```

## Standards

No findings.

The independent Standards reviewer examined the complete uncommitted delivery
against `AGENTS.md`, `apps/website/AGENTS.md`, the promoted frontend, Next.js,
Tailwind, and Jotai guardrails, the SDD workflow, and the full code-smell
baseline. It found no documented-standard violation or actionable smell. The
review specifically confirmed root App Router/proxy ownership, localization
ownership, semantic aliases, private-manifest and Turbo inheritance, restored
runtime wrappers, tests, and active documentation. Deferred component, CSS,
Jotai, composition, accessibility, and performance debt was not expanded.

## Spec

Two evidence gaps; no implementation finding.

1. **High — repository gate remains failed.** AC-21 requires repository doctor,
   lint, typecheck, and build to pass. Doctor passed, but `pnpm lint`,
   `pnpm typecheck`, and `pnpm build` failed in out-of-scope Docs, SSO,
   shared-package, and Dashboard paths. The reviewer classified this as an
   evidence/gate gap rather than an implementation defect.
2. **Medium — Docker-backed proof remains unexecuted.** AC-22 requires relevant
   integration/browser proof where the harness supports it. The Docker daemon
   is unavailable, so routing, submission, privacy, localized-feedback, and
   durable-messaging browser/integration proof remains unpassed rather than
   inferred.

The independent Spec reviewer found no missing implementation requirement,
incorrect implementation, or scope creep in the delivered diff.

## Summary

Standards: 0 findings. Spec: 2 gate gaps, with the repository-required checks
the highest-severity gap. Neither axis found an implementation defect.
