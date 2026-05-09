# Priority Pages CTR Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve five high-opportunity pages that already earn impressions and near-page-one rankings but still produce little or no clicks by making the page promise, first answer, and decision framing more aligned with search intent.

**Architecture:** This pass stays inside the existing content-data architecture. We will update the glossary seeds for `fbclid` and `net-debt`, then update the guide definitions for `safe-guide`, `liquidation-preference-guide`, and `dcf-sensitivity-guide` so the first screen answers literal queries faster, gives a clearer decision rule, and points users toward the next useful action.

**Tech Stack:** Next.js app router, TypeScript content definitions, existing glossary and guide rendering system, npm lint/build verification.

---

### Task 1: Strengthen glossary pages with literal-answer framing

**Files:**
- Modify: `src/lib/glossary/terms/paidAdsExtra.ts`
- Modify: `src/lib/glossary/terms/finance.ts`

**Step 1: Refresh the `fbclid` page**

- Rewrite the definition so it begins with the exact meaning of the parameter.
- Make the example and bullets answer the literal "what is fbclid" intent before moving into implementation caveats.
- Add module guidance that clarifies what the parameter is, what it is not, and what to verify next.

**Step 2: Refresh the `net-debt` page**

- Rewrite the definition so it begins with the plain formula users expect.
- Add a simple numeric example.
- Make the usage bullets explain what to include, when net cash applies, and how the number changes equity value.
- Add module guidance so the page better bridges from definition intent to valuation action.

### Task 2: Strengthen guide pages with quick-answer and decision-rule sections

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Refresh `safe-guide`**

- Add an upfront "quick answer" section that explains what SAFE conversion actually means in a priced round.
- Add a plain-English rule for when the cap or discount wins.
- Make the checklist more decision-oriented for founders and operators.

**Step 2: Refresh `liquidation-preference-guide`**

- Add an upfront "quick answer" section that explains what liquidation preference changes at exit.
- Make the convert-vs-preference rule more explicit.
- Add a short table or bullets that anchor the break-even logic in plain language.

**Step 3: Refresh `dcf-sensitivity-guide`**

- Add an upfront "quick answer" section describing what DCF sensitivity is actually for.
- Make the workflow emphasize defensible ranges, not decorative grids.
- Add a simple interpretation rule so users can tell whether a valuation conclusion is robust.

### Task 3: Verify the pass

**Files:**
- Review: `git diff -- docs/plans/2026-05-09-priority-pages-ctr-pass.md src/lib/glossary/terms/paidAdsExtra.ts src/lib/glossary/terms/finance.ts src/lib/guides/index.ts`

**Step 1: Run lint**

Run: `npm run lint`

Expected: successful exit with no lint errors.

**Step 2: Run production build**

Run: `npm run build`

Expected: successful exit with a generated production build and sitemap output.

**Step 3: Review the diff**

Run: `git diff -- docs/plans/2026-05-09-priority-pages-ctr-pass.md src/lib/glossary/terms/paidAdsExtra.ts src/lib/glossary/terms/finance.ts src/lib/guides/index.ts`

Expected: changes stay limited to the five target pages plus this plan doc.
