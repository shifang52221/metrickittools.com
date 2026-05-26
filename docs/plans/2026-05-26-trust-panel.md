# Trust Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a reusable trust panel to calculator, guide, and glossary page templates so users can quickly see methodology, editorial policy, and contact/corrections paths.

**Architecture:** Build one shared presentational component that reads existing trust destinations from `siteConfig`, then wire it into the three primary content templates near their header areas. Use source-level regression tests first so we can verify the trust panel stays attached to the templates that matter most.

**Tech Stack:** TypeScript, React, Next.js App Router, existing page templates in `src/app`, source-driven node tests in `src/lib/content-clusters.test.ts`

---

### Task 1: Add Regression Coverage For Trust Panel Adoption

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add a focused test that reads the following files as source text:

- `src/app/[category]/[slug]/page.tsx`
- `src/app/guides/[slug]/page.tsx`
- `src/app/glossary/[slug]/page.tsx`

Assert that each file contains:

- `TrustPanel`
- `siteConfig.methodologyPath`
- `siteConfig.editorialPolicyPath`
- `siteConfig.contactPath`

Also assert the three page templates still contain their existing visible ownership/freshness strings:

- `Written by`
- `Reviewed by`
- `Updated`

**Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL because no reusable trust panel is wired into the three templates yet.

**Step 3: Write minimal implementation**

No production change yet.

**Step 4: Re-run the test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only because the trust panel integration is missing.

**Step 5: Commit**

Do not commit yet. This is the red phase.

### Task 2: Build The Reusable Trust Panel Component

**Files:**
- Create: `src/components/site/TrustPanel.tsx`
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Create a shared `TrustPanel` component that:

- accepts no complex business logic unless needed
- uses `Link` for:
  - `siteConfig.methodologyPath`
  - `siteConfig.editorialPolicyPath`
  - `siteConfig.contactPath`
- includes concise copy that explains:
  - how the page is calculated or maintained
  - how it is reviewed
  - where to send questions or corrections

Keep styling aligned with the current site language:

- rounded card
- border
- neutral background
- compact text

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: still FAIL because the component exists but is not yet wired into all three templates.

**Step 3: Commit**

Do not commit yet.

### Task 3: Add Trust Panel To Calculator, Guide, And Glossary Templates

**Files:**
- Modify: `src/app/[category]/[slug]/page.tsx`
- Modify: `src/app/guides/[slug]/page.tsx`
- Modify: `src/app/glossary/[slug]/page.tsx`
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Import and render `TrustPanel` in:

- calculator page: after the metadata strip and before the calculator client
- guide page: after the header/summary region and before deeper content blocks
- glossary page: after the metadata / hero CTA area and before the main content grid

Pass any minimal contextual variant only if it materially improves the copy. Prefer a single default component if possible.

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS

**Step 3: Run related regression tests**

Run: `node --experimental-strip-types --test src\lib\seo.test.ts`

Expected: PASS

**Step 4: Run lint**

Run: `npm run lint`

Expected: PASS

**Step 5: Commit**

Stage only the intended files after verification.

### Task 4: Final Build And Review

**Files:**
- Test: build output

**Step 1: Run production build**

Run: `npm run build`

Expected: PASS

**Step 2: Inspect diff**

Run: `git diff -- src/components/site/TrustPanel.tsx src/app/[category]/[slug]/page.tsx src/app/guides/[slug]/page.tsx src/app/glossary/[slug]/page.tsx src/lib/content-clusters.test.ts`

Expected: Only the intended trust-panel changes.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: add page-level trust panel"
```
