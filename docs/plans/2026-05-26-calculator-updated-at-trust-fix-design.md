# Calculator UpdatedAt Trust Fix Design

**Date:** 2026-05-26

## Goal

Align calculator-page freshness signals with the actual pages we have recently improved, so production `Updated` labels and structured-data dates no longer lag behind the content itself.

## Problem

Glossary and guide pages already use page-level `updatedAt` values.

Calculator pages do not. They currently use a single global value from `siteConfig.contentReviewDate`, which means:

- all calculator pages show the same date
- recently improved calculator pages still appear stale
- `dateModified` in structured data can disagree with the real page-level rollout history

That weakens trust for both users and search engines.

## Scope

This pass is intentionally narrow:

1. Add `updatedAt` support to the calculator definition model
2. Update the calculator page to prefer calculator-level `updatedAt`
3. Backfill the recently improved priority calculators with real dates

Priority calculators for the first backfill:

- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`
- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`

No broad date backfill across all calculators is included in this pass.

## Chosen Approach

Add an optional `updatedAt` field to `CalculatorDefinition`.

Then update `src/app/[category]/[slug]/page.tsx` so:

- `calculatorReviewDate = calc.updatedAt ?? siteConfig.contentReviewDate`

This preserves existing behavior for untouched calculators while allowing recently improved pages to express accurate freshness.

## Why This Approach

- minimal code change
- no template redesign
- no site-wide data migration required
- immediate trust improvement on the calculators we have actually worked on

## Testing Strategy

Add regression coverage that verifies:

- priority calculators expose `updatedAt`
- the calculator page uses calculator-level `updatedAt` rather than only the global fallback

## Out of Scope

- adding `updatedAt` to every calculator in the library
- building a global freshness workflow
- changing glossary or guide freshness logic
