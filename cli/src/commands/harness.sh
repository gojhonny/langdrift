#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

json=false
min_level=1
while [ "$#" -gt 0 ]; do
  case "$1" in
    --json) json=true ;;
    --min-level) shift; [ "$#" -gt 0 ] || drift_die "--min-level requires 1-4" 2; min_level=$1 ;;
    *) drift_die "Unknown harness option: $1" 2 ;;
  esac
  shift
done

case "$min_level" in 1|2|3|4) : ;; *) drift_die "--min-level must be 1, 2, 3, or 4" 2 ;; esac
artifact_dirs='adr assets context design prompts research rules skills specs tickets workflow'
present=0
total=0
for name in $artifact_dirs; do
  total=$((total + 1))
  [ -d "$DRIFT_PROJECT_ROOT/.agents/$name" ] && present=$((present + 1))
done
level=1
[ "$present" -eq "$total" ] && level=2
[ -f "$DRIFT_PROJECT_ROOT/.audits/.gitkeep" ] && level=3
if find "$DRIFT_PROJECT_ROOT/.audits" -type f -name '*.audit.sh' 2>/dev/null | grep -q .; then level=4; fi

if [ "$json" = true ]; then
  printf '{"level":%s,"agent_directories":%s,"agent_directories_expected":%s,"audits_implemented":%s}\n' "$level" "$present" "$total" "$([ "$level" -ge 4 ] && printf true || printf false)"
else
  drift_print_info "Harness level: $level/4"
  drift_print_info "Agent artifact directories: $present/$total"
  [ "$level" -ge 4 ] || drift_print_warning "Audit implementations intentionally deferred."
fi
[ "$level" -ge "$min_level" ] || exit 1
