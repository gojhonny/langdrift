# 0001: Establish Website import and test boundaries

**Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1, approved by owner on 2026-09-26)

**What to build:** Establish the ownership-aware import and test boundaries that let the Website migration proceed incrementally while the current application remains operational. Make the Website's alias configuration singular and meaningful, remove the source-wide catch-all and prohibited parent traversal, preserve the events-owned registration fixture through an intentional test boundary, and make messaging browser assertions independent of Website-private production messages.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** None (can start immediately)

**Evidence:** `.audits/reviews/website-foundation-ticket-0001-2026-09-26.md` and `.audits/reports/website-foundation-ticket-0001-2026-09-26.md`, plus final integrated review `.audits/reviews/website-foundation-ticket-0004-2026-09-26.md`; resolved base and `HEAD` `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`, with each uncommitted implementation snapshot recorded in its review

- [x] The main Website TypeScript configuration extends the dedicated paths configuration and declares neither aliases nor `baseUrl` itself.
- [x] The dedicated paths configuration is the sole Website alias source and names real ownership boundaries rather than the whole source tree.
- [x] The `@/*` catch-all is absent from Website configuration and source imports.
- [x] Website source and test modules contain no direct, nested, or embedded parent-directory traversal imports, and scoped Biome enforcement passes without suppressions.
- [x] Import-group enforcement recognizes the Website's actual first-party aliases without turning alias spellings into a new canonical vocabulary.
- [x] Website validation tests consume the events-owned registration fixture through an intentional boundary that works in both TypeScript and the real test runner without copying the fixture.
- [x] Messaging browser tests no longer import Website-private production messages and still assert localized challenge-failure behavior through black-box expectations or an intentional test-support contract.
- [x] Website typecheck, production build, and relevant Early Access unit and coverage checks pass with the current application layout.
- [x] No component, hook, Jotai, Tailwind, navigation, localization, environment, or Early Access behavior redesign is introduced.
