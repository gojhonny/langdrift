#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
app=${1:-}
[ "$#" -eq 1 ] || drift_die "Usage: drift dev <website|console|sso|mobile>" 2
case "$app" in
  website|console|sso|mobile) ;;
  *) drift_die "Usage: drift dev <website|console|sso|mobile>" 2 ;;
esac

drift_need pnpm
drift_print_opening_logo
drift_queue_scene "$DRIFT_ICON_DEV" "$DRIFT_DEV_PHRASE"
cd "$DRIFT_PROJECT_ROOT"
exec pnpm exec turbo watch dev --filter="$app"
