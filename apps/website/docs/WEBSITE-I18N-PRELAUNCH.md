# LangDrift website — i18n and pre-launch implementation handoff

Status: **draft specification; implementation has not started in this PR**.

Source: the owner's `LANGDRIFT-WEBSITE-HANDOFF(1)(1).md`, prepared September 18, 2026, and the subsequent request to keep the work website-only, place the controls left of **Sign in**, and use the DeepSeek Harness language control as the interaction reference.

Reference: https://www.deepseek.com/harness/en/

This document is an implementation contract, not evidence that the website has been changed, tested, or deployed. All acceptance items remain unchecked.

## 1. Scope and non-goals

Implement only the public **LangDrift website**, `apps/website`. The word “langchain” in the request refers to this website workstream; this is not a change to the external LangChain project.

Preserve the existing main-branch visual identity, page composition, typography, assets, design-system primitives, package manager, and Jotai state conventions. Do not rebuild the website or introduce a new design system.

Implement these requirements together:

1. English, Brazilian Portuguese, Traditional Chinese, and Japanese throughout the public website.
2. An email-only **Get early access** section immediately above the footer.
3. A header **Sign in** link with `href="#"` and a localized **Coming soon!** explanation.
4. An animated solar-eruption-style glow around **Get started**, with the CTA leading to early access rather than unfinished product access.

Do not change Console, SSO/Auth/Plans, Mobile, Sinapsi, the factory harness, `.agents`, `.audits`, or `.drifts`. Do not introduce a backend workspace, authentication flow, onboarding, dashboard, paid translation platform, runtime LLM translation service, or new product functionality. A website-owned capture route is within scope; a new product/backend architecture is not.

Keep **LangDrift** untranslated. Use **Product Vision / Vision**, never the retired **Product Integrity / Integrity** terminology. Preserve primary **Burnt Orange `#F97316`**, the semantic classification colors, and light/dark support. Do not invent prices, entitlements, score formulas, product availability, provider strategy, or legal-compliance claims.

## 2. Latest owner direction: header controls

The controls belong **to the left of Sign in**. In particular, move the existing theme control out of its current trailing position.

Required relative order:

```text
Brand · primary navigation · [language selector] [theme control] · Sign in · Get started
```

Any additional header utility control must also precede **Sign in**. Preserve this logical and keyboard order on desktop and in the responsive header; do not achieve the ordering solely with CSS that disagrees with DOM order.

### DeepSeek-style language selector

The reference exposes compact, directly visible language buttons (`中文` and `EN`) in the header. Use that direct-selection pattern, adapted to four languages and LangDrift's existing tokens. Do not copy DeepSeek branding or redesign the entire navigation.

Use a restrained inline/segmented control with an unmistakable selected state, subtle surface/border, and consistent spacing. Do not substitute a flags-only picker or an unrelated large dropdown. A compact visible treatment may use `EN`, `PT-BR`, `繁中`, and `日本語`, with the full native language name available as the accessible label and explanation. This is an adaptation for four languages, not a claim of pixel-identical reproduction of the reference.

Full language labels:

| Locale | Native label |
| --- | --- |
| `en` | English |
| `pt-BR` | Português (Brasil) |
| `zh-Hant` | 繁體中文 |
| `ja` | 日本語 |

Make every language choice keyboard- and touch-operable. Identify the active language accessibly, preserve visible focus, and use native link/navigation semantics. Keep readable targets and do not squeeze four labels into unusable widths. At narrow widths, the existing navigation may reflow, but the language/theme controls must remain discoverable before Sign in. Close mobile navigation predictably after a locale change.

The handoff's pause/resume control may remain within the existing footer when there is no existing site-wide motion setting; it does not need a new section. If placed in the header instead, it follows the same before-Sign-in rule.

## 3. Repository observations to carry into implementation

These observations came from reading the current repository for this handoff. Recheck the implementation base before editing.

- `apps/website/package.json` declares **Next.js `16.2.11`**, **React `19.2.4`**, and **Jotai `^2.15.1`**. It has `dev`, `typecheck`, `build`, and `start` scripts; no website test script was declared in the inspected manifest.
- The website uses **App Router**. The existing homepage is `apps/website/src/app/page.tsx`; its root layout is `apps/website/src/app/layout.tsx`.
- `apps/website/next.config.ts` enables strict mode and transpiles `@repo/design-system` and `@repo/react`; it does not configure a static export in the inspected version.
- The root manifest requires **Node `>=24 <25`** and pins **pnpm `10.32.1`**. Do not upgrade these tools or Next.js merely to implement this request.
- The homepage imports shared `Header4` and `SmoothFooter`. `Header4` currently renders its theme toggle **after** the supplied auth actions. The header and footer contain hard-coded English copy.
- The shared `ProductVisionCurve` also contains English accessible descriptions, classification labels, and fallback text. Translating only the homepage's own JSX would not complete website localization.
- The inspected website source tree contains one public homepage, app styles, state logging, and a voice preview; it does not contain an existing early-access route or provider integration.
- `AGENTS.md` says the repository is a frontend prototype with no canonical backend contract. Reuse an established collection provider if one has subsequently been added; otherwise keep capture unavailable until an owner-selected durable adapter exists.

