# SERP Opportunity Third Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen three existing top-20 SERP opportunity pages with decision-oriented content and visible freshness signals.

**Architecture:** Keep the existing content model and page templates. Add guide sections and dates in `src/lib/guides/index.ts`, add calculator metadata in its definition, and protect the handoff with content-cluster regression tests.

**Tech Stack:** Next.js App Router, TypeScript, Node test runner, ESLint, Next production build.

---

### Task 1: Write the failing regression test

**Files:**
- Modify: `src/lib/content-clusters.test.ts`

**Step 1: Assert the guide updates**

Check `interest-expense-guide` and `liquidation-preference-guide` for:

- `updatedAt: "2026-07-21"`
- a decision-oriented section mentioning the relevant next diagnostic
- a worked-example decision note

**Step 2: Assert the calculator handoff**

Read the calculator definition source and assert `trial-to-paid-calculator` exposes:

- `updatedAt: "2026-07-21"`
- `nextAction`
- guide and activation follow-up links

**Step 3: Run the focused test**

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: FAIL because the third-pass signals do not exist yet.

### Task 2: Implement the guide decision bridges

**Files:**
- Modify: `src/lib/guides/index.ts`

Add the new decision sections, dates, and example notes for the two guides.

### Task 3: Implement the calculator next action

**Files:**
- Modify: `src/lib/calculators/definitions.part5.ts`

Add the date and next-action handoff for `trial-to-paid-calculator`.

### Task 4: Run verification

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
node --experimental-strip-types --test src\lib\seo.test.ts
node --experimental-strip-types --test src\lib\indexing.test.ts
npm run lint
npm run build
```

### Task 5: Verify production

Check the three target pages return HTTP 200 and contain the new decision text/action. Confirm sitemap count remains unchanged.

### Task 6: Commit and push

Stage only the third-pass files and plan documents, leave the two old March plan files untouched, then commit and push `main`.
