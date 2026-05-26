# Guide Example Action Cards Design

**Date:** 2026-05-26

## Goal

Make the strongest guide pages easier to act on by turning calculator examples into clearer scenario-based action cards.

The target chain is:

- guide
- scenario
- prefilled calculator
- next action

## Problem

MetricKit guide pages already include `examples` that deep-link into calculators with prefilled query parameters.

That is useful, but the current experience is still too passive:

- examples look like simple related links
- the user is not clearly told why this scenario is worth running
- the guide does not frame the example as a practical decision path

So even when the guide has a strong calculator attached, the guide can still feel informational instead of operational.

## Scope

This pass is intentionally narrow.

Only these four priority guides are in scope:

- `unit-economics-guide`
- `ltv-cac-guide`
- `cac-payback-guide`
- `cohort-ltv-forecast-guide`

The first version should:

1. Strengthen the example-card presentation on guide pages
2. Add lightweight action-oriented example copy for the four priority guides
3. Keep the existing example-link architecture and prefilled calculator URLs

No broad rollout to every guide is included in this pass.

## Chosen Approach

Use the existing `Guide.examples` structure as the base and extend it with one lightweight action-oriented field for guide-specific framing.

Recommended addition:

- `decisionNote?: string`

This field explains why the user should run the example now, in plain operator language.

Then adjust the `Try it in a calculator` section so each card shows:

- calculator title
- example label
- short decision-oriented note
- clearer action phrasing that makes it obvious the link opens a prefilled scenario

## Why This Approach

- minimal data-model change
- keeps existing prefilled calculator URLs intact
- improves usability without adding more content pages
- strengthens the guide -> calculator handoff where the user is ready to act

## Content Principles

The example cards should:

- sound specific and practical
- describe the scenario in operator language
- explain what decision or question the scenario helps answer
- make it clear the calculator opens prefilled

The cards should not:

- repeat the full guide
- add multiple competing actions
- become long template blocks

## Placement

Keep the cards in the existing `Try it in a calculator` section.

This is already the right part of the guide for action. The change should focus on making the cards feel more purposeful, not on redesigning the whole page structure.

## Testing Strategy

Add regression coverage that verifies:

- the guide page template renders stronger example action content
- the four priority guides expose example-level decision notes
- the example cards still deep-link into prefilled calculator URLs

## Out of Scope

- rolling the pattern out to every guide
- redesigning the whole guide template
- changing calculator schema or metadata
- adding personalization or dynamic recommendation logic
