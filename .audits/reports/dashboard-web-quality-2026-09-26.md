# Dashboard web-quality remediation — 2026-09-26

Implementation is complete for the audited code defects. Acceptance is **partial**: Overview's mobile Lighthouse median remains above 2.5 seconds, and Website's rendered smoke test is blocked by a local redirect loop. This is not a field Core Web Vitals or full WCAG conformance certification.

## Evidence

| Signal | Baseline | After | Interpretation |
| --- | --- | --- | --- |
| Overview mobile LCP, median of 3 | 2.868 s (2.812–2.970) | 2.652 s (2.649–2.741) | Improved 7.5%; **2.5 s target unmet** |
| Evolution mobile LCP | 2.862 s, one baseline sample | 2.498 s median (2.492–2.564), 3 samples | Median passes narrowly; baseline was not repeated |
| Settings mobile LCP | 2.865 s, one baseline sample | 2.493 s median (2.492–2.495), 3 samples | Median passes narrowly; baseline was not repeated |
| Desktop LCP | Overview 0.595 s, one sample | Overview 0.590 s; Evolution 0.547 s; Settings 0.547 s | Single-sample checks, not repeated comparisons |
| CLS | 0 in measured loads/interactions | 0 in all final Lighthouse and scripted interaction sessions | No measured regression |
| Scripted INP | Overview median 64 ms (64–72); Evolution median 64 ms (56–64) | Overview 64 ms in all 3 samples; Evolution median 72 ms (64–80) | Single-session lab measurements, not field p75 |
| Lighthouse accessibility | 90 on Overview/Evolution, 100 on Settings | 100 on all 12 final runs | Automated coverage only |
| Lighthouse best practices | 100 | 100 on all 12 final runs | Not proof of security conformance |
| axe | Unnamed comment button, low-contrast text; manual overlay failures | 18 final scans, zero violations | Six main routes in settled light/dark themes plus open overlays |

Durable machine-readable evidence, including all metric samples, source hashes and validation outcomes: [dashboard-web-quality-2026-09-26.json](dashboard-web-quality-2026-09-26.json). Raw JSON reports, traces, command logs and screenshots remain in `.audits/runs/dashboard-web-quality-2026-09-26/` (Git-ignored); baseline JSON/traces were copied there from the original temporary audit directory. The essential results do not rely solely on those transient files.

## Snapshot and conditions