Keep runtime changes website-local. Inspect shared component APIs before choosing an adapter. Do not silently modify components consumed by other apps or fake localization through post-render DOM text replacement. If a shared primitive requires a separate API change to become localizable without duplication, record that dependency explicitly rather than broadening this PR silently.

Do not mix in the separate factory-harness/Sinapsi proposal. This work must not depend on its branch being merged.

## 4. Internationalization and routing

Use **`next-intl`** with version-controlled JSON catalogs. Add it only to the website workspace and update the existing root lockfile as required for that dependency; a mechanical lockfile update is not permission to alter other applications.

### Locale and URL contract

| Language | Canonical locale / catalog | Public homepage |
| --- | --- | --- |
| English — default | `en` / `en.json` | `/` |
| Brazilian Portuguese | `pt-BR` / `pt-BR.json` | `/pt-br` |
| Traditional Chinese | `zh-Hant` / `zh-Hant.json` | `/zh-hant` |
| Japanese | `ja` / `ja.json` | `/ja` |

Use canonical locale tags for dictionaries, formatting, and `<html lang>`; use the explicit lowercase public-prefix mapping. Do not substitute Simplified Chinese, a generic `zh` catalog, or a regional variant for the requested `zh-Hant` script locale.

The URL is the source of truth. English remains the default even when the browser prefers another language. Returning explicitly to `/` returns English. Do not restore a different locale from a stale cookie. Refresh and internal navigation preserve the currently selected locale through its URL.

Reference routing configuration, subject to the installed compatible `next-intl` API:

```ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt-BR', 'zh-Hant', 'ja'],
  defaultLocale: 'en',
  localePrefix: {
    mode: 'as-needed',
    prefixes: {
      'pt-BR': '/pt-br',
      'zh-Hant': '/zh-hant'
    }
  },
  localeDetection: false,
  localeCookie: false
});
```

This fragment is not a complete integration. Wire the request configuration, allowlisted message loaders, Next.js plugin, localized layouts, and locale-aware navigation. Do not construct arbitrary import paths from unchecked URL values.

For the inspected Next.js 16 website, use the compatible **`src/proxy.ts`** entry point. Compose existing handling rather than overwriting unrelated rules. Exclude APIs, framework assets, public files, and infrastructure routes from locale rewriting. Do not migrate to Pages Router. If deployment mode changes to static export, verify its build-time routing strategy and separately deployed capture endpoint instead of assuming server support.

Switching locales must preserve the logical path, dynamic parameters, query string, and hash through locale-aware routing helpers. Do not manipulate path prefixes ad hoc.

### Translation completeness

Inventory and translate all public copy: desktop/mobile navigation, hero, existing sections, demo event context and accessible chart labels, voice preview, buttons, footer, forms, errors, status messages, accessible names, and metadata. Translating only the new controls is insufficient.

Use stable semantic keys and complete sentences. English is the source catalog. Require identical key structure and interpolation placeholders in all four catalogs. Missing entries must fail validation; raw keys or silent English fallback are not completed localization.

Preserve product positioning and the meaning of illustrative content. Do not turn demo values into a product guarantee or silently reconcile score inconsistencies as part of translation.

Set `<html lang>` to the resolved canonical tag. Localize metadata and provide self-canonical URLs, all four language alternatives, and an English `x-default` using the project's real configured production origin. Avoid conflicting automatic/manual alternate-link mechanisms; do not invent an origin.

Retain existing fonts and verify Traditional Chinese and Japanese glyph fallbacks. Check wrapping, punctuation, long button labels, and 200% zoom.

## 5. Early-access section

Add exactly one homepage section after all existing homepage content and immediately before the existing footer:

```html
<section id="early-access" aria-labelledby="early-access-heading">
  <h2 id="early-access-heading">Get early access</h2>
  <!-- description, one email field, submit button, feedback, purpose note -->
</section>
```

