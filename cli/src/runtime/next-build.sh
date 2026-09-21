#!/bin/sh
# Load tracked .env.development into the process environment for `next build`.
# Next.js production builds do not read that file. Existing env (CI, Docker,
# Vercel) is left untouched.
set -eu

. "$(dirname "$0")/load-next-env.sh"

exec next "$@"
