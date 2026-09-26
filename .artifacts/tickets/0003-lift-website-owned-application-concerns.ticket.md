# 0003: Lift Website-owned application concerns

**Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1, approved by owner on 2026-09-26)

**What to build:** Move the Website's existing non-localization concerns out of the legacy wrapper while preserving their conceptual ownership and observable behavior. Retarget the established aliases and update active test, coverage, enforcement, environment, and documentation consumers without turning relocation into a component, styling, state, or Early Access redesign.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0001-establish-website-import-and-test-boundaries.ticket.md`

**Evidence:** `.audits/reviews/website-foundation-ticket-0003-2026-09-26.md` and `.audits/reports/website-foundation-ticket-0003-2026-09-26.md`, plus final integrated review `.audits/reviews/website-foundation-ticket-0004-2026-09-26.md`; resolved base and `HEAD` `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`, with each uncommitted implementation snapshot recorded in its review

- [x] Existing Website UI composition, supporting data and helpers, environment modules, shared state, styles, and colocated tests are owned directly by the Website workspace rather than the legacy wrapper.
- [x] Ownership-aware aliases are retargeted to the relocated concerns without changing their semantic meaning or reintroducing parent traversal.
- [x] Active unit-test and coverage discovery follows the relocated Early Access tests and implementation.
- [x] Active engineering and product documentation resolves the relocated Website environment boundary; historical research and snapshot evidence remain historical.
- [x] Client-safe and server-only environment configuration retain their current exposure and fail-fast behavior.
- [x] Website local state, shared Jotai state, form state, development inspectability, styles, assets, theme behavior, and content remain observably equivalent.
- [x] Early Access validation, Turnstile verification, submission mapping, feedback, privacy, and durable-acceptance semantics remain unchanged.
- [x] Website typecheck, production build, and relevant Early Access unit and coverage checks pass after the relocation batch.
- [x] No component-per-file, props-interface, hook, Jotai decomposition, Tailwind migration, broad accessibility, or Core Web Vitals work is introduced.
