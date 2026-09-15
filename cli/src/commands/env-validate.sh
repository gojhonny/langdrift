#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Usage: drift env validate" 2

status=0
for template in $(drift_find_env_templates); do
  target=${template%.*}
  if [ -e "$target" ]; then
    drift_print_success "${target#$DRIFT_PROJECT_ROOT/}"
  else
    drift_print_warning "Missing ${target#$DRIFT_PROJECT_ROOT/}"
    status=1
  fi
done
exit "$status"
