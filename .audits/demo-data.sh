#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)

check_disclosure() {
  file=$1
  if ! grep -Eiq 'demo|illustrative' "$ROOT/$file"; then
    printf 'Demo-data audit failed: %s renders illustrative product data without a demo/illustrative disclosure.\n' "$file" >&2
    exit 1
  fi
}

check_disclosure 'apps/website/src/app/page.tsx'
check_disclosure 'apps/console/src/app/dashboard-view.tsx'
check_disclosure 'apps/mobile/src/app.tsx'

printf '%s\n' 'Demo-data audit passed.'
