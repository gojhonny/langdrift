#!/bin/sh
set -eu
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
case "${1:-}" in
  '') [ "$#" -eq 0 ] || exit 2 ;;
  --watch) [ "$#" -eq 1 ] || exit 2 ;;
  *) printf 'Usage: build-tokens.sh [--watch]\n' >&2; exit 2 ;;
esac
exec node "$script_dir/build-tokens.ts" "$@"
