# N12 — Dashboard Tailwind Alignment final Audit

Publication bookkeeping: the owner subsequently authorized this completed
initiative as its own prerequisite commit in the shared Frontend Structure PR.
Spec0002's stale delivery/evidence metadata is reconciled with the completed
tickets and retirement evidence; version2's approved requirements are unchanged.
The historical spec hash below identifies the document as it stood at that run,
not the later metadata-only update. Failed intermediate executions remain intact.

Approved contract: spec 0002 **version 2**, unchanged after the narrow approved
prerequisite extension. Approved breakdown remains
`0005 → (0006 and 0007) → 0008`.

## Pre-retirement snapshot identity

- Base and HEAD: `1cdede8a39f56c62a57b63e9933c85df5e7f8850` (merged Website Foundation).
- Branch: `codex/dashboard-tailwind-alignment`; uncommitted implementation,
  no staged changes, commits, push, PR, merge, publish or release.
- Spec SHA-256: `d3ad40f6e0fbf36c5e48fd009cfe25d2d589daa61e3e307381ca634f9a2e612b`.
- Final browser manifest: `.audits/runs/dashboard-tailwind-final/manifest.json`;
  SHA-256 `2f9d3aa1b0ff6557faf472537ca0af9ccf0ee3a56a474e84f6bbadd14aa29563`.
- Final browser results SHA-256:
  `69b0ede5dde3ee31242ed4808a54878bb455e0bd4c51e19b76e52ca93787692d`.
- Ordered source-hash JSON digest:
  `e4a96bff4323213e6a975bcfc5bfdfd63fe80be7b01b62b2773c149b76ca9a3d`.
  Manifest records all 232 relevant source paths, deleted-file sentinels,
  literal `git status --short`, baseline and actual image hashes.
- Final production build ID: `36f0SYAA5K2mmbDjM4Fc_`. Source was unchanged
  throughout the final browser run and rechecked before handoff.
- Pre-styling baseline remains `.audits/runs/dashboard-tailwind-baseline-verified/`;
  manifest SHA-256 `700fe88029ea29ca163303b6ce7437c1d071603cb3e0ed45d546f46d6c4eddbc`.
  Its source archive and prerequisite delta are documented in Ticket 0005 Audit.

The runtime snapshot is the approved base plus the Dashboard source/dependency/
harness delta. Later ticket-status, Review/Audit and refinement writes record
that same examined source; they are not untested runtime changes. Environment
files are excluded from recorded content and were not changed.

## Final command evidence

| Command/harness | Result | Exit | Observed evidence |
| --- | --- | --- | --- |
| `./cli/drift doctor --ci` | passed | 0 | Required tools and repository paths present |
| `pnpm lint` | **failed — proven external pre-existing** | 1 | 18 identical baseline errors; nonblocking only under AC-16 proof below |
| `pnpm typecheck` | passed | 0 | 13 successful tasks; 12 cache hits, Dashboard fresh |
| `pnpm build` | passed | 0 | 9 successful tasks; 6 cache hits; Dashboard, Website and Docs executed |
| `pnpm --filter dashboard typecheck` | passed | 0 | Explicit scoped check on final composition source |
| `pnpm --filter dashboard build` | passed | 0 | Scoped build passes; final repository build produces the final tested runtime |
| `DASHBOARD_EVIDENCE_DIR=$PWD/.audits/runs/dashboard-tailwind-final pnpm --filter dashboard test:browser` | passed | 0 | 35 production Chromium checks: 28 visual states plus 7 behavioral tests |
| `pnpm test:web-quality` | passed | 0 | 7 files, 31 tests; original assertions unchanged |
| `node_modules/.bin/biome lint apps/dashboard --files-ignore-unknown=true` | passed | 0 | 146 files |
| `node_modules/.bin/biome check` on all changed supported Dashboard source/config/harness files | passed | 0 | 15 files: formatting/import organization |
| `node --test .agents/guardrails/biome.test.mjs` | passed | 0 | All 12 promoted-enforcement fixtures |
| `git diff --check` | passed | 0 | No whitespace errors |

