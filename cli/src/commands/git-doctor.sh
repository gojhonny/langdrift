#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
drift_need git
drift_git_checkout || drift_die "Not a Git checkout."
for hook in .husky/pre-commit .husky/commit-msg; do
  [ -x "$DRIFT_PROJECT_ROOT/$hook" ] && drift_print_success "$hook" || drift_print_error "$hook missing or not executable"
done
