# Paid Ads Efficiency Cluster Design

**Date:** 2026-07-21

## Context

The July 21, 2026 Google Search Console export shows the site has impressions but almost no clicks. The strongest near-term opportunity is the paid ads efficiency cluster:

- `mer calculator` is averaging around position 21.
- `calculate mer` is averaging around position 31.
- `target roas calculator` is averaging around position 46.
- `marginal roas` is averaging around position 47.
- `blended-cac-guide` has the only click in the export.

The site needs a focused cluster pass that improves user usefulness and topic clarity without creating more pages or widening the indexation problem.

## Goal

Make the paid ads efficiency cluster read as a coherent decision workflow:

1. MER answers whether blended marketing efficiency is healthy at the top level.
2. Target ROAS answers what target a business should plan toward after margin and buffer assumptions.
3. Marginal ROAS answers whether the next increment of spend is still efficient.

## Scope

### In scope

- `/paid-ads/mer-calculator`
- `/guides/mer-guide`
- `/paid-ads/target-roas-calculator`
- `/guides/target-roas-guide`
- `/glossary/marginal-roas`
- Existing related glossary, guide, and calculator links needed to connect the cluster.
- Regression tests for role separation and internal references.

### Out of scope

- Creating new URLs.
- Bulk rewriting glossary pages.
- Changing ARR or MRR cluster copy.
- Adding arbitrary benchmark numbers without a source.
- Changing sitemap inclusion rules in this pass.

## Design

### MER calculator

Keep the calculator as the top-level diagnostic tool. It should:

- Explain that MER is revenue divided by marketing spend over the same period.
- Translate the result into break-even and target thresholds.
- State that a healthy blended MER does not prove the next dollar of spend is efficient.
- Route the user to the MER guide for interpretation and to marginal ROAS or incrementality for scaling decisions.

### MER guide

Make the guide the interpretation layer. It should:

- Explain what MER can and cannot answer.
- Show the relationship between MER, contribution margin, target MER, and marginal ROAS.
- Use one worked example that opens the calculator with inputs.
- Provide explicit next steps for health check, budget allocation, and incrementality validation.

### Target ROAS calculator

Keep the calculator focused on planning constraints. It should:

- Make the target ROAS formula and denominator guardrail clear.
- Explain the difference between break-even ROAS and target ROAS.
- Include fixed-cost allocation and profit buffer as optional planning assumptions.
- Link to the guide for interpretation and back to MER for top-down validation.

### Target ROAS guide

Make the guide the planning and assumptions layer. It should:

- Explain when target ROAS is appropriate and when it is too strict.
- Distinguish margin, fees, returns, fixed allocation, and desired profit.
- Include a worked calculator scenario.
- Connect target ROAS to MER and marginal ROAS without competing for the calculator intent.

### Marginal ROAS

Use the glossary page as the concise definition and bridge:

- Define marginal ROAS as the return from incremental spend.
- Contrast it with blended ROAS/MER.
- Link to the MER guide for the top-down signal.
- Link to the relevant marginal ROAS calculator or guide for the next decision.

## Acceptance Criteria

- Each page has a distinct role that is visible in the opening content.
- MER pages explicitly distinguish blended health from next-dollar efficiency.
- Target ROAS pages explicitly distinguish a planning target from a break-even floor.
- Marginal ROAS links back to MER and forward to a practical decision tool.
- Existing content-cluster tests cover the new relationships.
- Lint and production build pass.
- No new sitemap URLs are introduced.
