#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

bin_dir=
mode=manual
while [ "$#" -gt 0 ]; do
  case "$1" in
    --bin-dir) shift; [ "$#" -gt 0 ] || drift_die "--bin-dir requires a directory." 2; bin_dir=$1 ;;
    --postinstall|--postclone|--prepare) mode=${1#--} ;;
    *) drift_die "Unknown setup option: $1" 2 ;;
  esac
  shift
done

[ -n "$bin_dir" ] || bin_dir=$(drift_default_bin_dir) || drift_die "Unable to determine a user bin directory."
mkdir -p "$bin_dir"
ln -sfn "$DRIFT_PROJECT_ROOT/cli/drift" "$bin_dir/drift"
drift_log "setup mode=$mode bin=$bin_dir"
drift_print_success "Drift launcher linked at $bin_dir/drift"
case ":${PATH:-}:" in
  *:"$bin_dir":*) : ;;
  *) drift_warn "$bin_dir is not currently on PATH." ;;
esac
