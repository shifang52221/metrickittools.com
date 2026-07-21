# Index Quality Gating Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reduce low-value glossary index surface by adding one shared indexing policy that controls both page metadata and sitemap inclusion.

**Architecture:** Keep guides, calculators, hubs, and trust pages indexed by default. Gate only glossary detail pages in this first pass. Use one shared JS policy data file plus one typed TypeScript wrapper so the app router and sitemap generator apply the same keep/noindex decisions.

**Tech Stack:** Next.js App Router, TypeScript, shared JS policy data, Node test runner, ESLint, Next production build.

---

### Task 1: Write failing policy tests

**Files:**
- Create: `src/lib/indexing.test.ts`
- Test: `src/lib/indexing.test.ts`

**Step 1: Write the failing test**

Add tests that assert:

- `arr`, `mrr`, `cac`, `roas`, and `marginal-roas` remain indexable.
- `net-debt` remains indexable because it is strategic.
- `capital-allocation` and `runway-extension-plan` are `noindex, follow`.
- The indexable glossary set is smaller than the full glossary set.

**Step 2: Run the focused test**

Run:

```powershell
node --experimental-strip-types --test src\lib\indexing.test.ts
```

Expected: FAIL because the indexing library does not exist yet.

### Task 2: Add shared indexing policy data

**Files:**
- Create: `src/lib/indexing-policy-data.js`

**Step 1: Define the shared allowlists**

Export:

- the July 21 GSC glossary keep slugs
- the manual strategic finance glossary keep slugs

Keep the file data-only so the sitemap generator can import it directly.

### Task 3: Implement the typed indexing library

**Files:**
- Create: `src/lib/indexing.ts`

**Step 1: Implement glossary helpers**

Add:

- `getGlossaryIndexingDecision(term)`
- `isGlossaryTermIndexable(term)`
- `getIndexableGlossaryTerms()`

Rules:

- keep if GSC keep set contains the slug
- keep if the term has `seo.nextStepHref`
- keep if a calculator references the slug
- keep if the manual strategic set contains the slug
- otherwise noindex with `follow: true`

### Task 4: Apply the policy in glossary metadata

**Files:**
- Modify: `src/app/glossary/[slug]/page.tsx`

**Step 1: Update metadata**

Use `getGlossaryIndexingDecision` inside `generateMetadata`.

If the glossary term is not indexable, emit:

```ts
robots: { index: false, follow: true }
```

Leave canonical URLs intact.

### Task 5: Apply the policy in sitemap generation

**Files:**
- Modify: `scripts/generate-sitemap.mjs`

**Step 1: Import the policy data**

Load the shared keep sets into the sitemap generator.

**Step 2: Filter glossary URLs**

Exclude glossary entries that the policy marks as noindex.

### Task 6: Regenerate and verify locally

**Files:**
- Test: `src/lib/indexing.test.ts`
- Test: `src/lib/content-clusters.test.ts`
- Test: `src/lib/seo.test.ts`

**Step 1: Run focused indexing tests**

```powershell
node --experimental-strip-types --test src\lib\indexing.test.ts
```

Expected: PASS.

**Step 2: Run existing regression tests**

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
node --experimental-strip-types --test src\lib\seo.test.ts
```

Expected: PASS.

### Task 7: Run repository verification

**Step 1: Run lint**

```powershell
npm run lint
```

Expected: PASS.

**Step 2: Run production build**

```powershell
npm run build
```

Expected: PASS and `public/sitemap.xml` shows fewer URLs than the previous 604.

### Task 8: Review and push

**Step 1: Inspect the diff**

```powershell
git diff --stat
git status --short
```

Confirm the two old untracked March rollout documents remain untouched.

**Step 2: Commit the index-quality pass**

```powershell
git add src/lib/indexing-policy-data.js src/lib/indexing.ts src/lib/indexing.test.ts src/app/glossary/[slug]/page.tsx scripts/generate-sitemap.mjs public/sitemap.xml docs/plans/2026-07-21-index-quality-gating-design.md docs/plans/2026-07-21-index-quality-gating.md
git commit -m "feat: gate low-value glossary indexation"
```

**Step 3: Push**

```powershell
git push origin main
```

**Step 4: Verify live**

Check one retained glossary URL and one noindex glossary URL:

- retained example: `/glossary/arr`
- noindex example: `/glossary/capital-allocation`

Confirm:

- both return HTTP 200
- retained page has no noindex robots tag
- noindex page has `noindex, follow`
- sitemap includes the retained page and excludes the noindex page
