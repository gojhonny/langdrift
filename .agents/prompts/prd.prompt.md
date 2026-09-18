---
id: "PRD-<id>"
title: "<Product initiative>"
status: "draft"
revision: "0.1"
owners:
  - "<Accountable product owner>"
created: "<YYYY-MM-DD>"
updated: "<YYYY-MM-DD>"
research: []
specs: []
designs: []
review:
  state: pending
  artifact_revision: null
  reference: null
---

# PRD-<id>: <Product initiative>

> **Product Requirements Document template.** Suggested template location: `.agents/prompts/prd.prompt.md`. Suggested authored-document location: `.agents/prds/<id>-<name>.prd.md`.
> The frontmatter is a proposed convention, not a schema supported by the current CLI.

<!-- REMOVABLE AUTHORING GUIDE
Replace every angle-bracket placeholder. Remove guidance and unused optional sections.
Populate reference arrays with repository-relative paths or durable URLs; retain [] when genuinely absent. The pending review reference and revision must identify a real review when populated, never an invented approval.
This PRD owns the user problem, desired outcomes, scope, and product intent.
Linked specs own bounded delivery behavior and executable acceptance criteria.
Technical designs own implementation mechanisms; ADRs preserve selected durable
architectural decisions. A PRD does not automatically require an ADR.
For a routine change already covered by one concise spec, omit a separate PRD.
Use stable requirement IDs after review. Keep claims distinguishable from hypotheses.
Do not invent evidence, baseline measurements, human reviews, or approvals.
-->

## 1. Decision requested

**Proposal:** <One paragraph describing the capability and expected user benefit.>

**Decision needed:** <Approve discovery, approve product scope, revise, or defer.>

**Why now:** <Opportunity, observed problem, or time-sensitive dependency.>

**Delivery boundary:** <The initiative or milestone this PRD covers.>

## 2. Problem, users, and context

<Describe the current user experience and its consequences. Separate observed pain
from an untested explanation. Avoid starting with a preferred implementation.>

| User or actor | Need or job to accomplish | Current difficulty | Supporting evidence |
|---|---|---|---|
| <Primary user> | <Desired task or result> | <Observed difficulty> | <Research reference or “unvalidated”> |
| <Secondary actor, if applicable> | <Need> | <Difficulty> | <Reference> |

**Existing behavior:** <What users can do today, including relevant workarounds.>

**Consequence of doing nothing:** <Expected impact and uncertainty.>

## 3. Research and evidence

Link research findings here; preserve detailed methods and results in the research
artifact. Research may support either product discovery or technical feasibility.

| Reference | Finding relevant to this PRD | Evidence type, date, and quality | Limitations |
|---|---|---|---|
| <Research path, source URL, or interview record> | <Finding> | <Observed, measured, reported, or inferred; date; strength> | <Sample, recency, bias, or applicability limits> |

| Assumption or unknown | Impact if wrong | Validation activity | Owner | Needed before |
|---|---|---|---|---|
| <Unverified proposition> | <Product consequence> | <Research or measurement> | <Person> | <Scope approval, implementation, or release> |

**Evidence interpretation:** <Explain how evidence supports the proposal and where
the proposal still depends on judgment. Record conflicting findings when present.>

## 4. Outcomes and success measures

State an observable user or product outcome, not merely “ship the feature.” Unknown
baselines remain unknown until measured. Mark proposed targets as proposed.

| Outcome ID | Desired outcome | Baseline and measurement window | Target and time horizon | Evidence source and owner |
|---|---|---|---|---|
| OUT-01 | <User or product outcome> | <Value and period, or “not measured”> | <Proposed target and period> | <Measurement method and accountable person> |

| Guardrail | Acceptable boundary | Measurement or review method | Response if breached |
|---|---|---|---|
| <Relevant quality, privacy, cost, or experience constraint> | <Proposed limit or linked policy> | <Evidence and owner> | <Investigate, pause, or revise scope> |

<Identify any new measurement needed and its data-minimization constraints. Define
detailed measurement contracts in the relevant spec or design.>

## 5. Scope and non-goals

| In scope for this initiative | Explicitly out of scope |
|---|---|
| <Included capability or user group> | <Excluded capability or user group> |
| <Included product boundary> | <Deferred work and reason> |

**Dependencies:** <Other initiatives, stakeholder decisions, integrations, or
existing policies that constrain scope. Link their authoritative artifacts.>

**Known constraints:** <Confirmed constraints, their source, and whether each can
be negotiated. Do not present a preferred technology as a confirmed constraint.>

## 6. User journeys

Keep these concise. Specs expand the relevant branches into testable behavior.

| Journey | Trigger and context | Intended experience | Successful outcome | Important exception |
|---|---|---|---|---|
| JRN-01: <Name> | <User situation> | <Short sequence of user actions and visible responses> | <Result> | <User-facing failure or interruption> |

**Experience principles:** <Relevant expectations for clarity, control,
accessibility, or continuity. Link existing product principles when available.>

## 7. Product requirements and delivery traceability

These requirements express product intent. Linked specs own precise behavior,
edge cases, and acceptance criteria; link to those definitions instead of copying
them here. Use globally distinguishable IDs such as `PRD-<id>-R01`.

| Requirement ID | Product intent | Rationale or outcome | Priority | Owning spec and acceptance links |
|---|---|---|---|---|
| PRD-<id>-R01 | <What the user must be able to achieve> | <OUT-01 or research reference> | <Must / Should / Could> | <Spec path and criterion anchors; “not allocated” until assigned> |
| PRD-<id>-R02 | <Additional product expectation> | <Outcome or rationale> | <Priority> | <Links> |

**Unallocated requirements:** <List requirements needing delivery ownership and
the person responsible for resolving the gap.>

**Related technical design:** <Link where implementation options, contracts, and
failure handling are developed. A design may expose a product trade-off that
requires updating and reviewing this PRD.>

## 8. Risks and domain considerations

Retain only relevant rows. For Amarelo, consider user control over memory, sensitive
information, accessibility, and voice interruptions when the feature touches them.
Product claims about clinical benefit require appropriate evidence and review.

| Risk or consideration | User impact | Product requirement or linked policy | Open decision and owner |
|---|---|---|---|
| <Privacy, accessibility, voice experience, safety, or other relevant risk> | <Impact> | <Requirement ID or authoritative policy> | <Question and person> |

Technical mitigations belong in the design; verification obligations belong in
the specs and linked evidence.

## 9. Rollout and learning plan — optional

**Initial audience and exposure:** <Who receives the capability first and why.>

**Product readiness conditions:** <Required review, evidence, communication, and
support preparation. Link technical release and rollback plans.>

**Review window:** <When outcomes will be assessed and by whom.>

**Decision after evaluation:** <Conditions for continuing, revising, expanding,
or withdrawing the capability.>

## 10. Human review and change history

| Role | Reviewer | State | Reviewed revision | Date and evidence |
|---|---|---|---|---|
| Product owner | <Name> | Pending | — | — |
| Engineering representative | <Name> | Pending | — | — |
| <Additional relevant reviewer; optional> | <Name> | Pending | — | — |

AI may draft or critique this document. Human approval must reference an actual
review of a specific revision. Status remains draft until the applicable review
process changes it. Material scope changes require renewed review.

| Revision | Date | Change and rationale | Affected artifacts |
|---|---|---|---|
| 0.1 | <YYYY-MM-DD> | Initial draft | <Research, specs, or designs requiring follow-up> |
