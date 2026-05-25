# Glossary CTA Reinforcement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add explicit next-step SEO guidance to a short list of high-value glossary pages so quick-definition traffic is routed into the strongest full guides.

**Architecture:** The change stays inside the existing glossary content model. We will extend term data only, using already-supported `seo.heroNote`, `seo.nextStepLabel`, and `seo.nextStepHref` fields, then verify behavior with focused cluster tests.

**Tech Stack:** TypeScript, Node test runner, existing glossary content seeds in `src/lib/glossary/terms/*.ts`

---

### Task 1: Lock The Expected CTA Map In Tests

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add a test that checks these glossary terms:

- `ltv-to-cac`
- `cac-payback-period`
- `customer-lifetime`
- `net-new-arr`
- `arr-waterfall`
- `churn-rate`
- `cohorted-ltv`
- `logo-churn`

For each term, assert:

- the term exists
- `seo.nextStepLabel` exists
- `seo.nextStepHref` matches the expected guide
- `seo.heroNote` includes language that positions the page as a fast definition and points to the full guide

**Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL because the priority glossary terms currently do not expose `seo` CTA data.

**Step 3: Write minimal implementation**

No production change in this task.

**Step 4: Run test to verify it still fails for the expected reason**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only on missing or mismatched CTA fields.

**Step 5: Commit**

Do not commit yet. This task prepares the red phase.

### Task 2: Add Priority Glossary CTA Metadata

**Files:**
- Modify: `src/lib/glossary/terms/saas.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the minimal implementation**

Add `seo` objects to the eight priority terms with:

- concise SERP-safe title/description where appropriate
- `heroNote` that frames the page as the fast definition
- `nextStepLabel` such as `Read the full ... guide`
- `nextStepHref` pointing to the mapped guide

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS

**Step 3: Check for regressions in related SEO logic**

Run: `node --experimental-strip-types --test src\lib\seo.test.ts`

Expected: PASS

**Step 4: Run lint**

Run: `npm run lint`

Expected: PASS

**Step 5: Commit**

Stage only the tested files for this task after verification.

### Task 3: Rebuild Static Artifacts And Final Verification

**Files:**
- Modify: `public/sitemap.xml` (generated)
- Test: build output

**Step 1: Run production build**

Run: `npm run build`

Expected: PASS and regenerated sitemap if relevant metadata changes affect lastmod output.

**Step 2: Inspect diff**

Run: `git diff -- src/lib/content-clusters.test.ts src/lib/glossary/terms/saas.ts public/sitemap.xml`

Expected: Only the expected CTA metadata, test additions, and generated sitemap changes.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: reinforce glossary next-step guidance"
```
