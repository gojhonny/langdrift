#!/bin/sh
set -eu
. "$DRIFT_CLI_DIR/core/common.sh"
[ "$#" -eq 0 ] || drift_die "Help does not accept arguments." 2

drift_print_logo
cat <<'EOF'
Lang Drift monorepo platform CLI

Usage:
  drift [--logs] <command> [--logs] [arguments]
  drift --help

Commands:
  help                                  Show this guide
  --version                             Print the Drift version
  bootstrap                             Install and configure a checkout
  setup [--bin-dir <directory>]         Install the user-scoped launcher
  doctor [--ci]                         Diagnose repository prerequisites
  harness [--json] [--min-level <1-4>] Inspect placeholder harness maturity
  cleanup                               Remove generated state and dependencies
  runtime <dev|start|build>             Run frontend workspace runtime tasks
  changelog <product> [options]         Prepare a product changelog
  adr [name]                            Create the next empty ADR
  rule [name]                           Create the next empty rule
  skill [name]                          Create an empty local skill
  spec [name]                           Create the next empty spec
  env <setup|validate>                  Prepare or validate environment files
  git <setup|doctor|pre-commit|commit-msg|lint-history>
  check <all|architecture|canonical|harness|imports|memory|platform|rules|runtime|skills|specs>
                                        Run audit checkers once implemented

First checkout:
  pnpm install
  pnpm postclone
  ./cli/drift setup

Drift never edits shell profiles or installs a global npm package.
EOF
