# Metadata Hardening and ARR Pillar Validation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Harden metadata generation against overlong titles and descriptions, then validate the hub-and-spoke site-architecture hypothesis by upgrading the existing ARR guide into the first true pillar page.

**Architecture:** This pass stays inside the existing data-driven content model. We will add reusable SEO clamping utilities, tighten high-priority page metadata at the content source, then extend the guide and glossary data structures just enough to express pillar relationships without creating new routes or duplicating content models.

**Tech Stack:** Next.js app router, TypeScript content definitions, existing guide/glossary page templates, npm lint/build verification.

---

### Task 1: Harden metadata generation

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/app/guides/[slug]/page.tsx`
- Modify: `src/app/glossary/[slug]/page.tsx`
- Modify: `src/lib/guides/index.ts`
- Modify: `src/lib/glossary/terms/finance.ts`

**Step 1: Add reusable title clamping**

- Add `clampMetaTitle(title, maxLength = 60)` alongside the existing description helper.
- Keep behavior simple and deterministic: normalize whitespace, preserve short values, trim long values on word boundaries when possible, and avoid changing empty values.

**Step 2: Route metadata through the clamp helpers**

- Update guide metadata generation to clamp both title and description before returning metadata.
- Update glossary metadata generation the same way.
- Preserve existing absolute-title behavior so page-specific `seo.title` still wins.

**Step 3: Tighten the highest-ROI page copy**

- Rewrite the metadata for `liquidation-preference-guide`, `safe-guide`, `dcf-sensitivity-guide`, and `net-debt` so they are compelling before the clamp helper ever has to cut them.
- Keep `fbclid` untouched unless inspection shows a regression, because its current metadata is already within a safe range.

### Task 2: Add pillar relationship support

**Files:**
- Modify: `src/lib/guides/types.ts`
- Modify: `src/lib/glossary/types.ts`
- Modify: `src/app/guides/[slug]/page.tsx`
- Modify: `src/app/glossary/[slug]/page.tsx`

**Step 1: Extend content types minimally**

- Add optional guide fields to support pillar behavior without breaking existing data:
  - `pillarForGuideSlugs?: string[]`
  - `pillarForGlossarySlugs?: string[]`
  - `pillarForCalculatorSlugs?: string[]`
- Add optional glossary CTA fields so the ARR glossary page can explicitly push users toward the pillar:
  - `nextStepLabel?: string`
  - `nextStepHref?: string`
  These already exist in glossary SEO, so this task mainly depends on rendering and content wiring.

**Step 2: Render pillar context in templates**

- Add a guide-page module that shows “Part of this topic” when a page belongs to a pillar.
- Add a pillar module that lists related guides, calculators, and glossary pages in grouped sections, but only when the current guide declares them explicitly.
- Keep the UI compact and editorial, not auto-generated clutter.

### Task 3: Upgrade ARR into the first pillar

**Files:**
- Modify: `src/lib/guides/index.ts`
- Modify: `src/lib/glossary/terms/core.ts`

**Step 1: Reshape `arr-guide`**

- Rework the existing ARR guide so it becomes the canonical topic entry point rather than a narrow “bookings vs ARR” explainer.
- Cover the major subtopics up front:
  - ARR definition
  - ARR vs MRR
  - ARR vs bookings and cash
  - Net new ARR and waterfall logic
  - ARR growth and valuation context
- Add a summary block and a pillar relationship block that explicitly links to the related ARR spoke pages and calculators.

**Step 2: Mark the spoke pages**

- Add `hub` / pillar references from the related ARR guides back to `arr-guide`.
- Keep this scoped to the first validation set:
  - `arr-vs-mrr-guide`
  - `arr-growth-rate-guide`
  - `arr-waterfall-guide`
  - `net-new-arr-guide`
  - `bookings-vs-arr-guide`

**Step 3: Reposition `/glossary/arr`**

- Keep it as a concise definition page.
- Add a clearer next-step CTA into the full ARR guide so it behaves as a definition entry point, not a competing pillar.

### Task 4: Verify the pass

**Files:**
- Review: `git diff -- docs/plans/2026-05-25-metadata-arr-pillar.md src/lib/seo.ts src/app/guides/[slug]/page.tsx src/app/glossary/[slug]/page.tsx src/lib/guides/types.ts src/lib/glossary/types.ts src/lib/guides/index.ts src/lib/glossary/terms/finance.ts src/lib/glossary/terms/core.ts`

**Step 1: Run lint**

Run: `npm run lint`

Expected: successful exit with no lint errors.

**Step 2: Run production build**

Run: `npm run build`

Expected: successful exit with a generated production build and sitemap refresh.

**Step 3: Review the diff**

Run: `git diff -- docs/plans/2026-05-25-metadata-arr-pillar.md src/lib/seo.ts src/app/guides/[slug]/page.tsx src/app/glossary/[slug]/page.tsx src/lib/guides/types.ts src/lib/glossary/types.ts src/lib/guides/index.ts src/lib/glossary/terms/finance.ts src/lib/glossary/terms/core.ts`

Expected: the diff stays limited to metadata hardening plus the ARR validation set.
