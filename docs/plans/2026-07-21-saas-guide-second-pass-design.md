# SaaS Guide Second-Pass Design

**Date:** 2026-07-21

## Context

The July 21 GSC export shows meaningful impressions for the SaaS guide cluster but no corresponding clicks:

- `/guides/arr-guide`: 73 impressions, average position about 46.97.
- `/guides/mrr-forecast-guide`: part of the high-impression MRR cluster.
- `/guides/cac-guide`: 45 impressions, average position about 51.18.
- `/guides/cac-payback-guide`: 72 impressions, average position about 62.33.

The glossary and hub passes now point users toward these guides. The next bottleneck is guide usefulness: every page should show a concrete scenario, a clear calculator handoff, and a warning against making a decision from one metric alone.

## Goal

Strengthen the four existing guides as decision pages without adding routes or changing the sitemap/indexing policy.

## Scope

### In scope

- `/guides/arr-guide`
- `/guides/mrr-forecast-guide`
- `/guides/cac-guide`
- `/guides/cac-payback-guide`
- Existing calculator examples, section copy, updated dates, and regression coverage.

### Out of scope

- New guide or calculator URLs.
- Bulk rewriting unrelated guide clusters.
- Changing the index-quality policy.
- Adding unsupported universal benchmark claims.

## Design

Each guide gets the same three-layer handoff:

1. **Quick answer:** restate the metric and the decision it can support.
2. **Worked scenario:** use an existing calculator with realistic inputs and a decision note.
3. **Next decision:** explain what to inspect next and why the headline metric is not sufficient alone.

### ARR

Use the ARR calculator for a clean run-rate check, then route to ARR waterfall, net new ARR, or bookings-vs-ARR interpretation. Warn that ARR alone cannot prove revenue recognition, cash health, or durable growth.

### MRR forecast

Use the forecast calculator for a bridge scenario, then inspect MRR waterfall, NRR, and GRR. Warn that new MRR can hide weak existing-customer retention.

### CAC

Use the CAC calculator for a consistent denominator and spend definition, then route to CAC payback and LTV:CAC. Warn that a low blended CAC can hide weak segments or poor retention.

### CAC payback

Use the payback calculator to connect CAC, ARPA, and gross margin to cash recovery time. Warn that payback is a cash-timing metric, not the same as LTV or company break-even.

## Acceptance Criteria

- All four guides have `updatedAt: "2026-07-21"`.
- All four guides expose an example tied to an existing calculator.
- Every example contains a decision note, not just inputs.
- Each guide contains explicit next-decision language.
- Existing cluster tests remain green.
- Sitemap URL count remains unchanged.
