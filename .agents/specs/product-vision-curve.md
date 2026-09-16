# SPEC — Product Vision Curve

## Purpose

Make the curve itself communicate Product Vision movement, attribution, and classification.

## First-party ownership

Shared implementation lives under `packages/react/src/ui/product-vision-curve/`.

Vendor charting libraries are rendering dependencies, not the product-domain API.

## Conceptual data

```text
VisionPoint
- date/label
- value
- optional Drift Event

Drift Event
- id
- title
- delta
- classification
- actors
- product area
- date
```

## Required behavior

- time-based movement;
- meaningful event markers on the curve;
- person/avatar/initial attribution where available;
- semantic classification;
- selected event state;
- click/tap/focus interaction;
- textual event detail;
- textual summary for assistive technology.

## Semantic colors

- Intentional Evolution: blue `#3B82F6`;
- Unexplained Drift: red `#DC2626`;
- Under Review: purple `#A855F7`;
- baseline/neutral: neutral tokens;
- orange: selection/focus/brand, not drift severity.

## Accessibility

- keyboard-focusable meaningful events;
- Enter/Space activation;
- visible focus;
- no color-only status;
- reduced-motion support;
- current value and movement available as text.

## Acceptance

A screenshot of the component should be recognizable as LangDrift because events and attribution are part of the curve rather than a generic chart followed by unrelated details.
