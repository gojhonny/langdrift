# SPEC — SSO / Account Entry

## Purpose

Move a prospect from curiosity to an organization-ready LangDrift account without prematurely deciding authentication or pricing architecture.

## Visual family

Website/Cohere family, not Dashboard/Vercel family.

## Journey

```text
/sign-in
/sign-up
/create-organization
/select-plan
/setup
```

First-time conceptual flow:

```text
Create account
→ Create organization
→ Choose plan / trial
→ Create first product
→ Invite / skip
→ Developer setup
```

## Open decisions

Do not invent:

- auth provider/library;
- exact auth methods;
- enterprise SSO implementation;
- final plan names;
- prices;
- team/person/product limits;
- billing cadence;
- exact Voice entitlements.

## Plans

Until Pricing is canonical, plan UI may demonstrate structural dimensions only:

```text
Teams
People
Products
Voice access
History
Integrations
```

## States

- sign-in/sign-up validation;
- network/provider failure placeholder;
- organization entry;
- plan preview;
- unavailable/open commercial values clearly marked TBD.

## Acceptance

- auth feels continuous with Website;
- organization creation is represented before technical setup;
- no provider or commercial choice is silently promoted to canon;
- technical integration does not pollute the first account form.
