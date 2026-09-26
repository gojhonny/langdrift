# Frontend Structure — Ticket 0012 Audit

Spec0003v1/Ticket0012. Review:
`.audits/reviews/frontend-structure-ticket-0012-2026-09-26.md`.
Base/HEAD `1cdede8a39f56c62a57b63e9933c85df5e7f8850`.
Candidate `.audits/runs/website-structure-ticket12-repeat/manifest.json`,
SHA-256 `4950cc82a849adb5ad7e8572454a44f7ae2fe9d1c351e884bbbd9f3bc0a7e732`, build `s2v_U-OW5VjbZQs6X3r1K`.
Source/baseline integrity checks are true. Original v7 expected images remain
immutable; no tolerance, mask, screenshot or assertion changes after extraction.

| Check | Result / exit | Observation |
| --- | --- | --- |
| read-only TypeScript AST inventory | passed / 0 | 28 production components, one/file, all prop contracts local interfaces |
| `pnpm --filter website typecheck` | passed / 0 | complete Website contract |
| `pnpm coverage:early-access` | passed / 0 | 42tests; statements95.2%, branches90.52%, functions88.23%, lines95.79% |
| scoped `pnpm exec biome check apps/website/app apps/website/components --files-ignore-unknown=true` | passed / 0 | formatting/import/lint |
| first `pnpm --filter website test:browser` | **failed / 1** | 10passed, modified-link page-event timeout; all26 images passed |
| unchanged full `test:browser` repeat | passed / 0 | build0, all11tests and26comparisons |
| `git diff --check` | passed / 0 | whitespace |

Logs are `.audits/runs/frontend-structure-origin/ticket12-*.log`.
First browser trace is retained in `website-structure-ticket12/results/`.
Classification: browser-automation/environment observation failure, not a
demonstrated application regression. Trace records the original page id
`page@190cadd86b4c409dbd7d8be349d16479`, click completion, and a distinct
`page@92597499636d83c462a83a6aa4a4a52c` requesting the Japanese document
(with preserved query) and receiving HTTP200. Playwright's context page event
did not arrive before timeout despite that new document. The original page
remained rendered in English. Source behavior matched the baseline in independent
AST review, and the unchanged full retry passed the actual event/URL assertions.
No production or harness patch was made to obtain the pass; the failed attempt
remains failed. Final Ticket0013 repeats the complete browser gate.

AC-02–04/07 Website structural obligations and AC-08/09/11/13/14 slice evidence
pass. EarlyAccess unit behavior is preserved; AC-10's full real integration/browser
suite is deliberately reserved for final Ticket0013, not waived. Root checks and
bounded refinement remain final obligations. Ticket0012 can be gates-complete.
