# Paid Ads Efficiency Cluster Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Clarify the existing MER, Target ROAS, and Marginal ROAS pages as one decision-oriented paid ads efficiency cluster.

**Architecture:** Reuse the existing guide, glossary, calculator, and shared next-action models. Update only existing content definitions and regression coverage; do not add routes or change sitemap policy.

**Tech Stack:** Next.js App Router, TypeScript content definitions, Node test runner, ESLint, Next production build.

---

### Task 1: Add failing cluster-role tests

**Files:**
- Modify: `src/lib/content-clusters.test.ts`
- Test: `src/lib/content-clusters.test.ts`

**Step 1: Write the failing test**

Add assertions that:

- `mer-guide` references `mer-calculator` and a marginal ROAS next step.
- `target-roas-guide` references `target-roas-calculator` and the MER decision path.
- `marginal-roas` has a next step that connects to MER and a practical follow-up.
- The MER and Target ROAS calculator definitions contain their intended decision language.

**Step 2: Run the focused test**

Run:

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: FAIL because the new relationship assertions are not present yet.

### Task 2: Clarify MER content roles

**Files:**
- Modify: `src/lib/guides/index.ts`
- Modify: `src/lib/calculators/definitions.part3.ts`

**Step 1: Update the calculator**

Keep the calculator as the blended top-down diagnostic. Strengthen the intro, benchmarks, pitfalls, and next action so it clearly routes:

- health check to the MER guide
- scaling decision to marginal ROAS
- causal validation to incrementality

**Step 2: Update the guide**

Keep the guide as the interpretation page. Add a concise relationship section and one practical workflow that uses the calculator before moving to marginal ROAS or incrementality.

### Task 3: Clarify Target ROAS content roles

**Files:**
- Modify: `src/lib/guides/index.ts`
- Modify: `src/lib/calculators/definitions.part1.ts`

**Step 1: Update the calculator**

Make the calculator opening language and benchmarks explicitly distinguish:

- break-even ROAS as a floor
- target ROAS as a planning constraint
- fixed allocation and profit buffer as assumptions

**Step 2: Update the guide**

Make the guide the assumptions and decision page. Add a clear scenario workflow and links to MER and marginal ROAS without duplicating calculator copy.

### Task 4: Connect Marginal ROAS

**Files:**
- Modify: `src/lib/glossary/terms/paidAds.ts`
- Inspect: `src/lib/guides/index.ts`
- Inspect: `src/lib/calculators/definitions.part3.ts`

**Step 1: Update the glossary bridge**

Make the glossary definition concise and connect it to the MER guide plus the most relevant existing marginal ROAS follow-up.

**Step 2: Keep URL inventory stable**

Confirm no new calculator, guide, glossary, or sitemap entries are created.

### Task 5: Run focused verification

**Files:**
- Test: `src/lib/content-clusters.test.ts`
- Test: `src/lib/seo.test.ts`

**Step 1: Run content-cluster tests**

```powershell
node --experimental-strip-types --test src\lib\content-clusters.test.ts
```

Expected: PASS.

**Step 2: Run SEO tests**

```powershell
node --experimental-strip-types --test src\lib\seo.test.ts
```

Expected: PASS.

### Task 6: Run repository verification

**Step 1: Run lint**

```powershell
npm run lint
```

Expected: PASS with exit code 0.

**Step 2: Run production build**

```powershell
npm run build
```

Expected: PASS and the sitemap remains at the existing URL count.

### Task 7: Review and push

**Step 1: Inspect the diff**

```powershell
git diff --stat
git status --short
```

Confirm the two old untracked rollout documents remain untouched.

**Step 2: Commit the cluster pass**

```powershell
git add src/lib/content-clusters.test.ts src/lib/guides/index.ts src/lib/calculators/definitions.part1.ts src/lib/calculators/definitions.part3.ts src/lib/glossary/terms/paidAds.ts docs/plans/2026-07-21-paid-ads-efficiency-design.md docs/plans/2026-07-21-paid-ads-efficiency.md
git commit -m "feat: clarify paid ads efficiency cluster"
```

**Step 3: Push**

```powershell
git push origin main
```

**Step 4: Verify live pages**

Check these URLs after deployment:

- `/paid-ads/mer-calculator`
- `/guides/mer-guide`
- `/paid-ads/target-roas-calculator`
- `/guides/target-roas-guide`
- `/glossary/marginal-roas`

Confirm HTTP 200 responses, updated opening copy, and stable canonical URLs.
