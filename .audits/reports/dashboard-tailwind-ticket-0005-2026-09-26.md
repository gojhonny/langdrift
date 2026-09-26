# Dashboard Tailwind Alignment — Ticket 0005 Audit

Contract: spec 0002 v2; ticket 0005. Base/HEAD:
`1cdede8a39f56c62a57b63e9933c85df5e7f8850`, branch
`codex/dashboard-tailwind-alignment`, uncommitted delivery. Source status and
232 individual file identities are retained in the baseline manifest. Review:
`.audits/reviews/dashboard-tailwind-ticket-0005-2026-09-26.md`.

## Identified pre-styling baseline

- Baseline: `.audits/runs/dashboard-tailwind-baseline-verified/`.
- Manifest SHA-256: `700fe88029ea29ca163303b6ce7437c1d071603cb3e0ed45d546f46d6c4eddbc`.
- Ordered source-hash JSON SHA-256: `c75296eba4d91bff7b99434c1698b4a104fe2f77ec7506a5785c8af08fa7ce8f`.
- Retained `source.tar.gz` SHA-256: `a187fc8348e13a6e5c9430d3de8c3da706e0ab16c28bd1db406328eb390ed90f`.
  Its listed source files were rechecked against the manifest before packaging;
  it contains no environment files. Restore over the recorded repository base
  to reproduce the prerequisite source, then install/build using the harness README.
- Production build ID: `VG8L1nL_wAc3bq0ZeNrO2`.
- Node 26.9.0, pnpm 10.32.1, Playwright 1.63.0, Chromium 153.0.8010.12,
  macOS arm64; DPR 1, UTC, en-US; 1440×900, 390×844, narrow 320×780.
- Fixed pixel threshold 0.15 and maxDiffPixels 20. No masks or widened tolerances.
- 28 expected images and corresponding actual images/attachments are retained
  and individually hashed by the manifests. Source hashes remained unchanged
  through both complete browser runs.

The only production prerequisite is the approved `DashboardTheme` type
narrowing from `dark | light | system` to `dark | light`. Dashboard declares
clsx 2.1.1, tailwind-merge 3.7.0 and dev-only Playwright 1.63.0. The lock delta
is 14 added lines; no unrelated upgrades. The helper remains unused. Styles,
theme values, composition behavior, shared packages and deferred markers are
unchanged. Restoring existing declared dependency links preceded this delta.

## Checks and observed results

| Command | Result / exit | Observation |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | pass / 0 | Restored declared workspace dependencies before reassessing errors |
| `pnpm --filter dashboard typecheck` | pass / 0 | Approved type correction resolves the two-mode mismatch |
| `pnpm --filter dashboard build` | pass / 0 | Production build; root and all 16 named routes plus framework not-found |
| `DASHBOARD_EVIDENCE_DIR=$PWD/.audits/runs/dashboard-tailwind-capture-verified pnpm --filter dashboard test:browser:baseline` | pass / 0 | 35 tests: 28 visual states and 7 behavioral checks |
| `DASHBOARD_EVIDENCE_DIR=$PWD/.audits/runs/dashboard-tailwind-compare-verified pnpm --filter dashboard test:browser` | pass / 0 | Independent 35-test comparison; expected images not updated |
| `pnpm test:web-quality` | pass / 0 | All original 7 files / 31 tests, assertions unchanged |
| `node_modules/.bin/biome lint apps/dashboard --files-ignore-unknown=true` | pass / 0 | 151 files |
| `node_modules/.bin/biome check apps/dashboard/e2e apps/dashboard/package.json apps/dashboard/app/lib/state/domain/dashboard-theme.domain.ts` | pass / 0 | 7 supported files; formatting/import organization |
| `node --test .agents/guardrails/biome.test.mjs` | pass / 0 | 12 promoted-enforcement fixtures |
| `./cli/drift doctor --ci` | pass / 0 | All required tool/path checks |
| `git diff --check` | pass / 0 | No whitespace errors |

The harness owns a fresh production Next server on loopback, using the existing
`next start` behavior. It verifies all named routes plus root redirect, 320px
reflow, modal/nonmodal overlays, focus containment/Escape/restoration, scroll
restoration, filters, voice response, theme switching, 180ms transitions,
reduced motion, Japanese persistence, and independent global-error recovery.
Screenshots cover shell/pages/charts, both themes and sizes, overlays/focus,
right-edge tooltip placement, Japanese Settings, and the deliberately light
fallback. Existing tests retain timers, supported locales and route states.
Visual inspection of desktop Evolution, mobile dark chart/tooltip and global
fallback confirmed actual rendered content, not just empty layout boxes.

## Earlier attempts — not acceptance evidence

The historical prerequisite report records the initial failed typecheck/build.
The narrow v2 approval resolved that blocker. A missing-expected-image diagnostic
failed as intended, demonstrating that compare mode cannot silently accept a
baseline. The first 31-test capture/compare passed mechanically but omitted
settled desktop chart content; those runs remain retained, not accepted.
Review also required explicit tooltip coverage and passing candidate retention.
The first corrected capture failed on an incorrect tooltip locator and was
interrupted (130); a focused retry failed (1) on its leftover server port.
The known harness server was stopped, the locator corrected, and all four
tooltip diagnostics passed before the final complete capture/comparison.
These were harness-development/infrastructure failures, not product regressions.

Repository lint was also executed: **failed / 1**, 18 prohibited-import errors
(Docs 8, SSO 7, shared React 3) and one informational fragment diagnostic.
A fresh locked installation at the approved baseline reproduced the same
18 errors. These source/config paths have no N12 diff. This is preliminary
AC-16 provenance, not a passing lint gate or final integrated gate evidence.
Repository typecheck/build and final combined AC-16 verification belong to 0008
and are not claimed complete here.

## Acceptance mapping and decision

AC-01: exact merged predecessor base recorded. AC-02: bounded approved repair
and dependency ownership verified. AC-03: separately identified renderable
pre-styling source and accepted baseline captured and cleanly compared.
AC-13: repository-owned harness/setup plus retained source/artifacts support
reproduction; no production test API or machine-specific browser path.
Initial AC-14/15 pass as enumerated. Ticket-specific Review and Audit satisfy
their AC-17 support; deferred markers remain for AC-18.

Ticket 0005 is **gates-complete** for this prerequisite snapshot. Tickets 0006
and 0007 may now start independently, using this same baseline. This report does
not claim styling/composition delivery, final integrated gates, or cycle closure.
