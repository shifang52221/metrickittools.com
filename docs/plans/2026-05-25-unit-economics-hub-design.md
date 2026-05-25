# Unit Economics Hub Design

**Date:** 2026-05-25

**Goal**

Upgrade the existing `unit-economics-guide` into a higher-level decision hub that connects the major SaaS metrics clusters already improved on the site: ARR, CAC, LTV, payback, and LTV:CAC.

**Why This Is The Right Next Move**

The site now has stronger parent pages for ARR, CAC, and LTV. The next highest-leverage step is not another isolated metric page. It is a clearer top-layer page that explains how these metrics work together in real operating decisions. That gives users a better map, strengthens internal linking across the best pages, and helps search engines see a more coherent information architecture.

**Primary User Task**

Help a user answer one operating question:

"How do I use CAC, LTV, payback, and ARR together to judge whether growth is healthy and cash-efficient?"

That task is different from the lower-level pages because it is not mainly definitional. It is comparative and decision-oriented.

**Chosen Approach**

Upgrade the existing `unit-economics-guide` instead of creating a new URL.

This is the best route because:

- the URL already matches the broad topic,
- it avoids splitting broad unit-economics intent across overlapping hub pages,
- it lets the stronger sub-clusters feed upward into one clear parent,
- it keeps the architecture flatter and easier to crawl.

**Information Architecture**

Parent:

- `/guides/unit-economics-guide`

Primary child pages surfaced in the topic hub:

- `/guides/cac-guide`
- `/guides/cac-payback-guide`
- `/guides/ltv-guide`
- `/guides/ltv-cac-guide`
- `/guides/arr-guide`
- `/guides/unit-economics-dashboard-guide`

Primary calculators surfaced in the topic hub:

- `/saas-metrics/unit-economics-calculator`
- `/saas-metrics/cac-calculator`
- `/saas-metrics/cac-payback-period-calculator`
- `/saas-metrics/ltv-calculator`
- `/saas-metrics/ltv-to-cac-calculator`
- `/saas-metrics/arr-calculator`

Supporting glossary surfaced in the topic hub:

- `/glossary/unit-economics`
- `/glossary/cac`
- `/glossary/ltv`
- `/glossary/ltv-to-cac`
- `/glossary/cac-payback-period`
- `/glossary/gross-margin`
- `/glossary/arr`

**Important Structural Rule**

This page is a top-layer guide, not a replacement for ARR, CAC, or LTV parent pages. It should point down into those pages for full detail rather than swallowing them into one huge article.

**Content Strategy**

The upgraded parent page should be organized around decision flow:

- what unit economics is really for,
- which metrics are first-order vs supporting,
- how ARR, CAC, LTV, payback, and LTV:CAC interact,
- which metric to trust for which decision,
- common mismatches that create fake confidence,
- where to go next depending on the question.

It should not become a second version of each spoke page. Instead:

- ARR explains recurring scale and growth quality,
- CAC explains acquisition cost definition and measurement,
- LTV explains value estimation and model confidence,
- payback explains cash timing,
- LTV:CAC explains sustainability,
- the dashboard page explains ongoing operational diagnosis.

**Metadata Strategy**

The page should move away from a generic “how to model them” framing and toward a broader operational decision framing. The title and description should speak to growth quality, cash efficiency, and the way these metrics work together.

**Internal Linking Strategy**

On `unit-economics-guide`:

- add a topic hub block listing the best parent/spoke pages and calculators,
- add clearer section-level transitions that point readers into ARR, CAC, LTV, payback, or the dashboard depending on what they are solving.

On the glossary `unit-economics` entry:

- add a hero note and CTA back to the upgraded parent guide.

We do not need to add `partOfGuideSlug` to ARR, CAC, or LTV parent pages. This hub should function as a navigational and conceptual parent, not a template-level “part of this topic” owner.

**Scope Guardrails**

This pass should not:

- create a new hub URL,
- rewrite the entire dashboard guide,
- move existing pages to new parents,
- turn the guide into a giant encyclopedic page.

**Success Criteria**

- `unit-economics-guide` reads like the best top-level entry point for SaaS growth efficiency decisions.
- It clearly points into ARR, CAC, LTV, payback, and LTV:CAC without duplicating those pages.
- The glossary entry for `unit-economics` becomes a more effective feeder page.
- Internal linking between the strongest SaaS metrics pages becomes more coherent at the site level.
