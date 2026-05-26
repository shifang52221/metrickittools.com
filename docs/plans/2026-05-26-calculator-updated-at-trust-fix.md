# Calculator UpdatedAt Trust Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make priority calculator pages show and publish page-level freshness dates instead of one stale global calculator date.

**Architecture:** Extend the calculator definition type with optional `updatedAt`, backfill the most recently improved calculators, and update the calculator page to prefer calculator-level freshness while preserving the global fallback for untouched pages.

**Tech Stack:** TypeScript, calculator definitions in `src/lib/calculators/definitions.part*.ts`, Next.js app route in `src/app/[category]/[slug]/page.tsx`

---

### Task 1: Add Regression Coverage For Calculator Freshness

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add focused assertions that the following calculators expose `updatedAt: "2026-05-26"`:

- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`
- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`

Because calculator definitions are currently source-driven in this test file, the test can inspect the relevant definition source files directly.

**Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL because calculator-level `updatedAt` is not defined yet.

**Step 3: Write minimal implementation**

No production change yet.

**Step 4: Re-run the test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only for missing calculator freshness fields.

**Step 5: Commit**

Do not commit yet. This is the red phase.

### Task 2: Add Calculator-Level UpdatedAt Support

**Files:**
- Modify: `src/lib/calculators/types.ts`
- Modify: `src/lib/calculators/definitions.part1.ts`
- Modify: `src/lib/calculators/definitions.part2.ts`
- Modify: `src/lib/calculators/definitions.part3.ts`
- Modify: `src/app/[category]/[slug]/page.tsx`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Add optional `updatedAt?: string` to the calculator definition type.

Backfill `updatedAt: "2026-05-26"` on:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`
- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`

Update the calculator page route so freshness resolves as:

```ts
const calculatorReviewDate = calc.updatedAt ?? siteConfig.contentReviewDate;
```

This value should drive both:

- visible `Updated ...`
- structured data `dateModified`

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

### Task 3: Final Build And Review

**Files:**
- Test: build output

**Step 1: Run production build**

Run: `npm run build`

Expected: PASS

**Step 2: Inspect diff**

Run: `git diff -- src/lib/calculators/types.ts src/lib/calculators/definitions.part1.ts src/lib/calculators/definitions.part2.ts src/lib/calculators/definitions.part3.ts src/app/[category]/[slug]/page.tsx src/lib/content-clusters.test.ts`

Expected: Only the intended freshness-signal changes.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: align calculator freshness signals"
```
