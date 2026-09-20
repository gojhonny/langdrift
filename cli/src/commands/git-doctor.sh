#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
drift_loader_start "Checking hooks"
drift_need git
drift_git_checkout || drift_die "Not a Git checkout."
for hook in cli/.husky/pre-commit cli/.husky/commit-msg; do
  [ -x "$DRIFT_PROJECT_ROOT/$hook" ] && drift_print_success "$hook" || drift_print_error "$hook missing or not executable"
done
