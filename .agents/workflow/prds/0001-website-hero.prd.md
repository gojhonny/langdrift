---
id: PRD-0001
type: prd
title: Explore Product Vision movement from the website hero
status: draft
initiative: website-hero
owner: gojhonny
---

# Website hero: connected evidence and Product Vision

## Product intent

Help a founder understand that LangDrift connects recorded intent to product evolution: what changed, who or what contributed, what evidence explains it, and whether the movement was intentional, unexplained, or still under review. The graph is an exploration surface; the Product Vision chart is the outcome view. Connection alone is not proof of causation.

This first website experience uses curated illustrative data. It is not a live repository analysis, an implemented Obsidian connection, or a validated Product Vision formula.

## Hero content and composition

Keep the headline exactly:

> Why did your Product Vision fall from 91% to 73%?

Proposed improved description:

> Connect your product's evolution to the vision behind it. LangDrift traces changes to the decisions, people, and agents involved—showing what moved, why it moved, and whether it reflects intentional evolution, unexplained drift, or a question still under review.

Center the headline horizontally, then center the description below it. On wide screens, place two coordinated cards beneath the description: the existing Product Vision chart on the left and the interactive Sinapsi graph on the right. Center `See what moved` (`#why`) and `How it works` (`#attribution`) beneath the cards. This order interprets the user's final instruction that the cards sit above the buttons; confirm before implementation if the buttons were instead intended immediately above the cards.

Remove the hero eyebrow `Visual-first for truth · Voice-first for inquiry`. This removes website copy, not the underlying product principles or the separate Voice feature.

On narrow screens, stack chart then graph, with controls remaining reachable. Preserve navigation/auth actions, light/dark themes, readable labels, accessible focus, and reduced-motion behavior. Do not force the full headline onto one line.

## Interaction requirements

- `HERO-01`: Clicking/tapping a meaningful graph node updates the website Jotai state and the existing chart's selected event/detail, without navigation or reload.
- `HERO-02`: Keyboard activation reaches the same nodes and result. Hover or focus alone does not activate graph selection.
- `HERO-03`: The selected graph node is visibly distinguishable; chart, explanation, and graph reflect one shared selection, not independent conflicting states.
- `HERO-04`: Graph relationships represent curated context (vision, decisions, changes, people/agents). Each interactive node has an explicit host-owned mapping to an existing chart event; relations do not imply a mathematically calculated impact or causation.
- `HERO-05`: Repeated selection is harmless. Pan/drag/zoom do not select nodes. Unknown IDs do not change the chart; missing mappings are surfaced during validation, not silently assigned to an arbitrary event.
- `HERO-06`: If Sinapsi cannot load, the existing chart and explanatory content remain usable. No empty hero or hidden essential product explanation.
- `HERO-07`: Keep `91%` and `73%` as illustrative headline context. Node selection explains movement; it must not manufacture a new score or imply an approved scoring formula.
- `HERO-08`: Preserve the current chart selection interaction and state logging. If graph highlighting follows chart selection, use one canonical node per chart event and do not emit another user-selection event.

## Existing implementation reference

Inspected LangDrift revision: `d6bc1c03ceaabf330fc80d888ccd8b942a752645`.

- `apps/website/src/app/page.tsx` owns the illustrative `visionPoints` and chart selection callback.
- `apps/website/src/state.ts` owns Jotai `selectedPointAtom` (currently a numeric array index) and the existing atom logger registration.
- `packages/react/src/ui/product-vision-curve/product-vision-curve.tsx` already accepts `data`, `selectedEventId`, and `onSelectEvent`.
- `packages/react/src/vendors/smoothui/header-4.tsx` owns the current headline, eyebrow, description, buttons, and hero arrangement.

Proposed minimal bridge: Sinapsi node ID → LangDrift's explicit node/event lookup → index in the current fixture → `selectedPointAtom` → derived chart props. Use event IDs, not array positions, as the durable graph mapping. Data passed by the graph is a selection identifier, never executable rendering instructions.

Before integration, review the existing fixture consistency: plotted values `91 → 88 → 84 → 79 → 73`, displayed event deltas, and the `14 intentional / 4 unexplained` summary are not currently a reconciled attribution model. Do not turn those inconsistent demo values into new assertions or a Product Vision formula. Agree one coherent illustrative story in the behavioral spec before implementation.

## Dependencies and sequence

1. Iterate only the website-relevant rules; unused rule categories stay empty.
2. Review the [Sinapsi node-selection handoff](../handoffs/sinapsi-node-selection/handoff.md).
3. Sinapsi owner implements, tests, and publishes its npm package; record the verified package version and source revision.
4. Review product/technical design and behavioral spec, then create bounded implementation tickets using the adapted Pocock workflow.
5. Integrate the published version into the website with Jotai; verify the exact candidate revision and request human review.

This PR performs documentation/scaffolding only. It does not publish Sinapsi, install its package, change the hero, deploy a website, implement MCP/Obsidian, or approve any draft.

## Success and verification plan

Demonstrate pointer, touch, and keyboard node activation selecting the expected existing event. Verify chart and explanatory content remain synchronized, no duplicate event listeners after remount, two component instances remain isolated, graph failure fallback works, and narrow/wide layouts support both themes and reduced motion. Record criterion-by-criterion outcomes against the implementation revision; a build alone is not interaction evidence.

## Reference

[Obsidian's Graph section](https://obsidian.md/) is a visual/exploration reference, not an API dependency or proof of node-to-chart behavior. LangDrift supplies the semantics and coordinated chart interaction; Sinapsi remains an independent graph renderer.
