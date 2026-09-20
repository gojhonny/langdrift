#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
command=${1:-}
[ "$#" -eq 0 ] || shift
case "$command" in
  website|console|sso|mobile|docs|build)
    drift_print_opening_logo
    drift_queue_scene "$DRIFT_ICON_RUNTIME" "$DRIFT_RUNTIME_PHRASE"
    pnpm -C "$DRIFT_PROJECT_ROOT" "$command" "$@"
    ;;
  *) drift_die "Usage: drift runtime <website|console|sso|mobile|docs|build>" 2 ;;
esac
