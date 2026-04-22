# SEO Metadata Refinement Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Improve click-through potential for the five highest-priority guide and glossary pages without regressing the site's user-first, de-templated voice.

**Architecture:** Keep the current page structure intact and update only the content source objects that feed page titles and meta descriptions. Align page titles and SEO titles more closely on the selected pages so search snippets and on-page framing feel consistent.

**Tech Stack:** Next.js App Router, TypeScript content objects, ESLint

---

### Task 1: Update glossary metadata for `net-debt` and `fbclid`

**Files:**
- Modify: `src/lib/glossary/terms/finance.ts`
- Modify: `src/lib/glossary/terms/paidAdsExtra.ts`

**Step 1: Update the `net-debt` title and SEO description copy**

Change the glossary term so the title and meta copy foreground the exact user question: formula, inclusions, and equity value impact.

**Step 2: Update the `fbclid` title and SEO description copy**

Change the glossary term so the title and meta copy foreground the URL parameter meaning and attribution use case.

**Step 3: Review hero note and next-step CTA**

Keep the existing UX-oriented guidance and next-step path unless the new metadata makes them inconsistent.

### Task 2: Update guide metadata for `safe-guide`, `dau-mau-guide`, and `liquidation-preference-guide`

**Files:**
- Modify: `src/lib/guides/index.ts`

**Step 1: Update `safe-guide` title and description**

Use a practical, human-readable framing that keeps cap vs discount, dilution, and pre/post-money language visible.

**Step 2: Update `dau-mau-guide` title and description**

Use a stickiness-first framing that still calls out formula, benchmarks, and when the metric misleads.

**Step 3: Update `liquidation-preference-guide` title and description**

Use an exit-outcomes framing that keeps 1x non-participating and conversion language visible without sounding templated.

### Task 3: Verify no syntax or lint regressions

**Files:**
- Verify: `src/lib/guides/index.ts`
- Verify: `src/lib/glossary/terms/finance.ts`
- Verify: `src/lib/glossary/terms/paidAdsExtra.ts`

**Step 1: Run ESLint**

Run: `npm run lint`

Expected: exit code 0 with no new lint errors introduced by the metadata edits.

**Step 2: Inspect the git diff**

Run: `git diff -- src/lib/guides/index.ts src/lib/glossary/terms/finance.ts src/lib/glossary/terms/paidAdsExtra.ts docs/plans/2026-04-22-seo-metadata-refinement-pass.md`

Expected: only the approved metadata strings and the plan document are changed.
