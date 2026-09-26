# Website Foundation Alignment — Ticket 0004 audit

- **Ticket:** `.artifacts/tickets/0004-complete-root-nextjs-foundation.ticket.md`
- **Spec:** `.artifacts/specs/0001-website-foundation-alignment.spec.md` (version 1)
- **Review:** `.audits/reviews/website-foundation-ticket-0004-2026-09-26.md`
- **Resolved base:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **HEAD:** `fba2d02a5f688b3fced3f3b1620e60b340e1f3e2`
- **Implementation snapshot:** the uncommitted product-source status recorded in
  the review; this report and tracker-only evidence metadata do not alter that
  reviewed source.

## Acceptance mapping

1. **Legacy Website source wrapper absent — pass.** `apps/website/src` does not
   exist. Searches over active Website configuration, tests, runtime, and
   documentation found no consumer resolving through that path.
2. **Root Next.js ownership — pass.** `apps/website/app` and
   `apps/website/proxy.ts` are the only active App Router and proxy owners. The
   default Next.js 16 Turbopack build discovered Proxy and generated all
   localized home and pricing routes.
3. **Localization under `app/lib/i18n` — pass.** Routing, navigation, request
   configuration, and messages live beneath `apps/website/app/lib/i18n`.
   `next.config.ts` resolves the request configuration there, and typecheck,
   build, and localized route smoke passed without a compatibility copy.
4. **Private manifest metadata — pass.** The private `website` package keeps its
   identity, scripts, and dependencies while omitting publication version
   metadata.
5. **Root Turbo inheritance — pass.** `apps/website/turbo.json` is absent. The
   Website build executed through the inherited root task contract and its own
   package script.
6. **LangDrift build/start wrappers — pass.** The Website scripts still call
   `cli/src/runtime/next-build.sh` and `next-start.sh`. The restored wrappers
   are byte-identical to their established pre-deletion versions. The production
   build passed; the standalone server bound to the wrapper's default
   `0.0.0.0`, served every localized home/pricing route, the favicon, and an
   emitted CSS asset, then was intentionally stopped.
7. **Relocation-sensitive consumers — pass.** Semantic aliases have one owner in
   `tsconfig.paths.json`; the source catch-all and Website parent traversal are
   absent. TypeScript, Vitest, Biome, next-intl, the production build, runtime
   smoke, messaging browser discovery, and active documentation resolve the
   final structure.
8. **Complete behavioral equivalence — partial.** The localized route matrix,
   metadata/canonical alternates, styles, static assets, content, state-facing
   modules, environment boundaries, and all 42 Early Access unit tests passed.
   Full Early Access integration/browser equivalence remains unproved because
   its Docker environment was unavailable.
9. **Biome and promoted guardrails — pass.** The scoped Website check passed on
   81 files, the promoted guardrail suite passed all 12 fixtures, formatting and
   import organization pass, and both independent review axes found no code or
   standards defect.
10. **Repository-required checks — fail/open.** `./cli/drift doctor --ci`
    passed. `pnpm lint` failed on 18 diagnostics in out-of-scope Docs, SSO, and
    shared React paths. `pnpm typecheck` failed in Dashboard because required
    packages such as `next-intl`, `jotai`, `jotai-immer`, `clsx`, and
    `tailwind-merge` are unavailable there, with downstream type errors.
    `pnpm build` failed at the same Dashboard dependency boundary and Turbo
    aborted remaining work. These are repository gate failures; they are not
    reclassified as passing and were not expanded into this Website migration.
11. **Early Access evidence — partial/open.** Six unit files and all 42 tests
    passed. Coverage passed at 95.12% statements, 90.52% branches, 88.23%
    functions, and 95.72% lines. The Docker-backed integration/browser harness
    did not run because `docker info` and `./cli/drift doctor early-access`
    could not connect to a Docker daemon. Privacy, localized feedback, and
    durable messaging therefore remain unpassed at that seam.
12. **Review and audit handoff — pass.** Independent Standards and Spec reviews
    examined the fixed-base plus uncommitted delivery. This audit records all
    passed, failed, partial, and unexecuted checks without upgrading a gap.

## Commands and results

| Check | Result |
| --- | --- |
| Website TypeScript | exit 0 |
| Default Turbopack production build through Website wrapper | exit 0; locale matrix plus Proxy generated |
| Standalone localized route/static-asset smoke | exit 0; 8 routes, favicon, and emitted CSS returned 200 |
| Early Access unit tests | exit 0; 6 files, 42 tests |
| Early Access coverage | exit 0; thresholds exceeded |
| Website Biome check | exit 0; 81 files |
| Promoted Biome guardrail fixtures | exit 0; 12 tests |
| `./cli/drift doctor --ci` | exit 0 |
| `git diff --check` | exit 0 |
| Legacy `apps/website/src` existence assertion | exit 0; path absent |
| Website parent-traversal search | expected no-match exit 1 |
| Website catch-all/legacy-path search | expected no-match exit 1 |
| `pnpm lint` | exit 1; repository gate failed outside Website scope |
| `pnpm typecheck` | exit 2; repository gate failed in Dashboard |
| `pnpm build` | exit 1; repository gate failed in Dashboard and Turbo aborted dependents |
| `docker info` | exit 1; daemon socket unavailable before assertions |
| `./cli/drift doctor early-access` | exit 1; daemon socket unavailable before assertions |
| Early Access integration/browser execution | not run; required Docker environment unavailable |
| Standards review | 0 findings |
| Spec review | 0 implementation findings; 2 open evidence gaps |

## Audit result

Ticket 0004 is implemented but remains `implemented-awaiting-gates`. Its
structural migration and scoped Website checks pass, but spec AC-21 and AC-22
are not satisfied: repository lint/typecheck/build failed, and Docker-backed
Early Access integration/browser proof did not run. The SDD cycle is not
closed, and no failed or unexecuted check is represented as passing.
