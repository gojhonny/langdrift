#!/bin/sh
set -eu

CLI_DIR=$(CDPATH= cd -P "$(dirname "$0")" && pwd)
PROJECT_ROOT=$(CDPATH= cd -P "$CLI_DIR/../.." && pwd)
export DRIFT_CLI_DIR="$CLI_DIR"
export DRIFT_PROJECT_ROOT="$PROJECT_ROOT"

. "$CLI_DIR/core/common.sh"

drift_usage_error() {
  drift_print_error "Drift: $1"
  printf "Run 'drift --help' for usage.\n" >&2
  exit 2
}

drift_run_check() {
  drift_check_name=$1
  drift_check_path="$PROJECT_ROOT/.audits/checks/$drift_check_name.audit.sh"
  [ -f "$drift_check_path" ] || drift_die "Audit checker is not implemented yet: .audits/checks/$drift_check_name.audit.sh"
  /bin/sh "$drift_check_path"
}

drift_command=${1:-help}
if [ "$#" -gt 0 ]; then shift; fi

if [ "$drift_command" = --logs ]; then
  DRIFT_LOGS=true; export DRIFT_LOGS
  drift_command=${1:-help}
  if [ "$#" -gt 0 ]; then shift; fi
fi
if [ "${1:-}" = --logs ]; then DRIFT_LOGS=true; export DRIFT_LOGS; shift; fi

drift_log "command=$drift_command"

case "$drift_command" in
  help|--help|-h) exec "$CLI_DIR/commands/help.sh" "$@" ;;
  version|--version|-V)
    [ "$#" -eq 0 ] || drift_usage_error "Version does not accept arguments."
    drift_version=$(drift_project_version)
    [ -n "$drift_version" ] || drift_die "Unable to read the Drift version."
    printf 'drift %s\n' "$drift_version"
    ;;
  bootstrap|install) exec "$CLI_DIR/commands/bootstrap.sh" "$@" ;;
  setup) exec "$CLI_DIR/commands/setup.sh" "$@" ;;
  doctor) exec "$CLI_DIR/commands/doctor.sh" "$@" ;;
  harness) exec "$CLI_DIR/commands/harness.sh" "$@" ;;
  cleanup) exec "$CLI_DIR/commands/cleanup.sh" "$@" ;;
  runtime) exec "$CLI_DIR/commands/runtime.sh" "$@" ;;
  changelog) exec "$CLI_DIR/commands/changelog.sh" "$@" ;;
  adr|rule|skill|spec) exec "$CLI_DIR/commands/scaffold.sh" "$drift_command" "$@" ;;
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
  check)
    drift_subcommand=${1:-all}; [ "$#" -eq 0 ] || shift
    [ "$#" -eq 0 ] || drift_usage_error "Audit checks do not accept additional arguments."
    case "$drift_subcommand" in
      architecture) drift_run_check architecture ;;
      harness) drift_run_check harness ;;
      canonical) drift_run_check canonical ;;
      imports) drift_run_check import-boundaries ;;
      memory) drift_run_check memory-invariants ;;
      platform) drift_run_check platform ;;
      rules) drift_run_check rules ;;
      runtime) drift_run_check runtime ;;
      skills) drift_run_check workflow-skills ;;
      specs) drift_run_check specs ;;
      all)
        for drift_check in platform architecture rules specs canonical workflow-skills runtime import-boundaries memory-invariants harness; do
          drift_run_check "$drift_check"
        done
        ;;
      *) drift_usage_error "Usage: drift check <all|architecture|canonical|harness|imports|memory|platform|rules|runtime|skills|specs>" ;;
    esac
    ;;
  --*) drift_usage_error "Unknown option: $drift_command" ;;
  *) drift_usage_error "Unknown command: $drift_command" ;;
esac
