#!/bin/sh
set -eu

ROOT=$(CDPATH= cd -P "$(dirname "$0")/.." && pwd)

# Product UI and active surface specs must use the current term. AGENTS.md is
# intentionally excluded because it documents the historical migration rule.
matches=$(grep -RIn \
  --exclude-dir=.git \
  --exclude-dir=node_modules \
  --exclude='pnpm-lock.yaml' \
  'Product Integrity' \
  "$ROOT/apps" "$ROOT/packages" "$ROOT/.agents/specs" 2>/dev/null || true)

if [ -n "$matches" ]; then
  printf '%s\n' 'Product language audit failed: use Product Vision, not Product Integrity.' >&2
  printf '%s\n' "$matches" >&2
  exit 1
fi

printf '%s\n' 'Product language audit passed.'
