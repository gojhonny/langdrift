#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Bootstrap does not accept arguments." 2

drift_need node
drift_need pnpm
cd "$DRIFT_PROJECT_ROOT"
pnpm install --no-frozen-lockfile
"$DRIFT_PROJECT_ROOT/cli/drift" setup --postclone
"$DRIFT_PROJECT_ROOT/cli/drift" env setup
drift_print_success "Checkout bootstrapped."
