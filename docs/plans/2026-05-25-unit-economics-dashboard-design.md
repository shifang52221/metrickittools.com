# Unit Economics Dashboard Design

**Date:** 2026-05-25

**Goal**

Upgrade `unit-economics-dashboard-guide` into a clearer diagnostic-layer page that helps operators decide which lever to fix first when unit economics deteriorate.

**Why This Is The Right Next Move**

The site now has:

- stronger ARR, CAC, and LTV parent pages,
- a stronger `unit-economics-guide` top-layer hub,
- glossary feeder pages that route into those parents.

The missing layer is diagnosis. Users who already understand the definitions still need a practical page that helps them decide whether the problem is acquisition cost, retention, pricing, margin, or cash timing. That is the job of the dashboard page.

**Primary User Task**

Help a user answer one operating question:

"Which lever should I fix first when unit economics look weak?"

That is different from the parent pages:

- `CAC` explains cost definition,
- `LTV` explains value estimation,
- `unit-economics-guide` explains how the metrics fit together,
- `unit-economics-dashboard-guide` should explain how to diagnose where the weakness actually sits.

**Chosen Approach**

Upgrade the existing `unit-economics-dashboard-guide` and attach it to `unit-economics-guide` with `partOfGuideSlug: "unit-economics-guide"`.

This is better than creating a new diagnostic URL because:

- the current page already owns the dashboard/diagnostic intent,
- it avoids splitting broad operational-diagnosis intent across overlapping pages,
- it gives the top-layer hub a clear child page without changing the URL structure.

**Information Architecture**

Parent:

- `/guides/unit-economics-guide`

Diagnostic child:

- `/guides/unit-economics-dashboard-guide`

Supporting guides surfaced inside the dashboard page:

- `/guides/cac-guide`
- `/guides/cac-payback-guide`
- `/guides/ltv-guide`
- `/guides/ltv-cac-guide`
- `/guides/arr-guide`

Supporting calculators:

- `/saas-metrics/unit-economics-dashboard-calculator`
- `/saas-metrics/blended-cac-calculator`
- `/saas-metrics/cac-payback-period-calculator`
- `/saas-metrics/ltv-calculator`
- `/saas-metrics/ltv-to-cac-calculator`

Supporting glossary:

- `/glossary/unit-economics`
- `/glossary/cac`
- `/glossary/ltv`
- `/glossary/payback-period`
- `/glossary/gross-margin`
- `/glossary/logo-churn`
- `/glossary/cohorted-ltv`

**Content Strategy**

This page should not read like another metric definition page. It should read like a practical review workflow.

Recommended structure:

- what the dashboard is for,
- the five main failure zones:
  - acquisition cost,
  - retention / churn quality,
  - pricing / ARPA,
  - gross margin,
  - cash timing / payback,
- how to tell which zone is the primary constraint,
- which metric to open next,
- which levers usually move the dashboard fastest.

The page should help users move from:

headline ratio concern -> root-cause diagnosis -> next metric page or calculator.

**Metadata Strategy**

Move the page away from generic “how to compute” wording and toward diagnosis wording:

- what to improve,
- which lever to fix first,
- how to read the dashboard rather than just calculate it.

**Internal Linking Strategy**

On the dashboard page:

- add `partOfGuideSlug: "unit-economics-guide"`,
- keep the page tightly linked to the parent hub,
- route each diagnosis branch to the strongest supporting page.

No new glossary work is required in this pass unless a clear feeder gap appears during implementation.

**Scope Guardrails**

This pass should not:

- create a new URL,
- re-open ARR/CAC/LTV parent copy beyond what is needed for links,
- turn the page into a second top-level hub,
- expand into broad dashboard UI changes.

**Success Criteria**

- `unit-economics-dashboard-guide` clearly behaves like a diagnostic child of `unit-economics-guide`.
- The page focuses on “what to fix first” rather than repeating basic metric definitions.
- Internal links help users move from weak dashboard signals to the right deeper page.
- The SaaS metrics architecture becomes a clearer four-layer path:
  glossary -> metric pillar -> top-layer hub -> dashboard diagnosis.
