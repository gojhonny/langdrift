# Website structure browser evidence

Run from a locked-install checkout with Playwright Chromium installed:

```sh
pnpm --filter website exec playwright install chromium
WEBSITE_EVIDENCE_DIR="$PWD/.audits/runs/website-structure-final" pnpm --filter website test:browser
```

The harness builds the recorded source and starts that standalone build using the repository runtime wrapper
on localhost:13100. It refuses an occupied server. Required environment is the
existing Website environment contract; do not put values in evidence.

Before a structural migration, capture an explicitly chosen, new baseline:

```sh
WEBSITE_BASELINE_DIR="$PWD/.audits/runs/website-structure-baseline-v7" \
WEBSITE_EVIDENCE_DIR="$PWD/.audits/runs/website-structure-capture-v7" \
pnpm --filter website test:browser:baseline
```

Capture refuses existing directories. Comparison requires the successful baseline
manifest and identical recorded runtime conditions, never auto-updates expected
images, verifies the baseline PNG hashes before/after execution, and fails if
source hashes change during build or tests. Capture settings are shared with the
Playwright configuration. Preserve the ignored
baseline directory alongside its source archive from the audit; Git alone does
not distribute screenshot evidence. Reproduce a missing baseline from that exact
pre-migration archive/runtime, not by approving the changed application.

The matrix checks desktop/mobile, both themes, English/Japanese, header, hero
chart, scenario, integrations, executive review and pricing. Static-region
screenshots deliberately exclude the unrelated continuously rotating graph canvas;
the graph must report ready and its production behavior is unchanged by this
initiative. Visual runs use reduced motion; interaction runs use default motion.
All required font faces and chart readiness are observed. Browser font flags are
recorded with the shared capture conditions; GPU rendering is disabled to stabilize
text rasterization. Fixed headers use integer viewport clips; other regions use
integer document-coordinate clips. Document-region captures warm the compositor
with a discarded screenshot, then recheck fonts and animation frames before the
comparison. Geometry is retained. These mechanics reduce capture variability but
do not guarantee deterministic font rasterization; retain and classify failed runs.
No masks are used. Comparator tolerance
is threshold 0.15/maxDiffPixels 20, fixed before migration. Actual screenshots,
expected/candidate hashes, build identity, source/status and results are retained.

Behavior checks cover drawer/locale/focus/scroll/responsive closure, modified
locale links, chart selection, scenario switching, evidence inspector identity
and return focus, review filters/reset, and all eight localized routes. These
checks complement, not replace, the real Early Access integration/browser harness
and unit/coverage checks. A failure or missing environment is not a pass.
