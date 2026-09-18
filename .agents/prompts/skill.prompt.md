---
name: {{SKILL_NAME}}
description: Describe the capability and the request that should select this skill.
---

# {{SKILL_NAME}}

## Purpose

State the bounded outcome and the repository consumer that needs this procedure. Keep applicable rules and specs authoritative; reference their owners instead of restating them.

## Procedure

Describe the actions needed for this outcome. Read existing authored instructions before changing artifacts, load only relevant references, preserve authorization boundaries and identify any material blocker. Keep conditional guidance with a pointer to the branch that needs it.

Choose the owning catalog: delivery procedures live under `.agents/sdd/skills/`, and project/domain procedures under `.agents/skills/`. Preserve an existing skill's invocation mode. For a new skill, normal automatic discovery is the default; use `disable-model-invocation: true` only for an explicitly chosen manual entry point and keep `agents/openai.yaml` policy consistent. A reference to another procedure does not grant permission to invoke an explicit-only skill or perform an external action.

## Completion criterion

Define a checkable result that distinguishes this procedure's completion from subsequent workflow phases. Name required evidence and the next owner without claiming checks or actions that have not occurred.
