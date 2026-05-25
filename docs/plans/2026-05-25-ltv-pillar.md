# LTV Pillar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the existing LTV content set into a stronger topic pillar centered on `ltv-guide`, with direct spokes and a glossary CTA that route users into the fuller lifetime-value workflow.

**Architecture:** Reuse the same shared guide and glossary template support already used for ARR and CAC. Strengthen `ltv-guide` as the parent page, attach direct LTV spokes with `partOfGuideSlug`, surface the CAC bridge page in the topic hub, and add a glossary CTA for the fast-definition entry.

**Tech Stack:** Next.js App Router, TypeScript content objects in `src/lib/guides/index.ts` and `src/lib/glossary/terms/core.ts`, Node test runner, ESLint, Next production build.

---

### Task 1: Record the approved design and plan

**Files:**
- Create: `docs/plans/2026-05-25-ltv-pillar-design.md`
- Create: `docs/plans/2026-05-25-ltv-pillar.md`

**Step 1: Save the design**

Write the approved LTV pillar design into `docs/plans` so the structure and constraints are preserved.

**Step 2: Commit the docs**

Run:

```bash
git add docs/plans/2026-05-25-ltv-pillar-design.md docs/plans/2026-05-25-ltv-pillar.md
git commit -m "docs: capture LTV pillar design and plan"
```

Expected: a docs-only commit that records the approved direction before content changes start.

### Task 2: Write the failing LTV cluster regression test

**Files:**
- Modify: `src/lib/content-clusters.test.ts`

**Step 1: Add one focused failing test group**

Add tests that verify:

- `ltv-guide` exposes a topic hub,
- direct spokes point back with `partOfGuideSlug: "ltv-guide"`,
- glossary `ltv` routes to `/guides/ltv-guide`.

**Step 2: Run the test to verify RED**

Run:

```bash
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: the LTV assertions fail because the cluster relationship is not fully present yet.

### Task 3: Upgrade `ltv-guide` into the parent topic page

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Refresh parent metadata and date**

Update the `ltv-guide` object with:

- stronger broad-intent title and description,
- refreshed `updatedAt`,
- a `summary` block,
- a `topicHub` block listing the strongest LTV spokes, glossary pages, and calculators.

**Step 2: Rework the parent page toward decision flow**

Make the sections guide users through:

- what LTV actually measures,
- when the shortcut formula is acceptable,
- how gross margin and churn assumptions change the number,
- when to branch into customer lifetime or cohort modeling,
- how to connect LTV back to CAC and payback.

### Task 4: Attach direct LTV spokes back to the parent

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Update the strongest direct spokes**

Add `partOfGuideSlug: "ltv-guide"` and refresh `updatedAt` on:

- `ltv-sensitivity-guide`
- `customer-lifetime-guide`
- `cohort-ltv-forecast-guide`

**Step 2: Preserve the CAC bridge page rule**

Do not move `ltv-cac-guide` away from the CAC cluster’s single-parent relationship if that would break the existing structure. Instead, surface it inside the LTV parent `topicHub` as the main bridge page.

### Task 5: Upgrade the LTV glossary entry into a better feeder page

**Files:**
- Modify: `src/lib/glossary/terms/core.ts`

**Step 1: Add LTV glossary CTA fields**

For the `ltv` term, add:

- stronger `seo.title`,
- stronger `seo.description`,
- `heroNote`,
- `nextStepLabel`,
- `nextStepHref`,
- refreshed `updatedAt`.

**Step 2: Keep glossary concise**

Do not turn the glossary page into a second guide. It should stay fast and definitional.

### Task 6: Verify templates need no new code

**Files:**
- Review: `src/app/guides/[slug]/page.tsx`
- Review: `src/app/glossary/[slug]/page.tsx`

**Step 1: Reuse the shared rendering**

Prefer zero template edits if the current ARR/CAC structure already renders the new LTV fields correctly.

### Task 7: Run verification locally

**Files:**
- Verify: `src/lib/content-clusters.test.ts`
- Verify: `src/lib/seo.test.ts`
- Verify: `src/lib/guides/index.ts`
- Verify: `src/lib/glossary/terms/core.ts`

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

### Task 8: Commit the implementation

**Files:**
- Commit: `src/lib/content-clusters.test.ts`
- Commit: `src/lib/guides/index.ts`
- Commit: `src/lib/glossary/terms/core.ts`
- Commit: `public/sitemap.xml`

**Step 1: Commit the production change set**

Run:

```bash
git add src/lib/content-clusters.test.ts src/lib/guides/index.ts src/lib/glossary/terms/core.ts public/sitemap.xml
git commit -m "feat: build LTV topic pillar"
```

Expected: one implementation commit for the production-ready LTV cluster upgrade.