Reuse current content width, spacing, typography, surfaces, and borders. A subtle orange accent is sufficient; this is not another animated hero. On wide layouts, input and button may share a row. Stack them on narrow screens without horizontal overflow.

### Exact English copy

| Element | Text |
| --- | --- |
| Heading | Get early access |
| Description | LangDrift is currently in development. Leave your email and we’ll let you know when early access is available. |
| Visible label | Email address |
| Placeholder | you@example.com |
| Submit | Join the waitlist |
| Submitting | Joining… |
| Success | Thanks! Your early-access request has been received. |
| Invalid email | Enter a valid email address. |
| Failure | We couldn’t save your request. Please try again. |
| Unavailable | Early-access registration is temporarily unavailable. Please try again later. |
| Rate limited | Too many attempts. Please wait a moment and try again. |
| Purpose note | We’ll use your email only to contact you about LangDrift early access. |

One visible email field only. Do not add name, company, phone, password, extra visible fields, a modal, pricing gate, or countdown.

Use a real `<form>` and associated visible `<label>`. The input must have `name="email"`, `type="email"`, `autoComplete="email"`, `inputMode="email"`, `required`, and spellcheck/autocapitalization disabled. A placeholder is not a label. Keep length limits consistent with server validation.

Support idle, invalid, submitting, success, failure, unavailable, and rate-limited states. Prevent concurrent requests. Validate client-side and server-side and map errors to localized messages rather than raw provider text or an English-only browser message.

Preserve input after failure and permit retry. Associate errors with the field and expose invalid state. Announce results through a polite status region and reserve feedback space where practical. Never show success based only on a timeout, console log, localStorage write, or optimistic animation.

Keep an existing privacy-policy link if one exists. Do not invent a published policy or claim legal compliance. Do not silently enroll addresses in unrelated marketing.

### Proposed translations of the new labels

These are the handoff's proposed translations, not proof of native-speaker review. Merge the source handoff's complete starter dictionaries and translate the existing website inventory as well.

| Key | `pt-BR` | `zh-Hant` | `ja` |
| --- | --- | --- | --- |
| `Navigation.signIn` | Entrar | 登入 | ログイン |
| `Navigation.getStarted` | Começar | 開始使用 | はじめる |
| `Navigation.comingSoon` | Em breve! | 即將推出！ | 近日公開！ |
| `LanguageSwitcher.label` | Idioma | 語言 | 言語 |
| `EarlyAccess.heading` | Solicite acesso antecipado | 申請搶先體驗 | 先行アクセスに申し込む |
| `EarlyAccess.emailLabel` | Endereço de e-mail | 電子郵件地址 | メールアドレス |
| `EarlyAccess.submit` | Entrar na lista de espera | 加入等候名單 | 申し込む |
| `Motion.pause` | Pausar animações | 暫停動畫 | アニメーションを停止 |
| `Motion.resume` | Retomar animações | 繼續動畫 | アニメーションを再開 |

Also include localized `description`, `emailPlaceholder`, `submitting`, `success`, `invalidEmail`, `error`, `unavailable`, `rateLimited`, and `privacy` keys from the source handoff. This table is not a complete translation catalog.

## 6. Durable email capture

Reuse an existing server endpoint and durable storage/email-list provider when available. Keep credentials server-only. Do not select or provision a new external service without an established project choice.

When no endpoint exists, implement a small website-owned adapter using the project's router/deployment conventions. Suggested endpoint: `POST /api/early-access`.

```ts
type EarlyAccessRequest = {
  email: string;
  locale: 'en' | 'pt-BR' | 'zh-Hant' | 'ja';
};

type EarlyAccessResponse =
  | {ok: true}
  | {
      ok: false;
      code: 'INVALID_EMAIL' | 'RATE_LIMITED' | 'UNAVAILABLE' | 'FAILED';
    };
```

Store at least email, canonical locale, registration time, and a fixed source such as `website-early-access`; set source and time on the server.

Trim surrounding whitespace and validate using the project's established approach. Do not strip `+tags`, remove dots, or invent mailbox-equivalence rules. Make repeat submissions safe through an appropriate uniqueness/idempotency mechanism. Return the same neutral acceptance result for an already accepted address without exposing membership or inserting another record.

Return success only after durable storage or confirmed provider acceptance. Use `400` for invalid input, `429` for rate limits, `503` for an unavailable/unconfigured service, and a generic failure response for unexpected errors.

Bound request size, validate the locale, apply origin/request protections, and use deployment-appropriate shared abuse throttling. An in-memory-only limiter is not adequate for a distributed deployment. Do not put addresses in URLs, analytics, client logs, public errors, or test artifacts. Keep email content out of the existing Jotai state logger.

