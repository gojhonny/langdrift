# Next.js

Applies to LangDrift Next.js applications, in addition to [frontend.md](frontend.md).

## Application and route ownership

Place the App Router's `app/` directly under the app workspace root, without a `src/` wrapper.

Apply [frontend composition](frontend.md#components-hooks-and-composition) through route files and layouts: the filesystem owns page identity. A route should compose its page instead of merely passing a page discriminator into a universal view. Navigation/title models can still represent useful data without owning route dispatch.

Give distinct pages appropriate page-specific metadata. Shared root metadata is a foundation, not a replacement for page identity.

## Navigation and server boundaries

Use Next Link/client navigation for ordinary internal navigation. External destinations, fragment skip links and deliberate full-document recovery have different semantics; evaluate those contexts rather than banning every HTML anchor.

Keep configuration used only by server-side operations at the server boundary. Expose configuration to client code only when that client has a real need for it. Whether a value is a URL does not, by itself, establish that it is secret or that it belongs in a client bundle.

## Localization ownership

For localized applications, keep app-specific localization resources under `app/lib/i18n`. Consume the shared language control through the [generic UI owner](frontend.md#shared-ui-ownership), keeping app-specific messages and behavior with the app.

Locale choices, persistence identifiers, timezone and control placement follow the application contract; the Dashboard's Settings placement is not a universal Next.js requirement.
