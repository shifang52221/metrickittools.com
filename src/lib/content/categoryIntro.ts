import type { CalculatorCategorySlug } from "@/lib/calculators/types";

export type CategoryIntroBlock = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const categoryIntroBlocks: Record<CalculatorCategorySlug, CategoryIntroBlock[]> =
  {
    "saas-metrics": [
      {
        title: "How to use SaaS metrics",
        paragraphs: [
          "SaaS metrics are only useful when the definitions are consistent. Pick a handful of core metrics (CAC, payback, retention, and LTV) and track them for the same customer segment and time window.",
          "Use these calculators as a fast sanity-check, then validate decisions with cohort data when you have enough volume.",
        ],
        bullets: [
          "Start with CAC and payback to understand cash efficiency.",
          "Use churn/retention to understand whether growth will get harder over time.",
          "Use LTV and LTV:CAC to translate retention into long-term economics.",
        ],
      },
      {
        title: "Common pitfalls",
        paragraphs: [
          "Most teams get misled by mismatched definitions: mixing gross vs net revenue, using different time windows, or comparing paid-only CAC to an LTV model that assumes fully-loaded costs.",
        ],
        bullets: [
          "Mixing customer churn with revenue retention without calling it out.",
          "Using different periods for spend and customers (e.g., quarterly spend with monthly signups).",
          "Ignoring segment differences (SMB vs enterprise, self-serve vs sales-led).",
        ],
      },
    ],
    "paid-ads": [
      {
        title: "How to use paid ads metrics",
        paragraphs: [
          "Paid ads metrics are decision tools: they help you decide whether to scale, pause, or change creative/targeting. The key is to compare apples to apples (same attribution window, same conversion definition, same revenue basis).",
          "ROAS is a fast way to compare campaigns, but profitability depends on margin, fees, returns, and the time it takes to realize revenue.",
        ],
        bullets: [
          "Use ROAS for campaign iteration and channel comparisons.",
          "Use break-even and target ROAS to set guardrails based on contribution margin.",
          "Validate with incrementality when accounts mature (holdouts / lift tests).",
        ],
      },
      {
        title: "Common pitfalls",
        paragraphs: [
          "A 'good' ROAS can still lose money if costs are missing or if revenue is overstated by attribution. Always be explicit about your attribution rule and your cost basis.",
        ],
        bullets: [
          "Mixing platform reporting and analytics without a consistent rule.",
          "Ignoring discounts, refunds, shipping, payment fees, and COGS.",
          "Using short windows for products with long consideration cycles.",
        ],
      },
    ],
    finance: [
      {
        title: "How to use finance calculators",
        paragraphs: [
          "Finance calculators help you make operational decisions: pricing, margin, and cost structure. The most useful models are simple enough to update whenever inputs change.",
          "Break-even revenue is a quick way to understand the minimum revenue required to cover fixed costs at a given gross margin.",
        ],
        bullets: [
          "Use gross or contribution margin (not net margin) for break-even models.",
          "Revisit fixed costs regularly as headcount and tooling change.",
          "Use scenarios (best/base/worst) instead of a single point estimate.",
        ],
      },
    ],
  };

export function getCategoryIntroBlocks(
  category: CalculatorCategorySlug,
): CategoryIntroBlock[] {
  return categoryIntroBlocks[category] ?? [];
}

