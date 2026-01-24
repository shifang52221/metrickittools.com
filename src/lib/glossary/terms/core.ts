import type { GlossaryTerm } from "../types";

export const termsCore: GlossaryTerm[] = [
  {
    slug: "arr",
    title: "ARR (Annual Recurring Revenue)",
    description:
      "ARR is an annualized recurring revenue run-rate (typically MRR * 12). Definition, formula, example, and common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARR (Annual Recurring Revenue) is the annualized run-rate of your recurring subscription revenue. It is a snapshot of current recurring momentum, not a promise of what you'll recognize over the next 12 months.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "ARR = MRR * 12" },
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
    faqs: [
      {
        question: "ARR vs revenue: are they the same?",
        answer:
          "No. ARR is a run-rate snapshot based on recurring subscription revenue. Revenue is what you recognize over a period under accounting rules.",
      },
      {
        question: "Should ARR include one-time fees or services?",
        answer:
          "Usually no. ARR is typically reserved for recurring subscription revenue to keep it comparable over time.",
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
    faqs: [
      {
        question: "What's the difference between MRR and cash collected?",
        answer:
          "MRR is a recurring run-rate metric. Cash can be lumpy (annual prepay, timing), so cash collections can move differently than MRR.",
      },
      {
        question: "Should MRR include discounts and credits?",
        answer:
          "Use a consistent policy. Most teams report MRR net of recurring discounts and exclude one-time credits so trends remain comparable.",
      },
    ],
    relatedGuideSlugs: ["mrr-guide", "mrr-forecast-guide", "arr-guide"],
    relatedCalculatorSlugs: [
      "mrr-calculator",
      "mrr-forecast-calculator",
      "arr-calculator",
    ],
  },
  {
    slug: "cmgr",
    title: "CMGR (Compound Monthly Growth Rate)",
    description:
      "CMGR is the compounded monthly growth rate between a starting value and an ending value over N months.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "CMGR (Compound Monthly Growth Rate) answers: if growth were smooth and compounded monthly, what constant monthly rate would turn the starting value into the ending value over the chosen number of months?",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "CMGR = (ending / starting)^(1 / months) - 1",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "Use CMGR to compare scenarios over different horizons (it normalizes to a monthly rate).",
          "Use CMGR for topline metrics like MRR, revenue, users, or traffic, but pair it with retention and margin for business quality.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using CMGR when the starting value is near zero (results explode).",
          "Assuming CMGR will continue indefinitely (small differences compound).",
          "Confusing CMGR with simple average monthly change (compounding matters).",
        ],
      },
    ],
    faqs: [
      {
        question: "When should I not use CMGR?",
        answer:
          "Avoid CMGR when the starting value is near zero (the math explodes) or when growth is highly seasonal. Use supporting metrics and context.",
      },
    ],
    relatedGuideSlugs: ["mrr-forecast-guide"],
    relatedCalculatorSlugs: ["mrr-forecast-calculator"],
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
      { type: "p", text: "ARPU = revenue / average active users" },
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
      { type: "p", text: "CAC = acquisition spend / new customers acquired" },
      { type: "h2", text: "Example" },
      {
        type: "p",
        text: "If you spent $120,000 on acquisition in a month and acquired 80 new paying customers, CAC = $120,000 / 80 = $1,500.",
      },
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
    faqs: [
      {
        question: "Paid CAC vs fully-loaded CAC: which should I use?",
        answer:
          "Use fully-loaded CAC for planning and board-level truth (it includes more acquisition costs like sales/marketing salaries and tooling). Use paid CAC for channel optimization, but keep definitions consistent.",
      },
      {
        question: "How do I segment CAC correctly?",
        answer:
          "Segment by channel and by customer type (plan, company size) because CAC and retention vary widely. Blended CAC can hide unprofitable segments.",
      },
    ],
    relatedGuideSlugs: ["cac-guide", "blended-cac-guide", "cac-payback-guide"],
    relatedCalculatorSlugs: [
      "cac-calculator",
      "blended-cac-calculator",
      "cac-payback-period-calculator",
    ],
  },
  {
    slug: "fully-loaded-cac",
    title: "Fully-loaded CAC",
    description:
      "Fully-loaded CAC includes more of your acquisition costs (often sales & marketing salaries and tools) to make CAC planning-grade for unit economics.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Fully-loaded CAC extends paid CAC by including additional acquisition costs beyond paid media-commonly sales & marketing salaries, commissions, and tooling-so the metric reflects the true cost to acquire a customer for planning and unit economics.",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Fully-loaded CAC = total acquisition costs / new paying customers acquired (same period)",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing paid-only CAC and fully-loaded CAC without labeling and consistency.",
          "Including costs that aren't acquisition-related (COGS, R&D) without a clear allocation method.",
          "Comparing fully-loaded CAC to revenue-only payback or revenue LTV (use gross profit where appropriate).",
        ],
      },
    ],
    relatedGuideSlugs: ["fully-loaded-cac-guide", "cac-guide", "cac-payback-guide"],
    relatedCalculatorSlugs: [
      "fully-loaded-cac-calculator",
      "cac-calculator",
      "cac-payback-period-calculator",
    ],
  },
  {
    slug: "ltv",
    title: "LTV (Lifetime Value)",
    description:
      "LTV estimates the value a customer generates over their lifetime. For unit economics, gross profit LTV is usually more useful than revenue LTV.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "LTV (Lifetime Value) is the total value you expect from a customer over their lifetime. It's often used to set acquisition targets (CAC/CPA) and to evaluate payback and growth efficiency. Because costs matter, many teams prefer gross profit LTV (revenue * gross margin over the lifetime).",
      },
      { type: "h2", text: "Common formulas (shortcuts)" },
      {
        type: "bullets",
        items: [
          "Revenue LTV ~ ARPA / churn (with consistent time units).",
          "Gross profit LTV ~ (ARPA * gross margin) / churn.",
          "Cohort-based LTV: sum observed gross profit over time from real cohorts (more accurate).",
        ],
      },
      { type: "h2", text: "Example" },
      {
        type: "p",
        text: "If ARPA is $500/month, gross margin is 80% (0.8), and monthly churn is 2% (0.02), then gross profit LTV ~ ($500 * 0.8) / 0.02 = $20,000.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue LTV while comparing to fully-loaded CAC (mismatch).",
          "Mixing monthly churn with annual ARPA (time unit mismatch).",
          "Ignoring expansion or contraction when it materially affects retention dynamics.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should LTV be based on revenue or gross profit?",
        answer:
          "For unit economics decisions (CAC, payback), gross profit LTV is usually more useful because it reflects the cash you can use to recover acquisition costs.",
      },
      {
        question: "Why does LTV sometimes look unrealistically high?",
        answer:
          "The common shortcut LTV ~ ARPA / churn assumes constant churn. If churn is very low, small measurement errors can explode the estimate. Cohort-based LTV is more reliable.",
      },
    ],
    relatedGuideSlugs: [
      "ltv-guide",
      "cohort-ltv-forecast-guide",
      "target-cpa-guide",
      "blended-cac-guide",
    ],
    relatedCalculatorSlugs: [
      "ltv-calculator",
      "cohort-ltv-forecast-calculator",
      "target-cpa-ltv-calculator",
      "ltv-to-cac-calculator",
    ],
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
      { type: "p", text: "ROAS = attributed revenue / ad spend" },
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
    faqs: [
      {
        question: "What's the difference between ROAS and ROI?",
        answer:
          "ROAS is revenue divided by ad spend. ROI is profit relative to total cost. You can have high ROAS and still lose money if margins or costs are poor.",
      },
      {
        question: "Should I optimize for break-even ROAS or target ROAS?",
        answer:
          "Use break-even ROAS to avoid losing money on variable economics. Use target ROAS when you need a profit buffer and want to cover overhead and volatility.",
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
