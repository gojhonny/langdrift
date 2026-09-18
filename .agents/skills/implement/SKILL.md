---
name: implement
description: Implement one approved Amarelo spec or unblocked ticket through scoped tests and reproducible evidence.
disable-model-invocation: true
---

# Implement

Implement only the scope owned by the active prospective spec and its currently unblocked ticket. [Execution](../../workflow/01-execution.md) owns this phase; [the cycle](../../workflow/cycle.md) owns the handoff to review and delivery closure.

## Procedure

1. Load `AGENTS.md`, `.agents/sdd/workflow/cycle.md`, the execution phase, the complete `.spec.md` contract, applicable rules/context/ADRs and the ticket dependency graph.
2. Start from the required base branch. The first implementation commit changes spec status from `ready` to `in-progress`.
3. Follow `.agents/sdd/skills/tdd/SKILL.md` at the predeclared seams: one red behavior, the minimum green implementation, then the next vertical slice.
4. Run focused typechecks/tests throughout. Preserve privacy fixtures, package boundaries, semantic suffixes and the repository lockfile policy.
5. Capture reproducible criterion evidence and promote proven durable conclusions according to the execution phase. Preserve the spec's acceptance boundary; a material contract change returns to planning and owner approval.
6. Hand the completed scope and evidence to [review and closure](../../workflow/02-review.md). That owner carries full repository validation, the `implemented` status transition, independent Standards and Spec-fidelity reviews, exact-head repetition and merge requirements. A failed or pending required gate continues to block delivery.

## Completion criterion

The selected approved scope is implemented, focused checks are green, criterion evidence is reproducible and promoted artifacts agree. No out-of-scope behavior or unresolved blocking implementation finding remains. The handoff identifies remaining delivery gates; completion of this procedure alone does not close the spec or authorize a merge.
