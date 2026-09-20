#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
drift_print_opening_logo
drift_loader_start "Linking launcher"
drift_queue_scene "$DRIFT_ICON_SETUP" "$DRIFT_SETUP_PHRASE"

bin_dir=
while [ "$#" -gt 0 ]; do
  case "$1" in
    --bin-dir) shift; [ "$#" -gt 0 ] || drift_die "--bin-dir requires a directory." 2; bin_dir=$1 ;;
    *) drift_die "Unknown setup option: $1" 2 ;;
  esac
  shift
done

[ -n "$bin_dir" ] || bin_dir=$(drift_default_bin_dir) || drift_die "Unable to determine a user bin directory."
mkdir -p "$bin_dir"
ln -sfn "$DRIFT_PROJECT_ROOT/cli/drift" "$bin_dir/drift"
if [ -n "${PNPM_HOME:-}" ] && [ -L "$PNPM_HOME/drift" ] && [ "$bin_dir/drift" != "$PNPM_HOME/drift" ]; then
  [ "$(readlink "$PNPM_HOME/drift")" = "$DRIFT_PROJECT_ROOT/cli/drift" ] && rm -f "$PNPM_HOME/drift"
fi
drift_log "bin=$bin_dir"
drift_print_success "Drift launcher linked at $bin_dir/drift"
if drift_path_has "$bin_dir"; then
  drift_print_info "You can run: drift --help"
else
  drift_warn "$bin_dir is not currently on PATH."
fi
