# Title Length Audit Cleanup Design

**Date:** 2026-07-21

## Goal

Clear the four title-length findings from the July 21 SEO audit without changing page intent, URL structure, or indexing behavior.

## Scope

- `/editorial-policy`
- `/saas-metrics/saas-magic-number-calculator`
- `/saas-metrics/mrr-forecast-calculator`
- `/glossary/quota-carrying-reps`

## Approach

Use the smallest possible content change:

1. Add a regression test that locks these four targets to `<= 60` characters.
2. Move the editorial policy title into a small shared constant so the test can validate it without importing a JSX page module.
3. Shorten the three content titles while preserving user intent and SERP clarity.
4. Re-run focused tests, lint, build, and the live SEO audit to confirm the audit finding drops to zero.

## Non-Goals

- No new URLs
- No sitemap/indexing policy changes
- No broad title template rewrite
- No title changes outside the four audit findings

## Success Criteria

- The new regression test models the final rendered title, including the site suffix and glossary definition suffix.
- The new regression test fails before the title changes and passes after them.
- `npm run lint` passes.
- `npm run build` passes.
- A fresh `seo-audit.mjs` run reports `titleTooLong count: 0`.
