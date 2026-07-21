# Index Quality Gating Design

**Date:** 2026-07-21

## Context

The July 21, 2026 28-day Google Search Console export shows a site-wide visibility problem, not a page-one CTR problem:

- About 2,985 impressions produced 1 click.
- Only 42 pages had any impressions in the 28-day window.
- The sitemap still exposes about 604 URLs, including about 369 glossary URLs.
- Most queries are ranking beyond position 50, so Google is still trying pages that are not earning enough confidence.

The site should stop behaving like every glossary URL is equally worthy of indexation. We need a first-pass index quality gate that reduces low-value index surface without hiding calculators, core guides, or glossary terms that already prove demand.

## Goal

Create one conservative, explainable indexing policy that:

1. Keeps all trust pages, category hubs, guides, calculators, and proven glossary pages indexable.
2. Moves low-value glossary pages to `noindex, follow`.
3. Removes those glossary pages from `public/sitemap.xml`.
4. Uses the same policy for runtime metadata and sitemap generation so the site does not drift.

## Scope

### In scope

- Glossary page metadata
- Sitemap inclusion rules
- One shared indexing policy source
- Regression tests for keep vs noindex decisions
- A first-pass glossary contraction list

### Out of scope

- Redirecting or deleting URLs
- Rewriting glossary body copy in bulk
- Noindexing calculators
- Noindexing guides
- Changing navigation or internal-link components in this pass

## Options Considered

### Option 1: Noindex all glossary pages without GSC impressions

Pros:

- Fast and aggressive
- Large immediate contraction

Cons:

- Too blunt for a young site
- Would hide strategic pages that are core to calculators or topic clusters
- Hard to defend when some pages are still in discovery

### Option 2: Keep everything referenced anywhere in content

Pros:

- Safest against over-pruning
- Easy to explain

Cons:

- Barely contracts the index
- Many glossary entries self-declare relationships without being true priority landing pages
- Leaves the “too many equal-quality URLs” problem mostly intact

### Option 3: Keep only proven or strategically connected glossary pages

Pros:

- Conservative but still meaningful
- Protects pages with evidence or a real product/content role
- Gives Google a cleaner primary glossary layer

Cons:

- Requires one manual allowlist for strategic finance terms
- Some guide-linked definition pages will remain crawlable but stop competing for indexation

## Recommended Approach

Choose **Option 3**.

For the first pass, a glossary page stays indexable if at least one of these is true:

1. It had impressions in the latest July 21 GSC page export.
2. It has an explicit glossary `seo.nextStepHref`, meaning it already acts as a quick-definition bridge into a stronger page.
3. It is directly used by at least one calculator via `relatedGlossarySlugs`, which gives it an active tool-support role.
4. It belongs to a small manual strategic set for high-value finance concepts we still want indexable while the finance cluster matures.

If none of those are true, the page becomes `noindex, follow` and is removed from the sitemap.

## First-Pass Policy Shape

### Always indexed

- `/`
- Trust and legal pages
- `/guides`
- `/glossary`
- Category hubs
- All calculator detail pages
- All guide detail pages

### Conditionally indexed

- Glossary detail pages

### First-pass glossary keep reasons

- GSC impression evidence
- Quick-definition bridge via `nextStepHref`
- Calculator support role
- Manual strategic finance allowlist

### First-pass glossary noindex target

Glossary pages that are:

- not in the July 21 GSC impression set
- not acting as a glossary-to-guide bridge
- not directly supporting a calculator
- not in the manual strategic allowlist

This should primarily shrink template-like extra glossary inventory, especially low-signal finance, paid-ads operations, and SaaS process definitions that do not yet deserve independent indexation.

## Data Source

The first-pass GSC-derived glossary keep set comes from:

- `E:\360MoveData\Users\Administrator\Desktop\metrickittools.com-Performance-on-Search-2026-07-21\网页.csv`

This snapshot should be treated as a policy input for this rollout, not as a permanent truth. Future monthly passes can revise the allowlist.

## Implementation Notes

- Store the glossary keep sets in a shared JS data module so both runtime TypeScript and the Node sitemap script can use the same policy.
- Add a typed TypeScript wrapper that exposes:
  - `getGlossaryIndexingDecision`
  - `isGlossaryTermIndexable`
  - `getIndexableGlossaryTerms`
- Update `src/app/glossary/[slug]/page.tsx` metadata to emit `robots: { index: false, follow: true }` for noindex terms.
- Update `scripts/generate-sitemap.mjs` to exclude noindex glossary terms.

## Acceptance Criteria

- Representative protected glossary pages like `arr`, `mrr`, `cac`, `roas`, and `marginal-roas` remain indexable.
- Representative low-value glossary pages like `capital-allocation` and `runway-extension-plan` become `noindex, follow`.
- `public/sitemap.xml` excludes noindex glossary URLs.
- The policy lives in one shared source of truth.
- Tests cover both protected and noindex examples.
- Lint and production build pass.
