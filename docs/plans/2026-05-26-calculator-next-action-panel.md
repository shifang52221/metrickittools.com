# Calculator Next Action Panel Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a reusable next-action panel to the four priority calculator pages so users can move from result to decision more naturally.

**Architecture:** Extend the calculator definition model with an optional `nextAction` payload, backfill only the four recently strengthened priority calculators, and render a shared `NextActionPanel` in the calculator page client when the payload exists. Keep the rollout narrow and default-safe so untouched calculators do not change.

**Tech Stack:** TypeScript, React, Next.js App Router, calculator definitions in `src/lib/calculators/definitions.part*.ts`, calculator UI in `src/components/calculators/CalculatorPageClient.tsx`, source-driven node tests in `src/lib/content-clusters.test.ts`

---

### Task 1: Add Regression Coverage For Priority Calculator Next Actions

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add a focused source-driven test that verifies:

- the calculator page client uses `NextActionPanel`
- the following calculators expose `nextAction`:
  - `unit-economics-calculator`
  - `cohort-ltv-forecast-calculator`
  - `ltv-to-cac-calculator`
  - `cac-payback-period-calculator`

The test can inspect:

- `src/components/calculators/CalculatorPageClient.tsx`
- `src/lib/calculators/definitions.part1.ts`
- `src/lib/calculators/definitions.part2.ts`
- `src/lib/calculators/definitions.part3.ts`

Also assert that the calculator client still contains the existing result heading `Result`.

**Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL because no next-action panel or calculator-level `nextAction` fields exist yet.

**Step 3: Write minimal implementation**

No production change yet.

**Step 4: Re-run the test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL only for missing next-action integration.

**Step 5: Commit**

Do not commit yet. This is the red phase.

### Task 2: Add Shared Next Action Component And Data Model Support

**Files:**
- Create: `src/components/calculators/NextActionPanel.tsx`
- Modify: `src/lib/calculators/types.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Add an optional `nextAction` field to `CalculatorDefinition`.

Keep the payload small, for example:

- `title`
- `body`
- `primaryLabel`
- `primaryHref`
- `secondaryLabel?`
- `secondaryHref?`

Create a shared `NextActionPanel` component that renders:

- the title
- the body copy
- one primary CTA
- one optional secondary CTA

Keep styling consistent with current calculator support cards.

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: still FAIL because the priority calculators and client template are not wired yet.

**Step 3: Commit**

Do not commit yet.

### Task 3: Backfill Priority Calculators And Render The Panel

**Files:**
- Modify: `src/lib/calculators/definitions.part1.ts`
- Modify: `src/lib/calculators/definitions.part2.ts`
- Modify: `src/lib/calculators/definitions.part3.ts`
- Modify: `src/components/calculators/CalculatorPageClient.tsx`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write minimal implementation**

Backfill `nextAction` on:

- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`
- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`

The copy should stay concise and action-oriented:

- explain what the result usually means
- point to the best next guide
- optionally point to one adjacent calculator or definition path

Then render `NextActionPanel` in `CalculatorPageClient.tsx` only when `calc.nextAction` exists.

Place it close to the result area, before the long supporting sections.

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

Run: `git diff -- src/components/calculators/NextActionPanel.tsx src/components/calculators/CalculatorPageClient.tsx src/lib/calculators/types.ts src/lib/calculators/definitions.part1.ts src/lib/calculators/definitions.part2.ts src/lib/calculators/definitions.part3.ts src/lib/content-clusters.test.ts`

Expected: Only the intended next-action changes.

**Step 3: Commit**

Suggested message:

```bash
git commit -m "feat: add calculator next actions"
```
