#!/bin/sh

: "${DRIFT_LOGS:=false}"

drift_stdout_is_tty() {
  command -v tty >/dev/null 2>&1 && tty -s <&1 2>/dev/null
}

if [ "${NO_COLOR+x}" != x ] && { [ "${DRIFT_FORCE_COLOR:-0}" = 1 ] || drift_stdout_is_tty; }; then
  DRIFT_COLOR_ORANGE=$(printf '\033[38;5;208m')
  DRIFT_COLOR_YELLOW=$(printf '\033[33m')
  DRIFT_COLOR_GREEN=$(printf '\033[32m')
  DRIFT_COLOR_RED=$(printf '\033[31m')
  DRIFT_COLOR_CYAN=$(printf '\033[36m')
  DRIFT_COLOR_DIM=$(printf '\033[2m')
  DRIFT_COLOR_RESET=$(printf '\033[0m')
else
  DRIFT_COLOR_ORANGE=
  DRIFT_COLOR_YELLOW=
  DRIFT_COLOR_GREEN=
  DRIFT_COLOR_RED=
  DRIFT_COLOR_CYAN=
  DRIFT_COLOR_DIM=
  DRIFT_COLOR_RESET=
fi

DRIFT_ICON_SUCCESS='✅'
DRIFT_ICON_WARNING='⚠️'
DRIFT_ICON_ERROR='❌'
DRIFT_ICON_INFO='ℹ️'
DRIFT_ICON_LOG='🔎'

drift_print_logo() {
  printf '%s\n' \
    "${DRIFT_COLOR_ORANGE}██████╗ ██████╗ ██╗███████╗████████╗" \
    "██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝" \
    "██║  ██║██████╔╝██║█████╗     ██║" \
    "██║  ██║██╔══██╗██║██╔══╝     ██║" \
    "██████╔╝██║  ██║██║██║        ██║" \
    "╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝${DRIFT_COLOR_RESET}"
}

drift_print_success() { printf '%s%s %s%s\n' "$DRIFT_COLOR_GREEN" "$DRIFT_ICON_SUCCESS" "$*" "$DRIFT_COLOR_RESET"; }
drift_print_warning() { printf '%s%s %s%s\n' "$DRIFT_COLOR_YELLOW" "$DRIFT_ICON_WARNING" "$*" "$DRIFT_COLOR_RESET" >&2; }
drift_print_error() { printf '%s%s %s%s\n' "$DRIFT_COLOR_RED" "$DRIFT_ICON_ERROR" "$*" "$DRIFT_COLOR_RESET" >&2; }
drift_print_info() { printf '%s%s %s%s\n' "$DRIFT_COLOR_CYAN" "$DRIFT_ICON_INFO" "$*" "$DRIFT_COLOR_RESET"; }
drift_log() {
  [ "$DRIFT_LOGS" = true ] || return 0
  printf '%s%s %s%s\n' "$DRIFT_COLOR_DIM" "$DRIFT_ICON_LOG" "$*" "$DRIFT_COLOR_RESET" >&2
}
