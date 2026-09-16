#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)
CONSOLE="$ROOT/apps/console/src/app/console-shell.tsx"
HEADER="$ROOT/packages/react/src/vendors/smoothui/header-4.tsx"
MOBILE="$ROOT/apps/mobile/src/app.tsx"
CURVE="$ROOT/packages/react/src/ui/product-vision-curve/product-vision-curve.tsx"

for route in /overview /evolution /decisions /people /reports; do
  grep -q "href: '$route'" "$CONSOLE" || {
    printf 'Surface audit failed: missing primary Console route %s.\n' "$route" >&2
    exit 1
  }
done

for old_label in 'Vision Baseline' 'Drift Graph' 'Drift Timeline' 'Drift Events' 'Drift by Team' 'Drift by Product Area' 'Intentional Drift' 'Unexplained Drift' 'Evidence'; do
  if grep -q "label: '$old_label'" "$CONSOLE"; then
    printf 'Surface audit failed: %s returned to primary Console navigation.\n' "$old_label" >&2
    exit 1
  fi
done

grep -q 'Why did your Product Vision fall from' "$HEADER" || {
  printf '%s\n' 'Surface audit failed: Website hero lost the Product Vision movement question.' >&2
  exit 1
}

if grep -q 'Array.from({ length: 400' "$HEADER"; then
  printf '%s\n' 'Surface audit failed: Website hero reintroduced the 400-tile DOM grid.' >&2
  exit 1
fi

grep -q 'Ask LangDrift' "$MOBILE" || {
  printf '%s\n' 'Surface audit failed: Mobile lost the primary inquiry entry.' >&2
  exit 1
}

grep -q 'View evolution' "$MOBILE" || {
  printf '%s\n' 'Surface audit failed: Mobile no longer provides on-demand evolution detail.' >&2
  exit 1
}

if grep -q 'CompactDriftChart' "$MOBILE"; then
  printf '%s\n' 'Surface audit failed: Mobile home reintroduced the large default analytics chart.' >&2
  exit 1
fi

grep -q 'tabIndex={0}' "$CURVE" || {
  printf '%s\n' 'Surface audit failed: Product Vision curve events are not keyboard-focusable.' >&2
  exit 1
}

grep -q 'aria-label=' "$CURVE" || {
  printf '%s\n' 'Surface audit failed: Product Vision curve lacks event text equivalents.' >&2
  exit 1
}

printf '%s\n' 'Surface contract audit passed.'
