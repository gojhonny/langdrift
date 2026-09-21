#!/bin/sh
# Start a Next.js standalone server the same way the app Dockerfiles do.
# `next start` refuses `output: 'standalone'`.
set -eu

port=${1:?usage: next-start.sh <port> [hostname]}
hostname=${2:-0.0.0.0}
app=$(basename "$PWD")
standalone=.next/standalone
server=$standalone/apps/$app/server.js
static_src=.next/static
static_dest=$standalone/apps/$app/.next/static
public_dest=$standalone/apps/$app/public

if [ ! -f "$server" ]; then
  echo "standalone server missing: $server" >&2
  echo "run the app build first" >&2
  exit 1
fi

if [ ! -d "$static_src" ]; then
  echo "missing $static_src; run the app build first" >&2
  exit 1
fi

. "$(dirname "$0")/load-next-env.sh"

mkdir -p "$standalone/apps/$app/.next"
rm -rf "$static_dest"
cp -R "$static_src" "$static_dest"

if [ -d public ]; then
  rm -rf "$public_dest"
  cp -R public "$public_dest"
fi

export HOSTNAME=$hostname
export PORT=$port
export NODE_ENV=production
exec node "$server"
