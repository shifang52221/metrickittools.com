# Unit Economics Hub Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade `unit-economics-guide` into a stronger top-layer hub that connects ARR, CAC, LTV, payback, LTV:CAC, and the unit economics dashboard into one clearer decision path.

**Architecture:** Reuse the existing shared guide topic hub and glossary CTA patterns. Strengthen the content and metadata on `unit-economics-guide`, expose the major connected pages through a `topicHub`, and add a glossary CTA for `unit-economics` so broad definitional traffic can flow into the fuller decision guide.

**Tech Stack:** Next.js App Router, TypeScript content objects in `src/lib/guides/index.ts`, `src/lib/glossary/terms/saas.ts`, and Node test runner, ESLint, Next production build.

---

### Task 1: Record the approved design and plan

**Files:**
- Create: `docs/plans/2026-05-25-unit-economics-hub-design.md`
- Create: `docs/plans/2026-05-25-unit-economics-hub.md`

**Step 1: Save the design**

Write the approved hub design and implementation plan into `docs/plans`.

**Step 2: Commit the docs**

Run:

```bash
git add docs/plans/2026-05-25-unit-economics-hub-design.md docs/plans/2026-05-25-unit-economics-hub.md
git commit -m "docs: capture unit economics hub design and plan"
```

Expected: a docs-only commit that records the approved direction before production edits start.

### Task 2: Write the failing regression test for the hub

**Files:**
- Modify: `src/lib/content-clusters.test.ts`

**Step 1: Add one focused unit-economics hub test group**

Add tests that verify:

- `unit-economics-guide` exposes a topic hub with the key connected guides and calculators,
- `unit-economics` glossary points to `/guides/unit-economics-guide`.

**Step 2: Run the test to verify RED**

Run:

```bash
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: the new hub assertions fail because the upgraded relationships are not yet present.

### Task 3: Upgrade `unit-economics-guide` into the top-layer hub

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Refresh metadata and date**

Update the guide with:

- broader title and description,
- refreshed `updatedAt`,
- a stronger `summary`,
- a `topicHub` that lists the major connected pages, calculators, and glossary entries.

**Step 2: Rework the page toward decision flow**

Shift the sections toward:

- what unit economics is for,
- which metrics answer which question,
- how ARR, CAC, LTV, payback, and LTV:CAC fit together,
- the most common definition mismatches,
- where to go next depending on the user’s problem.

### Task 4: Upgrade the `unit-economics` glossary entry into a feeder page

**Files:**
- Modify: `src/lib/glossary/terms/saas.ts`

**Step 1: Add glossary SEO and CTA fields**

For `unit-economics`, add:

- refreshed `description` if needed,
- `seo.title`,
- `seo.description`,
- `heroNote`,
- `nextStepLabel`,
- `nextStepHref`.

Do not over-expand the glossary page body.

### Task 5: Verify templates need no new code

**Files:**
- Review: `src/app/guides/[slug]/page.tsx`
- Review: `src/app/glossary/[slug]/page.tsx`

**Step 1: Reuse the shared rendering**

Prefer zero template changes if the current ARR/CAC/LTV patterns already render this hub and glossary CTA correctly.

### Task 6: Run verification locally

**Files:**
- Verify: `src/lib/content-clusters.test.ts`
- Verify: `src/lib/seo.test.ts`
- Verify: `src/lib/guides/index.ts`
- Verify: `src/lib/glossary/terms/saas.ts`

**Step 1: Run targeted tests**

```bash
node --experimental-strip-types --test src\lib\content-clusters.test.ts
node --experimental-strip-types --test src\lib\seo.test.ts
```

Expected: passing output.

**Step 2: Run lint**

```bash
npm run lint
```

Expected: exit code 0.

**Step 3: Run production build**

```bash
npm run build
```

Expected: exit code 0 and regenerated `public/sitemap.xml` if timestamps affect the sitemap.

### Task 7: Commit the implementation

**Files:**
- Commit: `src/lib/content-clusters.test.ts`
- Commit: `src/lib/guides/index.ts`
- Commit: `src/lib/glossary/terms/saas.ts`
- Commit: `public/sitemap.xml`

**Step 1: Commit the production change set**

Run:

```bash
git add src/lib/content-clusters.test.ts src/lib/guides/index.ts src/lib/glossary/terms/saas.ts public/sitemap.xml
git commit -m "feat: build unit economics hub"
```

Expected: one implementation commit for the production-ready hub upgrade.
