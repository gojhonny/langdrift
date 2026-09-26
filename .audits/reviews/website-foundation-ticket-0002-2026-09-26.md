# Website Foundation Alignment — Ticket 0002 review

- **Ticket:** `.artifacts/tickets/0002-consolidate-website-localization-ownership.ticket.md`
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
 M apps/website/next.config.ts
 M apps/website/src/app/[locale]/layout.tsx
 M apps/website/src/app/[locale]/page.tsx
 M apps/website/src/app/[locale]/pricing/page.tsx
 M apps/website/src/app/app-links.ts
 M apps/website/src/app/state-logger.tsx
 M apps/website/src/app/voice-preview.tsx
 M apps/website/src/components/early-access/env.server.test.ts
 M apps/website/src/components/early-access/form.action.test.ts
 M apps/website/src/components/early-access/form.action.ts
 M apps/website/src/components/early-access/form.handlers.test.ts
 M apps/website/src/components/early-access/form.handlers.ts
 M apps/website/src/components/early-access/form.mappers.ts
 M apps/website/src/components/early-access/form.test.tsx
 M apps/website/src/components/early-access/form.tsx
 M apps/website/src/components/early-access/form.validation.test.ts
 M apps/website/src/components/early-access/form.validation.ts
 M apps/website/src/components/early-access/section.tsx
 M apps/website/src/components/early-access/turnstile.validation.test.ts
 M apps/website/src/components/early-access/turnstile.validation.ts
 M apps/website/src/components/executive-review-demo.tsx
 M apps/website/src/components/executive-review-panels.tsx
 M apps/website/src/components/executive-review-section.tsx
 M apps/website/src/components/faq-section.tsx
 M apps/website/src/components/hero-chart.tsx
 M apps/website/src/components/hero-sinapsi-graph.tsx
 M apps/website/src/components/integrations-section.tsx
 M apps/website/src/components/plans-section.tsx
 M apps/website/src/components/roi-section.tsx
 M apps/website/src/components/selected-movement.tsx
 M apps/website/src/components/vision-loop-evidence-demo.tsx
 M apps/website/src/components/vision-loop-evidence-section.tsx
 M apps/website/src/components/website-footer.tsx
 M apps/website/src/components/website-header.tsx
 D apps/website/src/i18n/navigation.ts
 D apps/website/src/i18n/request.ts
 D apps/website/src/i18n/routing.ts
 M apps/website/src/lib/hero-demo-data.ts
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
 M apps/website/src/state.ts
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
?? .audits/reviews/website-foundation-ticket-0001-2026-09-26.md
?? apps/website/src/app/lib/
?? cli/src/runtime/
```

Ticket 0001 is established context with gates-complete evidence. This review
covers the incremental Ticket 0002 localization consolidation.

## Standards

No findings.

The independent Standards review found no documented-standard violations and
no actionable baseline smells. Routing, navigation, request configuration, and
messages are consolidated beneath `apps/website/src/app/lib/i18n`;
`@i18n/*` and `@messages/*` remain meaningful boundaries, and next-intl plus
the proxy resolve the relocated owner. The locale and shared language-control
contracts are unchanged.

## Spec

No findings.

The independent Spec review found the Ticket 0002 localization ownership,
next-intl request path, locale contract, route and metadata behavior,
Website/shared-language-control boundary, and import constraints consistent
with the approved incremental contract. It found no missing requirement, scope
creep, or incorrect implementation.

## Summary

Standards: 0 findings. Spec: 0 findings. Neither axis has an outstanding issue.
