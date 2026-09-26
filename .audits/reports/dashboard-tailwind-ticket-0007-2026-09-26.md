# Dashboard Tailwind Alignment — Ticket 0007 Audit

Contract: spec 0002 v2, Ticket 0007; revalidation of Ticket 0006 overlap.
Base/HEAD `1cdede8a39f56c62a57b63e9933c85df5e7f8850`, branch
`codex/dashboard-tailwind-alignment`, uncommitted delivery.
Review: `.audits/reviews/dashboard-tailwind-ticket-0007-2026-09-26.md`.

## Composition inventory and preservation

- Template Card, Kicker and Muted compose defaults/consumer classes with cn.
- Shell composes active navigation, mobile spacing, settings-link placement,
  and icon-button overrides with cn. The static product-button list is a string.
- View composes classification/consumer roles, time range and classification/
  group selections with cn.
- SkeletonCard and skeleton conditional combined lists use cn. Whole-string
  alternatives need no merge operation. Non-styling string joins are unchanged.
- The existing Dashboard helper now has declared dependencies and type-only
  ClassValue import; no shared helper, public package, or state API changed.

The first focused Evolution comparison **failed (1)** with 184 different pixels.
Retained expected/actual/diff/trace: `.audits/runs/dashboard-tailwind-ticket-0007-first/`.
Image inspection located the text differences in active navigation, classification,
group and range controls. A computed-style diagnostic also showed ink foreground
and selected surface/subtle backgrounds after naive merging. The original lists'
CSS cascade had muted foreground and transparent control backgrounds. These
small color changes are substantive even where the pixel threshold tolerates them.

The repair removes previously losing active foreground/background classes instead
of changing the palette or accepting cn's new appearance. Navigation still has
its subtle background; selected filter weight and range shadow remain. This is
an initiative regression discovered and fixed within composition ownership.
Neither thresholds, expected screenshots, nor harness assertions were changed.
A formatting check also failed (1) on a wrapped expression before Biome formatting
corrected it; the subsequent formatting gate passed.

## Passing checks

| Command | Result / exit | Observation |
| --- | --- | --- |
| `pnpm --filter dashboard typecheck` | pass / 0 | Composition imports and types resolve |
| `pnpm --filter dashboard build` | pass / 0 | Production build `kARJ0tTdc_ZvMGNwr4Chm` |
| `DASHBOARD_EVIDENCE_DIR=$PWD/.audits/runs/dashboard-tailwind-ticket-0007 pnpm --filter dashboard test:browser` | pass / 0 | All 35 checks, including 28 original visual expectations |
| `pnpm test:web-quality` | pass / 0 | All existing 7 files / 31 tests unchanged |
| `node_modules/.bin/biome lint apps/dashboard --files-ignore-unknown=true` | pass / 0 | 146 files |
| `node_modules/.bin/biome check` on helper/UI/shell/view/skeleton | pass / 0 | 5 changed files; no format/import errors |
| `git diff --check` | pass / 0 | No whitespace errors |

Manifest SHA-256: `8c02cfb54376c0be8777b9e10211628a6b2f40cebfbe73fbe6066686f532ee74`.
It retains source/status, exact build, original baseline and actual image hashes;
source was unchanged during the run. The baseline remains Ticket 0005's
`dashboard-tailwind-baseline-verified`, not candidate-derived expectations.

AC-02/06: intentional dependencies, complete composition inventory and both review
axes pass. AC-08/09: the corrected slice passes the same visual and interaction
matrix. AC-12: no excluded redesign, shared edits or marker retirement. Scoped
checks support AC-14/15/17/18. The overlapping Ticket 0006 styling obligations
are revalidated by the same source review and full comparison without assigning
its styling ownership to this ticket or duplicating the baseline.

Tickets 0006 and 0007 are **gates-complete** for this snapshot. Ticket 0008 may
start integrated final verification; repository-wide gate closure is not claimed.
