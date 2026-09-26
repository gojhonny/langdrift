# Dashboard browser baseline

This harness exercises the built Dashboard through public routes and controls.
It belongs to the Dashboard Tailwind Alignment acceptance contract. It does not
replace typecheck, the production build, or existing web-quality unit tests.

## Install and build

Use the repository's supported Node and pinned pnpm. From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --filter dashboard exec playwright install chromium
pnpm --filter dashboard typecheck
pnpm --filter dashboard build
```

The harness starts and stops its own production Next server on loopback port
13101. That port must be free; it never reuses an unknown running server.

## Capture before migration

On the recorded, renderable prerequisite snapshot, before any styling or
composition behavior change:

```sh
pnpm --filter dashboard test:browser:baseline
pnpm --filter dashboard test:browser
```

Capture creates screenshots and a source/dependency/runtime manifest in
`.audits/runs/dashboard-tailwind-baseline-verified`. It refuses to overwrite an existing
directory. A capture is valid only if its full suite passed; a separate compare
run must then pass against the captured images. Compare mode never updates
expected images and refuses an incomplete baseline or different recorded
browser/runtime/platform conditions.

`DASHBOARD_BASELINE_DIR` selects another baseline directory and
`DASHBOARD_EVIDENCE_DIR` selects a run's results/manifest directory. Use absolute
paths for explicit overrides, and a distinct evidence directory for each gate
whose output must be retained. Keep baseline images/manifest together and record
their content identities in the authored audit. These local artifacts are
ignored by Git; retain them with the cycle evidence. A fresh checkout can
recreate them by checking out the recorded pre-migration source plus its
recorded prerequisite changes and running the commands above. Never capture
the migrated application as a replacement pre-migration baseline.

## Coverage and comparison policy

- Smoke all 16 named Dashboard routes and the root redirect without uncaught
  browser errors; also check the complete route list at 320px for overflow.
- Compare Overview, Evolution, Settings, and Reports at 1440×900 and 390×844,
  in light and dark themes. These cover the shell, cards/typography, charts,
  classification/contrast roles, settings, and report layouts.
- Compare voice overlays with keyboard focus at both widths and themes,
  320px navigation/focus, Japanese mobile Settings, and the independent light
  global-error fallback at both widths.
- Compare the right-edge Account tooltip in both themes and widths, asserting
  that its measured bounds remain within the viewport. Dashboard's Product
  Vision chart exposes event selection/detail rather than a hover tooltip;
  its rendered SVG/event markers must be visible before any screenshot.
- Assert modal/nonmodal behavior, Tab/Shift+Tab containment, Escape and focus
  restoration, scroll restoration, filter/range selection, voice response,
  theme changes, skip-link focus, reduced motion, locale persistence, and error
  recovery. Existing tests retain coverage of timers, selected state across
  navigation, supported locales, and route-state transitions.

Screenshots use Chromium, DPR 1, UTC, and en-US browser locale; the application
locale starts as English except the explicit Japanese case. Screenshot cases
use reduced motion and disable finite animations during capture. Decorative
orb animation is paused without hiding its rendered surface or dimensions.
Transition and reduced-motion behavior is asserted separately with motion
enabled, so screenshot stabilization does not certify motion behavior.
Each passing screenshot retains an actual candidate image as a test attachment.
Run manifests hash baseline and candidate images and record the production build
ID alongside the source hashes.

The comparison threshold is 0.15 per-pixel color distance, with at most 20
differing pixels for rendering noise. These limits are fixed before migration.
They do not authorize changes to layout, text, colors, typography, focus, or
interaction. Inspect actual/expected/diff artifacts for any failure. Do not
increase thresholds, mask migrated UI, or regenerate expectations to accept
substantive differences.

The fallback check injects a one-shot failure at the browser's theme-style
write boundary, then uses the visible recovery controls. The fault lives only
in the browser test; application code has no test-only route or API.

For focused harness diagnostics before capture, use the underlying runner:

```sh
pnpm --filter dashboard exec playwright test --config e2e/playwright.config.mjs dashboard.spec.mjs
```

Such a focused run is not full baseline or final comparison evidence.
