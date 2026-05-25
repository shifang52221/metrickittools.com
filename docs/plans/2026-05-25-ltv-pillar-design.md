# LTV Pillar Design

**Date:** 2026-05-25

**Goal**

Turn the existing LTV content set into a clearer topic pillar so MetricKit has one strong parent page for lifetime value, with explicit paths into churn sensitivity, customer lifetime, cohort-based modeling, and the bridge into LTV:CAC.

**Why This Is The Right Next Move**

ARR is now a functioning cluster. CAC is now a functioning cluster. LTV is the natural third pillar because it completes the main SaaS unit-economics chain. The site already has a parent page, multiple adjacent subtopic guides, glossary support, and calculators that match the real search workflow. That gives us another high-leverage internal-linking and clarity upgrade without creating new URLs.

**Primary User Task**

Help a user answer one core operating question:

"What is a customer actually worth over time, and how much confidence should I have in that number?"

That question naturally branches into:

- quick LTV shortcut vs cohort-based LTV,
- gross margin and churn assumptions,
- customer lifetime estimation,
- sensitivity to churn and margin,
- how LTV connects to CAC and payback.

**Chosen Approach**

Upgrade the existing `ltv-guide` into the pillar page, then connect the strongest LTV spokes back to it through explicit "part of this topic" relationships and glossary next-step links.

This is better than creating a new `/guides/ltv-hub` URL because:

- `ltv-guide` already owns the broad LTV intent,
- it avoids splitting weight across overlapping pages,
- it keeps the site architecture flatter,
- it continues the same pattern already used for ARR and CAC.

**Information Architecture**

Parent:

- `/guides/ltv-guide`

Primary LTV spokes:

- `/guides/ltv-sensitivity-guide`
- `/guides/customer-lifetime-guide`
- `/guides/cohort-ltv-forecast-guide`

Cross-over page surfaced in the hub:

- `/guides/ltv-cac-guide`

Supporting calculators:

- `/saas-metrics/ltv-calculator`
- `/saas-metrics/ltv-sensitivity-calculator`
- `/saas-metrics/cohort-ltv-forecast-calculator`
- `/saas-metrics/ltv-to-cac-calculator`
- `/saas-metrics/unit-economics-calculator`

Supporting glossary:

- `/glossary/ltv`
- `/glossary/customer-lifetime`
- `/glossary/cohorted-ltv`
- `/glossary/churn-rate`
- `/glossary/logo-churn`
- `/glossary/gross-margin`
- `/glossary/arpa`
- `/glossary/ltv-to-cac`

**Important Structural Rule**

`ltv-cac-guide` is a bridge page between the CAC and LTV clusters. The current shared page model only supports one `partOfGuideSlug`, so this page should remain attached to `cac-guide` for the "part of this topic" block. The LTV pillar should still surface it prominently in the topic hub and related links because it is the main "what do I do with this LTV number" follow-up.

**Content Strategy**

The parent page should stop behaving like a short formula explainer and instead act like a decision guide:

- what LTV means,
- which shortcut is acceptable and when it breaks,
- why gross margin and churn definitions matter,
- when customer lifetime is the right next step,
- when cohort-based LTV is the right next step,
- when to move from LTV into LTV:CAC or payback.

The spokes should stay distinct:

- `ltv-sensitivity-guide`: how fragile LTV is to churn and margin assumptions
- `customer-lifetime-guide`: how to estimate survival duration and where the shortcut breaks
- `cohort-ltv-forecast-guide`: when the shortcut is too thin and a cohort model is needed
- glossary `ltv`: fast definition plus CTA to the full LTV guide

**Metadata Strategy**

The parent should target broad LTV intent. The spokes should target narrower sub-intents such as:

- LTV formula and assumptions
- churn and margin sensitivity
- customer lifetime estimation
- cohort-based LTV modeling

Avoid repeating the same "LTV formula" language across every page.

**Internal Linking Strategy**

On the parent page:

- show a topic hub with the main guides, calculators, and glossary pages,
- frame each spoke as the next decision, not just a related article.

On spoke pages:

- add `partOfGuideSlug: "ltv-guide"` to the direct LTV spokes,
- let the shared guide template render the topic relationship.

On glossary:

- add a hero note and CTA back to `ltv-guide`.

**Scope Guardrails**

This pass should not:

- create new URLs,
- replace the broader `unit-economics-guide`,
- rewrite CAC pages again unless a link dependency absolutely requires it,
- try to solve every retention page in one batch.

**Success Criteria**

- `ltv-guide` reads like the obvious parent page for lifetime-value intent.
- Direct LTV spokes visibly route back to the parent.
- The LTV glossary definition sends users to the full guide.
- The cluster clarifies the path from quick shortcut -> better assumptions -> cohort model -> unit economics decision.
- The site becomes more coherent as another pillar in the SaaS metrics stack is tightened.
