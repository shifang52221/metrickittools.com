# Core SaaS Glossary Recovery Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Strengthen the ARR, MRR, and CAC glossary pages that have the most GSC impressions but no clicks.

**Architecture:** Reuse the existing glossary term data model and page module renderer. Do not add routes or templates; update only the three high-signal glossary entries and regression tests.

**Tech Stack:** Next.js App Router, TypeScript glossary content definitions, Node test runner, ESLint, Next production build.

---

### Task 1: Add failing tests

**Files:**
- Modify: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Assert that ARR, MRR, and CAC each expose:

- `updatedAt: "2026-07-21"`
- custom `modules`
- decision language for formula, comparison, misuse, and next-step interpretation

**Step 2: Run the test**

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: FAIL because the current glossary entries do not yet expose custom modules or the July 21 update date.

### Task 2: Upgrade ARR glossary

**Files:**
- Modify: `src/lib/glossary/terms/core.ts`

**Step 1: Update ARR**

Add stronger body and modules covering:

- `MRR x 12`
- ARR vs MRR
- ARR vs bookings
- cash and revenue recognition confusion
- ARR waterfall and net new ARR as next steps

### Task 3: Upgrade MRR glossary

**Files:**
- Modify: `src/lib/glossary/terms/core.ts`

**Step 1: Update MRR**

Add stronger body and modules covering:

- recurring monthly subscription revenue
- new, expansion, contraction, churned MRR
- cash collections confusion
- MRR waterfall and forecast next steps

### Task 4: Upgrade CAC glossary

**Files:**
- Modify: `src/lib/glossary/terms/core.ts`

**Step 1: Update CAC**

Add stronger body and modules covering:

- acquisition spend divided by new paying customers
- paid CAC vs fully-loaded CAC
- customer denominator mistakes
- payback, gross margin, and LTV:CAC next steps

### Task 5: Verify

Run:

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
node --experimental-strip-types --test src\lib\indexing.test.ts
node --experimental-strip-types --test src\lib\seo.test.ts
npm run lint
npm run build
```

Expected: all pass and sitemap stays contracted.

### Task 6: Commit, push, and live check

Commit:

```powershell
git add src/lib/content-clusters.test.ts src/lib/glossary/terms/core.ts docs/plans/2026-07-21-core-saas-glossary-recovery-design.md docs/plans/2026-07-21-core-saas-glossary-recovery.md public/sitemap.xml
git commit -m "feat: deepen core saas glossary pages"
git push origin main
```

Live check:

- `/glossary/arr`
- `/glossary/mrr`
- `/glossary/cac`

Confirm HTTP 200, updated date, and visible decision modules.
