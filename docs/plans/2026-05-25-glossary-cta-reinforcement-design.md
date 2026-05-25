# Glossary CTA Reinforcement Design

**Date:** 2026-05-25

## Goal

Strengthen trust and usability on a small set of high-value glossary pages by making the "quick definition -> full guide" path explicit.

## Scope

This pass is intentionally narrow. It only updates SEO-facing guidance fields on eight glossary terms inside the existing SaaS metrics clusters:

- `ltv-to-cac`
- `cac-payback-period`
- `customer-lifetime`
- `net-new-arr`
- `arr-waterfall`
- `churn-rate`
- `cohorted-ltv`
- `logo-churn`

No new URLs will be created. No page template changes will be made. No broad glossary refactor is included.

## Why This Matters

These terms already sit inside the most important trust and search clusters on the site:

- `ARR`
- `CAC`
- `LTV`
- `unit economics`

Right now, several of these glossary pages still behave like isolated definition stubs. They explain a term, but they do not clearly tell the user:

- that this page is the fast definition
- where to go for the complete operating guide
- what the next logical step is

That weakens both usability and trust. A stronger glossary page should feel like a helpful entry point, not a dead end.

## Chosen Approach

Add `seo.heroNote`, `seo.nextStepLabel`, and `seo.nextStepHref` to the priority glossary terms.

Each note should:

- position the glossary page as the quick definition
- point to the most relevant full guide already in the cluster
- avoid generic filler language

## Mapping

- `ltv-to-cac` -> `/guides/ltv-cac-guide`
- `cac-payback-period` -> `/guides/cac-payback-guide`
- `customer-lifetime` -> `/guides/customer-lifetime-guide`
- `net-new-arr` -> `/guides/net-new-arr-guide`
- `arr-waterfall` -> `/guides/arr-waterfall-guide`
- `churn-rate` -> `/guides/cohort-ltv-forecast-guide`
- `cohorted-ltv` -> `/guides/cohort-ltv-forecast-guide`
- `logo-churn` -> `/guides/retention-churn-hub-guide`

## Testing Strategy

Add regression coverage in `src/lib/content-clusters.test.ts` to verify each priority term exposes:

- a non-empty `seo.nextStepLabel`
- the expected `seo.nextStepHref`
- a `seo.heroNote` that frames the page as a fast definition and points to the full guide

## Out of Scope

- redesigning glossary templates
- changing layout or components
- rewriting long-form term copy
- site-wide CTA standardization for all glossary pages
