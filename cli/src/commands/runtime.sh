#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
command=${1:-}
[ "$#" -eq 0 ] || shift
case "$command" in
  dev) exec pnpm -C "$DRIFT_PROJECT_ROOT" dev "$@" ;;
  start) exec pnpm -C "$DRIFT_PROJECT_ROOT" start "$@" ;;
  build) exec pnpm -C "$DRIFT_PROJECT_ROOT" build "$@" ;;
  *) drift_die "Usage: drift runtime <dev|start|build>" 2 ;;
esac
