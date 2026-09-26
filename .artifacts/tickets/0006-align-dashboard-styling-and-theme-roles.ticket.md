# 0006: Align application styling and semantic theme roles

**Spec:** `.artifacts/specs/0002-dashboard-tailwind-alignment.spec.md` (version 2, approved by owner on 2026-09-26; this ticket's obligations are unchanged from version 1)

**What to build:** Express Dashboard-owned application styling through Tailwind and recurring surface colors/fonts through semantic theme utilities, retaining only technically justified integration CSS. Preserve the visible and interactive experience demonstrated by Ticket 0005's baseline, including shared chart styling and the independent error fallback.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0005-establish-dashboard-baseline-and-browser-harness.ticket.md`

**Evidence:** `.audits/reviews/dashboard-tailwind-ticket-0007-2026-09-26.md` and `.audits/reports/dashboard-tailwind-ticket-0007-2026-09-26.md` — composition review and affected styling revalidation pass with all 35 browser checks and scoped gates; manifest SHA-256 `8c02cfb54376c0be8777b9e10211628a6b2f40cebfbe73fbe6066686f532ee74`. Ticket 0006's independent styling evidence remains in its own Review/Audit.

**Spec traceability:** owns AC-04, AC-05, and AC-07; demonstrates AC-08–12 for its styling delta. Uses the established harness and scoped checks; Ticket 0008 owns the final combined verification.

- [x] Every Dashboard-owned CSS responsibility and its consumers are accounted for. Component, feature, layout, and responsive styling use Tailwind utilities rather than application rules relocated into a global stylesheet. (AC-04)
- [x] Every retained CSS responsibility and continued file separation has a technical justification under the canonical integration exception. Required framework, shared stylesheet, token, and theme integration continues working; literal zero-CSS and a fixed file layout are not imposed. (AC-05)
- [x] Reusable surface color/font roles use semantic Tailwind utilities backed by tokens, preserving existing values and distinct text/chart contrast roles. Palette, typography, brand treatment, chart contracts, and the deliberately light fallback remain unchanged. (AC-07)
- [x] The styling delta passes the baseline comparisons at the required desktop/mobile and light/dark states. Artifacts and meaningful differences are reviewed without widening thresholds, masking changed UI, or replacing the original baseline with candidate output. (AC-08)
- [x] Reflow, overlays, focus indicators, scrolling, transitions, reduced motion, and other affected interaction behavior remain equivalent. Functional theme/color-scheme and scroll-lock DOM integration is preserved. (AC-09, AC-12)
- [x] Route smoke and localization behavior remain green, including a browser language change to a non-Latin locale. Current loading/not-found/error behavior and the global-error fallback retain their appearance and recovery semantics. (AC-10, AC-11)
- [x] Changes remain within styling/semantic-role ownership. Class-composition migration, component/hook/props decomposition, shared-package changes, state redesign, and deployment work are not included. New/changed imports respect canonical ownership without prohibited traversal. (AC-12)
- [x] The styling slice is independently verifiable with Ticket 0005's harness and scoped checks; its Review/Audit evidence identifies the examined source and baseline. Deferred calibration markers are preserved. (Supports AC-14, AC-15, AC-17, AC-18)

## Coordination

Ticket 0007 is a sibling, not a prerequisite. Coordinate overlapping edits at
the concern level: this ticket owns CSS responsibilities, semantic utilities,
and token values; Ticket 0007 owns composition calls and conflict handling.
Reuse the same harness and assertions, identify each delta in the evidence,
and serialize conflicting edits when needed. Neither ticket transfers its
implementation or acceptance obligations to the other. Ticket 0008 verifies
their combined snapshot.
