---
context: harness-and-agent-runtime
status: current
source_branch: staging
reviewed_at: 2026-09-21
sources:
  - AGENTS.md
  - .agents/README.md
  - .agents/rules/010-nestjs.rule.md
  - .agents/skills/tdd/SKILL.md
  - .cursor/readme.md
  - .cursor/hooks.json
  - cli/src/commands/harness.sh
  - .github/workflows/harness-score.yml
---

# Harness and agent runtime

[AGENTS.md](../../AGENTS.md) and `.agents/` are the canonical guidance. `.cursor/` registers a shell guard and a Biome edit hook, and it contains the `langdrift-reviewer` subagent. That folder adapts the harness to Cursor. It is not a second policy.

`./cli/drift harness` runs `npx --yes harness-score@1.5.2` with `--gate maturity`. Optional flags are `--json` and `--min-level 1|2|3|4`. The command's own help says the score measures recognized harness infrastructure, not test coverage, correctness, or live product readiness.

`.github/workflows/harness-score.yml` is named Harness. Its `core` job checks out the repo, uses Node 24, and runs `./cli/drift harness --min-level 4`.

## Imported material that is not architecture

These paths are not in the tree: `.agents/workflow/`, `.agents/prompts/`, `.agents/templates/`, `.agents/rules/code-design/`, and `.agents/sdd/`.

`cli/readme.md` still says the repository has no backend and that `runtime` is only reserved. The Early Access runtime in [04-messaging-runtime-and-environment.ctx.md](04-messaging-runtime-and-environment.ctx.md) is the current exception. Do not delete that runtime because the CLI readme is older.

`.agents/skills/tdd/SKILL.md` still speaks about Amarelo behavior. `.agents/rules/010-nestjs.rule.md` describes Nest.js and is `always-apply: false`. Other rules mention package layouts this repository does not use. Treat those passages as unadapted scaffolding. Do not create NestJS modules, kernel packages, or ticket workflows from them.

The directories that do exist under `.agents/` are `context/`, `rules/`, and `skills/`.
