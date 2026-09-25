---
name: domain-modeling
description: Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a CONTEXT.md, or recording or editing an ADR.
---

<!-- langdrift-local-adaptation: edit only the vocabulary region of .agents/context.md. ADRs go to .artifacts/adrs/. Do not create a root CONTEXT.md or docs/adr/. -->

# Domain Modeling

Actively build and sharpen the project's domain model as you design. This is the *active* discipline: challenging terms, inventing edge-case scenarios, and writing the glossary and decisions down the moment they crystallise. (Merely *reading* the vocabulary for terms is not this skill: that's a one-line habit any skill can do. This skill is for when you're changing the model, not just consuming it.)

## File structure

LangDrift keeps one vocabulary region inside `.agents/context.md`, between the `langdrift-vocabulary` markers. The rest of that file is consolidated technical context. Do not rewrite it, replace it, or create a root `CONTEXT.md`.

ADRs are separate files under `.artifacts/adrs/`, numbered `0001-slug.md`, `0002-slug.md`, and so on.

Create an ADR file lazily: only when the first ADR is actually needed. Do not create `docs/adr/` or a context map.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the existing language in the vocabulary region of `.agents/context.md`, call it out immediately. "Your glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses vague or overloaded terms, propose a precise canonical term. "You're saying 'account': do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When domain relationships are being discussed, stress-test them with specific scenarios. Invent scenarios that probe edge cases and force the user to be precise about the boundaries between concepts.

### Cross-reference with code

When the user states how something works, check whether the code agrees. If you find a contradiction, surface it: "Your code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update the vocabulary inline

When a term is resolved, update only the vocabulary region of `.agents/context.md`, between the `langdrift-vocabulary` markers, right there. Don't batch these up: capture them as they happen. Use the format in [CONTEXT-FORMAT.md](./CONTEXT-FORMAT.md).

That region should be devoid of implementation details. Do not treat it as a spec, a scratch pad, or a repository for implementation decisions. It is a glossary and nothing else. Leave every other section of `.agents/context.md` unchanged.

### Offer ADRs sparingly

Only offer to create an ADR when all three are true:

1. **Hard to reverse**: the cost of changing your mind later is meaningful
2. **Surprising without context**: a future reader will wonder "why did they do it this way?"
3. **The result of a real trade-off**: there were genuine alternatives and you picked one for specific reasons

If any of the three is missing, skip the ADR. Use the format in [ADR-FORMAT.md](./ADR-FORMAT.md).
