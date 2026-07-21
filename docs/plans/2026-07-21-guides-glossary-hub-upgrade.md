# Guides and Glossary Hub Upgrade Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the guides and glossary index pages useful decision-oriented entry points without adding URLs.

**Architecture:** Add a small shared highlight-data module. The guides page renders five existing guide pathways; the glossary page renders nine existing core definitions. Existing category listings remain below the new entry sections.

**Tech Stack:** Next.js App Router, TypeScript content data, Node test runner, ESLint, Next production build.

---

### Task 1: Add failing hub-content tests

**Files:**
- Create: `src/lib/hub-content.test.ts`

**Step 1: Write the failing test**

Assert that:

- five guide decision paths exist
- each path has an existing `/guides/...` primary href
- nine glossary highlight slugs exist
- the glossary highlights include ARR, MRR, CAC, LTV, gross margin, payback period, ROAS, MER, and net debt

**Step 2: Run the focused test**

```powershell
node --experimental-strip-types --test src\lib\hub-content.test.ts
```

Expected: FAIL because the shared highlight module does not exist yet.

### Task 2: Implement shared hub highlight data

**Files:**
- Create: `src/lib/content/hubHighlights.ts`

Add typed guide decision paths and glossary highlight slugs. Use only existing routes and slugs.

### Task 3: Upgrade `/guides`

**Files:**
- Modify: `src/app/guides/page.tsx`

Render the five decision paths above the current Paid ads, SaaS metrics, and Finance lists. Update page metadata to describe decision-led guides.

### Task 4: Upgrade `/glossary`

**Files:**
- Modify: `src/app/glossary/page.tsx`

Render the nine core definitions above the existing category lists. Use existing glossary titles and descriptions rather than duplicating content strings.

### Task 5: Verify

Run:

```powershell
node --experimental-strip-types --test src\lib\hub-content.test.ts
node --experimental-strip-types --test src\lib\content-clusters.test.ts
node --experimental-strip-types --test src\lib\indexing.test.ts
node --experimental-strip-types --test src\lib\seo.test.ts
npm run lint
npm run build
```

Expected: all pass, sitemap remains at 377 URLs.

### Task 6: Commit and push

```powershell
git add src/lib/hub-content.test.ts src/lib/content/hubHighlights.ts src/app/guides/page.tsx src/app/glossary/page.tsx docs/plans/2026-07-21-guides-glossary-hub-upgrade-design.md docs/plans/2026-07-21-guides-glossary-hub-upgrade.md public/sitemap.xml
git commit -m "feat: improve guides and glossary hubs"
git push origin main
```

Verify online `/guides` and `/glossary` return 200 and show the new entry sections.
