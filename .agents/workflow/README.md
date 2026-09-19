# Workflow and artifact ownership

All planning stays inside this folder. Artifact types organize documents; status never determines their directory. This is a draft workflow contract to iterate with the owner, not an implemented orchestration engine.

| Folder | Owns |
| --- | --- |
| `stages/` | Reserved for intake, research, planning, implementation, verification, review, delivery, and feedback procedures |
| `intake/` | Requests, incidents, and problems before scope is agreed |
| `research/` | Sources, observations, experiments, and uncertainty |
| `prds/` | Why a change matters, user outcomes, scope, and product requirements |
| `designs/` | Product/UX behavior, layout, interaction, and accessibility decisions |
| `technical-designs/` | Architecture, interfaces, alternatives, failure modes, and migration |
| `specs/` | Observable behavioral contracts and stable acceptance-criterion IDs |
| `adrs/` | Consequential decisions and their supersession history |
| `tickets/` | Bounded implementation slices, dependencies, and linked criteria |
| `handoffs/` | Contracts and dependencies handed to another project or owner |
| `deliveries/` | Human acceptance, PR/release links, and exact-revision verification references |
| `experiments/` | Factory hypotheses, evaluation methods, and conclusions |

## Document identity and state

Use frontmatter with `id`, `type`, `title`, `status`, `initiative`, and `owner` in newly authored planning documents. Example states are `draft`, `in-review`, `approved`, `done`, and `superseded`; the allowed transitions for each artifact type remain to be specified. A PRD can be approved while its initiative is still planned. A handoff can be delivered while dependent implementation remains blocked.

Approval must name the human decision and the exact document revision. A status field, agent statement, schema-valid JSON, or green build is not approval. Keep unknown facts explicit. Superseded decisions stay discoverable through links.

Use standard relative Markdown links between artifacts and stable IDs in references. Files do not move when their state changes. Scope changes after approval require review of affected criteria and downstream artifacts; previous evidence does not automatically validate the new scope.

## Intended development loop

Research informs the PRD. Product design and technical design refine it; behavioral specs make the expected result verifiable. Material architecture choices receive ADRs. Human-reviewed scope becomes small vertical-slice tickets. Implementation and verification produce evidence for human review and delivery; feedback returns to research.

This adapts the Pocock-derived `to-spec` → `to-tickets` → `implement` → `code-review` skills. Their LangDrift routing still needs iteration. Small changes can reference an existing PRD/design rather than creating every artifact type. TDD is a development method, not proof that product intent or delivery approval is satisfied.

Until a tracker is selected, local tickets own their scope; no external ticket system is configured. If a tracker is later used, define its ownership of assignment and live execution state explicitly instead of editing duplicate status fields in two places.

Humans retain product-scope, design, PR, and production decisions. This draft authorizes no autonomous release and configures no production tools.

## Machine-readable integration

[`.drifts/drift.json`](../../.drifts/drift.json) records initiative progress, actors, activity, and artifact references. It does not replace PRDs or duplicate their approval status. Obsidian/MCP adapters will be optional consumers of that contract. Documents must remain useful with `.drifts/` removed.

[`.audits/`](../../.audits/README.md) stores checks and verification evidence. Link evidence to exact source and document revisions; separate passed, failed, blocked, and not-run outcomes.

## Existing scaffolding limitations

`drift adr` and `drift spec` now target `workflow/adrs/` and `workflow/specs/`. They still produce minimal title/status placeholders, not schema-complete approved artifacts. Imported templates now live in `../templates/`; their source content is retained and may still name Amarelo paths or tools. No new validators or lifecycle automation are installed by this draft.
