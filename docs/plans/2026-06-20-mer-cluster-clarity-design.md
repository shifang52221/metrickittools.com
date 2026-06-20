# MER Cluster Clarity Design

**Date:** 2026-06-20

## Goal

Strengthen the `MER` search cluster by making the glossary term, full guide, and calculator page feel like three distinct layers instead of three partially overlapping answers.

The target chain is:

- glossary definition
- full guide
- calculator
- deeper next-step decision

## Problem

The current `MER` cluster already has the right assets:

- `mer` glossary term
- `mer-guide`
- `mer-calculator`

But they are still too close together in purpose:

- the glossary explains the concept but does not strongly frame itself as the fast definition layer
- the guide explains MER, but it does not strongly tell the reader when MER stops being enough
- the calculator computes the number, but it still reads more like a utility than a page for deciding whether top-down marketing efficiency is healthy enough

This creates two risks:

1. Google sees multiple partially relevant pages instead of one clear chain
2. Users are not pushed naturally from blended metric -> interpretation -> next diagnostic step

## Scope

This pass is intentionally narrow.

Only these three nodes are in scope:

- `mer` glossary term
- `mer-guide`
- `mer-calculator`

This pass will not redesign the whole paid ads cluster.

It will only strengthen the path:

- `MER glossary -> MER guide -> MER calculator -> marginal ROAS / incrementality`

## Chosen Approach

Use the existing cluster structure and sharpen the role of each layer.

### 1. MER glossary

Keep it as the fast definition entry point.

Its job is:

- define MER quickly
- explain the top-level difference from ROAS
- point the user to the full guide for interpretation

It should not try to act like the full guide.

### 2. MER guide

Keep it as the interpretation page.

Its job is:

- explain what MER is good for
- explain where MER becomes dangerous
- connect MER to break-even MER, target MER, marginal ROAS, and incrementality
- send action-oriented users into the calculator with a concrete scenario

It should not try to be just a glossary page with more words.

### 3. MER calculator

Keep it as the decision page.

Its job is:

- calculate blended efficiency
- translate that efficiency into profit, break-even MER, target MER, and allowable spend
- tell the user what to inspect next when blended MER looks good, weak, or misleading

It should feel like a page for deciding what to do next, not just a page for getting a number.

## Why This Approach

- it stays aligned with the existing site architecture
- it does not require a whole paid ads rewrite
- it strengthens one of the few currently promising query clusters
- it follows the site principle of stronger usability and lower template feel

## Content Principles

### MER glossary

- fast definition first
- minimal theory
- stronger handoff to the guide

### MER guide

- clearly distinguish top-down health from channel optimization
- clearly explain when marginal ROAS or incrementality is the real next step
- make the calculator example feel like a concrete operating scenario

### MER calculator

- open with a decision framing, not just a formula framing
- keep break-even and target MER in plain operator language
- explain what a “good” blended MER can still hide
- give the reader a stronger next step beyond the single headline metric

## Expected Outcome

After this pass:

- the glossary should look more like the fast definition layer
- the guide should look more like the interpretation layer
- the calculator should look more like the action layer
- the cluster should better express the path from blended metric -> deeper diagnosis

## Testing Strategy

Add source-driven regression coverage that verifies:

- the MER glossary still points to the full guide
- the MER guide still points to the calculator and also references the deeper next-step ideas of marginal ROAS or incrementality
- the MER calculator exposes stronger decision-oriented benchmark and next-step language

## Out of Scope

- rewriting the full paid ads taxonomy
- changing category pages
- redesigning the calculator template globally
- adding new MER pages
- rebuilding unrelated ROAS or incrementality content in this pass
