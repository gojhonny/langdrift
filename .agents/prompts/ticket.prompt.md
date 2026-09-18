# <ticket title: one demonstrable outcome>

## Spec

`SPEC-###` — `.agents/sdd/specs/NNN-name.spec.md`.

Reference exactly one ready parent spec by durable ID and canonical path. Map its existing criteria below; required product behavior stays in that spec.

## What to build

Describe one narrow, complete and independently demonstrable outcome. Name the slice boundary and exclude adjacent work without copying the full spec.

## Public seam

Name the existing public interface through which the outcome and failure behavior will be observed.

## Acceptance criteria

- Parent spec criterion reference — observable outcome covered by this slice.
- Parent spec failure-behavior reference — failure or recovery behavior covered here.
- Scoped validation that demonstrates the outcome through the declared seam.

Use checkable outcomes and references. Issue status owns execution progress; these definitions are not a second completion checklist.

## Blocked by

- Local ticket path and linked issue reference for each prerequisite, or `None`.

Declare every dependency explicitly. Preserve an acyclic graph with an unblocked frontier; the issue's runtime state determines whether a declared prerequisite is complete.

## GitHub issue

`Not published` until the execution issue is actually created; then record its URL. The issue links this ticket and the parent spec, carries a concise checkable execution view, and owns assignee, status and discussion.

## Evidence

Link accepted criterion evidence in the parent spec and delivery PR when available. Pending evidence stays visibly pending; temporary output belongs in `.audit/` rather than being copied into a new source of truth.
