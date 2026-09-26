# 0012: Conform Website component boundaries

**Spec:** `.artifacts/specs/0003-frontend-structure-component-conformance.spec.md` (approved version 1)

**What to build:** Extract Website's existing components/hooks and normalize props without changing header, demo, localization or registration behavior.

**Status:** ready-for-agent

**Approval:** breakdown version 1 approved under the owner's explicit next-cycle auto approval — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0009-establish-frontend-structure-baselines.ticket.md`

**Evidence:** `.audits/reviews/frontend-structure-ticket-0012-2026-09-26.md`, `.audits/reports/frontend-structure-ticket-0012-2026-09-26.md`; manifest SHA-256 `4950cc82a849adb5ad7e8572454a44f7ae2fe9d1c351e884bbbd9f3bc0a7e732`.

- [x] All Website production components/props/hooks conform with concern colocation and intentional imports; preserve domain owners and framework boundaries. (AC-02–04, AC-07)
- [x] Original captured Website appearance/interactions, chart/demo/inspector/header remount behavior and Early Access contract remain intact; no UI/state/styling redesign. (AC-08–10, AC-13)
- [x] Website/affected shared checks and relevant behavior suites pass with independent Review/Audit; real final integration evidence is not waived. (AC-11, AC-14)

Final evidence addendum: `.audits/reports/frontend-structure-final-2026-09-26.md`
and its independent Review bind the corrected capture harness, passing11/26
comparison and actual Early Access integration/browser evidence to final source
`23bec95a784a7dd7da51cdaae312d3f792a8c1300ce63b7f3fce488e60c55dfa`.
Earlier failed attempts remain failed; no expected images/tolerance were changed.