The exact changed-file check covered `e2e/`, `package.json`, globals, layout,
global-error, shell, view, skeleton, template UI/helper and theme domain.
The harness owns a fresh production `next start` server and never reuses an
unidentified server. All required agreed checks ran; no unavailable required
environment or unresolved failure provenance remains. Cache reuse is disclosed,
not presented as fresh execution of those cached tasks.

Retained root logs and SHA-256:

- `.audits/runs/n12-final-lint.log`:
  `f1aac13be81c652b377ad0381801af9638d1f9f592ced9a900b55adc37368884`.
- `.audits/runs/n12-final-typecheck.log`:
  `f090e738e0f543e767e728946b77204074f5e2ef08e8690c8ff4a82afa838d99`.
- `.audits/runs/n12-final-build.log`:
  `f1ea406b2cff689ef29876bd670170ca25dfedeb73879fe4440455c87cce4663`.
- `.audits/runs/n12-baseline-lint.log`:
  `c9035c2b7df95067b778ae6c45812b0d94c6971530c43fac5d82557b99aa530d`.

## Browser observations and differences

The retained matrix covers root redirect and every named route, Overview,
Evolution/chart, Settings, Reports, desktop/mobile light/dark, narrow 320px
reflow, voice/navigation overlays, keyboard focus, right-edge tooltips, Japanese
Settings and independent global-error recovery. Behavioral checks preserve
modal/nonmodal distinctions, focus containment/restoration, Escape, body scroll,
filters, voice response, theme changes, exact 180ms transitions, reduced motion,
locale persistence and both fallback recovery controls. Existing tests retain
timers, all supported locales and loading/not-found/error behavior.

Final retained actual images: **27 of 28 are byte-identical** to expected images.
`mobile-dark-reports.png` differs at four pixels, maximum raw channel difference
2/255, bounded by x=284–309/y=40–41 in the header. The same four-pixel variation
reproduced in the pre-migration clean comparison, with matching dimensions.
This is demonstrated rasterization noise, not a layout, typography or palette
change. Threshold 0.15/maxDiffPixels 20 is unchanged; no mask or regeneration
was used. Source review separately verifies the preserved color values.

The intermediate Ticket 0007 retained tooltip image had transient edge variation;
the final repeat is byte-identical with unchanged source. It was inspected, not
used to relax the comparator. Initial missing-chart capture and locator/port
failures remain documented as rejected development evidence in Ticket 0005.
The first composition screenshot failed with 184 changed pixels; its active
foreground/background regression was repaired within Ticket 0007 and rerun.
These failed attempts are not represented as passing gate runs.

## External failure classification

See [external lint provenance](dashboard-tailwind-external-lint-2026-09-26.md).
Docs 8, SSO 7 and shared React 3 prohibited-import errors reproduce at the exact
approved base after locked installation. Normalized diagnostics match, and
affected source, lint command and config are byte-identical. N12 neither caused
nor worsened them. Repository lint remains **failed**, while AC-16 is satisfied
under the explicitly approved nonblocking external-failure contract.
No unrelated source fix, suppression or new defect ticket was introduced.

## Acceptance map

| Criteria | Evidence and result |
| --- | --- |
| AC-01 | Exact merged base, HEAD and branch recorded; no intervening source divergence |
| AC-02 | Ticket 0005 locked installation, bounded helper/browser dependencies and approved two-mode type repair; final type/build pass |
| AC-03 | Separate pre-styling manifest/archive, prerequisite delta, successful capture and clean comparison before migration |
| AC-04, AC-05 | Ticket 0006 complete CSS responsibility inventory and technical-necessity review; only integration CSS remains |
| AC-06 | Ticket 0007 complete composition inventory, local cn adoption and examined precedence repair; shared helper unchanged |
| AC-07 | Distinct semantic color/font roles with original values; source review and original visual baseline |
| AC-08 | All 28 final visual states pass; artifacts retained, 27 byte-identical and one reproduced noise case |
| AC-09 | Existing interaction tests and production assertions pass; state/functional DOM code unchanged |
| AC-10 | All routes, supported-locale tests and browser Japanese persistence pass; route/copy/metadata/environment contracts unchanged |
| AC-11 | Original route-state tests and independent light fallback appearance/recovery pass |
| AC-12 | Independent scope review; no shared-package, state, deployment or component/props/hook redesign; import enforcement passes |
| AC-13 | Repository-owned Playwright configuration, capture/comparison, retained identities and reproduction README |
| AC-14, AC-15 | All Dashboard-required, formatting, fixture and existing-suite checks pass |
| AC-16 | All root commands execute; typecheck/build/doctor pass; failed lint is baseline-proven external and explicitly reported |
| AC-17 | Final Review, manifests, content identities, working status and command exits bind evidence to the final source |
| AC-18 | Refinement findings recorded; owner-approved N12/E24 retirement verified in the amendment below; other markers/deferred debt retained |

