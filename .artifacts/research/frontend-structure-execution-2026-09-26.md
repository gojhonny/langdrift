# Frontend Structure execution record

Contract: spec 0003 v1 and breakdown v1. Planning, specification, decomposition
and implementation authorized by the owner's explicit cycle auto-approval.

## Publication authorization update

After Ticket 0009 began, the owner explicitly extended authorization to
everything regarding this initiative and asked for a commit and PR against main
when finished and verified. This separately authorizes the necessary push for
that PR. It does not authorize merge/release. Earlier no-publication text in
Planning/spec/tickets records the constraint at authoring; this later explicit
authorization supersedes that operational limit without changing implementation
scope or acceptance criteria. Preserve unrelated work and identify the prior
uncommitted N12 prerequisite when preparing the combined branch/PR.

The owner subsequently explicitly approved one PR with two logical commits:
N12 / Dashboard Tailwind Alignment first, Frontend Structure & Component
Conformance second. Commit, push and PR are authorized; merge is not. Each
initiative's artifacts/audits travel with its own commit where practical, and
all intermediate failed evidence and the18 external lint errors remain recorded.

## Ticket 0009 baseline identity

Uncommitted starting source archived before harness changes:
`.audits/runs/frontend-structure-origin/manifest.json`, 528 path identities,
SHA-256 `d060099961bc28494cf872eda7020f2f7d6b8bb475112af861720e22e1d37a0f`.
Source archive SHA-256
`084713b1e6ba404536435d66a398379f7158a932b10e67054d0b88af7c2f7d4e`.
No environment file is included. HEAD is the merged Website Foundation commit;
the archive additionally contains completed N12. Do not use bare HEAD as this
cycle's structural baseline.

Docker daemon is available (29.8.0). Sandbox-only socket denial was resolved
through the authorized tool permission path, not classified as unavailable.
Baseline root lint failed (exit 1); root typecheck, web-quality and Early Access
coverage passed (exit 0). Final disposition requires current-cycle provenance.

## Harness development observations (not acceptance runs)

Website first behavior run: two passed, one failed because the new assertion
assumed `/en` instead of existing canonical `/`. The chart/detail interaction
itself passed. Corrected the observation to compare the URL before/after selection;
production routing is unchanged. This failed run is not represented as a pass.

The first root build overlapped the new Website harness build and failed on
Next's build lock. This was an orchestration failure, not a source regression.
The sequential root build retry passed (9 successful tasks, exit 0). Future
Website browser and repository build runs are serialized.

Website baseline development retained unsuccessful attempts rather than replacing
accepted images. No production extraction had started in any of these attempts:

- Initial capture: 8 tests/20 images passed, but the final matrix was not yet complete.
- v1: capture 11 passed; comparison 9 passed/2 failed (background-tab assertion and mobile pricing rasterization).
- v2: capture 11 passed; comparison failed background-tab assertion and mobile chart rasterization.
- v3: capture 11 passed; comparison failed mobile chart/pricing rasterization.
- v4: capture 10 passed/1 failed on a background document-load assertion; no paired comparison ran.
- v5: capture 11 passed; comparison 10 passed/1 failed, with 39 differing dark desktop header text-edge pixels.

Background-tab checks now observe the committed URL after bringing the tab forward;
the separate locale matrix still checks document rendering. Integer document clips
resolved the mobile chart/pricing fractional-scroll mismatch without masks or
production styling changes. Explicit font-face readiness prevents fallback fonts
from becoming accepted evidence. A further v6 capture/comparison records disabled
font subpixel positioning to investigate the remaining glyph-edge variation.
Chromium documents this switch's font positioning behavior in
https://chromium.googlesource.com/chromium/src/+/c46abcfee2e9cc108441ea9fba406548671840ed/ui/gfx/switches.cc.
The comparator remains threshold 0.15/maxDiffPixels 20; no tolerance was widened.

The baseline integrity negative check passed: a disposable manifest with an
incorrect PNG hash was rejected with exit 1 before testing. Original baseline
images were untouched. A successful capture alone is not an accepted repeatable
baseline; Ticket 0009 remains open until its unchanged-source comparison passes.

