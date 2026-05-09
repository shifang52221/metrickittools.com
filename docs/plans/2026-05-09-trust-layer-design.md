# Trust Layer Design

## Goal

Ship a first-pass trust and E-E-A-T layer across MetricKit so the site looks more like a real publisher and less like a disconnected collection of tools and short pages.

## Why This Comes First

The site already has hundreds of URLs and some pages that rank in the top 10, but many of those pages still get zero clicks. Before we invest in heavy page rewrites or large-scale URL pruning, we need to strengthen the site-wide trust signals that both users and search engines can see immediately.

## Scope

This pass focuses on the smallest high-leverage set of changes:

1. Expand site-level publisher metadata in `siteConfig`.
2. Strengthen site-wide JSON-LD for `Organization` and `WebSite`.
3. Add visible byline/review/update information to guide, glossary, and calculator pages.
4. Add `/methodology` and `/editorial-policy` pages.
5. Rework `/about` into a clearer publisher/about-the-site page.
6. Improve page-level schema for `Article`, `DefinedTerm`, and `SoftwareApplication`.

This pass does not attempt:

- large-scale content rewrites
- URL pruning / noindex rollout
- internal-link topology redesign
- Core Web Vitals remediation

## Assumptions

- We do not yet have approved public individual author bios to publish.
- We will use a brand-editorial model for now: `MetricKit Editorial` and `MetricKit Editorial Review`.
- We prefer to publish trust signals now rather than block on real-person profile collection.

## Proposed UX

### Content Pages

Guide, glossary, and calculator pages should show a compact trust strip near the top with:

- Written by: MetricKit Editorial
- Reviewed by: MetricKit Editorial Review
- Last updated: existing page date

The strip should feel editorial and calm, not promotional.

### About / Methodology / Editorial Policy

- `/about` should explain who the site serves, how the site is produced, what the editorial model is, and where to find methodology/policy details.
- `/methodology` should explain formulas, assumptions, examples, input expectations, update philosophy, and source handling.
- `/editorial-policy` should explain drafting, review, corrections, conflicts, and update practices.

## Technical Approach

- Extend `src/lib/site.ts` with stable publisher metadata.
- Reuse the existing page `updatedAt` fields rather than inventing new dates.
- Keep page content objects unchanged except where existing metadata is already available.
- Generate richer schema in the page templates rather than duplicating trust data throughout content definitions.

## Validation

Because the repo currently has no automated test suite, this pass will use:

- `npm run lint`
- `npm run build`
- focused diff review
- spot-checking the rendered HTML for updated trust text and schema on representative pages
