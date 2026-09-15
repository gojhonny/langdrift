#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
if [ -d "$DRIFT_PROJECT_ROOT/node_modules/husky" ]; then
  (cd "$DRIFT_PROJECT_ROOT" && pnpm exec husky)
  drift_print_success "Git hooks configured."
else
  drift_log "Husky is not installed yet; skipping hook setup."
fi
