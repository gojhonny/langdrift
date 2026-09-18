---
id: "DESIGN-<id>"
title: "<technical change title>"
status: draft
revision: "0.1"
created: "<YYYY-MM-DD>"
updated: "<YYYY-MM-DD>"
owners:
  - "<engineering owner>"
specs: []
prds: []
research: []
rules: []
adrs: []
proposed_adrs: []
supersedes: []
superseded_by: null
review:
  state: pending
  artifact_revision: null
  reference: null
---

# DESIGN-<id>: <technical change title>

> **Technical Design Document template.** Suggested template location: `.agents/prompts/design.prompt.md`. Suggested authored-document location: `.agents/designs/<id>-<name>.design.md`.
>
> This document proposes how the linked specification will be implemented. The spec owns delivery requirements and acceptance criteria; this design owns technical reasoning. TDD means Technical Design Document here. The `tdd` implementation skill remains test-driven development.

<!-- AUTHORING GUIDE — remove this comment and the template guidance above in an authored document.
This is a proposed Amarelo template, not an active rule or an implemented CLI schema.
Replace placeholders, populate relevant reference arrays with repository-relative paths or durable URLs, and retain [] for genuinely absent references.
Use a separate design for consequential contracts, failure modes, persistence, migrations, or alternatives. A small change can embed its approach in the spec.
Core sections: summary, requirements/constraints, current state, approach, alternatives, failure behavior, verification, and review. Mark conditional sections not applicable with a brief reason or remove them when clearly irrelevant.
Do not invent approval, measurements, command availability, or production readiness. Drafting can proceed while questions are open; readiness depends on resolving material ones.
Suggested review lifecycle: draft -> in-review -> accepted, or rejected; a later replacement may supersede an accepted design. These are document-review states, not execution states. An accepted design is not proof of implementation or release.
The review.reference must identify a real review and the artifact revision it covers. Keep it null until available. A self-declared accepted field does not itself demonstrate approval.
-->

## 1. Summary and scope

<Describe the proposed mechanism, the problem it solves, and the boundaries affected in one or two paragraphs. Link to product rationale instead of copying the PRD.>

**In scope:** <technical responsibilities owned by this change>.

**Out of scope:** <adjacent mechanisms, future work, and behaviors that remain outside this delivery>.

## 2. Requirements and constraints

| Source | Requirement or constraint reference | Implication for this design |
|---|---|---|
| <SPEC-ID and path> | <AC-01 or section anchor> | <mechanism must preserve or provide> |
| <active rule or accepted ADR> | <obligation/section> | <boundary the approach must respect> |
| <PRD outcome, when applicable> | <outcome identifier> | <trade-off or measurement to consider> |

<List quantitative budgets only when defined: latency, availability, throughput, cost, data retention, or accessibility constraints. State units, workload, baseline, and source. Unmeasured values are hypotheses or proposed targets.>

## 3. Current state and uncertainty

**Observed implementation:** <relevant current code, configuration, contracts, and source revision>.

**Accepted target:** <applicable accepted decisions, including any intentional migration gap>.

| Question or assumption | Evidence / research reference | Confidence or limitation | Resolution needed before implementation? |
|---|---|---|---|
| <question> | <source, measurement, or experiment> | <known / inferred / unknown and why> | <yes/no, owner, next step> |

<Identify any bounded spike needed to choose the approach. Its result informs this design; exploratory code has no automatic approval for production.>

## 4. Proposed architecture

<Describe components, ownership, dependency direction, and how the critical flow crosses boundaries. Include a Mermaid diagram when it improves understanding. Distinguish engineering-harness behavior from deployed product behavior.>

| Component or boundary | Responsibility | Inputs and outputs | Owning package or service |
|---|---|---|---|
| <boundary> | <single responsibility> | <contract references> | <actual or explicitly proposed path> |

**Critical flow:** <explain the sequence, state transitions, authority checks, and externally visible result>.

**Compatibility:** <existing consumers, versioning, public API changes, and preserved behavior>.

### Interfaces and data — when applicable

| Contract or data | Authority / owner | Shape or schema reference | Validation and versioning |
|---|---|---|---|
| <API/event/data> | <canonical owner> | <schema, example, or existing definition> | <rules at the boundary> |

<For persisted or asynchronous work, describe transaction boundaries, ordering, delivery guarantees, deduplication, idempotency, and the handling of concurrent updates. Avoid restating schemas already owned by code or another approved contract.>

## 5. Alternatives and trade-offs

