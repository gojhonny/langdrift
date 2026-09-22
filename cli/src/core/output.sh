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
DRIFT_ICON_TADA='🎉'
DRIFT_ICON_DOCTOR='🧙'
DRIFT_ICON_SETUP='⏳'
DRIFT_ICON_HARNESS='🔬'
DRIFT_ICON_CLEANUP='🧹'
DRIFT_ICON_RUNTIME='🚀'
DRIFT_ICON_DEV='🔧'
DRIFT_ICON_SHOWCASE='🎬'
DRIFT_ICON_ENV='⚙️'
DRIFT_ICON_GIT='🐙'
DRIFT_ICON_VERIFY='👀'
DRIFT_ICON_SMOKE='💨'
DRIFT_ICON_BOLT='⚡️'
DRIFT_DOCTOR_PHRASE='let me check your spells...'
DRIFT_SETUP_PHRASE='drifiting...'
DRIFT_HARNESS_PHRASE='analyzing...'
DRIFT_CLEANUP_PHRASE='cleaning the house...'
DRIFT_RUNTIME_PHRASE='houston we have a problem...'
DRIFT_DEV_PHRASE='watching...'
DRIFT_SHOWCASE_PHRASE='showtime...'
DRIFT_ENV_PHRASE='organizing your vars...'
DRIFT_VERIFY_PHRASE='mind checking your stuff real quick?'
DRIFT_SMOKE_PHRASE='checking the pulse...'

drift_result_file=
drift_results_flushed=false
drift_loader_pid=
drift_loader_dir=

drift_loader_active() {
  [ -z "${CI:-}" ] && { [ "${DRIFT_FORCE_LOADER:-0}" = 1 ] || drift_stdout_is_tty; }
}

drift_loader_frame() {
  case $1 in
    0) printf '|' ;;
    1) printf '/' ;;
    2) printf '-' ;;
    3) printf '\\' ;;
  esac
}

drift_loader_ensure() {
  if [ -z "$drift_loader_dir" ] || [ ! -d "$drift_loader_dir" ]; then
    drift_loader_dir=$(mktemp -d "${TMPDIR:-/tmp}/drift-loader.XXXXXX")
  fi
  : > "$drift_loader_dir/alive"
  [ -f "$drift_loader_dir/jobs" ] || : > "$drift_loader_dir/jobs"
  [ -f "$drift_loader_dir/rows" ] || printf '0\n' > "$drift_loader_dir/rows"
}

drift_loader_hide_cursor() {
  [ -f "$1/hidden" ] && return 0
  printf '\033[?25l' >&2
  : > "$1/hidden"
}

drift_loader_paint() {
  printf '%s%s%s%s' "$1" "$DRIFT_COLOR_ORANGE" "$2" "$DRIFT_COLOR_RESET"
}

drift_loader_loop() {
  dir=$1
  i=0
  while [ -f "$dir/alive" ]; do
    if [ -f "$dir/pause" ]; then
      sleep 0.08 2>/dev/null || sleep 1
      continue
    fi
    mode=$(cat "$dir/mode" 2>/dev/null || printf 'sequential')
    frame=$(drift_loader_frame "$i")
    if [ "$mode" = parallel ]; then
      prev=$(cat "$dir/rows" 2>/dev/null || printf '0')
      case "$prev" in
        ''|*[!0-9]*) prev=0 ;;
      esac
      if [ "$prev" -gt 0 ]; then
        printf '\033[%sA' "$prev" >&2
      fi
      rows=0
      if [ -s "$dir/jobs" ]; then
        while IFS='	' read -r id born phrase || [ -n "${id:-}" ]; do
          [ -n "${id:-}" ] || continue
          [ -f "$dir/job_ready/$id" ] || continue
          drift_loader_hide_cursor "$dir"
          printf '\033[K' >&2
          drift_loader_paint "$phrase" "$frame" >&2
          printf '\n' >&2
          rows=$((rows + 1))
        done < "$dir/jobs"
      fi
      printf '\033[J' >&2
      printf '%s\n' "$rows" > "$dir/rows"
    elif [ -f "$dir/seq_ready" ]; then
      phrase=$(cat "$dir/last" 2>/dev/null || true)
      if [ -n "$phrase" ]; then
        drift_loader_hide_cursor "$dir"
        : > "$dir/shown"
        printf '\r\033[K' >&2
        drift_loader_paint "$phrase" "$frame" >&2
      fi
    fi
    i=$(( (i + 1) % 4 ))
    sleep 0.08 2>/dev/null || sleep 1
  done
}

drift_loader_spawn() {
  if [ -n "$drift_loader_pid" ] && kill -0 "$drift_loader_pid" 2>/dev/null; then
    return 0
  fi
  drift_loader_pid=
  drift_loader_loop "$drift_loader_dir" &
  drift_loader_pid=$!
}

