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
          detail: "1 ÷ contribution margin",
        },
        secondary: [
          {
            key: "contributionMargin",
            label: "Contribution margin",
            value: contributionMargin,
            format: "percent",
            maxFractionDigits: 1,
            detail: "Gross margin − fees − shipping − returns",
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
    formula: "Break-even ROAS = 1 ÷ (Contribution margin)",
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
          detail: "1 ÷ (contribution margin − fixed − desired)",
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
            detail: "Gross margin − fees − shipping − returns",
          },
        ],
        warnings,
      };
    },
    formula:
      "Target ROAS = 1 ÷ (Contribution margin − Fixed cost allocation − Desired profit margin)",
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
          "If contribution margin minus allocations is ≤ 0, your unit economics can't support the chosen buffers. Reduce fixed/profit allocations or improve margin.",
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
          detail: "(Revenue − Cost) ÷ Cost",
        },
        secondary: [
          {
            key: "profit",
            label: "Profit",
            value: profit,
            format: "currency",
            currency: "USD",
            detail: "Revenue − Cost",
          },
          {
            key: "multiple",
            label: "Return multiple",
            value: safeDivide(values.revenue, values.cost) ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Revenue ÷ Cost",
          },
        ],
        warnings,
      };
    },
    formula: "ROI = (Revenue − Cost) ÷ Cost",
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
    description: "Estimate how many months it takes to recover CAC via gross profit.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "cac-payback-guide",
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
    ],
    guide: [
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
    ],
  },
  {
    slug: "mrr-calculator",
    title: "MRR Calculator",
    description: "Estimate Monthly Recurring Revenue (MRR) from customers and ARPA.",
    category: "saas-metrics",
    guideSlug: "mrr-guide",
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
          detail: "ARR × multiple",
        },
        warnings,
      };
    },
    formula: "Valuation = ARR × multiple",
    assumptions: [
      "Multiples vary widely by growth, margins, retention, and market conditions.",
      "This is a simple heuristic, not investment advice.",
    ],
    faqs: [
      {
        question: "What multiple should I use?",
        answer:
          "Use a range (e.g., 4×–10×) and sanity-check against growth rate, gross margin, and retention. Market conditions can move multiples significantly.",
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
];
