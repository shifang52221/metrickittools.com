import type { GlossaryTerm } from "../types";

export const termsCore: GlossaryTerm[] = [
  {
    slug: "arr",
    title: "ARR (Annual Recurring Revenue)",
    description:
      "ARR is an annualized recurring revenue run-rate (typically MRR × 12). Definition, formula, example, and common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARR (Annual Recurring Revenue) is the annualized run-rate of your recurring subscription revenue. It is a snapshot of current recurring momentum, not a promise of what you'll recognize over the next 12 months.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "ARR = MRR × 12" },
      { type: "h2", text: "Example" },
      {
        type: "p",
        text: "If your MRR is $200,000, your ARR is $2,400,000. With annual prepaid plans, cash can spike while ARR moves based on recurring run-rate.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Treating ARR as recognized revenue for the next year.",
          "Including one-time fees or services revenue in ARR.",
          "Comparing bookings to ARR without normalizing one-time items and term length.",
        ],
      },
    ],
    relatedGuideSlugs: ["arr-guide", "mrr-guide"],
    relatedCalculatorSlugs: [
      "arr-calculator",
      "mrr-calculator",
      "arr-valuation-calculator",
    ],
  },
  {
    slug: "mrr",
    title: "MRR (Monthly Recurring Revenue)",
    description:
      "MRR is recurring subscription revenue expected in a month. Learn components, how to measure it, and pitfalls.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "MRR (Monthly Recurring Revenue) is the recurring subscription revenue you expect from active customers in a given month. It is a standard operating metric for subscription businesses because it updates quickly and connects to retention and expansion.",
      },
      { type: "h2", text: "Common components" },
      {
        type: "bullets",
        items: [
          "New MRR: from new customers.",
          "Expansion MRR: upgrades, more seats, add-ons.",
          "Contraction MRR: downgrades, seat reductions.",
          "Churned MRR: cancellations and lost recurring revenue.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Including one-time revenue in MRR.",
          "Mixing revenue recognition with billing/cash timing.",
          "Changing definitions month-to-month (breaking trend analysis).",
        ],
      },
    ],
    relatedGuideSlugs: ["mrr-guide", "arr-guide"],
    relatedCalculatorSlugs: ["mrr-calculator", "arr-calculator"],
  },
  {
    slug: "arpu",
    title: "ARPU (Average Revenue Per User)",
    description:
      "ARPU is revenue divided by average active users for a period. Learn formula, example, and common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARPU (Average Revenue Per User) measures monetization by dividing revenue by the average number of active users in the same period. Use it to track pricing, packaging, and monetization changes over time.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "ARPU = revenue ÷ average active users" },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using total signups instead of active users.",
          "Comparing ARPU across periods with different 'active' definitions.",
          "Using ARPU when pricing is per account (ARPA fits better).",
        ],
      },
    ],
    relatedGuideSlugs: ["arpu-guide", "ltv-guide"],
    relatedCalculatorSlugs: ["arpu-calculator", "ltv-calculator"],
  },
  {
    slug: "cac",
    title: "CAC (Customer Acquisition Cost)",
    description:
      "CAC is acquisition spend divided by new paying customers. Learn the formula, what to include, and how to segment CAC.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "CAC (Customer Acquisition Cost) is the cost to acquire a new paying customer. CAC is most useful when paired with payback or LTV and when the definition stays consistent over time.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "CAC = acquisition spend ÷ new customers acquired" },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using leads or trials as 'customers'.",
          "Mixing paid-only CAC and fully-loaded CAC without labeling.",
          "Ignoring churn and gross margin when judging CAC.",
        ],
      },
    ],
    relatedGuideSlugs: ["cac-guide", "cac-payback-guide"],
    relatedCalculatorSlugs: ["cac-calculator", "cac-payback-period-calculator"],
  },
  {
    slug: "roas",
    title: "ROAS (Return on Ad Spend)",
    description:
      "ROAS is revenue generated per dollar of ad spend. Learn ROAS formula and how it connects to break-even and target ROAS.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ROAS (Return on Ad Spend) measures attributed revenue divided by ad spend. It helps compare campaigns, but it can mislead if you ignore margin, returns, fees, and attribution.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "ROAS = attributed revenue ÷ ad spend" },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using ROAS without margin (profitability blind).",
          "Comparing ROAS across channels with different attribution windows.",
          "Optimizing short-window ROAS and hurting long-term LTV.",
        ],
      },
    ],
    relatedGuideSlugs: ["roas-guide", "break-even-roas-guide", "target-roas-guide"],
    relatedCalculatorSlugs: [
      "roas-calculator",
      "break-even-roas-calculator",
      "target-roas-calculator",
    ],
  },
];

