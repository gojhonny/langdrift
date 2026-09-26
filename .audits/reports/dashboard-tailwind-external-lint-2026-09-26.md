# N12 external lint provenance

Approved provenance base and execution HEAD:
`1cdede8a39f56c62a57b63e9933c85df5e7f8850`.
An isolated managed checkout at that exact commit received
`pnpm install --frozen-lockfile` (pass, 0), then `pnpm lint` (failed, 1).
The final N12 checkout independently ran `pnpm lint` (failed, 1).

Both runs report **18 errors and one informational diagnostic**. Normalized
file/line/rule diagnostic lists are identical. The affected files, root
`package.json` lint command, and `biome.json` are byte-identical to the approved
base (verified by reading Git blobs and comparing actual bytes, not only status).
The Biome version remains 2.3.15. N12's lock delta only declares Dashboard helper
and browser dependencies; neither lint behavior nor these owners changed.

| Owner/file | Exact existing error location |
| --- | --- |
| Docs `app/[[...mdxPath]]/page.tsx` | 4:54 and 5:28 |
| Docs `app/github-star.tsx` | 3:28 |
| Docs `app/layout.tsx` | 10:28 |
| Docs `app/robots.ts` | 3:28 |
| Docs `app/sitemap.ts` | 5:28 |
| Docs `components/package-status.tsx` | 1:26 and 2:24 |
| SSO `src/app/account-flow.tsx` | 24:8 |
| SSO `src/app/create-organization/page.tsx` | 1:29 |
| SSO `src/app/select-plan/page.tsx` | 1:29 |
| SSO `src/app/setup/page.tsx` | 1:29 |
| SSO `src/app/sign-in/page.tsx` | 1:29 |
| SSO `src/app/sign-up/page.tsx` | 1:29 |
| SSO `src/app/state-logger.tsx` | 6:34 |
| Shared React `src/vendors/smoothui/footer.tsx` | 3:23 |
| Shared React `src/vendors/smoothui/header-4.tsx` | 7:23 and 8:29 |

All 18 errors are `lint/style/noRestrictedImports`: prohibited parent-directory
traversal. Totals: Docs 8, SSO 7, shared React 3. None is changed, caused or
worsened by N12. The identical informational item is
`packages/react/src/vendors/shadcn/tooltip.test.tsx:16:9`,
`lint/complexity/noUselessFragments`; it is not counted among the 18 errors.

Classification: **proven external pre-existing failures**. Under approved
spec-v2 AC-16, they do not independently block N12, but **repository lint remains
failed**. No fix, rule suppression, new defect ticket or scope expansion was made.

Raw retained logs: `.audits/runs/n12-baseline-lint.log` and
`.audits/runs/n12-final-lint.log`. Baseline checked 391 files; candidate checked
392 after adding the harness and removing five CSS files. Counts alone are not
the provenance proof; identical diagnostics and source/config byte comparison are.

A supplemental baseline `pnpm typecheck` also failed (2), showing the known two
Dashboard theme-type errors and missing helper imports. Those are the approved
prerequisites resolved in this cycle, not external debt exemptions. Final
repository `pnpm typecheck` passes (0): 13 successful tasks, 12 cache hits and
Dashboard executed fresh. Baseline output is retained at
`.audits/runs/n12-baseline-typecheck.log`; final output at
`.audits/runs/n12-final-typecheck.log`.
