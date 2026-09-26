# Website Foundation Alignment — Ticket 0003 review

- **Ticket:** `.artifacts/tickets/0003-lift-website-owned-application-concerns.ticket.md`
- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1)
- **Resolved base:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **HEAD:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **Committed range:** empty
- **Snapshot:** uncommitted working tree recorded below

## Snapshot status

```text
 M .artifacts/README.md
 M .artifacts/specs/README.md
 M .artifacts/tickets/README.md
 M apps/docs/content/decisions/2026-09-20-integrations-and-docs-navigation.mdx
 M apps/website/next.config.ts
 M apps/website/src/app/[locale]/layout.tsx
 M apps/website/src/app/[locale]/page.tsx
 M apps/website/src/app/[locale]/pricing/page.tsx
 M apps/website/src/app/app-links.ts
 M apps/website/src/app/state-logger.tsx
 M apps/website/src/app/voice-preview.tsx
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
 M apps/website/src/proxy.ts
 D apps/website/src/state.ts
 M apps/website/tsconfig.json
 M apps/website/tsconfig.paths.json
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
?? .audits/reviews/website-foundation-ticket-0001-2026-09-26.md
?? .audits/reviews/website-foundation-ticket-0002-2026-09-26.md
?? apps/website/components/
?? apps/website/env.server.ts
?? apps/website/env.ts
?? apps/website/lib/
?? apps/website/src/app/lib/
?? apps/website/state.ts
?? cli/src/runtime/
```

Tickets 0001 and 0002 are gates-complete context. This review covers the
incremental Ticket 0003 relocation.

## Standards

No findings after correction.

The independent Standards review initially found that editing
`.agents/context.md` would rewrite a provenance-bound historical observation.
That edit was reverted, leaving the context snapshot unchanged while active
Website, Docs, and configuration consumers resolve the relocated concerns. The
reviewer reassessed the corrected snapshot and found no documented-standard
violations or actionable baseline smells.

## Spec

No findings after correction.

The independent Spec review found that root-owned UI, helpers, environment
modules, state, styles, tests, aliases, coverage discovery, and active
documentation match Ticket 0003. After the historical context correction it
found no missing requirement, scope creep, or incorrect implementation.

## Summary

Standards: 0 outstanding findings. Spec: 0 findings. Neither axis has an
outstanding issue.
