#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
cd "$DRIFT_PROJECT_ROOT"
if command -v pnpm >/dev/null 2>&1 && [ -d node_modules ]; then
  exec pnpm exec lint-staged
fi
exit 0