- Base HEAD: `5769cbe29e0b85baa322e2a7ca7eeb92e8fde98a`; working tree includes the pre-existing atom/domain refactor. The JSON evidence binds 46 changed/new/deleted source files to SHA-256 values; the base commit alone is not the audited implementation.
- Code-snapshot timestamp: `2026-09-26T07:49:19.285Z`. No commit, push, PR, deployment, or SDD phase transition occurred.
- Production `next build` followed by `next start`, origin `http://127.0.0.1:3101`. Node 26.9.0, Next 16.3.5, React 19.2.4, Chromium 153.0.8010.12, Lighthouse 13.5.0, axe-core 4.13.0, web-vitals 6.2.2, Playwright 1.63.0, Vitest 5.0.1.
- Lighthouse: isolated sequential runs with a fresh cold browser. Mobile 412×823, DPR 1.75, simulated RTT 150 ms, throughput 1638.4 Kbps, CPU slowdown 4×. Desktop 1350×940, DPR 1, simulated RTT 40 ms, throughput 10240 Kbps, CPU 1×.
- Interaction measurement: fresh contexts, viewport 390×844/DPR 1.75, CDP CPU 4×, latency 150 ms, download 209715.2 B/s, upload 86400 B/s, cache disabled. Scenarios cover theme, notifications, classification/grouping, and voice inquiry. Observers were injected only by the audit browser, not shipped in the app.
- No eligible public URL or CrUX field dataset was available. [Core Web Vitals thresholds apply to real-user p75](https://web.dev/articles/vitals), not these synthetic samples.

## Changes and skill influence

The accessibility skill drove source-local fixes and repeated rendered/keyboard checks. React guidance kept heavy rendering code separate from immediately available content; Tailwind guidance kept new styling in utilities. The Core Web Vitals skill required equivalent measurements and prevented declaring success from a score alone.

- Shared comment disclosure now has a name, expanded state and content association; reduced-motion exit behavior is respected.
- Muted and classification text meet the audited contrast requirements in both themes. Canonical graphic/brand colors remain intact; accessible text tones are separate.
- Mobile navigation and mobile voice use native modal dialogs. Desktop voice remains nonmodal. Focus initialization/containment/restoration, inert background, scroll locking, Escape and breakpoint changes are handled.
- Dashboard has a skip link, content-only main landmark, active-navigation semantics and selected-state semantics for range/classification/group controls. Notifications and popovers have appropriate landmark coverage.
- Shared tooltips are hoverable, focus-triggered, Escape-dismissible, viewport-clamped and attached to their rendered controls without imposing props on custom/fragment children. Existing descriptions are preserved. ThemeToggle reuses the same mechanism. Replaced `tooltip.css` and `theme-toggle.css` were removed; their originals are recoverable from Git. Shared Tailwind source scanning is explicit.
- Only the chart renderer/Recharts load after initial paint. Event text and chart dimensions remain server-rendered, with a dedicated regression test. An intermediate whole-component deferral delayed Evolution's LCP content and was replaced before final measurements.
- Decorative orb initialization is deferred, with a dimension-preserving static fallback. Internal links use client navigation, retaining shared atom state and closing transient menus/navigation.
- Voice response timers are cancelled on replacement requests, closure and unmount.
- Runtime headers confirmed `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`; `X-Powered-By` is absent.
- Prior atom/domain organization and component-local state were preserved. No provider boundary, persistence, production telemetry, or atom logging was added.

## Verification

All final commands succeeded: scoped Biome lint; 13 web-quality regression tests; 42 existing Early Access tests; Dashboard/shared React/Website/SSO/Mobile typechecks; Dashboard/Website/SSO/Mobile production builds; production dependency audit (650 dependencies, zero advisories). `git diff --check` also passed, and inspected changed imports contain no parent traversal.

The configured Website/SSO build wrappers point to missing shell scripts, so their builds were run directly through Next's CLI. Non-secret localhost public URLs and Cloudflare's public Turnstile test key supplied the required consumer build settings; no environment files were edited. Mobile retains its existing large-chunk build warning.

Chromium checks exercised:

- Modal Tab/Shift+Tab containment, Escape dismissal and trigger restoration; desktop nonmodal voice behavior.
- Product selection retained across client navigation; classification, grouping, range, menus and notifications.
- Curve event focus/Enter activation and exposed selected state.
- 320px reflow on all six routes, including focused tooltips and mobile overlays: document width never exceeded viewport width.
- Reduced-motion emulation, viewport-equivalent 200% reflow, and visual inspection of desktop Overview/mobile voice screenshots.
- SSO and Mobile shared-component smoke tests: theme switching and tooltip dismissal/clamping passed, with no page exceptions; Mobile's orb registered successfully.

Website compilation/typecheck passed, but rendered smoke checks at both `/` and `/en` failed with `ERR_TOO_MANY_REDIRECTS`. HTTP 307 on `/` points back to `/`, alongside the locale rewrite to `/en`. Its routing/proxy source was not changed in this remediation. A successful Website runtime smoke test is still required.

## Remaining gaps and reproduction

Overview's mobile median is 2.652 s, above the approved 2.5 s target. The stylesheet remains the only resource on Lighthouse's critical network dependency chain (10,989 transferred bytes; the insight reports 153 ms duration on sample 2). The observed trace's LCP breakdown is ~5.4 ms TTFB plus ~64.9 ms render delay; these are not the simulated headline's subparts. Whole-load JavaScript on chart routes rose from 322,127 to 333,161 transferred bytes, while Settings fell to 242,991 bytes because the renderer is not loaded there. This is not an overall bundle-size reduction claim.

Further stylesheet delivery work requires another measured comparison. Next's experimental global CSS-inlining option was inspected but not enabled: its independent caching, payload duplication and returning-visitor tradeoffs were not part of the approved implementation. No speculative preload, browser-support reduction or framework polyfill removal was made.

CSP, Trusted Types, HSTS/deployed TLS, real-user p75, actual native-browser zoom, VoiceOver/NVDA and real-device accessibility remain unverified/out of scope. Automated accessibility scores are not WCAG certification. Native dialog behavior follows the [WAI dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

Reproduce tests with `pnpm test:web-quality` and `pnpm test:early-access`; typecheck with each app/package's existing `typecheck` command. Build Dashboard with `pnpm --filter dashboard build`; use direct `next build` for Website/SSO until their wrapper issue is addressed. The retained `validate.cjs`, `checks.cjs`, `consumers.cjs` and `lighthouse.cjs` scripts record this run's commands and fixture configuration. Lighthouse comparison uses `--only-categories=performance,accessibility,best-practices --save-assets --chrome-flags='--headless --no-sandbox'`, adding `--preset=desktop` for desktop.
