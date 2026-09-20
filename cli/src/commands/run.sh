#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
app=${1:-}
[ "$#" -eq 1 ] || drift_die "Usage: drift run <website|dashboard|sso|mobile|docs>" 2
case "$app" in
  website|dashboard|sso|mobile|docs) ;;
  *) drift_die "Usage: drift run <website|dashboard|sso|mobile|docs>" 2 ;;
esac

drift_need pnpm
drift_print_opening_logo
drift_queue_scene "$DRIFT_ICON_RUNTIME" "$DRIFT_RUNTIME_PHRASE"
cd "$DRIFT_PROJECT_ROOT"
exec pnpm exec turbo run start --filter="$app"
