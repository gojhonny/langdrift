# 0010: Align shared primitive and icon ownership

**Spec:** `.artifacts/specs/0003-frontend-structure-component-conformance.spec.md` (approved version 1)

**What to build:** Give current generic primitives and icon access their shared public owner while preserving rendered styling and override behavior.

**Status:** ready-for-agent

**Approval:** breakdown version 1 approved under the owner's explicit next-cycle auto approval — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0009-establish-frontend-structure-baselines.ticket.md`

**Evidence:** `.audits/reviews/frontend-structure-ticket-0010-2026-09-26.md`, `.audits/reports/frontend-structure-ticket-0010-2026-09-26.md`; manifest SHA-256 `e8aaa595fffc7b5e629ee36b46b96706e71181cdccfa654f57fba2b24040fe93`.

- [x] Targeted shared Card/Kicker contracts and explicit public icon exports are intentional; Dashboard no longer duplicates the icon dependency or app-local base primitives; unused Muted is not made public. (AC-06, AC-07)
- [x] New shared components conform without shared vendor/helper-wide changes; preserve original DOM, classes, conflict resolution and existing consumers. (AC-02, AC-04, AC-13)
- [x] Dashboard baseline, affected shared/app type/build/tests/lint and independent Review/Audit pass at this slice. (AC-08, AC-11, AC-14)
