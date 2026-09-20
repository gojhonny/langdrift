#!/bin/sh

: "${DRIFT_PROJECT_ROOT:?DRIFT_PROJECT_ROOT must be set by cli/src/drift.sh}"
: "${DRIFT_CLI_DIR:?DRIFT_CLI_DIR must be set by cli/src/drift.sh}"

. "$DRIFT_CLI_DIR/core/output.sh"

drift_die() {
  drift_message=$1
  drift_status=${2:-1}
  drift_print_error "Drift: $drift_message"
  exit "$drift_status"
}

drift_warn() { drift_print_warning "Drift: $*"; }
drift_has() { command -v "$1" >/dev/null 2>&1; }
drift_need() { drift_has "$1" || drift_die "Required command not found: $1" 127; }

drift_project_version() {
  sed -n 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$DRIFT_PROJECT_ROOT/package.json" | head -n 1
}

drift_find_env_templates() {
  find "$DRIFT_PROJECT_ROOT" \
    \( -name .git -o -name node_modules -o -name .next -o -name .turbo -o -name dist -o -name coverage -o -name .audits \) -prune \
    -o -type f \( -name .env.example -o -name .env.template \) -print
}

drift_git_checkout() {
  git -C "$DRIFT_PROJECT_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1
}

drift_path_has() {
  case ":${PATH:-}:" in
    *:"$1":*) return 0 ;;
    *) return 1 ;;
  esac
}

drift_default_bin_dir() {
  if [ -n "${DRIFT_BIN_DIR:-}" ]; then
    printf '%s\n' "$DRIFT_BIN_DIR"
    return 0
  fi

  if [ -n "${PNPM_HOME:-}" ]; then
    if drift_path_has "$PNPM_HOME/bin" || [ -d "$PNPM_HOME/bin" ]; then
      printf '%s\n' "$PNPM_HOME/bin"
      return 0
    fi
    if drift_path_has "$PNPM_HOME"; then
      printf '%s\n' "$PNPM_HOME"
      return 0
    fi
    printf '%s\n' "$PNPM_HOME/bin"
    return 0
  fi

  if [ -n "${XDG_BIN_HOME:-}" ]; then
    printf '%s\n' "$XDG_BIN_HOME"
    return 0
  fi

  if [ -n "${HOME:-}" ]; then
    printf '%s\n' "$HOME/.local/bin"
    return 0
  fi

  return 1
}
