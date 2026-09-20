#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
drift_loader_start "Configuring hooks"
if [ -d "$DRIFT_PROJECT_ROOT/node_modules/husky" ]; then
  (cd "$DRIFT_PROJECT_ROOT" && pnpm exec husky cli/.husky)
  drift_print_success "Git hooks configured."
else
  drift_log "Husky is not installed yet; skipping hook setup."
fi
