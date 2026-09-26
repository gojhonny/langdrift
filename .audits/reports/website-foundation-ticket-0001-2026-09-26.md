# Website Foundation Alignment — Ticket 0001 audit

- **Ticket:** `.artifacts/tickets/0001-establish-website-import-and-test-boundaries.ticket.md`
- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1)
- **Review:** `.audits/reviews/website-foundation-ticket-0001-2026-09-26.md`
- **Resolved base:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **HEAD:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **Implementation snapshot:** the uncommitted status recorded in the review;
  this report and later tracker-only metadata are evidence, not product-source
  changes to that reviewed snapshot.

## Acceptance mapping

1. **Main TypeScript configuration extends the paths owner — pass.**
   Inspection confirms `apps/website/tsconfig.json` extends
   `./tsconfig.paths.json` and declares neither `paths` nor `baseUrl`.
   `node node_modules/typescript/bin/tsc -p apps/website/tsconfig.json --noEmit`
   exited 0.
2. **Dedicated paths configuration is the sole, ownership-aware alias source —
   pass.** `apps/website/tsconfig.paths.json` owns the complete Website alias
   set. Both review axes reported no finding against the ownership names.
3. **No `@/*` catch-all — pass.** The scoped `rg` search over Website source,
   configuration, Vitest, Biome, and the messaging test returned no matches
   (exit 1, the expected no-match result).
4. **No Website parent traversal and scoped enforcement passes — pass.** The
   scoped traversal search returned no matches. `biome lint apps/website
   --files-ignore-unknown=true --max-diagnostics=300` exited 0 after checking 82
   files. No suppression was added.
5. **Import grouping recognizes actual first-party aliases — pass.** The
   formatter-disabled Biome assist check over Website, the messaging test, and
   `vitest.config.mts` exited 0 after checking 84 files. The Standards review
   found no vocabulary or grouping violation.
6. **Events-owned fixture resolves in TypeScript and the real test runner —
   pass.** The Website test imports
   `@event-testdata/registration.json`; the alias targets the existing
   `packages/events/envelopes/testdata` owner. TypeScript exited 0 and Vitest
   executed all 42 tests successfully without a copied fixture.
7. **Messaging browser assertion is independent of private Website messages —
   pass.** The messaging E2E tree contains no Website-private message import.
   Its locale-keyed black-box expectations still drive the challenge-failure
   assertion. Playwright test discovery exited 0 and listed all three scenarios,
   including the all-locales failure test. Full browser execution was not
   required for this boundary ticket and was not represented as run.
8. **Typecheck, production build, unit tests, and coverage — pass.** TypeScript
   exited 0. The exact normal build wrapper command with default Next 16
   Turbopack exited 0 outside the restricted sandbox, compiling the localized
   home and pricing routes for `en`, `pt-BR`, `zh-Hant`, and `ja`, plus Proxy.
   Vitest passed 6 files and 42 tests. Coverage exited 0 with 95.12% statements,
   90.52% branches, 88.23% functions, and 95.68% lines.
9. **No deferred redesign — pass.** The two-axis review found no scope creep or
   documented-standard violation. Changes are limited to import ownership,
   test boundaries, their configuration, and the owner-authorized restoration
   of the runtime prerequisite.

## Commands and results

| Check | Result |
| --- | --- |
| Website TypeScript | exit 0 |
| Early Access Vitest | exit 0; 6 files, 42 tests |
| Early Access coverage | exit 0; thresholds exceeded |
| Website Biome lint | exit 0; 82 files |
| Import-organization check | exit 0; 84 files |
| Promoted Biome guardrail fixtures | exit 0; 12 tests |
| Wrapper `sh -n` syntax | exit 0 |
| `git diff --check` | exit 0 |
| Parent-traversal search | expected no-match exit 1 |
| Catch-all alias search | expected no-match exit 1 |
| Private Website message import search in messaging E2E | expected no-match exit 1 |
| Playwright discovery | exit 0; 3 tests |
| Default Turbopack production build through restored wrapper | exit 0 |
| Standards review | 0 findings |
| Spec review after build evidence refinement | 0 findings |

## Supporting runtime smoke

The restored start wrapper launched the generated standalone server on its
default `0.0.0.0` host behavior at port 13010. Requests to `/` and
`/ja/pricing` returned 200, as did a copied public favicon and a copied
`_next/static` chunk. The long-running server was then intentionally stopped.
An initial sandboxed bind failed with `EPERM`; the same wrapper succeeded when
local port binding was allowed, so that first result is classified as an
environment failure before the runtime assertion.

Sandboxed default Turbopack attempts also stalled at compile and were
interrupted. The exact same default wrapper command completed outside the
restricted sandbox, so the required production-build assertion ultimately ran
and passed. The separate webpack diagnostic also passed but is not used as the
default-build result.

## Audit result

All Ticket 0001 acceptance criteria have passing evidence for the reviewed
implementation snapshot. No required Ticket 0001 check is represented as
passing without execution or review evidence.
