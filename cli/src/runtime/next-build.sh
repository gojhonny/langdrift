#!/bin/sh
# Load tracked .env.development into the process environment for `next build`.
# Next.js production builds do not read that file. Existing env (CI, Docker,
# Vercel) is left untouched.
set -eu

if [ -f .env.development ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      '' | \#*) continue ;;
    esac
    key=${line%%=*}
    eval "is_set=\${$key+x}"
    [ -n "$is_set" ] && continue
    export "$line"
  done < .env.development
fi

exec next "$@"
