#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

case "${1:-}" in
  --help|-h)
    [ "$#" -eq 1 ] || drift_die 'Harness help does not accept additional arguments.' 2
    cat <<'USAGE'
Usage: drift harness [--json] [--min-level 1|2|3|4]

Measure this checkout with pinned harness-score 1.5.2.
  --json             Print the full report as JSON
  --min-level <1-4>  Fail when repository maturity is below the given level
  --help, -h         Show this guide without invoking the evaluator

The first measurement may download the utility through npm. Scanning itself
only reads repository files. This measures recognized harness infrastructure;
test coverage, correctness and live product readiness need separate evidence.
USAGE
    exit 0
    ;;
esac

harness_json=false
harness_level=
while [ "$#" -gt 0 ]; do
  case "$1" in
    --json)
      [ "$harness_json" = false ] || drift_die 'Pass --json only once.' 2
      harness_json=true
      shift
      ;;
    --min-level)
      [ -z "$harness_level" ] || drift_die 'Pass --min-level only once.' 2
      [ "$#" -ge 2 ] || drift_die '--min-level requires 1, 2, 3 or 4.' 2
      case "$2" in
        1|2|3|4) harness_level=$2 ;;
        *) drift_die '--min-level requires 1, 2, 3 or 4.' 2 ;;
      esac
      shift 2
      ;;
    *) drift_die 'Usage: drift harness [--json] [--min-level 1|2|3|4]' 2 ;;
  esac
done

set -- . --gate maturity
if [ "$harness_json" = true ]; then
  set -- "$@" --json
fi
if [ -n "$harness_level" ]; then
  set -- "$@" --min-level "$harness_level"
fi

drift_need npx
cd "$DRIFT_PROJECT_ROOT"
if [ "$harness_json" = true ]; then
  exec npx --yes harness-score@1.5.2 "$@"
fi
drift_print_opening_logo
drift_queue_scene "$DRIFT_ICON_HARNESS" "$DRIFT_HARNESS_PHRASE"
npx --yes harness-score@1.5.2 "$@"
