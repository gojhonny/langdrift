#!/bin/sh
set -eu
base=${1:-http://127.0.0.1:8080}
body=$(curl --fail --silent --show-error "$base/healthz")
printf '%s\n' "$body" | grep -Fq '"status":"ok"'
