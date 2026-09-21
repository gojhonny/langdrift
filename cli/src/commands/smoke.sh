#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

runtime=${1:-}
[ "$#" -eq 0 ] || shift
target=${1:-all}
[ "$#" -eq 0 ] || shift
[ "$#" -eq 0 ] || drift_die "Usage: drift smoke early-access [email-store|email-sender|all]" 2
[ "$runtime" = early-access ] || drift_die "Usage: drift smoke early-access [email-store|email-sender|all]" 2

case "$target" in
  email-store|email-sender|all) ;;
  *) drift_die "Usage: drift smoke early-access [email-store|email-sender|all]" 2 ;;
esac

drift_need curl
drift_queue_scene "$DRIFT_ICON_SMOKE" "$DRIFT_SMOKE_PHRASE"

root=$DRIFT_PROJECT_ROOT/messaging/runtime/early-access/microservices
run_one() {
  sh "$root/$1/main.smoke.sh"
  drift_print_success "$1 healthy"
}

if [ "$target" = all ] || [ "$target" = email-store ]; then
  run_one email-store
fi
if [ "$target" = all ] || [ "$target" = email-sender ]; then
  run_one email-sender
fi