drift_loader_disarm() {
  [ -n "$drift_loader_dir" ] && [ -f "$drift_loader_dir/delay_pid" ] || return 0
  delay_pid=$(cat "$drift_loader_dir/delay_pid" 2>/dev/null || true)
  [ -n "$delay_pid" ] && kill "$delay_pid" 2>/dev/null || true
  rm -f "$drift_loader_dir/delay_pid"
}

drift_loader_arm() {
  wait_s=$1
  ready=$2
  expected=$3
  drift_loader_disarm
  rm -f "$ready"
  if [ "$wait_s" -eq 0 ]; then
    : > "$ready"
    return 0
  fi
  (
    sleep "$wait_s"
    current=$(cat "$drift_loader_dir/seq_id" 2>/dev/null || true)
    [ "$current" = "$expected" ] || exit 0
    : > "$ready"
  ) &
  printf '%s\n' "$!" > "$drift_loader_dir/delay_pid"
}

drift_loader_next_seq_id() {
  seq_id=$(( $(cat "$drift_loader_dir/seq_id" 2>/dev/null || printf '0') + 1 ))
  printf '%s\n' "$seq_id" > "$drift_loader_dir/seq_id"
  printf '%s\n' "$seq_id"
}

drift_loader_freeze_last() {
  [ -n "$drift_loader_dir" ] && [ -f "$drift_loader_dir/shown" ] || return 0
  prev_phrase=$(cat "$drift_loader_dir/last" 2>/dev/null || true)
  [ -n "$prev_phrase" ] && printf '\r\033[K%s\n' "$prev_phrase" >&2
  rm -f "$drift_loader_dir/shown"
}

drift_loader_start() {
  wait_s=1
  if [ "${1:-}" = --now ]; then
    wait_s=0
    shift
  fi
  new_phrase=${1:-}
  drift_loader_active || return 0
  drift_loader_ensure
  : > "$drift_loader_dir/pause"
  drift_loader_disarm
  rm -f "$drift_loader_dir/seq_ready"
  drift_loader_freeze_last
  printf 'sequential\n' > "$drift_loader_dir/mode"
  printf '%s\n' "$wait_s" > "$drift_loader_dir/wait"
  printf '%s\n' "$new_phrase" > "$drift_loader_dir/last"
  seq_id=$(drift_loader_next_seq_id)
  rm -f "$drift_loader_dir/pause"
  drift_loader_arm "$wait_s" "$drift_loader_dir/seq_ready" "$seq_id"
  drift_loader_spawn
}

drift_loader_parallel_start() {
  job_id=$1
  job_phrase=$2
  wait_s=${3:-1}
  drift_loader_active || return 0
  drift_loader_ensure
  : > "$drift_loader_dir/pause"
  drift_loader_disarm
  rm -f "$drift_loader_dir/seq_ready"
  drift_loader_freeze_last
  printf 'parallel\n' > "$drift_loader_dir/mode"
  printf '%s\n' "$wait_s" > "$drift_loader_dir/wait"
  if [ -s "$drift_loader_dir/jobs" ]; then
    grep -v "^${job_id}	" "$drift_loader_dir/jobs" > "$drift_loader_dir/jobs.new" || true
    mv "$drift_loader_dir/jobs.new" "$drift_loader_dir/jobs"
  fi
  printf '%s\t%s\t%s\n' "$job_id" "$(date +%s)" "$job_phrase" >> "$drift_loader_dir/jobs"
  mkdir -p "$drift_loader_dir/job_ready"
  rm -f "$drift_loader_dir/job_ready/$job_id"
  job_token=$(( $(cat "$drift_loader_dir/job_seq" 2>/dev/null || printf '0') + 1 ))
  printf '%s\n' "$job_token" > "$drift_loader_dir/job_seq"
  printf '%s\n' "$job_token" > "$drift_loader_dir/job_token_$job_id"
  rm -f "$drift_loader_dir/pause"
  if [ "$wait_s" -eq 0 ]; then
    : > "$drift_loader_dir/job_ready/$job_id"
  else
    (
      sleep "$wait_s"
      current=$(cat "$drift_loader_dir/job_token_$job_id" 2>/dev/null || true)
      [ "$current" = "$job_token" ] || exit 0
      : > "$drift_loader_dir/job_ready/$job_id"
    ) &
  fi
  drift_loader_spawn
}

drift_loader_parallel_done() {
  job_id=$1
  [ -n "$drift_loader_dir" ] && [ -f "$drift_loader_dir/jobs" ] || return 0
  grep -v "^${job_id}	" "$drift_loader_dir/jobs" > "$drift_loader_dir/jobs.new" || true
  mv "$drift_loader_dir/jobs.new" "$drift_loader_dir/jobs"
}

