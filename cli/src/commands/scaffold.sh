#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"

kind=${1:-}; [ "$#" -eq 0 ] || shift
name=${1:-untitled}
slug=$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g; s/--*/-/g; s/^-//; s/-$//')
[ -n "$slug" ] || slug=untitled

case "$kind" in
  adr|rule|spec)
    dir="$DRIFT_PROJECT_ROOT/.agents/${kind}s"
    [ "$kind" != adr ] || dir="$DRIFT_PROJECT_ROOT/.agents/adr"
    [ "$kind" != rule ] || dir="$DRIFT_PROJECT_ROOT/.agents/rules"
    [ "$kind" != spec ] || dir="$DRIFT_PROJECT_ROOT/.agents/specs"
    mkdir -p "$dir"
    next=$(find "$dir" -maxdepth 1 -type f -name '[0-9][0-9][0-9][0-9]-*' 2>/dev/null | wc -l | tr -d ' ')
    next=$((next + 1))
    number=$(printf '%04d' "$next")
    file="$dir/$number-$slug.$kind.md"
    ;;
  skill)
    dir="$DRIFT_PROJECT_ROOT/.agents/skills/$slug"
    mkdir -p "$dir"
    file="$dir/SKILL.md"
    ;;
  *) drift_die "Usage: drift <adr|rule|skill|spec> [name]" 2 ;;
esac

[ ! -e "$file" ] || drift_die "Already exists: ${file#$DRIFT_PROJECT_ROOT/}"
printf '# %s\n\nStatus: Draft\n' "$name" > "$file"
drift_print_success "Created ${file#$DRIFT_PROJECT_ROOT/}"
