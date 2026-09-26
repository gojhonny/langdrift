# Website Foundation Alignment — Ticket 0002 audit

- **Ticket:** `.artifacts/tickets/0002-consolidate-website-localization-ownership.ticket.md`
- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1)
- **Review:** `.audits/reviews/website-foundation-ticket-0002-2026-09-26.md`
- **Resolved base:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **HEAD:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **Implementation snapshot:** the uncommitted status recorded in the review;
  this report and tracker-only evidence metadata do not alter the reviewed
  product source.

## Acceptance mapping

1. **One App Router localization owner — pass.** Routing, navigation, request
   configuration, and all Website messages now live beneath
   `apps/website/src/app/lib/i18n`. The former `src/i18n` and `src/messages`
   owners are absent.
2. **next-intl resolves the relocated request boundary — pass.** The plugin
   points directly at `src/app/lib/i18n/request.ts`; no compatibility copy or
   test-only production export exists. The default Turbopack build exited 0.
3. **Locale contract is unchanged — pass.** The relocated routing module is
   byte-identical to the pre-relocation tracked module and still declares the
   four supported locales, `en` default, explicit `pt-BR` and `zh-Hant`
   prefixes, `as-needed` mode, disabled detection, and disabled cookie.
4. **Localized routes and metadata remain equivalent — pass.** Next generated
   home and pricing routes for `en`, `pt-BR`, `zh-Hant`, and `ja`. Standalone
   requests to all eight public route forms returned 200. The Portuguese
   pricing response retained its canonical URL and alternates for all four
   locales plus `x-default`.
5. **Shared and Website language-control ownership remains intact — pass.**
   Website still consumes `LanguageSwitcher` from `@repo/react`; Website route,
   query, fragment, drawer, focus, and message integration code was relocated
   or left unchanged rather than redesigned. Both review axes reported no
   finding.
6. **No prohibited traversal or catch-all alias — pass.** Scoped searches found
   neither legacy localization paths nor parent traversal. The existing
   catch-all search remains empty. Website Biome lint exited 0, and the
   import-organization check exited 0 after checking 83 files.
7. **Typecheck, production build, route checks, unit tests, and coverage —
   pass.** TypeScript exited 0. The exact default wrapper/Turbopack build exited
   0. The eight-route standalone matrix returned 200. Vitest passed all 42
   tests; coverage exited 0 at 95.12% statements and 90.52% branches.
8. **No deferred redesign — pass.** Review found no scope creep or documented
   standards violation. Message content and the locale contract were preserved;
   no broad localization, composition, styling, state, accessibility, or
   performance change was introduced.

## Commands and results

| Check | Result |
| --- | --- |
| Website TypeScript after proxy correction | exit 0 |
| Default Turbopack production build through wrapper | exit 0; 8 localized routes plus Proxy generated |
| Standalone localized route matrix | 8 of 8 responses returned 200 |
| Pricing canonical and language alternates | canonical plus 5 alternates present |
| Early Access unit tests | exit 0; 42 tests |
| Early Access coverage | exit 0; thresholds exceeded |
| Website Biome lint | exit 0; 82 files |
| Import-organization check | exit 0; 83 files |
| Legacy localization path search | expected no-match exit 1 |
| Parent-traversal search | expected no-match exit 1 |
| `git diff --check` | exit 0 |
| Standards review | 0 findings |
| Spec review | 0 findings |

## Audit result

All Ticket 0002 acceptance criteria have passing evidence for the reviewed
implementation snapshot. No failed or unexecuted check is represented as a
pass.
