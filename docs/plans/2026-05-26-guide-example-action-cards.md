# Guide Example Action Cards Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the four priority guide pages by turning their calculator examples into clearer scenario-based action cards.

**Architecture:** Extend the guide example model with one lightweight action-oriented field, backfill only the four priority guides, and upgrade the existing `Try it in a calculator` UI so users understand why the scenario matters and that the calculator opens prefilled.

**Tech Stack:** TypeScript, React, Next.js App Router, guide content in `src/lib/guides/index.ts`, guide type definitions in `src/lib/guides/types.ts`, guide template in `src/app/guides/[slug]/page.tsx`, source-driven node tests in `src/lib/content-clusters.test.ts`

---

### Task 1: Add Regression Coverage For Priority Guide Example Actions

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add a focused source-driven test that verifies:

- the guide page template contains stronger calculator-action phrasing for examples
- the following guides expose example-level decision notes:
  - `unit-economics-guide`
  - `ltv-cac-guide`
  - `cac-payback-guide`
  - `cohort-ltv-forecast-guide`

The test can inspect:

- `src/app/guides/[slug]/page.tsx`
- `src/lib/guides/index.ts`

Also assert the template still includes `Try it in a calculator`.

**Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL because the stronger example-action pattern is not wired yet.

**Step 3: Write minimal implementation**

No production change yet.

**Step 4: Re-run the test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only for missing guide example action content.

**Step 5: Commit**

Do not commit yet. This is the red phase.

### Task 2: Extend Guide Example Data And Upgrade The Guide Template

**Files:**
- Modify: `src/lib/guides/types.ts`
- Modify: `src/app/guides/[slug]/page.tsx`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Extend `Guide.examples` entries with:

- `decisionNote?: string`

Then update the `Try it in a calculator` card UI so it:

- keeps the calculator title
- keeps the example label
- shows `decisionNote` when available
- adds clearer action phrasing such as:
  - `Opens the calculator with this scenario`

Keep the change visually consistent with the current guide card language.

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: still FAIL because the four priority guides are not yet backfilled.

**Step 3: Commit**

Do not commit yet.

### Task 3: Backfill The Four Priority Guides

**Files:**
- Modify: `src/lib/guides/index.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Add `decisionNote` to the example entries for:

- `unit-economics-guide`
- `ltv-cac-guide`
- `cac-payback-guide`
- `cohort-ltv-forecast-guide`

Each note should:

- explain what question the scenario helps answer
- stay concise
- sound like operator guidance, not generic CTA copy

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

Run: `git diff -- src/lib/guides/types.ts src/lib/guides/index.ts src/app/guides/[slug]/page.tsx src/lib/content-clusters.test.ts`

Expected: Only the intended guide example action-card changes.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: strengthen guide example actions"
```
