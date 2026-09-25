# 00 Planning

## Inputs

An owner request to shape an effort, plus `.agents/context.md` and any ADRs already under `.artifacts/adrs/`.

## Actions

When the owner invokes `grill-with-docs`, that skill runs `grilling` and `domain-modeling`. Do not invoke it because a previous message discussed the effort.

Use `research` when a decision needs an external primary source. Save the note under `.artifacts/research/`.

Write a PRD under `.artifacts/prds/` only when the change needs a product requirement that the spec will not carry alone. Write a technical design under `.artifacts/designs/` only when the change needs a design record that an ADR or the spec will not carry alone. Those documents follow this phase. There is no separate PRD or design skill.

Write an ADR under `.artifacts/adrs/` only for a decision that is hard to reverse, surprising without the context, and the result of a real trade-off. Record the author, the state, and the approval.

After the owner invokes `to-spec`, synthesize the shared understanding and confirm the interfaces under test. After the owner approves the spec and invokes `to-tickets`, split that approved contract into tickets.

## Outputs

- Vocabulary updates inside the vocabulary region of `.agents/context.md`, when terms were resolved.
- Optional PRD, design, research note, and ADRs in `.artifacts/`.
- One spec in `.artifacts/specs/`.
- Tickets in `.artifacts/tickets/`, each pointing at that spec.

## Done

The spec and the ticket breakdown carry Approval for the versions just agreed, every ticket has `Status`, `Blocked by`, and acceptance criteria, and `Delivery progress` is `not-started`.

## Blocked

Stop when a term, scope boundary, or interface is still contested. The next step is another explicit `grill-with-docs` or `research` invocation, not `implement`.
