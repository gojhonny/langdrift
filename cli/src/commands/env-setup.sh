#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Usage: drift env setup" 2

drift_find_env_templates | while IFS= read -r template; do
  target=${template%.*}
  if [ ! -e "$target" ]; then cp "$template" "$target"; drift_print_success "Created ${target#$DRIFT_PROJECT_ROOT/}"; fi
done