Honor any established confirmation/double-opt-in process. Do not claim an invitation or confirmation email was sent unless it actually was.

**Missing configuration:** implement the UI, validation, adapter interface, and tests, but return `UNAVAILABLE` without storage/provider configuration. Document required non-secret configuration names and mark real production capture as blocked. Test mocks are allowed; production fake success is not. An unconnected form is not launch-ready.

## 7. Unavailable Sign in

Keep the English label **Sign in** and translate it elsewhere. Render the destination exactly as **`href="#"`**. Prevent default activation so it does not jump the page, change the URL, or open authentication, onboarding, an app route, or a new page.

Use `aria-disabled="true"` but keep the link keyboard-focusable to expose the explanation. Do not use `pointer-events: none` or a wrapper that suppresses interaction.

Show localized **Coming soon!** on pointer hover, keyboard focus, and touch activation. Escape and outside interaction dismiss it without moving focus. Do not instantly reopen after Escape until a fresh hover/focus interaction.

Reuse a suitable accessible tooltip primitive. Associate the trigger and noninteractive description with `aria-describedby` and `role="tooltip"`. Keep it hoverable, persistent while trigger or tooltip is hovered, and dismissible without focus movement. Do not rely on `title` alone. Match existing surfaces, radius, borders, spacing, and typography.

Apply the same behavior on mobile. With JavaScript disabled, expose a readable unavailable explanation instead of implying a working sign-in flow.

## 8. Get started destination and solar glow

### Destination

Keep **Get started** as the exact English CTA label. The header CTA and every equivalent existing CTA lead to early access, never unfinished signup/dashboard access.

On the homepage use `#early-access`. On another public page use the current locale's homepage plus that hash. Preserve the language and useful query parameters. Native links should work before hydration.

After intentional CTA activation, move keyboard focus to the programmatically focusable section heading. Do not steal focus on initial page load. Use `scroll-margin-top` for the sticky header. Smooth scrolling is allowed only when motion preferences permit it.

### Appearance

The button is a stable readable center surrounded by an animated solar corona. The glow surrounds **all four sides and every corner**, appears before hover, and does not resemble only a bottom shadow.

Anchor the effect in **`#F97316`** with deeper orange at the outer edges, amber/gold, and occasional warm-white highlights close to the perimeter. Keep the solar palette separate from semantic classification colors. No rainbow, purple/blue cyber glow, literal sun image, particles, full-page lighting, canvas, WebGL, or video dependency.

Use a steady halo plus a moving perimeter gradient and a small number of uneven soft flare lobes. Bright regions gently travel, stretch outward, and recede rather than behaving like a spinner or uniform rotating border. The label, center, and button geometry remain stable.

Starting visual tuning: primary glow roughly 8–16 px beyond the perimeter and a weaker outer halo around 20–28 px, adjusted to existing button size. Use slow offset cycles, no rapid flashing. Hover/focus may strengthen the halo; active state may subtly compress without layout shift. A real focus indicator must remain distinct from decorative light.

### Implementation and motion

Use the existing button variant or a small reusable `SolarGlowLink` with link semantics and existing radius/size tokens. Prefer a few pseudo-elements or `aria-hidden` layers, static blurred gradients, and transform/opacity animation. Do not add an animation dependency solely for this effect.

Keep decorative layers behind the opaque button face in a stable stacking context, with `pointer-events: none`. A perimeter mask or equivalent must prevent a rotating rectangle from exposing hard corners or crossing the label. Avoid clipping, scrollbars, and interference with adjacent controls; do not indiscriminately change global overflow.

Respect `prefers-reduced-motion: reduce` from first paint: static halo, no moving gradient, pulsing, flare expansion, or animated scrolling. System reduced motion takes precedence over manual animation settings.

Reuse an existing site-wide pause setting; otherwise add localized **Pause animations / Resume animations** in the existing footer. Pause must stop continuous motion until explicit resume and survive navigation. Reduced-motion detection is not a substitute for this control. Pause offscreen decorative work where practical.

Verify contrast on the actual button fill; use dark text on bright orange if needed rather than assuming white text is readable. Preserve touch-target size and test the longest translated labels.

## 9. Suggested organization

Adapt to existing conventions rather than introducing a parallel architecture:

```text
apps/website/
  messages/{en,pt-BR,zh-Hant,ja}.json
  src/
    i18n/{routing,request,navigation}.ts
    components/
      language-switcher.tsx
      early-access-section.tsx
      early-access-form.tsx
      coming-soon-link.tsx
      solar-glow-link.tsx
    lib/early-access/                 # server-only validation/provider adapter
    app/
      [locale]/...
      api/early-access/route.ts       # only with a supported server deployment
    proxy.ts
```

