#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

action=${1:-}
[ "$#" -eq 0 ] || shift
root=$DRIFT_PROJECT_ROOT
dev=$root/messaging/runtime/early-access/containers/dev/docker-compose.yml
e2e=$root/messaging/runtime/early-access/containers/e2e/docker-compose.yml

env_value() {
  [ -f "$1" ] || return 0
  sed -n "s/^$2=//p" "$1" | tail -n 1
}

create_env() {
  umask 077
  website=$root/apps/website/.env
  store=$root/messaging/runtime/early-access/microservices/email-store/.env
  sender=$root/messaging/runtime/early-access/microservices/email-sender/.env
  minio=$root/messaging/infrastructure/storage/minio/.env
  e2e_env=$root/messaging/runtime/early-access/containers/e2e/.env
  nats=$root/messaging/infrastructure/broker/nats/.env
  if [ ! -s "$store" ] || [ ! -s "$website" ] || [ ! -s "$minio" ]; then
    drift_need openssl
    api_key=$(env_value "$website" EMAIL_SERVICE_API_KEY)
    [ -n "$api_key" ] || api_key=$(openssl rand -hex 32)
    storage_user=$(env_value "$minio" MINIO_ROOT_USER)
    [ -n "$storage_user" ] || storage_user=local-minio
    storage_key=$(env_value "$minio" MINIO_ROOT_PASSWORD)
    [ -n "$storage_key" ] || storage_key=$(openssl rand -hex 32)
    if [ ! -s "$store" ]; then
      printf 'EMAIL_SERVICE_API_KEY=%s\nMINIO_ACCESS_KEY=%s\nMINIO_SECRET_KEY=%s\n' "$api_key" "$storage_user" "$storage_key" > "$store"
    fi
    if [ ! -s "$website" ]; then
      printf 'EMAIL_SERVICE_API_KEY=%s\nTURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA\n' "$(env_value "$store" EMAIL_SERVICE_API_KEY)" > "$website"
    fi
    if [ ! -s "$minio" ]; then
      printf 'MINIO_ROOT_USER=%s\nMINIO_ROOT_PASSWORD=%s\n' "$(env_value "$store" MINIO_ACCESS_KEY)" "$(env_value "$store" MINIO_SECRET_KEY)" > "$minio"
    fi
  fi
  if [ ! -s "$sender" ]; then
    printf 'RESEND_API_KEY=re_local_mock_only\nRESEND_FROM=local@example.invalid\n' > "$sender"
  fi
  if [ -s "$website" ] && [ -z "$(env_value "$website" TURNSTILE_SECRET_KEY)" ]; then
    printf 'TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA\n' >> "$website"
  fi
  if [ ! -e "$nats" ]; then : > "$nats"; fi
  if [ ! -s "$e2e_env" ]; then
    printf 'MINIO_ROOT_USER=%s\nMINIO_ROOT_PASSWORD=%s\nEMAIL_SERVICE_API_KEY=%s\nMINIO_ACCESS_KEY=%s\nMINIO_SECRET_KEY=%s\nRESEND_API_KEY=re_local_mock_only\nRESEND_FROM=local@example.invalid\n' \
      "$(env_value "$minio" MINIO_ROOT_USER)" "$(env_value "$minio" MINIO_ROOT_PASSWORD)" \
      "$(env_value "$store" EMAIL_SERVICE_API_KEY)" "$(env_value "$store" MINIO_ACCESS_KEY)" \
      "$(env_value "$store" MINIO_SECRET_KEY)" > "$e2e_env"
  fi
}

