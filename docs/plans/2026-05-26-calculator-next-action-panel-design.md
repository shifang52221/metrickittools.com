# Calculator Next Action Panel Design

**Date:** 2026-05-26

## Goal

Strengthen the weakest step in the current priority content chain by telling calculator users what to do after they get a result.

The target chain is:

- definition
- guide
- calculator
- next decision

## Problem

MetricKit's priority glossary and guide pages now do a better job of routing users into stronger full-page explanations.

Priority calculator pages are stronger than before, but the post-result experience is still too passive:

- users can calculate
- users can browse related guides and definitions
- but the page does not clearly say what result pattern usually means
- and it does not clearly recommend the next best action

That weakens usability and trust because the page still behaves too much like a tool and not enough like a decision aid.

## Scope

This pass is intentionally narrow.

Only the following recently strengthened calculators are in scope:

- `unit-economics-calculator`
- `cohort-ltv-forecast-calculator`
- `ltv-to-cac-calculator`
- `cac-payback-period-calculator`

The first version should:

1. Add lightweight calculator-level next-action data
2. Render one reusable next-action panel on calculator pages
3. Only show the panel when a calculator has explicit next-action content

No broad rollout to every calculator is included in this pass.

## Chosen Approach

Add an optional `nextAction` field to the calculator definition model.

For the four priority calculators, provide:

- a short title
- a one-paragraph framing sentence
- a primary CTA
- an optional secondary CTA

Then create a shared `NextActionPanel` component and render it in the calculator page client near the result area, after the result is visible and before deeper supporting sections.

## Why This Approach

- keeps the change focused on real user decision flow
- avoids creating thin new content
- builds on the existing guide/glossary infrastructure
- gives the calculator page a clearer "what now?" answer
- keeps untouched calculators unchanged

## Content Principles

The panel should not sound generic or promotional.

It should:

- interpret the result in plain operator language
- point users to the next best guide for judgment, not just formula review
- offer one nearby comparison or follow-up path when useful

The panel should not:

- repeat the whole guide
- add multiple competing CTAs
- pretend the calculator result is a complete recommendation

## Placement

Render the panel in calculator pages below the main result card region and before the long supporting sections such as formula, benchmarks, or FAQ.

That placement keeps the action close to the result while still letting the calculation stay primary.

## Testing Strategy

Add regression coverage that verifies:

- the four priority calculators expose `nextAction`
- the calculator client template renders a shared next-action panel
- the template keeps existing result and guidance areas intact

## Out of Scope

- rolling out next-action content to every calculator
- redesigning guide or glossary templates
- changing schema markup for this feature
- introducing personalization or rule-based recommendations