The v6 first comparison passed, but its repeat failed desktop/mobile pricing
text rasterization (638/587 differing pixels), so it was not accepted. Software
rendering (`--disable-gpu`) was then recorded in shared conditions before any
production migration. v7 capture and three comparisons (including final defaults)
all passed 11 tests/26 images, unchanged tolerance. This bounds the earlier
font-positioning inference: it was insufficient alone. Ticket 0009 is now
gates-complete under its linked independent Review and Audit. Ticket 0010 begins;
Ticket 0012 is also eligible but has not started.

## Ticket 0010 implementation

Moved Card/Kicker to the explicit shared `@repo/react/ui/primitives` boundary,
with local named props interfaces and concern-local conflict-aware composition.
The old join-only shared utility remains unchanged. The original DOM/classes
and consumer override behavior are the contract, not a vendor redesign.
Unused Muted was not exported. Shared icons now explicitly export the symbols
Dashboard already used; its duplicate direct dependency is removed.

Removing the obsolete app-local UI module also removes its two temporary source
comments (E25 component ownership; E26 generic primitive ownership). Their intent
remains recorded here pending final verified refinement disposition: single
component files and genuine generic UI with the shared owner. Canonical frontend
guardrails already represent that intent. This intermediate move is not a claim
that the final retirement gate has passed. N09 remains in AGENT_NOTES meanwhile.

## Ticket 0011 implementation

The Dashboard monolithic view is split into concern-owned components and seven
independent content views. Each filesystem page composes its existing gate,
heading and content; legacy-named routes preserve their actual existing section
and filter behavior. The unused LegacyEvolution dispatcher branch and its
render-time state write are removed, not activated. Skeletons remain configurable
loading UI. Navigation and timed gating receive sibling component files. The
translated illustrative Product Vision data hook is colocated with its panel;
it does not claim to implement the Product Vision scoring contract.

The removed monolith's calibration intent (E13 one component, E14 dedicated hook,
E15 mistaken comment wording, E16/E27 composition) remains recorded here pending
final verified retirement. E15 is not interpreted as a one-comment quota. Existing
root/error markers stay in source until Refinement; state/runtime markers remain
deferred. The existing filter test now exercises the actual Evolution route,
using its alias value from Dashboard's canonical tsconfig.paths.json.

## Ticket 0012 implementation

Website header, integration illustration, evidence demo and executive-review
panels now have separate concern-colocated component files. The hero data hook
has dedicated `.hook.ts` ownership and both callers retain the same memoization.
Props use named local interfaces and initial body destructuring. The header's
existing locale-remount focus coordination retains module lifetime in a private
concern-local record, set only by the same browser interaction. Domain/message
types retain their prior owners. CSS, state atoms, route mappings, copy and
runtime/environment configuration are unchanged. Early Access component edits
are props/spacing only; its contract and real integration harness are unchanged.

## Final capture investigation and refinement

Initial integrated browser runs failed: Website light header29 pixels and
Dashboard mobile tooltip32 pixels. Serialized Dashboard rerun passed35 tests.
Serialized Website failed dark header39/mobile pricing587 pixels. The latter two
actual PNGs decode identically (zero differing RGBA pixels) to pre-migration v5
and v6-repeat failed captures, respectively; geometry and fetched font resources
also match. They are reproduced baseline raster states, not new extraction
behavior. Those comparator results remain failed.

Website capture mechanics were corrected without replacing expected images,
widening tolerance or masking content: fixed headers use viewport clipping;
document regions use a discarded warm-up capture followed by font/frame readiness.
First corrected candidate still failed the mobile dark chart (158 pixels), so
this is not claimed to eliminate rasterization variability. A fresh extraction
of the actual pre-migration source archive with only current test harness/deps
passed11 tests/26 comparisons. The full corrected candidate repeat also passed11/26,
build QYRuwIUpXPoqcZeoWQbUf, manifest SHA
`6e90dc7a29babcd898cfcec01d0a10f01e28ff56f79e01c7d131bf026a6a6693`.
Both original and candidate used the unchanged v7 expected images and original
0.15/20 comparator. Computed baseline-image-integrity.json confirms all26 hashes.
The origin-repro-identity.json proves all528 archived source hashes match except
the two test-dependency metadata files. No application fix or weaker substitute
test was used. Independent affected-delta Standards and Spec review found0 issues.

Tickets0009/0012 were reopened while the harness change was unverified. The final
Review/Audit now binds that correction and all integrated evidence to the final
snapshot; its completion is authoritative over the earlier slice-only reports.
The Refinement record resolves the pending marker-retirement intent above without
promoting new rules or removing deferred owner evidence.
