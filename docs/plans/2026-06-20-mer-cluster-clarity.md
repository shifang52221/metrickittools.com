# MER Cluster Clarity Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clarify the `MER` search cluster so the glossary term, guide, and calculator work as a stronger definition -> interpretation -> action chain.

**Architecture:** Keep the current MER cluster structure, but sharpen each layer’s role. The glossary stays a fast definition page, the guide becomes a stronger interpretation page, and the calculator becomes a clearer decision page that points users toward marginal ROAS and incrementality when blended MER alone is not enough.

**Tech Stack:** TypeScript, React, Next.js App Router, source-defined glossary terms in `src/lib/glossary/terms/paidAds.ts`, guide content in `src/lib/guides/index.ts`, calculator definitions in `src/lib/calculators/definitions.part3.ts`, source-driven tests in `src/lib/content-clusters.test.ts`

---

### Task 1: Add Regression Coverage For MER Cluster Role Separation

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the focused test**

Add a source-driven test that verifies:

- the `mer` glossary entry points to the full guide
- `mer-guide` points to `mer-calculator`
- `mer-guide` references deeper next-step concepts like marginal ROAS or incrementality
- `mer-calculator` includes decision-oriented benchmark or next-step language

**Step 2: Run the test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS if the current source already satisfies the minimum role boundary, or FAIL only on the missing clarity requirements once the expectations are tightened.

**Step 3: Refine the expectation if needed**

Keep the assertions narrow and cluster-specific. Do not broaden them into generic paid ads coverage.

### Task 2: Strengthen The MER Glossary Entry

**Files:**
- Modify: `src/lib/glossary/terms/paidAds.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Update the glossary entry**

Sharpen the `mer` glossary term so it more clearly acts as:

- fast definition
- quick difference from ROAS
- handoff to the full guide

Prefer:

- stronger description wording
- a clearer next-step framing if supported by the glossary type
- role separation from the full guide

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS or narrower failures in guide/calculator files only.

### Task 3: Strengthen The MER Guide As The Interpretation Layer

**Files:**
- Modify: `src/lib/guides/index.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Update `mer-guide`**

Refine the guide so it:

- states when MER is useful
- states when MER becomes insufficient
- explicitly pushes the reader toward marginal ROAS or incrementality for scaling decisions
- upgrades the calculator example from a passive example into a more scenario-based action

Keep the guide focused. Do not turn it into a giant paid ads hub in this pass.

**Step 2: Run the focused test**

Run: `node --experimental-strip-types --test src\lib\content-clusters.test.ts`

Expected: PASS or narrower failures in calculator content only.

### Task 4: Strengthen The MER Calculator As The Action Layer

**Files:**
- Modify: `src/lib/calculators/definitions.part3.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Update `mer-calculator` copy and guidance**

Improve:

- intro language so the page feels like a business decision page
- benchmark language so the page frames MER as a blended signal, not a scale decision by itself
- next-step interpretation so the reader is pushed toward marginal ROAS or incrementality when needed

If appropriate, add a calculator-level `nextAction` block that points to:

- `mer-guide`
- `marginal-roas-guide`
- `incrementality-guide`

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
git diff -- src/lib/glossary/terms/paidAds.ts src/lib/guides/index.ts src/lib/calculators/definitions.part3.ts src/lib/content-clusters.test.ts docs/plans/2026-06-20-mer-cluster-clarity-design.md docs/plans/2026-06-20-mer-cluster-clarity.md
```

Expected: Only the intended MER cluster changes.

**Step 2: Commit**

Suggested message:

```bash
git commit -m "feat: clarify mer cluster roles"
```
