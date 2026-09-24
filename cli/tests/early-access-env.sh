#!/bin/sh
# Verify disposable setup and Compose resolution without exposing credentials or starting containers.
set -eu
umask 077
repo=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' 0
export DRIFT_PROJECT_ROOT="$fixture"
export DRIFT_CLI_DIR="$repo/cli/src"

for component in apps/website messaging/infrastructure/broker/nats messaging/infrastructure/storage/minio \
  messaging/runtime/early-access/microservices/email-store messaging/runtime/early-access/microservices/email-sender \
  messaging/runtime/early-access/containers/e2e; do
  mkdir -p "$fixture/$component"
  cp "$repo/$component/.env.development" "$fixture/$component/.env.development"
done
mkdir -p "$fixture/messaging/runtime/early-access/containers/dev"
for profile in dev e2e; do
  cp "$repo/messaging/runtime/early-access/containers/$profile/docker-compose.yml" \
    "$fixture/messaging/runtime/early-access/containers/$profile/docker-compose.yml"
done

setup() { sh "$repo/cli/src/commands/early-access.sh" setup; }
snapshot() { find "$fixture" -name .env -type f -exec cksum {} \; | sort; }
assert_keys() {
  actual=$(sed -n 's/=.*//p' "$fixture/$1/.env" | sort)
  expected=$(printf '%s\n' $2 | sort)
  [ "$actual" = "$expected" ] || { printf 'Unexpected private keys: %s\n' "$1" >&2; exit 1; }
}

setup
assert_keys apps/website 'EMAIL_SERVICE_API_KEY TURNSTILE_SECRET_KEY'
assert_keys messaging/runtime/early-access/microservices/email-store 'EMAIL_SERVICE_API_KEY MINIO_ACCESS_KEY MINIO_SECRET_KEY'
assert_keys messaging/runtime/early-access/microservices/email-sender 'RESEND_API_KEY RESEND_FROM'
assert_keys messaging/infrastructure/storage/minio 'MINIO_ROOT_USER MINIO_ROOT_PASSWORD'
assert_keys messaging/runtime/early-access/containers/e2e 'EMAIL_SERVICE_API_KEY MINIO_ROOT_USER MINIO_ROOT_PASSWORD MINIO_ACCESS_KEY MINIO_SECRET_KEY RESEND_API_KEY RESEND_FROM'
[ ! -s "$fixture/messaging/infrastructure/broker/nats/.env" ]
before=$(snapshot)
setup
[ "$before" = "$(snapshot)" ]

# Exercise an explicit private override in the disposable fixture only.
printf 'API_ADDR=:18080\n' >> "$fixture/messaging/runtime/early-access/microservices/email-store/.env"
for profile in dev e2e; do
  docker compose -f "$fixture/messaging/runtime/early-access/containers/$profile/docker-compose.yml" \
    --profile proof config --format json > "$fixture/$profile.json"
done
node - "$fixture" <<'JS'
const fs = require('node:fs');
const { parseEnv } = require('node:util');
const root = process.argv[2];
const read = (path) => parseEnv(fs.readFileSync(`${root}/${path}`, 'utf8'));
const owners = {
  'email-store': 'messaging/runtime/early-access/microservices/email-store',
  'email-sender': 'messaging/runtime/early-access/microservices/email-sender',
  minio: 'messaging/infrastructure/storage/minio',
  nats: 'messaging/infrastructure/broker/nats'
};
for (const profile of ['dev', 'e2e']) {
  const { services } = JSON.parse(fs.readFileSync(`${root}/${profile}.json`, 'utf8'));
  for (const [service, owner] of Object.entries(owners)) {
    const expected = read(`${owner}/.env.development`);
    if (profile === 'dev' || service === 'nats') Object.assign(expected, read(`${owner}/.env`));
    if (profile === 'e2e' && service !== 'nats') {
      if (service !== 'minio') Object.assign(expected, read('messaging/runtime/early-access/containers/e2e/.env.development'));
      Object.assign(expected, read('messaging/runtime/early-access/containers/e2e/.env'));
    }
    const actual = services[service].environment || {};
    for (const [key, value] of Object.entries(expected)) {
      if (actual[key] !== value) throw new Error(`${profile}/${service}: mismatch for ${key}`);
    }
    for (const key of Object.keys(actual)) {
      if (!(key in expected) && !(profile === 'e2e' && key === 'GOCOVERDIR')) {
        throw new Error(`${profile}/${service}: unexpected ${key}`);
      }
    }
  }
  if (profile === 'e2e') {
    const shared = read('messaging/runtime/early-access/containers/e2e/.env');
    for (const key of ['EMAIL_SERVICE_API_KEY', 'MINIO_ACCESS_KEY', 'MINIO_SECRET_KEY']) {
      if (services.runner.environment[key] !== shared[key]) throw new Error(`runner: mismatch for ${key}`);
    }
  }
}
JS

# Existing shared values must survive regeneration of a missing peer file.
cp "$fixture/apps/website/.env" "$fixture/website.saved"
rm "$fixture/apps/website/.env"
setup
cmp "$fixture/apps/website/.env" "$fixture/website.saved"
printf '\nEMAIL_SERVICE_API_KEY=deliberately-mismatched\n' >> "$fixture/apps/website/.env"
before=$(snapshot)
if setup >/dev/null 2>&1; then
  printf 'Setup accepted mismatched shared credentials.\n' >&2
  exit 1
fi
[ "$before" = "$(snapshot)" ]
printf 'Early Access environment contracts, private keys, precedence and setup repeatability passed.\n'
