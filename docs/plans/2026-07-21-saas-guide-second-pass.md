# SaaS Guide Second-Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deepen the existing ARR, MRR forecast, CAC, and CAC payback guides so they convert glossary and hub discovery into useful calculator-led decisions.

**Architecture:** Reuse the existing `Guide` content model, guide page example renderer, and existing calculator routes. Update only four guide definitions and regression tests.

**Tech Stack:** Next.js App Router, TypeScript content definitions, Node test runner, ESLint, Next production build.

---

### Task 1: Add failing guide-quality tests

**Files:**
- Modify: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Assert that ARR, MRR forecast, CAC, and CAC payback guides:

- use `updatedAt: "2026-07-21"`
- expose an `examples` entry
- reference the expected calculator
- include `decisionNote`
- contain explicit next-decision language

**Step 2: Run the focused test**

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: FAIL because the four guide definitions do not yet share the complete handoff structure.

### Task 2: Update ARR and MRR forecast guides

**Files:**
- Modify: `src/lib/guides/index.ts`

Add calculator examples and decision sections:

- ARR calculator example plus waterfall/bookings next step.
- MRR forecast calculator example plus NRR/GRR/waterfall warning.

Set both update dates to `2026-07-21`.

### Task 3: Update CAC and CAC payback guides

**Files:**
- Modify: `src/lib/guides/index.ts`

Add calculator examples and decision sections:

- CAC calculator example plus payback/LTV:CAC handoff.
- CAC payback calculator example plus cash-timing versus LTV/break-even warning.

Set both update dates to `2026-07-21`.

### Task 4: Verify

Run:

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
node --experimental-strip-types --test src\lib\hub-content.test.ts
node --experimental-strip-types --test src\lib\indexing.test.ts
node --experimental-strip-types --test src\lib\seo.test.ts
npm run lint
npm run build
```

Expected: all pass; sitemap remains at 377 URLs.

### Task 5: Commit, push, and live verify

```powershell
git add src/lib/content-clusters.test.ts src/lib/guides/index.ts docs/plans/2026-07-21-saas-guide-second-pass-design.md docs/plans/2026-07-21-saas-guide-second-pass.md public/sitemap.xml
git commit -m "feat: deepen saas guide decision paths"
git push origin main
```

Check `/guides/arr-guide`, `/guides/mrr-forecast-guide`, `/guides/cac-guide`, and `/guides/cac-payback-guide` for HTTP 200 and visible example/next-step sections.
