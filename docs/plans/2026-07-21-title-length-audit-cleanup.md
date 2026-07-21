# Title Length Audit Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the four overlong title findings from the July 21 SEO audit and prevent them from regressing.

**Architecture:** Add one focused regression test that checks the final rendered title budget, including the root layout's ` | MetricKit` suffix and the glossary page's ` definition` suffix. Introduce one shared metadata constant for the editorial policy page so the test can import a plain TypeScript value, then shorten only the flagged titles.

**Tech Stack:** Next.js App Router, TypeScript, Node test runner, ESLint, Next production build, `scripts/seo-audit.mjs`

---

### Task 1: Add the failing regression test

**Files:**
- Modify: `src/lib/seo.test.ts`

**Step 1: Write the failing test**

Add a test that asserts the following final rendered titles are `<= 60` characters:

- editorial policy metadata title
- `saas-magic-number-calculator` plus ` | MetricKit`
- `mrr-forecast-calculator` plus ` | MetricKit`
- `quota-carrying-reps` plus ` definition | MetricKit`

**Step 2: Run the focused test**

Run:

```powershell
node --experimental-strip-types --test src\lib\seo.test.ts
```

Expected: FAIL because the current audited titles are too long.

### Task 2: Expose the editorial policy title as plain metadata

**Files:**
- Create: `src/lib/static-metadata.ts`
- Modify: `src/app/editorial-policy/page.tsx`

**Step 1: Add a shared title constant**

Export a short editorial policy title constant from `src/lib/static-metadata.ts`.

**Step 2: Use the shared constant in page metadata**

Replace the inline absolute title in `src/app/editorial-policy/page.tsx` with the shared constant.

### Task 3: Shorten the three audited content titles

**Files:**
- Modify: `src/lib/calculators/definitions.part2.ts`
- Modify: `src/lib/calculators/definitions.part3.ts`
- Modify: `src/lib/glossary/terms/saasExtra.ts`

**Step 1: Update titles**

Shorten only these title sources:

- SaaS Magic Number calculator
- MRR Forecast calculator
- Quota-carrying reps glossary term

Keep the primary query and decision intent intact.

### Task 4: Verify the regression test passes

**Files:**
- Test: `src/lib/seo.test.ts`

**Step 1: Re-run the focused test**

```powershell
node --experimental-strip-types --test src\lib\seo.test.ts
```

Expected: PASS.

### Task 5: Run repository verification

**Step 1: Run lint**

```powershell
npm run lint
```

Expected: PASS.

**Step 2: Run build**

```powershell
npm run build
```

Expected: PASS.

### Task 6: Re-run the live SEO audit

**Step 1: Audit production**

```powershell
$env:SEO_AUDIT_BASE_URL='https://metrickittools.com'
$env:SEO_PREFERRED_SITE_URL='https://metrickittools.com'
$env:SEO_AUDIT_CONCURRENCY='10'
node scripts\seo-audit.mjs
```

Expected: `titleTooLong` drops from `4` to `0`, using the final rendered `<title>` values rather than source strings.

### Task 7: Review and prepare the batch

**Step 1: Inspect the diff**

```powershell
git diff --stat
git status --short
```

Confirm the two old March plan files remain untouched.

**Step 2: Hold commit grouping for the broader batch**

Do not commit this change in isolation if the session is still moving into the next GSC-driven optimization batch.
