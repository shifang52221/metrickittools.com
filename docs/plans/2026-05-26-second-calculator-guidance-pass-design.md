# Second Calculator Guidance Pass Design

**Date:** 2026-05-26

## Goal

Deepen the interpretation layer on two core SaaS calculators so they behave more like decision tools and less like formula outputs.

## Scope

This pass is intentionally narrow. It only targets:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`

No new URLs. No calculator template changes. No broader rewrite of the calculator library.

## Why This Pass Matters

The first calculator trust/usability pass improved the interpretation layer on:

- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`

The next two highest-value gaps in the same decision chain are:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`

Both calculators already have solid formulas and baseline copy. The remaining weakness is that a user can still get a number without enough help on:

- when a result looks acceptable but is still risky
- why payback and ratio must be read together
- what to inspect next before increasing spend or trusting a blended average

## Chosen Approach

Use the existing calculator content model only:

- `guide`
- optionally small refinements to `seo.benchmarks` or `seo.pitfalls` only if needed

This keeps the pass very focused and avoids template churn.

## Focus By Calculator

### `ltv-to-cac-calculator`

Strengthen interpretation so the page explains:

- why ratio and payback must be read together
- why a high ratio can still be dangerous if cash returns slowly
- why blended numbers and definition mismatch can create false confidence

### `cac-payback-period-calculator`

Strengthen interpretation so the page explains:

- that payback bands imply different levels of cash flexibility and risk
- when long payback is acceptable versus when it should block scaling
- why the user should inspect churn, margin, and channel mix before trusting the result

## Testing Strategy

Add regression coverage that checks these two calculators expose at least two interpretation sections in `guide`, not just one shallow block.

The test should also ensure the interpretation copy includes decision-oriented language around:

- payback
- risk / cash efficiency
- next investigation areas

## Out of Scope

- redesigning calculator layout
- adding new shared next-step components
- touching unrelated calculators
