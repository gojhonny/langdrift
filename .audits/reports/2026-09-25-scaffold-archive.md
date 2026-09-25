# Scaffold migration record

Sanitized record of the bootstrap. It is not a product test and does not show that the Spec-driven Development cycle works.

Migration base: `275666c47dce3b0c4bccc4470d223369892999df`

That commit is the legacy harness. Inspect or restore it through Git. This task did not roll it back.

At preflight the working tree matched that commit. No repository-local backup directory or archive manifest was retained. The previous harness is recoverable only from the migration base.

Legacy paths removed from the active tree, and still present in the migration base:

- `.agents/context/`
- `.agents/rules/`
- the previous root `AGENTS.md`
- `.cursor/` was already absent in that commit

Durable knowledge from the previous entrypoint and context fragments is in `.agents/context.md`. The active entrypoint is the new root `AGENTS.md`.
