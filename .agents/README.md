# LangDrift agentic software factory

This is the draft factory harness, not an autonomous delivery system. LangDrift is its first product and experiment. Amarelo is a reference; its product decisions do not become LangDrift policy.

| Location | Responsibility |
| --- | --- |
| `context/` | Product Vision, vocabulary, and observed system context |
| `rule/` | Deliberately adopted engineering obligations |
| `workflow/` | All planning, decisions, handoffs, and delivery records |
| `skills/` | Reusable agent procedures, including the imported Pocock-derived skills |
| `prompts/` | Artifact authoring and review instructions |
| `templates/` | Retained artifact templates, awaiting deliberate adaptation |
| `schemas/` | Reserved for workflow-document metadata contracts |
| `config/` | Reserved for factory routing and skill provenance configuration |
| `assets/` | Referenced diagrams and other planning assets |

Start with [workflow ownership](workflow/README.md). Root [AGENTS.md](../AGENTS.md) remains the repository entrypoint. Load only task-relevant documents.

## Boundaries

- `.agents/` owns the factory and human-readable planning. `.drifts/` is the pluggable LangDrift integration/data contract. `.audits/` owns checks and verification evidence.
- No `draft/`, `approved/`, or `done/` folders. Document lifecycle lives in frontmatter; identity and paths remain stable when status changes.
- Empty areas contain `.gitkeep`. Their existence does not imply implemented procedures, validators, approvals, or integrations.
- Existing code-design rules remain byte-for-byte unchanged in this structural draft. We will iterate the rules needed for the website first; this PR does not require retroactive code-conformance work.
- Imported prompts and skills remain unchanged. Existing Amarelo paths, CLI names, metadata, and missing workflow dependencies are known migration work, not executable LangDrift instructions. Resolve routing against this README and the workflow README; do not manufacture approvals or missing files to satisfy inherited instructions.
- The seven imported skills are retained reference material, not a claim of complete end-to-end factory operation. Adapting their inputs, outputs, and review gates is a later explicit task.

## First initiative

[Website hero PRD](workflow/prds/0001-website-hero.prd.md) and [Sinapsi handoff](workflow/handoffs/sinapsi-node-selection/handoff.md). Both are drafts. The user will publish the Sinapsi package before website integration proceeds.