check_env() {
  website=$root/apps/website/.env
  store=$root/messaging/runtime/early-access/microservices/email-store/.env
  sender=$root/messaging/runtime/early-access/microservices/email-sender/.env
  minio=$root/messaging/infrastructure/storage/minio/.env
  e2e_env=$root/messaging/runtime/early-access/containers/e2e/.env
  for path in "$website" "$store" "$sender" "$minio" "$e2e_env"; do
    [ -s "$path" ] || { printf 'Missing or empty: %s\n' "$path" >&2; return 1; }
  done
  [ -n "$(env_value "$website" TURNSTILE_SECRET_KEY)" ] || return 1
  for key in EMAIL_SERVICE_API_KEY MINIO_ACCESS_KEY MINIO_SECRET_KEY; do
    [ -n "$(env_value "$store" "$key")" ] || { printf 'Missing value: %s\n' "$key" >&2; return 1; }
  done
  for key in RESEND_API_KEY RESEND_FROM; do
    [ -n "$(env_value "$sender" "$key")" ] || { printf 'Missing value: %s\n' "$key" >&2; return 1; }
  done
  [ "$(env_value "$website" EMAIL_SERVICE_API_KEY)" = "$(env_value "$store" EMAIL_SERVICE_API_KEY)" ] || return 1
  [ "$(env_value "$store" MINIO_ACCESS_KEY)" = "$(env_value "$minio" MINIO_ROOT_USER)" ] || return 1
  [ "$(env_value "$store" MINIO_SECRET_KEY)" = "$(env_value "$minio" MINIO_ROOT_PASSWORD)" ] || return 1
  [ "$(env_value "$e2e_env" EMAIL_SERVICE_API_KEY)" = "$(env_value "$store" EMAIL_SERVICE_API_KEY)" ] || return 1
  [ "$(env_value "$e2e_env" MINIO_ACCESS_KEY)" = "$(env_value "$e2e_env" MINIO_ROOT_USER)" ] || return 1
  [ -n "$(env_value "$e2e_env" MINIO_SECRET_KEY)" ] || return 1
  [ "$(env_value "$e2e_env" MINIO_SECRET_KEY)" = "$(env_value "$e2e_env" MINIO_ROOT_PASSWORD)" ] || return 1
  printf 'Early Access local credentials match.\n'
}

check_tools() {
  drift_need go
  drift_need docker
  docker compose version >/dev/null
  docker compose up --help | grep -q -- --wait
  docker info >/dev/null
  for port in 8080 8081; do
    if command -v lsof >/dev/null 2>&1 && lsof -n -iTCP:"$port" -sTCP:LISTEN >/dev/null 2>&1; then
      printf 'Port %s is occupied.\n' "$port" >&2
      return 1
    fi
  done
}

run_browser() {
  drift_need pnpm
  drift_need curl
  pnpm --filter @repo/design-tokens build
  (
    for env_file in "$root/apps/website/.env.development" "$root/apps/website/.env" \
      "$root/messaging/runtime/early-access/containers/e2e/.env.development" \
      "$root/messaging/runtime/early-access/e2e/.env.development"; do
      while IFS= read -r entry || [ -n "$entry" ]; do
        case "$entry" in '' | \#*) continue ;; esac
        export "$entry"
      done < "$env_file"
    done
    cd "$root/apps/website"
    exec node node_modules/next/dist/bin/next dev --port 13000
  ) > "${TMPDIR:-/tmp}/langdrift-early-access-website.log" 2>&1 &
  website_pid=$!
  ready=false
  attempt=0
  while [ "$attempt" -lt 40 ]; do
    if curl --silent --fail --location http://127.0.0.1:13000/en >/dev/null; then ready=true; break; fi
    kill -0 "$website_pid" 2>/dev/null || break
    attempt=$((attempt + 1))
    sleep 1
  done
  if [ "$ready" != true ]; then
    cat "${TMPDIR:-/tmp}/langdrift-early-access-website.log" >&2
    return 1
  fi
  pnpm --dir "$root/messaging/runtime/early-access/e2e" exec playwright test
  kill "$website_pid" 2>/dev/null || true
  wait "$website_pid" 2>/dev/null || true
  website_pid=
}

prepare_evidence() {
  mkdir -p "$root/.audits/runs"
  run_dir=${EARLY_ACCESS_AUDIT_DIR:-$(mktemp -d "$root/.audits/runs/early-access.XXXXXX")}
  mkdir -p "$run_dir/unit" "$run_dir/integration" "$run_dir/combined"
  printf 'Evidence directory: %s\n' "$run_dir"
}

run_unit() {
  go test -race -cover -covermode=atomic -coverpkg=./... ./... -args "-test.gocoverdir=$run_dir/unit"
  go tool covdata textfmt -i="$run_dir/unit" -o="$run_dir/unit.out"
  pnpm coverage:early-access
}

collect_integration() {
  docker compose -f "$e2e" stop email-store email-sender resend-mock
  docker compose -f "$e2e" cp email-store:/coverage/. "$run_dir/integration"
  go tool covdata textfmt -i="$run_dir/integration" -o="$run_dir/integration.out"
}

