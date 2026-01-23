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
    slug: "paid-ads-funnel-calculator",
    title: "Paid Ads Funnel Calculator",
    description:
      "Model CPM → CTR → CVR to estimate CPC, CPA, ROAS, and profit per 1,000 impressions (with margin and variable costs).",
    category: "paid-ads",
    featured: true,
    guideSlug: "paid-ads-funnel-guide",
    relatedGlossarySlugs: [
      "cpm",
      "ctr",
      "cvr",
      "cpc",
      "cpa",
      "aov",
      "roas",
      "contribution-margin",
      "gross-margin",
    ],
    seo: {
      intro: [
        "Most ad performance can be decomposed into a simple funnel: cost per 1,000 impressions (CPM) → click-through rate (CTR) → conversion rate (CVR) → average order value (AOV).",
        "This calculator turns those inputs into CPC, CPA, ROAS, break-even targets, and profit per 1,000 impressions using contribution margin (gross margin minus variable costs).",
      ],
      steps: [
        "Enter CPM, CTR, and CVR to define the media funnel.",
        "Enter AOV and gross margin plus variable costs (fees, shipping, returns).",
        "Review CPC, CPA, and ROAS, then compare to break-even ROAS and break-even CPA.",
        "Use the per-1,000-impressions view to spot whether the bottleneck is CPM, CTR, CVR, or economics.",
      ],
      pitfalls: [
        "Comparing funnels across channels with different attribution windows.",
        "Using revenue-based ROAS without margin and returns (profitability blind).",
        "Optimizing CTR at the expense of intent (CVR drops).",
      ],
    },
    inputs: [
      {
        key: "cpm",
        label: "CPM",
        placeholder: "12",
        prefix: "$",
        defaultValue: "12",
        min: 0,
      },
      {
        key: "ctrPercent",
        label: "CTR",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0,
      },
      {
        key: "cvrPercent",
        label: "CVR",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: 0,
      },
      {
        key: "aov",
        label: "AOV",
        placeholder: "80",
        prefix: "$",
        defaultValue: "80",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        placeholder: "60",
        suffix: "%",
        defaultValue: "60",
        min: 0,
      },
      {
        key: "paymentFeesPercent",
        label: "Payment fees",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: 0,
      },
      {
        key: "shippingPercent",
        label: "Shipping & fulfillment",
        placeholder: "0",
        suffix: "%",
        defaultValue: "0",
        min: 0,
      },
      {
        key: "returnsPercent",
        label: "Returns & refunds",
        placeholder: "0",
        suffix: "%",
        defaultValue: "0",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const ctr = values.ctrPercent / 100;
      const cvr = values.cvrPercent / 100;
      const grossMargin = values.grossMarginPercent / 100;
      const fees = values.paymentFeesPercent / 100;
      const shipping = values.shippingPercent / 100;
      const returns = values.returnsPercent / 100;

      const contributionMargin = grossMargin - fees - shipping - returns;
      if (contributionMargin <= 0) {
        warnings.push("Contribution margin must be greater than 0.");
      }
      if (ctr <= 0) warnings.push("CTR must be greater than 0.");
      if (cvr <= 0) warnings.push("CVR must be greater than 0.");

      const clicksPer1000 = 1000 * ctr;
      const spendPer1000 = values.cpm;
      const conversionsPer1000 = clicksPer1000 * cvr;
      const revenuePer1000 = conversionsPer1000 * values.aov;
      const contributionPer1000 = revenuePer1000 * Math.max(contributionMargin, 0);
      const profitPer1000 = contributionPer1000 - spendPer1000;

      const cpc = safeDivide(spendPer1000, clicksPer1000);
      const cpa = cpc !== null ? safeDivide(cpc, cvr) : null;
      const roas = safeDivide(revenuePer1000, spendPer1000);
      const breakevenRoas =
        contributionMargin > 0 ? 1 / contributionMargin : 0;
      const breakevenCpa =
        contributionMargin > 0 ? values.aov * contributionMargin : 0;

      return {
        headline: {
          key: "profitPer1000",
          label: "Profit per 1,000 impressions",
          value: profitPer1000,
          format: "currency",
          currency: "USD",
          detail: "Contribution per 1,000 − CPM",
        },
        secondary: [
          {
            key: "cpa",
            label: "CPA",
            value: cpa ?? 0,
            format: "currency",
            currency: "USD",
            detail: "CPC ÷ CVR",
          },
          {
            key: "roas",
            label: "ROAS",
            value: roas ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Revenue ÷ Spend",
          },
          {
            key: "breakevenRoas",
            label: "Break-even ROAS",
            value: breakevenRoas,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "1 ÷ contribution margin",
          },
        ],
        breakdown: [
          {
            key: "cpc",
            label: "CPC",
            value: cpc ?? 0,
            format: "currency",
            currency: "USD",
            detail: "CPM ÷ (CTR × 1000)",
          },
          {
            key: "breakevenCpa",
            label: "Break-even CPA",
            value: breakevenCpa,
            format: "currency",
            currency: "USD",
            detail: "AOV × contribution margin",
          },
          {
            key: "clicksPer1000",
            label: "Clicks per 1,000 impressions",
            value: clicksPer1000,
            format: "number",
            maxFractionDigits: 2,
          },
          {
            key: "conversionsPer1000",
            label: "Conversions per 1,000 impressions",
            value: conversionsPer1000,
            format: "number",
            maxFractionDigits: 3,
          },
          {
            key: "revenuePer1000",
            label: "Revenue per 1,000 impressions",
            value: revenuePer1000,
            format: "currency",
            currency: "USD",
          },
          {
            key: "contributionMargin",
            label: "Contribution margin",
            value: Math.max(contributionMargin, 0),
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "contributionPer1000",
            label: "Contribution per 1,000 impressions",
            value: contributionPer1000,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Clicks/1000 = 1000×CTR; CPC = CPM ÷ (1000×CTR); CPA = CPC ÷ CVR; ROAS = revenue ÷ spend; Profit/1000 = (revenue×contribution margin) − CPM",
    assumptions: [
      "CTR and CVR are expressed as decimals for calculations (percent inputs are converted).",
      "Contribution margin = gross margin − fees − shipping − returns (simplified).",
      "Per-1,000-impressions view assumes attribution is consistent and conversions are attributable to ads.",
    ],
    faqs: [
      {
        question: "Why focus on profit per 1,000 impressions?",
        answer:
          "It reveals where performance is coming from. If profit is negative, you can see whether the lever is CPM, CTR, CVR, AOV, or contribution margin.",
      },
      {
        question: "How is break-even CPA computed?",
        answer:
          "Break-even CPA is the maximum you can pay per conversion without losing money on variable economics: AOV × contribution margin.",
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
    slug: "unit-economics-calculator",
    title: "Unit Economics Calculator",
    description:
      "Model CAC, payback, LTV, and LTV:CAC together from ARPA, gross margin, and churn.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "unit-economics-guide",
    relatedGlossarySlugs: [
      "unit-economics",
      "cac",
      "cac-payback-period",
      "ltv",
      "ltv-to-cac",
      "gross-margin",
      "churn-rate",
      "customer-lifetime",
    ],
    seo: {
      intro: [
        "Unit economics connect acquisition cost (CAC) to profitability over time (LTV) and cash efficiency (payback). This calculator models them together using consistent units.",
        "Use it by segment (channel, plan, geo) rather than relying on a single blended average.",
      ],
      steps: [
        "Enter ARPA (monthly revenue per account) and gross margin (%).",
        "Enter monthly churn (%). This approximates customer lifetime (1 ÷ churn).",
        "Enter CAC per new customer/account.",
        "Review payback months, LTV (gross profit), and LTV:CAC ratio.",
      ],
      pitfalls: [
        "Mixing revenue-based LTV with fully-loaded CAC (mismatched bases).",
        "Using annual churn with monthly ARPA (unit mismatch).",
        "Ignoring segment differences (SMB vs enterprise behaves differently).",
      ],
      benchmarks: [
        "Many SaaS teams target LTV:CAC around ~3:1 as a rough rule of thumb (varies by stage and cash constraints).",
        "Shorter payback is usually safer for cash efficiency; acceptable payback depends on burn and retention.",
      ],
    },
    inputs: [
      {
        key: "arpaMonthly",
        label: "ARPA (monthly)",
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
        min: 0,
      },
      {
        key: "monthlyChurnPercent",
        label: "Monthly churn rate",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: 0,
      },
      {
        key: "cac",
        label: "CAC (per new customer/account)",
        placeholder: "800",
        prefix: "$",
        defaultValue: "800",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const grossMargin = values.grossMarginPercent / 100;
      const churn = values.monthlyChurnPercent / 100;

      if (grossMargin <= 0) warnings.push("Gross margin must be greater than 0.");
      if (churn <= 0)
        warnings.push("Monthly churn must be greater than 0 for lifetime-based LTV.");

      const grossProfitPerMonth = values.arpaMonthly * grossMargin;
      const lifetimeMonths = churn > 0 ? 1 / churn : 0;
      const ltv = grossProfitPerMonth * lifetimeMonths;
      const paybackMonths =
        grossProfitPerMonth > 0 ? values.cac / grossProfitPerMonth : 0;
      const ltvToCac = values.cac > 0 ? ltv / values.cac : 0;

      return {
        headline: {
          key: "payback",
          label: "CAC payback period",
          value: paybackMonths,
          format: "months",
          maxFractionDigits: 1,
          detail: "CAC ÷ monthly gross profit",
        },
        secondary: [
          {
            key: "ltv",
            label: "LTV (gross profit)",
            value: ltv,
            format: "currency",
            currency: "USD",
          },
          {
            key: "ltvToCac",
            label: "LTV:CAC",
            value: ltvToCac,
            format: "multiple",
            maxFractionDigits: 2,
          },
        ],
        breakdown: [
          {
            key: "grossProfitPerMonth",
            label: "Gross profit per month",
            value: grossProfitPerMonth,
            format: "currency",
            currency: "USD",
          },
          {
            key: "lifetimeMonths",
            label: "Estimated customer lifetime",
            value: lifetimeMonths,
            format: "months",
            maxFractionDigits: 1,
            detail: "1 ÷ churn",
          },
        ],
        warnings,
      };
    },
    formula:
      "Payback = CAC ÷ (ARPA × gross margin); LTV ≈ (ARPA × gross margin) ÷ churn; LTV:CAC = LTV ÷ CAC",
    assumptions: [
      "Uses a simple constant-churn model (lifetime ≈ 1 ÷ churn).",
      "LTV is modeled as gross profit (revenue × gross margin) to align with CAC.",
    ],
    faqs: [
      {
        question: "Should LTV be revenue or gross profit?",
        answer:
          "For unit economics, LTV should usually be based on gross profit so it reflects the value created after COGS. If you use revenue LTV, label it clearly and be consistent when comparing to CAC.",
      },
      {
        question: "Why does this use monthly churn?",
        answer:
          "Because ARPA is monthly in this model. Time units must match: monthly ARPA uses monthly churn. If you prefer annual units, convert both ARPA and churn consistently.",
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
    relatedGlossarySlugs: ["npv", "discount-rate", "marr"],
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
  {
    slug: "irr-calculator",
    title: "IRR Calculator",
    description:
      "Estimate internal rate of return (IRR) for an investment using yearly cash flows.",
    category: "finance",
    featured: true,
    guideSlug: "irr-guide",
    relatedGlossarySlugs: ["irr", "npv", "discount-rate", "marr"],
    seo: {
      intro: [
        "IRR (Internal Rate of Return) is the discount rate that makes NPV equal zero. It is a common way to compare investments when cash flows span multiple years.",
        "IRR can be misleading when cash flows change sign multiple times, so use NPV alongside IRR for decision-making.",
      ],
      steps: [
        "Enter the upfront investment (cash outflow).",
        "Enter expected annual cash flows for years 1–5.",
        "Optionally include a terminal value in year 5.",
        "Calculate IRR and compare to your required return (MARR).",
      ],
      pitfalls: [
        "Multiple IRRs can exist when cash flows change sign multiple times.",
        "IRR can hide scale (a small project can have high IRR but low NPV).",
        "Use consistent periods (annual vs monthly) to avoid unit mismatch.",
      ],
    },
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
        key: "cashFlow1",
        label: "Cash flow (year 1)",
        placeholder: "25000",
        prefix: "$",
        defaultValue: "25000",
      },
      {
        key: "cashFlow2",
        label: "Cash flow (year 2)",
        placeholder: "30000",
        prefix: "$",
        defaultValue: "30000",
      },
      {
        key: "cashFlow3",
        label: "Cash flow (year 3)",
        placeholder: "35000",
        prefix: "$",
        defaultValue: "35000",
      },
      {
        key: "cashFlow4",
        label: "Cash flow (year 4)",
        placeholder: "40000",
        prefix: "$",
        defaultValue: "40000",
      },
      {
        key: "cashFlow5",
        label: "Cash flow (year 5)",
        placeholder: "45000",
        prefix: "$",
        defaultValue: "45000",
      },
      {
        key: "terminalValue",
        label: "Terminal value (optional, year 5)",
        placeholder: "0",
        prefix: "$",
        defaultValue: "0",
        min: 0,
      },
      {
        key: "discountRatePercent",
        label: "Discount rate (for NPV check)",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const r = values.discountRatePercent / 100;
      const cashFlows = [
        -values.initialInvestment,
        values.cashFlow1,
        values.cashFlow2,
        values.cashFlow3,
        values.cashFlow4,
        values.cashFlow5 + values.terminalValue,
      ];

      function npvAt(rate: number) {
        let sum = 0;
        for (let t = 0; t < cashFlows.length; t++) {
          sum += cashFlows[t] / Math.pow(1 + rate, t);
        }
        return sum;
      }

      // Find a bracket where NPV changes sign.
      let lo = -0.9;
      let hi = 5;
      let fLo = npvAt(lo);
      let fHi = npvAt(hi);

      if (!Number.isFinite(fLo) || !Number.isFinite(fHi)) {
        warnings.push("Inputs produce invalid NPV values; check cash flows.");
      }

      if (fLo === 0) {
        hi = lo;
        fHi = fLo;
      }

      if (fLo * fHi > 0) {
        // Expand search a bit.
        const probes = [-0.9, -0.5, -0.2, 0, 0.1, 0.25, 0.5, 1, 2, 3, 5, 8, 10];
        let found = false;
        for (let i = 0; i < probes.length - 1; i++) {
          const a = probes[i];
          const b = probes[i + 1];
          const fa = npvAt(a);
          const fb = npvAt(b);
          if (!Number.isFinite(fa) || !Number.isFinite(fb)) continue;
          if (fa === 0) {
            lo = a;
            hi = a;
            fLo = fa;
            fHi = fb;
            found = true;
            break;
          }
          if (fa * fb < 0) {
            lo = a;
            hi = b;
            fLo = fa;
            fHi = fb;
            found = true;
            break;
          }
        }
        if (!found) {
          warnings.push(
            "IRR could not be determined (NPV does not cross zero in the tested range). Use NPV with a chosen discount rate instead.",
          );
        }
      }

      let irr: number | null = null;
      if (fLo * fHi < 0) {
        // Bisection.
        for (let i = 0; i < 80; i++) {
          const mid = (lo + hi) / 2;
          const fMid = npvAt(mid);
          if (!Number.isFinite(fMid)) break;
          if (Math.abs(fMid) < 1e-10) {
            irr = mid;
            break;
          }
          if (fLo * fMid < 0) {
            hi = mid;
            fHi = fMid;
          } else {
            lo = mid;
            fLo = fMid;
          }
          irr = (lo + hi) / 2;
        }
      } else if (fLo === 0) {
        irr = lo;
      }

      const npvAtDiscount = npvAt(r);

      return {
        headline: {
          key: "irr",
          label: "IRR",
          value: irr ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Discount rate where NPV = 0",
        },
        secondary: [
          {
            key: "npv",
            label: `NPV @ ${values.discountRatePercent}%`,
            value: npvAtDiscount,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "IRR is the rate r such that NPV(r) = 0",
    assumptions: [
      "Cash flows are annual and occur at the end of each year (except the upfront investment at t=0).",
      "IRR may not exist or may be non-unique for some cash flow patterns.",
    ],
    faqs: [
      {
        question: "IRR vs NPV: which should I use?",
        answer:
          "Use NPV for decisions at a chosen required return (MARR) because it measures value created in dollars. Use IRR to compare opportunities when capital is constrained, but validate with NPV to avoid misleading results.",
      },
      {
        question: "Why might IRR be undefined or weird?",
        answer:
          "If cash flows change sign multiple times, the NPV curve can cross zero multiple times (multiple IRRs) or not at all. In those cases, rely on NPV instead.",
      },
    ],
  },
  {
    slug: "discounted-payback-period-calculator",
    title: "Discounted Payback Period Calculator",
    description:
      "Estimate discounted payback period using a discount rate (and compare to simple payback).",
    category: "finance",
    guideSlug: "discounted-payback-period-guide",
    relatedGlossarySlugs: ["payback-period", "discount-rate", "npv", "marr"],
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
        label: "Max years to evaluate",
        placeholder: "10",
        defaultValue: "10",
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

      if (values.annualCashFlow <= 0)
        warnings.push("Annual cash flow must be greater than 0.");

      const simplePaybackYears = safeDivide(
        values.initialInvestment,
        values.annualCashFlow,
      );

      let cumulative = 0;
      let paybackYears: number | null = null;
      for (let year = 1; year <= Math.floor(values.years); year++) {
        const pv = values.annualCashFlow / Math.pow(1 + r, year);
        const next = cumulative + pv;
        if (next >= values.initialInvestment && pv > 0) {
          const remaining = values.initialInvestment - cumulative;
          const fraction = remaining / pv;
          paybackYears = (year - 1) + fraction;
          break;
        }
        cumulative = next;
      }

      if (paybackYears === null) {
        warnings.push("Discounted payback not reached within the chosen horizon.");
      }

      return {
        headline: {
          key: "discountedPayback",
          label: "Discounted payback period",
          value: (paybackYears ?? 0) * 12,
          format: "months",
          maxFractionDigits: 1,
          detail: "Time to recover investment using discounted cash flows",
        },
        secondary: [
          {
            key: "simplePayback",
            label: "Simple payback (undiscounted)",
            value: (simplePaybackYears ?? 0) * 12,
            format: "months",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula:
      "Discounted payback is the earliest time where cumulative discounted cash flows ≥ initial investment",
    assumptions: [
      "Cash flows occur at the end of each year (discounted by year index).",
      "Uses a constant annual cash flow for simplicity.",
    ],
    faqs: [
      {
        question: "Why is discounted payback longer than simple payback?",
        answer:
          "Discounting reduces the present value of future cash flows, so it usually takes longer (in discounted terms) to recover the initial investment.",
      },
    ],
  },
  {
    slug: "mrr-forecast-calculator",
    title: "MRR Forecast Calculator",
    description:
      "Forecast MRR over time using new MRR plus expansion, contraction, and churn rates.",
    category: "saas-metrics",
    guideSlug: "mrr-forecast-guide",
    relatedGlossarySlugs: [
      "mrr",
      "net-new-mrr",
      "new-mrr",
      "expansion-mrr",
      "contraction-mrr",
      "churned-mrr",
      "nrr",
      "grr",
    ],
    seo: {
      intro: [
        "An MRR forecast helps you sanity-check growth assumptions and understand which lever matters most: new customer acquisition (new MRR) or retention and expansion (NRR).",
        "This calculator models a simple monthly MRR bridge: starting MRR plus new MRR, expansion, minus contraction and churn, repeated for the number of months you choose.",
      ],
      steps: [
        "Enter your starting MRR (current recurring run-rate).",
        "Estimate new MRR added per month (from new customers).",
        "Set monthly expansion, contraction, and churn rates for existing MRR.",
        "Choose a horizon (e.g., 6–24 months) and compare scenarios.",
      ],
      pitfalls: [
        "Mixing time units (monthly churn with annual inputs).",
        "Using expansion/churn rates that imply impossible outcomes (e.g., churn > 100%).",
        "Treating this as a replacement for cohort-based retention curves; use cohorts for higher accuracy.",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
        min: 0,
      },
      {
        key: "newMrrPerMonth",
        label: "New MRR added per month",
        help: "Recurring revenue from brand-new customers (not expansions).",
        placeholder: "12000",
        prefix: "$",
        defaultValue: "12000",
        min: 0,
      },
      {
        key: "expansionRatePercent",
        label: "Monthly expansion rate (existing MRR)",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0,
        step: 0.1,
      },
      {
        key: "contractionRatePercent",
        label: "Monthly contraction rate (existing MRR)",
        placeholder: "0.5",
        suffix: "%",
        defaultValue: "0.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "churnRatePercent",
        label: "Monthly churn rate (existing MRR)",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "months",
        label: "Months to forecast",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.months));

      const expansionRate = values.expansionRatePercent / 100;
      const contractionRate = values.contractionRatePercent / 100;
      const churnRate = values.churnRatePercent / 100;

      if (values.startingMrr <= 0) warnings.push("Starting MRR must be greater than 0.");
      if (values.months !== months)
        warnings.push("Months was rounded down to a whole number.");
      if (values.churnRatePercent > 100 || values.contractionRatePercent > 100)
        warnings.push("Churn/contraction rates above 100% are not realistic.");

      let mrr = Math.max(0, values.startingMrr);
      let totalNew = 0;
      let totalExpansion = 0;
      let totalContraction = 0;
      let totalChurn = 0;

      const baseMrr = mrr;

      for (let month = 1; month <= months; month++) {
        const expansion = mrr * expansionRate;
        const contraction = mrr * contractionRate;
        const churn = mrr * churnRate;
        const next = mrr + values.newMrrPerMonth + expansion - contraction - churn;

        totalNew += values.newMrrPerMonth;
        totalExpansion += expansion;
        totalContraction += contraction;
        totalChurn += churn;

        mrr = Math.max(0, next);
        if (next < 0) warnings.push("Your assumptions drive MRR below $0; the forecast is floored at $0.");
      }

      const netNewMrr = mrr - baseMrr;
      const cmgr = baseMrr > 0 ? Math.pow(mrr / baseMrr, 1 / months) - 1 : 0;

      const oneMonthExistingMrr = baseMrr;
      const oneMonthNrr = safeDivide(
        oneMonthExistingMrr +
          oneMonthExistingMrr * expansionRate -
          oneMonthExistingMrr * contractionRate -
          oneMonthExistingMrr * churnRate,
        oneMonthExistingMrr,
      );
      const oneMonthGrr = safeDivide(
        oneMonthExistingMrr -
          oneMonthExistingMrr * contractionRate -
          oneMonthExistingMrr * churnRate,
        oneMonthExistingMrr,
      );

      return {
        headline: {
          key: "endingMrr",
          label: `Ending MRR (month ${months})`,
          value: mrr,
          format: "currency",
          currency: "USD",
          detail: "Simple monthly MRR bridge forecast",
        },
        secondary: [
          {
            key: "endingArrRunRate",
            label: "ARR run-rate (ending MRR × 12)",
            value: mrr * 12,
            format: "currency",
            currency: "USD",
          },
          {
            key: "netNewMrr",
            label: "Net new MRR over horizon",
            value: netNewMrr,
            format: "currency",
            currency: "USD",
            detail: "Ending MRR - starting MRR",
          },
          {
            key: "cmgr",
            label: "CMGR (monthly growth rate)",
            value: cmgr,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Compound monthly growth rate over the horizon",
          },
          {
            key: "impliedMonthlyNrr",
            label: "Implied monthly NRR (existing MRR only)",
            value: oneMonthNrr ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "1 + expansion - contraction - churn (monthly)",
          },
          {
            key: "impliedMonthlyGrr",
            label: "Implied monthly GRR (existing MRR only)",
            value: oneMonthGrr ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "1 - contraction - churn (monthly)",
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
            key: "newMrrPerMonth",
            label: "New MRR per month",
            value: values.newMrrPerMonth,
            format: "currency",
            currency: "USD",
          },
          {
            key: "totalNew",
            label: `Total new MRR added (${months} months)`,
            value: totalNew,
            format: "currency",
            currency: "USD",
          },
          {
            key: "totalExpansion",
            label: `Total expansion (${months} months)`,
            value: totalExpansion,
            format: "currency",
            currency: "USD",
          },
          {
            key: "totalContraction",
            label: `Total contraction (${months} months)`,
            value: totalContraction,
            format: "currency",
            currency: "USD",
          },
          {
            key: "totalChurn",
            label: `Total churn (${months} months)`,
            value: totalChurn,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Ending MRR = iterate monthly: MRR_next = MRR + new + (expansion% * MRR) - (contraction% * MRR) - (churn% * MRR)",
    assumptions: [
      "Rates apply to the current month's MRR base (not cohort-based).",
      "New MRR is constant each month for simplicity.",
      "This is a planning model; use cohort retention curves for higher precision.",
    ],
    faqs: [
      {
        question: "Is this the same as NRR forecasting?",
        answer:
          "This model includes both new customer growth (new MRR) and existing customer dynamics (expansion, contraction, churn). NRR focuses only on existing customers; here we show the implied monthly NRR from your assumptions.",
      },
      {
        question: "What horizon should I use?",
        answer:
          "For execution planning, 6–12 months is common. For longer-range strategy, use scenarios (base/optimistic/conservative) because small rate changes compound quickly.",
      },
    ],
  },
  {
    slug: "cash-runway-calculator",
    title: "Cash Runway Calculator",
    description:
      "Estimate runway from cash balance, revenue, gross margin, and operating expenses (optionally with revenue growth).",
    category: "finance",
    guideSlug: "cash-runway-guide",
    relatedGlossarySlugs: [
      "runway",
      "burn-rate",
      "net-burn",
      "gross-margin",
      "break-even-revenue",
      "cash-breakeven",
      "cash-flow",
    ],
    seo: {
      intro: [
        "Runway answers a simple question: how many months can you operate before cash hits zero at your current net burn?",
        "This calculator estimates net burn from revenue, gross margin, and operating expenses, and optionally simulates runway with a monthly revenue growth assumption.",
      ],
      steps: [
        "Enter your current cash balance.",
        "Enter monthly revenue and gross margin (to estimate gross profit).",
        "Enter monthly operating expenses (cash basis).",
        "Optionally add a monthly revenue growth rate to model improving burn.",
      ],
      pitfalls: [
        "Using booked revenue instead of collected cash (AR timing matters).",
        "Using accounting expenses when cash outflows differ (capex, prepaids, deferred revenue).",
        "Assuming growth without accounting for growth costs (sales/marketing, infra).",
      ],
    },
    inputs: [
      {
        key: "cashBalance",
        label: "Cash balance",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "monthlyRevenue",
        label: "Monthly revenue (cash-in proxy)",
        help: "If collections lag, adjust this closer to cash collected per month.",
        placeholder: "150000",
        prefix: "$",
        defaultValue: "150000",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyOperatingExpenses",
        label: "Monthly operating expenses (cash out)",
        placeholder: "220000",
        prefix: "$",
        defaultValue: "220000",
        min: 0,
      },
      {
        key: "monthlyRevenueGrowthPercent",
        label: "Monthly revenue growth (optional)",
        placeholder: "3",
        suffix: "%",
        defaultValue: "0",
        step: 0.1,
      },
      {
        key: "monthsToSimulate",
        label: "Months to simulate",
        placeholder: "24",
        defaultValue: "24",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.monthsToSimulate));
      if (values.monthsToSimulate !== months)
        warnings.push("Months to simulate was rounded down to a whole number.");

      const grossMargin = values.grossMarginPercent / 100;
      if (grossMargin <= 0)
        warnings.push("Gross margin must be greater than 0 to compute break-even revenue.");

      const currentGrossProfit = values.monthlyRevenue * grossMargin;
      const currentNetBurn = values.monthlyOperatingExpenses - currentGrossProfit;

      const noGrowthRunwayMonths =
        currentNetBurn > 0 ? (safeDivide(values.cashBalance, currentNetBurn) ?? 0) : months;

      const monthlyGrowth = values.monthlyRevenueGrowthPercent / 100;
      let cash = values.cashBalance;
      let revenue = values.monthlyRevenue;
      let runwayWithGrowth: number | null = null;
      let breakevenMonth: number | null = null;

      for (let month = 1; month <= months; month++) {
        const grossProfit = revenue * grossMargin;
        const netBurn = values.monthlyOperatingExpenses - grossProfit;
        if (breakevenMonth === null && netBurn <= 0) breakevenMonth = month;

        cash -= netBurn;
        if (cash <= 0) {
          runwayWithGrowth = month;
          break;
        }
        revenue *= 1 + monthlyGrowth;
      }

      if (currentNetBurn <= 0) {
        warnings.push(
          "At this revenue, margin, and expense level you are cash-flow positive (net burn <= 0). Runway is not the limiting factor.",
        );
      }

      const breakEvenRevenue =
        grossMargin > 0
          ? (safeDivide(values.monthlyOperatingExpenses, grossMargin) ?? 0)
          : 0;

      return {
        headline: {
          key: "runwayMonths",
          label: "Cash runway (months)",
          value: runwayWithGrowth ?? noGrowthRunwayMonths,
          format: "months",
          maxFractionDigits: 1,
          detail:
            values.monthlyRevenueGrowthPercent > 0
              ? "Simulated with revenue growth"
              : "Current net burn (no growth)",
        },
        secondary: [
          {
            key: "netBurn",
            label: "Current net burn (monthly)",
            value: currentNetBurn,
            format: "currency",
            currency: "USD",
            detail: "Operating expenses - gross profit",
          },
          {
            key: "grossProfit",
            label: "Current gross profit (monthly)",
            value: currentGrossProfit,
            format: "currency",
            currency: "USD",
          },
          {
            key: "noGrowthRunway",
            label: "Runway (no growth)",
            value: noGrowthRunwayMonths,
            format: "months",
            maxFractionDigits: 1,
          },
          {
            key: "breakevenRevenue",
            label: "Break-even revenue (monthly)",
            value: breakEvenRevenue,
            format: "currency",
            currency: "USD",
            detail: "Opex / gross margin",
          },
          {
            key: "breakevenMonth",
            label: "Estimated month to cash break-even (if growth applied)",
            value: breakevenMonth ?? 0,
            format: "months",
            maxFractionDigits: 0,
            detail: breakevenMonth ? "First month where net burn <= 0" : "Not reached in horizon",
          },
        ],
        breakdown: [
          {
            key: "cashBalance",
            label: "Cash balance",
            value: values.cashBalance,
            format: "currency",
            currency: "USD",
          },
          {
            key: "monthlyRevenue",
            label: "Monthly revenue",
            value: values.monthlyRevenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "grossMarginPercent",
            label: "Gross margin",
            value: grossMargin,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "monthlyOperatingExpenses",
            label: "Monthly operating expenses",
            value: values.monthlyOperatingExpenses,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Net burn = operating expenses - (revenue * gross margin); Runway = cash balance / net burn (if net burn > 0)",
    assumptions: [
      "Monthly revenue is used as a proxy for cash inflow (collections timing can differ).",
      "Gross margin is treated as a simple % of revenue for gross profit.",
      "Operating expenses are treated as cash outflows and constant in the simulation.",
    ],
    faqs: [
      {
        question: "Why is runway different from profitability?",
        answer:
          "Runway is about cash. You can be profitable on an accounting basis but still have cash issues due to collections timing, prepayments, capex, or working capital changes.",
      },
      {
        question: "Should I include non-recurring revenue?",
        answer:
          "If it reliably produces cash inflows (services, one-time fees), you can include it, but label it clearly. For SaaS planning, recurring revenue is often the most stable input.",
      },
    ],
  },
  {
    slug: "blended-cac-calculator",
    title: "Blended CAC Calculator",
    description:
      "Compare paid-only CAC vs fully-loaded (blended) CAC, and estimate payback at a target margin.",
    category: "saas-metrics",
    guideSlug: "blended-cac-guide",
    relatedGlossarySlugs: ["cac", "arpa", "gross-margin", "payback-period"],
    seo: {
      intro: [
        "CAC looks very different depending on what you include. Paid-only CAC helps optimize channels; blended CAC helps plan the business.",
        "This calculator compares paid CAC vs fully-loaded CAC, and estimates payback months using ARPA and gross margin assumptions.",
      ],
      steps: [
        "Enter variable acquisition costs (ad spend, creative/agency).",
        "Add fixed sales & marketing costs you want to allocate (salaries, tools).",
        "Enter new paying customers acquired in the period.",
        "Optionally add ARPA and gross margin to estimate CAC payback.",
      ],
      pitfalls: [
        "Mixing a revenue-based LTV with a fully-loaded CAC (mismatch).",
        "Including fixed costs in CAC for channel optimization (can hide channel efficiency).",
        "Using leads as the denominator instead of new paying customers.",
      ],
    },
    inputs: [
      {
        key: "adSpend",
        label: "Ad spend (variable)",
        placeholder: "60000",
        prefix: "$",
        defaultValue: "60000",
        min: 0,
      },
      {
        key: "creativeAgency",
        label: "Creative/agency (variable)",
        placeholder: "10000",
        prefix: "$",
        defaultValue: "10000",
        min: 0,
      },
      {
        key: "salesMarketingSalaries",
        label: "Sales & marketing salaries (fixed)",
        placeholder: "80000",
        prefix: "$",
        defaultValue: "80000",
        min: 0,
      },
      {
        key: "toolsOverhead",
        label: "Tools/overhead allocated (fixed)",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
        min: 0,
      },
      {
        key: "newCustomers",
        label: "New paying customers acquired",
        placeholder: "120",
        defaultValue: "120",
        min: 0,
        step: 1,
      },
      {
        key: "arpaMonthly",
        label: "ARPA (monthly, optional)",
        help: "Used to estimate payback months. Leave 0 if unknown.",
        placeholder: "800",
        prefix: "$",
        defaultValue: "800",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin (optional)",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const customers = Math.floor(values.newCustomers);
      if (values.newCustomers !== customers)
        warnings.push("New customers was rounded down to a whole number.");
      if (customers <= 0) warnings.push("New customers must be greater than 0.");

      const variableSpend = values.adSpend + values.creativeAgency;
      const fixedSpend = values.salesMarketingSalaries + values.toolsOverhead;
      const paidCac = customers > 0 ? variableSpend / customers : 0;
      const blendedCac = customers > 0 ? (variableSpend + fixedSpend) / customers : 0;

      const grossMargin = values.grossMarginPercent / 100;
      const monthlyGrossProfitPerCustomer = values.arpaMonthly * grossMargin;
      const paybackMonths =
        monthlyGrossProfitPerCustomer > 0 ? blendedCac / monthlyGrossProfitPerCustomer : null;

      if (values.arpaMonthly <= 0 || grossMargin <= 0) {
        warnings.push("To compute payback months, enter ARPA and a gross margin above 0%.");
      }

      return {
        headline: {
          key: "blendedCac",
          label: "Blended CAC (fully-loaded)",
          value: blendedCac,
          format: "currency",
          currency: "USD",
          detail: "Variable + fixed S&M spend ÷ new customers",
        },
        secondary: [
          {
            key: "paidCac",
            label: "Paid-only CAC",
            value: paidCac,
            format: "currency",
            currency: "USD",
            detail: "Variable acquisition spend ÷ new customers",
          },
          {
            key: "paybackMonths",
            label: "Estimated payback (months)",
            value: paybackMonths ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail:
              paybackMonths === null
                ? "Enter ARPA and margin to calculate"
                : "CAC ÷ monthly gross profit per customer",
          },
          {
            key: "fixedShare",
            label: "Fixed share of total acquisition spend",
            value: safeDivide(fixedSpend, fixedSpend + variableSpend) ?? 0,
            format: "percent",
            maxFractionDigits: 0,
          },
        ],
        breakdown: [
          {
            key: "variableSpend",
            label: "Variable spend (paid + creative/agency)",
            value: variableSpend,
            format: "currency",
            currency: "USD",
          },
          {
            key: "fixedSpend",
            label: "Fixed spend allocated (salaries + tools)",
            value: fixedSpend,
            format: "currency",
            currency: "USD",
          },
          {
            key: "newCustomers",
            label: "New customers",
            value: customers,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Paid CAC = variable acquisition spend / new customers; Blended CAC = (variable + fixed S&M spend) / new customers",
    assumptions: [
      "Fixed costs are allocated to the period and acquisition volume you choose.",
      "New customers are new paying customers (not leads).",
      "Payback uses gross profit per customer: ARPA * gross margin.",
    ],
    faqs: [
      {
        question: "When should I use paid CAC vs blended CAC?",
        answer:
          "Use paid CAC to optimize channels and campaigns. Use blended CAC for planning and to understand whether your overall go-to-market is efficient after salaries and tools.",
      },
      {
        question: "What should the denominator be?",
        answer:
          "For CAC, the denominator should be new paying customers. If you use leads or signups, label it clearly (CPL/CPA) and connect it to downstream conversion rates.",
      },
    ],
  },
  {
    slug: "cohort-ltv-forecast-calculator",
    title: "Cohort LTV Forecast Calculator",
    description:
      "Estimate cohort-based LTV using churn, expansion, gross margin, and optional discounting.",
    category: "saas-metrics",
    guideSlug: "cohort-ltv-forecast-guide",
    relatedGlossarySlugs: [
      "cohorted-ltv",
      "customer-lifetime",
      "logo-churn",
      "gross-margin",
      "discount-rate",
      "arpa",
    ],
    seo: {
      intro: [
        "Simple LTV formulas can be misleading when churn changes over time or when expansion meaningfully offsets churn. A cohort-style forecast is a better planning tool.",
        "This calculator models expected gross profit from a cohort over time using constant monthly churn and expansion assumptions, and can apply a discount rate to compute discounted LTV.",
      ],
      steps: [
        "Enter ARPA and gross margin to get gross profit per account per month.",
        "Set monthly logo churn and expansion rate assumptions for the cohort.",
        "Choose a horizon (e.g., 36–60 months) and an optional annual discount rate.",
        "Use the discounted LTV for planning and the undiscounted LTV for intuition.",
      ],
      pitfalls: [
        "Mixing logo churn (customer count) with revenue churn (MRR dollars).",
        "Using annual churn as a monthly churn input (time unit mismatch).",
        "Forecasting far horizons without scenarios (small rate changes compound).",
      ],
    },
    inputs: [
      {
        key: "arpaMonthly",
        label: "ARPA (monthly)",
        placeholder: "800",
        prefix: "$",
        defaultValue: "800",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyChurnPercent",
        label: "Monthly logo churn",
        help: "Churn as % of customers lost per month (not revenue churn).",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyExpansionPercent",
        label: "Monthly expansion (existing accounts)",
        help: "Expansion on surviving accounts (e.g., upgrades, seats).",
        placeholder: "1",
        suffix: "%",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
      {
        key: "months",
        label: "Months to forecast",
        placeholder: "60",
        defaultValue: "60",
        min: 1,
        step: 1,
      },
      {
        key: "annualDiscountRatePercent",
        label: "Annual discount rate (optional)",
        help: "Used to discount future cash flows; set 0 to disable.",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.months));
      if (values.months !== months)
        warnings.push("Months was rounded down to a whole number.");

      const grossMargin = values.grossMarginPercent / 100;
      const churn = values.monthlyChurnPercent / 100;
      const expansion = values.monthlyExpansionPercent / 100;
      const annualDiscountRate = values.annualDiscountRatePercent / 100;

      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (grossMargin <= 0) warnings.push("Gross margin must be greater than 0%.");
      if (churn < 0 || churn >= 1)
        warnings.push("Monthly churn must be between 0% and 99.9%.");

      const retention = 1 - churn;
      const monthlyDiscount = annualDiscountRate > 0 ? Math.pow(1 + annualDiscountRate, 1 / 12) - 1 : 0;

      let undiscounted = 0;
      let discounted = 0;
      let month12GrossProfit = 0;

      for (let t = 1; t <= months; t++) {
        const expectedRevenue =
          values.arpaMonthly * Math.pow(1 + expansion, t - 1) * Math.pow(retention, t - 1);
        const gp = expectedRevenue * grossMargin;
        undiscounted += gp;
        const df = monthlyDiscount > 0 ? Math.pow(1 + monthlyDiscount, t) : 1;
        discounted += gp / df;
        if (t === 12) month12GrossProfit = gp;
      }

      const retentionAtHorizon = Math.pow(retention, months);
      const approxLifetimeMonths = churn > 0 ? 1 / churn : null;

      return {
        headline: {
          key: "discountedLtv",
          label: "Discounted cohort LTV (gross profit)",
          value: discounted,
          format: "currency",
          currency: "USD",
          detail: "Sum of discounted monthly gross profit over the horizon",
        },
        secondary: [
          {
            key: "undiscountedLtv",
            label: "Undiscounted cohort LTV (gross profit)",
            value: undiscounted,
            format: "currency",
            currency: "USD",
          },
          {
            key: "grossProfitMonth12",
            label: "Expected gross profit in month 12",
            value: month12GrossProfit,
            format: "currency",
            currency: "USD",
            detail: "Expected value per original account in month 12",
          },
          {
            key: "retentionAtHorizon",
            label: `Logo retention after ${months} months`,
            value: retentionAtHorizon,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "approxLifetime",
            label: "Approx. lifetime from churn (months)",
            value: approxLifetimeMonths ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: approxLifetimeMonths === null ? "Churn is 0%" : "1 ÷ monthly churn",
          },
        ],
        breakdown: [
          {
            key: "arpaMonthly",
            label: "ARPA (monthly)",
            value: values.arpaMonthly,
            format: "currency",
            currency: "USD",
          },
          {
            key: "grossMargin",
            label: "Gross margin",
            value: grossMargin,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "monthlyChurn",
            label: "Monthly churn",
            value: churn,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "monthlyExpansion",
            label: "Monthly expansion",
            value: expansion,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "annualDiscount",
            label: "Annual discount rate",
            value: annualDiscountRate,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula:
      "Expected revenue_t = ARPA * (1+expansion)^(t-1) * (1-churn)^(t-1); LTV = Σ gross_profit_t (optionally discounted)",
    assumptions: [
      "Uses constant monthly churn and expansion assumptions.",
      "Expansion is applied to surviving accounts' revenue each month.",
      "Outputs are per original account in the cohort (expected value).",
    ],
    faqs: [
      {
        question: "Is this better than LTV = ARPA * margin / churn?",
        answer:
          "Often yes for planning. The simple churn formula assumes constant churn and no expansion and can be very sensitive to small churn changes. Cohort-style forecasts are easier to scenario test and extend with discounting.",
      },
      {
        question: "What discount rate should I use?",
        answer:
          "Use your required return / cost of capital as a rough starting point (e.g., 8–20% annually). If you're comparing scenarios, keep the discount rate consistent.",
      },
    ],
  },
  {
    slug: "incrementality-lift-calculator",
    title: "Incrementality Lift Calculator",
    description:
      "Estimate incremental conversions, incremental ROAS, and incremental profit from a holdout test.",
    category: "paid-ads",
    guideSlug: "incrementality-lift-guide",
    relatedGlossarySlugs: [
      "incrementality",
      "holdout-test",
      "cvr",
      "aov",
      "contribution-margin",
      "roas",
    ],
    seo: {
      intro: [
        "Attribution-reported ROAS can over-credit ads that would have converted anyway. Incrementality asks what lift ads caused compared to a no-ads baseline.",
        "This calculator turns a simple holdout test (exposed vs control) into incremental conversions, incremental ROAS, and incremental profit using AOV and contribution margin assumptions.",
      ],
      steps: [
        "Enter exposed and holdout sample sizes and conversions.",
        "Enter ad spend for the exposed group and your AOV + contribution margin.",
        "Use incremental ROAS and incremental profit to decide what to scale.",
      ],
      pitfalls: [
        "Non-random assignment (exposed users differ from holdout users).",
        "Too-small samples (results swing due to noise).",
        "Using revenue but ignoring variable costs (use contribution margin).",
      ],
    },
    inputs: [
      {
        key: "exposedUsers",
        label: "Exposed users (treatment)",
        placeholder: "100000",
        defaultValue: "100000",
        min: 0,
        step: 1,
      },
      {
        key: "exposedConversions",
        label: "Exposed conversions",
        placeholder: "1200",
        defaultValue: "1200",
        min: 0,
        step: 1,
      },
      {
        key: "holdoutUsers",
        label: "Holdout users (control)",
        placeholder: "100000",
        defaultValue: "100000",
        min: 0,
        step: 1,
      },
      {
        key: "holdoutConversions",
        label: "Holdout conversions",
        placeholder: "900",
        defaultValue: "900",
        min: 0,
        step: 1,
      },
      {
        key: "adSpend",
        label: "Ad spend (treatment)",
        placeholder: "50000",
        prefix: "$",
        defaultValue: "50000",
        min: 0,
      },
      {
        key: "aov",
        label: "Average order value (AOV)",
        placeholder: "80",
        prefix: "$",
        defaultValue: "80",
        min: 0,
      },
      {
        key: "contributionMarginPercent",
        label: "Contribution margin",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const exposedUsers = Math.floor(values.exposedUsers);
      const holdoutUsers = Math.floor(values.holdoutUsers);
      const exposedConversions = Math.floor(values.exposedConversions);
      const holdoutConversions = Math.floor(values.holdoutConversions);

      if (values.exposedUsers !== exposedUsers || values.holdoutUsers !== holdoutUsers) {
        warnings.push("User counts were rounded down to whole numbers.");
      }
      if (
        values.exposedConversions !== exposedConversions ||
        values.holdoutConversions !== holdoutConversions
      ) {
        warnings.push("Conversion counts were rounded down to whole numbers.");
      }

      if (exposedUsers <= 0 || holdoutUsers <= 0) {
        warnings.push("Exposed and holdout users must be greater than 0.");
      }

      const exposedCvr = exposedUsers > 0 ? exposedConversions / exposedUsers : 0;
      const holdoutCvr = holdoutUsers > 0 ? holdoutConversions / holdoutUsers : 0;

      const expectedWithoutAds = exposedUsers * holdoutCvr;
      const incrementalConversions = exposedConversions - expectedWithoutAds;

      const incrementalRevenue = incrementalConversions * values.aov;
      const margin = values.contributionMarginPercent / 100;
      const incrementalGrossProfit = incrementalRevenue * margin;
      const incrementalProfitAfterSpend = incrementalGrossProfit - values.adSpend;

      const incrementalRoas = safeDivide(incrementalRevenue, values.adSpend);
      const uplift = holdoutCvr > 0 ? incrementalConversions / expectedWithoutAds : null;

      if (incrementalConversions < 0) {
        warnings.push(
          "Incremental conversions are negative (treatment underperformed control). Verify test setup and sample sizes.",
        );
      }
      if (values.adSpend <= 0) {
        warnings.push("Ad spend must be greater than 0 to compute incremental ROAS.");
      }

      return {
        headline: {
          key: "incrementalProfit",
          label: "Incremental profit after ad spend",
          value: incrementalProfitAfterSpend,
          format: "currency",
          currency: "USD",
          detail: "Incremental gross profit - ad spend",
        },
        secondary: [
          {
            key: "incrementalConversions",
            label: "Incremental conversions",
            value: incrementalConversions,
            format: "number",
            maxFractionDigits: 0,
            detail: "Exposed conversions - expected conversions without ads",
          },
          {
            key: "incrementalRevenue",
            label: "Incremental revenue",
            value: incrementalRevenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "incrementalRoas",
            label: "Incremental ROAS",
            value: incrementalRoas ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Incremental revenue ÷ ad spend",
          },
          {
            key: "exposedCvr",
            label: "Exposed CVR",
            value: exposedCvr,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "holdoutCvr",
            label: "Holdout CVR",
            value: holdoutCvr,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "uplift",
            label: "Uplift vs holdout",
            value: uplift ?? 0,
            format: "percent",
            maxFractionDigits: 1,
            detail: uplift === null ? "Holdout CVR is 0%" : "(Exposed - holdout) ÷ holdout",
          },
        ],
        breakdown: [
          {
            key: "expectedWithoutAds",
            label: "Expected conversions without ads (scaled holdout)",
            value: expectedWithoutAds,
            format: "number",
            maxFractionDigits: 1,
          },
          {
            key: "adSpend",
            label: "Ad spend",
            value: values.adSpend,
            format: "currency",
            currency: "USD",
          },
          {
            key: "aov",
            label: "AOV",
            value: values.aov,
            format: "currency",
            currency: "USD",
          },
          {
            key: "margin",
            label: "Contribution margin",
            value: margin,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula:
      "Incremental conversions = exposed_conversions - exposed_users * (holdout_conversions/holdout_users); Incremental ROAS = incremental_revenue / ad_spend",
    assumptions: [
      "Holdout group approximates the no-ads baseline for the exposed group.",
      "AOV and contribution margin are constant for incremental conversions.",
      "No statistical significance is computed; treat results as directional unless sample sizes are large.",
    ],
    faqs: [
      {
        question: "Why can incremental ROAS be lower than platform ROAS?",
        answer:
          "Platforms often claim credit for conversions that would have happened anyway (especially retargeting). Incremental ROAS isolates lift, so it’s often lower but more decision-useful.",
      },
      {
        question: "What if my holdout conversion rate is higher than exposed?",
        answer:
          "That implies negative lift. It can happen due to noise, non-random assignment, or true cannibalization. Check randomization, sample size, and whether holdout users were truly unexposed.",
      },
    ],
  },
  {
    slug: "break-even-pricing-calculator",
    title: "Break-even Pricing Calculator",
    description:
      "Compute contribution margin, break-even units, and profit at a given volume based on price and variable costs.",
    category: "finance",
    guideSlug: "break-even-pricing-guide",
    relatedGlossarySlugs: [
      "break-even-revenue",
      "fixed-costs",
      "variable-costs",
      "gross-margin",
      "contribution-margin",
    ],
    seo: {
      intro: [
        "Break-even pricing connects pricing and cost structure to the volume required to cover fixed costs. It's the simplest way to sanity-check whether a product can be viable at expected demand levels.",
        "This calculator computes contribution margin, break-even units, break-even revenue, and profit at a chosen unit volume.",
      ],
      steps: [
        "Enter your price per unit and variable cost per unit.",
        "Enter fixed costs for the period (monthly or annual, but keep units consistent).",
        "Enter expected units sold to see profit at that volume.",
      ],
      pitfalls: [
        "Mixing time windows (monthly fixed costs with annual volume).",
        "Forgetting variable costs like payment fees, shipping, or support costs that scale with units.",
        "Using break-even as the only goal; you still need margin for growth and risk.",
      ],
    },
    inputs: [
      {
        key: "pricePerUnit",
        label: "Price per unit",
        placeholder: "100",
        prefix: "$",
        defaultValue: "100",
        min: 0,
      },
      {
        key: "variableCostPerUnit",
        label: "Variable cost per unit",
        placeholder: "35",
        prefix: "$",
        defaultValue: "35",
        min: 0,
      },
      {
        key: "fixedCosts",
        label: "Fixed costs (for the period)",
        placeholder: "50000",
        prefix: "$",
        defaultValue: "50000",
        min: 0,
      },
      {
        key: "unitsSold",
        label: "Units sold (expected)",
        placeholder: "1200",
        defaultValue: "1200",
        min: 0,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const unitsSold = Math.floor(values.unitsSold);
      if (values.unitsSold !== unitsSold)
        warnings.push("Units sold was rounded down to a whole number.");

      const contributionPerUnit = values.pricePerUnit - values.variableCostPerUnit;
      if (contributionPerUnit <= 0) {
        warnings.push(
          "Price must be greater than variable cost to have positive contribution margin.",
        );
      }

      const breakEvenUnits =
        contributionPerUnit > 0 ? values.fixedCosts / contributionPerUnit : null;
      const breakEvenRevenue =
        breakEvenUnits !== null ? breakEvenUnits * values.pricePerUnit : 0;

      const profitAtVolume = unitsSold * contributionPerUnit - values.fixedCosts;
      const contributionMarginPercent =
        values.pricePerUnit > 0 ? contributionPerUnit / values.pricePerUnit : null;

      return {
        headline: {
          key: "breakEvenUnits",
          label: "Break-even units",
          value: breakEvenUnits ?? 0,
          format: "number",
          maxFractionDigits: 1,
          detail: breakEvenUnits === null ? "No break-even (margin <= 0)" : "Fixed costs ÷ contribution per unit",
        },
        secondary: [
          {
            key: "profitAtVolume",
            label: "Profit at expected units",
            value: profitAtVolume,
            format: "currency",
            currency: "USD",
            detail: "Units * contribution per unit - fixed costs",
          },
          {
            key: "breakEvenRevenue",
            label: "Break-even revenue",
            value: breakEvenRevenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "contributionPerUnit",
            label: "Contribution margin per unit",
            value: contributionPerUnit,
            format: "currency",
            currency: "USD",
          },
          {
            key: "contributionMarginPercent",
            label: "Contribution margin (%)",
            value: contributionMarginPercent ?? 0,
            format: "percent",
            maxFractionDigits: 1,
            detail: contributionMarginPercent === null ? "Price is 0" : "(Price - variable cost) ÷ price",
          },
        ],
        breakdown: [
          {
            key: "pricePerUnit",
            label: "Price per unit",
            value: values.pricePerUnit,
            format: "currency",
            currency: "USD",
          },
          {
            key: "variableCostPerUnit",
            label: "Variable cost per unit",
            value: values.variableCostPerUnit,
            format: "currency",
            currency: "USD",
          },
          {
            key: "fixedCosts",
            label: "Fixed costs",
            value: values.fixedCosts,
            format: "currency",
            currency: "USD",
          },
          {
            key: "unitsSold",
            label: "Units sold",
            value: unitsSold,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Contribution per unit = price - variable cost; Break-even units = fixed costs / contribution per unit; Profit = units * contribution - fixed costs",
    assumptions: [
      "Variable cost per unit is constant across volume.",
      "Fixed costs are fixed for the chosen period.",
      "Ignores step-functions and capacity constraints (which can change fixed costs).",
    ],
    faqs: [
      {
        question: "Is break-even the same as profitability?",
        answer:
          "Break-even is the point where profit is exactly zero. Profitability means you are above break-even (positive profit) and ideally have margin to absorb uncertainty and fund growth.",
      },
      {
        question: "Should marketing spend be fixed or variable?",
        answer:
          "It depends on your model. Some marketing scales with volume (variable) and some is budgeted as fixed for a period. For break-even analysis, use the classification that matches how your costs actually behave.",
      },
    ],
  },
];
