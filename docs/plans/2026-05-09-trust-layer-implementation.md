# Trust Layer Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a first-pass trust and E-E-A-T layer across MetricKit with visible bylines, stronger publisher metadata, and dedicated methodology/editorial policy pages.

**Architecture:** Centralize publisher/editorial metadata in `siteConfig`, then reuse it across layout-level JSON-LD and the three page templates for guides, glossary entries, and calculators. Add static trust pages so publisher, methodology, and editorial process signals are visible both to users and crawlers.

**Tech Stack:** Next.js App Router, TypeScript, JSON-LD, ESLint

---

### Task 1: Expand site-level publisher metadata

**Files:**
- Modify: `src/lib/site.ts`

**Step 1: Add editorial and publisher fields**

Add brand-editorial metadata such as publisher name, legal/brand phrasing, review label, and links for about/methodology/editorial policy.

**Step 2: Keep values stable and generic**

Use the approved brand-editorial model instead of inventing personal bios.

### Task 2: Strengthen layout-level schema and footer trust links

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/site/SiteFooter.tsx`

**Step 1: Expand `Organization` and `WebSite` JSON-LD**

Add richer publisher details, same-site trust URLs, and clearer publisher ownership relationships.

**Step 2: Add trust-page links to the footer**

Link users and crawlers to `/about`, `/methodology`, and `/editorial-policy`.

### Task 3: Add visible bylines and richer page schema

**Files:**
- Modify: `src/app/guides/[slug]/page.tsx`
- Modify: `src/app/glossary/[slug]/page.tsx`
- Modify: `src/app/[category]/[slug]/page.tsx`

**Step 1: Add a shared trust strip pattern**

Render compact visible metadata for written by / reviewed by / updated near the top of each page type.

**Step 2: Enrich JSON-LD**

Update `Article`, `DefinedTerm`, and `SoftwareApplication` schema to include author/publisher/review context where appropriate.

### Task 4: Publish trust pages

**Files:**
- Modify: `src/app/about/page.tsx`
- Create: `src/app/methodology/page.tsx`
- Create: `src/app/editorial-policy/page.tsx`

**Step 1: Rework About**

Make About read like a publisher/about-the-site page rather than only a calculator explainer.

**Step 2: Add Methodology**

Explain formulas, assumptions, examples, sources, updates, and limitations.

**Step 3: Add Editorial Policy**

Explain drafting, review, corrections, conflicts, and update workflow.

### Task 5: Verify the pass

**Files:**
- Verify: `src/lib/site.ts`
- Verify: `src/app/layout.tsx`
- Verify: `src/components/site/SiteFooter.tsx`
- Verify: `src/app/guides/[slug]/page.tsx`
- Verify: `src/app/glossary/[slug]/page.tsx`
- Verify: `src/app/[category]/[slug]/page.tsx`
- Verify: `src/app/about/page.tsx`
- Verify: `src/app/methodology/page.tsx`
- Verify: `src/app/editorial-policy/page.tsx`

**Step 1: Run lint**

Run: `npm run lint`

Expected: exit code 0 with no new lint errors.

**Step 2: Run production build**

Run: `npm run build`

Expected: exit code 0 and successful static/app build output.

**Step 3: Review the diff**

Run: `git diff -- src/lib/site.ts src/app/layout.tsx src/components/site/SiteFooter.tsx src/app/guides/[slug]/page.tsx src/app/glossary/[slug]/page.tsx src/app/[category]/[slug]/page.tsx src/app/about/page.tsx src/app/methodology/page.tsx src/app/editorial-policy/page.tsx docs/plans/2026-05-09-trust-layer-design.md docs/plans/2026-05-09-trust-layer-implementation.md`

Expected: only trust-layer and documentation changes appear.
