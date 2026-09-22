#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
cd "$DRIFT_PROJECT_ROOT"
if git diff --cached --name-only --diff-filter=ACM | awk '/\.go$|^go\.(mod|sum)$/ { found=1 } END { exit !found }'; then
  go_files=$(git diff --cached --name-only --diff-filter=ACM | awk '/\.go$/ { print }')
  if [ -n "$go_files" ]; then
    unformatted=$(printf '%s\n' "$go_files" | while IFS= read -r file; do [ ! -f "$file" ] || gofmt -l "$file"; done)
    [ -z "$unformatted" ] || { printf 'Run gofmt on:\n%s\n' "$unformatted" >&2; exit 1; }
  fi
  go test ./...
fi
if command -v pnpm >/dev/null 2>&1 && [ -d node_modules ]; then
  exec pnpm exec lint-staged
fi
exit 0
