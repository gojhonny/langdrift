# Dashboard Tailwind Alignment — Ticket 0006 Audit

Contract: spec 0002 v2, Ticket 0006. Base/HEAD
`1cdede8a39f56c62a57b63e9933c85df5e7f8850`. Styling-only uncommitted delta;
class-composition migration has not started. Review:
`.audits/reviews/dashboard-tailwind-ticket-0006-2026-09-26.md`.

## Complete Dashboard CSS responsibility accounting

| Previous responsibility | Delivered owner / necessity |
| --- | --- |
| `globals.css` framework and shared imports | Retained: Tailwind compiler/preflight, animation-library integration, shared token and React stylesheet public contracts |
| `classes/app.css` import aggregation | Removed; no technical need for separate aggregation |
| `classes/root.css` light palette, fonts, chart variables | Token declarations in globals; required by shared CSS/chart consumers and semantic utility generation |
| `classes/dark.css` variant and dark values | Data-theme custom variant and token overrides in globals; preserves runtime theme mechanism |
| `classes/theme.css` Tailwind mapping | `@theme inline` in globals; compiler integration for semantic utilities, not application selector rules |
| `classes/base.css` box sizing / margin resets, link color, control font inheritance | Removed as redundant with Tailwind preflight; no parallel reset layer |
| Base html/body min-height | `min-h-full` on normal and independent fallback documents |
| Base body color/background/font | `bg-background text-ink font-editorial`; fallback retains `font-sans` |
| Base body background/color transitions | Utility preserves exact `background 180ms ease, color 180ms ease`; normal body's reduced-motion override retained |
| Base control focus | Low-specificity descendant utilities preserve 2px solid brand / 2px offset; shell ink override remains. Fallback keeps explicit ink / 4px offset |

Only `app/globals.css` remains Dashboard-owned CSS. No CSS file separation is
claimed necessary. No custom application selector or utility definition hides
the removed rules. Functional color-scheme/theme writes and modal scroll locks
are browser integration and remain unchanged.

Semantic refinements: fixed brand foreground remains #171717 in both themes;
shell muted retains #6b6b6b/light and #a1a1aa/dark without changing root #737373;
aligned text references the original green-700/400 palette values independently
from the aligned chart color; scrim stays black with the existing 35% opacity.
Fallback literals map to equivalent light background/ink/surface tokens. Fonts,
chart variables and all original palette values remain. Geometry-specific
spacing/shadows remain utilities; policy does not prohibit arbitrary values.

## Gate status

Initial styling typecheck passed (0), production build exited 0, and all 35
browser comparisons passed (0). That incremental build emitted a stale deleted
CSS import diagnostic, so it is not the accepted clean-build evidence. Its run
is retained at `.audits/runs/dashboard-tailwind-ticket-0006/`.

The generated `.next` directory was moved to a recoverable temporary archive;
no source or baseline was removed. Clean build/comparison are pending at this
checkpoint. Existing `pnpm test:web-quality` passed all 31 tests (0), scoped
Biome lint passed 146 files (0), changed-file Biome check passed 5 files (0),
and `git diff --check` passed (0). Both source-review axes pass.

## Completed clean-build gate

`pnpm --filter dashboard build` passed (0) from an empty generated build
directory, without the stale deleted-import diagnostic. The follow-up command
`DASHBOARD_EVIDENCE_DIR=$PWD/.audits/runs/dashboard-tailwind-ticket-0006-clean pnpm --filter dashboard test:browser`
passed all 35 checks (0), including all 28 unchanged screenshot expectations.
No thresholds, baseline, or assertion changed. Manifest SHA-256:
`6369bcc5af693a9a7519e907ae98cdbcbd22a5b7418d00bb0c54aedc8cb8899e`;
build ID `sHQwcZgbq7GvOBtiEAWBE`. It records source/status and individual
baseline/actual image hashes; source remained unchanged during execution.

AC-04/05 are satisfied by the complete responsibility inventory and two-axis
review; AC-07 by retained distinct values/roles and visual evidence. AC-08–12
pass for this styling slice through the 35 browser checks, 31 existing tests,
and reviewed scope/functional integration. Scoped checks support AC-14/15/17;
markers remain for AC-18. Ticket 0006 is **gates-complete** for this independent
styling snapshot. No final integrated AC-16/17/18 result is claimed.