Keep static content server-rendered where possible and interactive boundaries narrow. Preserve existing state logging, without exposing registration emails. Reuse primitives rather than duplicating unrelated architecture. Do not upgrade Next.js or change package manager.

## 10. Acceptance checklist

Nothing below has been implemented or verified by this documentation PR.

- [ ] Only the website runtime and its necessary dependency lockfile entries change; no Console, SSO, Mobile, shared cross-app behavior, harness, or Sinapsi changes.
- [ ] Language and theme controls precede Sign in in the actual DOM, desktop layout, keyboard order, and responsive header.
- [ ] The language control follows the compact direct-choice reference, identifies the selection, and exposes all four native names accessibly.
- [ ] `/`, `/pt-br`, `/zh-hant`, and `/ja` render correctly directly, after refresh, and through navigation; `/` remains English regardless of browser language or stale cookies.
- [ ] Locale switching preserves logical path, dynamic parameters, query, and hash. Unknown pages return proper not-found responses. APIs/assets are not locale-redirected.
- [ ] All public content, metadata, shared-widget visible text and accessible names are localized. Catalog keys/placeholders match; no raw keys, unintentional fallback, Simplified Chinese substitution, or missing glyphs.
- [ ] Canonical language tags, self-canonical URLs, all locale alternatives, and `x-default` use the real configured origin without conflicting mechanisms.
- [ ] Exactly one homepage early-access section is the final content section before the footer and contains one visible email field.
- [ ] A successful submission is durably accepted, survives refresh/redeployment, and is idempotent. Evidence is checked without exposing collected addresses.
- [ ] Invalid input, network failure, backend failure, missing credentials, and rate limits produce correct localized states, preserve failed input, and never show false success.
- [ ] Sign in renders `href="#"`, does not navigate/jump, and exposes localized Coming soon through hover, keyboard, and touch with correct dismissal and no-JavaScript explanation.
- [ ] Every Get started CTA reaches locale-correct early access; native links work before hydration and focus is not hidden by the sticky header.
- [ ] The warm solar glow surrounds the full perimeter before hover with stable label/geometry and no clipping, overflow, rapid flashing, or blocked adjacent controls.
- [ ] Reduced motion is honored from first paint; pause/resume stops ongoing animation and persists across navigation. Forms, status announcements, tooltips, and controls work with keyboard/assistive technology.
- [ ] Review 320, 375, 768, and 1440 px plus 200% zoom in all locales and supported browsers; check hydration warnings, console errors, contrast, wrapping, and rendering behavior.
- [ ] Run the repository formatter/linter, typecheck, tests, production website build, and the required `drift doctor --ci` check using the pinned tools. Report actual results, not assumed passes.

The inspected website has no test script; use an established repository test framework if available or add a minimal website-scoped setup. Cover routing, catalog completeness, placeholder parity, CTA behavior, form result mapping, and failure handling. Combine automation with visual/keyboard review.

## 11. Completion report required from the implementation PR

Report the detected router/versions, changed files, URL contract, capture destination/configuration, test commands and actual outcomes, and unresolved production blockers. Distinguish implemented UI from verified behavior and external configuration.

Identify unreviewed Traditional Chinese/Japanese translations and missing privacy/provider configuration. Include visual evidence for controls, form, tooltip, full-perimeter glow, and reduced motion when the environment supports it. Do not invent deployments, saved registrations, sent emails, or successful checks.

## 12. References and provenance

Owner requirements provide the four languages, exact English labels, pre-launch state, email-only section placement, placeholder destination, solar-glow concept, website-only scope, control placement, and reference site.

The source handoff supplies the URL-driven routing decision, proposed copy, endpoint contract, accessibility/security requirements, starter translations, and acceptance checks. These are implementation decisions, not claims of existing repository behavior. Repository observations in section 3 are separate from those proposed decisions.

- Reference language control: https://www.deepseek.com/harness/en/
- next-intl App Router setup: https://next-intl.dev/docs/routing/setup
- next-intl routing configuration: https://next-intl.dev/docs/routing/configuration
- next-intl navigation: https://next-intl.dev/docs/routing/navigation
- next-intl Server/Client Components: https://next-intl.dev/docs/environments/server-client-components
- W3C language tags: https://www.w3.org/International/articles/language-tags/
- W3C tooltip pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
- W3C hover/focus content: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
- MDN reduced motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- W3C pause/stop/hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
