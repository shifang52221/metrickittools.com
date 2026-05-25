# CAC Pillar Design

**Date:** 2026-05-25

**Goal**

Turn the existing CAC content cluster into a clearer topic pillar so search engines and users see one strong parent page for customer acquisition cost, with tighter paths into payback, fully-loaded CAC, LTV:CAC, and supporting calculators.

**Why This Is The Right Next Move**

The ARR rollout proved that MetricKit can improve topical clarity without creating brand-new URLs. CAC is the best second cluster because the site already has a usable parent page, multiple high-intent supporting guides, multiple matching calculators, and glossary coverage. That means we can concentrate weight with lower risk than starting a new theme from scratch.

**Primary User Task**

Help a user answer one core operating question:

"What does it really cost to acquire a customer, and does that acquisition model pay back fast enough to scale?"

That task naturally branches into:

- headline CAC definition and formula,
- paid CAC vs fully-loaded CAC,
- CAC payback and cash efficiency,
- LTV:CAC and sustainability,
- calculators for quick scenario work.

**Chosen Approach**

Upgrade the existing `cac-guide` into the pillar page, then connect supporting pages back to it with explicit "part of this topic" relationships and next-step links.

This is better than creating a brand-new `/guides/cac-hub` URL because:

- the existing page already owns the plain-English CAC intent,
- it avoids splitting signals across overlapping parent pages,
- it keeps the site flatter and easier to understand,
- it matches the successful ARR pattern we just shipped.

**Information Architecture**

Parent:

- `/guides/cac-guide`

Supporting guides:

- `/guides/fully-loaded-cac-guide`
- `/guides/cac-payback-guide`
- `/guides/blended-cac-vs-paid-cac-guide`
- `/guides/ltv-cac-ratio-guide` if present later, otherwise route through existing calculator and related content

Supporting calculators:

- `/saas-metrics/cac-calculator`
- `/saas-metrics/fully-loaded-cac-calculator`
- `/saas-metrics/cac-payback-period-calculator`
- `/saas-metrics/ltv-to-cac-calculator`
- `/saas-metrics/blended-cac-calculator`

Supporting glossary:

- `/glossary/cac`
- `/glossary/fully-loaded-cac`
- `/glossary/cac-payback-period`
- `/glossary/ltv`
- `/glossary/gross-margin`
- `/glossary/arpa`

**Content Strategy**

The pillar page should stop reading like a short standalone explainer and instead behave like a navigation-aware operating guide. It should:

- define CAC clearly,
- separate reporting CAC from planning CAC,
- explain which follow-up metric to use next depending on the question,
- send users into the right spoke page instead of trying to answer everything in one blob,
- feel less templated by using task-based framing and stronger next steps.

The supporting pages should not become duplicates of the parent. Each spoke should own one deeper sub-problem:

- `fully-loaded-cac-guide`: what counts in acquisition cost
- `cac-payback-guide`: how fast CAC is earned back
- `blended-cac-vs-paid-cac-guide`: which acquisition definition to use
- glossary `cac`: quick definition plus CTA to the full guide

**Metadata Strategy**

Use explicit, narrower title and description copy on the parent and key spokes. The parent should target broad CAC intent. The spoke pages should target sub-intents without repeating the same wording as the parent.

**Internal Linking Strategy**

On the parent page:

- show a topic hub block with guides, glossary entries, and calculators,
- point each major section toward the next best spoke.

On spoke pages:

- add `partOfGuideSlug: "cac-guide"` where relevant,
- let the existing shared page template render "Part of this topic."

On glossary:

- add a fast-definition note and a CTA back to the pillar page.

**Scope Guardrails**

This pass should not:

- create new URLs,
- rewrite the entire unit economics section,
- mass-edit unrelated pages,
- introduce a second overlapping CAC hub.

**Success Criteria**

- `cac-guide` reads like the obvious parent page for CAC intent.
- Related CAC pages visibly connect back to the parent.
- The glossary definition for CAC routes users to the fuller guide.
- Metadata is more specific and less duplicate-prone across the cluster.
- The rollout mirrors ARR structurally so the site becomes more coherent cluster by cluster.
