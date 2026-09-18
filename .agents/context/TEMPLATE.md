---
description: "Pending owner authoring: the boundary or question this document explains."
scope: []
topics: []
---

# Context title

This is an unfilled descriptive-context template. It records no project decision, active policy or verified implementation. Replace the placeholders after reading the affected source and the owner's input.

## Purpose and scope

Explain which question this context answers, who owns the described capability, and what the reader should already understand. Keep the document directly in `.agents/context/`; use the header to describe scope instead of introducing nested folders.

`description` is a specific one-sentence selection hint. Populate `scope` with repository-root-relative owner and consumer paths/globs, and `topics` with a few stable concepts. Example header values are `scope: ["workspaces/ai/conversation/**", "workspaces/apps/chatterbox/**"]` and `topics: [conversation, serving, boundaries]`. These are reading hints; they do not install automatic loading or execute anything.

## Current state

Describe observed responsibilities, public contracts and important boundaries. Distinguish implemented source from executed evidence and live operation. Include concrete examples, code excerpts or diagrams when they improve understanding; identify their source and whether they are illustrative or observed.

Pending owner authoring.

## Decisions and boundaries

Explain the intent and link each adopted obligation to its owning `.rule.md`, numbered SDD spec or ADR. Rules own durable constraints; context supplies understanding and navigation. Preserve decisions, exceptions and unresolved questions explicitly when redistributing existing material.

Pending owner authoring.

## Limitations and history

Keep dated prior behavior and implementation evidence distinguishable from current behavior. Record unknowns, deferred work and the contract that owns them. Do not convert a historical no-tests exception, a successful build, a draft or a proposed workflow into current operating authority.

Pending owner authoring.

## References

Link related flat context, scoped rules, current SDD skills and the canonical cycle as needed. External research belongs in `.agents/references/` with provenance; an outside recommendation becomes a project obligation only through the owning rule. For SDD procedure selection, use [workflow context](003-workflows.md).

Before considering the document complete, replace placeholders, record truthful scope, add its link to [readme.md](readme.md), and update references affected by moves. The numeric context prefix aids navigation and does not change a durable `SPEC-###` ID.
