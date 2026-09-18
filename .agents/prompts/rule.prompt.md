---
version: 0
extends:
name:
description:
status: draft
alwaysApply: false
priority: normal
scope:
tags: []
---

# Rule name

## Purpose

Describe the responsibility and the implementation decisions this rule controls. Follow the detailed authoring contract in `.agents/rules/template.md`.

## Scope

Identify affected files, projects, interfaces and consumers. State applicability and exclusions explicitly. Metadata describes intended scope; do not assume automatic loading or inheritance merely because a field exists.

## Rules

### 1. Name one implementation obligation

#### Required behavior

State precisely what the agent must do and what it must never do. Give the obligation a stable reference within this file. Use numbered rule sections, not a flat list of dash-bullet obligations.

#### Rationale and boundaries

Explain the relevant design reason, edge cases and limits. Preserve enough detail to implement the owner's intent without guessing.

#### Compliant example

Insert concrete code or a worked example appropriate to this rule's technology and scope. Explain why it satisfies the obligation.

#### Noncompliant example

Show the corresponding prohibited implementation and explain the violation. Avoid examples that conflict with another applicable rule.

#### Related rules and skills

Reference existing canonical files and numbered obligations. Explain when a supporting skill is useful. A skill supplies a procedure and cannot override this rule.

#### Verification

Define the observable outcome, static examination, test seam or existing checker that can demonstrate compliance. Document prerequisites and applicability; authoring this file does not execute the verification.

#### Exceptions

Record explicitly accepted exceptions, their owner, rationale and limits. Do not invent an exception to accommodate an implementation.

## Mechanical Enforcement

Identify which obligations can be checked mechanically and which require semantic review. Keep the relation between obligation, evidence and failure condition explicit. Mark missing enforcement as pending rather than claiming an implemented checker.

## References

Add relevant project contracts, upstream technical documentation and supporting skill resources. Explain their role; external references do not establish additional normative authority.

## Authoring status

This skeleton is draft and non-normative until the owner supplies and accepts its obligations and applicable scope.