drift_loader_stop() {
  drift_loader_disarm
  was_hidden=false
  if [ -n "$drift_loader_dir" ] && [ -f "$drift_loader_dir/hidden" ]; then
    was_hidden=true
  fi
  if [ -n "$drift_loader_dir" ]; then
    rm -f "$drift_loader_dir/alive"
  fi
  if [ -n "$drift_loader_pid" ]; then
    kill "$drift_loader_pid" 2>/dev/null || true
    wait "$drift_loader_pid" 2>/dev/null || true
    drift_loader_pid=
  fi
  if [ "$was_hidden" = true ]; then
    printf '\r\033[K\033[?25h' >&2
  fi
  if [ -n "$drift_loader_dir" ]; then
    rm -rf "$drift_loader_dir"
    drift_loader_dir=
  fi
}

drift_print_logo() {
  printf '%s\n' \
    "${DRIFT_COLOR_ORANGE}██████╗ ██████╗ ██╗███████╗████████╗" \
    "██╔══██╗██╔══██╗██║██╔════╝╚══██╔══╝" \
    "██║  ██║██████╔╝██║█████╗     ██║" \
    "██║  ██║██╔══██╗██║██╔══╝     ██║" \
    "██████╔╝██║  ██║██║██║        ██║" \
    "╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝        ╚═╝${DRIFT_COLOR_RESET}"
}

drift_print_opening_logo() {
  [ -z "${CI:-}" ] || return 0
  drift_print_logo
}

drift_emit_suffix=

drift_emit_result() {
  kind=$1
  shift
  case "$kind" in
    success) printf '%s%s %s%s%s\n' "$DRIFT_COLOR_GREEN" "$DRIFT_ICON_SUCCESS" "$*" "$DRIFT_COLOR_RESET" "$drift_emit_suffix" ;;
    warning) printf '%s%s %s%s%s\n' "$DRIFT_COLOR_YELLOW" "$DRIFT_ICON_WARNING" "$*" "$DRIFT_COLOR_RESET" "$drift_emit_suffix" >&2 ;;
    error) printf '%s%s %s%s%s\n' "$DRIFT_COLOR_RED" "$DRIFT_ICON_ERROR" "$*" "$DRIFT_COLOR_RESET" "$drift_emit_suffix" >&2 ;;
    info) printf '%s%s %s%s%s\n' "$DRIFT_COLOR_CYAN" "$DRIFT_ICON_INFO" "$*" "$DRIFT_COLOR_RESET" "$drift_emit_suffix" ;;
    mark) printf '%s%s\n' "$*" "$drift_emit_suffix" ;;
    banner) printf '\n%s%s\n\n' "$*" "$drift_emit_suffix" ;;
  esac
}

drift_queue_result() {
  kind=$1
  shift
  if [ -z "$drift_result_file" ]; then
    drift_result_file=$(mktemp "${TMPDIR:-/tmp}/drift-result.XXXXXX")
  fi
  printf '%s\t%s\n' "$kind" "$*" >> "$drift_result_file"
}

drift_flush_results() {
  [ "$drift_results_flushed" = true ] && return 0
  drift_results_flushed=true
  drift_loader_stop

  has_results=false
  if [ -n "$drift_result_file" ] && [ -s "$drift_result_file" ]; then
    has_results=true
  fi

  if [ "$has_results" = true ]; then
    had_success=false
    result_total=0
    while IFS= read -r line || [ -n "${line:-}" ]; do
      [ -n "$line" ] || continue
      result_total=$((result_total + 1))
      kind=${line%%	*}
      [ "$kind" = success ] && had_success=true
    done < "$drift_result_file"

    result_index=0
    while IFS= read -r line || [ -n "${line:-}" ]; do
      [ -n "$line" ] || continue
      result_index=$((result_index + 1))
      kind=${line%%	*}
      drift_emit_suffix=
      if [ "$result_index" -eq "$result_total" ] && [ "$had_success" = true ] && [ -z "${CI:-}" ]; then
        drift_emit_suffix=" ${DRIFT_COLOR_ORANGE}${DRIFT_ICON_TADA}${DRIFT_COLOR_RESET}"
      fi
      drift_emit_result "$kind" "${line#*	}"
    done < "$drift_result_file"
    drift_emit_suffix=
  fi

  if [ -n "$drift_result_file" ]; then
    rm -f "$drift_result_file"
  fi
}

drift_queue_scene() {
  [ -z "${CI:-}" ] || return 0
  drift_queue_result banner "$1 $2"
}

drift_print_success() { drift_queue_result success "$*"; }
drift_print_warning() { drift_queue_result warning "$*"; }
drift_print_error() { drift_queue_result error "$*"; }
drift_print_info() { drift_queue_result info "$*"; }
drift_log() {
  [ "$DRIFT_LOGS" = true ] || return 0
  printf '%s%s %s%s\n' "$DRIFT_COLOR_DIM" "$DRIFT_ICON_LOG" "$*" "$DRIFT_COLOR_RESET" >&2
}

if [ "${drift_exit_trap_set:-0}" != 1 ]; then
  drift_exit_trap_set=1
  trap drift_flush_results EXIT
  trap 'exit 130' INT
  trap 'exit 143' TERM
fi
