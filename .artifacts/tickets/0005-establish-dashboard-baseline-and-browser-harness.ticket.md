# 0005: Establish the renderable baseline and browser harness

**Spec:** `.artifacts/specs/0002-dashboard-tailwind-alignment.spec.md` (version 2, narrow prerequisite extension approved by owner on 2026-09-26)

**What to build:** Establish a reproducibly buildable Dashboard and repository-owned browser harness that preserve the current experience as an independently identifiable baseline. Restore the locked installation, reassess diagnostics, and make only the approved minimum dependency/import repairs. Capture the renderable baseline before changing application styling, semantic roles, theme values, or class-composition behavior.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** None (can start immediately)

**Evidence:** `.audits/reviews/dashboard-tailwind-ticket-0005-2026-09-26.md` and `.audits/reports/dashboard-tailwind-ticket-0005-2026-09-26.md` — exact prerequisite source and 35-test capture/35-test comparison at base/HEAD `1cdede8a39f56c62a57b63e9933c85df5e7f8850`; baseline manifest SHA-256 `700fe88029ea29ca163303b6ce7437c1d071603cb3e0ed45d546f46d6c4eddbc`.

**Spec traceability:** owns AC-01, AC-02 prerequisite preparation, AC-03, and AC-13; establishes initial AC-14–15 evidence. Its baseline and harness support the preservation criteria verified by Tickets 0006–0007 and the final evidence in Ticket 0008.

- [x] The execution base contains merged Website Foundation and is recorded against the approved baseline; material intervening divergence is reconciled before evidence is claimed. (AC-01)
- [x] The locked dependency installation is restored and diagnostics are reassessed. Any remaining dependency/import repair and lockfile change is minimal, justified, and identifiable; broader logic or architectural repairs return to the owner. The explicitly approved exception removes the unsupported `system` member from DashboardTheme while preserving its two-mode runtime. Helper and browser-tool dependencies have intentional owners. (AC-02, spec v2)
- [x] Dashboard is buildable and renderable without activating the unused conflict-aware helper or changing stylesheet behavior, semantic roles, palette, typography, or existing visual defects during preparation. (AC-02, AC-03)
- [x] A repository-owned harness and reproduction instructions run against the built application using supported dependencies, without machine-specific executable paths, ignored historical scripts, or production testing APIs. (AC-13)
- [x] The baseline matrix covers the route inventory and representative desktop/mobile, light/dark, shell/page/chart, overlay, focus, motion, localization, and recovery boundaries required by the spec, including the global-error fallback. Its coverage rationale and actual invocations are documented. (AC-03, AC-13)
- [x] The repository provenance base and renderable pre-styling snapshot are separately identified, including prerequisite changes, source identities, dependency state, capture conditions, and retained artifacts. The browser baseline is captured and reproducibly checked before either migration ticket starts. (AC-03)
- [x] Comparison tolerances and permitted rendering noise are declared before migration. The harness stabilizes nondeterminism without masking migrated UI and exercises transitions and reduced motion separately from stabilized screenshots. (AC-03, AC-13)
- [x] Dashboard typecheck, production build/start, baseline browser execution, scoped checks, and existing Dashboard interaction/localization/route-state tests pass. The existing web-quality suite runs without weakened assertions; unrelated failures follow the spec's provenance rules. An unavailable required environment leaves this ticket unpassed. (Initial AC-14, AC-15)
- [x] Review and Audit bind this ticket's checks and baseline artifacts to its actual snapshot. No final integrated migration result is claimed, and deferred calibration markers remain intact. (Supports AC-17, AC-18)

## Handoff

This ticket supplies one baseline and one harness to both migration tickets.
Only after it is `gates-complete` may either migration begin. Ticket 0006 owns
styling and semantic roles; Ticket 0007 owns class-composition behavior. Neither
recreates or replaces the pre-migration baseline from its candidate output.
