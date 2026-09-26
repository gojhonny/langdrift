# 0002: Consolidate Website localization ownership

**Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1, approved by owner on 2026-09-26)

**What to build:** Consolidate Website-owned next-intl routing, request configuration, navigation helpers, and messages inside the App Router's localization boundary so that the later root migration carries one coherent localization owner. Keep every supported locale, route, metadata behavior, and shared language-control interaction equivalent.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0001-establish-website-import-and-test-boundaries.ticket.md`

**Evidence:** `.audits/reviews/website-foundation-ticket-0002-2026-09-26.md` and `.audits/reports/website-foundation-ticket-0002-2026-09-26.md`, plus final integrated review `.audits/reviews/website-foundation-ticket-0004-2026-09-26.md`; resolved base and `HEAD` `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`, with each uncommitted implementation snapshot recorded in its review

- [x] Website-owned next-intl routing, request configuration, navigation helpers, and messages share the App Router's `lib/i18n` ownership boundary.
- [x] next-intl configuration resolves the relocated request boundary without a compatibility copy or private production export for tests.
- [x] The supported locale set, default locale, explicit prefixes, disabled locale detection, and disabled locale cookie remain unchanged.
- [x] Localized home and pricing routes retain their current route generation, metadata, canonical links, and language alternates.
- [x] The shared language control remains owned by the shared React package while Website-specific route, query, fragment, drawer, and focus behavior remains owned by Website.
- [x] No prohibited parent traversal or source-wide catch-all alias is reintroduced.
- [x] Website typecheck, production build, localized route checks, and relevant Early Access unit and coverage checks pass after consolidation.
- [x] No broad localization, component, App Router composition, content, styling, state, accessibility, or performance redesign is introduced.
