# N12 — Dashboard Tailwind Alignment refinement

Contract: approved spec 0002 v2; graph `0005 → (0006 and 0007) → 0008`.
The owner approved retirement of N12 and E24 on 2026-09-26. This record captures
that decision without inferring approval of other markers or new policy.
Final evidence is indexed by
`.audits/reports/dashboard-tailwind-final-2026-09-26.md`.

## Validated conclusions

1. Canonical Tailwind policy distinguishes application rules from required
   integration. Dashboard now expresses body/sizing/focus/transition styling as
   utilities, while framework/shared imports, theme values, variant registration
   and semantic mappings remain necessary CSS. One stylesheet is this local
   outcome, not a universal filename/count/layout standard.
2. Existing public chart/theme custom-property contracts can be preserved while
   application color/font roles become semantic utilities. Shell-muted differs
   from root-muted; badge text differs from chart classification color; brand
   foreground stays fixed; the recovery document deliberately remains light.
   These exact values/names are not universal policy.
3. Conflict-aware composition is not automatically appearance-preserving. The
   first adoption changed selected text/background precedence. Keeping the
   original baseline exposed the regression; explicit class lists now preserve
   the captured appearance. Existing selected-control styling is not redesigned.
4. Browser baseline quality requires observing deferred content. A mechanical
   screenshot pass initially captured blank desktop chart space. Waiting for
   rendered chart SVG/event markers and inspecting the images corrected the
   harness before migration. This is test evidence, not a production timing API.
5. External-failure acceptance requires reproduction and no-worsening proof.
   Repository lint remains failed; unchanged Docs/SSO/shared-React errors remain
   external debt, not work silently incorporated into N12.

These findings validate existing canonical obligations in
`.agents/guardrails/tailwind.md` and the ownership/evidence contracts. They do
not require a new guardrail, vocabulary term, ADR, checker or hook. No policy
file was changed or local implementation detail promoted.

## Approved marker retirement

| Marker | Reusable intent already owned by | Approved disposition |
| --- | --- | --- |
| Dashboard `AGENT_NOTES.md` N12 | Tailwind guardrail, Application styling and integration surfaces; AC-04/05 evidence | Item 12 retired on explicit owner approval; canonical integration exception remains authoritative |
| E24, `app/lib/template/ui.tsx`, `AGENT: use cn function` | Tailwind guardrail, Class composition and theme roles; AC-06 evidence | Temporary comment retired on explicit owner approval; helper behavior unchanged |

Only these two markers were removed. `AGENT_NOTES.md` remains because N09
(shared icon dependency ownership) and N11 (state-owner intent) are still
unresolved. All remaining inline component/props/hook/state/domain/navigation/
documentation/runtime evidence remains deferred; this cycle does not infer
their resolution from a styling migration. No unrelated cleanup is proposed.

## Limits and external debt

The suite is regression evidence for the documented Chromium/viewport/theme/
locale matrix, not browser universality, WCAG/CWV certification, feature
correctness beyond the existing tests, or a deployment/readiness declaration.
The final Review/Audit records any permitted rendering noise and actual exits.
It preserves the original baseline, including pre-existing visual behavior.

The 18 baseline-proven prohibited-import errors (Docs 8, SSO 7, shared React 3)
remain failed and unmodified. This refinement creates no new defect ticket or cycle.
The duplicated capture-condition configuration noted in Ticket 0005's review
is a nonblocking maintainability observation, not silently expanded scope.

No accepted conclusion is left implicitly promoted: current canonical rules
are validated, N12/E24 retirement has explicit owner approval, and all other
possible standards/enforcement work remains unpromoted. The accepted marker
dispositions are executed, not kept as duplicate production policy. The owner
subsequently identified this cycle as closed in the next initiative brief.
All four tickets are gates-complete at the final retirement snapshot recorded
in the final Audit amendment; N12 is closed with external lint debt preserved.
No commit, push, PR, merge, publish or release is authorized by this record.
