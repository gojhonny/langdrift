# 0008: Verify the integrated migration and complete gate evidence

**Spec:** `.artifacts/specs/0002-dashboard-tailwind-alignment.spec.md` (version 2, approved by owner on 2026-09-26; includes final verification of the named prerequisite exception)

**What to build:** Deliver final evidence that the combined Dashboard styling and class-composition migration satisfies the approved contract without changing appearance or behavior. Run the complete agreed browser matrix and repository checks, classify failures against the approved baseline, and complete snapshot-bound Review/Audit and refinement findings. This is an integrated verification ticket, not an additional implementation bucket.

**Status:** ready-for-agent

**Approval:** approved by owner — breakdown version 1 — 2026-09-26

**Delivery progress:** gates-complete

**Blocked by:** `.artifacts/tickets/0006-align-dashboard-styling-and-theme-roles.ticket.md`, `.artifacts/tickets/0007-adopt-dashboard-conflict-aware-class-composition.ticket.md`

**Evidence:** `.audits/reviews/dashboard-tailwind-final-2026-09-26.md` and `.audits/reports/dashboard-tailwind-final-2026-09-26.md`, including the approved retirement amendment. Final source is bound by `.audits/runs/dashboard-tailwind-retirement/manifest.json` (SHA-256 `480e1488a231984ad0b6168e2de6f83d65d0b38c85386dd3b46f1cdfd287cd52`), base/HEAD `1cdede8a39f56c62a57b63e9933c85df5e7f8850`. Review and required scoped gates pass; repository lint remains failed under proven external AC-16 classification.

**Spec traceability:** owns final AC-08–18 verification, including AC-14–17 gate closure and AC-18 refinement findings. Confirms AC-01–07 through predecessor evidence and the integrated snapshot; it does not reassign their implementation ownership.

- [x] Both migration tickets are `gates-complete`; their changes and Ticket 0005's distinct provenance/renderable baseline references are accounted for in the integrated snapshot. Review confirms AC-01–07 remain satisfied together. (AC-01–07, AC-17)
- [x] The full documented visual matrix passes for the combined candidate against the original baseline under comparable conditions. Artifacts, tolerances, permitted nondeterminism, and review of meaningful differences remain explicit. No substantive difference is accepted through baseline replacement or threshold relaxation. (AC-08)
- [x] Complete route smoke, theme/responsive, interaction, localization, keyboard/motion, and recovery checks pass, including the non-Latin locale and independent global-error fallback. (AC-09, AC-10, AC-11)
- [x] Final scope review confirms ownership boundaries, prohibited-import restrictions, functional DOM integration, and all exclusions remain intact. Existing deferred debt is not silently absorbed or marked remediated. (AC-12)
- [x] The delivered harness, dependencies, setup, and baseline/candidate instructions are reproducible from a supported checkout and do not require ignored historical scripts or machine-specific paths. (AC-13)
- [x] Dashboard typecheck, production build/start, browser comparisons, scoped lint, existing Dashboard tests, changed-file formatting/import checks, and guardrail fixtures pass. Required unavailable infrastructure remains blocking; weaker tests are not substitutes. (AC-14)
- [x] The existing web-quality suite executes without removing or weakening assertions. Dashboard results pass, and any unrelated shared-suite failure meets the required external-failure proof. (AC-15, AC-16)
- [x] All agreed repository-wide doctor, lint, typecheck, and build commands execute. Failures caused or worsened by N12 block completion. Unrelated failures are nonblocking only with reproduction against the approved baseline and evidence of no N12 contribution or worsening; they remain explicitly failed. Unresolved provenance and unavailable required evidence remain blocking. Previous-cycle classifications alone are insufficient. (AC-16)
- [x] Final Review and Audit record the resolved base, HEAD, working-tree status, relevant content identities, visual artifacts, actual commands, results, exit codes, and observed behavior. Passes apply to that snapshot; failed and unexecuted checks are never reported as passing. (AC-17)
- [x] Record the validated Tailwind conclusions, limitations, external debt, and proposed disposition of N12 and directly related calibration markers. Deferred markers remain; retirement and promotion await owner acceptance in Refinement. (AC-18)

## Failure routing and final gates

Use the established harness once for combined acceptance rather than building
a competing set of migration assertions. If integration exposes a regression,
return it to the ticket that owns the prerequisite/harness, styling, or
composition concern and repeat the affected gates after repair. Do not park
new implementation in this ticket or claim earlier evidence covers a changed
snapshot. A material contract change returns to the owner. Delivery remains
`implemented-awaiting-gates` after verification work is delivered until all
required Review/Audit gates satisfy the approved contract.
