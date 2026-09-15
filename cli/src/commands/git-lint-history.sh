#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
from=${1:-}; to=${2:-}
[ -n "$from" ] && [ -n "$to" ] || drift_die "Usage: drift git lint-history <from> <to>" 2
drift_need git
cd "$DRIFT_PROJECT_ROOT"
if ! command -v pnpm >/dev/null 2>&1 || [ ! -d node_modules ]; then drift_die "Run pnpm install first."; fi
git log --format=%B "$from..$to" | pnpm exec commitlint --config .github/commitlint-history.config.json
