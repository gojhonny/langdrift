#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Usage: drift showcase" 2

drift_need pnpm
drift_print_opening_logo
drift_queue_scene "$DRIFT_ICON_SHOWCASE" "$DRIFT_SHOWCASE_PHRASE"

cd "$DRIFT_PROJECT_ROOT"
pnpm build
exec pnpm exec turbo run start \
  --filter=website \
  --filter=dashboard \
  --filter=sso \
  --filter=mobile \
  --filter=docs
