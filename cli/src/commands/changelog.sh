#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
product=${1:-}
[ -n "$product" ] || drift_die "Usage: drift changelog <product> [from] [to]" 2
shift || true
from=${1:-HEAD~20}
to=${2:-HEAD}
drift_need git
printf '# %s changelog\n\n' "$product"
git -C "$DRIFT_PROJECT_ROOT" log --no-merges --pretty='- %s (%h)' "$from..$to"
