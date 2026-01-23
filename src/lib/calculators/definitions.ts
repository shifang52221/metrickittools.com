import type { CalculatorCategory, CalculatorDefinition } from "./types";

function safeDivide(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (denominator === 0) return null;
  return numerator / denominator;
}

export const categories: CalculatorCategory[] = [
  {
    slug: "saas-metrics",
    title: "SaaS Metrics",
    description: "Core SaaS unit economics and retention metrics.",
  },
  {
    slug: "paid-ads",
    title: "Paid Ads",
    description: "Ad performance and profitability calculators.",
  },
  {
    slug: "finance",
    title: "Finance",
    description: "Simple financial planning calculators.",
  },
];

export const calculators: CalculatorDefinition[] = [
  {
    slug: "roas-calculator",
    title: "ROAS Calculator",
    description: "Calculate Return on Ad Spend (ROAS) as a multiple and percent.",
    category: "paid-ads",
    featured: true,
    guideSlug: "roas-guide",
    inputs: [
      {
        key: "revenue",
        label: "Revenue attributed to ads",
        help: "Use the same attribution model you use for reporting.",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
      },
      {
        key: "adSpend",
        label: "Ad spend",
        placeholder: "1000",
        prefix: "$",
        defaultValue: "1000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const roasMultiple = safeDivide(values.revenue, values.adSpend);
      if (values.adSpend <= 0) warnings.push("Ad spend must be greater than 0.");
      if (roasMultiple === null) {
        return {
          headline: {
            key: "roas",
            label: "ROAS",
            value: 0,
            format: "multiple",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "roas",
          label: "ROAS",
          value: roasMultiple,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "Revenue ÷ Ad spend",
        },
        secondary: [
          {
            key: "roasPercent",
            label: "ROAS (%)",
            value: roasMultiple,
            format: "percent",
            maxFractionDigits: 0,
            detail: "Shown as a percentage of spend",
          },
        ],
        breakdown: [
          {
            key: "revenue",
            label: "Revenue",
            value: values.revenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "adSpend",
            label: "Ad spend",
            value: values.adSpend,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "ROAS = Revenue ÷ Ad Spend",
    assumptions: [
      "Revenue and spend are measured over the same time window.",
      "Revenue is net of refunds/returns if you want ROAS to reflect reality.",
      "ROAS depends on your attribution model and conversion window.",
    ],
    faqs: [
      {
        question: "What is a good ROAS?",
        answer:
          "It depends on your margins, fulfillment costs, and fixed costs. A ROAS that looks 'good' can still lose money if margins are low.",
      },
      {
        question: "What's the difference between ROAS and ROI?",
        answer:
          "ROAS is revenue divided by ad spend. ROI is profit relative to cost. ROAS can look great while ROI is negative if margins or costs are poor.",
      },
      {
        question: "Can I use ROAS for subscription businesses?",
        answer:
          "Yes, but pair ROAS with CAC, payback period, and retention since revenue recurs over time and churn can change profitability.",
      },
    ],
    guide: [
      {
        title: "How to use ROAS",
        bullets: [
          "Use the same attribution model as your ad platform or analytics reports.",
          "Compare ROAS by channel, campaign, and creative to spot winners.",
          "Always pair ROAS with margin to avoid 'profitable-looking' losses.",
        ],
      },
      {
        title: "Common pitfalls",
        bullets: [
          "Mixing attribution windows (e.g., 7‑day click vs. 1‑day view).",
          "Ignoring returns, discounts, shipping, and payment fees.",
          "Counting revenue but excluding subscription churn impact.",
        ],
      },
    ],
  },
  {
    slug: "break-even-roas-calculator",
    title: "Break-even ROAS Calculator",
    description:
      "Estimate the break-even ROAS based on contribution margin assumptions.",
    category: "paid-ads",
    featured: true,
    guideSlug: "break-even-roas-guide",
    inputs: [
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        help: "Your product gross margin before marketing (COGS only).",
        placeholder: "60",
        suffix: "%",
        defaultValue: "60",
      },
      {
        key: "paymentFeesPercent",
        label: "Payment fees",
        help: "Card/processing fees as % of revenue (optional).",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
      },
      {
        key: "shippingPercent",
        label: "Shipping & fulfillment",
        help: "As % of revenue (optional).",
        placeholder: "0",
        suffix: "%",
        defaultValue: "0",
      },
      {
        key: "returnsPercent",
        label: "Returns & refunds",
        help: "As % of revenue (optional).",
        placeholder: "0",
        suffix: "%",
        defaultValue: "0",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const contributionMargin =
        (values.grossMarginPercent -
          values.paymentFeesPercent -
          values.shippingPercent -
          values.returnsPercent) /
        100;

      if (contributionMargin <= 0) {
        warnings.push(
          "Contribution margin must be greater than 0. Check your inputs.",
        );
        return {
          headline: {
            key: "breakevenRoas",
            label: "Break-even ROAS",
            value: 0,
            format: "multiple",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }

      const breakevenRoas = 1 / contributionMargin;

      return {
        headline: {
          key: "breakevenRoas",
          label: "Break-even ROAS",
          value: breakevenRoas,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "1 / contribution margin",
        },
        secondary: [
          {
            key: "contributionMargin",
            label: "Contribution margin",
            value: contributionMargin,
            format: "percent",
            maxFractionDigits: 1,
            detail: "Gross margin - fees - shipping - returns",
          },
        ],
        breakdown: [
          {
            key: "grossMarginPercent",
            label: "Gross margin",
            value: values.grossMarginPercent / 100,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "paymentFeesPercent",
            label: "Payment fees",
            value: values.paymentFeesPercent / 100,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "shippingPercent",
            label: "Shipping & fulfillment",
            value: values.shippingPercent / 100,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "returnsPercent",
            label: "Returns & refunds",
            value: values.returnsPercent / 100,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula: "Break-even ROAS = 1 / (Contribution margin)",
    assumptions: [
      "This is a simplified contribution-margin model (not a full P&L).",
      "All inputs are expressed as a percent of revenue and are additive.",
    ],
    faqs: [
      {
        question: "Is break-even ROAS the same as target ROAS?",
        answer:
          "No. Break-even ROAS is the minimum ROAS to avoid losses on variable economics. Target ROAS should be higher to cover fixed costs and desired profit.",
      },
      {
        question: "Should I include fixed costs in break-even ROAS?",
        answer:
          "Not in this simplified model. Fixed costs are better handled by setting a higher target ROAS or by modeling contribution profit needed to cover fixed costs.",
      },
    ],
    guide: [
      {
        title: "How to use break-even ROAS",
        bullets: [
          "Use contribution margin, not net margin.",
          "Add payment fees, shipping, and returns if they scale with revenue.",
          "Treat this as a floor; set a higher target ROAS for growth.",
        ],
      },
    ],
  },
  {
    slug: "target-roas-calculator",
    title: "Target ROAS Calculator",
    description:
      "Estimate a target ROAS to cover variable costs plus a desired margin buffer.",
    category: "paid-ads",
    featured: true,
    guideSlug: "target-roas-guide",
    inputs: [
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        help: "Gross margin before marketing (COGS only).",
        placeholder: "60",
        suffix: "%",
        defaultValue: "60",
      },
      {
        key: "paymentFeesPercent",
        label: "Payment fees",
        help: "As % of revenue (optional).",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
      },
      {
        key: "shippingPercent",
        label: "Shipping & fulfillment",
        help: "As % of revenue (optional).",
        placeholder: "0",
        suffix: "%",
        defaultValue: "0",
      },
      {
        key: "returnsPercent",
        label: "Returns & refunds",
        help: "As % of revenue (optional).",
        placeholder: "0",
        suffix: "%",
        defaultValue: "0",
      },
      {
        key: "fixedCostPercent",
        label: "Fixed cost allocation",
        help: "If you want ROAS to cover fixed costs, allocate them as % of revenue.",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
      },
      {
        key: "desiredProfitPercent",
        label: "Desired profit margin",
        help: "Extra buffer as % of revenue (optional).",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const contributionMargin =
        (values.grossMarginPercent -
          values.paymentFeesPercent -
          values.shippingPercent -
          values.returnsPercent) /
        100;

      const fixed = values.fixedCostPercent / 100;
      const desired = values.desiredProfitPercent / 100;
      const availableForAds = contributionMargin - fixed - desired;

      if (contributionMargin <= 0) {
        warnings.push(
          "Contribution margin must be greater than 0. Check your inputs.",
        );
      }
      if (availableForAds <= 0) {
        warnings.push(
          "Contribution margin is not enough to cover fixed costs and desired profit. Reduce allocations or improve margin.",
        );
      }

      const targetRoas = availableForAds > 0 ? 1 / availableForAds : 0;

      return {
        headline: {
          key: "targetRoas",
          label: "Target ROAS",
          value: targetRoas,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "1 / (contribution margin - fixed - desired)",
        },
        secondary: [
          {
            key: "availableForAds",
            label: "Budget for ads (as % of revenue)",
            value: Math.max(availableForAds, 0),
            format: "percent",
            maxFractionDigits: 1,
            detail: "Contribution margin minus allocations",
          },
          {
            key: "contributionMargin",
            label: "Contribution margin",
            value: Math.max(contributionMargin, 0),
            format: "percent",
            maxFractionDigits: 1,
            detail: "Gross margin - fees - shipping - returns",
          },
        ],
        warnings,
      };
    },
    formula:
      "Target ROAS = 1 / (Contribution margin - Fixed cost allocation - Desired profit margin)",
    assumptions: [
      "All inputs are expressed as a percent of revenue.",
      "Fixed costs are represented as an allocation; this is a planning model (not a full P&L).",
    ],
    faqs: [
      {
        question: "How do I choose a fixed cost allocation?",
        answer:
          "Pick a conservative percent based on your business: total fixed costs divided by your expected revenue in the same period. Keep it stable for comparisons.",
      },
      {
        question: "Why can't I get a target ROAS?",
        answer:
          "If contribution margin minus allocations is <= 0, your unit economics can't support the chosen buffers. Reduce fixed/profit allocations or improve margin.",
      },
    ],
    guide: [
      {
        title: "How to set a target ROAS",
        bullets: [
          "Start from contribution margin, then decide how much revenue must cover fixed costs and profit.",
          "Use different targets by channel if volatility differs.",
          "Revisit targets when margins or fulfillment costs change.",
        ],
      },
    ],
  },
  {
    slug: "roi-calculator",
    title: "ROI Calculator",
    description: "Calculate Return on Investment (ROI) for a campaign or project.",
    category: "paid-ads",
    featured: true,
    guideSlug: "roi-guide",
    inputs: [
      {
        key: "revenue",
        label: "Revenue",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
      },
      {
        key: "cost",
        label: "Total cost",
        help: "Include ad spend, tools, and labor if applicable.",
        placeholder: "3000",
        prefix: "$",
        defaultValue: "3000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const profit = values.revenue - values.cost;
      const roi = safeDivide(profit, values.cost);
      if (values.cost <= 0) warnings.push("Total cost must be greater than 0.");
      if (roi === null) {
        return {
          headline: {
            key: "roi",
            label: "ROI",
            value: 0,
            format: "percent",
            maxFractionDigits: 1,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "roi",
          label: "ROI",
          value: roi,
          format: "percent",
          maxFractionDigits: 1,
          detail: "(Revenue - Cost) / Cost",
        },
        secondary: [
          {
            key: "profit",
            label: "Profit",
            value: profit,
            format: "currency",
            currency: "USD",
            detail: "Revenue - Cost",
          },
          {
            key: "multiple",
            label: "Return multiple",
            value: safeDivide(values.revenue, values.cost) ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Revenue / Cost",
          },
        ],
        warnings,
      };
    },
    formula: "ROI = (Revenue - Cost) / Cost",
    assumptions: [
      "Revenue and cost are measured over the same time window.",
      "Cost includes all incremental costs you attribute to the initiative.",
    ],
    faqs: [
      {
        question: "Is ROI the same as ROAS?",
        answer:
          "No. ROAS is typically revenue divided by ad spend, while ROI uses profit (revenue minus cost) divided by cost.",
      },
    ],
    guide: [
      {
        title: "How to interpret ROI",
        bullets: [
          "ROI focuses on profit relative to cost; it's stricter than ROAS.",
          "Use a consistent cost definition (include tools/labor if you decide to).",
          "Compare ROI across initiatives using the same timeframe.",
        ],
      },
      {
        title: "Common pitfalls",
        bullets: [
          "Leaving out 'hidden' costs like agency fees or salaries.",
          "Using lifetime revenue for some campaigns but not others.",
          "Comparing ROI with different attribution rules.",
        ],
      },
    ],
  },
  {
    slug: "cac-calculator",
    title: "CAC Calculator",
    description:
      "Calculate Customer Acquisition Cost (CAC) from total acquisition spend and new customers.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "cac-guide",
    seo: {
      intro: [
        "Customer Acquisition Cost (CAC) is the average cost to acquire one new paying customer. It is a core SaaS unit-economics metric used to evaluate channel efficiency and plan budgets.",
        "The key is consistency: define what costs you include and what counts as a “new customer”, then use the same definition across time and segments.",
      ],
      steps: [
        "Pick a time window (month/quarter) and a segment (channel, plan, geo).",
        "Sum acquisition costs for that same window using a consistent definition (paid-only or fully-loaded).",
        "Count net new paying customers acquired in the window (not leads).",
        "Divide acquisition spend by new customers to get CAC.",
      ],
      pitfalls: [
        "Using leads or trials as the denominator instead of paying customers.",
        "Mixing paid-only CAC with fully-loaded CAC when comparing channels.",
        "Comparing CAC across periods without accounting for channel mix changes.",
      ],
    },
    inputs: [
      {
        key: "spend",
        label: "Sales + marketing spend",
        placeholder: "20000",
        prefix: "$",
        defaultValue: "20000",
      },
      {
        key: "newCustomers",
        label: "New customers acquired",
        placeholder: "40",
        defaultValue: "40",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const cac = safeDivide(values.spend, values.newCustomers);
      if (values.newCustomers <= 0)
        warnings.push("New customers must be greater than 0.");
      if (cac === null) {
        return {
          headline: {
            key: "cac",
            label: "CAC",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }
      return {
        headline: {
          key: "cac",
          label: "CAC",
          value: cac,
          format: "currency",
          currency: "USD",
          detail: "Spend ÷ New customers",
        },
        breakdown: [
          {
            key: "spend",
            label: "Spend",
            value: values.spend,
            format: "currency",
            currency: "USD",
          },
          {
            key: "newCustomers",
            label: "New customers",
            value: values.newCustomers,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula: "CAC = Sales & Marketing Spend ÷ New Customers",
    assumptions: [
      "Spend and new customers are measured over the same time window.",
      "New customers means net new paying customers (not leads or trials).",
      "Use a consistent cost definition (paid-only vs fully-loaded).",
      "Exclude retention costs unless you explicitly allocate them.",
    ],
    faqs: [
      {
        question: "Should I include salaries in CAC?",
        answer:
          "Many teams include the portion of sales/marketing salaries and tools attributable to acquisition; keep your definition consistent over time.",
      },
      {
        question: "What's the difference between paid CAC and blended CAC?",
        answer:
          "Paid CAC uses only paid acquisition spend (ads). Blended CAC includes all acquisition costs (paid + sales + marketing + tools) divided by new customers.",
      },
      {
        question: "Is CAC a good metric on its own?",
        answer:
          "Not by itself. Pair CAC with payback period and retention/LTV. A low CAC can still be bad if churn is high, and a high CAC can be fine if payback is fast and retention is strong.",
      },
      {
        question: "What if my sales cycle is long?",
        answer:
          "Match costs and customers using a consistent rule (e.g., cohort-based CAC, or lag spend by your average sales cycle) so CAC isn't artificially high or low in a given month.",
      },
    ],
    guide: [
      {
        title: "How to calculate CAC well",
        bullets: [
          "Use 'new customers acquired' for the same period as spend.",
          "Decide whether to include salaries/tools and stick to it consistently.",
          "Segment CAC by channel and customer type (SMB vs enterprise).",
        ],
      },
      {
        title: "What to pair with CAC",
        bullets: [
          "LTV and payback period determine if CAC is sustainable.",
          "Retention/churn explains whether CAC will rise over time.",
        ],
      },
      {
        title: "Common pitfalls",
        bullets: [
          "Mixing paid-only CAC with an LTV model that assumes fully-loaded costs.",
          "Counting trials/signups as customers (inflates performance).",
          "Ignoring channel mix changes (your blended CAC will drift).",
        ],
      },
    ],
  },
  {
    slug: "ltv-calculator",
    title: "LTV Calculator",
    description:
      "Estimate customer Lifetime Value (LTV) using ARPA, gross margin, and churn rate.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "ltv-guide",
    seo: {
      intro: [
        "This is a quick LTV (Lifetime Value) model based on monthly ARPA, gross margin, and churn. It estimates how much gross profit you earn per customer over their expected lifetime.",
        "For accuracy, keep time units consistent (monthly ARPA with monthly churn). For mature businesses, cohort-based LTV is more reliable than a single churn rate.",
      ],
      steps: [
        "Choose a segment (plan/channel/geo) and a time unit (monthly).",
        "Enter ARPA per month and gross margin for the segment.",
        "Enter monthly churn rate (customer churn for this model).",
        "Compute LTV ≈ (ARPA × gross margin) ÷ churn.",
      ],
      pitfalls: [
        "Mixing annual ARPA with monthly churn (unit mismatch).",
        "Using revenue churn/NRR numbers as if they were customer churn.",
        "Ignoring payback period and cash constraints when using LTV for budgeting.",
      ],
    },
    inputs: [
      {
        key: "arpaMonthly",
        label: "ARPA per month",
        help: "Average revenue per account (monthly).",
        placeholder: "200",
        prefix: "$",
        defaultValue: "200",
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
      },
      {
        key: "churnPercent",
        label: "Monthly churn",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const grossMargin = values.grossMarginPercent / 100;
      const churn = values.churnPercent / 100;
      if (grossMargin <= 0) warnings.push("Gross margin must be greater than 0.");
      if (churn <= 0) warnings.push("Churn must be greater than 0.");

      const ltv = safeDivide(values.arpaMonthly * grossMargin, churn);
      if (ltv === null) {
        return {
          headline: {
            key: "ltv",
            label: "LTV",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "ltv",
          label: "LTV",
          value: ltv,
          format: "currency",
          currency: "USD",
          detail: "(ARPA × Gross margin) ÷ Churn",
        },
        secondary: [
          {
            key: "grossProfitPerMonth",
            label: "Gross profit / month",
            value: values.arpaMonthly * grossMargin,
            format: "currency",
            currency: "USD",
          },
          {
            key: "avgLifetimeMonths",
            label: "Avg. lifetime (months)",
            value: safeDivide(1, churn) ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: "1 ÷ churn rate",
          },
        ],
        warnings,
      };
    },
    formula: "LTV = (ARPA × Gross Margin) ÷ Churn Rate",
    assumptions: [
      "Churn is steady over time (a simplifying assumption).",
      "ARPA and churn use the same time unit (monthly).",
    ],
    faqs: [
      {
        question: "Should I use revenue churn or customer churn?",
        answer:
          "This calculator uses customer churn for simplicity. For many SaaS businesses, revenue churn (NRR/GRR) is more representative.",
      },
    ],
    guide: [
      {
        title: "How to use this LTV model",
        bullets: [
          "Use a consistent time unit: monthly ARPA with monthly churn.",
          "Gross margin should reflect direct costs (COGS), not operating expenses.",
          "Treat this as a quick estimate; cohort-based LTV is more accurate.",
        ],
      },
      {
        title: "Common pitfalls",
        bullets: [
          "Using revenue churn (NRR/GRR) but labeling it as customer churn.",
          "Using annual churn with monthly ARPA (mismatched units).",
          "Ignoring expansion/upsell when churn is low.",
        ],
      },
    ],
  },
  {
    slug: "ltv-to-cac-calculator",
    title: "LTV:CAC Calculator",
    description: "Calculate the LTV to CAC ratio.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "ltv-cac-guide",
    inputs: [
      {
        key: "ltv",
        label: "LTV",
        placeholder: "5333",
        prefix: "$",
        defaultValue: "5333",
      },
      {
        key: "cac",
        label: "CAC",
        placeholder: "500",
        prefix: "$",
        defaultValue: "500",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const ratio = safeDivide(values.ltv, values.cac);
      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");
      if (ratio === null) {
        return {
          headline: {
            key: "ratio",
            label: "LTV:CAC",
            value: 0,
            format: "ratio",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "ratio",
          label: "LTV:CAC",
          value: ratio,
          format: "ratio",
          maxFractionDigits: 2,
          detail: "LTV ÷ CAC",
        },
        warnings,
      };
    },
    formula: "LTV:CAC = LTV ÷ CAC",
    assumptions: ["LTV and CAC are calculated consistently for the same segment."],
    faqs: [
      {
        question: "What is a good LTV:CAC ratio?",
        answer:
          "Many SaaS teams target ~3:1, but the right ratio depends on growth rate, cash constraints, churn, and channel mix.",
      },
    ],
    guide: [
      {
        title: "Benchmarks (rule of thumb)",
        bullets: [
          "Many SaaS teams target ~3:1, but it depends on growth and cash needs.",
          "Higher ratios can signal under-investment in growth.",
          "Lower ratios can be fine if payback is fast and churn is low.",
        ],
      },
    ],
  },
  {
    slug: "cac-payback-period-calculator",
    title: "CAC Payback Period Calculator",
    description:
      "Estimate how many months it takes to recover CAC (months to recover CAC) using gross profit.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "cac-payback-guide",
    seo: {
      intro: [
        "CAC payback period tells you how many months it takes to earn back CAC from monthly gross profit. It is one of the fastest ways to assess cash efficiency for subscription businesses.",
        "When people search “months to recover CAC”, they usually mean this payback period: CAC divided by gross profit per month.",
      ],
      steps: [
        "Choose a segment (channel/plan/geo) and a time window (usually monthly).",
        "Estimate ARPA per month for the segment.",
        "Choose gross margin for the same revenue base (product gross margin is common).",
        "Compute gross profit per month: ARPA × gross margin.",
        "Divide CAC by gross profit per month to get payback months.",
      ],
      benchmarks: [
        "Many B2B SaaS teams target ~6–18 months depending on stage and burn.",
        "Shorter payback reduces risk when channels fluctuate.",
        "Long payback can work if retention is strong and expansion revenue is significant.",
      ],
      pitfalls: [
        "Using revenue instead of gross profit (payback should reflect contribution).",
        "Ignoring churn: long payback + high churn can be unprofitable.",
        "Comparing payback across segments without consistent ARPA and margin definitions.",
      ],
    },
    inputs: [
      {
        key: "cac",
        label: "CAC",
        placeholder: "500",
        prefix: "$",
        defaultValue: "500",
      },
      {
        key: "arpaMonthly",
        label: "ARPA per month",
        placeholder: "200",
        prefix: "$",
        defaultValue: "200",
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const grossMargin = values.grossMarginPercent / 100;
      const grossProfitPerMonth = values.arpaMonthly * grossMargin;
      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");
      if (grossProfitPerMonth <= 0)
        warnings.push("Gross profit per month must be greater than 0.");

      const months = safeDivide(values.cac, grossProfitPerMonth);
      if (months === null) {
        return {
          headline: {
            key: "payback",
            label: "Payback period",
            value: 0,
            format: "months",
            maxFractionDigits: 1,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "payback",
          label: "Payback period",
          value: months,
          format: "months",
          maxFractionDigits: 1,
          detail: "CAC ÷ (ARPA × Gross margin)",
        },
        secondary: [
          {
            key: "grossProfitPerMonth",
            label: "Gross profit / month",
            value: grossProfitPerMonth,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Payback (months) = CAC ÷ (ARPA × Gross Margin)",
    assumptions: [
      "ARPA and gross margin remain stable over the payback period.",
    ],
    faqs: [
      {
        question: "Should payback include onboarding costs?",
        answer:
          "If onboarding costs are significant and variable per customer, include them in CAC so payback reflects full acquisition cost.",
      },
      {
        question: "How do I calculate months to recover CAC?",
        answer:
          "Compute gross profit per month (ARPA × gross margin), then divide CAC by gross profit per month. The result is the CAC payback period in months.",
      },
    ],
    guide: [
      {
        title: "How to calculate CAC payback",
        bullets: [
          "Pick a time window (usually month) and a segment (plan/channel/geo).",
          "Compute gross profit per month: ARPA × gross margin.",
          "Compute payback months: CAC ÷ gross profit per month.",
          "Compare across channels and cohorts, not just blended averages.",
        ],
      },
      {
        title: "How to interpret payback",
        bullets: [
          "Shorter payback improves cash efficiency and reduces risk.",
          "Compare payback by channel - some channels are slow but scalable.",
          "Pair with churn: long payback + high churn is dangerous.",
        ],
      },
    ],
  },
  {
    slug: "churn-rate-calculator",
    title: "Churn Rate Calculator",
    description: "Calculate customer churn rate for a period.",
    category: "saas-metrics",
    guideSlug: "churn-guide",
    inputs: [
      {
        key: "startingCustomers",
        label: "Customers at start",
        placeholder: "1000",
        defaultValue: "1000",
      },
      {
        key: "lostCustomers",
        label: "Customers lost",
        placeholder: "30",
        defaultValue: "30",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingCustomers <= 0)
        warnings.push("Customers at start must be greater than 0.");
      const churn = safeDivide(values.lostCustomers, values.startingCustomers);
      if (churn === null) {
        return {
          headline: {
            key: "churn",
            label: "Churn rate",
            value: 0,
            format: "percent",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }
      return {
        headline: {
          key: "churn",
          label: "Churn rate",
          value: churn,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Lost ÷ Start",
        },
        warnings,
      };
    },
    formula: "Churn Rate = Customers Lost ÷ Customers at Start",
    assumptions: ["Inputs represent the same period (e.g., month, quarter)."],
    faqs: [
      {
        question: "What about expansion revenue?",
        answer:
          "Customer churn ignores upsells/downsells. Use NRR/GRR when you want a revenue-based view.",
      },
    ],
    guide: [
      {
        title: "Improve churn tracking",
        bullets: [
          "Track churn by cohort and plan to see where retention breaks.",
          "Separate voluntary churn from involuntary (failed payments).",
          "Watch leading indicators (activation, support tickets, usage).",
        ],
      },
    ],
  },
  {
    slug: "retention-rate-calculator",
    title: "Retention Rate Calculator",
    description: "Calculate retention rate for a period accounting for new customers.",
    category: "saas-metrics",
    guideSlug: "retention-guide",
    inputs: [
      {
        key: "startingCustomers",
        label: "Customers at start",
        placeholder: "1000",
        defaultValue: "1000",
      },
      {
        key: "endingCustomers",
        label: "Customers at end",
        placeholder: "1050",
        defaultValue: "1050",
      },
      {
        key: "newCustomers",
        label: "New customers",
        placeholder: "80",
        defaultValue: "80",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingCustomers <= 0)
        warnings.push("Customers at start must be greater than 0.");
      const retained = values.endingCustomers - values.newCustomers;
      const retention = safeDivide(retained, values.startingCustomers);
      if (retention === null) {
        return {
          headline: {
            key: "retention",
            label: "Retention rate",
            value: 0,
            format: "percent",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }
      return {
        headline: {
          key: "retention",
          label: "Retention rate",
          value: retention,
          format: "percent",
          maxFractionDigits: 2,
          detail: "(End − New) ÷ Start",
        },
        secondary: [
          {
            key: "retainedCustomers",
            label: "Retained customers",
            value: retained,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula: "Retention Rate = (Customers at End − New Customers) ÷ Customers at Start",
    assumptions: ["Inputs represent the same period (e.g., month, quarter)."],
    faqs: [
      {
        question: "Can retention rate be above 100%?",
        answer:
          "Customer retention typically stays ≤100%. If you're above 100%, double-check inputs or consider revenue retention instead.",
      },
    ],
    guide: [
      {
        title: "Retention vs churn",
        bullets: [
          "Retention is the inverse view of churn for the same period.",
          "Customer retention differs from revenue retention (NRR/GRR).",
          "Use consistent period boundaries (start/end) across reports.",
        ],
      },
    ],
  },
  {
    slug: "arpu-calculator",
    title: "ARPU Calculator",
    description:
      "Calculate Average Revenue Per User (ARPU) for a period and understand the ARPU formula.",
    category: "saas-metrics",
    guideSlug: "arpu-guide",
    seo: {
      intro: [
        "ARPU (Average Revenue Per User) measures how much revenue you generate per user in a period. It is commonly used to track monetization changes from pricing, packaging, and user mix.",
        "To calculate ARPU correctly, make sure your revenue and user count are measured over the same period and that you define what an “active user” means for your product.",
      ],
      steps: [
        "Pick a time window (month/quarter) and define “active user”.",
        "Sum revenue for that same window (be consistent: gross vs net of refunds).",
        "Compute average active users for the window (e.g., average DAU, or (start + end) ÷ 2).",
        "Divide revenue by average active users to get ARPU.",
      ],
      pitfalls: [
        "Using total signups as the denominator instead of active users.",
        "Mixing active users and accounts (ARPU vs ARPA mismatch).",
        "Comparing ARPU across periods without segmenting by plan or geo when pricing changes.",
      ],
    },
    inputs: [
      {
        key: "revenue",
        label: "Total revenue (period)",
        placeholder: "50000",
        prefix: "$",
        defaultValue: "50000",
      },
      {
        key: "avgUsers",
        label: "Average active users (period)",
        placeholder: "2000",
        defaultValue: "2000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.avgUsers <= 0) warnings.push("Average users must be greater than 0.");
      const arpu = safeDivide(values.revenue, values.avgUsers);
      if (arpu === null) {
        return {
          headline: {
            key: "arpu",
            label: "ARPU",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }
      return {
        headline: {
          key: "arpu",
          label: "ARPU",
          value: arpu,
          format: "currency",
          currency: "USD",
          detail: "Revenue ÷ Avg. users",
        },
        warnings,
      };
    },
    formula: "ARPU = Revenue ÷ Average Active Users",
    assumptions: ["Revenue and users are measured over the same period."],
    faqs: [
      {
        question: "ARPU vs ARPA?",
        answer:
          "ARPU is per user; ARPA is per account. Choose the one that matches your product and reporting.",
      },
      {
        question: "How do you calculate ARPU?",
        answer:
          "ARPU = total revenue ÷ average active users for the same period. Choose a time window (month/quarter), define 'active user', compute average active users, then divide revenue by that average.",
      },
    ],
    guide: [
      {
        title: "Use ARPU effectively",
        bullets: [
          "Compare ARPU by segment (geo, plan, acquisition channel).",
          "Pair with retention to understand long-term value.",
          "Avoid mixing trials/free users unless you define it clearly.",
        ],
      },
      {
        title: "Common mistakes",
        bullets: [
          "Using total signups as the denominator instead of active users.",
          "Mixing gross revenue with net revenue (refunds/discounts) without noting it.",
          "Comparing ARPU across periods while changing pricing or activation criteria without segmentation.",
        ],
      },
    ],
  },
  {
    slug: "mrr-calculator",
    title: "MRR Calculator",
    description: "Estimate Monthly Recurring Revenue (MRR) from customers and ARPA.",
    category: "saas-metrics",
    guideSlug: "mrr-guide",
    seo: {
      intro: [
        "MRR (Monthly Recurring Revenue) is recurring revenue from active subscriptions, normalized to a monthly amount. It is a standard metric for tracking momentum in subscription businesses.",
        "A clean MRR definition excludes one-time fees and services, and normalizes annual plans to a monthly equivalent (annual price ÷ 12).",
      ],
      steps: [
        "Count paying customers (or active subscriptions) for the period.",
        "Estimate ARPA per month (average revenue per account per month).",
        "Multiply customers by ARPA to estimate MRR.",
      ],
      pitfalls: [
        "Including one-time fees or services revenue in MRR.",
        "Mixing bookings/cash with run-rate revenue (MRR is run-rate).",
        "Comparing MRR without breaking down new/expansion/contraction/churn components.",
      ],
    },
    inputs: [
      {
        key: "customers",
        label: "Paying customers",
        placeholder: "250",
        defaultValue: "250",
      },
      {
        key: "arpaMonthly",
        label: "ARPA per month",
        placeholder: "200",
        prefix: "$",
        defaultValue: "200",
      },
    ],
    compute(values) {
      const mrr = values.customers * values.arpaMonthly;
      return {
        headline: {
          key: "mrr",
          label: "MRR",
          value: mrr,
          format: "currency",
          currency: "USD",
          detail: "Customers × ARPA",
        },
      };
    },
    formula: "MRR = Paying Customers × ARPA (monthly)",
    assumptions: ["This is a simplified estimate; real MRR sums subscription amounts."],
    faqs: [
      {
        question: "Does MRR include one-time fees?",
        answer:
          "Typically no - MRR focuses on recurring revenue only. Track one-time fees separately.",
      },
    ],
    guide: [
      {
        title: "MRR best practices",
        bullets: [
          "Use 'committed' MRR (active subscriptions) rather than invoices.",
          "Break down changes: new, expansion, contraction, churn.",
          "Track net new MRR to see momentum.",
        ],
      },
    ],
  },
  {
    slug: "arr-calculator",
    title: "ARR Calculator",
    description: "Estimate Annual Recurring Revenue (ARR) from customers and ARPA.",
    category: "saas-metrics",
    guideSlug: "arr-guide",
    seo: {
      intro: [
        "ARR (Annual Recurring Revenue) is MRR annualized (MRR × 12). It is an annualized run-rate snapshot, not a promise of yearly revenue.",
        "When people compare bookings vs ARR, remember: bookings measure contracted value, while ARR measures recurring run-rate. Cash receipts can differ again due to prepay timing.",
      ],
      steps: [
        "Estimate ARPA per month for your segment (monthly revenue per account).",
        "Count paying customers (or subscriptions).",
        "Compute MRR = customers × ARPA.",
        "Compute ARR = MRR × 12.",
      ],
      pitfalls: [
        "Counting one-time fees or services revenue as recurring run-rate.",
        "Annualizing a short-term MRR spike without checking churn/retention.",
        "Mixing bookings and cash receipts into ARR reporting.",
      ],
    },
    inputs: [
      {
        key: "customers",
        label: "Paying customers",
        placeholder: "250",
        defaultValue: "250",
      },
      {
        key: "arpaMonthly",
        label: "ARPA per month",
        placeholder: "200",
        prefix: "$",
        defaultValue: "200",
      },
    ],
    compute(values) {
      const mrr = values.customers * values.arpaMonthly;
      const arr = mrr * 12;
      return {
        headline: {
          key: "arr",
          label: "ARR",
          value: arr,
          format: "currency",
          currency: "USD",
          detail: "MRR × 12",
        },
        secondary: [
          {
            key: "mrr",
            label: "MRR",
            value: mrr,
            format: "currency",
            currency: "USD",
          },
        ],
      };
    },
    formula: "ARR = MRR × 12",
    assumptions: ["Assumes revenue stays stable for a year."],
    faqs: [
      {
        question: "ARR vs annual revenue?",
        answer:
          "ARR is recurring revenue on an annualized basis. It doesn't include one-time fees or services revenue.",
      },
      {
        question: "Bookings vs ARR?",
        answer:
          "ARR is recurring run-rate (MRR × 12). Bookings are contracted value and can include one-time and non-recurring items. Cash receipts can differ again due to prepay timing.",
      },
    ],
    guide: [
      {
        title: "ARR notes",
        bullets: [
          "ARR is an annualized snapshot, not a guarantee of yearly revenue.",
          "For annual plans, ARR may lag behind bookings and cash.",
          "Use ARR for comparing scale across SaaS businesses.",
        ],
      },
    ],
  },
  {
    slug: "arr-valuation-calculator",
    title: "ARR Valuation Calculator",
    description:
      "Estimate a SaaS valuation from ARR and a revenue multiple (ARR valuation).",
    category: "saas-metrics",
    guideSlug: "arr-guide",
    inputs: [
      {
        key: "arr",
        label: "ARR",
        placeholder: "2400000",
        prefix: "$",
        defaultValue: "2400000",
      },
      {
        key: "multiple",
        label: "Revenue multiple",
        placeholder: "6",
        defaultValue: "6",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.arr < 0) warnings.push("ARR must be 0 or greater.");
      if (values.multiple <= 0) warnings.push("Multiple must be greater than 0.");

      const valuation = values.arr * values.multiple;
      if (!Number.isFinite(valuation)) {
        return {
          headline: {
            key: "valuation",
            label: "Valuation",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "valuation",
          label: "Valuation",
          value: valuation,
          format: "currency",
          currency: "USD",
          detail: "ARR x multiple",
        },
        warnings,
      };
    },
    formula: "Valuation = ARR x multiple",
    assumptions: [
      "Multiples vary widely by growth, margins, retention, and market conditions.",
      "This is a simple heuristic, not investment advice.",
    ],
    faqs: [
      {
        question: "What multiple should I use?",
        answer:
          "Use a range (e.g., 4x-10x) and sanity-check against growth rate, gross margin, and retention. Market conditions can move multiples significantly.",
      },
      {
        question: "Is ARR the same as annual revenue?",
        answer:
          "Not always. ARR focuses on recurring run-rate and excludes one-time fees/services. Annual revenue may include non-recurring items.",
      },
    ],
    guide: [
      {
        title: "How to use ARR valuation",
        bullets: [
          "Model a range of multiples rather than a single number.",
          "Use ARR for recurring run-rate; use bookings/cash for planning.",
          "Tie the multiple to quality signals: growth, margin, churn, and NRR.",
        ],
      },
    ],
  },
  {
    slug: "nrr-calculator",
    title: "NRR Calculator",
    description:
      "Calculate Net Revenue Retention (NRR) from starting MRR and revenue movements.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "nrr-guide",
    seo: {
      intro: [
        "NRR (Net Revenue Retention) measures how revenue from an existing customer cohort changes over a period, including expansion, contraction, and churn. It answers: do customers grow, shrink, or leave after they start?",
        "NRR is most useful when measured by cohort and segment (plan, size, channel). A blended NRR can hide problems in parts of the business.",
      ],
      steps: [
        "Pick a cohort and time window (often monthly or quarterly).",
        "Measure starting MRR for that cohort at the beginning of the window.",
        "Add expansion MRR and subtract contraction and churned MRR.",
        "Compute NRR = ending MRR ÷ starting MRR.",
      ],
      pitfalls: [
        "Mixing new customer revenue into NRR (NRR is existing cohort only).",
        "Comparing NRR across segments without consistent definitions.",
        "Using revenue recognition instead of recurring MRR movements.",
      ],
      benchmarks: [
        "NRR > 100% means the cohort grows without new customers.",
        "NRR close to 100% can be healthy in SMB models if CAC payback is short.",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
      },
      {
        key: "expansionMrr",
        label: "Expansion MRR",
        placeholder: "15000",
        prefix: "$",
        defaultValue: "15000",
      },
      {
        key: "contractionMrr",
        label: "Contraction MRR",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
      },
      {
        key: "churnedMrr",
        label: "Churned MRR",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingMrr <= 0)
        warnings.push("Starting MRR must be greater than 0.");
      if (values.expansionMrr < 0) warnings.push("Expansion MRR must be 0 or greater.");
      if (values.contractionMrr < 0)
        warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

      const endingMrr =
        values.startingMrr +
        values.expansionMrr -
        values.contractionMrr -
        values.churnedMrr;

      const nrr = safeDivide(endingMrr, values.startingMrr);
      if (nrr === null) {
        return {
          headline: {
            key: "nrr",
            label: "NRR",
            value: 0,
            format: "percent",
            maxFractionDigits: 1,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "nrr",
          label: "NRR",
          value: nrr,
          format: "percent",
          maxFractionDigits: 1,
          detail: "Ending MRR ÷ Starting MRR",
        },
        secondary: [
          {
            key: "endingMrr",
            label: "Ending MRR",
            value: endingMrr,
            format: "currency",
            currency: "USD",
          },
        ],
        breakdown: [
          {
            key: "startingMrr",
            label: "Starting MRR",
            value: values.startingMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "expansionMrr",
            label: "Expansion MRR",
            value: values.expansionMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "contractionMrr",
            label: "Contraction MRR",
            value: values.contractionMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "churnedMrr",
            label: "Churned MRR",
            value: values.churnedMrr,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "NRR = (Starting MRR + Expansion − Contraction − Churn) ÷ Starting MRR",
    assumptions: [
      "NRR measures an existing cohort only; exclude new customers in the period.",
      "All components use the same MRR definition and time window.",
    ],
    faqs: [
      {
        question: "What is a good NRR?",
        answer:
          "NRR benchmarks vary by segment. NRR > 100% means the cohort grows without new customers. SMB businesses can succeed with NRR near 100% if CAC payback is short and margins are strong.",
      },
      {
        question: "NRR vs GRR?",
        answer:
          "NRR includes expansion. GRR excludes expansion and focuses on durability after churn and downgrades.",
      },
    ],
    guide: [
      {
        title: "NRR best practices",
        bullets: [
          "Track NRR by cohort, plan, and customer size (avoid blended averages).",
          "Pair NRR with logo churn to see whether growth comes from a few large accounts.",
          "Validate NRR with churned MRR trends and retention curves.",
        ],
      },
    ],
  },
  {
    slug: "grr-calculator",
    title: "GRR Calculator",
    description:
      "Calculate Gross Revenue Retention (GRR) from starting MRR, contraction, and churn.",
    category: "saas-metrics",
    guideSlug: "grr-guide",
    seo: {
      intro: [
        "GRR (Gross Revenue Retention) measures how much of a cohort’s starting revenue remains after churn and downgrades, excluding expansion. It is a clean durability metric.",
      ],
      steps: [
        "Pick a cohort and time window.",
        "Measure starting MRR for the cohort.",
        "Subtract contraction and churned MRR to get ending gross MRR.",
        "Compute GRR = ending gross MRR ÷ starting MRR.",
      ],
      pitfalls: [
        "Including expansion (GRR intentionally excludes it).",
        "Using a blended number that hides segment issues.",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
      },
      {
        key: "contractionMrr",
        label: "Contraction MRR",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
      },
      {
        key: "churnedMrr",
        label: "Churned MRR",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingMrr <= 0)
        warnings.push("Starting MRR must be greater than 0.");
      if (values.contractionMrr < 0)
        warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

      const endingGrossMrr =
        values.startingMrr - values.contractionMrr - values.churnedMrr;
      const grr = safeDivide(endingGrossMrr, values.startingMrr);
      if (grr === null) {
        return {
          headline: {
            key: "grr",
            label: "GRR",
            value: 0,
            format: "percent",
            maxFractionDigits: 1,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "grr",
          label: "GRR",
          value: grr,
          format: "percent",
          maxFractionDigits: 1,
          detail: "(Starting − Contraction − Churn) ÷ Starting",
        },
        secondary: [
          {
            key: "endingGrossMrr",
            label: "Ending gross MRR",
            value: endingGrossMrr,
            format: "currency",
            currency: "USD",
          },
        ],
        breakdown: [
          {
            key: "startingMrr",
            label: "Starting MRR",
            value: values.startingMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "contractionMrr",
            label: "Contraction MRR",
            value: values.contractionMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "churnedMrr",
            label: "Churned MRR",
            value: values.churnedMrr,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "GRR = (Starting MRR − Contraction − Churn) ÷ Starting MRR",
    assumptions: [
      "GRR excludes expansion by definition.",
      "All components use the same MRR definition and time window.",
    ],
    faqs: [
      {
        question: "Why track GRR if I already track NRR?",
        answer:
          "NRR can look strong due to expansion even when underlying churn/downgrades are weak. GRR isolates durability without expansion.",
      },
      {
        question: "What is a good GRR?",
        answer:
          "There is no single benchmark across all businesses. Use GRR trends by segment to identify where churn and downgrades are improving or worsening.",
      },
    ],
    guide: [
      {
        title: "GRR tips",
        bullets: [
          "Track GRR by customer size and plan to find where churn risk is concentrated.",
          "Use cohort curves to understand when contraction happens (early vs later).",
          "Pair GRR with churned MRR and logo churn for a full picture.",
        ],
      },
    ],
  },
  {
    slug: "net-new-mrr-calculator",
    title: "Net New MRR Calculator",
    description:
      "Calculate net new MRR from new, expansion, contraction, and churned MRR.",
    category: "saas-metrics",
    guideSlug: "net-new-mrr-guide",
    seo: {
      intro: [
        "Net new MRR measures how your recurring revenue changed in a period after accounting for expansions, contractions, and churn. It is a fast read on growth momentum.",
      ],
      steps: [
        "Measure new MRR from new customers in the period.",
        "Measure expansion MRR from existing customers.",
        "Subtract contraction MRR and churned MRR.",
        "Net new MRR is the net change in MRR for the period.",
      ],
      pitfalls: [
        "Mixing invoiced revenue or cash with MRR movements.",
        "Comparing months without considering annual billing seasonality.",
      ],
    },
    inputs: [
      {
        key: "newMrr",
        label: "New MRR",
        placeholder: "12000",
        prefix: "$",
        defaultValue: "12000",
      },
      {
        key: "expansionMrr",
        label: "Expansion MRR",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
      },
      {
        key: "contractionMrr",
        label: "Contraction MRR",
        placeholder: "3000",
        prefix: "$",
        defaultValue: "3000",
      },
      {
        key: "churnedMrr",
        label: "Churned MRR",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.newMrr < 0) warnings.push("New MRR must be 0 or greater.");
      if (values.expansionMrr < 0) warnings.push("Expansion MRR must be 0 or greater.");
      if (values.contractionMrr < 0) warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

      const grossAdditions = values.newMrr + values.expansionMrr;
      const grossLosses = values.contractionMrr + values.churnedMrr;
      const netNewMrr = grossAdditions - grossLosses;

      return {
        headline: {
          key: "netNewMrr",
          label: "Net new MRR",
          value: netNewMrr,
          format: "currency",
          currency: "USD",
          detail: "New + Expansion − Contraction − Churn",
        },
        secondary: [
          {
            key: "grossAdditions",
            label: "Gross additions",
            value: grossAdditions,
            format: "currency",
            currency: "USD",
          },
          {
            key: "grossLosses",
            label: "Gross losses",
            value: grossLosses,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Net new MRR = New MRR + Expansion MRR − Contraction MRR − Churned MRR",
    assumptions: [
      "All components are measured over the same time window.",
      "New MRR excludes expansions from existing customers.",
    ],
    faqs: [
      {
        question: "Is net new MRR the same as MRR growth rate?",
        answer:
          "Net new MRR is a dollar amount (change in MRR). Growth rate is net new MRR divided by starting MRR for the period.",
      },
    ],
    guide: [
      {
        title: "How to use net new MRR",
        bullets: [
          "Track by segment to see which motions produce durable growth.",
          "Watch churned MRR trends to avoid growth hiding retention issues.",
          "Pair with CAC and payback to judge growth efficiency.",
        ],
      },
    ],
  },
  {
    slug: "saas-quick-ratio-calculator",
    title: "SaaS Quick Ratio Calculator",
    description:
      "Calculate the SaaS quick ratio: (new + expansion) ÷ (contraction + churn).",
    category: "saas-metrics",
    guideSlug: "saas-quick-ratio-guide",
    seo: {
      intro: [
        "SaaS quick ratio is a growth quality metric that compares positive MRR movements (new + expansion) to negative movements (contraction + churn).",
      ],
      steps: [
        "Measure new and expansion MRR for the period.",
        "Measure contraction and churned MRR for the same period.",
        "Compute quick ratio = (new + expansion) ÷ (contraction + churn).",
      ],
      pitfalls: [
        "Using mismatched windows or definitions for movements.",
        "Relying on blended numbers that hide segment problems.",
      ],
    },
    inputs: [
      {
        key: "newMrr",
        label: "New MRR",
        placeholder: "12000",
        prefix: "$",
        defaultValue: "12000",
      },
      {
        key: "expansionMrr",
        label: "Expansion MRR",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
      },
      {
        key: "contractionMrr",
        label: "Contraction MRR",
        placeholder: "3000",
        prefix: "$",
        defaultValue: "3000",
      },
      {
        key: "churnedMrr",
        label: "Churned MRR",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.newMrr < 0) warnings.push("New MRR must be 0 or greater.");
      if (values.expansionMrr < 0) warnings.push("Expansion MRR must be 0 or greater.");
      if (values.contractionMrr < 0) warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

      const positive = values.newMrr + values.expansionMrr;
      const negative = values.contractionMrr + values.churnedMrr;
      if (negative <= 0) warnings.push("Losses (contraction + churn) must be greater than 0.");

      const ratio = safeDivide(positive, negative);
      if (ratio === null) {
        return {
          headline: {
            key: "quickRatio",
            label: "Quick ratio",
            value: 0,
            format: "ratio",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "quickRatio",
          label: "Quick ratio",
          value: ratio,
          format: "ratio",
          maxFractionDigits: 2,
          detail: "(New + Expansion) ÷ (Contraction + Churn)",
        },
        breakdown: [
          {
            key: "positive",
            label: "Positive MRR movements",
            value: positive,
            format: "currency",
            currency: "USD",
          },
          {
            key: "negative",
            label: "Negative MRR movements",
            value: negative,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Quick ratio = (New MRR + Expansion MRR) ÷ (Contraction MRR + Churned MRR)",
    assumptions: [
      "All movements are measured for the same period.",
      "Use MRR movements (not billings/cash) to keep the metric consistent.",
    ],
    faqs: [
      {
        question: "What is a good SaaS quick ratio?",
        answer:
          "Benchmarks vary by stage, but higher ratios generally indicate healthier growth quality (more positive MRR compared to losses). Use trends and segment-level ratios to diagnose where losses are coming from.",
      },
    ],
    guide: [
      {
        title: "Quick ratio tips",
        bullets: [
          "Track quick ratio by segment to find leaky cohorts.",
          "If quick ratio drops, inspect churned MRR and contraction first.",
          "Pair with payback and burn multiple to judge cash efficiency.",
        ],
      },
    ],
  },
  {
    slug: "rule-of-40-calculator",
    title: "Rule of 40 Calculator",
    description:
      "Calculate the Rule of 40 score: growth rate (%) + profit margin (%).",
    category: "saas-metrics",
    featured: true,
    guideSlug: "rule-of-40-guide",
    seo: {
      intro: [
        "Rule of 40 is a common SaaS heuristic: growth rate plus profit margin should be around 40% or higher. It balances growth and profitability in one number.",
      ],
      steps: [
        "Choose a growth rate definition (e.g., YoY revenue growth).",
        "Choose a margin definition (operating, EBITDA, or free cash flow margin).",
        "Compute Rule of 40 score = growth (%) + margin (%).",
      ],
      pitfalls: [
        "Mixing margin types across periods (EBITDA one quarter, FCF the next).",
        "Comparing across businesses with very different go-to-market motions.",
      ],
    },
    inputs: [
      {
        key: "growthPercent",
        label: "Revenue growth rate",
        placeholder: "35",
        suffix: "%",
        defaultValue: "35",
      },
      {
        key: "marginPercent",
        label: "Profit margin",
        help: "Operating / EBITDA / FCF margin (choose one and stick to it).",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
      },
    ],
    compute(values) {
      const score = (values.growthPercent + values.marginPercent) / 100;
      return {
        headline: {
          key: "ruleOf40",
          label: "Rule of 40 score",
          value: score,
          format: "percent",
          maxFractionDigits: 1,
          detail: "Growth (%) + Margin (%)",
        },
        breakdown: [
          {
            key: "growthPercent",
            label: "Growth",
            value: values.growthPercent / 100,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "marginPercent",
            label: "Margin",
            value: values.marginPercent / 100,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
      };
    },
    formula: "Rule of 40 = Growth rate (%) + Profit margin (%)",
    assumptions: [
      "This is a heuristic and depends on stage, market, and go-to-market motion.",
      "Use consistent growth and margin definitions across time.",
    ],
    faqs: [
      {
        question: "Which margin should I use for Rule of 40?",
        answer:
          "Teams commonly use operating margin, EBITDA margin, or free cash flow margin. Pick one and keep it consistent so you can compare trends.",
      },
      {
        question: "Does Rule of 40 guarantee good performance?",
        answer:
          "No. It is a rough benchmark for balancing growth and profitability. It does not replace retention, payback, and cash efficiency analysis.",
      },
    ],
    guide: [
      {
        title: "Rule of 40 tips",
        bullets: [
          "Use it as a trend metric, not a single-point verdict.",
          "Pair with NRR/GRR and payback to judge growth quality and durability.",
          "Compare within your segment (SMB vs enterprise) rather than across all SaaS.",
        ],
      },
    ],
  },
  {
    slug: "burn-multiple-calculator",
    title: "Burn Multiple Calculator",
    description:
      "Calculate burn multiple: net burn ÷ net new ARR (a growth efficiency metric).",
    category: "saas-metrics",
    featured: true,
    guideSlug: "burn-multiple-guide",
    seo: {
      intro: [
        "Burn multiple measures growth efficiency: how much net cash you burn to generate $1 of net new ARR. Lower is generally better, but benchmarks vary by stage.",
      ],
      steps: [
        "Measure net burn for a period (often quarterly).",
        "Measure net new ARR for the same period.",
        "Compute burn multiple = net burn ÷ net new ARR.",
      ],
      pitfalls: [
        "Using inconsistent periods (net burn quarterly vs net new ARR monthly).",
        "Ignoring annual prepay timing that can distort short windows.",
      ],
    },
    inputs: [
      {
        key: "netBurn",
        label: "Net burn (period)",
        placeholder: "300000",
        prefix: "$",
        defaultValue: "300000",
      },
      {
        key: "netNewArr",
        label: "Net new ARR (same period)",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.netBurn < 0) warnings.push("Net burn must be 0 or greater.");
      if (values.netNewArr <= 0)
        warnings.push("Net new ARR must be greater than 0.");

      const multiple = safeDivide(values.netBurn, values.netNewArr);
      if (multiple === null) {
        return {
          headline: {
            key: "burnMultiple",
            label: "Burn multiple",
            value: 0,
            format: "multiple",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "burnMultiple",
          label: "Burn multiple",
          value: multiple,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "Net burn ÷ Net new ARR",
        },
        warnings,
      };
    },
    formula: "Burn multiple = Net burn ÷ Net new ARR",
    assumptions: [
      "Use the same time window for burn and net new ARR (often quarterly).",
      "Net burn is net cash outflow (cash out - cash in) for the period.",
    ],
    faqs: [
      {
        question: "What is a good burn multiple?",
        answer:
          "Benchmarks vary widely by stage and go-to-market motion. Use trends and compare within your peer group. Pair burn multiple with retention and gross margin to judge growth quality.",
      },
      {
        question: "Is burn multiple the same as the SaaS magic number?",
        answer:
          "No. Burn multiple uses cash burn and net new ARR. Magic number uses sales & marketing spend and revenue output with a lag. Both are efficiency heuristics with different inputs.",
      },
    ],
    guide: [
      {
        title: "Burn multiple tips",
        bullets: [
          "Measure quarterly to reduce noise from timing.",
          "Pair with NRR/GRR to ensure growth is durable, not leaky.",
          "Use payback period to connect efficiency to channel-level economics.",
        ],
      },
    ],
  },
  {
    slug: "bookings-vs-arr-calculator",
    title: "Bookings vs ARR Calculator",
    description:
      "Compare bookings vs ARR (and cash) for a contract with term length and one-time fees.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "bookings-vs-arr-guide",
    seo: {
      intro: [
        "Bookings measure contracted value signed in a period. ARR is a recurring run-rate snapshot (typically MRR × 12). Cash receipts can differ again depending on billing terms.",
        "This calculator turns a contract into comparable metrics: bookings (signed value), recurring run-rate (ARR), and cash collected (if prepaid).",
      ],
      steps: [
        "Enter the total contract value (TCV) and the term length (months).",
        "Enter any one-time fees/services included in the contract.",
        "Compute recurring value = TCV − one-time.",
        "Compute MRR = recurring ÷ term months, then ARR = MRR × 12.",
      ],
      pitfalls: [
        "Treating bookings as recurring run-rate (especially with annual prepay).",
        "Including one-time services in ARR.",
        "Comparing bookings to ARR without normalizing term length.",
      ],
    },
    inputs: [
      {
        key: "contractValue",
        label: "Total contract value (TCV)",
        placeholder: "120000",
        prefix: "$",
        defaultValue: "120000",
      },
      {
        key: "termMonths",
        label: "Contract term (months)",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
      {
        key: "oneTimeFees",
        label: "One-time fees / services (optional)",
        placeholder: "10000",
        prefix: "$",
        defaultValue: "10000",
        min: 0,
      },
      {
        key: "prepaidPercent",
        label: "Paid upfront (cash %) ",
        help: "100% for annual prepay; 0% if billed monthly (cash spread out).",
        placeholder: "100",
        suffix: "%",
        defaultValue: "100",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.contractValue < 0) warnings.push("TCV must be 0 or greater.");
      if (values.termMonths <= 0) warnings.push("Term months must be greater than 0.");
      if (values.oneTimeFees < 0) warnings.push("One-time fees must be 0 or greater.");
      if (values.prepaidPercent < 0 || values.prepaidPercent > 100)
        warnings.push("Paid upfront (%) must be between 0 and 100.");

      const recurring = Math.max(0, values.contractValue - values.oneTimeFees);
      const mrr = safeDivide(recurring, values.termMonths) ?? 0;
      const arr = mrr * 12;
      const bookings = values.contractValue;
      const cashCollected = bookings * (values.prepaidPercent / 100);

      return {
        headline: {
          key: "arr",
          label: "ARR (run-rate)",
          value: arr,
          format: "currency",
          currency: "USD",
          detail: "Recurring ÷ term months × 12",
        },
        secondary: [
          {
            key: "bookings",
            label: "Bookings (signed value)",
            value: bookings,
            format: "currency",
            currency: "USD",
          },
          {
            key: "cash",
            label: "Cash collected (upfront)",
            value: cashCollected,
            format: "currency",
            currency: "USD",
          },
        ],
        breakdown: [
          {
            key: "recurring",
            label: "Recurring portion",
            value: recurring,
            format: "currency",
            currency: "USD",
          },
          {
            key: "mrr",
            label: "MRR equivalent",
            value: mrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "oneTimeFees",
            label: "One-time fees",
            value: values.oneTimeFees,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Bookings = TCV; ARR = ((TCV − one-time) ÷ term months) × 12; Cash upfront = TCV × prepaid %",
    assumptions: [
      "ARR is a run-rate snapshot; it is not recognized revenue.",
      "Recurring portion excludes one-time fees and services.",
      "Cash collected depends on billing terms; this model uses 'paid upfront %' as a simplification.",
    ],
    faqs: [
      {
        question: "Is bookings the same as ARR?",
        answer:
          "No. Bookings measure contracted value signed in a period. ARR measures recurring run-rate (MRR × 12). They answer different questions.",
      },
      {
        question: "Why can bookings be much higher than ARR?",
        answer:
          "Bookings can include the full contract term and one-time items, while ARR only reflects recurring run-rate. Annual prepay can also increase bookings and cash without changing run-rate proportionally.",
      },
    ],
    guide: [
      {
        title: "How to use this comparison",
        bullets: [
          "Use bookings to evaluate sales performance and contracted demand.",
          "Use ARR to compare recurring scale and momentum across time/companies.",
          "Use cash to plan runway; billing terms can move cash without changing ARR.",
        ],
      },
    ],
  },
  {
    slug: "saas-magic-number-calculator",
    title: "SaaS Magic Number Calculator",
    description:
      "Estimate sales efficiency using net new ARR and prior-period sales & marketing spend (Magic Number).",
    category: "saas-metrics",
    guideSlug: "saas-magic-number-guide",
    seo: {
      intro: [
        "The SaaS Magic Number is a rough sales efficiency heuristic. It compares revenue output (net new ARR) to sales & marketing spend with a lag.",
      ],
      steps: [
        "Pick a quarter (or month) and measure net new ARR for that period.",
        "Use the prior period’s sales & marketing spend as the input spend (to account for lag).",
        "Compute Magic Number ≈ (net new ARR × 4) ÷ prior-period S&M spend.",
      ],
      pitfalls: [
        "Ignoring lag effects (spend today converts later).",
        "Using a blended number that hides channel/segment differences.",
      ],
    },
    inputs: [
      {
        key: "netNewArr",
        label: "Net new ARR (period)",
        placeholder: "250000",
        prefix: "$",
        defaultValue: "250000",
      },
      {
        key: "salesMarketingSpend",
        label: "Sales & marketing spend (prior period)",
        placeholder: "400000",
        prefix: "$",
        defaultValue: "400000",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.salesMarketingSpend <= 0)
        warnings.push("Sales & marketing spend must be greater than 0.");
      const magic = safeDivide(values.netNewArr * 4, values.salesMarketingSpend);
      if (magic === null) {
        return {
          headline: {
            key: "magic",
            label: "Magic Number",
            value: 0,
            format: "multiple",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }
      return {
        headline: {
          key: "magic",
          label: "Magic Number",
          value: magic,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "(Net new ARR × 4) ÷ prior S&M spend",
        },
        warnings,
      };
    },
    formula: "Magic Number ≈ (Net new ARR in period × 4) ÷ prior-period S&M spend",
    assumptions: [
      "Uses a lag: prior-period S&M spend is compared to current revenue output.",
      "Works best as a trend metric and when measured consistently (often quarterly).",
    ],
    faqs: [
      {
        question: "Is Magic Number the same as burn multiple?",
        answer:
          "No. Magic Number uses sales & marketing spend and net new ARR. Burn multiple uses net cash burn and net new ARR.",
      },
    ],
  },
  {
    slug: "customer-lifetime-calculator",
    title: "Customer Lifetime Calculator",
    description:
      "Estimate customer lifetime (months) from monthly churn rate (a simple approximation).",
    category: "saas-metrics",
    guideSlug: "customer-lifetime-guide",
    inputs: [
      {
        key: "monthlyChurnPercent",
        label: "Monthly churn rate",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const churn = values.monthlyChurnPercent / 100;
      if (churn <= 0) warnings.push("Churn must be greater than 0 for this model.");
      const lifetimeMonths = churn > 0 ? 1 / churn : 0;
      return {
        headline: {
          key: "lifetime",
          label: "Estimated customer lifetime",
          value: lifetimeMonths,
          format: "months",
          maxFractionDigits: 1,
          detail: "1 ÷ monthly churn rate",
        },
        warnings,
      };
    },
    formula: "Customer lifetime (months) ≈ 1 ÷ monthly churn rate",
    assumptions: [
      "Assumes churn is roughly constant over time (often untrue early vs late).",
      "Useful as a planning shortcut; cohort curves are more accurate.",
    ],
    faqs: [
      {
        question: "Why is this only an estimate?",
        answer:
          "Churn usually changes by tenure (early churn is higher). This formula assumes churn is constant, so it should be used as a quick approximation or compared across segments consistently.",
      },
    ],
  },
  {
    slug: "break-even-revenue-calculator",
    title: "Break-even Revenue Calculator",
    description: "Estimate the revenue needed to break even given fixed costs and gross margin.",
    category: "finance",
    featured: true,
    guideSlug: "break-even-guide",
    inputs: [
      {
        key: "fixedCosts",
        label: "Fixed costs (monthly)",
        placeholder: "30000",
        prefix: "$",
        defaultValue: "30000",
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const grossMargin = values.grossMarginPercent / 100;
      if (grossMargin <= 0) warnings.push("Gross margin must be greater than 0.");
      const breakevenRevenue = safeDivide(values.fixedCosts, grossMargin);
      if (breakevenRevenue === null) {
        return {
          headline: {
            key: "breakeven",
            label: "Break-even revenue (monthly)",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }
      return {
        headline: {
          key: "breakeven",
          label: "Break-even revenue (monthly)",
          value: breakevenRevenue,
          format: "currency",
          currency: "USD",
          detail: "Fixed costs ÷ Gross margin",
        },
        warnings,
      };
    },
    formula: "Break-even Revenue = Fixed Costs ÷ Gross Margin",
    assumptions: ["Gross margin is expressed as a percent of revenue."],
    faqs: [
      {
        question: "What if my costs are not fixed?",
        answer:
          "This calculator assumes fixed costs. If costs scale with revenue, use a contribution margin model instead.",
      },
    ],
    guide: [
      {
        title: "Break-even tips",
        bullets: [
          "Use contribution/gross margin, not net margin.",
          "Validate fixed costs: include salaries, rent, core tools, and overhead.",
          "Recompute when pricing or COGS changes.",
        ],
      },
    ],
  },
  {
    slug: "npv-calculator",
    title: "NPV Calculator",
    description:
      "Calculate net present value (NPV) from initial investment, annual cash flow, years, and discount rate.",
    category: "finance",
    guideSlug: "npv-guide",
    inputs: [
      {
        key: "initialInvestment",
        label: "Initial investment (upfront)",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
        min: 0,
      },
      {
        key: "annualCashFlow",
        label: "Annual cash flow",
        placeholder: "30000",
        prefix: "$",
        defaultValue: "30000",
      },
      {
        key: "years",
        label: "Years",
        placeholder: "5",
        defaultValue: "5",
        min: 1,
        step: 1,
      },
      {
        key: "discountRatePercent",
        label: "Discount rate",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const r = values.discountRatePercent / 100;
      if (values.years <= 0) warnings.push("Years must be greater than 0.");

      let pv = 0;
      if (r === 0) {
        pv = values.annualCashFlow * values.years;
      } else {
        pv = values.annualCashFlow * ((1 - Math.pow(1 + r, -values.years)) / r);
      }

      const npv = pv - values.initialInvestment;
      return {
        headline: {
          key: "npv",
          label: "Net present value (NPV)",
          value: npv,
          format: "currency",
          currency: "USD",
          detail: "PV of cash flows − initial investment",
        },
        secondary: [
          {
            key: "pv",
            label: "Present value of cash flows",
            value: pv,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "NPV = Σ (cash flow_t / (1 + r)^t) − initial investment (annuity PV for constant cash flow)",
    assumptions: [
      "Assumes constant annual cash flow (real projects vary).",
      "Discount rate reflects required return (hurdle rate / MARR).",
    ],
    faqs: [
      {
        question: "What discount rate should I use?",
        answer:
          "Use your required return or hurdle rate (often called MARR). Many teams test a range (e.g., 8%–20%) to see sensitivity.",
      },
      {
        question: "NPV vs IRR?",
        answer:
          "NPV is value created at a chosen discount rate. IRR is the implied discount rate where NPV equals zero.",
      },
    ],
  },
];
