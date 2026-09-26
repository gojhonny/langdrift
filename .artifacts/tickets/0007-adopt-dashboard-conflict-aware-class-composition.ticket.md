# 0007: Adopt conflict-aware Dashboard class composition

**Spec:** `.artifacts/specs/0002-dashboard-tailwind-alignment.spec.md` (version 2, approved by owner on 2026-09-26; this ticket's obligations are unchanged from version 1)

**What to build:** Give Dashboard conditional classes and default/consumer overrides predictable conflict-aware composition using the approved `clsx` and `tailwind-merge` behavior. Migrate applicable join-only composition sites while preserving the intended rendered defaults and overrides demonstrated by Ticket 0005's baseline.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0005-establish-dashboard-baseline-and-browser-harness.ticket.md`

**Evidence:** `.audits/reviews/dashboard-tailwind-ticket-0007-2026-09-26.md` and `.audits/reports/dashboard-tailwind-ticket-0007-2026-09-26.md` — composition review and affected styling revalidation pass with all 35 browser checks and scoped gates; manifest SHA-256 `8c02cfb54376c0be8777b9e10211628a6b2f40cebfbe73fbe6066686f532ee74`. Ticket 0006's independent styling evidence remains in its own Review/Audit.

**Spec traceability:** completes AC-06 and verifies AC-02 dependency ownership for the adopted helper; demonstrates AC-08, AC-09, and AC-12 for its composition delta. Ticket 0008 owns the final combined verification.

- [x] The adopted Dashboard helper uses `clsx` and `tailwind-merge` with intentionally owned, reproducible dependencies. The shared public helper remains unchanged. (AC-02, AC-06)
- [x] All Dashboard composition sites needing conditional/default/override conflict handling are accounted for and migrated; join-only behavior is absent from those sites. Static strings are not wrapped merely for consistency, and no universal helper path or suffix is invented. (AC-06)
- [x] Intended rendered defaults and consumer overrides remain equivalent. Conflict-resolution changes are inspected as potential regressions; class-string assertions alone do not establish preservation. (AC-06, AC-08)
- [x] Browser comparisons for affected states pass against Ticket 0005's retained baseline. Meaningful differences receive artifact-backed review without replacing the baseline, masking migrated UI, or widening tolerances to accept substantive changes. (AC-08)
- [x] Affected filters, selected states, navigation, overlays, focus, scrolling, transitions, and reduced-motion behavior pass the existing harness and interaction assertions. (AC-09)
- [x] This delta remains within class-composition ownership; it does not migrate CSS responsibilities or redesign semantic roles. No shared-helper rewrite, component/hook/props decomposition, state redesign, or deployment change is introduced. New/changed imports respect canonical ownership without prohibited traversal. (AC-12)
- [x] The composition slice is independently verifiable with Ticket 0005's harness and scoped checks; its Review/Audit evidence identifies the examined source and baseline. Deferred calibration markers, including the class-composition marker pending Refinement approval, remain intact. (Supports AC-14, AC-15, AC-17, AC-18)

## Coordination

Ticket 0006 is a sibling, not a prerequisite. It owns application styling and
semantic roles. Reuse Ticket 0005's harness, coordinate overlapping edits,
and keep composition acceptance attached to this ticket. If a class-list
adjustment is necessary to preserve an override, coordinate it with the styling
owner and record its reason without expanding into a second styling migration.
Serialize conflicting edits as needed; Ticket 0008 checks the combined result.
