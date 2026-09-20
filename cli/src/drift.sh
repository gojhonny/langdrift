#!/bin/sh
set -eu

CLI_DIR=$(CDPATH= cd -P "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -P "$CLI_DIR/../.." && pwd)
export DRIFT_CLI_DIR="$CLI_DIR"
export DRIFT_PROJECT_ROOT="$PROJECT_ROOT"

. "$CLI_DIR/core/common.sh"

drift_usage_error() {
  drift_print_error "Drift: $1"
  drift_print_error "Run 'drift --help' for usage."
  exit 2
}

drift_command=${1:---help}
if [ "$#" -gt 0 ]; then shift; fi

if [ "$drift_command" = --logs ]; then
  DRIFT_LOGS=true; export DRIFT_LOGS
  drift_command=${1:---help}
  if [ "$#" -gt 0 ]; then shift; fi
fi
if [ "${1:-}" = --logs ]; then DRIFT_LOGS=true; export DRIFT_LOGS; shift; fi

drift_log "command=$drift_command"

case "$drift_command" in
  --help|-h) exec "$CLI_DIR/commands/help.sh" "$@" ;;
  version|--version|-V)
    [ "$#" -eq 0 ] || drift_usage_error "Version does not accept arguments."
    drift_version=$(drift_project_version)
    [ -n "$drift_version" ] || drift_die "Unable to read the Drift version."
    drift_queue_result mark "drift $drift_version $DRIFT_ICON_BOLT"
    ;;
  --loader) exec "$CLI_DIR/commands/loader.sh" "$@" ;;
  setup) exec "$CLI_DIR/commands/setup.sh" "$@" ;;
  doctor) exec "$CLI_DIR/commands/doctor.sh" "$@" ;;
  harness) exec "$CLI_DIR/commands/harness.sh" "$@" ;;
  cleanup) exec "$CLI_DIR/commands/cleanup.sh" "$@" ;;
  runtime) exec "$CLI_DIR/commands/runtime.sh" "$@" ;;
  run) exec "$CLI_DIR/commands/run.sh" "$@" ;;
  dev) exec "$CLI_DIR/commands/dev.sh" "$@" ;;
  showcase) exec "$CLI_DIR/commands/showcase.sh" "$@" ;;
  env)
    drift_subcommand=${1:-}; [ "$#" -eq 0 ] || shift
    case "$drift_subcommand" in
      setup) exec "$CLI_DIR/commands/env-setup.sh" "$@" ;;
      validate) exec "$CLI_DIR/commands/env-validate.sh" "$@" ;;
      *) drift_usage_error "Usage: drift env <setup|validate>" ;;
    esac
    ;;
  git)
    drift_subcommand=${1:-}; [ "$#" -eq 0 ] || shift
    case "$drift_subcommand" in
      setup) exec "$CLI_DIR/commands/git-setup.sh" "$@" ;;
      doctor) exec "$CLI_DIR/commands/git-doctor.sh" "$@" ;;
      pre-commit) exec "$CLI_DIR/commands/git-pre-commit.sh" "$@" ;;
      commit-msg) exec "$CLI_DIR/commands/git-commit-msg.sh" "$@" ;;
      lint-history) exec "$CLI_DIR/commands/git-lint-history.sh" "$@" ;;
      *) drift_usage_error "Usage: drift git <setup|doctor|pre-commit|commit-msg|lint-history>" ;;
    esac
    ;;
  verify)
    drift_subcommand=${1:-}; [ "$#" -eq 0 ] || shift
    case "$drift_subcommand" in
      packages) exec "$CLI_DIR/commands/verify-packages.sh" "$@" ;;
      *) drift_usage_error "Usage: drift verify packages" ;;
    esac
    ;;
  --*) drift_usage_error "Unknown option: $drift_command" ;;
  *) drift_usage_error "Unknown command: $drift_command" ;;
esac
