# 04 Refinement

## Inputs

Accepted conclusions from the cycle: terms, decisions, repeated obligations, and checks that should become machine-enforced.

## Actions

Promote only what the owner accepted.

- A resolved term updates the vocabulary region of `.agents/context.md`.
- A consequential decision becomes an ADR under `.artifacts/adrs/`, with author, state, and approval.
- A repeated obligation the owner approves can later become a guardrail under `.agents/guardrails/`.
- An obligation a machine can check can later become a test, a checker, or a hook.

One observation does not become a rule. Do not edit a past decision so that it appears to have predicted this result.

This bootstrap does not create those rules, checkers, or hooks.

## Outputs

Updates in the destinations above, each traceable to the accepted conclusion.

## Done

Every accepted conclusion is either promoted or explicitly left unpromoted with a reason. `Delivery progress` does not move because a note was written.

## Blocked

Stop when a conclusion is still disputed. Leave it in the research note or the review. Do not promote it.
