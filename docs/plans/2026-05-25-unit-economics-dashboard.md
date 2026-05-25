# Unit Economics Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade `unit-economics-dashboard-guide` into a stronger diagnostic-layer page and attach it to `unit-economics-guide` as the practical “what to fix first” child page.

**Architecture:** Reuse the existing shared guide template support. Add `partOfGuideSlug: "unit-economics-guide"`, strengthen metadata and summary fields, and rework the dashboard content toward diagnostic flow rather than formula repetition.

**Tech Stack:** Next.js App Router, TypeScript content objects in `src/lib/guides/index.ts`, Node test runner, ESLint, Next production build.

---

### Task 1: Record the approved design and plan

**Files:**
- Create: `docs/plans/2026-05-25-unit-economics-dashboard-design.md`
- Create: `docs/plans/2026-05-25-unit-economics-dashboard.md`

**Step 1: Save the design**

Write the approved dashboard design and implementation plan into `docs/plans`.

**Step 2: Commit the docs**

Run:

```bash
git add docs/plans/2026-05-25-unit-economics-dashboard-design.md docs/plans/2026-05-25-unit-economics-dashboard.md
git commit -m "docs: capture unit economics dashboard design and plan"
```

Expected: a docs-only commit that records the approved direction before production edits start.

### Task 2: Write the failing regression test

**Files:**
- Modify: `src/lib/content-clusters.test.ts`

**Step 1: Add one focused dashboard test group**

Add tests that verify:

- `unit-economics-dashboard-guide` points back with `partOfGuideSlug: "unit-economics-guide"`,
- its metadata/structure exposes the stronger diagnostic positioning expected by this rollout.

**Step 2: Run the test to verify RED**

Run:

```bash
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: the new dashboard assertions fail because the page has not been upgraded yet.

### Task 3: Upgrade `unit-economics-dashboard-guide`

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Refresh metadata and relationship**

Update the guide with:

- broader diagnostic title and description,
- refreshed `updatedAt`,
- `partOfGuideSlug: "unit-economics-guide"`,
- stronger summary copy if needed.

**Step 2: Rework the page toward diagnosis flow**

Reframe the sections around:

- what the dashboard is for,
- the main failure zones (acquisition, retention, pricing, margin, cash timing),
- how to interpret combinations of weak signals,
- which metric page or calculator to open next.

### Task 4: Verify templates need no new code

**Files:**
- Review: `src/app/guides/[slug]/page.tsx`

**Step 1: Reuse the shared rendering**

Prefer zero template changes if `partOfGuideSlug` and the existing guide template already render the relationship correctly.

### Task 5: Run verification locally

**Files:**
- Verify: `src/lib/content-clusters.test.ts`
- Verify: `src/lib/seo.test.ts`
- Verify: `src/lib/guides/index.ts`

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

### Task 6: Commit the implementation

**Files:**
- Commit: `src/lib/content-clusters.test.ts`
- Commit: `src/lib/guides/index.ts`
- Commit: `public/sitemap.xml`

**Step 1: Commit the production change set**

Run:

```bash
git add src/lib/content-clusters.test.ts src/lib/guides/index.ts public/sitemap.xml
git commit -m "feat: strengthen unit economics dashboard"
```

Expected: one implementation commit for the production-ready dashboard upgrade.