Review: [integrated final Review](../reviews/dashboard-tailwind-final-2026-09-26.md),
reusing the independent two-axis slice reviews and affected-overlap revalidation.
Refinement: [N12 proposals](../../.artifacts/research/dashboard-tailwind-refinement-2026-09-26.md).

## Delivery decision

All four tickets, **0005–0008, are gates-complete** for the final examined source.
The owner accepted N12/E24 retirement and subsequently explicitly identified
the previous cycles as closed in the next initiative brief. N12 is closed at
the post-retirement snapshot below. N09/N11 and other deferred markers remain.
No Git publication occurred.

## Approved retirement amendment — authoritative final snapshot

Only N12 in Dashboard AGENT_NOTES and E24's `use cn function` comment were
removed following explicit owner approval. Their reusable obligations already
belong to the canonical Tailwind application-styling/integration and class-
composition rules. No executable behavior changed. Independent Standards and
Spec affected-change reviews both report zero findings; see the Review amendment.

Base, HEAD, spec and branch above are unchanged. Final browser manifest:
`.audits/runs/dashboard-tailwind-retirement/manifest.json`, SHA-256
`480e1488a231984ad0b6168e2de6f83d65d0b38c85386dd3b46f1cdfd287cd52`.
Source-hash JSON digest:
`73b675e03ede89d604b1f448e39c3d009e87aa928fcb1ec4cd4e03a3c01254b1`.
Results SHA-256:
`7af24a42a8cb7b289e91169c102e236cb207a206eefc48eb31adb81e8e763c07`.
Production build ID: `uV681uDICt4cIQI5TKh4x`. Source remained unchanged
during the run, and every manifest source hash matched after the run.

Repeated affected checks: Dashboard typecheck (0); repository typecheck
(0, 13 tasks/12 cached); repository build (0, 9 tasks/8 cached, Dashboard
fresh); production browser harness (0, all 35 tests); web-quality suite
(0, all 31 tests); Dashboard lint (0, 146 files); changed UI Biome check
(0, one file); whitespace check (0). Repository lint repeated and **failed**
(1, the same 18 baseline-proven external errors and one informational diagnostic).
Previously checked unchanged formatting/configuration remains covered by the
pre-retirement checks, not falsely described as fresh execution.

26/28 actual PNGs are byte-identical to the baseline. Dark Reports has the
same previously reproduced four-pixel raster difference (maximum 2/255).
Light Reports differs at eight pixels (maximum 1/255) in the same header
coordinates x=284–309/y=40–41. The source change only removed a comment;
these sub-perceptual raster differences pass the original unchanged comparator.
No expected image, mask or tolerance was changed.

Retained root logs SHA-256:

- `n12-retirement-lint.log`: `bbf74e2c2394fddb076f3fbcf925bf38cbbd8db23c2350a48116406295682e15`.
- `n12-retirement-typecheck.log`: `311b436a5472d9f6c438b6ced1769a247d8685801a483cc5abad1bb8365e608c`.
- `n12-retirement-build.log`: `3e5aea21843cf08f0c3efbb529a4e1e4c3e1b590825b813776897e82134ee2c8`.

All ACs remain satisfied under approved v2, including the explicit external-
failure semantics of AC-16. All four tickets are gates-complete. Later SDD
bookkeeping does not change this source identity. A subsequent initiative's
changes will need its own evidence, not a claim that this snapshot stayed current.
