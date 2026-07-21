# Guides and Glossary Hub Upgrade Design

**Date:** 2026-07-21

## Context

The current index-quality pass reduced the sitemap from about 604 URLs to 377 and protected the stronger content clusters. The next bottleneck is findability:

- `/guides` has meaningful search exposure but mostly presents a long category list.
- `/glossary` has meaningful search exposure but presents hundreds of definitions with roughly equal visual weight.
- The strongest existing content already forms clear decision paths around unit economics, retention, acquisition efficiency, paid ads efficiency, and finance planning.

The site should use those existing paths more deliberately instead of asking users and crawlers to infer the structure from a large list.

## Goal

Turn `/guides` and `/glossary` into useful, explainable entry points without adding URLs or changing the index policy.

## Recommended Design

### Guides hub

Add a “Start with the decision” section before the category lists with five paths:

1. Unit economics: connect ARR, CAC, LTV, and payback.
2. Retention and MRR: explain recurring revenue movement and forecasting.
3. Acquisition efficiency: compare CAC, payback, and LTV:CAC.
4. Paid ads targets: connect MER, Target ROAS, and Marginal ROAS.
5. Cash and valuation planning: move from runway and burn to DCF sensitivity.

Each path must have:

- a user-facing decision title
- a short explanation of when to use it
- a primary guide link
- an optional secondary guide link

### Glossary hub

Add a “Core definitions to start with” section before the full category listing. Highlight:

- ARR
- MRR
- CAC
- LTV
- Gross margin
- Payback period
- ROAS
- MER
- Net debt

Keep the full category listing below it. The goal is prioritization, not hiding.

## Architecture

- Put highlight definitions in `src/lib/content/hubHighlights.ts`.
- Keep page templates responsible for layout and link rendering.
- Reuse existing guide and glossary data for titles and descriptions.
- Keep all hrefs pointed at existing routes.

## Acceptance Criteria

- `/guides` exposes five decision paths before the category lists.
- `/glossary` exposes the nine core definitions before the full category lists.
- No new routes are created.
- Existing guide/glossary links and sitemap count remain stable.
- Tests protect the selected slugs and route shapes.
