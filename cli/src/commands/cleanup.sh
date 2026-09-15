#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Cleanup does not accept arguments." 2
cd "$DRIFT_PROJECT_ROOT"
find . -type d \( -name node_modules -o -name .next -o -name .turbo -o -name dist -o -name coverage \) -prune -exec rm -rf {} + 2>/dev/null || true
drift_print_success "Generated workspace state removed."
