---
name: to-tickets
description: Decompose one ready Amarelo spec into local vertical ticket definitions and linked GitHub execution issues.
disable-model-invocation: true
---

# To Tickets

Convert one prospective `ready` numbered spec into a dependency graph of tracer-bullet tickets. [Ticket ownership](../../tickets/readme.md) separates the local slice definition from GitHub coordination; the numbered spec remains the behavioral source of truth.

## Procedure

1. Read the complete spec, its referenced rules, context and ADRs. Confirm status `ready` and identify every acceptance criterion.
2. Inspect the current implementation and existing public seams. Prefer slices that produce independently observable behavior.
3. Decompose the work vertically: each ticket should cross the layers required for one demonstrable outcome rather than implementing one technology layer in isolation.
4. Use expand–migrate–contract only for wide mechanical changes that cannot remain green as ordinary vertical slices.
5. Author local ticket definitions using [the canonical ticket template](../../tickets/template.md). Give every ticket an explicit `Blocked by` section. The graph must have at least one unblocked frontier and no orphaned acceptance criterion.
6. When publication is authorized, create GitHub issues in dependency order. Each issue links its local ticket and canonical `.spec.md` path, names the public seam, contains checkable execution criteria and references its blockers. Record each resulting issue URL in the local ticket; uncreated issues remain `Not published`.
7. Do not copy the entire spec into every issue, create speculative abstractions, or alter the parent spec while publishing tickets. Requirement changes return to the spec's approval boundary.

## Completion criterion

Every spec criterion maps to at least one ticket, all blocking edges are explicit and acyclic, and an implementation agent can select an unblocked issue without needing the original conversation. Local definitions and their published issue links agree; when publication is not authorized, report the graph as prepared and publication pending rather than claiming execution issues exist.
