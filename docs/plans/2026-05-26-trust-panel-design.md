# Trust Panel Design

**Date:** 2026-05-26

## Goal

Make trust and publication signals visible at the page level on priority content templates, so users and search engines can immediately see who maintains the page, how the content is reviewed, and where to verify methodology or report issues.

## Problem

MetricKit already has useful trust assets:

- `/about`
- `/methodology`
- `/editorial-policy`
- `/contact`

But on content pages, these signals are still too fragmented.

- Guide, glossary, and calculator pages show `Written by`, `Reviewed by`, and `Updated`
- methodology and editorial policy are mostly discoverable through the footer or standalone pages
- contact/corrections are not surfaced as a clear page-level action

That means a user can read the page without quickly seeing how the page is maintained or where to verify assumptions. It also weakens the visible E-E-A-T layer we are trying to strengthen.

## Scope

This pass is intentionally narrow and page-level:

1. Create one reusable trust panel component
2. Add it to:
   - calculator pages
   - guide pages
   - glossary term pages
3. Reuse existing site configuration paths for:
   - methodology
   - editorial policy
   - contact

No new routes are required.

## Chosen Approach

Introduce a shared `TrustPanel` component that renders three direct actions:

- `Methodology`
- `Editorial policy`
- `Contact`

The panel should also include one short explanatory sentence that frames the links as:

- how MetricKit calculates
- how MetricKit reviews
- where users can send questions or corrections

Placement:

- calculators: directly below the visible metadata strip near the top of the page
- guides: near the page header / summary area, before the page gets deep into content
- glossary terms: near the hero metadata / next-step area so the term page feels maintained, not anonymous

## Why This Approach

- minimal implementation surface
- strengthens visible trust without rewriting content
- improves consistency across the three main content templates
- reinforces existing methodology/editorial pages rather than creating more thin pages

## Testing Strategy

Add regression coverage that verifies:

- calculator page template includes methodology, editorial policy, and contact links
- guide page template includes the same trust panel links
- glossary page template includes the same trust panel links
- existing visible freshness/ownership signals remain present

## Out of Scope

- site-wide schema redesign
- new author profile system
- major content rewrites
- topic expansion
- large-scale internal linking changes
