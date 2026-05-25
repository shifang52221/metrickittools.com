# Priority Calculator Usability Design

**Date:** 2026-05-25

## Goal

Strengthen trust and usability on the highest-value SaaS metrics calculators by making the result interpretation more specific and the next decision clearer.

## Scope

This pass only targets four calculators inside the ARR / CAC / LTV / unit economics cluster:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`
- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`

No new URLs will be created. No calculator template changes are included in this pass.

## Why This Matters

The calculator template already exposes strong trust scaffolding:

- written by / reviewed by / updated
- FAQ support
- formula and assumptions
- interpretation sections when provided

The current gap is not trust chrome. The gap is that several important calculators still rely on generic or incomplete interpretation content. That weakens usability because the user can get a number without enough help on:

- what the result actually means
- what range is risky vs healthy
- what to check next if the result looks good on paper but weak in practice

## Chosen Approach

Use the existing calculator data model only:

- `seo.intro`
- `seo.benchmarks`
- `seo.pitfalls`
- `guide`

This keeps the implementation narrow and avoids template churn. The page renderer already supports these sections.

## Focus By Calculator

### `ltv-to-cac-calculator`

Clarify that:

- ~3:1 is a rough heuristic, not a universal target
- a strong ratio can still hide cash risk if payback is long
- definition mismatch and blended averages can overstate quality

### `cac-payback-period-calculator`

Clarify that:

- payback is a cash-efficiency lens, not a full profitability answer
- different payback bands imply different levels of risk and flexibility
- users should inspect gross margin, churn, and channel mix before trusting the number

### `unit-economics-calculator`

Clarify that:

- users should read CAC, payback, LTV, and LTV:CAC together rather than in isolation
- attractive ratios can still be operationally weak if churn or cash timing is poor
- the next action depends on whether the constraint is acquisition, retention, pricing, or margin

### `cohort-ltv-forecast-calculator`

Clarify that:

- cohort-style modeling is more trustworthy than a shortcut when retention changes over time
- discounted LTV is more decision-useful than raw LTV in longer horizons
- small assumption changes compound, so scenario thinking matters

## Testing Strategy

Add focused regression coverage to ensure these four calculators expose:

- non-empty interpretive `guide` sections
- non-empty `seo.pitfalls`
- non-empty `seo.intro`
- benchmarks on the calculators where interpretation depends on ranges

## Out of Scope

- redesigning calculator templates
- changing result card layout
- rewriting all SaaS metrics calculators
- adding universal next-step components to every calculator page
