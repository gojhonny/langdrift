# Cursor project harness

This directory contains Cursor-native adapters for the LangDrift engineering harness.
`AGENTS.md` and `.agents/` remain the source of truth for project guidance.

- `hooks.json` registers one shell gate and one post-edit feedback hook.
- `hooks/` contains dependency-free hook implementations.
- `commands/` holds intentional entry points for `./cli/drift doctor`, `./cli/drift harness --min-level 4`, and `./cli/drift verify packages`.
- `agents/` contains narrowly scoped review subagents. They consume the same LangDrift rules, decisions, and skills as the main agent and must not create a separate policy system.
