# MRR Forecast Cluster Clarity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clarify the `MRR forecast` search cluster so the glossary term, guide, and calculator form a stronger definition -> interpretation -> planning chain.

**Architecture:** Keep the existing `MRR` cluster structure, but sharpen each layer's role. The glossary stays a fast definition page, the guide becomes a stronger interpretation page for monthly bridge planning, and the calculator becomes a clearer action page that points users toward retention and waterfall diagnostics when the forecast alone is not enough.

**Tech Stack:** TypeScript, React, Next.js App Router, source-defined glossary terms in `src/lib/glossary/terms/core.ts`, guide content in `src/lib/guides/index.ts`, calculator definitions in `src/lib/calculators/definitions.part3.ts`, source-driven tests in `src/lib/content-clusters.test.ts`

---

### Task 1: Add Regression Coverage For MRR Forecast Cluster Role Separation

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the focused test**

Add a source-driven test that verifies:

- the `mrr` glossary entry points to the forecasting guide
- `mrr-forecast-guide` points to `mrr-forecast-calculator`
- `mrr-forecast-guide` references retention-aware next-step concepts like `nrr`, `grr`, or `mrr-waterfall`
- `mrr-forecast-calculator` includes planning-oriented benchmark or next-step language

**Step 2: Run the test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: FAIL on the new, tightened expectations before content updates are made.

**Step 3: Refine the expectation if needed**

Keep the assertions narrow and cluster-specific. Do not broaden them into generic SaaS cluster coverage.

### Task 2: Strengthen The MRR Glossary Entry

**Files:**
- Modify: `src/lib/glossary/terms/core.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Update the glossary entry**

Sharpen the `mrr` glossary term so it more clearly acts as:

- fast definition
- quick explanation of recurring components
- handoff to the forecasting guide for planning and bridge modeling

Prefer:

- stronger description wording
- a clearer next-step framing if supported by the glossary type
- role separation from the full forecasting guide

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS or narrower failures in guide/calculator content only.

### Task 3: Strengthen The MRR Forecast Guide As The Interpretation Layer

**Files:**
- Modify: `src/lib/guides/index.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Update `mrr-forecast-guide`**

Refine the guide so it:

- states what the monthly bridge model is good for
- explains which assumptions deserve the most scrutiny
- explicitly states when retention and cohort behavior matter more than a simple bridge
- pushes the reader toward NRR, GRR, or waterfall diagnostics as the next step
- upgrades the calculator example from a passive example into a clearer planning scenario

Keep the guide focused. Do not turn it into a giant ARR/MRR hub in this pass.

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS or narrower failures in calculator content only.

### Task 4: Strengthen The MRR Forecast Calculator As The Planning Layer

**Files:**
- Modify: `src/lib/calculators/definitions.part3.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Update `mrr-forecast-calculator` copy and guidance**

Improve:

- intro language so the page feels like a planning and diagnosis page
- benchmark language so the page frames the projection as assumption-sensitive, not certainty
- next-step interpretation so the reader is pushed toward NRR, GRR, or waterfall analysis when needed

If appropriate, add a calculator-level `nextAction` block that points to:

- `mrr-forecast-guide`
- `mrr-waterfall-guide`
- `nrr-guide`

Keep the change narrow to this calculator only.

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS

### Task 5: Run Related Regression Checks

**Files:**
- Test only

**Step 1: Run related source tests**

Run: `node --experimental-strip-types --test src\lib\seo.test.ts`

Expected: PASS

**Step 2: Run lint**

Run: `npm run lint`

Expected: PASS

**Step 3: Run production build**

Run: `npm run build`

Expected: PASS

### Task 6: Review And Commit

**Files:**
- Review diffs only

**Step 1: Inspect diff**

Run:

```bash
git diff -- src/lib/glossary/terms/core.ts src/lib/guides/index.ts src/lib/calculators/definitions.part3.ts src/lib/content-clusters.test.ts docs/plans/2026-06-20-mrr-forecast-cluster-clarity-design.md docs/plans/2026-06-20-mrr-forecast-cluster-clarity.md
```

Expected: Only the intended MRR forecast cluster changes.

**Step 2: Commit**

Suggested message:

```bash
git commit -m "feat: clarify mrr forecast cluster roles"
```
