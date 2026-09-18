---
id: HANDOFF-0001
type: handoff
title: Sinapsi node selection for the LangDrift website hero
status: draft
initiative: website-hero
owner: gojhonny
---

# Sinapsi node selection

## Purpose and delivery boundary

Extend the independent Sinapsi Web Component so activating a meaningful graph node can update another application's state. The first consumer is LangDrift: its hero will display the existing Product Vision chart on the left and an interactive Sinapsi graph on the right. Selecting a graph node will select the corresponding chart event through a LangDrift-owned Jotai atom.

This is a proposed implementation handoff, not an implemented API or a publication instruction. Sinapsi implementation and npm publication happen separately; LangDrift integration starts only after the owner publishes and identifies a compatible package version. This change must not introduce Jotai, LangDrift calculations, Obsidian, MCP, or product-specific data models into Sinapsi.

- Related requirement: [PRD-0001: Website hero](../../prds/0001-website-hero.prd.md).
- Visual interaction reference: [Obsidian's Graph section](https://obsidian.md/). Use its discoverable node exploration as inspiration, not its implementation or an implied Obsidian integration.
- Consumer reference: [LangDrift website](https://langdrift.md/).

## Observed baseline

Inspected on 2026-09-18. These observations apply to the pinned source revisions, not a verified npm release.

| Area | Observed state |
| --- | --- |
| Sinapsi repository | `gojhonny/sinapsi`, main commit `3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4` |
| Package and element | Repository package version `@neongate-ai/sinapsi@0.1.0`; native `<sinap-si>` |
| Entry points | SSR-safe root export; `/browser` registration; `/react-types` JSX types; `/standalone` browser bundle |
| Public controls | `move`, `speed`, numeric `nodes`, `activation`, `palette`, and the three color attributes |
| Graph | Procedurally generated topology and positions; `nodes` means density, not application records |
| Identity | Internal `GraphNode.id` is numeric; projected `RenderNode` does not retain it |
| Rendering | Canvas in a closed shadow root; internal canvas is `aria-hidden` |
| Interaction | No public semantic node-selection event, supplied graph-data property, or selected-node property in the inspected implementation |
| LangDrift repository | Main commit `d6bc1c03ceaabf330fc80d888ccd8b942a752645` |
| LangDrift selection | Website `selectedPointAtom` stores an array index; chart accepts `data: VisionPoint[]`, `selectedEventId`, and `onSelectEvent` |
| Existing demo event IDs | `baseline`, `pricing`, `authentication`, `exports` |

Relevant Sinapsi sources at the inspected revision:

- [Public element types](https://github.com/gojhonny/sinapsi/blob/3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4/src/domain/kernel/element.types.ts).
- [Graph generation](https://github.com/gojhonny/sinapsi/blob/3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4/src/core/graph/create-graph.compute.ts).
- [Element lifecycle](https://github.com/gojhonny/sinapsi/blob/3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4/src/factories/element-class.factory.ts).
- [Scene projection](https://github.com/gojhonny/sinapsi/blob/3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4/src/services/scene.service.ts) and [canvas renderer](https://github.com/gojhonny/sinapsi/blob/3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4/src/services/renderer.service.ts).
- [Published entry-point declarations](https://github.com/gojhonny/sinapsi/blob/3c8f1d1a7c310043749b531ca0f8e0b854ebb5d4/package.json).

A callback alone is insufficient: a randomly generated node index must not masquerade as a durable product event or an evidence relationship.

## Proposed public contract

The names below are a concrete proposal for implementation and review, not exports that consumers can use today.

```ts
export interface SinapsiDataNode {
  readonly id: string
  readonly label: string
}

export interface SinapsiDataEdge {
  readonly source: string
  readonly target: string
}

export interface SinapsiGraphData {
  readonly nodes: readonly SinapsiDataNode[]
  readonly edges: readonly SinapsiDataEdge[]
}

export interface SinapsiNodeSelectDetail {
  readonly nodeId: string
  readonly input: 'pointer' | 'keyboard'
}

export type SinapsiNodeSelectEvent = CustomEvent<SinapsiNodeSelectDetail>
```

Extend `SinapsiElement` with these properties:

| Property | Proposed behavior |
| --- | --- |
| `graphData: SinapsiGraphData \| null` | Consumer-supplied semantic nodes and edges; `null` retains the existing generated decorative mode |
| `interactive: boolean` | Opt-in interaction, default `false`; reflect standard boolean-attribute presence semantics |
| `selectedNodeId: string \| null` | Host-controlled selected visual state; `null` clears selection |

Use JavaScript properties for structured data. Do not serialize a graph or callbacks into HTML attributes. Preserve `nodes` as the existing numeric density control in generated mode; never silently reinterpret it as an array. When `graphData` is supplied, its node count and edges are authoritative, and `nodes` must not rebuild or replace that dataset.

### Data and identity guarantees

1. IDs are nonempty, unique consumer identifiers. They survive reordering, animation, resize, selection, palette changes, and layout recomputation. Preserve them through projection and hit-testing; never expose a render-array index as their substitute.
2. Labels are nonempty plain text, usable as accessible names. Never interpret labels or IDs as HTML, executable instructions, URLs to open, or code to evaluate.
3. Accept an explicit semantic graph with 0–400 nodes. An empty dataset produces an empty, non-selectable view. The existing generated-mode minimum of eight nodes does not force fake semantic nodes into small datasets.
4. Every edge endpoint must reference a node in the supplied dataset. Render only supplied semantic relationships: do not invent random edges in this mode. Visual proximity or connectivity does not establish causation.
5. Validate the complete candidate before replacing the live dataset. Invalid data, duplicate node IDs, or dangling edges produce an actionable `[Sinapsi] Invalid graphData … Keeping previous graph.` diagnostic and leave the last valid graph and selection unchanged. Do not partially apply, silently renumber, or truncate a semantic graph.
6. Without a prior valid semantic dataset, invalid input retains the existing decorative fallback and produces no semantic selection events. Setting `graphData = null` deliberately returns to decorative mode and clears semantic selection.
7. Snapshot accepted data so later mutation of the caller's objects cannot alter an already accepted graph without an explicit assignment. Do not mutate or freeze the caller's own objects.
8. A valid replacement retains selection if that ID still exists; otherwise it clears selection without emitting a user event. An invalid non-null `selectedNodeId` is rejected with a diagnostic, retaining the prior valid selection.

Duplicate-edge and self-edge normalization should be decided and documented by Sinapsi maintainers before release; it must be deterministic and covered by tests. No new domain meaning is assigned to edges in this handoff.

### Selection event: the callback boundary

Dispatch exactly one `sinapsi-node-select` event for each deliberate node activation, including repeated activation of the same node:

```ts
this.dispatchEvent(new CustomEvent<SinapsiNodeSelectDetail>('sinapsi-node-select', {
  detail: { nodeId, input },
  bubbles: true,
  composed: true,
  cancelable: false
}))
```

Dispatch from the host after resolving a valid node. `composed: true` also permits propagation if a consumer nests Sinapsi inside another shadow tree. Export the detail/event types and type the element's custom event without removing normal DOM event overloads.

The consumer supplies its callback through `addEventListener('sinapsi-node-select', handler)`. Do not override the native `onclick` property, invent a second callback channel, or require a React wrapper. A normal host `click` listener is not the semantic node-selection API.

- The event reports user intent; the host application owns the accepted selection and sets `selectedNodeId` afterward.
- Programmatic property assignments, hover, focus movement, layout changes, and animation must not emit selection events.
- Clicking empty space leaves selection unchanged and emits nothing. The host can explicitly clear selection with `selectedNodeId = null`.
- Do not dispatch when disconnected, non-interactive, or displaying only generated decorative data.
- Event detail contains the stable identifier and input modality, not a mutable internal graph node, DOM internals, application state, or executable chart commands.

This controlled contract prevents a graph event from causing an atom update that causes another graph event indefinitely.

## Pointer, keyboard, and lifecycle requirements

### Node picking

- Hit-test against the last frame actually rendered, not a freshly randomized or independently advanced scene.
- Convert pointer coordinates into the renderer's CSS-pixel coordinate space using the canvas bounds. Account for CSS scaling, high device-pixel ratio, page scrolling, and resize; avoid multiplying by device-pixel ratio twice.
- Resolve overlapping hit regions deterministically according to visual depth/paint order, with a documented tie-breaker. An obscured node must not win simply because it has a smaller array index.
- Support mouse click, touch tap, and pen activation. Use one activation path so a pointer sequence followed by a synthesized click cannot emit twice.
- Treat a canceled gesture or movement beyond a documented drag threshold as non-activation. Do not turn scrolling or a drag into a chart selection. Pan/zoom/drag-to-rearrange features are not required by this handoff.
- Use discoverable hover, focus, and selected feedback, including a non-color cue. Dense overlapping nodes need an accessible alternative; enlarging every invisible hit area is not sufficient by itself.

### Keyboard and accessibility

The current decorative, hidden canvas is not an accessible interactive graph by itself. Keep its visual pixels hidden, but provide a corresponding named keyboard-operable node list/control within the component, or another explicitly documented and tested equivalent semantic interface.

- Every selectable node must be reachable and activatable without pointer input, with its supplied label exposed to assistive technology.
- Enter and Space activate the focused node through the same selection contract with `input: 'keyboard'`; focus alone does not change chart state.
- Provide visible focus, announced selection, and a way to enter and leave the control without a keyboard trap. Avoid forcing users through hundreds of sequential Tab stops.
- Do not retain `role="img"` as the entire interactive interface or put interactive descendants under an `aria-hidden` ancestor. Preserve existing decorative-mode semantics.
- Respect reduced-motion preferences for the interactive experience and provide a stable way to inspect/select moving nodes. Motion must not be required to discover meaning.
- Revisit Sinapsi's accessibility rule/ADR, which currently describes a purely visual tree. This is an explicit new semantic capability, not merely a hidden canvas click handler.

### Lifecycle and compatibility

- Preserve SSR-safe root imports, browser-only registration, the closed shadow boundary, and the framework-neutral runtime.
- Attach and detach interaction listeners with the element lifecycle. Reconnection must work without duplicate listeners, stale references, orphaned observers, or abandoned animation callbacks.
- Handle properties assigned before custom-element upgrade, or clearly require consumers to await `customElements.whenDefined('sinap-si')`; the documented consumer example should await definition before assigning rich data.
- Test rapid connect/disconnect/reconnect and the equivalent of React StrictMode effect setup/cleanup. The package must not depend on React to satisfy this contract.
- Keep all existing presentation properties working. Add no Jotai or React runtime dependency. Extend `/react-types` only as type-level support for the new public properties where appropriate.

## Deferred LangDrift integration

Once the compatible npm version is published, LangDrift owns the following adapter:

1. Register Sinapsi inside the website's browser/client boundary and await element definition.
2. Supply a small, explicitly labeled demo graph whose IDs map to the existing demo events. Do not represent demo relationships or the 91% → 73% example as production measurement.
3. Register one `sinapsi-node-select` listener. Validate the received ID against an explicit application-owned map: **node ID → event ID → index in the current `VisionPoint[]` dataset**.
4. Resolve the current array index by stable event ID; do not hard-code positions that become wrong when the data order changes. Unknown IDs or missing events leave the current chart state unchanged.
5. Update the existing numeric `selectedPointAtom`. Derive the selected chart event from that state and pass the existing chart its `data`, `selectedEventId`, and `onSelectEvent` inputs.
6. Reflect the accepted selection back to `selectedNodeId` without generating a second event. Chart-originated selection can use the same atom and reverse mapping to keep the graph consistent.
7. Remove the listener on cleanup. Cancel or ignore pending asynchronous registration after unmount; a remount installs only one current handler.

No event payload is an instruction language. The graph does not supply arbitrary atom names, chart formulas, reducers, code, or commands. LangDrift owns scenario selection and all chart interpretation.

The baseline fixture can map to `baseline`, `pricing`, `authentication`, and `exports`; only approved, explicit relationships should become its edges. The detailed hero layout and copy remain in the PRD, not in Sinapsi.

## Acceptance and release checklist

All items below are pending. This document is not verification evidence.

- [ ] Create a prospective Sinapsi SPEC and any required ADR/rule updates before changing behavior; follow Sinapsi's own `AGENTS.md` and release workflow.
- [ ] Add deterministic tests for stable IDs, reordered datasets, explicit edges, empty data, invalid IDs, duplicate IDs, dangling edges, last-valid fallback, and selection preservation/clearing.
- [ ] Test successful pointer activation, repeated activation, miss, overlap/depth resolution, movement threshold, cancellation, and no duplicate touch/click emission.
- [ ] Test public event detail and propagation across nested closed-shadow boundaries; verify programmatic changes never emit user selection events.
- [ ] Test keyboard equivalence, labels, focus, selection semantics, reduced motion, and the accessible non-canvas interface.
- [ ] Test CSS scaling, device-pixel ratio, scrolling, resizing, and picking while the graph moves in a real browser; DOM/canvas mocks alone do not establish these behaviors.
- [ ] Test disconnect/reconnect, delayed upgrade, two independent instances, and listener cleanup without any framework dependency.
- [ ] Preserve SSR imports, existing generated-mode behavior, registration idempotence, exported types, and the intentional npm payload.
- [ ] Run the repository's `graph check` and the additional real-browser interaction/accessibility checks. Record the exact source revision, commands, and results.
- [ ] Update consumer documentation with the data contract, event subscription/cleanup example, accessibility requirements, compatibility behavior, and public type imports.
- [ ] Apply a maintainer-reviewed version increment and release notes. The human owner controls tagging/pushing/publication; this handoff does not authorize agents to publish.
- [ ] Provide the published npm version and its source revision back to LangDrift. Only then open the implementation work for the website integration and test the complete graph → Jotai → chart path.

## Platform references

- [DOM Standard: CustomEvent](https://dom.spec.whatwg.org/#interface-customevent) defines custom event detail; [event composition](https://developer.mozilla.org/en-US/docs/Web/API/Event/composed) explains shadow-boundary propagation.
- [Custom-element lifecycle](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) and [custom-element best practices](https://web.dev/articles/custom-elements-best-practices) inform registration, property, and lifecycle handling.
- [W3C keyboard accessibility](https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html) and [target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) inform equivalent interaction and target design. Actual accessibility conformance requires testing; it is not established by this document.
