# CAC Pillar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the existing CAC content cluster into a clear topic pillar centered on `cac-guide`, with spoke guides and glossary entries explicitly routing back to the parent guide.

**Architecture:** Reuse the shared guide and glossary template support already added for ARR. Expand `cac-guide` into a stronger parent page, attach relevant CAC spoke guides with `partOfGuideSlug`, and add a glossary CTA so quick-definition traffic can flow into the fuller operating guide.

**Tech Stack:** Next.js App Router, TypeScript content objects in `src/lib/guides/index.ts` and `src/lib/glossary/terms/core.ts`, Node test runner for metadata helpers, ESLint, Next production build.

---

### Task 1: Write the CAC pillar design snapshot into code-facing docs

**Files:**
- Create: `docs/plans/2026-05-25-cac-pillar-design.md`
- Create: `docs/plans/2026-05-25-cac-pillar.md`

**Step 1: Save the approved design**

Write the approved CAC pillar design and the implementation plan into `docs/plans` so future work has a stable record.

**Step 2: Commit the docs**

Run:

```bash
git add docs/plans/2026-05-25-cac-pillar-design.md docs/plans/2026-05-25-cac-pillar.md
git commit -m "docs: capture CAC pillar design and plan"
```

Expected: a docs-only commit that records the approved direction before production changes begin.

### Task 2: Write failing tests for any new reusable behavior

**Files:**
- Modify: `src/lib/seo.test.ts`

**Step 1: Decide whether a new reusable helper is needed**

If the CAC pillar only reuses the existing `topicHub`, `partOfGuideSlug`, and metadata clamping behavior, do not invent new helpers just to satisfy TDD.

**Step 2: Add a failing test only if new shared logic is introduced**

If implementation adds reusable transformation or formatting logic, write the smallest failing test first in `src/lib/seo.test.ts` or the closest existing shared test file.

**Step 3: Run the targeted test to verify RED**

Run:

```bash
node --experimental-strip-types --test src\lib\seo.test.ts
```

Expected: the new test fails for the expected missing behavior, not because of a typo or broken import.

### Task 3: Upgrade `cac-guide` into the parent topic page

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Refresh parent metadata and date**

Update the `cac-guide` object with:

- stronger broad-intent title,
- clearer description,
- refreshed `updatedAt`,
- a `summary` block matching the newer guide pattern,
- a `topicHub` block that groups CAC guides, glossary pages, and calculators.

**Step 2: Rework the page copy toward a pillar structure**

Make the sections guide users through:

- what CAC is,
- what belongs in CAC,
- when to use paid vs fully-loaded CAC,
- why payback and LTV:CAC matter,
- which next page to open next.

Keep the page focused on task completion instead of generic metric definitions.

**Step 3: Preserve existing URL and category**

Do not create a new parent URL or change routing.

### Task 4: Attach CAC spoke guides back to the parent

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Update the strongest related spokes**

Add `partOfGuideSlug: "cac-guide"` and refresh `updatedAt` on:

- `fully-loaded-cac-guide`
- `cac-payback-guide`
- `blended-cac-vs-paid-cac-guide` if it exists

If a named page does not exist in the file, skip it rather than inventing a partial placeholder.

**Step 2: Keep spoke intent distinct**

Do not broaden spoke pages into duplicate parent pages. Their job is to answer one sub-problem and route back to the parent cluster.

### Task 5: Upgrade the CAC glossary entry into a better feeder page

**Files:**
- Modify: `src/lib/glossary/terms/core.ts`

**Step 1: Refresh the glossary SEO and UX wrapper**

For the `cac` term, add:

- stronger `seo.title`,
- stronger `seo.description`,
- `heroNote` that tells users when to jump to the full guide,
- `nextStepLabel` and `nextStepHref` that point to `/guides/cac-guide`,
- refreshed `updatedAt`.

**Step 2: Keep the glossary page short**

Do not turn glossary into a second guide. The glossary page should stay fast and definitional.

### Task 6: Verify the shared templates render the new structure without additional code

**Files:**
- Review: `src/app/guides/[slug]/page.tsx`
- Review: `src/app/glossary/[slug]/page.tsx`

**Step 1: Confirm no template changes are needed**

Because ARR already added shared rendering for:

- topic hub blocks,
- part-of-topic blocks,
- glossary next steps,

prefer zero template changes unless the CAC content reveals a real gap.

**Step 2: Only add code if a real rendering limitation exists**

If a limitation appears, write the smallest failing test or reproducible check first, then patch only the specific template behavior needed.

### Task 7: Run verification locally

**Files:**
- Verify: `src/lib/seo.test.ts`
- Verify: `src/lib/guides/index.ts`
- Verify: `src/lib/glossary/terms/core.ts`

**Step 1: Run targeted tests**

```bash
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

Expected: exit code 0 and regenerated `public/sitemap.xml` if content timestamps affect the sitemap output.

### Task 8: Check the exact pages locally in the built output

**Files:**
- Verify: `src/lib/guides/index.ts`
- Verify: `src/lib/glossary/terms/core.ts`

**Step 1: Confirm the parent/spoke structure in source**

Check that:

- `cac-guide` has a `topicHub`,
- the spoke guides reference `partOfGuideSlug: "cac-guide"`,
- `cac` glossary points to `/guides/cac-guide`.

**Step 2: Commit the implementation**

Run:

```bash
git add src/lib/guides/index.ts src/lib/glossary/terms/core.ts public/sitemap.xml
git commit -m "feat: build CAC topic pillar"
```

Expected: one implementation commit for the production change set.
