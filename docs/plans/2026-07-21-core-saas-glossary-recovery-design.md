# Core SaaS Glossary Recovery Design

**Date:** 2026-07-21

## Context

The July 21, 2026 GSC export shows the highest glossary impressions are concentrated in three SaaS fundamentals:

- `/glossary/arr`: 744 page impressions, 0 clicks, average position around 81.86.
- `/glossary/mrr`: 693 page impressions, 0 clicks, average position around 78.73.
- `/glossary/cac`: 203 page impressions, 0 clicks, average position around 83.36.

Query-level demand also clusters around meaning, formula, calculation, and confusion intent:

- `arr meaning`, `arr formula`, `how to calculate arr`, `bookings vs arr`
- `mrr`, `mrr meaning`, `mrr formula`, `how to calculate mrr`
- `cac calculator`, `calculate cac`, `cac formula`, `cac meaning`

These pages already have trust signals and next-step CTAs, but the body copy still reads more like short glossary entries than strong answer pages. The site should not create more URLs; it should make these already-observed URLs more useful and more differentiated.

## Goal

Upgrade ARR, MRR, and CAC glossary pages from thin definitions into concise decision pages that:

1. Answer the exact meaning/formula/calculation intent quickly.
2. Clarify what the metric is commonly confused with.
3. Explain what belongs in the numerator and denominator.
4. Route users to the right calculator and guide when they need a real workflow.

## Scope

### In scope

- `/glossary/arr`
- `/glossary/mrr`
- `/glossary/cac`
- Metadata, hero notes, modules, examples, FAQs, and updated dates for those entries.
- Regression tests that protect the decision-oriented structure.

### Out of scope

- Creating new pages.
- Changing calculator behavior.
- Changing the index-quality policy.
- Bulk rewriting all SaaS glossary pages.

## Design

### ARR

Make ARR answer four things immediately:

- ARR means Annual Recurring Revenue.
- ARR is usually `MRR x 12` for monthly subscriptions.
- ARR is not bookings, cash collected, or GAAP revenue.
- ARR becomes more useful when paired with net new ARR, ARR waterfall, and ARR vs MRR context.

### MRR

Make MRR answer:

- MRR means Monthly Recurring Revenue.
- MRR is recurring subscription revenue for a month, not cash collections.
- New, expansion, contraction, and churned MRR explain movement.
- Forecasting MRR needs retention and waterfall assumptions, not only a static formula.

### CAC

Make CAC answer:

- CAC means Customer Acquisition Cost.
- CAC is acquisition spend divided by new paying customers.
- Paid CAC and fully-loaded CAC are different and should not be mixed.
- CAC is incomplete without payback, gross margin, and LTV:CAC interpretation.

## Acceptance Criteria

- ARR, MRR, and CAC expose custom glossary modules for comparison, measurement, misuse, operator takeaway, and next decision.
- The pages use `updatedAt: "2026-07-21"`.
- ARR explicitly handles bookings, cash, revenue recognition, ARR vs MRR, and ARR waterfall.
- MRR explicitly handles cash collections, new/expansion/contraction/churned MRR, and forecast/waterfall next steps.
- CAC explicitly handles paid vs fully-loaded CAC, new paying customers, payback, gross margin, and LTV:CAC.
- Existing content cluster tests remain green.
