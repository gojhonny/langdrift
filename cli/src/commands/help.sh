#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Help does not accept arguments." 2

drift_print_opening_logo

drift_print_command() {
  printf '%s %s\n' "$1" "$2"
}

printf '%s\n' --version
printf '%s\n' --loader
drift_print_command "$DRIFT_ICON_SETUP" setup
drift_print_command "$DRIFT_ICON_DOCTOR" doctor
drift_print_command "$DRIFT_ICON_HARNESS" harness
drift_print_command "$DRIFT_ICON_CLEANUP" cleanup
drift_print_command "$DRIFT_ICON_RUNTIME" runtime
drift_print_command "$DRIFT_ICON_RUNTIME" 'run <app>'
drift_print_command "$DRIFT_ICON_DEV" 'dev <app>'
drift_print_command "$DRIFT_ICON_SHOWCASE" showcase
drift_print_command '⚙️ ' env
drift_print_command "$DRIFT_ICON_GIT" git
drift_print_command "$DRIFT_ICON_VERIFY" 'verify packages'
