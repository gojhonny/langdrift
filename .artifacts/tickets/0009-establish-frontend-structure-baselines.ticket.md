# 0009: Establish both-surface structural baselines

**Spec:** `.artifacts/specs/0003-frontend-structure-component-conformance.spec.md` (approved version 1)

**What to build:** Capture the completed N12 source baseline and close the Website header/demo observation gap before any structural production migration.

**Status:** ready-for-agent

**Approval:** breakdown version 1 approved under the owner's explicit next-cycle auto approval — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** None (can start immediately)

**Evidence:** `.audits/reviews/frontend-structure-ticket-0009-2026-09-26.md`, `.audits/reports/frontend-structure-ticket-0009-2026-09-26.md`; final manifest SHA-256 `2f323a5f489265aa327f8d37246ddf845766b76042225a42df87fb6d6eea9370`.

- [x] Archive/hash the starting source without secrets; record HEAD/status and distinguish prior N12 work. (AC-01)
- [x] Existing Dashboard matrix and Website route/header/chart/scenario/evidence appearance and interaction characterization pass before extraction, with comparable reproducible capture conditions. (AC-08, AC-09)
- [x] Record existing relevant unit/coverage, build/typecheck and repository check results, and establish availability of the real integration/browser environment. Preserve failed checks and provenance. (AC-10–12)
- [x] Review/Audit validate the harness and retained baseline; no production refactor in this ticket. (AC-14)

Final harness-correction addendum: `.audits/reports/frontend-structure-final-2026-09-26.md`
and its independent Review supersede the slice-only closure. Corrected capture
mechanics passed against both the archived original source and final candidate,
with unchanged v7 images/tolerance. Final source identity:
`23bec95a784a7dd7da51cdaae312d3f792a8c1300ce63b7f3fce488e60c55dfa`.
