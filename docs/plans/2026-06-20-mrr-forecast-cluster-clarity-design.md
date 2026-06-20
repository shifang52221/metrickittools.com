# MRR Forecast Cluster Clarity Design

**Date:** 2026-06-20

## Goal

Strengthen the `MRR forecast` search cluster by making the glossary term, full guide, and calculator page feel like distinct layers instead of adjacent pages that partly repeat each other.

The target chain is:

- glossary definition
- full guide
- calculator
- deeper next-step retention and planning interpretation

## Problem

The current `MRR forecast` cluster already has the right assets:

- `mrr` glossary term
- `mrr-forecast-guide`
- `mrr-forecast-calculator`

But the roles are still too compressed:

- the glossary defines `MRR`, but it does not clearly frame itself as the fast definition layer that routes planning-oriented users into the forecasting guide
- the guide explains the bridge formula, but it does not strongly explain when a bridge model is enough, when it breaks, or what to inspect next
- the calculator computes the forecast, but it still reads more like a projection utility than a page that helps an operator decide what to check after the projection

This creates two risks:

1. Google sees overlapping pages instead of a cleaner search journey
2. users do not move naturally from definition -> forecast model -> retention and growth diagnosis

## Scope

This pass is intentionally narrow.

Only these three nodes are in scope:

- `mrr` glossary term
- `mrr-forecast-guide`
- `mrr-forecast-calculator`

This pass will not redesign the broader ARR/MRR cluster.

It will only strengthen the path:

- `MRR glossary -> MRR forecast guide -> MRR forecast calculator -> MRR waterfall / NRR / GRR`

## Chosen Approach

Use the existing cluster structure and sharpen the role of each layer.

### 1. MRR glossary

Keep it as the fast definition entry point.

Its job is:

- define MRR quickly
- clarify the main components
- explain that forecasting MRR requires a bridge, not just the base formula
- point users to the forecasting guide when they need planning workflow

It should not try to act like the full forecasting guide.

### 2. MRR forecast guide

Keep it as the interpretation page.

Its job is:

- explain the monthly bridge model clearly
- explain which assumptions matter most
- explain when the model is useful and when cohort behavior or retention analysis matters more
- connect forecast output to NRR, GRR, MRR waterfalls, and scenario planning
- send action-oriented users into the calculator with a concrete planning scenario

It should not try to be only a definition page with extra text.

### 3. MRR forecast calculator

Keep it as the decision page.

Its job is:

- calculate the monthly projection
- expose the assumptions that drive the output
- help the user understand whether the projection is being driven by acquisition, expansion, or retention
- tell the reader what to inspect next when the forecast looks good, flat, or fragile

It should feel like a page for planning and diagnosis, not just a formula box.

## Why This Approach

- it stays aligned with the current site architecture
- it continues the proven page-by-page cluster clarification work
- it fits the site principle of stronger usability, less template feel, and higher trust
- it targets a page that is already closer to useful ranking territory than broader ARR work

## Content Principles

### MRR glossary

- fast definition first
- keep the component list practical
- stronger handoff to the forecasting guide

### MRR forecast guide

- make the bridge model useful for operators, not just descriptive
- explain when simple forecasts stop being reliable
- point toward retention and waterfall analysis as the next layer
- make the calculator example feel like a real planning scenario

### MRR forecast calculator

- open with planning language, not just formula language
- explain that outputs depend on retention assumptions
- help the reader separate top-line growth from durable revenue health
- give the reader a stronger next step beyond the projected ending MRR

## Expected Outcome

After this pass:

- the glossary should look more like the fast definition layer
- the guide should look more like the forecasting interpretation layer
- the calculator should look more like the planning and diagnosis layer
- the cluster should better express the path from MRR definition -> forecast model -> retention-aware interpretation

## Testing Strategy

Add source-driven regression coverage that verifies:

- the `mrr` glossary entry frames itself as a fast definition and points to the forecasting guide
- the `mrr-forecast-guide` keeps the calculator as the main worked example and also references retention-aware next steps such as NRR, GRR, or waterfalls
- the `mrr-forecast-calculator` exposes stronger decision-oriented guidance and a next action beyond the raw projection

## Out of Scope

- rewriting the full ARR/MRR taxonomy
- redesigning guide templates globally
- adding new MRR pages
- changing unrelated ARR, retention, or valuation clusters in this pass