prove_outage() {
  dependency=$1
  expected=$2
  docker compose -f "$e2e" stop "$dependency"
  curl --fail --silent http://127.0.0.1:18080/healthz >/dev/null
  status=$(curl --silent --output /dev/null --write-out '%{http_code}' http://127.0.0.1:18080/readyz)
  [ "$status" = 503 ] || drift_die "Readiness did not detect $dependency outage"
  status=$(curl --silent --output /dev/null --write-out '%{http_code}' --request POST http://127.0.0.1:18080/v1/emails \
    --header "Authorization: Bearer $(env_value "$root/apps/website/.env" EMAIL_SERVICE_API_KEY)" \
    --header 'Content-Type: application/json' --data '{"email":"e2e@example.com","locale":"en","source":"landing"}')
  [ "$status" = "$expected" ] || drift_die "Unexpected acceptance status during $dependency outage: $status"
  docker compose -f "$e2e" up -d --wait
  curl --fail --silent --retry 10 --retry-all-errors --retry-delay 1 http://127.0.0.1:18080/readyz >/dev/null
}

case "$action" in
  setup)
    [ "$#" -eq 0 ] || exit 2
    create_env
    check_env
    ;;
  doctor)
    [ "$#" -eq 0 ] || exit 2
    check_tools
    check_env
    docker compose -f "$dev" config --quiet
    docker compose -f "$e2e" config --quiet
    ;;
  runtime)
    command=${1:-}; [ "$#" -eq 0 ] || shift
    [ "$#" -eq 0 ] || exit 2
    case "$command" in
      up) create_env; check_env; docker compose -f "$dev" up -d --build --wait ;;
      down) docker compose -f "$dev" down --remove-orphans ;;
      reset) docker compose -f "$dev" down --volumes --remove-orphans ;;
      logs) docker compose -f "$dev" logs --follow --tail=100 ;;
      status) docker compose -f "$dev" ps ;;
      *) drift_die 'Usage: drift runtime early-access <up|down|reset|logs|status>' 2 ;;
    esac
    ;;
  test)
    command=${1:-}; [ "$#" -eq 0 ] || shift
    [ "$#" -eq 0 ] || exit 2
    cd "$root"
    prepare_evidence
    case "$command" in
      unit) run_unit ;;
      integration|e2e|all)
        [ "$command" != all ] || run_unit
        create_env
        check_env
        trap 'if [ -n "${website_pid:-}" ]; then kill "$website_pid" 2>/dev/null || true; wait "$website_pid" 2>/dev/null || true; fi; if [ -n "${replica_id:-}" ]; then docker stop "$replica_id" >/dev/null 2>&1 || true; fi; docker compose -f "$e2e" --profile proof down --volumes --remove-orphans' 0
        docker compose -f "$e2e" --profile proof build
        docker compose -f "$e2e" up -d --wait
        replica_id=$(docker compose -f "$e2e" run --rm -d --no-deps email-store)
        docker compose -f "$e2e" --profile proof run --rm --no-deps runner
        docker stop "$replica_id" >/dev/null
        replica_id=
        prove_outage nats 503
        prove_outage minio 202
        docker compose -f "$e2e" restart email-store email-sender
        docker compose -f "$e2e" up -d --wait
        docker compose -f "$e2e" --profile proof run --rm --no-deps runner
        [ "$command" = integration ] || run_browser
        collect_integration
        if [ "$command" = all ]; then
          go tool covdata merge -i="$run_dir/unit,$run_dir/integration" -o="$run_dir/combined"
          go tool covdata textfmt -i="$run_dir/combined" -o="$run_dir/combined.out"
        fi
        ;;
      *) drift_die 'Usage: drift test early-access <unit|integration|e2e|all>' 2 ;;
    esac
    ;;
  audit)
    [ "$#" -eq 0 ] || exit 2
    cd "$root"
    prepare_evidence
    export EARLY_ACCESS_AUDIT_DIR="$run_dir"
    { git rev-parse HEAD; go version; node --version; pnpm --version; docker --version; docker compose version; } > "$run_dir/versions.txt"
    "$root/cli/drift" test early-access all
    go vet ./...
    go run honnef.co/go/tools/cmd/staticcheck@v0.8.1 ./...
    go run golang.org/x/vuln/cmd/govulncheck@v1.8.0 ./...
    pnpm audit --prod --audit-level high
    go tool cover -func="$run_dir/combined.out" > "$run_dir/coverage-functions.txt"
    go tool covdata percent -i="$run_dir/combined" > "$run_dir/coverage-packages.txt"
    cat "$run_dir/coverage-packages.txt"
    awk '/coverage:/ { target=80; if ($1 ~ /envelopes$/) target=95; score=$3+0; if (score < target) { print "Coverage gate failed: " $1 " " score "% < " target "%"; failed=1 } } END { exit failed }' "$run_dir/coverage-packages.txt"
    ;;
  *) drift_die 'Usage: drift early-access <setup|doctor|runtime|test|audit>' 2 ;;
esac
