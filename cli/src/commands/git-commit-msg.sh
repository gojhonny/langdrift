#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
message_file=${1:-}
[ -n "$message_file" ] || drift_die "Usage: drift git commit-msg <message-file>" 2
cd "$DRIFT_PROJECT_ROOT"
if command -v pnpm >/dev/null 2>&1 && [ -d node_modules ]; then
  exec pnpm exec commitlint --edit "$message_file"
fi
exit 0
