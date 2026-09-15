#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

ci=false
[ "${1:-}" != --ci ] || { ci=true; shift; }
[ "$#" -eq 0 ] || drift_die "Usage: drift doctor [--ci]" 2

status=0
check_command() {
  if drift_has "$1"; then drift_print_success "$1 available"
  else drift_print_error "$1 missing"; status=1
  fi
}

check_command git
check_command node
check_command pnpm

for path in apps/console apps/website apps/sso apps/mobile packages/react cli/drift .agents .audits; do
  if [ -e "$DRIFT_PROJECT_ROOT/$path" ]; then drift_print_success "$path"
  else drift_print_error "Missing $path"; status=1
  fi
done

if drift_has node; then
  node_major=$(node -p "process.versions.node.split('.')[0]")
  [ "$node_major" = 24 ] || { drift_print_error "Node 24 required; found $(node --version)"; status=1; }
fi

if [ "$ci" = false ] && drift_git_checkout; then
  branch=$(git -C "$DRIFT_PROJECT_ROOT" branch --show-current 2>/dev/null || true)
  drift_print_info "Git branch: ${branch:-detached}"
fi

exit "$status"
