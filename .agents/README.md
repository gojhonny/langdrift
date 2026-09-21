# LangDrift agent harness

`.agents/` holds repository guidance for implementation agents. [AGENTS.md](../AGENTS.md) is the source of repository-wide invariants. This directory adds scoped context, code-design rules, and procedures.

## Directory map

- `context/` — descriptive fragments of the current repository. Load only the fragment the task needs. See [context/README.md](context/README.md).
- `rules/` — `.rule.md` files. A rule applies when its scope matches current LangDrift code and it does not contradict `AGENTS.md`. See [rules/README.md](rules/README.md).
- `skills/` — procedures such as `tdd`, `implement`, `code-review`, `to-spec`, `to-tickets`, `grilling`, and `grill-me`. A skill does not create architecture by mentioning a path or a foreign project.

## Loading order

1. Current code, config, and schema.
2. An explicit owner decision.
3. [AGENTS.md](../AGENTS.md).
4. The relevant `.agents/context/*.ctx.md` files.
5. Applicable `.agents/rules/*.rule.md` files.
6. A skill, only for the procedure it describes.

`.cursor/` is the Cursor adapter: hooks and a reviewer. It does not replace this harness. See [050-harness-and-agent-runtime.ctx.md](context/050-harness-and-agent-runtime.ctx.md).

## Boundaries

`.drifts/` is restricted. Do not create, edit, move, delete, or fill files there unless the owner authorizes that scope.

`./cli/drift harness --min-level 4` measures recognized harness infrastructure. It does not prove tests, correctness, or product readiness.

Some rules and skills still contain Amarelo vocabulary, NestJS examples, or references to paths that are not in this repository, including `.agents/sdd/`, `.agents/workflow/`, and ticket workflows. Those references are unadapted scaffolding. Do not create the missing structure because a copied file names it.
