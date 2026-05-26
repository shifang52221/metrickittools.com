# Second Calculator Guidance Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deepen interpretation guidance on the LTV:CAC and CAC payback calculators so they support better decisions after the user gets a result.

**Architecture:** The change stays inside existing calculator definition content. We will strengthen `guide` content for two calculators and lock the expectations with focused regression tests.

**Tech Stack:** TypeScript, calculator definitions in `src/lib/calculators/definitions.part1.ts`, Node test runner

---

### Task 1: Add Regression Coverage For Deeper Interpretation

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add a focused test for:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`

Assert that each calculator:

- exists in the definition source
- exposes `guide`
- exposes at least two interpretation sections

Also assert that the content includes decision-oriented language such as:

- payback
- risk or cash efficiency
- what to inspect next

**Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL because `ltv-to-cac-calculator` currently has only a thin interpretation block.

**Step 3: Write minimal implementation**

No production change yet.

**Step 4: Re-run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only for the missing interpretation depth.

**Step 5: Commit**

Do not commit yet. This is the red phase.

### Task 2: Deepen LTV:CAC And CAC Payback Guidance

**Files:**
- Modify: `src/lib/calculators/definitions.part1.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

For `ltv-to-cac-calculator`:

- expand `guide` to at least two sections
- explain ratio + payback together
- explain false confidence from blended numbers or mismatched definitions

For `cac-payback-period-calculator`:

- deepen the interpretation section
- make risk bands and next investigations more explicit
- clarify when long payback can still be acceptable

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

Stage only the intended definition, test, and plan files after verification.

### Task 3: Final Build And Review

**Files:**
- Test: build output

**Step 1: Run production build**

Run: `npm run build`

Expected: PASS

**Step 2: Inspect diff**

Run: `git diff -- src/lib/content-clusters.test.ts src/lib/calculators/definitions.part1.ts`

Expected: Only the intended interpretation-depth enhancements.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: deepen calculator interpretation guidance"
```
