# Priority Calculator Usability Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve result interpretation and practical decision guidance on the most important SaaS metrics calculators without changing the shared calculator template.

**Architecture:** The work stays inside calculator definitions. We will deepen existing `seo` and `guide` content for a small set of calculators, then verify the presence of interpretation-focused sections with tests.

**Tech Stack:** TypeScript, calculator definitions in `src/lib/calculators/definitions.part*.ts`, Node test runner

---

### Task 1: Add Regression Coverage For Priority Calculator Guidance

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add a focused test for:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`
- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`

For each calculator, assert:

- the calculator exists
- `seo.intro` exists and is non-empty
- `seo.pitfalls` exists and is non-empty
- `guide` exists and is non-empty

For calculators where ranges matter, assert that `seo.benchmarks` exists and is non-empty:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`
- `unit-economics-calculator`

**Step 2: Run test to verify it fails or proves gaps**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL if any priority calculator lacks the required guidance depth.

**Step 3: Write minimal implementation**

No production change in this task.

**Step 4: Re-run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only for the missing guidance content.

**Step 5: Commit**

Do not commit yet. This is the red phase.

### Task 2: Deepen Guidance For Priority Calculators

**Files:**
- Modify: `src/lib/calculators/definitions.part1.ts`
- Modify: `src/lib/calculators/definitions.part2.ts`
- Modify: `src/lib/calculators/definitions.part3.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Enhance the four target calculators using existing fields:

- strengthen `seo.intro`
- add or deepen `seo.benchmarks`
- sharpen `seo.pitfalls`
- add or deepen `guide` interpretation blocks

Keep the copy specific to decisions, not generic metric descriptions.

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

Stage only the intended calculator definition and test files after verification.

### Task 3: Final Build And Review

**Files:**
- Test: build output

**Step 1: Run production build**

Run: `npm run build`

Expected: PASS

**Step 2: Inspect diff**

Run: `git diff -- src/lib/content-clusters.test.ts src/lib/calculators/definitions.part1.ts src/lib/calculators/definitions.part2.ts src/lib/calculators/definitions.part3.ts`

Expected: Only the targeted interpretation and guidance enhancements.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: strengthen priority calculator guidance"
```