| Option | Benefits | Costs and failure modes | Requirement fit | Decision and rationale |
|---|---|---|---|---|
| <selected approach> | <benefits> | <costs> | <criterion references> | <why preferred> |
| <credible alternative> | <benefits> | <costs> | <criterion references> | <why not selected> |
| <keep current behavior, if viable> | <benefits> | <costs> | <criterion references> | <why sufficient or insufficient> |

<State uncertainty and conditions that would change the recommendation. Record an architectural decision separately only when it deserves durable rationale beyond this change.>

## 6. Failure behavior and recovery

| Failure or race | Detection | Required behavior | Recovery / retry boundary | Verification reference |
|---|---|---|---|---|
| <unavailable dependency> | <signal> | <user/system outcome> | <bounded response> | <planned case> |
| <partial write, duplicate job, or concurrent change, if relevant> | <signal> | <invariant preserved> | <idempotency/compensation> | <planned case> |

### Privacy, safety, and access — when applicable

<Identify sensitive data and allowed purposes; who may access it; where authorization is checked; what happens when consent or authority changes; prohibited logs/queue payloads; retention and deletion boundaries. Specify exactly what can be stopped and what may already be in flight. Link applicable rules and decisions.>

### Operations and cost — when applicable

<Name useful metrics, traces, logs, alerts, degraded behavior, dependency limits, and operating ownership. Define cost assumptions and measurement methods. For voice or AI behavior, identify representative evaluations and quality/latency/cost trade-offs without inventing outcomes.>

## 7. Architectural decisions

**Existing decisions reused:** <link applicable accepted ADRs and explain their effect>.

| Candidate decision | Why it merits a durable ADR | Alternatives and consequences | Proposed ADR reference | Review result |
|---|---|---|---|---|
| <decision, or state no new ADR needed> | <lasting significance> | <link to section 5> | <path when drafted> | <pending / actual decision reference> |

<An ADR records one consequential decision, not this entire design. Draft it during design when useful; record acceptance only after the authorized decision review. If an accepted ADR must change, propose an explicit superseding decision and preserve history.>

## 8. Verification and traceability

| Spec criterion / ADR obligation | Design mechanism | Verification method and boundary | Planned check or case | Evidence reference and result |
|---|---|---|---|---|
| <SPEC-ID#AC-01> | <mechanism above> | <behavioral / integration / static / evaluation / manual> | <actual check, or explicitly proposed check> | <pending> |

<State fixtures, prerequisites, meaningful negative cases, and untested limitations. Use synthetic sensitive-data fixtures. Planned verification is not completed evidence. A static structure check cannot substitute for behavioral proof.>

<Record source revision, dirty-tree/snapshot identity when relevant, checker version, and stable evidence location when results exist. Detailed run output belongs in `.audit/runs/` or retained CI evidence; this document links to it.>

## 9. Migration, rollout, and rollback — when applicable

| Stage | Compatibility / data impact | Entry condition | Verification and exit condition | Recovery or rollback limits |
|---|---|---|---|---|
| <expand> | <old/new coexistence> | <prerequisite> | <required evidence> | <recovery> |
| <migrate> | <consumer/data changes> | <prerequisite> | <required evidence> | <recovery> |
| <contract> | <retired interfaces> | <prerequisite> | <required evidence> | <irreversible effects, if any> |

<Link local ticket definitions and the tracker. Keep implementation tasks and execution status in their existing owners. State any final integration gate when intermediate migration work cannot remain green. Acceptance of this design does not authorize a release by itself.>

## 10. Open decisions and review

| Unresolved decision | Consequence if unresolved | Owner | Evidence or action needed | Blocking? |
|---|---|---|---|---|
| <decision, or none> | <impact> | <owner> | <next step> | <yes/no> |

| Reviewer / decision owner | Reviewed revision | Outcome and conditions | Review reference |
|---|---|---|---|
| <owner> | <commit or document version> | <pending until recorded> | <reference or pending> |

**Before readiness:** confirm that material requirements are resolved, applicable decisions are accepted, failure behavior is explicit, verification is feasible, and rollout implications are understood. Record applicability rather than adding unnecessary ceremonies.

**Implementation reconciliation:** <once implemented, link evidence and note deviations. Material behavior or architecture changes reopen the relevant review. Promote current architecture knowledge to `.agents/context/` without rewriting the historical rationale of this proposal.>

| Revision | Date | Change and rationale | Affected artifacts |
|---|---|---|---|
| 0.1 | <YYYY-MM-DD> | Initial draft | <specs, PRD, or ADRs requiring follow-up> |
