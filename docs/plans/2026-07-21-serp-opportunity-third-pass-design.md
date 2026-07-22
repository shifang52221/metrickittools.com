# SERP Opportunity Third Pass Design

**Date:** 2026-07-21

## Goal

Improve three pages that already appeared in the top 20 during the pre-July-21 GSC window but received zero clicks, without touching the newly refreshed ARR/MRR/CAC core pages or the proven MER cluster.

## Scope

- `/guides/interest-expense-guide`
- `/guides/liquidation-preference-guide`
- `/saas-metrics/trial-to-paid-calculator`

## Approach

- Refresh the two guide timestamps so the visible review signal matches the new decision content.
- Add a short, intent-specific decision bridge after the core explanation:
  - interest expense: contractual payment vs accounting expense vs net interest
  - liquidation preference: preference vs conversion vs waterfall complexity
- Add calculator-level next-action guidance to trial-to-paid so the result routes users into activation and funnel diagnosis.
- Keep URLs, indexing policy, titles, descriptions, and MER content unchanged.

## Non-Goals

- No new pages
- No broad template rewrite
- No changes to ARR/MRR/CAC pages updated on 2026-07-21
- No changes to the MER cluster that already produced clicks

## Success Criteria

- Regression tests confirm all three target entries expose the new update/action signals.
- Existing content-cluster, indexing, SEO, lint, and build checks pass.
- The deployed pages return HTTP 200 and expose the new decision text.
