import type { CalculatorCategory, CalculatorDefinition, ResultValue } from "./types";

function safeDivide(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (denominator === 0) return null;
  return numerator / denominator;
}

export const categories: CalculatorCategory[] = [
  {
    slug: "saas-metrics",
    title: "SaaS Metrics",
    description:
      "SaaS unit economics and retention calculators for CAC, LTV, payback, churn, and growth quality.",
  },
  {
    slug: "paid-ads",
    title: "Paid Ads",
    description:
      "Paid ads performance calculators for ROAS, CPA, break-even targets, and budget decisions.",
  },
  {
    slug: "finance",
    title: "Finance",
    description:
      "Finance calculators for runway, burn, cash flow, and valuation planning.",
  },
];

export const calculators: CalculatorDefinition[] = [
  {
    slug: "roas-calculator",
    title: "ROAS Calculator",
    description:
      "Calculate Return on Ad Spend (ROAS) and estimate contribution profit after ad spend.",
    category: "paid-ads",
    featured: true,
    guideSlug: "roas-guide",
    relatedGlossarySlugs: [
      "roas",
      "break-even-roas",
      "target-roas",
      "mer",
      "blended-roas",
      "contribution-margin",
    ],
    seo: {
      intro: [
        "ROAS (return on ad spend) is the fastest way to compare campaigns: attributed revenue divided by ad spend over the same window.",
        "But ROAS is not profit. This calculator also estimates contribution profit after ad spend using margin, fees, shipping, and returns assumptions.",
      ],
      steps: [
        "Enter attributed revenue and ad spend for the same time window.",
        "Add your gross margin and variable cost assumptions (fees, shipping, returns).",
        "Review ROAS, break-even ROAS, and contribution profit after ad spend.",
        "Use the profit metrics to decide whether to scale, pause, or improve unit economics first.",
      ],
      benchmarks: [
        "Break-even ROAS is a floor; target ROAS should be higher to cover overhead and volatility.",
        "If profit after ads is negative, scaling spend will typically scale losses unless marginal performance improves.",
        "Compare ROAS only when attribution windows and conversion value tracking are consistent.",
      ],
      pitfalls: [
        "Mixing attribution windows (for example 7-day click vs 1-day view).",
        "Using gross revenue instead of net revenue (refunds and discounts matter).",
        "Comparing ROAS across campaigns with different product margins or different value tracking quality.",
      ],
    },
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
      const roasMultiple = safeDivide(values.revenue, values.adSpend);
      if (values.adSpend <= 0) warnings.push("Ad spend must be greater than 0.");

      const contributionMargin =
        (values.grossMarginPercent -
          values.paymentFeesPercent -
          values.shippingPercent -
          values.returnsPercent) /
        100;
      if (contributionMargin <= 0) {
        warnings.push(
          "Contribution margin must be greater than 0%. Check margin and variable cost assumptions.",
        );
      }
      if (contributionMargin > 1) {
        warnings.push("Contribution margin cannot exceed 100%. Check inputs.");
      }

      const contributionProfitBeforeAds =
        values.revenue * Math.max(contributionMargin, 0);
      const profitAfterAds = contributionProfitBeforeAds - values.adSpend;
      const breakEvenRoas = contributionMargin > 0 ? 1 / contributionMargin : 0;
      const profitPerDollar =
        values.adSpend > 0 ? profitAfterAds / values.adSpend : 0;
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
          detail: "Revenue / ad spend",
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
          {
            key: "profitAfterAds",
            label: "Contribution profit after ads",
            value: profitAfterAds,
            format: "currency",
            currency: "USD",
            detail: "Revenue * contribution margin - ad spend",
          },
          {
            key: "profitPerDollar",
            label: "Profit per $1 of ad spend",
            value: profitPerDollar,
            format: "currency",
            currency: "USD",
            maxFractionDigits: 2,
            detail: "Contribution profit after ads / ad spend",
          },
          {
            key: "contributionMargin",
            label: "Contribution margin",
            value: Math.max(contributionMargin, 0),
            format: "percent",
            maxFractionDigits: 1,
            detail: "Gross margin - fees - shipping - returns",
          },
          {
            key: "breakEvenRoas",
            label: "Break-even ROAS (variable economics)",
            value: breakEvenRoas,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "1 / contribution margin",
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
    formula: "ROAS = Revenue / Ad Spend",
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
          "Mixing attribution windows (for example 7-day click vs 1-day view).",
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
    relatedGlossarySlugs: ["break-even-roas", "contribution-margin", "gross-margin", "roas"],
    seo: {
      intro: [
        "Break-even ROAS is the minimum ROAS required to avoid losing money on variable economics (COGS and other variable costs).",
        "Use it as a floor. Your target ROAS should usually be higher to cover overhead, uncertainty, and desired profit.",
      ],
      steps: [
        "Enter gross margin (COGS only).",
        "Add variable cost percentages that scale with revenue (fees, shipping, returns).",
        "Compute contribution margin and break-even ROAS = 1 / contribution margin.",
        "Compare your current ROAS to break-even to see if spend is structurally profitable.",
      ],
      benchmarks: [
        "If contribution margin is 40%, break-even ROAS is 2.5x (1 / 0.40).",
        "If break-even ROAS is very high, fix unit economics (margin/fees/returns) before scaling spend.",
        "Use consistent net revenue (after refunds) when evaluating profitability.",
      ],
      pitfalls: [
        "Treating break-even ROAS as a scaling target (it is a floor, not a goal).",
        "Omitting variable costs that scale with revenue (fees, fulfillment, refunds).",
        "Mixing time windows or attribution models when comparing to platform ROAS.",
      ],
    },
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
        {
          key: "aov",
          label: "Average order value (AOV) (optional)",
          placeholder: "80",
          prefix: "$",
          defaultValue: "80",
          min: 0,
        },
        {
          key: "cvrPercent",
          label: "Conversion rate (CVR) (optional)",
          help: "Used to translate break-even ROAS into CPC/CPA targets.",
          placeholder: "2.5",
          suffix: "%",
          defaultValue: "2.5",
          min: 0,
          step: 0.1,
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
        const cvr = values.cvrPercent / 100;

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
        const breakevenCpa =
          values.aov > 0 ? values.aov * contributionMargin : 0;
        const breakevenCpc =
          values.aov > 0 && cvr > 0 ? breakevenCpa * cvr : 0;

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
            {
              key: "breakevenCpa",
              label: "Break-even CPA (from AOV)",
              value: breakevenCpa,
              format: "currency",
              currency: "USD",
              detail: values.aov > 0 ? "AOV x contribution margin" : "Add AOV",
            },
            {
              key: "breakevenCpc",
              label: "Break-even CPC (from CVR)",
              value: breakevenCpc,
              format: "currency",
              currency: "USD",
              detail: cvr > 0 ? "Break-even CPA x CVR" : "Add CVR",
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
            {
              key: "aov",
              label: "AOV",
              value: values.aov,
              format: "currency",
              currency: "USD",
            },
            {
              key: "cvr",
              label: "CVR",
              value: cvr,
              format: "percent",
              maxFractionDigits: 2,
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
    relatedGlossarySlugs: ["target-roas", "break-even-roas", "contribution-margin", "roas"],
    seo: {
      intro: [
        "Target ROAS is the ROAS you aim for to cover variable costs, fixed cost allocation, and a profit buffer.",
        "Unlike break-even ROAS (a floor), target ROAS is a planning constraint that reflects your business model and risk tolerance.",
      ],
      steps: [
        "Enter gross margin and variable costs to compute contribution margin.",
        "Choose a fixed cost allocation (as % of revenue) if you want ROAS to cover overhead.",
        "Add a desired profit margin buffer to stay conservative.",
        "Compute target ROAS = 1 / (contribution margin - fixed allocation - desired profit).",
      ],
      benchmarks: [
        "Target ROAS should be higher than break-even ROAS to cover overhead and volatility.",
        "If target ROAS is impossible (<= 0 ad budget), reduce buffers or improve margin first.",
        "Use different targets by channel if volatility and incrementality differ.",
      ],
      pitfalls: [
        "Allocating all fixed costs into target ROAS without considering growth investments and timing.",
        "Assuming target ROAS is universal across products (margins differ).",
        "Not revisiting the target when refund rate, shipping, or fees change.",
      ],
    },
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
        {
          key: "aov",
          label: "Average order value (AOV) (optional)",
          placeholder: "80",
          prefix: "$",
          defaultValue: "80",
          min: 0,
        },
        {
          key: "cvrPercent",
          label: "Conversion rate (CVR) (optional)",
          help: "Used to translate target ROAS into CPC/CPA targets.",
          placeholder: "2.5",
          suffix: "%",
          defaultValue: "2.5",
          min: 0,
          step: 0.1,
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
        const cvr = values.cvrPercent / 100;

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
        const maxCpa =
          availableForAds > 0 && values.aov > 0
            ? values.aov * availableForAds
            : 0;
        const maxCpc =
          availableForAds > 0 && values.aov > 0 && cvr > 0 ? maxCpa * cvr : 0;

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
            {
              key: "maxCpa",
              label: "Target CPA (from AOV)",
              value: maxCpa,
              format: "currency",
              currency: "USD",
              detail:
                availableForAds > 0 && values.aov > 0
                  ? "AOV x budget for ads"
                  : "Add AOV or reduce allocations",
            },
            {
              key: "maxCpc",
              label: "Target CPC (from CVR)",
              value: maxCpc,
              format: "currency",
              currency: "USD",
              detail: cvr > 0 ? "Target CPA x CVR" : "Add CVR",
            },
          ],
          breakdown: [
            {
              key: "aov",
              label: "AOV",
              value: values.aov,
              format: "currency",
              currency: "USD",
            },
            {
              key: "cvr",
              label: "CVR",
              value: cvr,
              format: "percent",
              maxFractionDigits: 2,
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
    seo: {
      intro: [
        "ROI (return on investment) measures profit relative to cost: (revenue - cost) / cost. It answers whether an initiative creates incremental value.",
        "ROI can be compared across projects only when the time window and cost definition are consistent. This calculator also estimates an annualized ROI when you provide a horizon.",
      ],
      steps: [
        "Enter revenue attributable to the campaign or project.",
        "Enter total incremental cost (ads, tools, labor, agencies) for the same window.",
        "Optionally enter the horizon in months to compute annualized ROI.",
        "Review ROI, profit, and the return multiple together.",
      ],
      benchmarks: [
        "Positive ROI means profit exceeds cost; ROI of 0% means break-even.",
        "High ROI on small spend can be less useful than moderate ROI at scalable volume; pair ROI with capacity constraints.",
        "For paid ads, compare ROI to ROAS and margin assumptions to avoid misattribution.",
      ],
      pitfalls: [
        "Using lifetime revenue for some campaigns but short-window cost for others (time mismatch).",
        "Leaving out 'hidden' costs like agency fees or salaries (definition drift).",
        "Treating attributed revenue as causal truth when incrementality is unknown.",
      ],
    },
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
      {
        key: "horizonMonths",
        label: "Horizon (months)",
        help: "Used to compute annualized ROI. Set to 12 if your inputs are annual.",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const horizonMonths = Math.max(1, Math.floor(values.horizonMonths));
      if (values.horizonMonths !== horizonMonths) {
        warnings.push("Horizon months was rounded down to a whole number.");
      }

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

        const annualizedRoi =
          roi > -1 ? Math.pow(1 + roi, 12 / horizonMonths) - 1 : null;
        if (annualizedRoi === null) {
          warnings.push(
            "Annualized ROI is not available when ROI is <= -100% (revenue is too low vs cost).",
          );
        }
        const monthlyProfit = profit / horizonMonths;
        const paybackMonths = monthlyProfit > 0 ? values.cost / monthlyProfit : null;

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
            key: "annualizedRoi",
            label: "Annualized ROI",
            value: annualizedRoi ?? 0,
            format: "percent",
            maxFractionDigits: 1,
            detail:
              annualizedRoi === null
                ? "Not available"
                : `Annualized from a ${horizonMonths}-month horizon`,
          },
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
          {
            key: "profitMargin",
            label: "Profit margin (on revenue)",
            value: values.revenue > 0 ? profit / values.revenue : 0,
            format: "percent",
            maxFractionDigits: 1,
            detail: "Profit / revenue",
          },
            {
              key: "breakEvenRevenue",
              label: "Break-even revenue",
              value: values.cost,
              format: "currency",
              currency: "USD",
              detail: "Revenue needed for ROI = 0%",
            },
            {
              key: "monthlyProfit",
              label: "Average monthly profit",
              value: monthlyProfit,
              format: "currency",
              currency: "USD",
              detail: `Profit / ${horizonMonths} months`,
            },
            {
              key: "paybackMonths",
              label: "Payback months (from profit)",
              value: paybackMonths ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail:
                paybackMonths === null
                  ? "Profit must be positive"
                  : "Cost / monthly profit",
            },
          ],
          warnings,
        };
      },
    formula:
      "ROI = (Revenue - Cost) / Cost; Annualized ROI = (1 + ROI)^(12 / months) - 1",
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
        {
          key: "arpaMonthly",
          label: "ARPA per month (optional)",
          placeholder: "200",
          prefix: "$",
          defaultValue: "200",
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
        const cac = safeDivide(values.spend, values.newCustomers);
        if (values.newCustomers <= 0)
          warnings.push("New customers must be greater than 0.");
        const grossMargin = values.grossMarginPercent / 100;
        const grossProfitPerMonth =
          values.arpaMonthly > 0 && grossMargin > 0
            ? values.arpaMonthly * grossMargin
            : null;
        const paybackMonths =
          grossProfitPerMonth && grossProfitPerMonth > 0
            ? values.spend / values.newCustomers / grossProfitPerMonth
            : null;
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
          secondary: [
            {
              key: "grossProfitPerMonth",
              label: "Gross profit per account / month",
              value: grossProfitPerMonth ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                grossProfitPerMonth === null
                  ? "Add ARPA and gross margin"
                  : "ARPA x gross margin",
            },
            {
              key: "paybackMonths",
              label: "Payback months (from ARPA/margin)",
              value: paybackMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail:
                paybackMonths === null
                  ? "Add ARPA and gross margin"
                  : "CAC / gross profit per month",
            },
          ],
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
            {
              key: "arpaMonthly",
              label: "ARPA per month",
              value: values.arpaMonthly,
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
    slug: "fully-loaded-cac-calculator",
    title: "Fully-loaded CAC Calculator",
    description:
      "Calculate fully-loaded CAC by including paid spend plus sales & marketing costs (salaries, tools, and other acquisition costs).",
    category: "saas-metrics",
    guideSlug: "fully-loaded-cac-guide",
    relatedGlossarySlugs: ["cac", "fully-loaded-cac"],
    seo: {
      intro: [
        "Fully-loaded CAC includes more than ad spend. It adds the costs required to acquire customers (sales & marketing salaries, tools, and other acquisition costs) to get a planning-grade CAC.",
        "Use the same time window for costs and new customers, and keep the definition consistent over time so trends are meaningful.",
      ],
      steps: [
        "Choose a time window (month/quarter) and a segment (paid channel, motion, plan).",
        "Enter paid spend and other acquisition costs for the same window.",
        "Enter the number of new paying customers acquired in the same window.",
        "Compute fully-loaded CAC = total acquisition costs ÷ new customers.",
      ],
      pitfalls: [
        "Using leads/trials as 'customers' (denominator mismatch).",
        "Mixing time windows (monthly costs with quarterly customers).",
        "Changing what you include month-to-month (definition drift).",
      ],
    },
    inputs: [
      {
        key: "paidSpend",
        label: "Paid media spend",
        placeholder: "60000",
        prefix: "$",
        defaultValue: "60000",
        min: 0,
      },
      {
        key: "salaries",
        label: "Sales & marketing salaries (allocated)",
        help: "Allocated to acquisition for the same time window (include commissions if you treat them as acquisition cost).",
        placeholder: "90000",
        prefix: "$",
        defaultValue: "90000",
        min: 0,
      },
      {
        key: "tools",
        label: "Tools & software (allocated)",
        placeholder: "12000",
        prefix: "$",
        defaultValue: "12000",
        min: 0,
      },
      {
        key: "otherCosts",
        label: "Other acquisition costs (optional)",
        help: "Agencies, creative production, list rentals, events, etc. (if you treat them as acquisition costs).",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
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
          label: "ARPA per month (optional)",
          placeholder: "500",
          prefix: "$",
          defaultValue: "500",
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
      if (customers <= 0)
        warnings.push("New customers must be greater than 0 to compute CAC.");

        const total =
          values.paidSpend + values.salaries + values.tools + values.otherCosts;
        if (total < 0)
          warnings.push("Total acquisition costs must be 0 or greater.");

        const cac = customers > 0 ? safeDivide(total, customers) : null;
        const paidShare = total > 0 ? values.paidSpend / total : 0;
        const nonPaidShare = total > 0 ? 1 - paidShare : 0;
        const grossMargin = values.grossMarginPercent / 100;
        const grossProfitPerMonth =
          values.arpaMonthly > 0 && grossMargin > 0
            ? values.arpaMonthly * grossMargin
            : null;
        const paybackMonths =
          grossProfitPerMonth && grossProfitPerMonth > 0 && cac
            ? cac / grossProfitPerMonth
            : null;
        if (cac === null) {
          return {
            headline: {
              key: "cac",
              label: "Fully-loaded CAC",
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
          label: "Fully-loaded CAC",
          value: cac,
          format: "currency",
          currency: "USD",
          detail: "Total acquisition costs ÷ new customers",
        },
          secondary: [
            {
              key: "total",
              label: "Total acquisition costs",
              value: total,
              format: "currency",
              currency: "USD",
            },
            {
              key: "paidShare",
              label: "Paid spend share of total",
              value: paidShare,
              format: "percent",
              maxFractionDigits: 1,
              detail: total > 0 ? "Paid spend / total costs" : "Total costs are 0",
            },
            {
              key: "nonPaidShare",
              label: "Non-paid share of total",
              value: nonPaidShare,
              format: "percent",
              maxFractionDigits: 1,
              detail: total > 0 ? "Salaries + tools + other" : "Total costs are 0",
            },
            {
              key: "paybackMonths",
              label: "Payback months (from ARPA/margin)",
              value: paybackMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail:
                paybackMonths === null
                  ? "Add ARPA and gross margin"
                  : "CAC / gross profit per month",
            },
          ],
          breakdown: [
            {
              key: "paidSpend",
              label: "Paid spend",
            value: values.paidSpend,
            format: "currency",
            currency: "USD",
          },
          {
            key: "salaries",
            label: "Salaries (allocated)",
            value: values.salaries,
            format: "currency",
            currency: "USD",
          },
          {
            key: "tools",
            label: "Tools (allocated)",
            value: values.tools,
            format: "currency",
            currency: "USD",
          },
          {
            key: "otherCosts",
            label: "Other costs",
            value: values.otherCosts,
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
            {
              key: "arpaMonthly",
              label: "ARPA per month",
              value: values.arpaMonthly,
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
          ],
          warnings,
        };
      },
    formula:
      "Fully-loaded CAC = (paid spend + salaries + tools + other) ÷ new customers",
    assumptions: [
      "All costs and new customers are measured over the same time window.",
      "Salaries/tools are allocated to acquisition consistently (planning definition).",
      "Use segment-level CAC (channel/plan) when possible; blended numbers can hide weak cohorts.",
    ],
    faqs: [
      {
        question: "Is fully-loaded CAC better than paid CAC?",
        answer:
          "They answer different questions. Paid CAC helps optimize paid channels; fully-loaded CAC is more useful for planning and unit economics because it includes the costs required to acquire customers.",
      },
      {
        question: "Should I include support and COGS in CAC?",
        answer:
          "Typically no. CAC focuses on acquisition costs. Support/hosting are usually part of COGS and affect gross margin, which impacts payback and LTV.",
      },
    ],
    guide: [
      {
        title: "How to use fully-loaded CAC",
        bullets: [
          "Use it for planning and unit economics (payback, LTV:CAC).",
          "Keep the definition stable over time to avoid misleading trends.",
          "Segment by channel and plan to find which motions are sustainable.",
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
    relatedGlossarySlugs: ["ltv", "arpa", "gross-margin", "churn-rate"],
    seo: {
      intro: [
        "This is a quick LTV (Lifetime Value) model based on monthly ARPA, gross margin, and churn. It estimates how much gross profit you earn per customer over their expected lifetime.",
        "For accuracy, keep time units consistent (monthly ARPA with monthly churn). For mature businesses, cohort-based LTV is more reliable than a single churn rate.",
      ],
      steps: [
        "Choose a segment (plan/channel/geo) and a time unit (monthly).",
        "Enter ARPA per month and gross margin for the segment.",
        "Enter monthly churn rate (customer churn for this model).",
        "Compute LTV = (ARPA * gross margin) / churn.",
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
        {
          key: "annualDiscountRatePercent",
          label: "Annual discount rate (optional)",
          help: "Used to compute discounted LTV. Set 0 to disable.",
          placeholder: "10",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
        },
        {
          key: "cac",
          label: "CAC (optional)",
          help: "Used to compute LTV:CAC.",
          placeholder: "500",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
        {
          key: "targetLtvToCac",
          label: "Target LTV:CAC (optional)",
          help: "Used to estimate max CAC at your LTV.",
          placeholder: "3",
          defaultValue: "3",
          min: 0,
          step: 0.1,
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

        const annualDiscount = values.annualDiscountRatePercent / 100;
        const monthlyDiscount =
          annualDiscount > 0 ? Math.pow(1 + annualDiscount, 1 / 12) - 1 : 0;
        const discountedLifetimeMonths =
          safeDivide(1 + monthlyDiscount, churn + monthlyDiscount) ?? 0;
        const discountedLtv =
          values.arpaMonthly * grossMargin * discountedLifetimeMonths;
        const ltvToCac =
          values.cac > 0 ? safeDivide(ltv, values.cac) : null;
        const maxCacAtTarget =
          values.targetLtvToCac > 0 ? ltv / values.targetLtvToCac : null;

        return {
          headline: {
            key: "ltv",
            label: "LTV",
            value: ltv,
          format: "currency",
          currency: "USD",
          detail: "(ARPA * gross margin) / churn",
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
            detail: "1 / churn rate",
          },
          {
            key: "discountedLtv",
            label: "Discounted LTV",
            value: discountedLtv,
            format: "currency",
            currency: "USD",
            detail:
              annualDiscount > 0
                ? "Uses a constant churn + constant discount rate shortcut"
                : "Set annual discount rate to use a discounted view",
          },
          {
            key: "discountedLifetimeMonths",
            label: "Discounted lifetime (months)",
            value: discountedLifetimeMonths,
            format: "months",
            maxFractionDigits: 1,
            detail: "Shorter than 1/churn when discount rate > 0",
          },
            {
              key: "monthlyDiscountRate",
              label: "Monthly discount rate",
              value: monthlyDiscount,
              format: "percent",
              maxFractionDigits: 2,
              detail: annualDiscount > 0 ? "Derived from annual rate" : "0%",
            },
            {
              key: "ltvToCac",
              label: "LTV:CAC",
              value: ltvToCac ?? 0,
              format: "ratio",
              maxFractionDigits: 2,
              detail: ltvToCac === null ? "Add CAC" : "LTV / CAC",
            },
            {
              key: "maxCacAtTarget",
              label: "Max CAC at target ratio",
              value: maxCacAtTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                values.targetLtvToCac > 0
                  ? "LTV / target ratio"
                  : "Target ratio is 0",
            },
          ],
          warnings,
        };
      },
    formula: "LTV = (ARPA * Gross Margin) / Churn Rate",
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
    slug: "ltv-sensitivity-calculator",
    title: "LTV Sensitivity Calculator",
      description:
        "See how gross profit LTV changes as churn and gross margin vary (simple 3x3 sensitivity).",
    category: "saas-metrics",
    guideSlug: "ltv-sensitivity-guide",
    relatedGlossarySlugs: ["ltv", "arpa", "gross-margin", "churn-rate", "sensitivity-analysis"],
    seo: {
      intro: [
        "Quick LTV models are simple but sensitive. Small changes in churn or gross margin can dramatically change LTV because churn sits in the denominator.",
          "This calculator generates a 3x3 LTV grid by varying churn and gross margin around your base assumptions.",
      ],
      steps: [
        "Enter ARPA (monthly), gross margin, and monthly churn as base inputs.",
          "Choose step sizes for margin and churn (+/- around the base).",
        "Review the LTV grid and identify which lever matters most for your model.",
      ],
      pitfalls: [
        "Treating constant-churn LTV as precise (use cohorts for accuracy).",
        "Using revenue LTV when comparing to fully-loaded CAC (mismatch).",
        "Mixing monthly ARPA with annual churn (unit mismatch).",
      ],
    },
    inputs: [
      {
        key: "arpaMonthly",
        label: "ARPA (monthly)",
        placeholder: "200",
        prefix: "$",
        defaultValue: "200",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin (base)",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
      {
        key: "marginStepPercent",
        label: "Margin step",
          help: "Uses +/- step around margin base to create a 3x3 grid.",
        placeholder: "5",
        suffix: "%",
        defaultValue: "5",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyChurnPercent",
        label: "Monthly churn (base)",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: 0,
        step: 0.1,
      },
      {
        key: "churnStepPercent",
        label: "Churn step",
          help: "Uses +/- step around churn base to create a 3x3 grid.",
        placeholder: "1",
        suffix: "%",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");

      const baseMargin = values.grossMarginPercent / 100;
      const marginStep = values.marginStepPercent / 100;
      if (baseMargin <= 0) warnings.push("Gross margin must be greater than 0%.");
      if (baseMargin > 1) warnings.push("Gross margin must be 100% or less.");

      const baseChurn = values.monthlyChurnPercent / 100;
      const churnStep = values.churnStepPercent / 100;
      if (baseChurn <= 0)
        warnings.push("Monthly churn must be greater than 0% for LTV.");

      const marginLow = Math.max(0, baseMargin - marginStep);
      const marginMid = baseMargin;
      const marginHigh = Math.min(1, baseMargin + marginStep);

      const churnLow = Math.max(0.000001, baseChurn - churnStep);
      const churnMid = baseChurn;
      const churnHigh = baseChurn + churnStep;

      const ltvAt = (margin: number, churn: number) => {
        const gpPerMonth = values.arpaMonthly * margin;
        return safeDivide(gpPerMonth, churn);
      };

      const baseLtv = ltvAt(marginMid, churnMid);
      if (baseLtv === null) warnings.push("Base inputs are invalid for LTV.");

      const grid: Array<{ key: string; label: string; value: number }> = [];
      const points: Array<[string, number, number]> = [
        ["ltv_marginLow_churnLow", marginLow, churnLow],
        ["ltv_marginLow_churnMid", marginLow, churnMid],
        ["ltv_marginLow_churnHigh", marginLow, churnHigh],
        ["ltv_marginMid_churnLow", marginMid, churnLow],
        ["ltv_marginMid_churnMid", marginMid, churnMid],
        ["ltv_marginMid_churnHigh", marginMid, churnHigh],
        ["ltv_marginHigh_churnLow", marginHigh, churnLow],
        ["ltv_marginHigh_churnMid", marginHigh, churnMid],
        ["ltv_marginHigh_churnHigh", marginHigh, churnHigh],
      ];

      for (const [key, margin, churn] of points) {
        const ltv = ltvAt(margin, churn);
        if (ltv === null) continue;
        grid.push({
          key,
          label: `LTV @ ${(margin * 100).toFixed(1)}% / ${(churn * 100).toFixed(1)}% churn`,
          value: ltv,
        });
      }

        if (grid.length < 5) {
          warnings.push(
            "Many grid points are invalid because churn is too close to 0%. Increase churn or adjust steps.",
          );
        }
        const valuesOnly = grid.map((g) => g.value);
        const bestLtv = valuesOnly.length > 0 ? Math.max(...valuesOnly) : null;
        const worstLtv = valuesOnly.length > 0 ? Math.min(...valuesOnly) : null;
        const ltvRange =
          bestLtv !== null && worstLtv !== null ? bestLtv - worstLtv : null;

        const secondary: ResultValue[] = [
          {
            key: "bestLtv",
            label: "Best-case LTV (grid max)",
            value: bestLtv ?? 0,
            format: "currency",
            currency: "USD",
            detail: bestLtv === null ? "No valid grid values" : "Highest LTV in grid",
          },
          {
            key: "worstLtv",
            label: "Worst-case LTV (grid min)",
            value: worstLtv ?? 0,
            format: "currency",
            currency: "USD",
            detail: worstLtv === null ? "No valid grid values" : "Lowest LTV in grid",
          },
          {
            key: "ltvRange",
            label: "LTV range (max - min)",
            value: ltvRange ?? 0,
            format: "currency",
            currency: "USD",
            detail: ltvRange === null ? "No valid grid values" : "Sensitivity spread",
          },
          ...grid.map(
            (g): ResultValue => ({
              key: g.key,
              label: g.label,
              value: g.value,
              format: "currency",
              currency: "USD",
            }),
          ),
        ];

        return {
          headline: {
            key: "ltvBase",
            label: "Gross profit LTV (base case)",
            value: baseLtv ?? (grid[0]?.value ?? 0),
            format: "currency",
            currency: "USD",
            detail: `Base: ${values.grossMarginPercent.toFixed(1)}% / ${values.monthlyChurnPercent.toFixed(1)}% churn`,
          },
          secondary,
          warnings,
        };
      },
      formula:
        "Gross profit LTV ~= (ARPA x gross margin) / churn; Sensitivity varies gross margin and churn around a base case",
    assumptions: [
      "Uses a constant-churn shortcut model (planning).",
        "LTV is modeled as gross profit (ARPA x gross margin) to align with CAC and payback.",
      "Only shows a small grid; use cohort curves for precision.",
    ],
    faqs: [
      {
        question: "Why is LTV so sensitive to churn?",
        answer:
          "Because churn is in the denominator. Small changes in churn can create large changes in lifetime and therefore in LTV in simple models.",
      },
      {
        question: "Should I use this instead of cohort LTV?",
        answer:
          "Use this for planning and sensitivity. For accuracy, use cohort-based LTV from observed retention and expansion over time.",
      },
    ],
    guide: [
      {
        title: "How to use LTV sensitivity",
        bullets: [
          "If LTV is most sensitive to churn, prioritize retention and activation improvements.",
          "If LTV is most sensitive to margin, prioritize COGS and variable cost improvements.",
          "Pair with payback and CAC to ensure growth is cash-feasible.",
        ],
      },
    ],
  },
  {
    slug: "ltv-to-cac-calculator",
    title: "LTV:CAC Calculator",
    description:
      "Compute LTV:CAC ratio and CAC payback using ARPA, gross margin, churn, and CAC.",
    category: "saas-metrics",
    featured: true,
    guideSlug: "ltv-cac-guide",
    relatedGlossarySlugs: ["ltv", "cac", "ltv-to-cac", "cac-payback-period", "gross-margin"],
    seo: {
      intro: [
        "LTV:CAC is a shortcut metric for unit economics: how much gross profit you earn over the expected lifetime relative to what you paid to acquire the customer.",
        "This calculator keeps definitions consistent by computing LTV from ARPA, gross margin, and churn, and also reports CAC payback months.",
      ],
      steps: [
        "Pick a segment (channel/plan/geo) and keep time units monthly.",
        "Enter CAC and ARPA per month for the segment.",
        "Enter gross margin and monthly churn for the same revenue base.",
        "Review LTV, payback months, and the LTV:CAC ratio together.",
      ],
      benchmarks: [
        "Many SaaS teams target around 3:1, but the right ratio depends on growth and cash constraints.",
        "A strong ratio with very long payback can still be risky in volatile channels.",
        "If churn is underestimated, LTV and LTV:CAC will be overstated (sensitivity matters).",
      ],
      pitfalls: [
        "Mixing fully-loaded CAC with LTV that excludes gross margin (definition mismatch).",
        "Using revenue retention as if it were customer churn in a simple churn model.",
        "Using blended averages that hide weak cohorts (segment before deciding budgets).",
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
        {
          key: "targetRatio",
          label: "Target LTV:CAC (optional)",
          placeholder: "3",
          defaultValue: "3",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.cac <= 0) warnings.push("CAC must be greater than 0.");

      const grossMargin = values.grossMarginPercent / 100;
      const churn = values.churnPercent / 100;
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (grossMargin <= 0) warnings.push("Gross margin must be greater than 0%.");
      if (churn <= 0) warnings.push("Churn must be greater than 0%.");

        const grossProfitPerMonth = values.arpaMonthly * Math.max(grossMargin, 0);
        const ltv = safeDivide(grossProfitPerMonth, churn) ?? 0;
        const ratio = safeDivide(ltv, values.cac);
        const paybackMonths = safeDivide(values.cac, grossProfitPerMonth);
        const maxCacAtTarget =
          values.targetRatio > 0 ? ltv / values.targetRatio : null;

        if (ratio === null || paybackMonths === null) {
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
          detail: "LTV / CAC",
        },
        secondary: [
          {
            key: "ltv",
            label: "LTV (gross profit)",
            value: ltv,
            format: "currency",
            currency: "USD",
            detail: "(ARPA * gross margin) / churn",
          },
          {
            key: "paybackMonths",
            label: "CAC payback (months)",
            value: paybackMonths,
            format: "months",
            maxFractionDigits: 1,
            detail: "CAC / (ARPA * gross margin)",
          },
            {
              key: "grossProfitPerMonth",
              label: "Gross profit / month",
              value: grossProfitPerMonth,
              format: "currency",
              currency: "USD",
            },
            {
              key: "maxCacAtTarget",
              label: "Max CAC at target ratio",
              value: maxCacAtTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                maxCacAtTarget === null
                  ? "Target ratio is 0"
                  : "LTV / target ratio",
            },
          ],
        breakdown: [
          {
            key: "cac",
            label: "CAC",
            value: values.cac,
            format: "currency",
            currency: "USD",
          },
          {
            key: "arpaMonthly",
            label: "ARPA per month",
            value: values.arpaMonthly,
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
            key: "churnPercent",
            label: "Monthly churn",
            value: churn,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "LTV = (ARPA * gross margin) / churn; LTV:CAC = LTV / CAC; Payback = CAC / (ARPA * gross margin)",
    assumptions: [
      "Uses a constant-churn shortcut model (planning).",
      "LTV is modeled as gross profit to align with CAC and payback.",
      "Use segment-level inputs (channel/plan/geo) for decision-making.",
    ],
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
        "When people search \"months to recover CAC\", they usually mean this payback period: CAC divided by gross profit per month.",
      ],
      steps: [
        "Choose a segment (channel/plan/geo) and a time window (usually monthly).",
        "Estimate ARPA per month for the segment.",
        "Choose gross margin for the same revenue base (product gross margin is common).",
        "Compute gross profit per month: ARPA * gross margin.",
        "Divide CAC by gross profit per month to get payback months.",
      ],
      benchmarks: [
        "Many B2B SaaS teams target around 6-18 months depending on stage and burn.",
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
        {
          key: "annualDiscountRatePercent",
          label: "Annual discount rate (optional)",
          help: "Used to compute discounted payback. Set 0 to disable.",
          placeholder: "10",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
        },
        {
          key: "monthlyChurnPercent",
          label: "Monthly churn (optional)",
          help: "Used to compare payback vs expected lifetime (1 / churn).",
          placeholder: "3",
          suffix: "%",
          defaultValue: "3",
          min: 0,
          step: 0.1,
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

        const annualDiscount = values.annualDiscountRatePercent / 100;
        const monthlyDiscount =
          annualDiscount > 0 ? Math.pow(1 + annualDiscount, 1 / 12) - 1 : 0;
        const churn = values.monthlyChurnPercent / 100;
        const expectedLifetimeMonths = churn > 0 ? 1 / churn : null;
        const paybackToLifetime =
          expectedLifetimeMonths && expectedLifetimeMonths > 0
            ? months / expectedLifetimeMonths
            : null;
        if (paybackToLifetime !== null && paybackToLifetime > 1) {
          warnings.push("Payback exceeds expected lifetime (check churn or ARPA).");
        }

        let discountedPaybackMonths: number | null = null;
        if (monthlyDiscount > 0) {
          const ratio = safeDivide(values.cac * monthlyDiscount, grossProfitPerMonth);
          if (ratio === null || ratio >= 1) {
            warnings.push(
            "Discounted payback is not reachable with this discount rate (present value of future gross profit is capped).",
          );
        } else {
          discountedPaybackMonths =
            Math.log(1 / (1 - ratio)) / Math.log(1 + monthlyDiscount);
        }
      }

      return {
        headline: {
          key: "payback",
          label: "Payback period",
          value: months,
          format: "months",
          maxFractionDigits: 1,
          detail: "CAC / (ARPA * gross margin)",
        },
        secondary: [
          {
            key: "grossProfitPerMonth",
            label: "Gross profit / month",
            value: grossProfitPerMonth,
            format: "currency",
            currency: "USD",
          },
            {
              key: "discountedPayback",
              label: "Discounted payback (months)",
              value: discountedPaybackMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
            detail:
              monthlyDiscount > 0
                ? discountedPaybackMonths === null
                  ? "Not reachable with these inputs"
                  : "Uses discounted cash flow of monthly gross profit"
                : "Set annual discount rate to compute discounted payback",
          },
            {
              key: "monthlyDiscountRate",
              label: "Monthly discount rate",
              value: monthlyDiscount,
              format: "percent",
              maxFractionDigits: 2,
              detail: annualDiscount > 0 ? "Derived from annual rate" : "0%",
            },
            {
              key: "expectedLifetimeMonths",
              label: "Expected lifetime (months)",
              value: expectedLifetimeMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail: churn > 0 ? "1 / churn rate" : "Add monthly churn",
            },
            {
              key: "paybackToLifetime",
              label: "Payback as % of lifetime",
              value: paybackToLifetime ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                paybackToLifetime === null
                  ? "Add monthly churn"
                  : "Payback months / lifetime",
            },
          ],
          warnings,
        };
      },
    formula: "Payback (months) = CAC / (ARPA * Gross Margin)",
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
          "Compute gross profit per month (ARPA * gross margin), then divide CAC by gross profit per month. The result is the CAC payback period in months.",
      },
    ],
    guide: [
      {
        title: "How to calculate CAC payback",
        bullets: [
          "Pick a time window (usually month) and a segment (plan/channel/geo).",
          "Compute gross profit per month: ARPA * gross margin.",
          "Compute payback months: CAC / gross profit per month.",
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
    slug: "cac-payback-sensitivity-calculator",
    title: "CAC Payback Sensitivity Calculator",
      description:
        "See how CAC payback months change as ARPA and gross margin vary (simple 3x3 sensitivity).",
    category: "saas-metrics",
    guideSlug: "cac-payback-sensitivity-guide",
    relatedGlossarySlugs: [
      "cac",
      "cac-payback-period",
      "arpa",
      "gross-margin",
      "sensitivity-analysis",
    ],
    seo: {
      intro: [
        "CAC payback is a simple formula, but your inputs move in the real world (pricing, mix, and margin). Sensitivity analysis helps you see how fragile (or robust) payback is.",
          "This calculator generates a 3x3 payback grid by varying ARPA and gross margin around your base assumptions.",
      ],
      steps: [
        "Enter your base CAC, ARPA per month, and gross margin.",
          "Choose step sizes for ARPA and margin (e.g., +/-10% ARPA, +/-5% margin).",
        "Review the payback grid and identify which lever improves payback fastest for your model.",
      ],
      pitfalls: [
        "Using revenue payback while CAC is fully-loaded (mismatch).",
        "Mixing monthly ARPA with annualized CAC (time window mismatch).",
        "Picking step ranges that are too narrow and concluding payback is stable (false confidence).",
      ],
    },
    inputs: [
      {
        key: "cac",
        label: "CAC",
        placeholder: "6000",
        prefix: "$",
        defaultValue: "6000",
        min: 0,
      },
      {
        key: "arpaMonthly",
        label: "ARPA per month (base)",
        placeholder: "800",
        prefix: "$",
        defaultValue: "800",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin (base)",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
      {
        key: "arpaStepPercent",
        label: "ARPA step",
          help: "Uses +/- step around ARPA base to create a 3x3 grid.",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
        min: 0,
        step: 0.1,
      },
      {
        key: "grossMarginStepPercent",
        label: "Gross margin step",
          help: "Uses +/- step around margin base to create a 3x3 grid.",
        placeholder: "5",
        suffix: "%",
        defaultValue: "5",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];

      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");

      const baseMargin = values.grossMarginPercent / 100;
      if (baseMargin <= 0) warnings.push("Gross margin must be greater than 0%.");
      if (baseMargin > 1) warnings.push("Gross margin must be 100% or less.");

      const arpaStep = values.arpaStepPercent / 100;
      const marginStep = values.grossMarginStepPercent / 100;
      if (arpaStep < 0) warnings.push("ARPA step must be 0% or greater.");
      if (marginStep < 0) warnings.push("Margin step must be 0% or greater.");

      const paybackAt = (arpa: number, margin: number) => {
        const grossProfitPerMonth = arpa * margin;
        return safeDivide(values.cac, grossProfitPerMonth);
      };

      const arpaLow = Math.max(0, values.arpaMonthly * (1 - arpaStep));
      const arpaMid = values.arpaMonthly;
      const arpaHigh = values.arpaMonthly * (1 + arpaStep);

      const marginLow = Math.max(0, baseMargin - marginStep);
      const marginMid = baseMargin;
      const marginHigh = Math.min(1, baseMargin + marginStep);

      const basePayback = paybackAt(arpaMid, marginMid);
      if (basePayback === null) warnings.push("Base inputs are invalid for payback.");

      const grid: Array<{ key: string; label: string; value: number }> = [];
      const points: Array<[string, number, number]> = [
        ["payback_arpaLow_marginLow", arpaLow, marginLow],
        ["payback_arpaLow_marginMid", arpaLow, marginMid],
        ["payback_arpaLow_marginHigh", arpaLow, marginHigh],
        ["payback_arpaMid_marginLow", arpaMid, marginLow],
        ["payback_arpaMid_marginMid", arpaMid, marginMid],
        ["payback_arpaMid_marginHigh", arpaMid, marginHigh],
        ["payback_arpaHigh_marginLow", arpaHigh, marginLow],
        ["payback_arpaHigh_marginMid", arpaHigh, marginMid],
        ["payback_arpaHigh_marginHigh", arpaHigh, marginHigh],
      ];

      for (const [key, arpa, margin] of points) {
        const payback = paybackAt(arpa, margin);
        if (payback === null) continue;
        grid.push({
          key,
          label: `Payback @ $${arpa.toFixed(0)} / ${(margin * 100).toFixed(1)}%`,
          value: payback,
        });
      }

      if (grid.length < 5) {
        warnings.push(
          "Many grid points are invalid (gross profit/month is too close to 0). Increase ARPA/margin or reduce steps.",
        );
      }

        const headlinePayback = basePayback ?? (grid[0]?.value ?? 0);
        const valuesOnly = grid.map((g) => g.value);
        const bestPayback =
          valuesOnly.length > 0 ? Math.min(...valuesOnly) : null;
        const worstPayback =
          valuesOnly.length > 0 ? Math.max(...valuesOnly) : null;
        const paybackRange =
          bestPayback !== null && worstPayback !== null
            ? worstPayback - bestPayback
            : null;

        const secondary: ResultValue[] = [
          {
            key: "bestPayback",
            label: "Best-case payback (grid min)",
            value: bestPayback ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: bestPayback === null ? "No valid grid values" : "Lowest payback in grid",
          },
          {
            key: "worstPayback",
            label: "Worst-case payback (grid max)",
            value: worstPayback ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: worstPayback === null ? "No valid grid values" : "Highest payback in grid",
          },
          {
            key: "paybackRange",
            label: "Payback range (max - min)",
            value: paybackRange ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: paybackRange === null ? "No valid grid values" : "Sensitivity spread",
          },
          ...grid.map(
            (g): ResultValue => ({
              key: g.key,
              label: g.label,
              value: g.value,
              format: "months",
              maxFractionDigits: 1,
            }),
          ),
        ];

        return {
          headline: {
            key: "paybackBase",
            label: "CAC payback (base case)",
            value: headlinePayback,
            format: "months",
            maxFractionDigits: 1,
            detail: `Base: $${values.arpaMonthly.toFixed(0)} / ${values.grossMarginPercent.toFixed(1)}%`,
          },
          secondary,
          warnings,
        };
      },
    formula:
      "Payback (months) = CAC / (ARPA x gross margin); Sensitivity varies ARPA and gross margin around a base case",
    assumptions: [
      "Uses gross profit payback: ARPA x gross margin approximates monthly gross profit per account.",
      "Assumes ARPA and gross margin are stable during the payback period (planning shortcut).",
      "Only shows a small grid; use broader scenarios for full planning.",
    ],
    faqs: [
      {
        question: "Why use gross margin instead of revenue for payback?",
        answer:
          "Because payback should reflect contribution (value created after COGS). Revenue-based payback can overstate how fast you recover CAC.",
      },
      {
        question: "What ARPA and margin ranges should I test?",
        answer:
          "Test ranges that reflect pricing/mix uncertainty. A common starting point is +/-10-20% ARPA and +/-5-10% margin, then widen if your business is volatile.",
      },
      {
        question: "Is this the same as cohort payback curves?",
        answer:
          "No. This is a simple sensitivity tool for steady-state assumptions. Cohort payback curves model early churn and changing revenue/margin over time.",
      },
    ],
    guide: [
      {
        title: "How to use payback sensitivity",
        bullets: [
          "If payback is extremely sensitive to margin, focus on COGS and variable cost control.",
          "If payback is extremely sensitive to ARPA, focus on pricing, packaging, and upsell.",
          "Use segment-level inputs (plan/channel) instead of blended averages when possible.",
        ],
      },
    ],
  },
  {
    slug: "churn-rate-calculator",
    title: "Churn Rate Calculator",
    description:
      "Calculate customer churn rate for a period and compare retention across segments or cohorts.",
    category: "saas-metrics",
    guideSlug: "churn-guide",
    seo: {
      intro: [
        "Customer churn rate measures the share of customers you lost over a period. It is a core retention metric for subscription businesses.",
        "Churn can be misleading if you mix segments. Track churn by cohort, plan, and acquisition channel before you make budget decisions.",
      ],
      steps: [
        "Pick a time window (month/quarter) and a segment (plan/channel/geo).",
        "Enter customers at the start of the period and customers lost during the period.",
        "Compute churn = lost / start and retention = 1 - churn.",
        "Optionally annualize churn by specifying periods per year (12 for monthly, 4 for quarterly).",
      ],
      benchmarks: [
        "Small changes in churn compound over time; pair churn with LTV and payback.",
        "If churn is mostly involuntary (failed payments), fix dunning before you change acquisition budgets.",
        "Revenue retention (NRR/GRR) can look better than customer churn if expansion is strong.",
      ],
      pitfalls: [
        "Comparing churn across periods with different definitions of 'active customer'.",
        "Using blended churn across segments with different retention (the blend can drift).",
        "Annualizing a period that is not consistent (for example mixing monthly and quarterly inputs).",
      ],
    },
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
      {
        key: "periodsPerYear",
        label: "Periods per year (optional)",
        help: "12 for monthly, 4 for quarterly. Used to compute annualized churn.",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingCustomers <= 0)
        warnings.push("Customers at start must be greater than 0.");

      const periodsPerYear = Math.max(1, Math.floor(values.periodsPerYear));
      if (values.periodsPerYear !== periodsPerYear) {
        warnings.push("Periods per year was rounded down to a whole number.");
      }

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

      const retention = Math.max(0, 1 - churn);
      const annualRetention = Math.pow(retention, periodsPerYear);
      const annualChurn = 1 - annualRetention;
      const retainedCustomers = values.startingCustomers - values.lostCustomers;
      return {
        headline: {
          key: "churn",
          label: "Churn rate",
          value: churn,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Lost / start",
        },
        secondary: [
          {
            key: "retention",
            label: "Retention rate (same period)",
            value: retention,
            format: "percent",
            maxFractionDigits: 2,
            detail: "1 - churn",
          },
          {
            key: "retainedCustomers",
            label: "Customers retained",
            value: retainedCustomers,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "annualChurn",
            label: "Annualized churn rate",
            value: annualChurn,
            format: "percent",
            maxFractionDigits: 2,
            detail: `${periodsPerYear} periods/year`,
          },
        ],
        breakdown: [
          {
            key: "startingCustomers",
            label: "Customers at start",
            value: values.startingCustomers,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "lostCustomers",
            label: "Customers lost",
            value: values.lostCustomers,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula: "Churn Rate = Customers Lost / Customers at Start",
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
    seo: {
      intro: [
        "Customer retention rate measures how many of your starting customers are still active at the end of the period, excluding new customers acquired during the period.",
        "Retention is the inverse view of churn for the same window. Use revenue retention (NRR/GRR) when upsells and downgrades materially change dollars retained.",
      ],
      steps: [
        "Pick a time window (month/quarter) and a segment (plan/channel/geo).",
        "Enter customers at start and customers at end of the period.",
        "Enter new customers added during the period.",
        "Compute retention = (end - new) / start and optionally annualize via periods per year.",
      ],
      benchmarks: [
        "Retention above 100% is unusual for customer retention; it typically indicates an input mismatch.",
        "Even small retention improvements can materially raise LTV due to compounding.",
        "Use cohort retention curves to understand early vs late retention dynamics.",
      ],
      pitfalls: [
        "Mixing definitions of 'active customer' between start and end counts.",
        "Counting reactivations inconsistently (treat as retained vs new).",
        "Using blended retention across segments with different behaviors (mix shifts).",
      ],
    },
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
      {
        key: "periodsPerYear",
        label: "Periods per year (optional)",
        help: "12 for monthly, 4 for quarterly. Used to compute annualized retention.",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingCustomers <= 0)
        warnings.push("Customers at start must be greater than 0.");

      const periodsPerYear = Math.max(1, Math.floor(values.periodsPerYear));
      if (values.periodsPerYear !== periodsPerYear) {
        warnings.push("Periods per year was rounded down to a whole number.");
      }

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

      if (retained < 0) {
        warnings.push("Retained customers is negative (new customers exceeds ending customers).");
      }
      if (retained > values.startingCustomers) {
        warnings.push("Retained customers exceeds starting customers (check inputs).");
      }

      const churn = 1 - retention;
      const annualRetention = Math.pow(Math.max(0, retention), periodsPerYear);
      const annualChurn = 1 - annualRetention;
      return {
        headline: {
          key: "retention",
          label: "Retention rate",
          value: retention,
          format: "percent",
          maxFractionDigits: 2,
          detail: "(End - new) / start",
        },
        secondary: [
          {
            key: "retainedCustomers",
            label: "Retained customers",
            value: retained,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "churn",
            label: "Churn rate (same period)",
            value: churn,
            format: "percent",
            maxFractionDigits: 2,
            detail: "1 - retention",
          },
          {
            key: "annualRetention",
            label: "Annualized retention rate",
            value: annualRetention,
            format: "percent",
            maxFractionDigits: 2,
            detail: `${periodsPerYear} periods/year`,
          },
          {
            key: "annualChurn",
            label: "Annualized churn rate",
            value: annualChurn,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        breakdown: [
          {
            key: "startingCustomers",
            label: "Customers at start",
            value: values.startingCustomers,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "endingCustomers",
            label: "Customers at end",
            value: values.endingCustomers,
            format: "number",
            maxFractionDigits: 0,
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
    formula:
      "Retention Rate = (Customers at End - New Customers) / Customers at Start",
    assumptions: ["Inputs represent the same period (e.g., month, quarter)."],
    faqs: [
      {
        question: "Can retention rate be above 100%?",
        answer:
          "Customer retention typically stays <= 100%. If you're above 100%, double-check inputs or consider revenue retention instead.",
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
        key: "periodMonths",
        label: "Period length (months)",
        help: "1 for monthly, 12 for annual.",
        placeholder: "1",
        defaultValue: "1",
        min: 0.1,
        step: 0.1,
      },
      {
        key: "avgUsers",
        label: "Average active users (period)",
        placeholder: "2000",
        defaultValue: "2000",
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin (optional)",
        help: "Used to estimate gross profit per user.",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.avgUsers <= 0) warnings.push("Average users must be greater than 0.");
      if (values.periodMonths <= 0) warnings.push("Period length must be greater than 0.");
      if (values.grossMarginPercent < 0 || values.grossMarginPercent > 100) {
        warnings.push("Gross margin must be between 0% and 100%.");
      }
      const arpu = safeDivide(values.revenue, values.avgUsers);
      const annualizedArpu =
        arpu !== null && values.periodMonths > 0
          ? (arpu / values.periodMonths) * 12
          : null;
      const grossMargin = values.grossMarginPercent / 100;
      const grossProfitPerUser =
        arpu !== null && grossMargin > 0 ? arpu * grossMargin : null;
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
        secondary: [
          {
            key: "annualizedArpu",
            label: "Annualized ARPU",
            value: annualizedArpu ?? 0,
            format: "currency",
            currency: "USD",
            detail: "ARPU ÷ period months × 12",
          },
          {
            key: "grossProfitPerUser",
            label: "Gross profit per user",
            value: grossProfitPerUser ?? 0,
            format: "currency",
            currency: "USD",
            detail: "ARPU × gross margin",
          },
        ],
        warnings,
      };
    },
    formula: "ARPU = Revenue ÷ Average Active Users",
    assumptions: [
      "Revenue, users, and period length use the same time window.",
      "Annualized ARPU scales linearly by period length.",
    ],
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
    slug: "arpa-calculator",
    title: "ARPA Calculator",
    description:
      "Calculate Average Revenue Per Account (ARPA) for a period and understand the ARPA formula.",
    category: "saas-metrics",
    guideSlug: "arpa-guide",
    relatedGlossarySlugs: ["arpa", "arpa-vs-arpu"],
    seo: {
      intro: [
        "ARPA (Average Revenue Per Account) is revenue ÷ average paying accounts for a period. It often matches B2B SaaS pricing better than ARPU because you sell to companies, not individual users.",
        "To compare ARPA over time, keep the definition of 'paying account' and the revenue base consistent (gross vs net of refunds/credits).",
      ],
      steps: [
        "Pick a time window (month/quarter) and define what counts as a paying account.",
        "Sum revenue for that same window (choose a consistent revenue base).",
        "Compute the average number of paying accounts for the window.",
        "Divide revenue by average paying accounts to get ARPA.",
      ],
      pitfalls: [
        "Mixing accounts and users (ARPA vs ARPU mismatch).",
        "Including free/trial accounts in the denominator without labeling.",
        "Comparing ARPA across periods with big pricing/mix changes without segmentation.",
      ],
    },
    inputs: [
      {
        key: "revenue",
        label: "Total revenue (period)",
        placeholder: "120000",
        prefix: "$",
        defaultValue: "120000",
        min: 0,
      },
      {
        key: "periodMonths",
        label: "Period length (months)",
        help: "1 for monthly, 12 for annual.",
        placeholder: "1",
        defaultValue: "1",
        min: 0.1,
        step: 0.1,
      },
      {
        key: "avgAccounts",
        label: "Average paying accounts (period)",
        placeholder: "60",
        defaultValue: "60",
        min: 0,
      },
      {
        key: "grossMarginPercent",
        label: "Gross margin (optional)",
        help: "Used to estimate gross profit per account.",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.avgAccounts <= 0)
        warnings.push("Average accounts must be greater than 0.");
      if (values.periodMonths <= 0) warnings.push("Period length must be greater than 0.");
      if (values.grossMarginPercent < 0 || values.grossMarginPercent > 100) {
        warnings.push("Gross margin must be between 0% and 100%.");
      }

      const arpa = safeDivide(values.revenue, values.avgAccounts);
      const annualizedArpa =
        arpa !== null && values.periodMonths > 0
          ? (arpa / values.periodMonths) * 12
          : null;
      const grossMargin = values.grossMarginPercent / 100;
      const grossProfitPerAccount =
        arpa !== null && grossMargin > 0 ? arpa * grossMargin : null;
      if (arpa === null) {
        return {
          headline: {
            key: "arpa",
            label: "ARPA",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }

      return {
        headline: {
          key: "arpa",
          label: "ARPA",
          value: arpa,
          format: "currency",
          currency: "USD",
          detail: "Revenue ÷ Avg. accounts",
        },
        secondary: [
          {
            key: "annualizedArpa",
            label: "Annualized ARPA",
            value: annualizedArpa ?? 0,
            format: "currency",
            currency: "USD",
            detail: "ARPA ÷ period months × 12",
          },
          {
            key: "grossProfitPerAccount",
            label: "Gross profit per account",
            value: grossProfitPerAccount ?? 0,
            format: "currency",
            currency: "USD",
            detail: "ARPA × gross margin",
          },
        ],
        warnings,
      };
    },
    formula: "ARPA = Revenue ÷ Average Paying Accounts",
    assumptions: [
      "Revenue, accounts, and period length use the same time window.",
      "Annualized ARPA scales linearly by period length.",
    ],
    faqs: [
      {
        question: "ARPA vs ARPU?",
        answer:
          "ARPA is per paying account/customer. ARPU is per active user. If you sell to companies, ARPA often matches pricing and reporting better.",
      },
      {
        question: "Should ARPA use revenue or gross profit?",
        answer:
          "ARPA is usually revenue-based. For unit economics decisions, also compute gross profit per account (ARPA × gross margin).",
      },
    ],
    guide: [
      {
        title: "Use ARPA effectively",
        bullets: [
          "Segment by plan and customer size; blended ARPA can hide mix shifts.",
          "Pair ARPA with gross margin and churn to estimate LTV and payback.",
          "Keep 'paying account' definition consistent over time.",
        ],
      },
    ],
  },
  {
    slug: "arpu-growth-decomposition-calculator",
    title: "ARPU Growth Decomposition Calculator",
    description:
      "Decompose revenue growth into ARPU change vs user growth (and interaction) between two periods.",
    category: "saas-metrics",
    guideSlug: "arpu-growth-decomposition-guide",
    relatedGlossarySlugs: ["arpu", "arpa", "arpa-vs-arpu"],
    seo: {
      intro: [
        "Revenue changes because user count changes, ARPU changes, or both. Decomposing growth helps you see whether pricing/monetization or distribution/scale is doing the work.",
        "This calculator uses a standard two-factor decomposition: revenue = users × ARPU.",
      ],
      steps: [
        "Enter revenue and average active users for the start period.",
        "Enter revenue and average active users for the end period.",
        "Review how much of revenue growth is explained by ARPU change vs user growth.",
      ],
      pitfalls: [
        "Comparing periods with different 'active user' definitions (denominator drift).",
        "Mixing net revenue in one period with gross revenue in another (inconsistent revenue base).",
        "Attributing interaction effects incorrectly; use it as a directional decomposition.",
      ],
    },
    inputs: [
      {
        key: "startRevenue",
        label: "Revenue (start period)",
        placeholder: "50000",
        prefix: "$",
        defaultValue: "50000",
        min: 0,
      },
      {
        key: "startUsers",
        label: "Average active users (start period)",
        placeholder: "2000",
        defaultValue: "2000",
        min: 0,
      },
      {
        key: "endRevenue",
        label: "Revenue (end period)",
        placeholder: "65000",
        prefix: "$",
        defaultValue: "65000",
        min: 0,
      },
      {
        key: "endUsers",
        label: "Average active users (end period)",
        placeholder: "2300",
        defaultValue: "2300",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startUsers <= 0) warnings.push("Start users must be greater than 0.");
      if (values.endUsers <= 0) warnings.push("End users must be greater than 0.");

      const startArpu = safeDivide(values.startRevenue, values.startUsers);
      const endArpu = safeDivide(values.endRevenue, values.endUsers);
      if (startArpu === null || endArpu === null) {
        return {
          headline: {
            key: "revenueChange",
            label: "Revenue change",
            value: 0,
            format: "currency",
            currency: "USD",
          },
          warnings,
        };
      }

      const deltaUsers = values.endUsers - values.startUsers;
      const deltaArpu = endArpu - startArpu;
      const revenueChange = values.endRevenue - values.startRevenue;

      const userEffect = deltaUsers * startArpu;
      const arpuEffect = deltaArpu * values.startUsers;
      const interaction = deltaUsers * deltaArpu;

      const userGrowth = safeDivide(deltaUsers, values.startUsers);
      const arpuGrowth = safeDivide(deltaArpu, startArpu);

      return {
        headline: {
          key: "revenueChange",
          label: "Revenue change",
          value: revenueChange,
          format: "currency",
          currency: "USD",
          detail: "End revenue − start revenue",
        },
        secondary: [
          {
            key: "startArpu",
            label: "ARPU (start)",
            value: startArpu,
            format: "currency",
            currency: "USD",
            detail: "Start revenue ÷ start users",
          },
          {
            key: "endArpu",
            label: "ARPU (end)",
            value: endArpu,
            format: "currency",
            currency: "USD",
            detail: "End revenue ÷ end users",
          },
          {
            key: "userEffect",
            label: "Revenue from user growth (holding ARPU constant)",
            value: userEffect,
            format: "currency",
            currency: "USD",
          },
          {
            key: "arpuEffect",
            label: "Revenue from ARPU change (holding users constant)",
            value: arpuEffect,
            format: "currency",
            currency: "USD",
          },
          {
            key: "interaction",
            label: "Interaction (users × ARPU change)",
            value: interaction,
            format: "currency",
            currency: "USD",
          },
          {
            key: "userGrowth",
            label: "User growth rate",
            value: userGrowth ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: userGrowth === null ? "Start users must be > 0" : "Δ users ÷ start users",
          },
          {
            key: "arpuGrowth",
            label: "ARPU growth rate",
            value: arpuGrowth ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: arpuGrowth === null ? "Start ARPU must be > 0" : "Δ ARPU ÷ start ARPU",
          },
        ],
        breakdown: [
          {
            key: "startRevenue",
            label: "Start revenue",
            value: values.startRevenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "startUsers",
            label: "Start users",
            value: values.startUsers,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "endRevenue",
            label: "End revenue",
            value: values.endRevenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "endUsers",
            label: "End users",
            value: values.endUsers,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Revenue = users * ARPU; Delta revenue = Delta users * ARPU_start + Delta ARPU * users_start + Delta users * Delta ARPU",
    assumptions: [
      "Start/end periods use the same definition of revenue (gross vs net) and 'active user'.",
      "Decomposition is directional; it helps explain changes but does not prove causality.",
    ],
    faqs: [
      {
        question: "Why is there an 'interaction' term?",
        answer:
          "Because users and ARPU can change at the same time. The interaction term captures growth that comes from both increasing together (or offsetting each other).",
      },
      {
        question: "Should I use ARPU or ARPA for B2B SaaS?",
        answer:
          "If you bill per company (accounts), ARPA is usually more natural. If you bill per seat or per user, ARPU may match pricing better.",
      },
    ],
    guide: [
      {
        title: "How to interpret the decomposition",
        bullets: [
          "User-driven growth often points to distribution, acquisition, or activation improvements.",
          "ARPU-driven growth often points to pricing, packaging, upsell, or mix shifts to higher-value segments.",
          "If ARPU rises but user growth stalls, check conversion and retention by segment (pricing can shift who you attract).",
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
        "A clean MRR definition excludes one-time fees and services, and normalizes annual plans to a monthly equivalent (annual price / 12).",
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
        {
          key: "targetMrr",
          label: "Target MRR (optional)",
          placeholder: "75000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.customers < 0) warnings.push("Customers must be 0 or greater.");
        if (values.arpaMonthly < 0) warnings.push("ARPA must be 0 or greater.");
        const mrr = values.customers * values.arpaMonthly;
        const arr = mrr * 12;
        const requiredCustomers =
          values.targetMrr > 0 && values.arpaMonthly > 0
            ? values.targetMrr / values.arpaMonthly
            : null;
        return {
          headline: {
            key: "mrr",
            label: "MRR",
            value: mrr,
            format: "currency",
            currency: "USD",
            detail: "Customers x ARPA",
          },
          secondary: [
            {
              key: "arr",
              label: "ARR run-rate",
              value: arr,
              format: "currency",
              currency: "USD",
              detail: "MRR x 12",
            },
            {
              key: "requiredCustomers",
              label: "Required customers for target MRR",
              value: requiredCustomers ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail:
                requiredCustomers === null
                  ? "Add target MRR and ARPA"
                  : "Target MRR / ARPA",
            },
          ],
          breakdown: [
            {
              key: "customers",
              label: "Customers",
              value: values.customers,
              format: "number",
              maxFractionDigits: 0,
            },
            {
              key: "arpaMonthly",
              label: "ARPA per month",
              value: values.arpaMonthly,
              format: "currency",
              currency: "USD",
            },
            {
              key: "targetMrr",
              label: "Target MRR",
              value: values.targetMrr,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
      formula: "MRR = Paying Customers x ARPA (monthly)",
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
    slug: "mrr-growth-rate-calculator",
    title: "MRR Growth Rate Calculator",
    description:
      "Calculate MRR growth over a period and convert it to CMGR and annualized growth (CAGR).",
    category: "saas-metrics",
    guideSlug: "mrr-growth-rate-guide",
    relatedGlossarySlugs: ["mrr", "cmgr"],
    seo: {
      intro: [
        "MRR growth is a fast way to track subscription momentum. For comparisons across different horizons, convert it to CMGR (monthly compounded growth) and annualized growth.",
      ],
      steps: [
        "Enter start MRR and end MRR for the period.",
        "Enter the number of months between the two points.",
        "Review period growth, CMGR, and annualized growth.",
      ],
      pitfalls: [
        "Using start/end MRR from different definitions (one-time items included sometimes).",
        "Comparing very short windows without seasonality context.",
        "Mixing run-rate metrics (MRR) with recognized revenue (accounting).",
      ],
    },
    inputs: [
      {
        key: "startMrr",
        label: "Start MRR",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
        min: 0,
      },
      {
        key: "endMrr",
        label: "End MRR",
        placeholder: "240000",
        prefix: "$",
        defaultValue: "240000",
        min: 0,
      },
        {
          key: "months",
          label: "Months between points",
          placeholder: "6",
          defaultValue: "6",
          min: 1,
          step: 1,
        },
        {
          key: "targetPeriodGrowthPercent",
          label: "Target period growth (optional)",
          placeholder: "20",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const months = Math.max(1, Math.floor(values.months));
        if (values.months !== months)
        warnings.push("Months was rounded down to a whole number.");

      if (values.startMrr <= 0)
        warnings.push("Start MRR must be greater than 0 to compute growth rates.");
      if (values.endMrr < 0) warnings.push("End MRR must be 0 or greater.");

        const netNewMrr = values.endMrr - values.startMrr;
        const periodGrowth = safeDivide(netNewMrr, values.startMrr);
        const growthMultiple =
          values.startMrr > 0 ? values.endMrr / values.startMrr : null;
        const avgNetNewPerMonth =
          months > 0 ? netNewMrr / months : null;
        const targetGrowth = values.targetPeriodGrowthPercent / 100;
        const requiredEndMrr =
          values.targetPeriodGrowthPercent > 0 && values.startMrr > 0
            ? values.startMrr * (1 + targetGrowth)
            : null;
        const requiredNetNew =
          requiredEndMrr !== null ? requiredEndMrr - values.startMrr : null;

        const cmgr =
          values.startMrr > 0
            ? Math.pow(values.endMrr / values.startMrr, 1 / months) - 1
            : null;

      const annualized =
        values.startMrr > 0
          ? Math.pow(values.endMrr / values.startMrr, 12 / months) - 1
          : null;

      return {
        headline: {
          key: "periodGrowth",
          label: "MRR growth (period)",
          value: periodGrowth ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Delta MRR / start MRR",
        },
        secondary: [
            {
              key: "netNewMrr",
              label: "Net new MRR (delta)",
              value: netNewMrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "avgNetNewPerMonth",
              label: "Average net new MRR per month",
              value: avgNetNewPerMonth ?? 0,
              format: "currency",
              currency: "USD",
              detail: avgNetNewPerMonth === null ? "Invalid months" : "Net new / months",
            },
            {
              key: "growthMultiple",
              label: "Growth multiple (end / start)",
              value: growthMultiple ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: growthMultiple === null ? "Start MRR is 0" : "End / start",
            },
            {
              key: "cmgr",
              label: "CMGR (monthly compounded)",
              value: cmgr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: cmgr === null ? "Requires start MRR > 0" : "Compounded monthly",
            },
            {
              key: "annualized",
              label: "Annualized growth (CAGR)",
              value: annualized ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: annualized === null ? "Requires start MRR > 0" : "Annualized from period",
            },
            {
              key: "requiredEndMrr",
              label: "Required end MRR for target growth",
              value: requiredEndMrr ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredEndMrr === null
                  ? "Add target growth and start MRR"
                  : "Start x (1 + target)",
            },
            {
              key: "requiredNetNew",
              label: "Required net new MRR for target",
              value: requiredNetNew ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredNetNew === null
                  ? "Add target growth and start MRR"
                  : "Required end - start",
            },
          ],
        breakdown: [
          {
            key: "startMrr",
            label: "Start MRR",
            value: values.startMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "endMrr",
            label: "End MRR",
            value: values.endMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "months",
            label: "Months",
            value: months,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "targetPeriodGrowthPercent",
            label: "Target period growth",
            value: targetGrowth,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Period growth = (end MRR - start MRR) / start MRR; CMGR = (end/start)^(1/months) - 1; CAGR = (end/start)^(12/months) - 1",
    assumptions: [
      "Start and end MRR use the same MRR definition (clean recurring run-rate).",
      "CMGR assumes smooth compounding; use it for comparison and planning, not as a guarantee.",
    ],
    faqs: [
      {
        question: "Is MRR growth the same as revenue growth?",
        answer:
          "Not necessarily. MRR is a recurring run-rate snapshot. Revenue is what you recognize over time and can include non-recurring items.",
      },
      {
        question: "Should I use CMGR or YoY growth?",
        answer:
          "Use YoY for seasonal comparisons and external benchmarks. Use CMGR for planning and for comparing scenarios over different horizons.",
      },
    ],
    guide: [
      {
        title: "MRR growth tips",
        bullets: [
          "Use consistent snapshots (start/end of the period) and a stable MRR definition.",
          "Pair with an MRR waterfall to explain what drove growth (new vs expansion vs churn).",
          "Pair with retention (NRR/GRR) and payback to judge growth quality.",
        ],
      },
    ],
  },
  {
    slug: "mrr-churn-rate-calculator",
    title: "MRR Churn Rate Calculator",
    description:
      "Calculate MRR churn rate from churned MRR and starting MRR (with monthly-equivalent conversion).",
    category: "saas-metrics",
    guideSlug: "mrr-churn-rate-guide",
    relatedGlossarySlugs: ["mrr", "mrr-churn-rate"],
    seo: {
      intro: [
        "MRR churn rate measures lost recurring revenue from cancellations (churned MRR) as a percentage of starting MRR for a period.",
        "If your measurement window is not a month, convert to a monthly-equivalent churn rate so you can compare periods consistently.",
      ],
      steps: [
        "Enter starting MRR and churned MRR for the same period.",
        "Enter the number of months in the period (1 for monthly reporting).",
        "Review the period churn rate and the monthly-equivalent rate.",
      ],
      pitfalls: [
        "Mixing churned MRR with contraction MRR (downgrades) without labeling.",
        "Using ending MRR as the base instead of starting MRR (definition drift).",
        "Mixing MRR churn (revenue churn) with logo churn (customer churn).",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
        min: 0,
      },
        {
          key: "churnedMrr",
          label: "Churned MRR (lost)",
          placeholder: "8000",
          prefix: "$",
          defaultValue: "8000",
          min: 0,
        },
        {
          key: "contractionMrr",
          label: "Contraction MRR (optional)",
          help: "Used to compute gross revenue churn (churn + contraction).",
          placeholder: "3000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
        {
          key: "periodMonths",
          label: "Period length (months)",
          help: "Use 1 for monthly churn; 3 for quarterly, etc.",
        placeholder: "1",
        defaultValue: "1",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.periodMonths));
      if (values.periodMonths !== months)
        warnings.push("Period months was rounded down to a whole number.");

        if (values.startingMrr <= 0)
          warnings.push("Starting MRR must be greater than 0 to compute churn rate.");
        if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");
        if (values.contractionMrr < 0) warnings.push("Contraction MRR must be 0 or greater.");
        if (values.churnedMrr > values.startingMrr && values.startingMrr > 0)
          warnings.push("Churned MRR is greater than starting MRR (check inputs).");

        const periodChurn = safeDivide(values.churnedMrr, values.startingMrr);
        const grossLosses = values.churnedMrr + values.contractionMrr;
        if (grossLosses > values.startingMrr && values.startingMrr > 0)
          warnings.push(
            "Total churn + contraction exceeds starting MRR (check inputs).",
          );
        const grossChurn = safeDivide(grossLosses, values.startingMrr);
        const endingGrossMrr = Math.max(0, values.startingMrr - grossLosses);

        const monthlyEquivalent =
          periodChurn !== null && months > 0
            ? 1 - Math.pow(1 - Math.min(1, Math.max(0, periodChurn)), 1 / months)
            : null;
        const monthlyEquivalentGross =
          grossChurn !== null && months > 0
            ? 1 - Math.pow(1 - Math.min(1, Math.max(0, grossChurn)), 1 / months)
            : null;
  
        return {
          headline: {
            key: "periodChurn",
            label: "MRR churn rate (period)",
          value: periodChurn ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Churned MRR / starting MRR",
        },
        secondary: [
            {
              key: "monthlyEquivalent",
              label: "Monthly-equivalent MRR churn rate",
              value: monthlyEquivalent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: monthlyEquivalent === null ? "Requires valid inputs" : `Converted from ${months} month period`,
            },
            {
              key: "grossChurn",
              label: "Gross revenue churn (period)",
              value: grossChurn ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: grossChurn === null ? "Requires valid inputs" : "Churn + contraction / starting",
            },
            {
              key: "monthlyEquivalentGross",
              label: "Monthly-equivalent gross churn",
              value: monthlyEquivalentGross ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail:
                monthlyEquivalentGross === null
                  ? "Requires valid inputs"
                  : `Converted from ${months} month period`,
            },
            {
              key: "endingGrossMrr",
              label: "Ending gross MRR (after losses)",
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
              key: "churnedMrr",
              label: "Churned MRR",
              value: values.churnedMrr,
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
              key: "periodMonths",
              label: "Period months",
              value: months,
              format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Period MRR churn = churned MRR / starting MRR; Monthly-equivalent churn = 1 - (1 - period churn)^(1/period months)",
    assumptions: [
      "Uses starting MRR as the denominator (standard for churn rates).",
      "Monthly-equivalent conversion assumes churn compounds smoothly across the period (approximation).",
    ],
    faqs: [
      {
        question: "Is MRR churn the same as customer churn?",
        answer:
          "No. MRR churn is revenue churn (lost recurring revenue). Customer churn is logo churn (lost customers). They can move differently if account sizes vary.",
      },
      {
        question: "Should I include downgrades in churned MRR?",
        answer:
          "Typically churned MRR is cancellations. Downgrades are contraction MRR. You can combine them as 'gross MRR churn' if you label it clearly.",
      },
    ],
    guide: [
      {
        title: "MRR churn tips",
        bullets: [
          "Track churned MRR and contraction MRR separately, then also track GRR/NRR for the full retention picture.",
          "Segment by plan and customer size; blended churn can hide weak cohorts.",
            "Pair churn with net new MRR and an MRR waterfall to see what's driving growth.",
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
          "ARR (Annual Recurring Revenue) is MRR annualized (MRR x 12). It is an annualized run-rate snapshot, not a promise of yearly revenue.",
        "When people compare bookings vs ARR, remember: bookings measure contracted value, while ARR measures recurring run-rate. Cash receipts can differ again due to prepay timing.",
      ],
      steps: [
        "Estimate ARPA per month for your segment (monthly revenue per account).",
        "Count paying customers (or subscriptions).",
          "Compute MRR = customers x ARPA.",
          "Compute ARR = MRR x 12.",
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
        {
          key: "targetArr",
          label: "Target ARR (optional)",
          placeholder: "3000000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.customers < 0) warnings.push("Customers must be 0 or greater.");
        if (values.arpaMonthly < 0) warnings.push("ARPA must be 0 or greater.");
        const mrr = values.customers * values.arpaMonthly;
        const arr = mrr * 12;
        const requiredCustomers =
          values.targetArr > 0 && values.arpaMonthly > 0
            ? values.targetArr / 12 / values.arpaMonthly
            : null;
        return {
          headline: {
            key: "arr",
            label: "ARR",
            value: arr,
            format: "currency",
            currency: "USD",
            detail: "MRR x 12",
          },
          secondary: [
            {
              key: "mrr",
              label: "MRR",
              value: mrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "requiredCustomers",
              label: "Required customers for target ARR",
              value: requiredCustomers ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail:
                requiredCustomers === null
                  ? "Add target ARR and ARPA"
                  : "Target ARR / (12 x ARPA)",
            },
          ],
          breakdown: [
            {
              key: "customers",
              label: "Customers",
              value: values.customers,
              format: "number",
              maxFractionDigits: 0,
            },
            {
              key: "arpaMonthly",
              label: "ARPA per month",
              value: values.arpaMonthly,
              format: "currency",
              currency: "USD",
            },
            {
              key: "targetArr",
              label: "Target ARR",
              value: values.targetArr,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
      formula: "ARR = MRR x 12",
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
          "ARR is recurring run-rate (MRR x 12). Bookings are contracted value and can include one-time and non-recurring items. Cash receipts can differ again due to prepay timing.",
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
    slug: "arr-vs-mrr-calculator",
    title: "ARR vs MRR Calculator",
    description:
      "Convert ARR to MRR (and MRR to ARR) and understand the ARR vs MRR relationship.",
    category: "saas-metrics",
    guideSlug: "arr-vs-mrr-guide",
    relatedGlossarySlugs: ["arr", "mrr"],
    seo: {
      intro: [
        "ARR and MRR are the same run-rate at different time units. ARR is typically MRR x 12; MRR is ARR / 12.",
        "This calculator converts between ARR and MRR and helps you sanity-check consistency when you have both numbers.",
      ],
      steps: [
          "Enter MRR to compute ARR (MRR x 12).",
          "Enter ARR to compute MRR (ARR / 12).",
        "If you enter both, compare the implied numbers to spot definition drift.",
      ],
      pitfalls: [
        "Including one-time fees or services in recurring run-rate.",
        "Mixing recognized revenue (accounting) with run-rate metrics (MRR/ARR).",
        "Using ARR as a promise of next-12-month revenue (it's a snapshot).",
      ],
    },
    inputs: [
      {
        key: "mrr",
        label: "MRR",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
        min: 0,
      },
      {
        key: "arr",
        label: "ARR",
        placeholder: "2400000",
        prefix: "$",
        defaultValue: "2400000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.mrr < 0) warnings.push("MRR must be 0 or greater.");
      if (values.arr < 0) warnings.push("ARR must be 0 or greater.");

      const arrFromMrr = values.mrr * 12;
      const mrrFromArr = values.arr / 12;

      const mismatch = values.arr - arrFromMrr;
      const mismatchPct = arrFromMrr > 0 ? mismatch / arrFromMrr : null;
      if (mismatchPct !== null && Math.abs(mismatchPct) > 0.02) {
        warnings.push(
          "ARR and MRR are inconsistent by more than ~2%. Double-check definitions (one-time fees, active base, annualization, refunds).",
        );
      }

      return {
        headline: {
          key: "arrFromMrr",
          label: "ARR (from MRR)",
          value: arrFromMrr,
          format: "currency",
          currency: "USD",
          detail: "MRR x 12",
        },
        secondary: [
          {
            key: "mrrFromArr",
            label: "MRR (from ARR)",
            value: mrrFromArr,
            format: "currency",
            currency: "USD",
            detail: "ARR / 12",
          },
          {
            key: "mismatch",
            label: "ARR mismatch (ARR - MRR x 12)",
            value: mismatch,
            format: "currency",
            currency: "USD",
          },
          {
            key: "mismatchPct",
            label: "Mismatch percent",
            value: mismatchPct ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: mismatchPct === null ? "MRR is 0" : "Mismatch / ARR from MRR",
          },
        ],
        warnings,
      };
    },
    formula: "ARR = MRR x 12; MRR = ARR / 12",
    assumptions: [
      "Assumes you are converting a recurring run-rate (not recognized revenue).",
      "Assumes ARR is annualized from monthly run-rate (12x) rather than a contracted total.",
    ],
    faqs: [
      {
        question: "Is ARR the same as annual revenue?",
        answer:
          "Not always. ARR is a run-rate snapshot of recurring revenue. Annual revenue is what you recognize over a year and can include one-time items.",
      },
      {
        question: "Should ARR always equal MRR x 12?",
        answer:
          "If both are defined as recurring run-rate, yes. If they don't match, it usually means definitions differ (one-time items, active base, annualization) or the numbers are from different dates.",
      },
    ],
    guide: [
      {
        title: "ARR vs MRR tips",
        bullets: [
          "Use MRR for monthly momentum and decomposition (new/expansion/churn).",
          "Use ARR to compare scale and for many efficiency metrics (burn multiple, magic number).",
          "Avoid mixing bookings/cash timing into run-rate metrics.",
        ],
      },
    ],
  },
  {
    slug: "arr-growth-rate-calculator",
    title: "ARR Growth Rate Calculator",
    description:
      "Calculate ARR growth over a period and convert it to CMGR and annualized growth (CAGR).",
    category: "saas-metrics",
    guideSlug: "arr-growth-rate-guide",
    relatedGlossarySlugs: ["arr", "cmgr"],
    seo: {
      intro: [
        "ARR growth is a clean way to track recurring momentum over time. For comparisons across different horizons, convert to CMGR (monthly compounded growth) and annualized growth.",
      ],
      steps: [
        "Enter start ARR and end ARR for the period.",
        "Enter the number of months between the two points.",
        "Review period growth, CMGR, and annualized growth.",
      ],
      pitfalls: [
        "Using end-of-period ARR and start-of-period ARR from different definitions (inconsistent run-rate).",
        "Including one-time items or services in ARR.",
        "Using very short windows where seasonality dominates.",
      ],
    },
    inputs: [
      {
        key: "startArr",
        label: "Start ARR",
        placeholder: "1200000",
        prefix: "$",
        defaultValue: "1200000",
        min: 0,
      },
      {
        key: "endArr",
        label: "End ARR",
        placeholder: "1800000",
        prefix: "$",
        defaultValue: "1800000",
        min: 0,
      },
        {
          key: "months",
          label: "Months between points",
          placeholder: "12",
          defaultValue: "12",
          min: 1,
          step: 1,
        },
        {
          key: "targetPeriodGrowthPercent",
          label: "Target period growth (optional)",
          placeholder: "50",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const months = Math.max(1, Math.floor(values.months));
        if (values.months !== months) warnings.push("Months was rounded down to a whole number.");

      if (values.startArr <= 0) warnings.push("Start ARR must be greater than 0 to compute growth rates.");
      if (values.endArr < 0) warnings.push("End ARR must be 0 or greater.");

        const netNewArr = values.endArr - values.startArr;
        const periodGrowth = safeDivide(netNewArr, values.startArr);
        const growthMultiple =
          values.startArr > 0 ? values.endArr / values.startArr : null;
        const avgNetNewPerMonth =
          months > 0 ? netNewArr / months : null;
        const targetGrowth = values.targetPeriodGrowthPercent / 100;
        const requiredEndArr =
          values.targetPeriodGrowthPercent > 0 && values.startArr > 0
            ? values.startArr * (1 + targetGrowth)
            : null;
        const requiredNetNew =
          requiredEndArr !== null ? requiredEndArr - values.startArr : null;

      const cmgr =
        values.startArr > 0
          ? Math.pow(values.endArr / values.startArr, 1 / months) - 1
          : null;

      const annualized =
        values.startArr > 0
          ? Math.pow(values.endArr / values.startArr, 12 / months) - 1
          : null;

      return {
          headline: {
            key: "periodGrowth",
            label: "ARR growth (period)",
            value: periodGrowth ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Delta ARR / start ARR",
          },
          secondary: [
            {
              key: "netNewArr",
              label: "Net new ARR (delta)",
              value: netNewArr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "avgNetNewPerMonth",
              label: "Average net new ARR per month",
              value: avgNetNewPerMonth ?? 0,
              format: "currency",
              currency: "USD",
              detail: avgNetNewPerMonth === null ? "Invalid months" : "Net new / months",
            },
            {
              key: "growthMultiple",
              label: "Growth multiple (end / start)",
              value: growthMultiple ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: growthMultiple === null ? "Start ARR is 0" : "End / start",
            },
            {
              key: "cmgr",
              label: "CMGR (monthly compounded)",
              value: cmgr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: cmgr === null ? "Requires start ARR > 0" : "Compounded monthly",
            },
            {
              key: "annualized",
              label: "Annualized growth (CAGR)",
              value: annualized ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: annualized === null ? "Requires start ARR > 0" : "Annualized from period",
            },
            {
              key: "requiredEndArr",
              label: "Required end ARR for target growth",
              value: requiredEndArr ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredEndArr === null
                  ? "Add target growth and start ARR"
                  : "Start x (1 + target)",
            },
            {
              key: "requiredNetNew",
              label: "Required net new ARR for target",
              value: requiredNetNew ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredNetNew === null
                  ? "Add target growth and start ARR"
                  : "Required end - start",
            },
          ],
        breakdown: [
          {
            key: "startArr",
            label: "Start ARR",
            value: values.startArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "endArr",
            label: "End ARR",
            value: values.endArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "months",
            label: "Months",
            value: months,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "targetPeriodGrowthPercent",
            label: "Target period growth",
            value: targetGrowth,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Period growth = (end ARR - start ARR) / start ARR; CMGR = (end/start)^(1/months) - 1; CAGR = (end/start)^(12/months) - 1",
    assumptions: [
      "Start and end ARR use the same definition (clean recurring run-rate).",
      "CMGR assumes smooth compounding; use it for comparison and planning, not as a guarantee.",
    ],
    faqs: [
      {
        question: "Is ARR growth the same as revenue growth?",
        answer:
          "Not necessarily. ARR is a recurring run-rate snapshot. Revenue is what you recognize over time and can include non-recurring items.",
      },
      {
        question: "Should I use CMGR or YoY growth?",
        answer:
          "Use YoY growth for seasonal businesses and for external comparisons. Use CMGR for planning and comparing scenarios over different horizons.",
      },
    ],
    guide: [
      {
        title: "ARR growth tips",
        bullets: [
          "Use consistent point-in-time snapshots (start and end of the period).",
          "Segment ARR growth by plan and channel to find what’s driving momentum.",
          "Pair ARR growth with retention (NRR/GRR) and payback to assess quality.",
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
    seo: {
      intro: [
        "ARR valuation is a quick heuristic: enterprise value is often discussed as ARR multiplied by a revenue multiple.",
        "Multiples vary widely based on growth, margins, retention, and market conditions. This calculator helps you model a point estimate and a range.",
      ],
      steps: [
        "Enter ARR (clean recurring run-rate).",
        "Enter a base revenue multiple for a point estimate.",
        "Optionally enter a low/high multiple to produce a valuation range.",
        "Use the range for scenario planning rather than relying on a single number.",
      ],
      benchmarks: [
        "Ranges are more realistic than point estimates; market multiples can change quickly.",
        "Use consistent ARR definitions (recurring only) to avoid inflating valuations.",
        "Pair valuation scenarios with unit economics (payback, burn multiple) to sanity-check sustainability.",
      ],
      pitfalls: [
        "Mixing enterprise value and equity value (this is an EV-style heuristic, not per-share equity value).",
        "Using ARR that includes one-time items or services revenue (definition mismatch).",
        "Picking a multiple without checking growth, retention, and margin context.",
      ],
    },
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
      {
        key: "multipleLow",
        label: "Multiple (low, optional)",
        help: "Used for a valuation range. Set 0 to disable.",
        placeholder: "4",
        defaultValue: "4",
        min: 0,
        step: 0.1,
      },
      {
        key: "multipleHigh",
        label: "Multiple (high, optional)",
        help: "Used for a valuation range. Set 0 to disable.",
        placeholder: "10",
        defaultValue: "10",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.arr < 0) warnings.push("ARR must be 0 or greater.");
      if (values.multiple <= 0) warnings.push("Multiple must be greater than 0.");

      const valuation = values.arr * values.multiple;
      const low = values.multipleLow > 0 ? values.arr * values.multipleLow : null;
      const high = values.multipleHigh > 0 ? values.arr * values.multipleHigh : null;
      if (values.multipleLow > 0 && values.multipleHigh > 0 && values.multipleLow > values.multipleHigh) {
        warnings.push("Low multiple exceeds high multiple (swap the inputs).");
      }
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
          detail: "ARR * multiple",
        },
        secondary: [
          {
            key: "valuationLow",
            label: "Valuation (low)",
            value: low ?? 0,
            format: "currency",
            currency: "USD",
            detail: low === null ? "Set low multiple to enable" : `${values.multipleLow}x`,
          },
          {
            key: "valuationHigh",
            label: "Valuation (high)",
            value: high ?? 0,
            format: "currency",
            currency: "USD",
            detail: high === null ? "Set high multiple to enable" : `${values.multipleHigh}x`,
          },
          {
            key: "valuationPer1m",
            label: "Valuation per $1M ARR (base)",
            value: values.multiple * 1_000_000,
            format: "currency",
            currency: "USD",
            detail: "Multiple * $1,000,000",
          },
        ],
        breakdown: [
          {
            key: "arr",
            label: "ARR",
            value: values.arr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "multiple",
            label: "Base multiple",
            value: values.multiple,
            format: "multiple",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula: "Valuation = ARR * multiple",
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
    slug: "arr-valuation-sensitivity-calculator",
    title: "ARR Valuation Sensitivity Calculator",
    description:
      "Estimate valuation sensitivity to ARR and revenue multiple assumptions (simple 3×3 grid).",
    category: "saas-metrics",
    guideSlug: "arr-valuation-sensitivity-guide",
    relatedGlossarySlugs: ["arr", "arr-valuation-multiple", "sensitivity-analysis"],
    seo: {
      intro: [
        "ARR multiple valuation is fast: enterprise value ≈ ARR × multiple. But both ARR and multiples move with market conditions, pricing, and retention.",
        "A small sensitivity grid helps you see how fragile (or robust) the valuation is to reasonable changes in ARR and the multiple.",
      ],
      steps: [
        "Enter your base ARR and base multiple.",
        "Choose step sizes for ARR and the multiple (± around the base).",
        "Review the 3×3 grid of valuations.",
      ],
      pitfalls: [
        "Treating a single multiple as precise (false precision).",
        "Using inconsistent ARR definitions (including one-time items).",
        "Ignoring retention and margin (multiples depend on quality).",
      ],
    },
    inputs: [
      {
        key: "baseArr",
        label: "Base ARR",
        placeholder: "2400000",
        prefix: "$",
        defaultValue: "2400000",
        min: 0,
      },
      {
        key: "arrStepPercent",
        label: "ARR step",
        help: "Uses ± step around ARR base to create a 3×3 grid.",
        placeholder: "15",
        suffix: "%",
        defaultValue: "15",
        min: 0,
        step: 0.1,
      },
      {
        key: "baseMultiple",
        label: "Base multiple",
        placeholder: "6",
        defaultValue: "6",
        min: 0,
        step: 0.1,
      },
      {
        key: "multipleStep",
        label: "Multiple step",
        help: "Uses ± step around the multiple base to create a 3×3 grid.",
        placeholder: "1",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.baseArr < 0) warnings.push("Base ARR must be 0 or greater.");
      if (values.baseMultiple <= 0) warnings.push("Base multiple must be greater than 0.");
      if (values.arrStepPercent < 0) warnings.push("ARR step must be 0% or greater.");
      if (values.multipleStep < 0) warnings.push("Multiple step must be 0 or greater.");

      const arrStep = values.arrStepPercent / 100;
      const arrLow = Math.max(0, values.baseArr * (1 - arrStep));
      const arrMid = values.baseArr;
      const arrHigh = values.baseArr * (1 + arrStep);

      const mLow = Math.max(0, values.baseMultiple - values.multipleStep);
      const mMid = values.baseMultiple;
      const mHigh = values.baseMultiple + values.multipleStep;

      const evAt = (arr: number, multiple: number) => arr * multiple;
      const baseEv = evAt(arrMid, mMid);

      const grid: Array<{ key: string; label: string; value: number }> = [];
      const points: Array<[string, number, number]> = [
        ["ev_arrLow_mLow", arrLow, mLow],
        ["ev_arrLow_mMid", arrLow, mMid],
        ["ev_arrLow_mHigh", arrLow, mHigh],
        ["ev_arrMid_mLow", arrMid, mLow],
        ["ev_arrMid_mMid", arrMid, mMid],
        ["ev_arrMid_mHigh", arrMid, mHigh],
        ["ev_arrHigh_mLow", arrHigh, mLow],
        ["ev_arrHigh_mMid", arrHigh, mMid],
        ["ev_arrHigh_mHigh", arrHigh, mHigh],
      ];

      for (const [key, arr, multiple] of points) {
        if (multiple <= 0) continue;
        grid.push({
          key,
          label: `EV @ $${arr.toFixed(0)} / ${multiple.toFixed(1)}×`,
          value: evAt(arr, multiple),
        });
      }

      if (mLow <= 0)
        warnings.push(
          "Low multiple is 0 or less; increase base multiple or reduce step.",
        );

      return {
        headline: {
          key: "evBase",
          label: "Enterprise value (base case)",
          value: baseEv,
          format: "currency",
          currency: "USD",
          detail: `Base: $${values.baseArr.toFixed(0)} / ${values.baseMultiple.toFixed(1)}×`,
        },
        secondary: grid.map((g) => ({
          key: g.key,
          label: g.label,
          value: g.value,
          format: "currency",
          currency: "USD",
        })),
        warnings,
      };
    },
    formula: "Enterprise value ≈ ARR × multiple; Sensitivity varies ARR and multiple around a base case",
    assumptions: [
      "This is a heuristic. Real valuation depends on growth, margin, retention, and market conditions.",
      "Uses enterprise value (EV) as ARR × multiple (simplified).",
      "Only shows a small grid; use broader scenarios for full planning.",
    ],
    faqs: [
      {
        question: "Is this a full valuation model?",
        answer:
          "No. This is a multiple-based heuristic. For deeper analysis, use DCF or a comps model that reflects retention, growth, margin, and risk.",
      },
      {
        question: "Why sensitivity on ARR as well as multiple?",
        answer:
          "ARR can change with pricing, churn, and mix. The multiple can change with market conditions and your growth/retention profile. Both move in practice.",
      },
    ],
    guide: [
      {
        title: "How to use ARR valuation sensitivity",
        bullets: [
          "Treat the grid as a scenario range, not a precise estimate.",
          "Pair valuation scenarios with unit economics (payback, burn multiple) to ensure growth is sustainable.",
          "Use a clean ARR definition (recurring only) to avoid inflating the base case.",
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
        "Compute NRR = ending MRR / starting MRR.",
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
      const netExpansionMrr =
        values.expansionMrr - values.contractionMrr - values.churnedMrr;

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
          detail: "Ending MRR / Starting MRR",
        },
        secondary: [
          {
            key: "endingMrr",
            label: "Ending MRR",
            value: endingMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "netExpansionMrr",
            label: "Net expansion MRR",
            value: netExpansionMrr,
            format: "currency",
            currency: "USD",
            detail: "Expansion - contraction - churn",
          },
          {
            key: "nrrMultiple",
            label: "NRR (multiple)",
            value: nrr,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Same metric in multiple form",
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
    formula:
      "NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR",
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
        {
          key: "periodMonths",
          label: "Period length (months)",
          help: "Use 1 for monthly GRR; 3 for quarterly, etc.",
          placeholder: "1",
          defaultValue: "1",
          min: 1,
          step: 1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const months = Math.max(1, Math.floor(values.periodMonths));
        if (values.periodMonths !== months)
          warnings.push("Period months was rounded down to a whole number.");
        if (values.startingMrr <= 0)
          warnings.push("Starting MRR must be greater than 0.");
        if (values.contractionMrr < 0)
          warnings.push("Contraction MRR must be 0 or greater.");
        if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

        const endingGrossMrr =
          values.startingMrr - values.contractionMrr - values.churnedMrr;
        const grr = safeDivide(endingGrossMrr, values.startingMrr);
        const grossChurn = grr !== null ? 1 - grr : null;
        const monthlyEquivalentGrr =
          grr !== null && months > 0 ? Math.pow(grr, 1 / months) : null;
        const monthlyEquivalentChurn =
          monthlyEquivalentGrr !== null ? 1 - monthlyEquivalentGrr : null;
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
            {
              key: "grossChurn",
              label: "Gross revenue churn (period)",
              value: grossChurn ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: grossChurn === null ? "Starting MRR is 0" : "1 - GRR",
            },
            {
              key: "monthlyEquivalentGrr",
              label: "Monthly-equivalent GRR",
              value: monthlyEquivalentGrr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail:
                monthlyEquivalentGrr === null
                  ? "Starting MRR is 0"
                  : `Converted from ${months} month period`,
            },
            {
              key: "monthlyEquivalentChurn",
              label: "Monthly-equivalent gross churn",
              value: monthlyEquivalentChurn ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail:
                monthlyEquivalentChurn === null
                  ? "Starting MRR is 0"
                  : "1 - monthly-equivalent GRR",
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
            {
              key: "periodMonths",
              label: "Period months",
              value: months,
              format: "number",
              maxFractionDigits: 0,
            },
          ],
        warnings,
      };
    },
      formula: "GRR = (Starting MRR - Contraction - Churn) / Starting MRR",
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
    slug: "nrr-vs-grr-calculator",
    title: "NRR vs GRR Calculator",
    description:
      "Calculate NRR and GRR together from the same starting MRR and expansion/contraction/churn inputs.",
    category: "saas-metrics",
    guideSlug: "nrr-vs-grr-guide",
    relatedGlossarySlugs: ["nrr", "grr", "revenue-churn"],
    seo: {
      intro: [
        "NRR (Net Revenue Retention) includes expansion. GRR (Gross Revenue Retention) excludes expansion and focuses on durability after churn and downgrades.",
        "Calculating both from the same inputs prevents definition drift and makes retention diagnostics faster.",
      ],
      steps: [
        "Enter starting MRR for the cohort (beginning of period).",
        "Enter expansion, contraction, and churned MRR for the same cohort and period.",
        "Compute NRR and GRR and compare the gap to understand how much expansion is offsetting churn/downgrades.",
      ],
      pitfalls: [
        "Mixing cohorts or time windows (starting MRR from one cohort, movements from another).",
        "Including one-time items or billings/cash in MRR movements.",
        "Using blended numbers that hide segment churn pockets.",
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
        key: "expansionMrr",
        label: "Expansion MRR",
        placeholder: "12000",
        prefix: "$",
        defaultValue: "12000",
        min: 0,
      },
      {
        key: "contractionMrr",
        label: "Contraction MRR",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
        min: 0,
      },
      {
        key: "churnedMrr",
        label: "Churned MRR",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
        min: 0,
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

        const nrr = safeDivide(
          values.startingMrr +
            values.expansionMrr -
            values.contractionMrr -
            values.churnedMrr,
          values.startingMrr,
        );
        const grr = safeDivide(
          values.startingMrr - values.contractionMrr - values.churnedMrr,
          values.startingMrr,
        );
        const endingNrrMrr =
          values.startingMrr +
          values.expansionMrr -
          values.contractionMrr -
          values.churnedMrr;
        const endingGrrMrr =
          values.startingMrr - values.contractionMrr - values.churnedMrr;
        const expansionShare =
          values.startingMrr > 0 ? values.expansionMrr / values.startingMrr : null;
        const lossesShare =
          values.startingMrr > 0
            ? (values.contractionMrr + values.churnedMrr) / values.startingMrr
            : null;

      if (nrr === null || grr === null) {
        return {
          headline: {
            key: "nrr",
            label: "NRR",
            value: 0,
            format: "percent",
            maxFractionDigits: 2,
          },
          warnings,
        };
      }

      const gap = nrr - grr;

      return {
        headline: {
          key: "nrr",
          label: "NRR",
          value: nrr,
          format: "percent",
          maxFractionDigits: 2,
          detail: "(Start + expansion − contraction − churn) ÷ start",
        },
          secondary: [
            {
              key: "grr",
              label: "GRR",
              value: grr,
              format: "percent",
              maxFractionDigits: 2,
              detail: "(Start − contraction − churn) ÷ start",
            },
            {
              key: "gap",
              label: "NRR − GRR (expansion offset)",
              value: gap,
              format: "percent",
              maxFractionDigits: 2,
              detail: "How much expansion offsets losses",
            },
            {
              key: "endingNrrMrr",
              label: "Ending MRR (NRR)",
              value: endingNrrMrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "endingGrrMrr",
              label: "Ending MRR (GRR)",
              value: endingGrrMrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "expansionShare",
              label: "Expansion as % of starting MRR",
              value: expansionShare ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: expansionShare === null ? "Starting MRR is 0" : "Expansion / starting",
            },
            {
              key: "lossesShare",
              label: "Losses as % of starting MRR",
              value: lossesShare ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: lossesShare === null ? "Starting MRR is 0" : "Contraction + churn / starting",
            },
          ],
        warnings,
      };
    },
    formula:
      "NRR = (start + expansion - contraction - churn) / start; GRR = (start - contraction - churn) / start",
    assumptions: [
      "All inputs represent the same cohort and time window.",
      "MRR movements reflect recurring run-rate changes (not billings/cash).",
    ],
    faqs: [
      {
        question: "Can NRR be above 100%?",
        answer:
          "Yes. If expansion exceeds contraction + churn, the cohort grows without new customers and NRR can exceed 100%.",
      },
      {
        question: "Why track GRR if NRR looks strong?",
        answer:
          "NRR can look strong due to expansion even when churn/downgrades are weak. GRR isolates durability without expansion.",
      },
    ],
    guide: [
      {
        title: "How to use NRR vs GRR",
        bullets: [
          "If GRR is weak, focus on churn and downgrades (product value, support, renewals).",
          "If GRR is strong but NRR is flat, focus on expansion levers (upsell, seats, pricing).",
          "Always segment by customer size and plan to avoid blended averages.",
        ],
      },
    ],
  },
  {
    slug: "gross-revenue-churn-calculator",
    title: "Gross Revenue Churn Calculator",
    description:
      "Calculate gross revenue churn rate from contraction and churned MRR (with monthly-equivalent conversion).",
    category: "saas-metrics",
    guideSlug: "gross-revenue-churn-guide",
    relatedGlossarySlugs: ["revenue-churn", "gross-revenue-churn", "mrr"],
    seo: {
      intro: [
        "Gross revenue churn is the share of starting MRR you lost to downgrades (contraction) and cancellations (churn) over a period. It excludes expansion by definition.",
        "If your window is not monthly, convert to a monthly-equivalent churn rate so you can compare periods consistently.",
      ],
      steps: [
        "Enter starting MRR for the cohort (beginning of period).",
        "Enter contraction MRR and churned MRR for the same cohort and period.",
        "Compute gross revenue churn = (contraction + churn) ÷ starting MRR.",
        "Optionally convert to monthly-equivalent churn for non-monthly windows.",
      ],
      pitfalls: [
        "Mixing cohorts or time windows (starting MRR from one cohort, losses from another).",
        "Including expansion (gross churn excludes expansion).",
        "Using ending MRR as the denominator instead of starting MRR.",
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
        key: "contractionMrr",
        label: "Contraction MRR (downgrades)",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
        min: 0,
      },
      {
        key: "churnedMrr",
        label: "Churned MRR (cancellations)",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
        min: 0,
      },
      {
        key: "periodMonths",
        label: "Period length (months)",
        help: "Use 1 for monthly gross churn; 3 for quarterly, etc.",
        placeholder: "1",
        defaultValue: "1",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.periodMonths));
      if (values.periodMonths !== months)
        warnings.push("Period months was rounded down to a whole number.");

      if (values.startingMrr <= 0)
        warnings.push("Starting MRR must be greater than 0 to compute churn.");
      if (values.contractionMrr < 0) warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

      const losses = values.contractionMrr + values.churnedMrr;
      if (values.startingMrr > 0 && losses > values.startingMrr)
        warnings.push("Losses exceed starting MRR (check inputs).");

        const periodChurn = safeDivide(losses, values.startingMrr);
        const endingGrossMrr = values.startingMrr - losses;
        const grr = safeDivide(endingGrossMrr, values.startingMrr);
        const monthlyEquivalent =
          periodChurn !== null && months > 0
            ? 1 - Math.pow(1 - Math.min(1, Math.max(0, periodChurn)), 1 / months)
            : null;
        const monthlyEquivalentGrr =
          grr !== null && months > 0 ? Math.pow(grr, 1 / months) : null;

        return {
          headline: {
            key: "grossChurn",
            label: "Gross revenue churn (period)",
            value: periodChurn ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "(Contraction + churn) / starting MRR",
          },
          secondary: [
            {
              key: "monthlyEquivalent",
              label: "Monthly-equivalent gross revenue churn",
              value: monthlyEquivalent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: monthlyEquivalent === null ? "Requires valid inputs" : `Converted from ${months} month period`,
            },
            {
              key: "monthlyEquivalentGrr",
              label: "Monthly-equivalent GRR",
              value: monthlyEquivalentGrr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail:
                monthlyEquivalentGrr === null
                  ? "Requires valid inputs"
                  : `Converted from ${months} month period`,
            },
            {
              key: "losses",
              label: "Total losses (contraction + churn)",
              value: losses,
              format: "currency",
              currency: "USD",
            },
            {
              key: "endingGrossMrr",
              label: "Ending gross MRR",
              value: endingGrossMrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "grr",
              label: "GRR (period)",
              value: grr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: grr === null ? "Starting MRR is 0" : "Ending gross / starting",
            },
          ],
          warnings,
        };
      },
      formula:
        "Gross revenue churn = (contraction + churned MRR) / starting MRR; Monthly-equivalent = 1 - (1 - period churn)^(1/period months)",
    assumptions: [
      "Uses starting MRR as the denominator (standard for churn rates).",
      "Gross churn excludes expansion by definition.",
      "Monthly-equivalent conversion assumes smooth compounding across the period (approximation).",
    ],
    faqs: [
      {
        question: "Is gross revenue churn the same as GRR?",
        answer:
            "They are closely related. GRR is the remaining revenue after losses (ending gross / starting). Gross revenue churn focuses on the losses ((contraction + churn) / starting).",
      },
      {
        question: "Should I include expansion in gross churn?",
        answer:
          "No. Gross churn excludes expansion. Expansion is tracked separately and is included in NRR.",
      },
    ],
    guide: [
      {
        title: "Gross revenue churn tips",
        bullets: [
          "Track contraction and churned MRR separately to diagnose downgrades vs cancellations.",
          "Segment by plan and customer size; blended churn can hide weak cohorts.",
          "Use GRR/NRR alongside churn to get the full retention picture.",
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
      {
        key: "startingMrr",
        label: "Starting MRR (optional)",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "0",
        min: 0,
      },
      {
        key: "periodMonths",
        label: "Period length (months)",
        placeholder: "1",
        defaultValue: "1",
        min: 1,
        step: 1,
      },
      {
        key: "targetNetNewMrr",
        label: "Target net new MRR (optional)",
        placeholder: "15000",
        prefix: "$",
        defaultValue: "0",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.periodMonths));
      if (values.periodMonths !== months)
        warnings.push("Period months was rounded down to a whole number.");
      if (values.newMrr < 0) warnings.push("New MRR must be 0 or greater.");
      if (values.expansionMrr < 0) warnings.push("Expansion MRR must be 0 or greater.");
      if (values.contractionMrr < 0) warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

      const grossAdditions = values.newMrr + values.expansionMrr;
      const grossLosses = values.contractionMrr + values.churnedMrr;
      const netNewMrr = grossAdditions - grossLosses;
      const endingMrr = values.startingMrr > 0 ? values.startingMrr + netNewMrr : null;
      const growthRate =
        values.startingMrr > 0 ? netNewMrr / values.startingMrr : null;
      const avgNetNewPerMonth = netNewMrr / months;
      const requiredAdditions =
        values.targetNetNewMrr > 0 ? values.targetNetNewMrr + grossLosses : null;
      const requiredNetNewPerMonth =
        values.targetNetNewMrr > 0 ? values.targetNetNewMrr / months : null;

      return {
        headline: {
          key: "netNewMrr",
          label: "Net new MRR",
          value: netNewMrr,
          format: "currency",
          currency: "USD",
          detail: "New + Expansion - Contraction - Churn",
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
          {
            key: "endingMrr",
            label: "Ending MRR (starting + net new)",
            value: endingMrr ?? 0,
            format: "currency",
            currency: "USD",
            detail: endingMrr === null ? "Add starting MRR" : "Starting + net new",
          },
          {
            key: "growthRate",
            label: "MRR growth rate (net new / starting)",
            value: growthRate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: growthRate === null ? "Add starting MRR" : "Net new / starting",
          },
          {
            key: "avgNetNewPerMonth",
            label: "Average net new MRR per month",
            value: avgNetNewPerMonth,
            format: "currency",
            currency: "USD",
            detail: "Net new / months",
          },
          {
            key: "requiredAdditions",
            label: "Required additions for target net new",
            value: requiredAdditions ?? 0,
            format: "currency",
            currency: "USD",
            detail:
              requiredAdditions === null
                ? "Add target net new"
                : "Target net new + losses",
          },
          {
            key: "requiredNetNewPerMonth",
            label: "Required net new per month",
            value: requiredNetNewPerMonth ?? 0,
            format: "currency",
            currency: "USD",
            detail:
              requiredNetNewPerMonth === null
                ? "Add target net new"
                : "Target net new / months",
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
            key: "periodMonths",
            label: "Period months",
            value: months,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "targetNetNewMrr",
            label: "Target net new MRR",
            value: values.targetNetNewMrr,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Net new MRR = new + expansion - contraction - churn",
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
    slug: "mrr-waterfall-calculator",
    title: "MRR Waterfall Calculator",
    description:
      "Build an MRR waterfall: starting MRR + new + expansion − contraction − churn = ending MRR.",
    category: "saas-metrics",
    guideSlug: "mrr-waterfall-guide",
    relatedGlossarySlugs: ["mrr", "net-new-mrr", "quick-ratio"],
    seo: {
      intro: [
        "An MRR waterfall makes MRR changes explainable: you start with beginning MRR, add new and expansion, subtract contraction and churn, and you get ending MRR.",
        "This is a practical template for monthly reporting and for diagnosing whether growth is driven by acquisition or retention/expansion.",
      ],
      steps: [
        "Enter starting MRR for the period.",
        "Enter MRR movements: new, expansion, contraction, churned.",
        "Review ending MRR and net new MRR, plus quick ratio as a growth-quality check.",
      ],
      pitfalls: [
        "Mixing billings/cash with MRR run-rate movements.",
        "Comparing movements across periods with different definitions.",
        "Hiding problems with blended numbers (segment by plan/channel).",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR (beginning of period)",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
        min: 0,
      },
      {
        key: "newMrr",
        label: "New MRR",
        placeholder: "12000",
        prefix: "$",
        defaultValue: "12000",
        min: 0,
      },
      {
        key: "expansionMrr",
        label: "Expansion MRR",
        placeholder: "8000",
        prefix: "$",
        defaultValue: "8000",
        min: 0,
      },
      {
        key: "contractionMrr",
        label: "Contraction MRR",
        placeholder: "3000",
        prefix: "$",
        defaultValue: "3000",
        min: 0,
      },
      {
        key: "churnedMrr",
        label: "Churned MRR",
        placeholder: "5000",
        prefix: "$",
        defaultValue: "5000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingMrr < 0) warnings.push("Starting MRR must be 0 or greater.");
      if (values.newMrr < 0) warnings.push("New MRR must be 0 or greater.");
      if (values.expansionMrr < 0) warnings.push("Expansion MRR must be 0 or greater.");
      if (values.contractionMrr < 0) warnings.push("Contraction MRR must be 0 or greater.");
      if (values.churnedMrr < 0) warnings.push("Churned MRR must be 0 or greater.");

        const grossAdditions = values.newMrr + values.expansionMrr;
        const grossLosses = values.contractionMrr + values.churnedMrr;
        const netNewMrr = grossAdditions - grossLosses;
        const endingMrr = values.startingMrr + netNewMrr;
        const nrr =
          values.startingMrr > 0
            ? (values.startingMrr +
                values.expansionMrr -
                values.contractionMrr -
                values.churnedMrr) /
              values.startingMrr
            : null;
        const grr =
          values.startingMrr > 0
            ? (values.startingMrr - values.contractionMrr - values.churnedMrr) /
              values.startingMrr
            : null;
  
        const quickRatio = safeDivide(grossAdditions, grossLosses);
        if (grossLosses <= 0) warnings.push("Losses (contraction + churn) must be greater than 0 to compute quick ratio.");
  
        const growthRate = safeDivide(netNewMrr, values.startingMrr);

      return {
        headline: {
          key: "endingMrr",
          label: "Ending MRR",
          value: endingMrr,
          format: "currency",
          currency: "USD",
          detail: "Starting + net new",
        },
        secondary: [
          {
            key: "netNewMrr",
            label: "Net new MRR",
            value: netNewMrr,
            format: "currency",
            currency: "USD",
            detail: "New + Expansion − Contraction − Churn",
          },
          {
            key: "growthRate",
            label: "MRR growth rate (net new ÷ starting)",
            value: growthRate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: growthRate === null ? "Starting MRR must be > 0" : undefined,
          },
            {
              key: "quickRatio",
              label: "Quick ratio",
              value: quickRatio ?? 0,
              format: "ratio",
              maxFractionDigits: 2,
              detail: quickRatio === null ? "Losses must be > 0" : "(New + Expansion) ÷ (Contraction + Churn)",
            },
            {
              key: "nrr",
              label: "NRR for the period (starting base)",
              value: nrr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: nrr === null ? "Starting MRR must be > 0" : "1 + expansion - contraction - churn",
            },
            {
              key: "grr",
              label: "GRR for the period (starting base)",
              value: grr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: grr === null ? "Starting MRR must be > 0" : "1 - contraction - churn",
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
            key: "newMrr",
            label: "New MRR",
            value: values.newMrr,
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
    formula:
      "Ending MRR = starting MRR + new + expansion − contraction − churn; Net new MRR = new + expansion − contraction − churn",
    assumptions: [
      "All inputs represent the same period and use the same MRR definition.",
      "This is a reporting bridge; it does not model cohorts or timing within the period.",
    ],
    faqs: [
      {
        question: "Is this the same as net new MRR?",
        answer:
          "Net new MRR is the change (delta) in MRR. A waterfall adds starting MRR and produces an ending MRR to reconcile the period.",
      },
      {
        question: "Should I segment the waterfall?",
        answer:
          "Yes when possible. Segment by plan, channel, and customer size to avoid blended averages hiding churn pockets or weak cohorts.",
      },
    ],
    guide: [
      {
        title: "How to use an MRR waterfall",
        bullets: [
          "Use it in monthly reporting to make growth explainable, not just a single MRR number.",
          "Diagnose leaky growth by tracking churned and contraction MRR trends.",
          "Pair with payback and burn multiple to understand cash efficiency.",
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
        if (values.targetQuickRatio < 0) warnings.push("Target quick ratio must be 0 or greater.");
        const requiredPositive =
          values.targetQuickRatio > 0 ? negative * values.targetQuickRatio : null;
        const maxNegative =
          values.targetQuickRatio > 0 ? positive / values.targetQuickRatio : null;
        const netNewMrr = positive - negative;
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
          secondary: [
            {
              key: "netNewMrr",
              label: "Net new MRR (additions - losses)",
              value: netNewMrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "requiredPositive",
              label: "Required additions for target ratio",
              value: requiredPositive ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredPositive === null
                  ? "Target ratio is 0"
                  : "Losses x target ratio",
            },
            {
              key: "maxNegative",
              label: "Max losses at target ratio",
              value: maxNegative ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                maxNegative === null
                  ? "Target ratio is 0"
                  : "Additions / target ratio",
            },
          ],
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
    slug: "net-new-arr-calculator",
    title: "Net New ARR Calculator",
    description:
      "Calculate net new ARR from new, expansion, contraction, and churned ARR movements.",
    category: "saas-metrics",
    guideSlug: "net-new-arr-guide",
    relatedGlossarySlugs: ["arr", "net-new-arr"],
    seo: {
      intro: [
        "Net new ARR is the net change in recurring run-rate over a period after you add new and expansion ARR and subtract contraction and churned ARR.",
        "It’s commonly used in efficiency metrics like burn multiple and the SaaS magic number.",
      ],
      steps: [
        "Measure new ARR added in the period (from new customers).",
        "Measure expansion ARR (upsells, seats, add-ons) from existing customers.",
        "Subtract contraction ARR and churned ARR (downgrades and cancellations).",
        "Net new ARR is the net change in ARR for the period.",
      ],
      pitfalls: [
        "Mixing bookings/cash with ARR movements (different timing and definitions).",
        "Using inconsistent windows (monthly movements, quarterly reporting).",
        "Counting one-time fees/services as recurring ARR.",
      ],
    },
    inputs: [
      {
        key: "newArr",
        label: "New ARR",
        placeholder: "240000",
        prefix: "$",
        defaultValue: "240000",
        min: 0,
      },
      {
        key: "expansionArr",
        label: "Expansion ARR",
        placeholder: "160000",
        prefix: "$",
        defaultValue: "160000",
        min: 0,
      },
      {
        key: "contractionArr",
        label: "Contraction ARR",
        placeholder: "60000",
        prefix: "$",
        defaultValue: "60000",
        min: 0,
      },
        {
          key: "churnedArr",
          label: "Churned ARR",
          placeholder: "100000",
          prefix: "$",
          defaultValue: "100000",
          min: 0,
        },
        {
          key: "startingArr",
          label: "Starting ARR (optional)",
          help: "Used to compute net new ARR growth rate.",
          placeholder: "2000000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.newArr < 0) warnings.push("New ARR must be 0 or greater.");
        if (values.expansionArr < 0) warnings.push("Expansion ARR must be 0 or greater.");
        if (values.contractionArr < 0) warnings.push("Contraction ARR must be 0 or greater.");
        if (values.churnedArr < 0) warnings.push("Churned ARR must be 0 or greater.");

        const grossAdditions = values.newArr + values.expansionArr;
        const grossLosses = values.contractionArr + values.churnedArr;
        const netNewArr = grossAdditions - grossLosses;
        const netNewArrGrowth =
          values.startingArr > 0 ? netNewArr / values.startingArr : null;
        const netExpansionArr =
          values.expansionArr - values.contractionArr - values.churnedArr;
        const netExpansionRate =
          values.startingArr > 0 ? netExpansionArr / values.startingArr : null;
  
        return {
          headline: {
            key: "netNewArr",
            label: "Net new ARR",
            value: netNewArr,
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
            {
              key: "netNewArrGrowth",
              label: "Net new ARR growth rate",
              value: netNewArrGrowth ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                netNewArrGrowth === null
                  ? "Add starting ARR"
                  : "Net new ARR / starting ARR",
            },
            {
              key: "netExpansionRate",
              label: "Net expansion rate (period)",
              value: netExpansionRate ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                netExpansionRate === null
                  ? "Add starting ARR"
                  : "Expansion - contraction - churn / starting ARR",
            },
          ],
          warnings,
        };
      },
    formula: "Net new ARR = new ARR + expansion ARR − contraction ARR − churned ARR",
    assumptions: [
      "All movements are measured for the same period using a consistent ARR definition.",
      "ARR is treated as recurring run-rate (not recognized revenue).",
    ],
    faqs: [
      {
        question: "Is net new ARR the same as ARR growth rate?",
        answer:
          "Net new ARR is a dollar change (ΔARR). Growth rate is net new ARR divided by starting ARR for the period.",
      },
      {
        question: "How is net new ARR used for burn multiple?",
        answer:
          "Burn multiple compares net cash burn to net new ARR for the same period (often quarterly). Lower burn multiple means better growth efficiency.",
      },
    ],
    guide: [
      {
        title: "Net new ARR tips",
        bullets: [
          "Compute it on a consistent cadence (quarterly is common) to reduce noise.",
          "Segment by plan/channel to avoid blended numbers hiding churn pockets.",
          "Pair with retention (NRR/GRR) and payback to judge growth quality.",
        ],
      },
    ],
  },
  {
    slug: "arr-waterfall-calculator",
    title: "ARR Waterfall Calculator",
    description:
      "Build an ARR waterfall: starting ARR + new + expansion − contraction − churn = ending ARR.",
    category: "saas-metrics",
    guideSlug: "arr-waterfall-guide",
    relatedGlossarySlugs: ["arr", "net-new-arr", "arr-waterfall"],
    seo: {
      intro: [
        "An ARR waterfall reconciles a starting ARR snapshot to an ending ARR snapshot using ARR movements: new, expansion, contraction, and churned ARR.",
        "It’s a practical reporting template and a clean way to compute net new ARR and ARR growth for a period.",
      ],
      steps: [
        "Enter starting ARR for the period.",
        "Enter ARR movements: new, expansion, contraction, churned.",
        "Review ending ARR, net new ARR, and ARR growth rate.",
      ],
      pitfalls: [
        "Mixing bookings/cash with ARR movements (different timing and definitions).",
        "Using inconsistent definitions for 'recurring' ARR across periods.",
        "Hiding segment problems with blended numbers (segment by plan/channel).",
      ],
    },
    inputs: [
      {
        key: "startingArr",
        label: "Starting ARR (beginning of period)",
        placeholder: "2400000",
        prefix: "$",
        defaultValue: "2400000",
        min: 0,
      },
      {
        key: "newArr",
        label: "New ARR",
        placeholder: "240000",
        prefix: "$",
        defaultValue: "240000",
        min: 0,
      },
      {
        key: "expansionArr",
        label: "Expansion ARR",
        placeholder: "160000",
        prefix: "$",
        defaultValue: "160000",
        min: 0,
      },
      {
        key: "contractionArr",
        label: "Contraction ARR",
        placeholder: "60000",
        prefix: "$",
        defaultValue: "60000",
        min: 0,
      },
      {
        key: "churnedArr",
        label: "Churned ARR",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.startingArr < 0) warnings.push("Starting ARR must be 0 or greater.");
      if (values.newArr < 0) warnings.push("New ARR must be 0 or greater.");
      if (values.expansionArr < 0) warnings.push("Expansion ARR must be 0 or greater.");
      if (values.contractionArr < 0) warnings.push("Contraction ARR must be 0 or greater.");
      if (values.churnedArr < 0) warnings.push("Churned ARR must be 0 or greater.");

        const grossAdditions = values.newArr + values.expansionArr;
        const grossLosses = values.contractionArr + values.churnedArr;
        const netNewArr = grossAdditions - grossLosses;
        const endingArr = values.startingArr + netNewArr;
        const nrr =
          values.startingArr > 0
            ? (values.startingArr +
                values.expansionArr -
                values.contractionArr -
                values.churnedArr) /
              values.startingArr
            : null;
        const grr =
          values.startingArr > 0
            ? (values.startingArr - values.contractionArr - values.churnedArr) /
              values.startingArr
            : null;
        const netExpansionArr =
          values.expansionArr - values.contractionArr - values.churnedArr;

      const growthRate = safeDivide(netNewArr, values.startingArr);
      if (values.startingArr <= 0)
        warnings.push("Starting ARR must be greater than 0 to compute growth rate.");

      const quickRatio = safeDivide(grossAdditions, grossLosses);
      if (grossLosses <= 0) warnings.push("Losses (contraction + churn) must be greater than 0 to compute ratio.");

      return {
        headline: {
          key: "endingArr",
          label: "Ending ARR",
          value: endingArr,
          format: "currency",
          currency: "USD",
          detail: "Starting + net new",
        },
        secondary: [
          {
            key: "netNewArr",
            label: "Net new ARR",
            value: netNewArr,
            format: "currency",
            currency: "USD",
            detail: "New + Expansion − Contraction − Churn",
          },
          {
            key: "growthRate",
            label: "ARR growth rate (net new ÷ starting)",
            value: growthRate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: growthRate === null ? "Starting ARR must be > 0" : undefined,
          },
            {
              key: "ratio",
              label: "ARR quick ratio (additions ÷ losses)",
              value: quickRatio ?? 0,
              format: "ratio",
              maxFractionDigits: 2,
              detail: quickRatio === null ? "Losses must be > 0" : "(New + Expansion) ÷ (Contraction + Churn)",
            },
            {
              key: "nrr",
              label: "ARR NRR for the period",
              value: nrr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: nrr === null ? "Starting ARR must be > 0" : "1 + expansion - contraction - churn",
            },
            {
              key: "grr",
              label: "ARR GRR for the period",
              value: grr ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: grr === null ? "Starting ARR must be > 0" : "1 - contraction - churn",
            },
            {
              key: "netExpansionArr",
              label: "Net expansion ARR",
              value: netExpansionArr,
              format: "currency",
              currency: "USD",
              detail: "Expansion - contraction - churn",
            },
          ],
        breakdown: [
          {
            key: "startingArr",
            label: "Starting ARR",
            value: values.startingArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "newArr",
            label: "New ARR",
            value: values.newArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "expansionArr",
            label: "Expansion ARR",
            value: values.expansionArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "contractionArr",
            label: "Contraction ARR",
            value: values.contractionArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "churnedArr",
            label: "Churned ARR",
            value: values.churnedArr,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Ending ARR = starting ARR + new + expansion − contraction − churn; Net new ARR = new + expansion − contraction − churn",
    assumptions: [
      "All inputs represent the same period and use the same ARR definition (clean recurring run-rate).",
      "This is a reporting bridge; it does not model intra-period timing or cohort curves.",
    ],
    faqs: [
      {
        question: "Is net new ARR the same as ARR growth?",
        answer:
          "Net new ARR is a dollar amount (ΔARR). ARR growth rate is net new ARR divided by starting ARR for the period.",
      },
      {
        question: "Should I segment the waterfall?",
        answer:
          "Yes when possible. Segment by plan, channel, and customer size so blended numbers don’t hide churn pockets or weak cohorts.",
      },
    ],
    guide: [
      {
        title: "ARR waterfall tips",
        bullets: [
          "Use it quarterly if monthly snapshots are noisy due to deal timing.",
          "Pair ARR movement with retention (NRR/GRR) to judge durability.",
          "Pair with burn multiple and payback to judge cash efficiency.",
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
        {
          key: "targetMultiple",
          label: "Target burn multiple (optional)",
          help: "Used to estimate required net new ARR or max burn.",
          placeholder: "1.5",
          defaultValue: "1.5",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.netBurn < 0) warnings.push("Net burn must be 0 or greater.");
        if (values.netNewArr <= 0)
          warnings.push("Net new ARR must be greater than 0.");
  
        const multiple = safeDivide(values.netBurn, values.netNewArr);
        const requiredNetNewArr =
          values.targetMultiple > 0 ? values.netBurn / values.targetMultiple : null;
        const maxBurnAtTarget =
          values.targetMultiple > 0 ? values.netNewArr * values.targetMultiple : null;
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
          secondary: [
            {
              key: "requiredNetNewArr",
              label: "Required net new ARR for target",
              value: requiredNetNewArr ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredNetNewArr === null
                  ? "Target multiple is 0"
                  : "Net burn / target multiple",
            },
            {
              key: "maxBurnAtTarget",
              label: "Max burn at target multiple",
              value: maxBurnAtTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                maxBurnAtTarget === null
                  ? "Target multiple is 0"
                  : "Net new ARR x target multiple",
            },
          ],
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
          "Bookings measure contracted value signed in a period. ARR is a recurring run-rate snapshot (typically MRR x 12). Cash receipts can differ again depending on billing terms.",
          "This calculator turns a contract into comparable metrics: bookings (signed value), recurring run-rate (ARR), and cash collected (if prepaid).",
      ],
      steps: [
        "Enter the total contract value (TCV) and the term length (months).",
        "Enter any one-time fees/services included in the contract.",
          "Compute recurring value = TCV - one-time.",
          "Compute MRR = recurring / term months, then ARR = MRR x 12.",
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
          label: "Paid upfront (cash %)",
        help: "100% for annual prepay; 0% if billed monthly (cash spread out).",
        placeholder: "100",
        suffix: "%",
        defaultValue: "100",
        min: 0,
      },
      {
        key: "billingFrequencyMonths",
        label: "Billing frequency (months)",
        help: "1 = monthly, 3 = quarterly, 12 = annual.",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
      {
        key: "targetArr",
        label: "Target ARR (optional)",
        help: "Used to estimate required contract value (TCV).",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
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
      if (values.billingFrequencyMonths <= 0)
        warnings.push("Billing frequency must be greater than 0 months.");

      const recurring = Math.max(0, values.contractValue - values.oneTimeFees);
      const mrr = safeDivide(recurring, values.termMonths) ?? 0;
      const arr = mrr * 12;
      const bookings = values.contractValue;
      const upfrontCash = bookings * (values.prepaidPercent / 100);
      const remainingCash = bookings - upfrontCash;
      const billingFreq = Math.max(1, Math.floor(values.billingFrequencyMonths));
      if (values.billingFrequencyMonths !== billingFreq)
        warnings.push("Billing frequency was rounded down to a whole number.");
      if (values.termMonths % billingFreq !== 0)
        warnings.push("Term months is not divisible by billing frequency (cash schedule is approximate).");
      const invoiceCount =
        billingFreq > 0 ? values.termMonths / billingFreq : 0;
      const cashPerInvoice =
        invoiceCount > 0 ? remainingCash / invoiceCount : 0;
      const requiredRecurringForTarget =
        values.targetArr > 0 ? values.targetArr / 12 * values.termMonths : null;
      const requiredTcvForTarget =
        requiredRecurringForTarget !== null
          ? requiredRecurringForTarget + Math.max(0, values.oneTimeFees)
          : null;

      return {
        headline: {
          key: "arr",
          label: "ARR (run-rate)",
          value: arr,
          format: "currency",
          currency: "USD",
            detail: "Recurring / term months x 12",
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
            key: "upfrontCash",
            label: "Cash collected upfront",
            value: upfrontCash,
            format: "currency",
            currency: "USD",
          },
          {
            key: "remainingCash",
            label: "Cash remaining to bill",
            value: remainingCash,
            format: "currency",
            currency: "USD",
          },
          {
            key: "cashPerInvoice",
            label: "Cash per invoice (remaining)",
            value: cashPerInvoice,
            format: "currency",
            currency: "USD",
            detail: invoiceCount > 0 ? "Remaining cash / invoices" : "No remaining invoices",
          },
          {
            key: "requiredTcv",
            label: "Required TCV for target ARR",
            value: requiredTcvForTarget ?? 0,
            format: "currency",
            currency: "USD",
            detail: values.targetArr > 0 ? "Target ARR to contract value" : "Add target ARR",
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
          {
            key: "invoiceCount",
            label: "Invoices (remaining)",
            value: invoiceCount,
            format: "number",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
      formula:
        "Bookings = TCV; ARR = ((TCV - one-time) / term months) x 12; Cash upfront = TCV x prepaid %",
    assumptions: [
      "ARR is a run-rate snapshot; it is not recognized revenue.",
      "Recurring portion excludes one-time fees and services.",
      "Cash collected depends on billing terms; this model uses 'paid upfront %' as a simplification.",
    ],
    faqs: [
      {
        question: "Is bookings the same as ARR?",
        answer:
            "No. Bookings measure contracted value signed in a period. ARR measures recurring run-rate (MRR x 12). They answer different questions.",
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
    slug: "deferred-revenue-rollforward-calculator",
    title: "Deferred Revenue Rollforward Calculator",
    description:
      "Bridge billings to recognized revenue by rolling deferred revenue forward for a period.",
    category: "finance",
    guideSlug: "deferred-revenue-guide",
    relatedGlossarySlugs: ["billings", "recognized-revenue", "deferred-revenue", "revenue-recognition"],
    seo: {
      intro: [
        "Billings, cash receipts, and recognized revenue can differ due to timing. Deferred revenue is the bridge: it increases when you bill/collect ahead of delivery and decreases as you recognize revenue.",
        "This calculator models a simple deferred revenue rollforward: ending deferred = beginning deferred + billings − recognized revenue.",
      ],
      steps: [
        "Enter beginning deferred revenue (start-of-period balance).",
        "Enter billings in the period (invoices issued).",
        "Enter recognized revenue for the period.",
        "Review ending deferred revenue and the change during the period.",
      ],
      pitfalls: [
        "Mixing cash receipts with billings (not always the same).",
        "Using bookings/TCV as billings (bookings can include future-period billing).",
        "Forgetting that deferred revenue can go negative only in edge cases (check definitions).",
      ],
    },
    inputs: [
      {
        key: "beginningDeferred",
        label: "Beginning deferred revenue",
        placeholder: "250000",
        prefix: "$",
        defaultValue: "250000",
        min: 0,
      },
      {
        key: "billings",
        label: "Billings (in period)",
        help: "Invoices issued in the period (not necessarily cash collected).",
        placeholder: "400000",
        prefix: "$",
        defaultValue: "400000",
        min: 0,
      },
      {
        key: "recognizedRevenue",
        label: "Recognized revenue (in period)",
        placeholder: "350000",
        prefix: "$",
        defaultValue: "350000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const endingDeferred = values.beginningDeferred + values.billings - values.recognizedRevenue;
      const change = endingDeferred - values.beginningDeferred;

      if (endingDeferred < 0) {
        warnings.push(
          "Ending deferred revenue is negative. Double-check definitions (billings vs cash, revenue timing) or inputs.",
        );
      }

      return {
        headline: {
          key: "endingDeferred",
          label: "Ending deferred revenue",
          value: endingDeferred,
          format: "currency",
          currency: "USD",
          detail: "Begin + billings − recognized",
        },
        secondary: [
          {
            key: "change",
            label: "Change in deferred revenue",
            value: change,
            format: "currency",
            currency: "USD",
            detail: "Ending − beginning",
          },
        ],
        breakdown: [
          {
            key: "beginningDeferred",
            label: "Beginning deferred",
            value: values.beginningDeferred,
            format: "currency",
            currency: "USD",
          },
          {
            key: "billings",
            label: "Billings",
            value: values.billings,
            format: "currency",
            currency: "USD",
          },
          {
            key: "recognizedRevenue",
            label: "Recognized revenue",
            value: values.recognizedRevenue,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Ending deferred = beginning deferred + billings − recognized revenue",
    assumptions: [
      "Billings are invoices issued in the period (simplified).",
      "Recognized revenue reflects what was earned/delivered in the period.",
      "Ignores FX effects, write-offs, and detailed revenue recognition policies (simplified).",
    ],
    faqs: [
      {
        question: "Is deferred revenue the same as cash?",
        answer:
          "No. Deferred revenue is a balance sheet liability (unearned revenue). Cash is cash. Deferred revenue often increases with annual prepay, but cash and deferred can still differ due to collections timing.",
      },
      {
        question: "Why does deferred revenue matter for SaaS metrics?",
        answer:
          "Because it explains timing differences between billings/cash and recognized revenue. It’s especially important when customers prepay annually or when billing terms change.",
      },
    ],
    guide: [
      {
        title: "How to use the rollforward",
        bullets: [
          "If deferred revenue is growing, billings are outpacing recognized revenue (often prepay or faster sales).",
          "If deferred revenue is shrinking, you may be recognizing past billings faster than new billings (or billing terms shifted).",
          "Use alongside bookings/ARR to avoid mixing contracted value with recognized revenue timing.",
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
        "Use the prior period's sales & marketing spend as the input spend (to account for lag).",
        "Set periods per year (4 for quarterly, 12 for monthly) to annualize net new ARR.",
        "Compute Magic Number ~= (net new ARR * periods per year) / prior-period S&M spend.",
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
        {
          key: "periodsPerYear",
          label: "Periods per year",
          help: "4 for quarterly, 12 for monthly (used to annualize net new ARR).",
          placeholder: "4",
          defaultValue: "4",
          min: 1,
          step: 1,
        },
        {
          key: "targetMagicNumber",
          label: "Target magic number (optional)",
          help: "Used to estimate required net new ARR or max spend.",
          placeholder: "1",
          defaultValue: "1",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.salesMarketingSpend <= 0)
          warnings.push("Sales & marketing spend must be greater than 0.");

      const periodsPerYear = Math.max(1, Math.floor(values.periodsPerYear));
      if (values.periodsPerYear !== periodsPerYear) {
        warnings.push("Periods per year was rounded down to a whole number.");
      }

        const annualizedNetNewArr = values.netNewArr * periodsPerYear;
        const magic = safeDivide(annualizedNetNewArr, values.salesMarketingSpend);
        const requiredNetNewArrForTarget =
          values.targetMagicNumber > 0
            ? (values.salesMarketingSpend * values.targetMagicNumber) / periodsPerYear
            : null;
        const maxSpendAtTarget =
          values.targetMagicNumber > 0
            ? annualizedNetNewArr / values.targetMagicNumber
            : null;
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
          detail: "(Net new ARR * periods per year) / prior S&M spend",
        },
        secondary: [
          {
            key: "annualizedNetNewArr",
            label: "Annualized net new ARR",
            value: annualizedNetNewArr,
            format: "currency",
            currency: "USD",
            detail: `${periodsPerYear} periods/year`,
          },
            {
              key: "netNewArrPerDollar",
              label: "Net new ARR per $1 spend (unannualized)",
              value: safeDivide(values.netNewArr, values.salesMarketingSpend) ?? 0,
              format: "multiple",
              maxFractionDigits: 3,
              detail: "Net new ARR / prior spend",
            },
            {
              key: "requiredNetNewArrForTarget",
              label: "Required net new ARR for target",
              value: requiredNetNewArrForTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredNetNewArrForTarget === null
                  ? "Target magic number is 0"
                  : "Target magic x spend / periods",
            },
            {
              key: "maxSpendAtTarget",
              label: "Max spend at target magic",
              value: maxSpendAtTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                maxSpendAtTarget === null
                  ? "Target magic number is 0"
                  : "Annualized net new ARR / target magic",
            },
          ],
        breakdown: [
          {
            key: "netNewArr",
            label: "Net new ARR (period)",
            value: values.netNewArr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "salesMarketingSpend",
            label: "Prior period S&M spend",
            value: values.salesMarketingSpend,
            format: "currency",
            currency: "USD",
          },
          {
            key: "periodsPerYear",
            label: "Periods per year",
            value: periodsPerYear,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Magic Number ~= (Net new ARR in period * periods per year) / prior-period S&M spend",
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
    seo: {
      intro: [
        "Customer lifetime is an intuitive way to translate churn into a time horizon: how long a typical customer stays active before churning.",
        "This calculator uses a constant monthly churn shortcut. It also reports median lifetime and retention after a chosen horizon to help you reason about compounding.",
      ],
      steps: [
        "Enter monthly churn rate (customer churn, not revenue churn).",
        "Review expected lifetime (1 / churn) as a quick estimate.",
        "Review median lifetime and retention at a horizon (for example 12 months).",
        "Use cohort curves for precision when churn changes by tenure.",
      ],
      benchmarks: [
        "Small changes in churn can create large changes in lifetime because churn is in the denominator.",
        "Median lifetime is often more conservative than 1/churn when churn is not very small.",
        "Pair lifetime with gross margin to estimate LTV and with CAC to estimate payback feasibility.",
      ],
      pitfalls: [
        "Mixing monthly churn with annual ARPA or annual retention (unit mismatch).",
        "Using NRR/GRR as if it were customer churn (different denominators).",
        "Assuming churn is constant when early churn is much higher than steady-state churn.",
      ],
    },
    inputs: [
      {
        key: "monthlyChurnPercent",
        label: "Monthly churn rate",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: 0,
      },
      {
        key: "horizonMonths",
        label: "Horizon (months)",
        help: "Used to compute retention after N months (for example 12).",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const churn = values.monthlyChurnPercent / 100;
      if (churn <= 0) warnings.push("Churn must be greater than 0 for this model.");
      if (churn >= 1) warnings.push("Churn must be less than 100% for this model.");

      const horizonMonths = Math.max(1, Math.floor(values.horizonMonths));
      if (values.horizonMonths !== horizonMonths) {
        warnings.push("Horizon months was rounded down to a whole number.");
      }

      const lifetimeMonths = churn > 0 ? 1 / churn : 0;
      const medianLifetimeMonths =
        churn > 0 && churn < 1 ? Math.log(0.5) / Math.log(1 - churn) : 0;
      const retentionAtHorizon =
        churn >= 0 && churn < 1 ? Math.pow(1 - churn, horizonMonths) : 0;
      return {
        headline: {
          key: "lifetime",
          label: "Estimated customer lifetime",
          value: lifetimeMonths,
          format: "months",
          maxFractionDigits: 1,
          detail: "1 / monthly churn rate",
        },
        secondary: [
          {
            key: "medianLifetime",
            label: "Median lifetime (months)",
            value: medianLifetimeMonths,
            format: "months",
            maxFractionDigits: 1,
            detail: "Time until 50% of customers churn (constant churn model)",
          },
          {
            key: "retentionAtHorizon",
            label: `Retention after ${horizonMonths} months`,
            value: retentionAtHorizon,
            format: "percent",
            maxFractionDigits: 1,
            detail: "(1 - churn)^months",
          },
        ],
        breakdown: [
          {
            key: "monthlyChurnPercent",
            label: "Monthly churn",
            value: churn,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "horizonMonths",
            label: "Horizon months",
            value: horizonMonths,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula: "Customer lifetime (months) ~= 1 / monthly churn rate",
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
    seo: {
      intro: [
        "Break-even revenue answers: how much revenue do you need to cover fixed costs given a contribution margin (gross margin is a common proxy)?",
        "This calculator assumes a simple model: fixed costs are covered by gross profit, so break-even revenue = fixed costs / gross margin.",
      ],
      steps: [
        "Enter fixed costs for the period (monthly by default).",
        "Enter gross margin as a percent of revenue.",
        "Compute break-even revenue and optional daily break-even run rate.",
        "Use scenarios to stress-test margin changes and fixed cost changes.",
      ],
      benchmarks: [
        "If gross margin is 80%, break-even revenue is 1.25x fixed costs (1 / 0.80).",
        "If break-even revenue is far above current revenue, reduce fixed costs or improve margin before scaling.",
        "Gross margin is a proxy; include variable costs (fees, shipping, returns) if they matter materially.",
      ],
      pitfalls: [
        "Using accounting gross margin when variable fulfillment costs are excluded (understates break-even revenue).",
        "Mixing time units (monthly fixed costs with annual margin assumptions).",
        "Treating this as a full P&L model (it is a simplified planning shortcut).",
      ],
    },
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
        {
          key: "daysInPeriod",
          label: "Days in period (optional)",
          help: "Used to compute a daily break-even run rate.",
          placeholder: "30",
          defaultValue: "30",
          min: 1,
          step: 1,
        },
        {
          key: "currentRevenue",
          label: "Current revenue (optional)",
          help: "Used to compute gap vs break-even.",
          placeholder: "25000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
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

      const days = Math.max(1, Math.floor(values.daysInPeriod));
        if (values.daysInPeriod !== days) {
          warnings.push("Days in period was rounded down to a whole number.");
        }
        const dailyBreakEven = breakevenRevenue / days;
        const revenueGap =
          values.currentRevenue > 0 ? breakevenRevenue - values.currentRevenue : null;
        const percentToBreakeven =
          values.currentRevenue > 0 ? values.currentRevenue / breakevenRevenue : null;
        return {
          headline: {
            key: "breakeven",
            label: "Break-even revenue (monthly)",
          value: breakevenRevenue,
          format: "currency",
          currency: "USD",
          detail: "Fixed costs / gross margin",
        },
        secondary: [
          {
            key: "dailyBreakEven",
            label: "Daily break-even revenue",
            value: dailyBreakEven,
            format: "currency",
            currency: "USD",
            detail: `Assumes ${days} days in period`,
          },
            {
              key: "requiredGrossProfit",
              label: "Gross profit required",
              value: values.fixedCosts,
              format: "currency",
              currency: "USD",
              detail: "Equals fixed costs in this model",
            },
            {
              key: "revenueGap",
              label: "Gap to break-even (monthly)",
              value: revenueGap ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                revenueGap === null
                  ? "Add current revenue"
                  : revenueGap > 0
                    ? "Shortfall to break-even"
                    : "Above break-even",
            },
            {
              key: "percentToBreakeven",
              label: "Percent of break-even reached",
              value: percentToBreakeven ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: percentToBreakeven === null ? "Add current revenue" : "Current / break-even",
            },
          ],
          breakdown: [
            {
              key: "fixedCosts",
              label: "Fixed costs",
              value: values.fixedCosts,
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
              key: "currentRevenue",
              label: "Current revenue",
              value: values.currentRevenue,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
    formula: "Break-even Revenue = Fixed Costs / Gross Margin",
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
    seo: {
      intro: [
        "NPV (net present value) measures how much value a project creates after discounting future cash flows back to today's dollars.",
        "A positive NPV means the project beats your required return (discount rate). A negative NPV means it fails the hurdle rate.",
      ],
      steps: [
        "Enter the upfront investment (time 0 cash outflow).",
        "Enter annual cash flow, the number of years, and a discount rate (required return).",
        "Review NPV and the present value (PV) of cash flows.",
        "Use sensitivity: the same project can flip from positive to negative as the discount rate changes.",
      ],
      benchmarks: [
        "NPV > 0: creates value at the chosen discount rate.",
        "NPV = 0: break-even at the chosen discount rate (meets the hurdle rate).",
        "Profitability index (PV / investment) helps compare projects of different sizes.",
      ],
      pitfalls: [
        "Using nominal cash flows with a real discount rate (inflation mismatch).",
        "Ignoring working capital timing or terminal value when they are material.",
        "Using a single discount rate without testing a range of outcomes.",
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
        {
          key: "targetNpv",
          label: "Target NPV (optional)",
          help: "Used to estimate required annual cash flow.",
          placeholder: "0",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const r = values.discountRatePercent / 100;
        if (values.years <= 0) warnings.push("Years must be greater than 0.");
  
        let pv = 0;
        let annuityFactor = 0;
        if (r === 0) {
          annuityFactor = values.years;
          pv = values.annualCashFlow * annuityFactor;
        } else {
          annuityFactor = (1 - Math.pow(1 + r, -values.years)) / r;
          pv = values.annualCashFlow * annuityFactor;
        }
  
        const npv = pv - values.initialInvestment;
        const requiredCashFlow =
          annuityFactor > 0
            ? (values.initialInvestment + values.targetNpv) / annuityFactor
            : null;
        return {
          headline: {
            key: "npv",
            label: "Net present value (NPV)",
            value: npv,
          format: "currency",
          currency: "USD",
          detail: "PV of cash flows - initial investment",
        },
        secondary: [
          {
            key: "pv",
            label: "Present value of cash flows",
            value: pv,
            format: "currency",
            currency: "USD",
          },
            {
              key: "profitabilityIndex",
              label: "Profitability index",
              value:
                values.initialInvestment > 0 ? pv / values.initialInvestment : 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "PV / initial investment",
            },
            {
              key: "annuityFactor",
              label: "Annuity PV factor",
              value: annuityFactor,
              format: "number",
              maxFractionDigits: 3,
              detail: "PV per $1 annual cash flow",
            },
            {
              key: "requiredCashFlow",
              label: "Required annual cash flow for target NPV",
              value: requiredCashFlow ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredCashFlow === null
                  ? "Invalid years or discount rate"
                  : "(Initial investment + target NPV) / factor",
            },
          ],
          warnings,
        };
      },
    formula:
      "NPV = sum_{t=1..n} cash_flow_t / (1 + r)^t - initial investment (annuity PV for constant cash flow)",
    assumptions: [
      "Assumes constant annual cash flow (real projects vary).",
      "Discount rate reflects required return (hurdle rate / MARR).",
    ],
    faqs: [
      {
        question: "What discount rate should I use?",
        answer:
          "Use your required return or hurdle rate (often called MARR). Many teams test a range (e.g., 8%-20%) to see sensitivity.",
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
        const totalInflows =
          values.cashFlow1 +
          values.cashFlow2 +
          values.cashFlow3 +
          values.cashFlow4 +
          values.cashFlow5 +
          values.terminalValue;
        const netCash = totalInflows - values.initialInvestment;
        const cashMultiple =
          values.initialInvestment > 0 ? totalInflows / values.initialInvestment : null;
        let simplePaybackYears: number | null = null;
        if (values.initialInvestment > 0) {
          let cumulative = 0;
          const inflows = [
            values.cashFlow1,
            values.cashFlow2,
            values.cashFlow3,
            values.cashFlow4,
            values.cashFlow5 + values.terminalValue,
          ];
          for (let i = 0; i < inflows.length; i++) {
            const flow = inflows[i];
            const next = cumulative + flow;
            if (next >= values.initialInvestment && flow > 0) {
              const remaining = values.initialInvestment - cumulative;
              simplePaybackYears = i + remaining / flow;
              break;
            }
            cumulative = next;
          }
        }

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
            {
              key: "totalInflows",
              label: "Total cash inflows",
              value: totalInflows,
              format: "currency",
              currency: "USD",
            },
            {
              key: "netCash",
              label: "Net cash (inflows - investment)",
              value: netCash,
              format: "currency",
              currency: "USD",
            },
            {
              key: "cashMultiple",
              label: "Cash multiple",
              value: cashMultiple ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: cashMultiple === null ? "Investment is 0" : "Total inflows / investment",
            },
            {
              key: "simplePaybackYears",
              label: "Simple payback (years)",
              value: simplePaybackYears ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail:
                simplePaybackYears === null
                  ? "Not reached in 5 years"
                  : "Undiscounted payback",
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
    seo: {
      intro: [
        "Discounted payback answers: how long until the present value of cash flows pays back the initial investment?",
        "It is stricter than simple payback because it accounts for the time value of money via a discount rate (required return / MARR).",
      ],
      steps: [
        "Enter the initial investment (upfront cash outflow).",
        "Enter annual cash flow, a discount rate, and a max evaluation horizon.",
        "Review discounted payback vs simple payback (undiscounted).",
        "If discounted payback is not reached, the project may still have positive NPV depending on the horizon and discount rate.",
      ],
      benchmarks: [
        "Discounted payback is typically longer than simple payback because future cash flows are worth less today.",
        "Use discounted payback for risk management; use NPV to measure value created at the hurdle rate.",
        "If payback depends heavily on late-year cash flows, results are sensitive to discount rate and execution risk.",
      ],
      pitfalls: [
        "Using a discount rate that does not match the risk of the cash flows (too low overstates value).",
        "Mixing nominal cash flows with a real discount rate (inflation mismatch).",
        "Treating payback as the only decision rule (NPV and strategic value still matter).",
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
      const years = Math.max(1, Math.floor(values.years));
      if (values.years !== years) warnings.push("Years was rounded down to a whole number.");

      if (values.annualCashFlow <= 0)
        warnings.push("Annual cash flow must be greater than 0.");

      const simplePaybackYears = safeDivide(
        values.initialInvestment,
        values.annualCashFlow,
      );

        const pvTotal =
          r === 0
            ? values.annualCashFlow * years
            : values.annualCashFlow * ((1 - Math.pow(1 + r, -years)) / r);
        const npv = pvTotal - values.initialInvestment;
        const pvCoverage =
          values.initialInvestment > 0 ? pvTotal / values.initialInvestment : null;

        let cumulative = 0;
        let paybackYears: number | null = null;
      for (let year = 1; year <= years; year++) {
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
            {
              key: "discountedPaybackYears",
              label: "Discounted payback (years)",
              value: paybackYears ?? 0,
              format: "number",
              maxFractionDigits: 2,
              detail: paybackYears === null ? "Not reached in horizon" : "Discounted",
            },
            {
              key: "npv",
              label: "NPV (over horizon)",
              value: npv,
              format: "currency",
              currency: "USD",
              detail: `Over ${years} years`,
            },
            {
              key: "pvTotal",
              label: "PV of cash flows (over horizon)",
              value: pvTotal,
              format: "currency",
              currency: "USD",
            },
            {
              key: "pvCoverage",
              label: "PV coverage of investment",
              value: pvCoverage ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail:
                pvCoverage === null
                  ? "Initial investment is 0"
                  : "PV of cash flows / investment",
            },
          ],
        warnings,
      };
    },
    formula:
      "Discounted payback is the earliest time where cumulative discounted cash flows >= initial investment",
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
        let sumMrr = 0;

      const baseMrr = mrr;

        for (let month = 1; month <= months; month++) {
          sumMrr += mrr;
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
        const averageMrr = sumMrr / months;
        const cmgr = baseMrr > 0 ? Math.pow(mrr / baseMrr, 1 / months) - 1 : 0;
        const totalNetNew = totalNew + totalExpansion - totalContraction - totalChurn;

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
            {
              key: "averageMrr",
              label: "Average MRR over horizon",
              value: averageMrr,
              format: "currency",
              currency: "USD",
              detail: "Average of monthly starting MRR",
            },
            {
              key: "totalNew",
              label: "Total new MRR added",
              value: totalNew,
              format: "currency",
              currency: "USD",
            },
            {
              key: "totalExpansion",
              label: "Total expansion MRR",
              value: totalExpansion,
              format: "currency",
              currency: "USD",
            },
            {
              key: "totalContraction",
              label: "Total contraction MRR",
              value: totalContraction,
              format: "currency",
              currency: "USD",
            },
            {
              key: "totalChurn",
              label: "Total churned MRR",
              value: totalChurn,
              format: "currency",
              currency: "USD",
            },
            {
              key: "totalNetNew",
              label: "Total net new MRR (components)",
              value: totalNetNew,
              format: "currency",
              currency: "USD",
              detail: "New + expansion - contraction - churn",
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
        {
          key: "targetRunwayMonths",
          label: "Target runway (months) (optional)",
          help: "Used to estimate required revenue for the target runway.",
          placeholder: "18",
          defaultValue: "0",
          min: 0,
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
        let cashEnd = values.cashBalance;

        for (let month = 1; month <= months; month++) {
          const grossProfit = revenue * grossMargin;
          const netBurn = values.monthlyOperatingExpenses - grossProfit;
          if (breakevenMonth === null && netBurn <= 0) breakevenMonth = month;

          cash -= netBurn;
          if (cash <= 0) {
            runwayWithGrowth = month;
            break;
          }
          cashEnd = cash;
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
        const targetRunwayMonths = Math.max(0, Math.floor(values.targetRunwayMonths));
        if (values.targetRunwayMonths !== targetRunwayMonths && targetRunwayMonths > 0) {
          warnings.push("Target runway was rounded down to a whole number.");
        }
        const allowedNetBurn =
          targetRunwayMonths > 0 ? values.cashBalance / targetRunwayMonths : null;
        const requiredRevenueForTarget =
          allowedNetBurn !== null && grossMargin > 0
            ? Math.max(
                0,
                (values.monthlyOperatingExpenses - allowedNetBurn) / grossMargin,
              )
            : null;

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
            {
              key: "cashEnd",
              label: "Cash remaining at end of horizon",
              value: runwayWithGrowth ? 0 : cashEnd,
              format: "currency",
              currency: "USD",
              detail: runwayWithGrowth ? "Cash hits zero before horizon" : `After ${months} months`,
            },
            {
              key: "requiredRevenueForTarget",
              label: "Required revenue for target runway",
              value: requiredRevenueForTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredRevenueForTarget === null
                  ? "Add target runway and gross margin"
                  : "Opex minus allowed burn, divided by margin",
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
        let retentionMonth12 = 0;
  
        for (let t = 1; t <= months; t++) {
          const expectedRevenue =
            values.arpaMonthly * Math.pow(1 + expansion, t - 1) * Math.pow(retention, t - 1);
          const gp = expectedRevenue * grossMargin;
          undiscounted += gp;
          const df = monthlyDiscount > 0 ? Math.pow(1 + monthlyDiscount, t) : 1;
          discounted += gp / df;
          if (t === 12) month12GrossProfit = gp;
          if (t === 12) retentionMonth12 = Math.pow(retention, t);
        }
  
        const retentionAtHorizon = Math.pow(retention, months);
        const approxLifetimeMonths = churn > 0 ? 1 / churn : null;
        const averageGrossProfit = undiscounted / months;
        const discountedRatio = undiscounted > 0 ? discounted / undiscounted : null;

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
              key: "retentionMonth12",
              label: "Logo retention after 12 months",
              value: retentionMonth12,
              format: "percent",
              maxFractionDigits: 1,
              detail: months < 12 ? "Horizon < 12 months" : "Constant churn assumption",
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
            {
              key: "averageGrossProfit",
              label: "Average gross profit per month",
              value: averageGrossProfit,
              format: "currency",
              currency: "USD",
              detail: `Average over ${months} months`,
            },
            {
              key: "discountedRatio",
              label: "Discounted / undiscounted LTV",
              value: discountedRatio ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: discountedRatio === null ? "Undiscounted LTV is 0" : "Discount impact",
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
  {
    slug: "price-increase-break-even-calculator",
    title: "Price Increase Break-even Calculator",
    description:
      "Estimate the maximum churn (immediate or ongoing) a price increase can tolerate before it destroys revenue.",
    category: "saas-metrics",
    guideSlug: "price-increase-guide",
    relatedGlossarySlugs: [
      "mrr",
      "arr",
      "arpa",
      "logo-churn",
      "revenue-churn",
      "nrr",
      "grr",
      "price-increase",
    ],
    seo: {
      intro: [
        "Price increases are one of the highest-leverage growth levers, but they can backfire if they trigger churn or downgrades.",
        "This calculator estimates (1) the break-even immediate churn from a price change, and (2) the break-even ongoing churn increase that would offset the price uplift over your chosen horizon.",
      ],
      steps: [
        "Enter starting MRR and your planned price increase (%).",
        "Choose a forecast horizon (e.g., 6–24 months).",
        "Enter baseline monthly churn, then either immediate churn from the change or an ongoing churn increase.",
        "Compare revenue impact and the break-even churn thresholds.",
      ],
      pitfalls: [
        "Mixing logo churn and revenue churn (downgrades behave differently).",
        "Assuming churn impact is permanent when it may be a one-time shock.",
        "Applying price increases without segmentation (plans, cohorts, usage).",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
        min: 0,
      },
      {
        key: "priceIncreasePercent",
        label: "Price increase",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
        min: 0,
        step: 0.1,
      },
      {
        key: "baselineMonthlyChurnPercent",
        label: "Baseline monthly churn (revenue)",
        help: "Approximate revenue churn on existing MRR (exclude expansion).",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "horizonMonths",
        label: "Horizon (months)",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
      {
        key: "immediateChurnPercent",
        label: "Immediate churn from price change (optional)",
        help: "One-time revenue loss right after the change (set 0 if unknown).",
        placeholder: "3",
        suffix: "%",
        defaultValue: "0",
        min: 0,
        step: 0.1,
      },
      {
        key: "ongoingChurnIncreasePercent",
        label: "Ongoing churn increase (optional)",
        help: "Additional churn added to baseline each month (set 0 if using immediate churn only).",
        placeholder: "0.3",
        suffix: "%",
        defaultValue: "0",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const horizon = Math.max(1, Math.floor(values.horizonMonths));
      if (values.horizonMonths !== horizon)
        warnings.push("Horizon was rounded down to a whole number.");

      const u = values.priceIncreasePercent / 100;
      const baselineChurn = values.baselineMonthlyChurnPercent / 100;
      const shock = values.immediateChurnPercent / 100;
      const churnIncrease = values.ongoingChurnIncreasePercent / 100;

      if (values.startingMrr <= 0) warnings.push("Starting MRR must be greater than 0.");
      if (baselineChurn < 0 || baselineChurn >= 1)
        warnings.push("Baseline churn must be between 0% and 99.9%.");
      if (shock < 0 || shock >= 1)
        warnings.push("Immediate churn must be between 0% and 99.9%.");
      if (churnIncrease < 0 || churnIncrease >= 1)
        warnings.push("Ongoing churn increase must be between 0% and 99.9%.");

      const starting = Math.max(0, values.startingMrr);

      const mrrNoChange = (month: number) =>
        starting * Math.pow(1 - baselineChurn, month - 1);

      const mrrWithChange = (month: number) => {
        const churnedAtChange = 1 - shock;
        const churnThisMonth = Math.min(0.999, baselineChurn + churnIncrease);
        return (
          starting *
          (1 + u) *
          churnedAtChange *
          Math.pow(1 - churnThisMonth, month - 1)
        );
      };

      let revenueNoChange = 0;
      let revenueWithChange = 0;
      for (let m = 1; m <= horizon; m++) {
        revenueNoChange += mrrNoChange(m);
        revenueWithChange += mrrWithChange(m);
      }

      const deltaRevenue = revenueWithChange - revenueNoChange;
      const deltaPercent =
        revenueNoChange > 0 ? deltaRevenue / revenueNoChange : 0;

      const breakEvenImmediateChurn = 1 - 1 / (1 + u);

      let breakEvenOngoingChurnIncrease: number | null = null;
      if (u > 0 && baselineChurn >= 0 && baselineChurn < 1) {
        const sumMultiplier = (churnRate: number) => {
          if (churnRate <= 0) return horizon;
          return (1 - Math.pow(1 - churnRate, horizon)) / churnRate;
        };

        const base = sumMultiplier(baselineChurn);
        const target = base / (1 + u);

        let lo = baselineChurn;
        let hi = Math.min(0.999, baselineChurn + 0.999);
        if (baselineChurn < 0.999) hi = 0.999;

        const f = (churnRate: number) => sumMultiplier(churnRate) - target;
        const fLo = f(lo);
        const fHi = f(hi);

        if (Number.isFinite(fLo) && Number.isFinite(fHi) && fLo >= 0 && fHi <= 0) {
          for (let i = 0; i < 60; i++) {
            const mid = (lo + hi) / 2;
            const fMid = f(mid);
            if (fMid > 0) lo = mid;
            else hi = mid;
          }
          const churnBe = (lo + hi) / 2;
          breakEvenOngoingChurnIncrease = Math.max(0, churnBe - baselineChurn);
        }
      }

      return {
        headline: {
          key: "deltaRevenue",
          label: `Revenue impact over ${horizon} months`,
          value: deltaRevenue,
          format: "currency",
          currency: "USD",
          detail: "With change - without change (existing base only)",
        },
        secondary: [
          {
            key: "deltaPercent",
            label: "Revenue impact (%)",
            value: deltaPercent,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "breakEvenImmediateChurn",
            label: "Break-even immediate churn",
            value: breakEvenImmediateChurn,
            format: "percent",
            maxFractionDigits: 1,
            detail: "Max one-time revenue loss at change time",
          },
          {
            key: "breakEvenOngoingChurnIncrease",
            label: "Break-even ongoing churn increase (approx)",
            value: breakEvenOngoingChurnIncrease ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail:
              breakEvenOngoingChurnIncrease === null
                ? "Not available for this input set"
                : "Added to baseline monthly churn",
          },
        ],
        breakdown: [
          {
            key: "revenueNoChange",
            label: `Revenue without change (${horizon} months)`,
            value: revenueNoChange,
            format: "currency",
            currency: "USD",
          },
          {
            key: "revenueWithChange",
            label: `Revenue with price increase (${horizon} months)`,
            value: revenueWithChange,
            format: "currency",
            currency: "USD",
          },
          {
            key: "startingMrr",
            label: "Starting MRR",
            value: starting,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Break-even immediate churn ≈ 1 - 1/(1+price increase). For ongoing churn, compare the discounted retention of cash flows over the horizon.",
    assumptions: [
      "Models the existing revenue base only (no new customer MRR).",
      "Baseline churn is constant over the horizon.",
      "Immediate churn is a one-time shock; ongoing churn increase applies each month.",
    ],
    faqs: [
      {
        question: "Why does break-even immediate churn depend only on price increase?",
        answer:
          "If churn happens as a one-time shock right after the change, the break-even point is when (1 + increase) × (1 - churn) = 1. Horizon affects payback and compounding effects, but the immediate break-even threshold is purely arithmetic.",
      },
      {
        question: "Should I model downgrades as churn?",
        answer:
          "For revenue impact, downgrades are effectively revenue churn. If downgrades are likely, treat them as revenue loss in immediate churn or as an increase in ongoing churn for the period after the change.",
      },
    ],
  },
  {
    slug: "marginal-roas-calculator",
    title: "Marginal ROAS Calculator",
    description:
      "Estimate diminishing returns and find the profit-maximizing ad spend from a simple response curve.",
    category: "paid-ads",
    guideSlug: "marginal-roas-guide",
    relatedGlossarySlugs: [
      "roas",
      "incrementality",
      "contribution-margin",
      "aov",
      "cpa",
      "diminishing-returns",
      "marginal-roas",
    ],
    seo: {
      intro: [
        "At low spend, ROAS can look great. As you scale, you usually hit diminishing returns: incremental conversions become more expensive and marginal ROAS falls.",
        "This calculator models revenue as a power-law response curve and estimates the spend level that maximizes profit given your margin assumptions.",
      ],
      steps: [
        "Enter current ad spend and revenue (or attributed revenue proxy).",
        "Enter contribution margin to convert revenue into gross profit.",
        "Set a diminishing returns exponent (0 to 1) and optionally a max spend cap.",
        "Review optimal spend, expected profit, and implied marginal ROAS.",
      ],
      benchmarks: [
        "If marginal profit per $1 at the optimum is near 0, you are near the spend ceiling for your current economics.",
        "If optimal spend is far above current spend, validate incrementality before scaling (attribution may overstate).",
        "Curves differ by channel, audience, and creative; fit and optimize per segment when possible.",
      ],
      pitfalls: [
        "Using platform-attributed revenue when incrementality is low (overstates the curve).",
        "Assuming the same curve across channels and audiences (segment curves differ).",
        "Ignoring capacity constraints (inventory, sales capacity, fulfillment).",
      ],
    },
    inputs: [
      {
        key: "currentSpend",
        label: "Current ad spend",
        placeholder: "50000",
        prefix: "$",
        defaultValue: "50000",
        min: 0,
      },
      {
        key: "currentRevenue",
        label: "Current attributed revenue",
        help: "Use a consistent attribution model; treat as a proxy for response curve fitting.",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "200000",
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
      {
        key: "diminishingReturnsExponent",
        label: "Diminishing returns exponent (0 to 1)",
        help: "Lower means stronger diminishing returns. 0.6 to 0.9 is a common range.",
        placeholder: "0.75",
        defaultValue: "0.75",
        min: 0.01,
        step: 0.01,
      },
      {
        key: "maxSpendCap",
        label: "Max spend cap (optional)",
        help: "If you have an operational cap, set it here; 0 means no cap.",
        placeholder: "200000",
        prefix: "$",
        defaultValue: "0",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const spend0 = values.currentSpend;
      const rev0 = values.currentRevenue;
      const margin = values.contributionMarginPercent / 100;
      const b = values.diminishingReturnsExponent;

      if (spend0 <= 0) warnings.push("Current spend must be greater than 0.");
      if (rev0 <= 0) warnings.push("Current revenue must be greater than 0.");
      if (margin <= 0) warnings.push("Contribution margin must be greater than 0% to optimize profit.");
      if (b <= 0 || b >= 1)
        warnings.push("Exponent should be between 0 and 1 (exclusive) for diminishing returns.");

      const currentRoas = safeDivide(rev0, spend0) ?? 0;
      const currentProfit = rev0 * margin - spend0;

      let optimalSpend = 0;
      if (spend0 > 0 && rev0 > 0 && margin > 0 && b > 0 && b < 1) {
        const k = rev0 / Math.pow(spend0, b);
        const numerator = margin * b * k;
        optimalSpend = Math.pow(numerator, 1 / (1 - b));
      }

      if (values.maxSpendCap > 0) optimalSpend = Math.min(optimalSpend, values.maxSpendCap);

      const revenueAt = (spend: number) => {
        if (spend0 <= 0 || rev0 <= 0 || spend <= 0 || b <= 0) return 0;
        const k = rev0 / Math.pow(spend0, b);
        return k * Math.pow(spend, b);
      };

      const revenueOpt = revenueAt(optimalSpend);
      const profitOpt = revenueOpt * margin - optimalSpend;
      const roasOpt = safeDivide(revenueOpt, optimalSpend) ?? 0;

      const marginalRevenuePerDollar =
        spend0 > 0 && rev0 > 0 && optimalSpend > 0 && b > 0
          ? (rev0 / Math.pow(spend0, b)) * b * Math.pow(optimalSpend, b - 1)
          : 0;
      const marginalRoas = marginalRevenuePerDollar;
      const marginalProfitPerDollar = margin * marginalRevenuePerDollar - 1;

      return {
        headline: {
          key: "optimalSpend",
          label: "Profit-maximizing spend",
          value: optimalSpend,
          format: "currency",
          currency: "USD",
          detail: "Estimated optimum under diminishing returns",
        },
        secondary: [
          {
            key: "profitOpt",
            label: "Expected profit at optimal spend",
            value: profitOpt,
            format: "currency",
            currency: "USD",
            detail: "Revenue × margin - spend",
          },
          {
            key: "roasOpt",
            label: "Expected ROAS at optimal spend",
            value: roasOpt,
            format: "multiple",
            maxFractionDigits: 2,
          },
          {
            key: "marginalRoas",
            label: "Marginal ROAS at optimal spend",
            value: marginalRoas,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Incremental revenue per incremental $1 spend",
          },
          {
            key: "marginalProfit",
            label: "Marginal profit per $1 at optimal spend",
            value: marginalProfitPerDollar,
            format: "currency",
            currency: "USD",
            detail: "If ~0, you're near the optimum",
          },
          {
            key: "currentRoas",
            label: "Current ROAS",
            value: currentRoas,
            format: "multiple",
            maxFractionDigits: 2,
          },
          {
            key: "currentProfit",
            label: "Current profit",
            value: currentProfit,
            format: "currency",
            currency: "USD",
          },
        ],
        breakdown: [
          {
            key: "currentSpend",
            label: "Current spend",
            value: spend0,
            format: "currency",
            currency: "USD",
          },
          {
            key: "currentRevenue",
            label: "Current revenue",
            value: rev0,
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
          {
            key: "b",
            label: "Exponent (diminishing returns)",
            value: b,
            format: "number",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Assume revenue = k * spend^b (0<b<1). Profit = margin*revenue - spend. Optimal spend occurs when marginal profit ≈ 0.",
    assumptions: [
      "Uses a simple power-law response curve; real curves vary by channel and saturation.",
      "Current spend/revenue anchor the curve (k).",
      "Ignores fixed costs and long-term LTV effects (use incrementality and LTV when possible).",
    ],
    faqs: [
      {
        question: "What exponent should I use?",
        answer:
          "If you don't know, start with 0.7–0.85 and scenario test. Lower means stronger diminishing returns. The right value varies by channel, creative freshness, audience size, and tracking.",
      },
      {
        question: "How is marginal ROAS different from average ROAS?",
        answer:
          "Average ROAS is total revenue ÷ total spend. Marginal ROAS is incremental revenue from an extra $1 of spend. Scaling decisions should use marginal ROAS (or incremental profit), not average ROAS.",
      },
    ],
  },
  {
    slug: "dcf-valuation-calculator",
    title: "DCF Valuation Calculator",
    description:
      "Estimate enterprise value using a simple DCF: forecast cash flows, discount them, and add a terminal value.",
    category: "finance",
    guideSlug: "dcf-valuation-guide",
    relatedGlossarySlugs: [
      "dcf",
      "cash-flow",
      "discount-rate",
      "npv",
      "terminal-value",
      "wacc",
    ],
    seo: {
      intro: [
        "A DCF (discounted cash flow) values a business by discounting expected future cash flows back to today and adding a terminal value for cash flows beyond the forecast period.",
        "This calculator uses a simple constant growth forecast and either a perpetuity (terminal growth) terminal value.",
      ],
      steps: [
        "Enter current annual free cash flow (FCF).",
        "Set forecast years and annual growth during the forecast period.",
        "Set a discount rate (often WACC as a proxy).",
        "Set terminal growth (must be lower than discount rate).",
      ],
      pitfalls: [
        "Using terminal growth ≥ discount rate (blows up the terminal value).",
        "Using accounting profit instead of cash flow (working capital and capex matter).",
        "Over-weighting terminal value without checking sensitivity.",
      ],
    },
    inputs: [
      {
        key: "annualFcf",
        label: "Current annual free cash flow (FCF)",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
      {
        key: "netDebt",
        label: "Net debt (optional)",
        help: "Debt minus cash; used to estimate equity value.",
        placeholder: "0",
        prefix: "$",
        defaultValue: "0",
      },
      {
        key: "forecastYears",
        label: "Forecast years",
        placeholder: "5",
        defaultValue: "5",
        min: 1,
        step: 1,
      },
      {
        key: "forecastGrowthPercent",
        label: "Forecast growth (annual)",
        placeholder: "15",
        suffix: "%",
        defaultValue: "15",
        min: -100,
        step: 0.1,
      },
      {
        key: "discountRatePercent",
        label: "Discount rate (annual)",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
        step: 0.1,
      },
      {
        key: "terminalGrowthPercent",
        label: "Terminal growth (annual)",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: -50,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const years = Math.max(1, Math.floor(values.forecastYears));
      if (values.forecastYears !== years)
        warnings.push("Forecast years was rounded down to a whole number.");

      const g = values.forecastGrowthPercent / 100;
      const r = values.discountRatePercent / 100;
      const tg = values.terminalGrowthPercent / 100;

      if (values.annualFcf <= 0) warnings.push("FCF should be greater than 0 for valuation.");
      if (r <= 0) warnings.push("Discount rate must be greater than 0%.");
      if (tg >= r) warnings.push("Terminal growth should be less than the discount rate.");

      let pvForecast = 0;
      let fcf = values.annualFcf;
      for (let t = 1; t <= years; t++) {
        fcf = fcf * (1 + g);
        const pv = fcf / Math.pow(1 + r, t);
        pvForecast += pv;
      }

      const fcfTerminal = fcf * (1 + tg);
        const terminalValue =
          tg < r ? fcfTerminal / (r - tg) : 0;
        const pvTerminal = terminalValue / Math.pow(1 + r, years);
        const enterpriseValue = pvForecast + pvTerminal;
        const terminalShare = enterpriseValue > 0 ? pvTerminal / enterpriseValue : 0;
        const equityValue = enterpriseValue - values.netDebt;
        const terminalGrowthGap = r - tg;
        const evToFcf =
          values.annualFcf > 0 ? enterpriseValue / values.annualFcf : null;
        const terminalMultiple =
          fcfTerminal > 0 ? terminalValue / fcfTerminal : null;

        return {
          headline: {
            key: "enterpriseValue",
            label: "Enterprise value (DCF)",
          value: enterpriseValue,
          format: "currency",
          currency: "USD",
          detail: "PV of forecast + PV of terminal value",
        },
        secondary: [
          {
            key: "pvForecast",
            label: "PV of forecast period",
            value: pvForecast,
            format: "currency",
            currency: "USD",
          },
            {
              key: "pvTerminal",
              label: "PV of terminal value",
              value: pvTerminal,
              format: "currency",
              currency: "USD",
            },
            {
              key: "terminalValue",
              label: "Terminal value (undiscounted)",
              value: terminalValue,
              format: "currency",
              currency: "USD",
            },
            {
              key: "equityValue",
              label: "Equity value (EV - net debt)",
              value: equityValue,
              format: "currency",
              currency: "USD",
              detail: "Approximate equity value",
            },
          {
            key: "terminalShare",
            label: "Terminal value share",
            value: terminalShare,
            format: "percent",
            maxFractionDigits: 0,
            detail: "How much of EV comes from terminal",
          },
            {
              key: "terminalGrowthGap",
              label: "Discount minus terminal growth (r - g)",
              value: terminalGrowthGap,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Keep positive; larger gap lowers terminal value",
            },
            {
              key: "fcfTerminal",
              label: `FCF in year ${years} (end of forecast)`,
              value: fcf,
              format: "currency",
              currency: "USD",
            },
            {
              key: "evToFcf",
              label: "EV / current FCF",
              value: evToFcf ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: evToFcf === null ? "FCF is 0" : "Enterprise value multiple",
            },
            {
              key: "terminalMultiple",
              label: "Terminal value / year-end FCF",
              value: terminalMultiple ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: terminalMultiple === null ? "Year-end FCF is 0" : "Terminal multiple",
            },
          ],
        breakdown: [
          {
            key: "annualFcf",
            label: "Current annual FCF",
            value: values.annualFcf,
            format: "currency",
            currency: "USD",
          },
          {
            key: "forecastGrowth",
            label: "Forecast growth",
            value: g,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "discountRate",
            label: "Discount rate",
            value: r,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "terminalGrowth",
            label: "Terminal growth",
            value: tg,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula:
      "EV = Σ(FCF_t / (1+r)^t) + (FCF_(n+1) / (r - g_terminal)) / (1+r)^n",
    assumptions: [
      "FCF grows at a constant rate during the forecast period.",
      "Terminal value uses a perpetuity growth model.",
      "Discount rate is constant and represents risk (e.g., WACC as a proxy).",
    ],
    faqs: [
      {
        question: "Why is terminal value often so large?",
        answer:
          "Because most businesses are assumed to operate beyond the explicit forecast period. If terminal dominates, run sensitivity tables (discount rate, terminal growth) and consider extending the forecast period or using more conservative assumptions.",
      },
      {
        question: "Is enterprise value the same as equity value?",
        answer:
          "No. Enterprise value is value of the business operations. To get equity value you’d adjust for net debt (cash, debt) and other claims. This calculator focuses on EV.",
      },
    ],
  },
  {
    slug: "retention-curve-calculator",
    title: "Retention Curve Calculator",
    description:
      "Model a simple cohort retention curve (logo retention) and translate it into expected revenue and gross profit over time.",
    category: "saas-metrics",
    guideSlug: "retention-curve-guide",
    relatedGlossarySlugs: [
      "retention-rate",
      "logo-churn",
      "customer-lifetime",
      "cohorted-ltv",
      "net-retention",
      "gross-retention",
      "gross-margin",
      "arpa",
      "nrr",
      "grr",
    ],
    seo: {
      intro: [
        "Retention curves show how customer survival changes over time. They are often more informative than a single churn rate because they reveal where drop-offs happen (activation and early lifecycle).",
        "This calculator uses a simple constant monthly churn assumption to generate retention at key checkpoints and estimate expected revenue and gross profit per original customer.",
      ],
      steps: [
        "Enter ARPA and gross margin to translate retained customers into gross profit.",
        "Enter monthly logo churn (constant churn assumption).",
        "Choose a horizon and review retention at 3/6/12/24 months plus expected value.",
      ],
      pitfalls: [
        "Using blended churn across segments (plan/channel) and hiding weak cohorts.",
        "Confusing revenue retention (NRR/GRR) with logo retention (customer count).",
        "Assuming constant churn when churn decays over time (use real cohorts when possible).",
      ],
    },
    inputs: [
      {
        key: "monthlyLogoChurnPercent",
        label: "Monthly logo churn",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0,
        step: 0.1,
      },
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
        key: "months",
        label: "Months to model",
        placeholder: "36",
        defaultValue: "36",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.months));
      if (values.months !== months)
        warnings.push("Months was rounded down to a whole number.");

      const churn = values.monthlyLogoChurnPercent / 100;
      if (churn < 0 || churn >= 1)
        warnings.push("Monthly churn must be between 0% and 99.9%.");

      const retention = 1 - churn;
      const margin = values.grossMarginPercent / 100;
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (margin <= 0) warnings.push("Gross margin must be greater than 0%.");

      const retainedAt = (m: number) => Math.pow(retention, m);

        const r3 = retainedAt(3);
        const r6 = retainedAt(6);
        const r12 = retainedAt(12);
        const r24 = retainedAt(24);
        const rHorizon = retainedAt(months);
  
        let expectedRevenue = 0;
        let expectedGrossProfit = 0;
        let expectedActiveMonths = 0;
        for (let m = 1; m <= months; m++) {
          const expectedActive = retainedAt(m - 1);
          const rev = expectedActive * values.arpaMonthly;
          expectedActiveMonths += expectedActive;
          expectedRevenue += rev;
          expectedGrossProfit += rev * margin;
        }
  
        const lifetimeMonths = churn > 0 ? 1 / churn : null;
        const halfLifeMonths =
          retention > 0 && retention < 1
            ? Math.log(0.5) / Math.log(retention)
            : null;
        const averageRetention = expectedActiveMonths / months;

      return {
        headline: {
          key: "retention12",
          label: "Logo retention after 12 months",
          value: r12,
          format: "percent",
          maxFractionDigits: 1,
          detail: "Constant churn model",
        },
        secondary: [
          {
            key: "retention3",
            label: "Retention after 3 months",
            value: r3,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "retention6",
            label: "Retention after 6 months",
            value: r6,
            format: "percent",
            maxFractionDigits: 1,
          },
            {
              key: "retention24",
              label: "Retention after 24 months",
              value: r24,
              format: "percent",
              maxFractionDigits: 1,
            },
            {
              key: "retentionHorizon",
              label: `Retention after ${months} months`,
              value: rHorizon,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Horizon retention",
            },
            {
              key: "expectedRevenue",
              label: `Expected revenue per original customer (${months} months)`,
              value: expectedRevenue,
              format: "currency",
              currency: "USD",
            },
            {
              key: "expectedGrossProfit",
              label: `Expected gross profit per original customer (${months} months)`,
              value: expectedGrossProfit,
              format: "currency",
              currency: "USD",
            },
            {
              key: "expectedActiveMonths",
              label: `Expected active months (per original customer)`,
              value: expectedActiveMonths,
              format: "months",
              maxFractionDigits: 1,
              detail: "Sum of monthly retention over horizon",
            },
            {
              key: "averageRetention",
              label: "Average retention over horizon",
              value: averageRetention,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Average monthly retention",
            },
            {
              key: "lifetimeMonths",
              label: "Approx. lifetime from churn (months)",
              value: lifetimeMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail: lifetimeMonths === null ? "Churn is 0%" : "1 ÷ monthly churn (rough)",
            },
            {
              key: "halfLifeMonths",
              label: "Retention half-life (months)",
              value: halfLifeMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail: halfLifeMonths === null ? "Churn is 0%" : "Months until 50% retained",
            },
          ],
        breakdown: [
          {
            key: "monthlyChurn",
            label: "Monthly churn",
            value: churn,
            format: "percent",
            maxFractionDigits: 2,
          },
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
            value: margin,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula: "Retention after m months = (1 - monthly churn)^m",
    assumptions: [
      "Uses constant monthly logo churn (simplification).",
      "ARPA and gross margin are constant over the horizon.",
      "Outputs are per original customer/account in the cohort (expected value).",
    ],
    faqs: [
      {
        question: "Why use a retention curve instead of a single churn rate?",
        answer:
          "Retention curves show where churn happens (early vs late). Two products can have the same average churn but very different early drop-off, which affects activation work and payback.",
      },
      {
        question: "How do I make this more realistic?",
        answer:
          "Use observed cohorts segmented by plan/channel and model churn that decays over time. If you have expansion, model revenue retention (NRR/GRR) alongside logo retention.",
      },
    ],
  },
  {
    slug: "target-cpa-ltv-calculator",
    title: "Target CPA from LTV Calculator",
    description:
      "Translate LTV and contribution margin into a target CPA (and break-even CPA) for paid acquisition.",
    category: "paid-ads",
    guideSlug: "target-cpa-guide",
    relatedGlossarySlugs: [
      "cpa",
      "cac",
      "ltv",
      "contribution-margin",
      "payback-period",
      "incrementality",
    ],
    seo: {
      intro: [
        "A 'good' CPA depends on how much value a customer creates. Target CPA connects acquisition cost to unit economics so you can scale profitably.",
        "This calculator computes break-even CPA from LTV and contribution margin, and also a target CPA based on desired profit buffer or payback fraction.",
      ],
      steps: [
        "Enter gross profit LTV (or revenue LTV and margin).",
        "Choose how conservative you want to be (target profit buffer or spend as % of LTV).",
        "Use break-even and target CPA to set bidding/optimization targets.",
      ],
      pitfalls: [
        "Using revenue LTV instead of gross profit LTV (overstates value).",
        "Ignoring cash/payback constraints (long payback can kill runway).",
        "Using platform-attributed LTV without incrementality validation.",
      ],
    },
    inputs: [
      {
        key: "ltvRevenue",
        label: "Revenue LTV (lifetime revenue)",
        help: "If you already have gross profit LTV, set margin to 100%.",
        placeholder: "3000",
        prefix: "$",
        defaultValue: "3000",
        min: 0,
      },
      {
        key: "contributionMarginPercent",
        label: "Contribution margin",
        placeholder: "60",
        suffix: "%",
        defaultValue: "60",
        min: 0,
        step: 0.1,
      },
      {
        key: "targetProfitBufferPercent",
        label: "Target profit buffer (optional)",
        help: "Profit buffer as % of gross profit LTV (e.g., 20% means spend ≤ 80% of gross profit LTV).",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.1,
      },
      {
        key: "maxSpendSharePercent",
        label: "Max spend as % of gross profit LTV (optional)",
        help: "If you prefer a simple rule: set a max share (e.g., 50%). 0 disables.",
        placeholder: "50",
        suffix: "%",
        defaultValue: "0",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const margin = values.contributionMarginPercent / 100;
      if (values.ltvRevenue <= 0) warnings.push("Revenue LTV must be greater than 0.");
      if (margin <= 0) warnings.push("Contribution margin must be greater than 0%.");

      const grossProfitLtv = values.ltvRevenue * margin;
      const breakEvenCpa = grossProfitLtv;

      const buffer = values.targetProfitBufferPercent / 100;
      const targetByBuffer = grossProfitLtv * Math.max(0, 1 - buffer);

      const share = values.maxSpendSharePercent / 100;
      const targetByShare = values.maxSpendSharePercent > 0 ? grossProfitLtv * share : null;

      let targetCpa = targetByBuffer;
      let targetRule = "Profit buffer";
      if (targetByShare !== null) {
        targetCpa = Math.min(targetCpa, targetByShare);
        targetRule = "Most conservative rule (buffer vs spend share)";
      }

      if (values.targetProfitBufferPercent === 0 && values.maxSpendSharePercent === 0) {
        warnings.push("Set a profit buffer or max spend share to define a target CPA. Showing break-even by default.");
        targetCpa = breakEvenCpa;
        targetRule = "Break-even (no target rule set)";
      }

      return {
        headline: {
          key: "targetCpa",
          label: "Target CPA",
          value: targetCpa,
          format: "currency",
          currency: "USD",
          detail: targetRule,
        },
        secondary: [
          {
            key: "breakEvenCpa",
            label: "Break-even CPA (gross profit)",
            value: breakEvenCpa,
            format: "currency",
            currency: "USD",
            detail: "Spend equal to gross profit LTV (profit = 0)",
          },
          {
            key: "grossProfitLtv",
            label: "Gross profit LTV",
            value: grossProfitLtv,
            format: "currency",
            currency: "USD",
            detail: "Revenue LTV × contribution margin",
          },
          {
            key: "targetByBuffer",
            label: "Target CPA from profit buffer",
            value: targetByBuffer,
            format: "currency",
            currency: "USD",
          },
          {
            key: "targetByShare",
            label: "Target CPA from max spend share",
            value: targetByShare ?? 0,
            format: "currency",
            currency: "USD",
            detail: targetByShare === null ? "Disabled" : "Gross profit LTV × spend share",
          },
        ],
        breakdown: [
          {
            key: "ltvRevenue",
            label: "Revenue LTV",
            value: values.ltvRevenue,
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
      "Gross profit LTV = revenue LTV × contribution margin; Break-even CPA = gross profit LTV; Target CPA = break-even × (1 - buffer) or × spend share",
    assumptions: [
      "LTV is measured on a consistent basis with your CPA attribution window.",
      "Contribution margin reflects variable costs (not fixed overhead).",
      "Incrementality may be lower than attribution; validate with experiments when possible.",
    ],
    faqs: [
      {
        question: "Should I use CAC or CPA?",
        answer:
          "CPA is often used at the campaign level (purchase/lead). CAC usually means cost per new paying customer. Use the denominator that matches your funnel stage and label it clearly.",
      },
      {
        question: "Why set a target below break-even?",
        answer:
          "Because forecasts are uncertain and you usually need buffer for returns, fraud, attribution bias, and overhead. A target CPA below break-even reduces the risk of scaling into losses.",
      },
    ],
  },
  {
    slug: "investment-decision-calculator",
    title: "Investment Decision Calculator",
    description:
      "Evaluate an investment using NPV, IRR, discounted payback, and profitability index from simple cash flow assumptions.",
    category: "finance",
    guideSlug: "investment-decision-guide",
    relatedGlossarySlugs: [
      "npv",
      "irr",
      "discount-rate",
      "marr",
      "payback-period",
      "profitability-index",
    ],
    seo: {
      intro: [
        "NPV, IRR, and payback answer different decision questions. A small dashboard view helps you avoid relying on a single metric.",
        "This calculator uses a simple constant annual cash flow stream and computes NPV, IRR (if it exists), discounted payback, and profitability index.",
      ],
      steps: [
        "Enter the initial investment (upfront cash outflow).",
        "Enter annual cash flow and number of years to evaluate.",
        "Enter discount rate (MARR / required return).",
        "Review NPV, IRR, payback, and PI together to make a balanced decision.",
      ],
      pitfalls: [
        "Using IRR alone (can mislead with non-standard cash flows).",
        "Using simple payback without discounting (ignores time value).",
        "Comparing projects of different scale without normalizing (use PI and NPV).",
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
        key: "annualCashFlow",
        label: "Annual cash flow",
        placeholder: "30000",
        prefix: "$",
        defaultValue: "30000",
      },
      {
        key: "years",
        label: "Years",
        placeholder: "10",
        defaultValue: "10",
        min: 1,
        step: 1,
      },
      {
        key: "discountRatePercent",
        label: "Discount rate (MARR)",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const years = Math.max(1, Math.floor(values.years));
      if (values.years !== years) warnings.push("Years was rounded down to a whole number.");

      const r = values.discountRatePercent / 100;
      if (values.annualCashFlow <= 0) warnings.push("Annual cash flow must be greater than 0.");

      const npvAt = (rate: number) => {
        let sum = -values.initialInvestment;
        for (let t = 1; t <= years; t++) {
          sum += values.annualCashFlow / Math.pow(1 + rate, t);
        }
        return sum;
      };

      const npv = npvAt(r);

      // IRR via bisection for standard cash flows (one sign change).
      let irr: number | null = null;
      let lo = -0.9999;
      let hi = 10;
      let fLo = npvAt(lo);
      let fHi = npvAt(hi);
      if (Number.isFinite(fLo) && Number.isFinite(fHi) && fLo * fHi < 0) {
        for (let i = 0; i < 80; i++) {
          const mid = (lo + hi) / 2;
          const fMid = npvAt(mid);
          if (fMid === 0) {
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

      // Discounted payback
      let cumulative = 0;
      let discountedPaybackYears: number | null = null;
      for (let year = 1; year <= years; year++) {
        const pv = values.annualCashFlow / Math.pow(1 + r, year);
        const next = cumulative + pv;
        if (next >= values.initialInvestment && pv > 0) {
          const remaining = values.initialInvestment - cumulative;
          discountedPaybackYears = (year - 1) + remaining / pv;
          break;
        }
        cumulative = next;
      }

      if (discountedPaybackYears === null) {
        warnings.push("Discounted payback not reached within the chosen horizon.");
      }

      const pvInflow = npv + values.initialInvestment;
      const pi = values.initialInvestment > 0 ? pvInflow / values.initialInvestment : null;

      return {
        headline: {
          key: "npv",
          label: `NPV @ ${values.discountRatePercent}%`,
          value: npv,
          format: "currency",
          currency: "USD",
          detail: "Present value of inflows - investment",
        },
        secondary: [
          {
            key: "irr",
            label: "IRR (if applicable)",
            value: irr ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: irr === null ? "Not found / not unique" : "Rate where NPV = 0",
          },
          {
            key: "discountedPayback",
            label: "Discounted payback period",
            value: (discountedPaybackYears ?? 0) * 12,
            format: "months",
            maxFractionDigits: 1,
          },
          {
            key: "pi",
            label: "Profitability index (PI)",
            value: pi ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: pi === null ? "Investment is 0" : "PV inflows ÷ investment",
          },
        ],
        breakdown: [
          {
            key: "initialInvestment",
            label: "Initial investment",
            value: values.initialInvestment,
            format: "currency",
            currency: "USD",
          },
          {
            key: "annualCashFlow",
            label: "Annual cash flow",
            value: values.annualCashFlow,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "NPV = -I + Σ(CF_t/(1+r)^t); IRR solves NPV(r)=0; PI = PV(inflows)/I; Discounted payback is when cumulative PV ≥ I",
    assumptions: [
      "Cash flows are annual and occur at the end of each year (except the upfront investment at t=0).",
      "Uses a constant annual cash flow for simplicity.",
      "IRR is approximated via bisection and may be undefined for some patterns.",
    ],
    faqs: [
      {
        question: "Which metric should I trust most?",
        answer:
          "NPV is usually the best decision metric at a chosen required return because it measures value created in dollars. Use IRR for intuition and comparison, and use payback/PI as constraints or secondary lenses.",
      },
      {
        question: "What does profitability index mean?",
        answer:
          "PI normalizes value by investment: PI > 1 means positive NPV. It’s useful when capital is constrained and you want value per dollar invested.",
      },
    ],
  },
  {
    slug: "profitability-index-calculator",
    title: "Profitability Index Calculator",
    description:
      "Calculate profitability index (PI) from discounted cash flows and estimate the max investment for a target PI.",
    category: "finance",
    guideSlug: "investment-decision-guide",
    relatedGlossarySlugs: ["profitability-index", "npv", "discount-rate", "marr"],
    seo: {
      intro: [
        "Profitability index (PI) is value per dollar invested: PV of cash inflows divided by initial investment.",
        "PI is helpful when capital is constrained because it lets you rank projects by value efficiency.",
      ],
      steps: [
        "Enter the initial investment and annual cash flow.",
        "Enter years and your required return (discount rate).",
        "Review PV inflows, PI, and the implied NPV.",
        "Optional: set a target PI to estimate max acceptable investment.",
      ],
      pitfalls: [
        "Ignoring scale: a smaller project can have higher PI but lower total value.",
        "Using a discount rate that does not reflect project risk.",
        "Mixing real vs nominal cash flows and rates.",
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
        key: "annualCashFlow",
        label: "Annual cash flow",
        placeholder: "30000",
        prefix: "$",
        defaultValue: "30000",
        min: 0,
      },
      {
        key: "years",
        label: "Years",
        placeholder: "10",
        defaultValue: "10",
        min: 1,
        step: 1,
      },
      {
        key: "discountRatePercent",
        label: "Discount rate (MARR)",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
        step: 0.1,
      },
      {
        key: "targetPi",
        label: "Target PI (optional)",
        placeholder: "1.2",
        defaultValue: "1.2",
        min: 0,
        step: 0.01,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const years = Math.max(1, Math.floor(values.years));
      if (values.years !== years) warnings.push("Years was rounded down to a whole number.");
      if (values.annualCashFlow <= 0) warnings.push("Annual cash flow must be greater than 0.");
      if (values.initialInvestment <= 0)
        warnings.push("Initial investment must be greater than 0 to compute PI.");

      const r = values.discountRatePercent / 100;
      const pvInflows = (() => {
        let sum = 0;
        for (let t = 1; t <= years; t++) {
          sum += values.annualCashFlow / Math.pow(1 + r, t);
        }
        return sum;
      })();
      const pi =
        values.initialInvestment > 0 ? pvInflows / values.initialInvestment : null;
      const npv = pvInflows - values.initialInvestment;
      const maxInvestment =
        values.targetPi > 0 ? pvInflows / values.targetPi : null;

      return {
        headline: {
          key: "profitabilityIndex",
          label: "Profitability index (PI)",
          value: pi ?? 0,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "PV inflows ÷ initial investment",
        },
        secondary: [
          {
            key: "pvInflows",
            label: "PV of inflows",
            value: pvInflows,
            format: "currency",
            currency: "USD",
          },
          {
            key: "npv",
            label: "NPV (PV inflows - investment)",
            value: npv,
            format: "currency",
            currency: "USD",
          },
          {
            key: "maxInvestment",
            label: "Max investment at target PI",
            value: maxInvestment ?? 0,
            format: "currency",
            currency: "USD",
            detail: values.targetPi > 0 ? "PV inflows ÷ target PI" : "Target PI is 0",
          },
        ],
        breakdown: [
          {
            key: "initialInvestment",
            label: "Initial investment",
            value: values.initialInvestment,
            format: "currency",
            currency: "USD",
          },
          {
            key: "annualCashFlow",
            label: "Annual cash flow",
            value: values.annualCashFlow,
            format: "currency",
            currency: "USD",
          },
          {
            key: "discountRate",
            label: "Discount rate",
            value: r,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula: "PI = PV(inflows) ÷ initial investment; NPV = PV(inflows) - investment",
    assumptions: [
      "Cash flows are annual and occur at the end of each year.",
      "Uses a constant annual cash flow for simplicity.",
      "Discount rate reflects required return for the project.",
    ],
    faqs: [
      {
        question: "Is PI better than NPV?",
        answer:
          "PI is a ratio, so it helps rank projects when capital is constrained. NPV is still the best measure of total value created.",
      },
      {
        question: "What PI should I target?",
        answer:
          "PI > 1 means positive NPV. Higher targets (e.g., 1.1 to 1.3) add buffer for uncertainty and risk.",
      },
    ],
  },
  {
    slug: "wacc-calculator",
    title: "WACC Calculator",
    description:
      "Calculate WACC (Weighted Average Cost of Capital) from capital structure, cost of equity, cost of debt, and tax rate.",
    category: "finance",
    guideSlug: "wacc-guide",
    relatedGlossarySlugs: [
      "wacc",
      "discount-rate",
      "cost-of-equity",
      "cost-of-debt",
      "terminal-value",
    ],
    seo: {
      intro: [
        "WACC is a common discount rate proxy for DCF valuation. It blends the required return of equity holders and debt holders, adjusting debt for the tax shield.",
        "This calculator computes WACC and the after-tax cost of debt from your inputs (and normalizes weights if they don't sum to 100%).",
      ],
      steps: [
        "Enter equity and debt weights (or percentages).",
        "Enter cost of equity, cost of debt, and corporate tax rate.",
        "Use WACC as a discount rate input for a DCF (with sensitivity analysis).",
      ],
      pitfalls: [
        "Using WACC for projects with different risk than the overall business.",
        "Mixing market-value weights with book-value costs (inconsistent inputs).",
        "Treating WACC as precise; it’s an estimate that should be scenario tested.",
      ],
    },
    inputs: [
      {
        key: "equityWeightPercent",
        label: "Equity weight",
        placeholder: "70",
        suffix: "%",
        defaultValue: "70",
        min: 0,
        step: 0.1,
      },
      {
        key: "debtWeightPercent",
        label: "Debt weight",
        placeholder: "30",
        suffix: "%",
        defaultValue: "30",
        min: 0,
        step: 0.1,
      },
      {
        key: "costOfEquityPercent",
        label: "Cost of equity",
        placeholder: "15",
        suffix: "%",
        defaultValue: "15",
        min: 0,
        step: 0.1,
      },
      {
        key: "costOfDebtPercent",
        label: "Cost of debt",
        placeholder: "7",
        suffix: "%",
        defaultValue: "7",
        min: 0,
        step: 0.1,
      },
      {
        key: "taxRatePercent",
        label: "Corporate tax rate",
        placeholder: "25",
        suffix: "%",
        defaultValue: "25",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const weRaw = values.equityWeightPercent / 100;
      const wdRaw = values.debtWeightPercent / 100;
      const sum = weRaw + wdRaw;

      let we = weRaw;
      let wd = wdRaw;
      if (sum <= 0) {
        warnings.push("Equity weight + debt weight must be greater than 0.");
        we = 1;
        wd = 0;
      } else if (Math.abs(sum - 1) > 1e-6) {
        warnings.push("Weights were normalized to sum to 100%.");
        we = weRaw / sum;
        wd = wdRaw / sum;
      }

      const ke = values.costOfEquityPercent / 100;
      const kd = values.costOfDebtPercent / 100;
      const tax = values.taxRatePercent / 100;

        const afterTaxDebt = kd * (1 - tax);
        const wacc = we * ke + wd * afterTaxDebt;
        const spread = ke - afterTaxDebt;
        const taxShield = kd * tax;
        const equityContribution = we * ke;
        const debtContribution = wd * afterTaxDebt;

      return {
        headline: {
          key: "wacc",
          label: "WACC",
          value: wacc,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Weighted cost of capital (after-tax debt)",
        },
        secondary: [
          {
            key: "afterTaxDebt",
            label: "After-tax cost of debt",
            value: afterTaxDebt,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Cost of debt × (1 - tax rate)",
          },
            {
              key: "equityDebtSpread",
              label: "Equity vs debt spread",
              value: spread,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Cost of equity - after-tax debt",
            },
            {
              key: "equityContribution",
              label: "Equity contribution to WACC",
              value: equityContribution,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Equity weight x cost of equity",
            },
            {
              key: "debtContribution",
              label: "Debt contribution to WACC",
              value: debtContribution,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Debt weight x after-tax cost",
            },
          {
            key: "taxShield",
            label: "Debt tax shield (rate)",
            value: taxShield,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Cost of debt × tax rate",
          },
          {
            key: "equityWeight",
            label: "Equity weight (normalized)",
            value: we,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "debtWeight",
            label: "Debt weight (normalized)",
            value: wd,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        breakdown: [
          {
            key: "costOfEquity",
            label: "Cost of equity",
            value: ke,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "costOfDebt",
            label: "Cost of debt",
            value: kd,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "taxRate",
            label: "Tax rate",
            value: tax,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula: "WACC = w_e×k_e + w_d×k_d×(1 - tax rate)",
    assumptions: [
      "Debt benefit is modeled via the interest tax shield (after-tax cost of debt).",
      "Weights should ideally reflect market value capital structure.",
      "WACC is an estimate; use sensitivity analysis.",
    ],
    faqs: [
      {
        question: "Should I use WACC as my DCF discount rate?",
        answer:
          "Often yes as a starting point for valuing the overall firm. For projects with different risk than the core business, use a risk-adjusted discount rate instead of the company WACC.",
      },
      {
        question: "Why do we adjust debt for taxes?",
        answer:
          "Interest expense is often tax deductible, so debt financing has a tax shield. Using after-tax cost of debt reflects that benefit in WACC.",
      },
    ],
  },
  {
    slug: "mer-calculator",
    title: "MER Calculator",
    description:
      "Calculate MER (Marketing Efficiency Ratio / blended ROAS) and estimate break-even and target MER from margin assumptions.",
    category: "paid-ads",
    guideSlug: "mer-guide",
    relatedGlossarySlugs: [
      "mer",
      "blended-roas",
      "contribution-margin",
      "gross-margin",
      "roas",
      "incrementality",
    ],
    seo: {
      intro: [
        "MER (marketing efficiency ratio) is total revenue divided by total marketing spend over the same period. It's a useful top-down health metric that reduces channel attribution noise.",
        "To make MER decision-useful, translate it into profit using contribution margin and compute break-even and target MER thresholds.",
      ],
      steps: [
        "Enter total revenue and total marketing spend for the same window.",
        "Enter contribution margin to estimate gross profit after variable costs.",
        "Optionally set a profit buffer to compute a target MER (more conservative than break-even).",
      ],
      benchmarks: [
        "Break-even MER is 1 / contribution margin (a floor, not a scaling target).",
        "If profit after spend is negative at the blended level, scaling spend typically scales losses unless mix or margin improves.",
        "Use MER for top-down health and use channel metrics (ROAS, marginal ROAS) for allocation decisions.",
      ],
      pitfalls: [
        "Using MER alone to optimize channel budgets (it hides what's working).",
        "Mixing time windows (weekly spend with monthly revenue).",
        "Ignoring promos/seasonality and concluding performance changed structurally.",
      ],
    },
    inputs: [
      {
        key: "totalRevenue",
        label: "Total revenue (same period)",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "totalMarketingSpend",
        label: "Total marketing spend (same period)",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
        min: 0,
      },
      {
        key: "targetMer",
        label: "Target MER (optional)",
        help: "Used to estimate max spend at your revenue level.",
        placeholder: "3",
        defaultValue: "3",
        min: 0,
        step: 0.01,
      },
      {
        key: "contributionMarginPercent",
        label: "Contribution margin (optional)",
        help: "Used to estimate profit and break-even/target MER.",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
        {
          key: "profitBufferPercent",
          label: "Profit buffer (optional)",
          help: "Percent of gross profit to keep as profit (target MER increases as buffer increases).",
          placeholder: "20",
          suffix: "%",
          defaultValue: "20",
          min: 0,
          step: 0.1,
        },
        {
          key: "targetProfit",
          label: "Target profit (optional)",
          help: "Used to estimate required revenue for a profit target.",
          placeholder: "50000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.totalMarketingSpend <= 0)
          warnings.push("Marketing spend must be greater than 0.");

      const mer = safeDivide(values.totalRevenue, values.totalMarketingSpend) ?? 0;
      if (values.targetMer < 0) warnings.push("Target MER must be 0 or greater.");
      const maxSpendAtTargetMer =
        values.targetMer > 0 ? values.totalRevenue / values.targetMer : null;

      const margin = values.contributionMarginPercent / 100;
      const grossProfit = values.totalRevenue * margin;
      const profitAfterSpend = grossProfit - values.totalMarketingSpend;

        const breakEvenMer = margin > 0 ? 1 / margin : null;
        const buffer = values.profitBufferPercent / 100;
        const targetMer = margin > 0 ? 1 / (margin * Math.max(0.0001, 1 - buffer)) : null;
        const requiredRevenueForTargetProfit =
          margin > 0 ? (values.targetProfit + values.totalMarketingSpend) / margin : null;
        const requiredMerForTargetProfit =
          requiredRevenueForTargetProfit && values.totalMarketingSpend > 0
            ? requiredRevenueForTargetProfit / values.totalMarketingSpend
            : null;

      if (margin <= 0) {
        warnings.push("Enter a contribution margin above 0% to compute profit and MER thresholds.");
      }

      return {
        headline: {
          key: "mer",
          label: "MER (blended ROAS)",
          value: mer,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "Total revenue ÷ total marketing spend",
        },
        secondary: [
          {
            key: "profitAfterSpend",
            label: "Estimated profit after marketing spend",
            value: profitAfterSpend,
            format: "currency",
            currency: "USD",
            detail: "Revenue × margin - marketing spend",
          },
          {
            key: "grossProfit",
            label: "Gross profit (from margin)",
            value: grossProfit,
            format: "currency",
            currency: "USD",
          },
          {
            key: "breakEvenMer",
            label: "Break-even MER",
            value: breakEvenMer ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: breakEvenMer === null ? "Margin is 0%" : "1 ÷ margin",
          },
          {
            key: "targetMer",
            label: "Target MER (with profit buffer)",
            value: targetMer ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: targetMer === null ? "Margin is 0%" : "1 ÷ (margin × (1 - buffer))",
          },
            {
              key: "maxSpendAtTargetMer",
              label: "Max spend at target MER",
              value: maxSpendAtTargetMer ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.targetMer > 0 ? "Revenue ÷ target MER" : "Target MER is 0",
            },
            {
              key: "requiredRevenueForTargetProfit",
              label: "Required revenue for target profit",
              value: requiredRevenueForTargetProfit ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredRevenueForTargetProfit === null
                  ? "Add contribution margin"
                  : "(Target profit + spend) / margin",
            },
            {
              key: "requiredMerForTargetProfit",
              label: "Required MER for target profit",
              value: requiredMerForTargetProfit ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail:
                requiredMerForTargetProfit === null
                  ? "Add target profit and margin"
                  : "Required revenue / spend",
            },
          ],
        breakdown: [
          {
            key: "totalRevenue",
            label: "Total revenue",
            value: values.totalRevenue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "totalMarketingSpend",
            label: "Total marketing spend",
            value: values.totalMarketingSpend,
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
      "MER = revenue ÷ marketing spend; Profit ≈ revenue×margin - spend; Break-even MER = 1 ÷ margin",
    assumptions: [
      "Uses contribution margin as a simplified proxy for gross profit after variable costs.",
      "Revenue and spend are measured over the same period and on the same attribution basis.",
      "MER is top-down; use channel-level metrics for optimization.",
    ],
    faqs: [
      {
        question: "Is MER the same as ROAS?",
        answer:
          "It’s a blended version. ROAS is often channel/campaign-level attributed revenue ÷ spend. MER uses total revenue ÷ total marketing spend, which reduces attribution noise but hides what’s driving performance.",
      },
      {
        question: "How do I pick a profit buffer?",
        answer:
          "Start with 10–30% of gross profit as buffer for uncertainty, overhead, refunds, and measurement error. More volatility and longer payback generally require a larger buffer.",
      },
    ],
  },
  {
    slug: "two-stage-retention-curve-calculator",
    title: "Two-stage Retention Curve Calculator",
    description:
      "Model a retention curve with different churn rates for early months vs steady-state, and estimate expected value over time.",
    category: "saas-metrics",
    guideSlug: "two-stage-retention-guide",
    relatedGlossarySlugs: [
      "retention-rate",
      "logo-churn",
      "activation-rate",
      "customer-lifetime",
      "cohorted-ltv",
      "arpa",
      "gross-margin",
    ],
    seo: {
      intro: [
        "Many products have high early churn (activation/onboarding) and lower steady-state churn later. A two-stage model can match reality better than constant churn.",
        "This calculator builds a simple retention curve with separate early and steady-state churn rates and estimates expected revenue and gross profit per original customer.",
      ],
      steps: [
        "Set an early churn rate and how many months it applies (e.g., months 1–3).",
        "Set a steady-state churn rate for later months.",
        "Enter ARPA and gross margin to convert retention into expected value.",
      ],
      pitfalls: [
        "Using churn rates from blended segments (plan/channel).",
        "Treating this as a substitute for real cohort curves; use it for planning and sensitivity.",
        "Ignoring expansion (revenue retention) when it’s a major driver of value.",
      ],
    },
    inputs: [
      {
        key: "earlyMonthlyChurnPercent",
        label: "Early monthly churn",
        placeholder: "6",
        suffix: "%",
        defaultValue: "6",
        min: 0,
        step: 0.1,
      },
      {
        key: "earlyMonths",
        label: "Early phase months",
        placeholder: "3",
        defaultValue: "3",
        min: 1,
        step: 1,
      },
      {
        key: "steadyMonthlyChurnPercent",
        label: "Steady-state monthly churn",
        placeholder: "1",
        suffix: "%",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
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
        key: "months",
        label: "Months to model",
        placeholder: "36",
        defaultValue: "36",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const horizon = Math.max(1, Math.floor(values.months));
      const earlyMonths = Math.max(1, Math.floor(values.earlyMonths));
      if (values.months !== horizon)
        warnings.push("Months was rounded down to a whole number.");
      if (values.earlyMonths !== earlyMonths)
        warnings.push("Early phase months was rounded down to a whole number.");

      const churnEarly = values.earlyMonthlyChurnPercent / 100;
      const churnSteady = values.steadyMonthlyChurnPercent / 100;
      if (churnEarly < 0 || churnEarly >= 1)
        warnings.push("Early churn must be between 0% and 99.9%.");
      if (churnSteady < 0 || churnSteady >= 1)
        warnings.push("Steady churn must be between 0% and 99.9%.");

      const margin = values.grossMarginPercent / 100;
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (margin <= 0) warnings.push("Gross margin must be greater than 0%.");

      const retentionAt = (m: number) => {
        const early = Math.min(m, earlyMonths);
        const late = Math.max(0, m - earlyMonths);
        return (
          Math.pow(1 - churnEarly, early) * Math.pow(1 - churnSteady, late)
        );
      };

        const r3 = retentionAt(3);
        const r6 = retentionAt(6);
        const r12 = retentionAt(12);
        const r24 = retentionAt(24);
        const rHorizon = retentionAt(horizon);
  
        let expectedRevenue = 0;
        let expectedGrossProfit = 0;
        let expectedActiveMonths = 0;
        for (let m = 1; m <= horizon; m++) {
          const expectedActive = retentionAt(m - 1);
          const rev = expectedActive * values.arpaMonthly;
          expectedActiveMonths += expectedActive;
          expectedRevenue += rev;
          expectedGrossProfit += rev * margin;
        }
  
        const retentionAfterEarly = retentionAt(earlyMonths);
        const averageRetention = expectedActiveMonths / horizon;
        let halfLifeMonths: number | null = null;
        for (let m = 1; m <= horizon; m++) {
          if (retentionAt(m) <= 0.5) {
            halfLifeMonths = m;
            break;
          }
        }

      return {
        headline: {
          key: "retention12",
          label: "Logo retention after 12 months",
          value: r12,
          format: "percent",
          maxFractionDigits: 1,
          detail: "Two-stage churn model",
        },
        secondary: [
          {
            key: "retention3",
            label: "Retention after 3 months",
            value: r3,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "retention6",
            label: "Retention after 6 months",
            value: r6,
            format: "percent",
            maxFractionDigits: 1,
          },
            {
              key: "retention24",
              label: "Retention after 24 months",
              value: r24,
              format: "percent",
              maxFractionDigits: 1,
            },
            {
              key: "retentionHorizon",
              label: `Retention after ${horizon} months`,
              value: rHorizon,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Horizon retention",
            },
            {
              key: "retentionAfterEarly",
              label: `Retention after early phase (month ${earlyMonths})`,
              value: retentionAfterEarly,
              format: "percent",
              maxFractionDigits: 1,
            },
            {
              key: "expectedRevenue",
              label: `Expected revenue per original customer (${horizon} months)`,
              value: expectedRevenue,
              format: "currency",
              currency: "USD",
            },
            {
              key: "expectedGrossProfit",
              label: `Expected gross profit per original customer (${horizon} months)`,
              value: expectedGrossProfit,
              format: "currency",
              currency: "USD",
            },
            {
              key: "expectedActiveMonths",
              label: "Expected active months (per original customer)",
              value: expectedActiveMonths,
              format: "months",
              maxFractionDigits: 1,
              detail: "Sum of monthly retention over horizon",
            },
            {
              key: "averageRetention",
              label: "Average retention over horizon",
              value: averageRetention,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Average monthly retention",
            },
            {
              key: "halfLifeMonths",
              label: "Retention half-life (months)",
              value: halfLifeMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail: halfLifeMonths === null ? "Not reached in horizon" : "Months until 50% retained",
            },
          ],
        breakdown: [
          {
            key: "churnEarly",
            label: "Early churn",
            value: churnEarly,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "earlyMonths",
            label: "Early phase months",
            value: earlyMonths,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "churnSteady",
            label: "Steady-state churn",
            value: churnSteady,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Retention(m) = (1 - churn_early)^(min(m, earlyMonths)) × (1 - churn_steady)^(max(0, m - earlyMonths))",
    assumptions: [
      "Logo churn is modeled in two phases (early vs steady-state).",
      "ARPA and gross margin are constant over the horizon.",
      "Outputs are per original customer/account (expected value).",
    ],
    faqs: [
      {
        question: "When should I use two-stage churn?",
        answer:
          "When you observe a clear activation/onboarding drop early and much lower churn later. Two-stage models let you stress-test the impact of improving early retention vs improving steady-state retention.",
      },
      {
        question: "Does this replace cohort analysis?",
        answer:
          "No. It’s a planning shortcut. Real cohort curves (by segment) are the gold standard for understanding retention dynamics and forecasting LTV.",
      },
    ],
  },
  {
    slug: "revenue-retention-curve-calculator",
    title: "Revenue Retention Curve Calculator",
    description:
      "Model GRR and NRR over time from monthly expansion, contraction, and churn assumptions (existing cohort only).",
    category: "saas-metrics",
    guideSlug: "revenue-retention-curve-guide",
    relatedGlossarySlugs: [
      "nrr",
      "grr",
      "net-retention",
      "gross-retention",
      "churned-mrr",
      "expansion-mrr",
      "contraction-mrr",
      "revenue-churn",
    ],
    seo: {
      intro: [
        "Revenue retention curves show how dollars retained change over time. They’re more actionable than a single NRR/GRR snapshot because they reveal compounding effects.",
        "This calculator models a simple monthly retention process for an existing cohort: GRR excludes expansion; NRR includes expansion and contraction.",
      ],
      steps: [
        "Enter starting MRR for a cohort (existing base).",
        "Set monthly expansion, contraction, and churn rates.",
        "Choose a horizon and review NRR/GRR at key checkpoints and ending cohort MRR.",
      ],
      pitfalls: [
        "Mixing time windows (annual NRR used as monthly rates).",
        "Using blended rates across segments and hiding weak cohorts.",
        "Confusing logo churn with revenue churn (different denominators).",
      ],
    },
    inputs: [
      {
        key: "startingMrr",
        label: "Starting MRR (cohort)",
        placeholder: "100000",
        prefix: "$",
        defaultValue: "100000",
        min: 0,
      },
      {
        key: "monthlyExpansionPercent",
        label: "Monthly expansion rate",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyContractionPercent",
        label: "Monthly contraction rate",
        placeholder: "0.5",
        suffix: "%",
        defaultValue: "0.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyChurnPercent",
        label: "Monthly churn rate (revenue)",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "months",
        label: "Months to model",
        placeholder: "24",
        defaultValue: "24",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const months = Math.max(1, Math.floor(values.months));
      if (values.months !== months)
        warnings.push("Months was rounded down to a whole number.");

      const e = values.monthlyExpansionPercent / 100;
      const c = values.monthlyContractionPercent / 100;
      const ch = values.monthlyChurnPercent / 100;
      if (values.startingMrr <= 0) warnings.push("Starting MRR must be greater than 0.");
      if (e < 0 || e >= 1) warnings.push("Expansion rate must be between 0% and 99.9%.");
      if (c < 0 || c >= 1) warnings.push("Contraction rate must be between 0% and 99.9%.");
      if (ch < 0 || ch >= 1) warnings.push("Churn rate must be between 0% and 99.9%.");

      const starting = Math.max(0, values.startingMrr);

      let nrrMrr = starting;
      let grrMrr = starting;
      let sumNrr = 0;
      let sumGrr = 0;

      const nrrMultiplier = 1 + e - c - ch;
      const grrMultiplier = 1 - c - ch;
      if (nrrMultiplier < 0) warnings.push("NRR multiplier is negative; NRR is floored at $0.");
      if (grrMultiplier < 0) warnings.push("GRR multiplier is negative; GRR is floored at $0.");

      const checkpoints = new Set([3, 6, 12, 24, months]);
      const checkpointNrr: Record<number, number> = {};
      const checkpointGrr: Record<number, number> = {};

      for (let m = 1; m <= months; m++) {
        sumNrr += nrrMrr;
        sumGrr += grrMrr;

        nrrMrr = Math.max(0, nrrMrr * nrrMultiplier);
        grrMrr = Math.max(0, grrMrr * grrMultiplier);

        if (checkpoints.has(m)) {
          checkpointNrr[m] = starting > 0 ? nrrMrr / starting : 0;
          checkpointGrr[m] = starting > 0 ? grrMrr / starting : 0;
        }
      }

        const nrrAt = checkpointNrr[months] ?? (starting > 0 ? nrrMrr / starting : 0);
        const grrAt = checkpointGrr[months] ?? (starting > 0 ? grrMrr / starting : 0);
        const averageNrr =
          starting > 0 ? sumNrr / (starting * months) : null;
        const averageGrr =
          starting > 0 ? sumGrr / (starting * months) : null;

      return {
        headline: {
          key: "nrr",
          label: `NRR after ${months} months`,
          value: nrrAt,
          format: "percent",
          maxFractionDigits: 1,
          detail: "Existing cohort dollars including expansion",
        },
        secondary: [
          {
            key: "grr",
            label: `GRR after ${months} months`,
            value: grrAt,
            format: "percent",
            maxFractionDigits: 1,
            detail: "Existing cohort dollars excluding expansion",
          },
          {
            key: "endingNrrMrr",
            label: `Ending cohort MRR (NRR, month ${months})`,
            value: nrrMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "endingGrrMrr",
            label: `Ending cohort MRR (GRR, month ${months})`,
            value: grrMrr,
            format: "currency",
            currency: "USD",
          },
          {
            key: "nrr12",
            label: "NRR after 12 months",
            value: checkpointNrr[12] ?? 0,
            format: "percent",
            maxFractionDigits: 1,
            detail: checkpointNrr[12] === undefined ? "Horizon < 12 months" : undefined,
          },
          {
            key: "grr12",
            label: "GRR after 12 months",
            value: checkpointGrr[12] ?? 0,
            format: "percent",
            maxFractionDigits: 1,
            detail: checkpointGrr[12] === undefined ? "Horizon < 12 months" : undefined,
          },
          {
            key: "sumNrr",
            label: `Total revenue retained (NRR) over ${months} months`,
            value: sumNrr,
            format: "currency",
            currency: "USD",
            detail: "Sum of monthly cohort MRR (approx)",
          },
            {
              key: "sumGrr",
              label: `Total revenue retained (GRR) over ${months} months`,
              value: sumGrr,
              format: "currency",
              currency: "USD",
            },
            {
              key: "averageNrr",
              label: "Average NRR over horizon",
              value: averageNrr ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: averageNrr === null ? "Starting MRR is 0" : "Average monthly NRR",
            },
            {
              key: "averageGrr",
              label: "Average GRR over horizon",
              value: averageGrr ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: averageGrr === null ? "Starting MRR is 0" : "Average monthly GRR",
            },
            {
              key: "nrrMultiplier",
              label: "Monthly NRR multiplier",
              value: nrrMultiplier,
              format: "percent",
              maxFractionDigits: 2,
              detail: "1 + expansion - contraction - churn",
            },
            {
              key: "grrMultiplier",
              label: "Monthly GRR multiplier",
              value: grrMultiplier,
              format: "percent",
              maxFractionDigits: 2,
              detail: "1 - contraction - churn",
            },
          ],
        breakdown: [
          {
            key: "startingMrr",
            label: "Starting MRR",
            value: starting,
            format: "currency",
            currency: "USD",
          },
          {
            key: "expansion",
            label: "Expansion rate",
            value: e,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "contraction",
            label: "Contraction rate",
            value: c,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "churn",
            label: "Churn rate",
            value: ch,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula: "NRR_month = 1 + expansion - contraction - churn; GRR_month = 1 - contraction - churn (compounded monthly)",
    assumptions: [
      "Rates are constant and applied to the current cohort MRR each month (simplification).",
      "Excludes new customer MRR; this is an existing-cohort retention model.",
      "Monthly sum approximates retained revenue (ignores within-month timing).",
    ],
    faqs: [
      {
        question: "Why can NRR be above 100% while GRR is below 100%?",
        answer:
          "GRR excludes expansion, so churn and downgrades drive it down. NRR includes expansion, so upgrades can offset (or exceed) churn and contraction, pushing NRR above 100%.",
      },
      {
        question: "How do I make this more accurate?",
        answer:
          "Use real cohort curves segmented by plan/channel and model expansion and churn as time-varying (often higher early and lower later). This tool is a planning shortcut and scenario tester.",
      },
    ],
  },
  {
    slug: "max-cpc-calculator",
    title: "Max CPC Calculator",
    description:
      "Compute break-even and target CPC (and optional CPM) from CVR, AOV, and contribution margin assumptions.",
    category: "paid-ads",
    guideSlug: "max-cpc-guide",
    relatedGlossarySlugs: [
      "cpc",
      "cpa",
      "cvr",
      "aov",
      "contribution-margin",
      "break-even-roas",
    ],
    seo: {
      intro: [
        "Max CPC answers: how much can you pay per click and still break even (or hit a profit target) given your conversion rate and order economics?",
        "This calculator translates AOV and contribution margin into break-even CPA, then converts it into max CPC using CVR. If you also enter CTR, it estimates max CPM.",
      ],
      steps: [
        "Enter AOV, contribution margin, and conversion rate (CVR).",
        "Add a profit buffer to compute a target CPC (more conservative than break-even).",
        "Optionally enter CTR to translate max CPC into max CPM.",
      ],
      benchmarks: [
        "If CVR is uncertain, set a larger buffer or use a conservative CVR (pessimistic scenario).",
        "If break-even CPC is below market CPC, improve conversion rate, AOV, or margin before scaling spend.",
        "For subscription, use LTV-based targets instead of single-purchase AOV.",
      ],
      pitfalls: [
        "Using session CVR while using click-based CPC (mismatch).",
        "Ignoring returns, discounts, shipping, and fees (use contribution margin).",
        "Using platform CVR without incrementality validation for scale decisions.",
      ],
    },
    inputs: [
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
      {
        key: "conversionRatePercent",
        label: "Conversion rate (CVR)",
        help: "Conversions / clicks (use click-based CVR if possible).",
        placeholder: "2.5",
        suffix: "%",
        defaultValue: "2.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "profitBufferPercent",
        label: "Profit buffer",
        help: "Buffer as % of contribution per conversion (e.g., 20% means spend <= 80% of contribution).",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.1,
      },
        {
          key: "ctrPercent",
          label: "Click-through rate (optional)",
          help: "If provided, computes max CPM from max CPC. Set 0 to disable.",
          placeholder: "1.5",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
        },
        {
          key: "leadToCustomerRatePercent",
          label: "Lead-to-customer rate (optional)",
          help: "If you buy leads, use this to translate CAC into max CPL.",
          placeholder: "5",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const margin = values.contributionMarginPercent / 100;
        const cvr = values.conversionRatePercent / 100;
        const buffer = values.profitBufferPercent / 100;
        const ctr = values.ctrPercent / 100;
        const leadToCustomerRate = values.leadToCustomerRatePercent / 100;

      if (values.aov <= 0) warnings.push("AOV must be greater than 0.");
      if (margin <= 0) warnings.push("Contribution margin must be greater than 0%.");
      if (cvr <= 0) warnings.push("CVR must be greater than 0%.");

      const contributionPerConversion = values.aov * margin;
      const breakEvenCpa = contributionPerConversion;
      const targetCpa = contributionPerConversion * Math.max(0, 1 - buffer);

      const breakEvenCpc = breakEvenCpa * cvr;
      const targetCpc = targetCpa * cvr;

        const breakEvenCpm = ctr > 0 ? breakEvenCpc * 1000 * ctr : null;
        const targetCpm = ctr > 0 ? targetCpc * 1000 * ctr : null;
        const breakEvenCpl =
          leadToCustomerRate > 0 ? breakEvenCpa * leadToCustomerRate : null;
        const targetCpl =
          leadToCustomerRate > 0 ? targetCpa * leadToCustomerRate : null;

      return {
        headline: {
          key: "targetCpc",
          label: "Target CPC",
          value: targetCpc,
          format: "currency",
          currency: "USD",
          detail: "Max CPC with profit buffer",
        },
        secondary: [
          {
            key: "breakEvenCpc",
            label: "Break-even CPC",
            value: breakEvenCpc,
            format: "currency",
            currency: "USD",
            detail: "Max CPC where profit = 0 (variable economics)",
          },
          {
            key: "targetCpa",
            label: "Target CPA",
            value: targetCpa,
            format: "currency",
            currency: "USD",
            detail: "Contribution per conversion × (1 - buffer)",
          },
          {
            key: "breakEvenCpa",
            label: "Break-even CPA",
            value: breakEvenCpa,
            format: "currency",
            currency: "USD",
            detail: "Contribution per conversion (AOV × margin)",
          },
          {
            key: "breakEvenCpm",
            label: "Break-even CPM (if CTR provided)",
            value: breakEvenCpm ?? 0,
            format: "currency",
            currency: "USD",
            detail: breakEvenCpm === null ? "CTR is 0%" : "CPC × CTR × 1000",
          },
            {
              key: "targetCpm",
              label: "Target CPM (if CTR provided)",
              value: targetCpm ?? 0,
              format: "currency",
              currency: "USD",
              detail: targetCpm === null ? "CTR is 0%" : "Target CPC × CTR × 1000",
            },
            {
              key: "breakEvenCpl",
              label: "Break-even CPL",
              value: breakEvenCpl ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                breakEvenCpl === null
                  ? "Add lead-to-customer rate"
                  : "CAC x lead-to-customer rate",
            },
            {
              key: "targetCpl",
              label: "Target CPL",
              value: targetCpl ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                targetCpl === null
                  ? "Add lead-to-customer rate"
                  : "Target CAC x lead-to-customer rate",
            },
          ],
        breakdown: [
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
          {
            key: "cvr",
            label: "CVR",
            value: cvr,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "buffer",
            label: "Profit buffer",
            value: buffer,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula:
      "Contribution/conversion = AOV * margin; Break-even CPA = contribution; Break-even CPC = CPA * CVR; CPM = CPC * CTR * 1000",
    assumptions: [
      "Uses contribution margin as a simplified variable-profit proxy per conversion.",
      "CVR is click-based (conversions ÷ clicks).",
      "Ignores fixed costs and long-term LTV (use LTV-based targets for subscription).",
    ],
    faqs: [
      {
        question: "Should I use this for SaaS trials/leads?",
        answer:
          "If your conversion is a lead or trial (not a purchase), this is still useful, but you must adjust AOV to expected value per lead/trial (lead value), or use an LTV-based target CPA instead.",
      },
      {
        question: "Why does CPC depend on CVR?",
        answer:
          "Because CPA = CPC ÷ CVR. If CVR drops, the same CPC produces a higher CPA, so your max CPC must fall to stay within your CPA target.",
      },
    ],
  },
  {
    slug: "equity-value-calculator",
    title: "Equity Value Calculator",
    description:
      "Convert enterprise value (EV) into equity value using cash, debt, and other adjustments (optionally per share).",
    category: "finance",
    guideSlug: "equity-value-guide",
    relatedGlossarySlugs: ["enterprise-value", "equity-value", "net-debt", "dcf", "wacc"],
    seo: {
      intro: [
        "DCF and multiples often produce enterprise value (EV), which represents the value of the operating business. To get equity value, you adjust EV for net debt and other claims.",
        "This calculator computes equity value from EV, cash, debt, and optional preferred/minority/other adjustments, and can compute an implied value per share.",
      ],
      steps: [
        "Enter enterprise value (from DCF or multiples).",
        "Enter cash and debt to compute net debt adjustment.",
        "Optionally add preferred stock, minority interest, and other adjustments.",
        "Optionally enter shares outstanding to compute implied value per share.",
      ],
      pitfalls: [
        "Mixing enterprise value and equity value multiples (different denominators).",
        "Forgetting off-balance-sheet items or other claims (simplified model).",
        "Using inconsistent dates for EV and balance sheet inputs.",
      ],
    },
    inputs: [
      {
        key: "enterpriseValue",
        label: "Enterprise value (EV)",
        placeholder: "50000000",
        prefix: "$",
        defaultValue: "50000000",
        min: 0,
      },
      {
        key: "cash",
        label: "Cash (and cash equivalents)",
        placeholder: "8000000",
        prefix: "$",
        defaultValue: "8000000",
        min: 0,
      },
      {
        key: "debt",
        label: "Total debt",
        placeholder: "12000000",
        prefix: "$",
        defaultValue: "12000000",
        min: 0,
      },
      {
        key: "preferredStock",
        label: "Preferred stock (optional)",
        placeholder: "0",
        prefix: "$",
        defaultValue: "0",
        min: 0,
      },
      {
        key: "minorityInterest",
        label: "Minority interest (optional)",
        placeholder: "0",
        prefix: "$",
        defaultValue: "0",
        min: 0,
      },
      {
        key: "otherAdjustments",
        label: "Other adjustments (optional)",
        help: "Positive increases equity value; negative decreases (e.g., unfunded liabilities).",
        placeholder: "0",
        defaultValue: "0",
        step: 1000,
      },
      {
        key: "sharesOutstanding",
        label: "Shares outstanding (optional)",
        placeholder: "0",
        defaultValue: "0",
        min: 0,
        step: 1,
      },
    ],
      compute(values) {
        const warnings: string[] = [];
        const netDebt = values.debt - values.cash;
        const netCash = values.cash - values.debt;
        const equityValue =
          values.enterpriseValue - netDebt - values.preferredStock - values.minorityInterest + values.otherAdjustments;
        const equityToEv =
          values.enterpriseValue > 0 ? equityValue / values.enterpriseValue : null;

      let perShare: number | null = null;
      const shares = Math.floor(values.sharesOutstanding);
      if (values.sharesOutstanding !== shares)
        warnings.push("Shares outstanding was rounded down to a whole number.");
      if (shares > 0) perShare = equityValue / shares;

      if (equityValue < 0)
        warnings.push("Equity value is negative with these inputs (check EV and balance sheet values).");

      return {
        headline: {
          key: "equityValue",
          label: "Equity value",
          value: equityValue,
          format: "currency",
          currency: "USD",
          detail: "EV - net debt - other claims + adjustments",
        },
        secondary: [
            {
              key: "netDebt",
              label: "Net debt",
              value: netDebt,
              format: "currency",
              currency: "USD",
              detail: "Debt - cash",
            },
            {
              key: "netCash",
              label: "Net cash",
              value: netCash,
              format: "currency",
              currency: "USD",
              detail: "Cash - debt",
            },
            {
              key: "perShare",
              label: "Implied value per share",
              value: perShare ?? 0,
              format: "currency",
              currency: "USD",
              detail: perShare === null ? "Enter shares outstanding to calculate" : undefined,
            },
            {
              key: "equityToEv",
              label: "Equity value as % of EV",
              value: equityToEv ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: equityToEv === null ? "EV is 0" : "Equity value / EV",
            },
          ],
        breakdown: [
          {
            key: "enterpriseValue",
            label: "Enterprise value",
            value: values.enterpriseValue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "cash",
            label: "Cash",
            value: values.cash,
            format: "currency",
            currency: "USD",
          },
          {
            key: "debt",
            label: "Debt",
            value: values.debt,
            format: "currency",
            currency: "USD",
          },
          {
            key: "preferredStock",
            label: "Preferred stock",
            value: values.preferredStock,
            format: "currency",
            currency: "USD",
          },
          {
            key: "minorityInterest",
            label: "Minority interest",
            value: values.minorityInterest,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Equity value = enterprise value + cash - debt - preferred - minority + other adjustments",
    assumptions: [
      "Treats cash and debt as the primary bridge from EV to equity value.",
      "Preferred stock and minority interest are modeled as claims ahead of common equity (simplified).",
      "Other adjustments can represent items like pensions, leases, or non-operating assets/liabilities (simplified).",
    ],
    faqs: [
      {
        question: "Why does DCF give enterprise value instead of equity value?",
        answer:
          "Many DCFs discount unlevered free cash flows (available to all capital providers), producing EV. You then bridge to equity value using net debt and other claims.",
      },
      {
        question: "What about working capital, leases, and other liabilities?",
        answer:
          "A full valuation model would treat those explicitly. This tool keeps the bridge simple; use 'other adjustments' for major non-standard items and rely on a full model for precision.",
      },
    ],
  },
  {
    slug: "pre-money-post-money-calculator",
    title: "Pre-money vs Post-money Valuation Calculator",
    description:
      "Convert between pre-money and post-money valuation and estimate investor ownership from a financing round size.",
    category: "finance",
    guideSlug: "pre-money-post-money-guide",
    relatedGlossarySlugs: ["pre-money-valuation", "post-money-valuation", "dilution"],
    seo: {
      intro: [
        "Pre-money valuation is the company value before the new investment. Post-money valuation is pre-money plus the new investment (simplified).",
        "Investor ownership in a new round is typically approximated as investment ÷ post-money (ignoring option pool changes and other instruments).",
      ],
      steps: [
        "Enter pre-money valuation.",
        "Enter new investment amount (round size).",
        "Review post-money valuation and implied investor ownership.",
      ],
      pitfalls: [
        "Ignoring option pool increases (the option pool shuffle changes effective founder dilution).",
        "Mixing enterprise value (EV) and equity value concepts (this is an equity financing simplification).",
        "Assuming the implied ownership is exact (term sheet details matter).",
      ],
    },
    inputs: [
      {
        key: "preMoney",
        label: "Pre-money valuation",
        placeholder: "20000000",
        prefix: "$",
        defaultValue: "20000000",
        min: 0,
      },
      {
        key: "investment",
        label: "New investment",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
    ],
      compute(values) {
        const warnings: string[] = [];
        const postMoney = values.preMoney + values.investment;
        const investorOwnership = safeDivide(values.investment, postMoney);
        const existingOwnership =
          investorOwnership !== null ? 1 - investorOwnership : null;
        const postMoneyMultiple =
          values.preMoney > 0 ? postMoney / values.preMoney : null;

      if (values.preMoney <= 0) warnings.push("Pre-money valuation must be greater than 0.");
      if (values.investment < 0) warnings.push("Investment must be 0 or greater.");
      if (investorOwnership === null)
        warnings.push("Post-money valuation must be greater than 0.");

      return {
        headline: {
          key: "investorOwnership",
          label: "Implied investor ownership",
          value: investorOwnership ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Investment ÷ post-money",
        },
          secondary: [
            {
              key: "postMoney",
              label: "Post-money valuation",
              value: postMoney,
              format: "currency",
              currency: "USD",
              detail: "Pre-money + investment",
            },
            {
              key: "existingOwnership",
              label: "Existing ownership (post-round)",
              value: existingOwnership ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: existingOwnership === null ? "Post-money is 0" : "1 - investor ownership",
            },
            {
              key: "postMoneyMultiple",
              label: "Post-money / pre-money",
              value: postMoneyMultiple ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: postMoneyMultiple === null ? "Pre-money is 0" : "Post-money multiple",
            },
          ],
        breakdown: [
          {
            key: "preMoney",
            label: "Pre-money valuation",
            value: values.preMoney,
            format: "currency",
            currency: "USD",
          },
          {
            key: "investment",
            label: "Investment",
            value: values.investment,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "Post-money = pre-money + investment; investor % ≈ investment ÷ post-money",
    assumptions: [
      "Simplified equity financing model; ignores option pool changes, SAFEs/notes, and fees.",
      "Uses valuation-based ownership approximation rather than a full cap table.",
    ],
    faqs: [
      {
        question: "Is investor ownership always investment ÷ post-money?",
        answer:
          "Often as a first approximation, yes. But option pool increases, SAFEs/notes converting, and share-class terms can change the final ownership.",
      },
      {
        question: "What is the option pool shuffle?",
        answer:
          "It’s when the option pool is increased before the investment and counted in the pre-money, which dilutes existing shareholders more than the simple investment ÷ post-money calculation suggests.",
      },
    ],
    guide: [
      {
        title: "Valuation tips",
        bullets: [
          "Use post-money for quick ownership math, but validate with a cap table model.",
          "Model the option pool shuffle explicitly if you’re negotiating founder dilution.",
          "Keep definitions consistent (pre-money, post-money, fully diluted shares).",
        ],
      },
    ],
  },
  {
    slug: "pro-rata-investment-calculator",
    title: "Pro Rata Investment Calculator",
    description:
      "Estimate how much you need to invest in a new round to maintain your ownership percentage (simplified).",
    category: "finance",
    guideSlug: "pro-rata-rights-guide",
    relatedGlossarySlugs: [
      "pro-rata-rights",
      "pre-money-valuation",
      "post-money-valuation",
      "dilution",
    ],
    seo: {
      intro: [
        "Pro rata rights let an existing investor participate in a new round to maintain ownership (subject to terms and allocation).",
        "A simple model can estimate ownership dilution if you don’t invest and the investment needed to keep ownership constant.",
      ],
      steps: [
        "Enter your current ownership (before the new round).",
        "Enter pre-money valuation and new investment amount.",
        "Review your ownership if you don’t participate and your estimated pro rata check size.",
      ],
      pitfalls: [
        "Ignoring option pool increases and other dilutive instruments (SAFE/notes).",
        "Assuming you can always take full pro rata (allocation may be limited).",
        "Using inconsistent ownership basis (fully diluted vs issued shares).",
      ],
    },
    inputs: [
      {
        key: "ownershipPercent",
        label: "Current ownership",
        placeholder: "5",
        suffix: "%",
        defaultValue: "5",
        min: 0,
        step: 0.01,
      },
      {
        key: "preMoney",
        label: "Pre-money valuation",
        placeholder: "20000000",
        prefix: "$",
        defaultValue: "20000000",
        min: 0,
      },
      {
        key: "investment",
        label: "New investment (round size)",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const ownership = values.ownershipPercent / 100;
      const postMoney = values.preMoney + values.investment;
      const proRataInvestment = ownership * values.investment;
      const ownershipNoParticipate = safeDivide(ownership * values.preMoney, postMoney);

      if (values.ownershipPercent < 0 || values.ownershipPercent > 100)
        warnings.push("Ownership must be between 0% and 100%.");
      if (values.preMoney <= 0) warnings.push("Pre-money valuation must be greater than 0.");
      if (values.investment < 0) warnings.push("Investment must be 0 or greater.");
      if (ownershipNoParticipate === null)
        warnings.push("Post-money valuation must be greater than 0.");

      return {
        headline: {
          key: "proRataInvestment",
          label: "Estimated pro rata investment",
          value: proRataInvestment,
          format: "currency",
          currency: "USD",
          detail: "Current % × new investment",
        },
        secondary: [
          {
            key: "ownershipNoParticipate",
            label: "Ownership if you don’t participate",
            value: ownershipNoParticipate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Current % × (pre-money ÷ post-money)",
          },
          {
            key: "postMoney",
            label: "Post-money valuation",
            value: postMoney,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Pro rata check ≈ current ownership % × round size; ownership (no participate) ≈ current % × (pre-money ÷ post-money)",
    assumptions: [
      "Simplified model; ignores option pool changes, SAFEs/notes, and share-class terms.",
      "Assumes ownership is measured on a consistent fully diluted basis before and after the round.",
    ],
    faqs: [
      {
        question: "Why is pro rata investment current % × round size?",
        answer:
          "If you own X% and want to keep X% after new shares are issued, you typically need to buy X% of the new issuance, which corresponds to about X% of the round size in a priced round.",
      },
      {
        question: "Why does ownership drop if I don’t participate?",
        answer:
          "New shares are issued to new investors (and sometimes the option pool), so existing shareholders are diluted unless they buy some of the new shares.",
      },
    ],
  },
  {
    slug: "option-pool-shuffle-calculator",
    title: "Option Pool Shuffle Calculator",
    description:
      "Estimate founder dilution impact when the option pool is increased to a target percent of post-money (simplified).",
    category: "finance",
    guideSlug: "option-pool-shuffle-guide",
    relatedGlossarySlugs: [
      "option-pool",
      "dilution",
      "pre-money-valuation",
      "post-money-valuation",
    ],
    seo: {
      intro: [
        "In many term sheets, the option pool is increased before the investment and counted in the pre-money. This is often called the option pool shuffle.",
        "The shuffle can materially change effective founder dilution even if the headline pre-money valuation is unchanged.",
      ],
      steps: [
        "Enter pre-money valuation and new investment amount.",
        "Enter current option pool % (fully diluted pre) and target option pool % (post-money).",
        "Review post-money ownership split (investor vs option pool vs existing holders).",
      ],
      pitfalls: [
        "Using pool % defined on different bases (issued vs fully diluted).",
        "Setting an impossible target pool % given the round size and pre-money.",
        "Ignoring SAFE/note conversions that also dilute common.",
      ],
    },
    inputs: [
      {
        key: "preMoney",
        label: "Pre-money valuation",
        placeholder: "20000000",
        prefix: "$",
        defaultValue: "20000000",
        min: 0,
      },
      {
        key: "investment",
        label: "New investment (round size)",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
      {
        key: "currentPoolPercent",
        label: "Current option pool (pre-money)",
        help: "Percent of fully diluted shares before the round.",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
        min: 0,
        step: 0.1,
      },
      {
        key: "targetPoolPercent",
        label: "Target option pool (post-money)",
        help: "Percent of fully diluted shares after the round.",
        placeholder: "15",
        suffix: "%",
        defaultValue: "15",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.preMoney <= 0) warnings.push("Pre-money valuation must be greater than 0.");
      if (values.investment < 0) warnings.push("Investment must be 0 or greater.");
      if (values.currentPoolPercent < 0 || values.currentPoolPercent > 100)
        warnings.push("Current option pool must be between 0% and 100%.");
      if (values.targetPoolPercent < 0 || values.targetPoolPercent > 100)
        warnings.push("Target option pool must be between 0% and 100%.");

      const p0 = values.currentPoolPercent / 100;
      const pt = values.targetPoolPercent / 100;
      const postMoney = values.preMoney + values.investment;
      const k = safeDivide(postMoney, values.preMoney);
      const investorPost = safeDivide(values.investment, postMoney);
      if (k === null || investorPost === null) {
        return {
          headline: {
            key: "existingPost",
            label: "Existing holders (post-money)",
            value: 0,
            format: "percent",
          },
          warnings,
        };
      }

      const denom = 1 - pt * k;
      let deltaPool = 0;
      if (denom <= 0) {
        warnings.push("Target option pool is too high for this pre-money and round size (no solution).");
      } else {
        deltaPool = (pt * k - p0) / denom;
        if (deltaPool < 0) deltaPool = 0;
      }

      const existingPost = 1 - investorPost - pt;
      if (existingPost < 0)
        warnings.push("Post-money existing holders % is negative (check pool target and round size).");

      return {
        headline: {
          key: "existingPost",
          label: "Existing holders (post-money)",
          value: Math.max(0, existingPost),
          format: "percent",
          maxFractionDigits: 2,
          detail: "After pool top-up and investment (simplified)",
        },
        secondary: [
          {
            key: "investorPost",
            label: "New investor (post-money)",
            value: investorPost,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Investment ÷ post-money",
          },
          {
            key: "poolPost",
            label: "Option pool (post-money target)",
            value: pt,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        breakdown: [
          {
            key: "deltaPool",
            label: "Estimated option pool top-up (pre-money shares multiple)",
            value: deltaPool,
            format: "number",
            maxFractionDigits: 4,
            detail: "Additional pool shares relative to pre-money total shares (normalized)",
          },
        ],
        warnings,
      };
    },
    formula:
      "Investor % ≈ investment ÷ post-money; option pool shuffle solves for extra pool shares to reach target pool % post-money (simplified share normalization).",
    assumptions: [
      "Uses a simplified fully diluted share model normalized to 1 pre-money share base.",
      "Ignores SAFE/note conversions and any share-class / liquidation preference terms.",
      "Assumes investor ownership approximation investment ÷ post-money.",
    ],
    faqs: [
      {
        question: "Why does the option pool shuffle matter?",
        answer:
          "Because increasing the option pool before the investment effectively reduces the ownership left for existing holders (founders and prior investors), even if the headline valuation is unchanged.",
      },
      {
        question: "Is this a full cap table model?",
        answer:
          "No. It’s a simplified model to estimate the direction and magnitude. For negotiation and legal accuracy, build a full cap table including SAFEs/notes and share classes.",
      },
    ],
  },
  {
    slug: "safe-conversion-calculator",
    title: "SAFE Conversion Calculator",
    description:
      "Estimate how a SAFE converts in a priced round using a valuation cap and/or discount (simplified).",
    category: "finance",
    guideSlug: "safe-guide",
    relatedGlossarySlugs: ["safe", "valuation-cap", "discount-rate", "dilution", "pre-money-valuation"],
    seo: {
      intro: [
        "A SAFE typically converts into equity in a priced round at the better of a valuation cap price or a discount to the round price (depending on terms).",
        "This calculator estimates conversion price and resulting SAFE shares using a simplified priced-round model.",
      ],
      steps: [
        "Enter SAFE amount and the priced round pre-money valuation.",
        "Enter valuation cap and/or discount (set to 0 if not applicable).",
        "Enter existing fully diluted shares and new money investment to estimate ownership.",
      ],
      pitfalls: [
        "Using shares that are not fully diluted (option pool and other SAFEs matter).",
        "Ignoring post-money SAFE mechanics and MFN clauses (terms vary).",
        "Assuming the output matches legal documentation (simplified model).",
      ],
    },
    inputs: [
      {
        key: "safeAmount",
        label: "SAFE amount",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "valuationCap",
        label: "Valuation cap (optional)",
        help: "Set to 0 if the SAFE has no cap.",
        placeholder: "8000000",
        prefix: "$",
        defaultValue: "8000000",
        min: 0,
      },
      {
        key: "discountPercent",
        label: "Discount (optional)",
        help: "Set to 0% if the SAFE has no discount.",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.1,
      },
      {
        key: "pricedRoundPreMoney",
        label: "Priced round pre-money valuation",
        placeholder: "20000000",
        prefix: "$",
        defaultValue: "20000000",
        min: 0,
      },
      {
        key: "existingShares",
        label: "Existing fully diluted shares",
        placeholder: "10000000",
        defaultValue: "10000000",
        min: 0,
        step: 1,
      },
      {
        key: "newMoney",
        label: "New money in priced round",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const shares = Math.floor(values.existingShares);
      if (values.existingShares !== shares)
        warnings.push("Existing shares was rounded down to a whole number.");
      if (values.safeAmount < 0) warnings.push("SAFE amount must be 0 or greater.");
      if (values.pricedRoundPreMoney <= 0)
        warnings.push("Priced round pre-money valuation must be greater than 0.");
      if (shares <= 0) warnings.push("Existing shares must be greater than 0.");
      if (values.newMoney < 0) warnings.push("New money must be 0 or greater.");
      if (values.discountPercent < 0 || values.discountPercent > 100)
        warnings.push("Discount must be between 0% and 100%.");

      const roundPrice = safeDivide(values.pricedRoundPreMoney, shares);
      if (roundPrice === null) {
        return {
          headline: {
            key: "safeShares",
            label: "SAFE shares",
            value: 0,
            format: "number",
          },
          warnings,
        };
      }

      const discountFactor = 1 - values.discountPercent / 100;
      const discountPrice = roundPrice * discountFactor;
      const capPrice = values.valuationCap > 0 ? values.valuationCap / shares : null;

      let conversionPrice = roundPrice;
      let method = "Round price";
      if (capPrice !== null && capPrice > 0 && capPrice < conversionPrice) {
        conversionPrice = capPrice;
        method = "Valuation cap";
      }
      if (
        values.discountPercent > 0 &&
        discountPrice > 0 &&
        discountPrice < conversionPrice
      ) {
        conversionPrice = discountPrice;
        method = "Discount";
      }

      const safeShares = safeDivide(values.safeAmount, conversionPrice) ?? 0;
      const investorShares = safeDivide(values.newMoney, roundPrice) ?? 0;
      const postShares = shares + safeShares + investorShares;
      const safeOwnership = safeDivide(safeShares, postShares) ?? 0;

      return {
        headline: {
          key: "safeOwnership",
          label: "SAFE ownership (estimated)",
          value: safeOwnership,
          format: "percent",
          maxFractionDigits: 2,
          detail: "SAFE shares ÷ post-round shares (simplified)",
        },
        secondary: [
          {
            key: "conversionPrice",
            label: "SAFE conversion price",
            value: conversionPrice,
            format: "currency",
            currency: "USD",
            detail: method,
          },
          {
            key: "safeShares",
            label: "SAFE shares (estimated)",
            value: safeShares,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        breakdown: [
          {
            key: "roundPrice",
            label: "Round price per share",
            value: roundPrice,
            format: "currency",
            currency: "USD",
          },
          {
            key: "postShares",
            label: "Post-round shares (estimated)",
            value: postShares,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Round price = pre-money ÷ shares; SAFE price = min(cap price, discounted round price, round price); SAFE shares = SAFE amount ÷ SAFE price",
    assumptions: [
      "Simplified priced-round model; ignores option pool changes, other SAFEs/notes, and legal nuances (post-money SAFE, MFN, etc.).",
      "Assumes existing shares input is fully diluted and matches the priced round pre-money valuation basis.",
    ],
    faqs: [
      {
        question: "Cap vs discount: which one applies?",
        answer:
          "Many SAFEs convert at the better (lower price) of the cap price or the discount price. Terms vary, so confirm your SAFE document.",
      },
      {
        question: "Why do I need existing shares?",
        answer:
          "To convert valuation into a per-share price. Conversion is ultimately about how many shares the SAFE buys at a given price per share.",
      },
    ],
  },
  {
    slug: "convertible-note-conversion-calculator",
    title: "Convertible Note Conversion Calculator",
    description:
      "Estimate how a convertible note converts in a priced round with interest plus a valuation cap and/or discount (simplified).",
    category: "finance",
    guideSlug: "convertible-note-guide",
    relatedGlossarySlugs: [
      "convertible-note",
      "valuation-cap",
      "discount-rate",
      "interest-rate",
      "dilution",
    ],
    seo: {
      intro: [
        "Convertible notes usually convert into equity in a priced round. The conversion price can be set by a valuation cap, a discount, or the round price, and the note may accrue interest.",
        "This calculator estimates total note amount (principal + interest), conversion price, and resulting shares and ownership using a simplified model.",
      ],
      steps: [
        "Enter principal, interest rate, and months outstanding to compute principal + interest.",
        "Enter valuation cap and/or discount (set to 0 if not applicable).",
        "Enter priced round pre-money valuation, existing shares, and new money to estimate ownership.",
      ],
      pitfalls: [
        "Using the wrong interest convention (simple vs compounding; actual terms vary).",
        "Ignoring multiple notes/SAFEs and the option pool (dilution stacks).",
        "Assuming the output equals legal documentation (simplified model).",
      ],
    },
    inputs: [
      {
        key: "principal",
        label: "Note principal",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "annualInterestPercent",
        label: "Annual interest rate",
        placeholder: "6",
        suffix: "%",
        defaultValue: "6",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthsOutstanding",
        label: "Months outstanding",
        placeholder: "18",
        defaultValue: "18",
        min: 0,
        step: 1,
      },
      {
        key: "valuationCap",
        label: "Valuation cap (optional)",
        help: "Set to 0 if the note has no cap.",
        placeholder: "8000000",
        prefix: "$",
        defaultValue: "8000000",
        min: 0,
      },
      {
        key: "discountPercent",
        label: "Discount (optional)",
        help: "Set to 0% if the note has no discount.",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.1,
      },
      {
        key: "pricedRoundPreMoney",
        label: "Priced round pre-money valuation",
        placeholder: "20000000",
        prefix: "$",
        defaultValue: "20000000",
        min: 0,
      },
      {
        key: "existingShares",
        label: "Existing fully diluted shares",
        placeholder: "10000000",
        defaultValue: "10000000",
        min: 0,
        step: 1,
      },
      {
        key: "newMoney",
        label: "New money in priced round",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const shares = Math.floor(values.existingShares);
      if (values.existingShares !== shares)
        warnings.push("Existing shares was rounded down to a whole number.");
      if (values.pricedRoundPreMoney <= 0)
        warnings.push("Priced round pre-money valuation must be greater than 0.");
      if (shares <= 0) warnings.push("Existing shares must be greater than 0.");
      if (values.principal < 0) warnings.push("Principal must be 0 or greater.");
      if (values.newMoney < 0) warnings.push("New money must be 0 or greater.");
      if (values.annualInterestPercent < 0 || values.annualInterestPercent > 100)
        warnings.push("Interest rate must be between 0% and 100%.");
      if (values.discountPercent < 0 || values.discountPercent > 100)
        warnings.push("Discount must be between 0% and 100%.");

      const interest =
        values.principal *
        (values.annualInterestPercent / 100) *
        (values.monthsOutstanding / 12);
      const total = values.principal + interest;

      const roundPrice = safeDivide(values.pricedRoundPreMoney, shares);
      if (roundPrice === null) {
        return {
          headline: {
            key: "noteOwnership",
            label: "Note ownership (estimated)",
            value: 0,
            format: "percent",
          },
          warnings,
        };
      }

      const discountFactor = 1 - values.discountPercent / 100;
      const discountPrice = roundPrice * discountFactor;
      const capPrice = values.valuationCap > 0 ? values.valuationCap / shares : null;

      let conversionPrice = roundPrice;
      let method = "Round price";
      if (capPrice !== null && capPrice > 0 && capPrice < conversionPrice) {
        conversionPrice = capPrice;
        method = "Valuation cap";
      }
      if (
        values.discountPercent > 0 &&
        discountPrice > 0 &&
        discountPrice < conversionPrice
      ) {
        conversionPrice = discountPrice;
        method = "Discount";
      }

      const noteShares = safeDivide(total, conversionPrice) ?? 0;
      const investorShares = safeDivide(values.newMoney, roundPrice) ?? 0;
      const postShares = shares + noteShares + investorShares;
      const noteOwnership = safeDivide(noteShares, postShares) ?? 0;

      return {
        headline: {
          key: "noteOwnership",
          label: "Note ownership (estimated)",
          value: noteOwnership,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Note shares ÷ post-round shares (simplified)",
        },
        secondary: [
          {
            key: "conversionPrice",
            label: "Conversion price",
            value: conversionPrice,
            format: "currency",
            currency: "USD",
            detail: method,
          },
          {
            key: "total",
            label: "Principal + interest",
            value: total,
            format: "currency",
            currency: "USD",
            detail: "Simple interest approximation",
          },
        ],
        breakdown: [
          {
            key: "noteShares",
            label: "Note shares (estimated)",
            value: noteShares,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "roundPrice",
            label: "Round price per share",
            value: roundPrice,
            format: "currency",
            currency: "USD",
          },
          {
            key: "postShares",
            label: "Post-round shares (estimated)",
            value: postShares,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Total note = principal + simple interest; conversion price = min(cap price, discounted round price, round price); note shares = total note ÷ conversion price",
    assumptions: [
      "Uses simple interest (actual note terms may compound or accrue differently).",
      "Simplified priced-round model; ignores option pool changes, other instruments, and legal nuances.",
      "Assumes existing shares input is fully diluted and matches the priced round valuation basis.",
    ],
    faqs: [
      {
        question: "Does interest always convert into shares?",
        answer:
          "Often yes, but terms vary. Some notes may pay interest in cash or have specific conversion rules. Confirm the note documents.",
      },
      {
        question: "Is cap vs discount always ‘best of’?",
        answer:
          "Many notes apply the better (lower conversion price) of cap or discount, but terms vary; confirm the conversion mechanics in your agreement.",
      },
    ],
  },
  {
    slug: "liquidation-preference-calculator",
    title: "Liquidation Preference Calculator (1x)",
    description:
      "Estimate investor proceeds at exit under a simple 1x non-participating liquidation preference vs converting to common (simplified).",
    category: "finance",
    guideSlug: "liquidation-preference-guide",
    relatedGlossarySlugs: ["liquidation-preference", "equity-value"],
    seo: {
      intro: [
        "Liquidation preference determines what investors receive at an exit before common shareholders. A common structure is 1x non-participating preferred.",
        "With non-participating preferred, an investor typically takes the greater of (a) their preference amount or (b) what they would receive if they convert to common at their ownership percentage.",
      ],
      steps: [
        "Enter the exit equity value (sale price).",
        "Enter the investor's original investment and their ownership if converted to common.",
        "Review whether preference or conversion produces a higher payout.",
      ],
      pitfalls: [
        "Ignoring multiple share classes and seniority (stacked preferences).",
        "Using post-money ownership that does not match the cap table at exit.",
        "Assuming participating preferred behaves the same (it does not).",
      ],
    },
    inputs: [
      {
        key: "exitValue",
        label: "Exit equity value",
        placeholder: "50000000",
        prefix: "$",
        defaultValue: "50000000",
        min: 0,
      },
      {
        key: "investment",
        label: "Investor investment",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
      {
        key: "ownershipPercent",
        label: "Investor ownership (as-converted)",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.01,
      },
      {
        key: "preferenceMultiple",
        label: "Preference multiple",
        help: "1x is common for non-participating preferred. Set to 1 unless you have a different term.",
        placeholder: "1",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const ownership = values.ownershipPercent / 100;
      if (values.ownershipPercent < 0 || values.ownershipPercent > 100)
        warnings.push("Ownership must be between 0% and 100%.");
      if (values.exitValue < 0) warnings.push("Exit value must be 0 or greater.");
      if (values.investment < 0) warnings.push("Investment must be 0 or greater.");
      if (values.preferenceMultiple < 0)
        warnings.push("Preference multiple must be 0 or greater.");

      const preference = values.investment * values.preferenceMultiple;
      const asConverted = ownership * values.exitValue;
      const investorProceeds = Math.max(preference, asConverted);
      const commonProceeds = Math.max(0, values.exitValue - investorProceeds);
      const decision = investorProceeds === preference ? "Preference" : "Convert to common";

      if (investorProceeds > values.exitValue)
        warnings.push("Investor proceeds exceed exit value (check inputs).");

      return {
        headline: {
          key: "investorProceeds",
          label: "Investor proceeds",
          value: investorProceeds,
          format: "currency",
          currency: "USD",
          detail: decision,
        },
        secondary: [
          {
            key: "commonProceeds",
            label: "Proceeds to common (remaining)",
            value: commonProceeds,
            format: "currency",
            currency: "USD",
          },
          {
            key: "asConverted",
            label: "Investor proceeds if converted",
            value: asConverted,
            format: "currency",
            currency: "USD",
            detail: "Ownership % × exit",
          },
        ],
        breakdown: [
          {
            key: "preference",
            label: "Preference payout",
            value: preference,
            format: "currency",
            currency: "USD",
            detail: "Investment × preference multiple",
          },
        ],
        warnings,
      };
    },
    formula:
      "Investor proceeds (1× non-participating) = max(preference multiple × investment, ownership % × exit value)",
    assumptions: [
      "Models a single investor class with non-participating preferred only (simplified).",
      "Ignores stacked preferences, seniority, participation, dividends, and caps.",
    ],
    faqs: [
      {
        question: "What if there are multiple preference stacks?",
        answer:
          "You need a waterfall model with seniority (Series B before Series A, etc.). This calculator is a simplified single-layer version.",
      },
      {
        question: "What about participating preferred?",
        answer:
          "Participating preferred can take preference and then also share in remaining proceeds as common. This calculator does not model participation.",
      },
    ],
  },
  {
    slug: "unit-economics-dashboard-calculator",
    title: "Unit Economics Dashboard Calculator",
    description:
      "Compute a unit economics snapshot: gross profit LTV, CAC payback, LTV:CAC, and break-even targets from a few inputs.",
    category: "saas-metrics",
    guideSlug: "unit-economics-dashboard-guide",
    relatedGlossarySlugs: [
      "unit-economics",
      "ltv",
      "cac",
      "payback-period",
      "arpa",
      "gross-margin",
      "logo-churn",
      "cohorted-ltv",
    ],
    seo: {
      intro: [
        "Unit economics answer: do we create enough gross profit per customer to justify what we spend to acquire them, and how fast do we get cash back?",
        "This dashboard calculator computes gross profit LTV, CAC payback months, LTV:CAC, and simple break-even targets. It’s designed for fast scenario testing and planning.",
      ],
      steps: [
        "Enter ARPA, gross margin, and monthly churn to estimate gross profit LTV.",
        "Enter CAC to compute payback months and LTV:CAC ratio.",
        "Optionally add a target payback to see a max CAC target.",
      ],
      pitfalls: [
        "Using revenue LTV instead of gross profit LTV (overstates value).",
        "Mixing monthly churn with annual ARPA (time unit mismatch).",
        "Comparing fully-loaded CAC to revenue-based LTV (mismatch).",
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
        key: "monthlyLogoChurnPercent",
        label: "Monthly churn (logo)",
        help: "Used as a shortcut lifetime estimate; cohort LTV is more accurate.",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0,
        step: 0.1,
      },
      {
        key: "cac",
        label: "CAC (per new customer)",
        placeholder: "6000",
        prefix: "$",
        defaultValue: "6000",
        min: 0,
      },
      {
        key: "targetPaybackMonths",
        label: "Target payback (months, optional)",
        help: "Set 0 to disable target CAC calculation.",
        placeholder: "12",
        defaultValue: "12",
        min: 0,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const margin = values.grossMarginPercent / 100;
      const churn = values.monthlyLogoChurnPercent / 100;

      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (margin <= 0) warnings.push("Gross margin must be greater than 0%.");
      if (churn <= 0) warnings.push("Monthly churn must be greater than 0% to estimate lifetime from churn.");
      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");

      const grossProfitPerMonth = values.arpaMonthly * margin;
      const lifetimeMonths = churn > 0 ? 1 / churn : null;
      const grossProfitLtv = lifetimeMonths ? grossProfitPerMonth * lifetimeMonths : null;

      const paybackMonths =
        grossProfitPerMonth > 0 ? values.cac / grossProfitPerMonth : null;
      const ltvToCac = grossProfitLtv ? grossProfitLtv / values.cac : null;

      const targetPayback = Math.floor(values.targetPaybackMonths);
      if (values.targetPaybackMonths !== targetPayback)
        warnings.push("Target payback was rounded down to a whole number.");

      const maxCacForTargetPayback =
        targetPayback > 0 ? grossProfitPerMonth * targetPayback : null;

      const breakEvenMonthlyChurn =
        grossProfitLtv && grossProfitLtv > 0
          ? safeDivide(grossProfitPerMonth, grossProfitLtv)
          : churn;

      return {
        headline: {
          key: "ltvToCac",
          label: "LTV:CAC (gross profit)",
          value: ltvToCac ?? 0,
          format: "multiple",
          maxFractionDigits: 2,
          detail: ltvToCac === null ? "Enter valid churn and CAC" : "Gross profit LTV ÷ CAC",
        },
        secondary: [
          {
            key: "grossProfitLtv",
            label: "Gross profit LTV (shortcut)",
            value: grossProfitLtv ?? 0,
            format: "currency",
            currency: "USD",
            detail: grossProfitLtv === null ? "Requires churn > 0" : "Gross profit/month × lifetime",
          },
          {
            key: "paybackMonths",
            label: "CAC payback (months)",
            value: paybackMonths ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: paybackMonths === null ? "Requires margin and ARPA" : "CAC ÷ gross profit/month",
          },
          {
            key: "grossProfitPerMonth",
            label: "Gross profit per month",
            value: grossProfitPerMonth,
            format: "currency",
            currency: "USD",
            detail: "ARPA × gross margin",
          },
          {
            key: "lifetimeMonths",
            label: "Approx. lifetime (months)",
            value: lifetimeMonths ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: lifetimeMonths === null ? "Churn is 0%" : "1 ÷ monthly churn",
          },
          {
            key: "maxCac",
            label: `Max CAC for ${targetPayback} month payback`,
            value: maxCacForTargetPayback ?? 0,
            format: "currency",
            currency: "USD",
            detail: maxCacForTargetPayback === null ? "Set target payback > 0" : "Gross profit/month × target months",
          },
          {
            key: "breakEvenChurn",
            label: "Break-even churn (for this LTV shortcut)",
            value: breakEvenMonthlyChurn ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Directional only (shortcut model)",
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
            value: margin,
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
            key: "cac",
            label: "CAC",
            value: values.cac,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Gross profit LTV ≈ (ARPA×gross margin) ÷ churn; Payback ≈ CAC ÷ (ARPA×gross margin); LTV:CAC ≈ LTV ÷ CAC",
    assumptions: [
      "Uses logo churn as a shortcut lifetime estimate (1/churn).",
      "Assumes constant ARPA and gross margin over lifetime.",
      "For accuracy, use cohort-based LTV and segment-level retention curves.",
    ],
    faqs: [
      {
        question: "What LTV:CAC is good?",
        answer:
          "It depends on growth stage and payback constraints. Many teams use ~3× as a rough rule of thumb, but payback and cash constraints matter more than a single ratio.",
      },
      {
        question: "Why can this be misleading?",
        answer:
          "Because churn is rarely constant and expansion can change revenue over time. This is a planning shortcut; validate with cohort curves when possible.",
      },
    ],
  },
  {
    slug: "break-even-cpm-calculator",
    title: "Break-even CPM Calculator",
    description:
      "Compute break-even and target CPM from CTR, CVR, AOV, and contribution margin assumptions.",
    category: "paid-ads",
    guideSlug: "break-even-cpm-guide",
    relatedGlossarySlugs: [
      "cpm",
      "ctr",
      "cvr",
      "aov",
      "contribution-margin",
      "break-even-roas",
    ],
    seo: {
      intro: [
        "If you buy impressions (CPM), you need to know how much you can pay per 1,000 impressions and still break even.",
        "This calculator converts CTR and CVR into expected conversions per 1,000 impressions, then computes the break-even CPM and a target CPM with buffer.",
      ],
      steps: [
        "Enter CTR and CVR to estimate conversions per 1,000 impressions.",
        "Enter AOV and contribution margin to estimate contribution per conversion.",
        "Add a buffer to compute a target CPM below break-even.",
      ],
      pitfalls: [
        "Using mismatched denominators (session CVR vs click CVR).",
        "Overstating margin by ignoring returns, shipping, and fees.",
        "Assuming CPM buying is profitable without incrementality validation.",
      ],
    },
    inputs: [
      {
        key: "ctrPercent",
        label: "CTR",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "cvrPercent",
        label: "CVR (click → conversion)",
        placeholder: "2.5",
        suffix: "%",
        defaultValue: "2.5",
        min: 0,
        step: 0.1,
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
        key: "contributionMarginPercent",
        label: "Contribution margin",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
      {
        key: "profitBufferPercent",
        label: "Profit buffer",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const ctr = values.ctrPercent / 100;
      const cvr = values.cvrPercent / 100;
      const margin = values.contributionMarginPercent / 100;
      const buffer = values.profitBufferPercent / 100;

      if (ctr <= 0) warnings.push("CTR must be greater than 0%.");
      if (cvr <= 0) warnings.push("CVR must be greater than 0%.");
      if (values.aov <= 0) warnings.push("AOV must be greater than 0.");
      if (margin <= 0) warnings.push("Contribution margin must be greater than 0%.");

      const clicksPerThousand = 1000 * ctr;
      const conversionsPerThousand = clicksPerThousand * cvr;
        const contributionPerConversion = values.aov * margin;
        const contributionPerThousand = conversionsPerThousand * contributionPerConversion;

        const breakEvenCpm = contributionPerThousand;
        const targetCpm = breakEvenCpm * Math.max(0, 1 - buffer);
        const breakEvenCpc = ctr > 0 ? breakEvenCpm / (1000 * ctr) : 0;
        const targetCpc = ctr > 0 ? targetCpm / (1000 * ctr) : 0;
        const breakEvenCpa = cvr > 0 ? breakEvenCpc / cvr : 0;
        const targetCpa = cvr > 0 ? targetCpc / cvr : 0;

        return {
          headline: {
            key: "targetCpm",
            label: "Target CPM",
          value: targetCpm,
          format: "currency",
          currency: "USD",
          detail: "Break-even CPM with profit buffer",
        },
        secondary: [
          {
            key: "breakEvenCpm",
            label: "Break-even CPM",
            value: breakEvenCpm,
            format: "currency",
            currency: "USD",
            detail: "Contribution per 1,000 impressions",
          },
          {
            key: "conversionsPerThousand",
            label: "Conversions per 1,000 impressions",
            value: conversionsPerThousand,
            format: "number",
            maxFractionDigits: 2,
            detail: "1000×CTR×CVR",
          },
            {
              key: "contributionPerConversion",
              label: "Contribution per conversion",
              value: contributionPerConversion,
              format: "currency",
              currency: "USD",
              detail: "AOV×margin",
            },
            {
              key: "breakEvenCpc",
              label: "Break-even CPC",
              value: breakEvenCpc,
              format: "currency",
              currency: "USD",
              detail: "Break-even CPM / (1000 x CTR)",
            },
            {
              key: "breakEvenCpa",
              label: "Break-even CPA",
              value: breakEvenCpa,
              format: "currency",
              currency: "USD",
              detail: "Break-even CPC / CVR",
            },
            {
              key: "targetCpc",
              label: "Target CPC",
              value: targetCpc,
              format: "currency",
              currency: "USD",
              detail: "Target CPM / (1000 x CTR)",
            },
            {
              key: "targetCpa",
              label: "Target CPA",
              value: targetCpa,
              format: "currency",
              currency: "USD",
              detail: "Target CPC / CVR",
            },
            {
              key: "clicksPerThousand",
              label: "Clicks per 1,000 impressions",
              value: clicksPerThousand,
              format: "number",
            maxFractionDigits: 1,
          },
        ],
        breakdown: [
          {
            key: "ctr",
            label: "CTR",
            value: ctr,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "cvr",
            label: "CVR",
            value: cvr,
            format: "percent",
            maxFractionDigits: 2,
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
          {
            key: "buffer",
            label: "Profit buffer",
            value: buffer,
            format: "percent",
            maxFractionDigits: 1,
          },
        ],
        warnings,
      };
    },
    formula:
      "Conversions/1000 = 1000×CTR×CVR; Break-even CPM = conversions/1000 × (AOV×margin); Target CPM = break-even × (1-buffer)",
    assumptions: [
      "CVR is click-based (conversions ÷ clicks).",
      "Contribution margin captures variable costs (not fixed overhead).",
      "Ignores long-term LTV; best for one-time purchase economics.",
    ],
    faqs: [
      {
        question: "How is this different from max CPC?",
        answer:
          "Max CPC tells you what you can pay per click. Break-even CPM tells you what you can pay per 1,000 impressions. They are linked via CTR: CPM ≈ CPC×CTR×1000.",
      },
      {
        question: "What if my platform charges CPM but optimizes for conversions?",
        answer:
          "You can still use this as a sanity check, but ensure CTR and CVR reflect observed performance for that campaign and placement mix.",
      },
    ],
  },
  {
    slug: "multiple-valuation-calculator",
    title: "Multiple Valuation Calculator",
    description:
      "Estimate enterprise value and equity value from a metric (ARR or revenue) and a valuation multiple (with net debt adjustments).",
    category: "finance",
    guideSlug: "multiple-valuation-guide",
    relatedGlossarySlugs: [
      "enterprise-value",
      "equity-value",
      "net-debt",
      "arr",
      "arr-valuation-multiple",
    ],
    seo: {
      intro: [
        "Multiple-based valuation is a fast way to estimate enterprise value by applying a market multiple to a metric like ARR or revenue.",
        "This calculator estimates enterprise value (metric × multiple) and then bridges to equity value using cash and debt.",
      ],
      steps: [
        "Choose a metric value (ARR or annual revenue) and a multiple.",
        "Compute enterprise value = metric × multiple.",
        "Bridge to equity value using cash and debt (net debt).",
      ],
      pitfalls: [
        "Mixing EV multiples with equity value comparables (mismatch).",
        "Using the wrong metric definition (gross vs net revenue, recurring vs one-time).",
        "Using a multiple without context (growth, margin, retention).",
      ],
    },
    inputs: [
      {
        key: "metricValue",
        label: "Metric value (ARR or revenue)",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
      {
        key: "multiple",
        label: "Valuation multiple",
        placeholder: "6",
        defaultValue: "6",
        min: 0,
        step: 0.1,
      },
      {
        key: "cash",
        label: "Cash",
        placeholder: "1000000",
        prefix: "$",
        defaultValue: "1000000",
        min: 0,
      },
      {
        key: "debt",
        label: "Debt",
        placeholder: "2000000",
        prefix: "$",
        defaultValue: "2000000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.metricValue <= 0) warnings.push("Metric value must be greater than 0.");
      if (values.multiple <= 0) warnings.push("Multiple must be greater than 0.");

      const enterpriseValue = values.metricValue * values.multiple;
      const netDebt = values.debt - values.cash;
      const equityValue = enterpriseValue - netDebt;

      return {
        headline: {
          key: "enterpriseValue",
          label: "Enterprise value (EV)",
          value: enterpriseValue,
          format: "currency",
          currency: "USD",
          detail: "Metric × multiple",
        },
        secondary: [
          {
            key: "equityValue",
            label: "Equity value",
            value: equityValue,
            format: "currency",
            currency: "USD",
            detail: "EV - net debt",
          },
          {
            key: "netDebt",
            label: "Net debt",
            value: netDebt,
            format: "currency",
            currency: "USD",
            detail: "Debt - cash",
          },
        ],
        breakdown: [
          {
            key: "metricValue",
            label: "Metric value",
            value: values.metricValue,
            format: "currency",
            currency: "USD",
          },
          {
            key: "multiple",
            label: "Multiple",
            value: values.multiple,
            format: "multiple",
            maxFractionDigits: 2,
          },
          {
            key: "cash",
            label: "Cash",
            value: values.cash,
            format: "currency",
            currency: "USD",
          },
          {
            key: "debt",
            label: "Debt",
            value: values.debt,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "EV = metric × multiple; Equity value = EV + cash - debt",
    assumptions: [
      "Multiple is applied to a single metric definition (be consistent).",
      "Uses a simplified EV→equity bridge (cash and debt only).",
      "Multiple selection should reflect growth, margin, and retention context.",
    ],
    faqs: [
      {
        question: "ARR multiple vs revenue multiple: which should I use?",
        answer:
          "For subscription businesses, ARR multiples are common because ARR captures recurring run-rate. Revenue multiples can be more appropriate when revenue is mostly recurring and recognized consistently. Always match the multiple to the metric definition used by comps.",
      },
      {
        question: "Why does equity value differ from EV?",
        answer:
          "Because EV represents the operating business value before financing. Equity value is what remains for shareholders after adjusting for net debt and other claims.",
      },
    ],
  },
  {
    slug: "cohort-payback-curve-calculator",
    title: "Cohort Payback Curve Calculator",
    description:
      "Estimate when a cohort pays back CAC using a simple retention curve (two-stage churn) and optional expansion.",
    category: "saas-metrics",
    guideSlug: "cohort-payback-curve-guide",
    relatedGlossarySlugs: [
      "payback-period",
      "cac",
      "cohorted-ltv",
      "retention-rate",
      "logo-churn",
      "arpa",
      "gross-margin",
      "expansion-mrr",
    ],
    seo: {
      intro: [
        "Payback is a cash reality check. Even if LTV is high, you can still fail if payback is too slow for your cash runway.",
        "This calculator estimates cohort payback using a two-stage retention model (higher churn early, lower churn later) and optional expansion on surviving customers.",
      ],
      steps: [
        "Enter ARPA and gross margin to compute monthly gross profit per active customer.",
        "Enter CAC per new customer and your early vs steady-state churn assumptions.",
        "Optionally add monthly expansion to model upgrades/seat growth.",
        "Review the payback month and cumulative gross profit over the horizon.",
      ],
      pitfalls: [
        "Using blended churn across segments (plan/channel) and hiding weak cohorts.",
        "Using revenue instead of gross profit for payback (costs matter).",
        "Assuming churn is constant; early churn often dominates payback.",
      ],
    },
    inputs: [
      {
        key: "cac",
        label: "CAC (per new customer)",
        placeholder: "6000",
        prefix: "$",
        defaultValue: "6000",
        min: 0,
      },
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
        key: "earlyMonthlyChurnPercent",
        label: "Early monthly churn",
        placeholder: "6",
        suffix: "%",
        defaultValue: "6",
        min: 0,
        step: 0.1,
      },
      {
        key: "earlyMonths",
        label: "Early phase months",
        placeholder: "3",
        defaultValue: "3",
        min: 1,
        step: 1,
      },
      {
        key: "steadyMonthlyChurnPercent",
        label: "Steady-state monthly churn",
        placeholder: "1",
        suffix: "%",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyExpansionPercent",
        label: "Monthly expansion (optional)",
        help: "Expansion applied to surviving customers (set 0 to disable).",
        placeholder: "0.5",
        suffix: "%",
        defaultValue: "0.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "months",
        label: "Months to model",
        placeholder: "36",
        defaultValue: "36",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const horizon = Math.max(1, Math.floor(values.months));
      const earlyMonths = Math.max(1, Math.floor(values.earlyMonths));
      if (values.months !== horizon)
        warnings.push("Months was rounded down to a whole number.");
      if (values.earlyMonths !== earlyMonths)
        warnings.push("Early phase months was rounded down to a whole number.");

      const churnEarly = values.earlyMonthlyChurnPercent / 100;
      const churnSteady = values.steadyMonthlyChurnPercent / 100;
      const expansion = values.monthlyExpansionPercent / 100;
      const margin = values.grossMarginPercent / 100;

      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (margin <= 0) warnings.push("Gross margin must be greater than 0%.");
      if (churnEarly < 0 || churnEarly >= 1)
        warnings.push("Early churn must be between 0% and 99.9%.");
      if (churnSteady < 0 || churnSteady >= 1)
        warnings.push("Steady churn must be between 0% and 99.9%.");
      if (expansion < 0 || expansion >= 1)
        warnings.push("Expansion must be between 0% and 99.9%.");

      const retentionAt = (m: number) => {
        const early = Math.min(m, earlyMonths);
        const late = Math.max(0, m - earlyMonths);
        return (
          Math.pow(1 - churnEarly, early) * Math.pow(1 - churnSteady, late)
        );
      };

        let cumulativeGrossProfit = 0;
        let paybackMonth: number | null = null;
        let gp12 = 0;
        let gp24 = 0;
        let gpMonth1 = 0;

      for (let month = 1; month <= horizon; month++) {
          const active = retentionAt(month - 1);
          const arpa = values.arpaMonthly * Math.pow(1 + expansion, month - 1);
          const grossProfit = active * arpa * margin;
          if (month === 1) gpMonth1 = grossProfit;
          cumulativeGrossProfit += grossProfit;

        if (month === 12) gp12 = cumulativeGrossProfit;
        if (month === 24) gp24 = cumulativeGrossProfit;

        if (paybackMonth === null && cumulativeGrossProfit >= values.cac) {
          const prevCumulative = cumulativeGrossProfit - grossProfit;
          const remaining = values.cac - prevCumulative;
          const fraction = grossProfit > 0 ? remaining / grossProfit : 0;
          paybackMonth = (month - 1) + fraction;
        }
      }

      if (paybackMonth === null) {
        warnings.push("Payback not reached within the chosen horizon.");
      }

        const ltvToCac = values.cac > 0 ? cumulativeGrossProfit / values.cac : 0;
        const ltvToCac12 = values.cac > 0 ? gp12 / values.cac : null;
        const ltvToCac24 = values.cac > 0 ? gp24 / values.cac : null;
        const paybackShare =
          paybackMonth !== null ? paybackMonth / horizon : null;

      return {
        headline: {
          key: "payback",
          label: "Estimated payback (months)",
          value: paybackMonth ?? 0,
          format: "months",
          maxFractionDigits: 1,
          detail: paybackMonth === null ? "Not reached in horizon" : "Cumulative gross profit ≥ CAC",
        },
        secondary: [
          {
            key: "cumulativeGrossProfit",
            label: `Cumulative gross profit (${horizon} months)`,
            value: cumulativeGrossProfit,
            format: "currency",
            currency: "USD",
          },
          {
            key: "ltvToCac",
            label: "Gross profit LTV:CAC (over horizon)",
            value: ltvToCac,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Cumulative gross profit ÷ CAC",
          },
            {
              key: "gp12",
              label: "Cumulative gross profit (12 months)",
              value: gp12,
              format: "currency",
              currency: "USD",
              detail: horizon < 12 ? "Horizon < 12 months" : undefined,
            },
            {
              key: "gp24",
              label: "Cumulative gross profit (24 months)",
              value: gp24,
              format: "currency",
              currency: "USD",
              detail: horizon < 24 ? "Horizon < 24 months" : undefined,
            },
            {
              key: "gpMonth1",
              label: "Gross profit in month 1",
              value: gpMonth1,
              format: "currency",
              currency: "USD",
              detail: "Per original customer",
            },
            {
              key: "ltvToCac12",
              label: "LTV:CAC at 12 months",
              value: ltvToCac12 ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: ltvToCac12 === null ? "CAC is 0" : "Cumulative GP / CAC",
            },
            {
              key: "ltvToCac24",
              label: "LTV:CAC at 24 months",
              value: ltvToCac24 ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: ltvToCac24 === null ? "CAC is 0" : "Cumulative GP / CAC",
            },
            {
              key: "paybackShare",
              label: "Payback as % of horizon",
              value: paybackShare ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: paybackShare === null ? "Payback not reached" : "Payback / horizon",
            },
          ],
        breakdown: [
          {
            key: "cac",
            label: "CAC",
            value: values.cac,
            format: "currency",
            currency: "USD",
          },
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
            value: margin,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "expansion",
            label: "Monthly expansion",
            value: expansion,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Cumulative gross profit = Σ(retained_customers_t × ARPA_t × gross margin); Payback occurs when cumulative gross profit ≥ CAC",
    assumptions: [
      "Two-stage logo churn (early vs steady-state).",
      "Expansion applies to surviving customers' revenue each month (simplified).",
      "Gross margin is constant and used as a proxy for gross profit.",
    ],
    faqs: [
      {
        question: "Why model early churn separately?",
        answer:
          "Because early churn often dominates payback. Improving activation and onboarding can dramatically reduce payback even if steady-state churn is unchanged.",
      },
      {
        question: "Should I use logo churn or revenue churn?",
        answer:
          "Payback is about cash from customers. If expansion and downgrades matter, model revenue retention curves (NRR/GRR). Logo churn is still useful for intuition but can miss dollar effects.",
      },
    ],
  },
  {
    slug: "break-even-ctr-calculator",
    title: "Break-even CTR Calculator",
    description:
      "Compute the CTR required to break even (and hit a target) given CPM, CVR, AOV, and contribution margin.",
    category: "paid-ads",
    guideSlug: "break-even-ctr-guide",
    relatedGlossarySlugs: [
      "ctr",
      "cpm",
      "cvr",
      "aov",
      "contribution-margin",
      "break-even-cpm",
    ],
    seo: {
      intro: [
        "When buying impressions, CTR is a key lever: it determines how many clicks you generate per 1,000 impressions and therefore how many conversions you can drive at a given CVR.",
        "This calculator computes the break-even CTR required for a given CPM, and a target CTR that includes a profit buffer.",
      ],
      steps: [
        "Enter CPM, CVR, AOV, and contribution margin.",
        "Compute break-even CTR and add a buffer to get target CTR.",
        "Use this to sanity-check creative/placement performance targets.",
      ],
      pitfalls: [
        "Mixing click CVR with session CVR (denominator mismatch).",
        "Using revenue instead of contribution margin economics.",
        "Ignoring incrementality at scale (CTR and CVR can be inflated by retargeting).",
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
        step: 0.01,
      },
      {
        key: "cvrPercent",
        label: "CVR (click → conversion)",
        placeholder: "2.5",
        suffix: "%",
        defaultValue: "2.5",
        min: 0,
        step: 0.1,
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
        key: "contributionMarginPercent",
        label: "Contribution margin",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
        {
          key: "profitBufferPercent",
          label: "Profit buffer",
          placeholder: "20",
          suffix: "%",
          defaultValue: "20",
          min: 0,
          step: 0.1,
        },
        {
          key: "currentCtrPercent",
          label: "Current CTR (optional)",
          help: "Used to estimate current ROAS and profit per 1,000 impressions.",
          placeholder: "1.2",
          suffix: "%",
          defaultValue: "1.2",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const cvr = values.cvrPercent / 100;
        const margin = values.contributionMarginPercent / 100;
        const buffer = values.profitBufferPercent / 100;
        const currentCtr = values.currentCtrPercent / 100;

        if (values.cpm <= 0) warnings.push("CPM must be greater than 0.");
        if (cvr <= 0) warnings.push("CVR must be greater than 0%.");
        if (values.aov <= 0) warnings.push("AOV must be greater than 0.");
        if (margin <= 0) warnings.push("Contribution margin must be greater than 0%.");

        const denom = 1000 * cvr * values.aov * margin;
        const breakEvenCtr = denom > 0 ? values.cpm / denom : 0;
        const targetCtr =
          denom > 0 ? values.cpm / (denom * Math.max(0.0001, 1 - buffer)) : 0;

        const breakEvenCpc = breakEvenCtr > 0 ? values.cpm / (1000 * breakEvenCtr) : 0;
        const targetCpc = targetCtr > 0 ? values.cpm / (1000 * targetCtr) : 0;
        const currentClicksPerThousand = 1000 * currentCtr;
        const currentConversionsPerThousand = currentClicksPerThousand * cvr;
        const currentRevenuePerThousand = currentConversionsPerThousand * values.aov;
        const currentContributionPerThousand = currentRevenuePerThousand * margin;
        const currentProfitPerThousand = currentContributionPerThousand - values.cpm;
        const currentRoas = values.cpm > 0 ? currentRevenuePerThousand / values.cpm : 0;

        return {
          headline: {
            key: "targetCtr",
          label: "Target CTR",
          value: targetCtr,
          format: "percent",
          maxFractionDigits: 2,
          detail: "CTR needed to hit profit buffer at this CPM",
        },
        secondary: [
          {
            key: "breakEvenCtr",
            label: "Break-even CTR",
            value: breakEvenCtr,
            format: "percent",
            maxFractionDigits: 2,
            detail: "CTR needed where profit = 0 (variable economics)",
          },
          {
            key: "breakEvenCpc",
            label: "Implied break-even CPC",
            value: breakEvenCpc,
            format: "currency",
            currency: "USD",
            detail: "CPC implied by CPM and break-even CTR",
          },
            {
              key: "targetCpc",
              label: "Implied target CPC",
              value: targetCpc,
              format: "currency",
              currency: "USD",
              detail: "CPC implied by CPM and target CTR",
            },
            {
              key: "currentRoas",
              label: "Current ROAS (from current CTR)",
              value: currentRoas,
              format: "multiple",
              maxFractionDigits: 2,
              detail: currentCtr > 0 ? "Revenue per 1,000 / CPM" : "Add current CTR",
            },
            {
              key: "currentProfitPerThousand",
              label: "Current profit per 1,000 impressions",
              value: currentProfitPerThousand,
              format: "currency",
              currency: "USD",
              detail: currentCtr > 0 ? "Contribution per 1,000 - CPM" : "Add current CTR",
            },
          ],
          breakdown: [
            {
              key: "cpm",
            label: "CPM",
            value: values.cpm,
            format: "currency",
            currency: "USD",
          },
          {
            key: "cvr",
            label: "CVR",
            value: cvr,
            format: "percent",
            maxFractionDigits: 2,
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
      "Break-even CTR = CPM / (1000×CVR×AOV×margin); Target CTR = break-even / (1 - buffer)",
    assumptions: [
      "CVR is click-based (conversions ÷ clicks).",
      "Margin reflects variable economics (contribution margin).",
      "Ignores long-term LTV; best for one-time purchase economics.",
    ],
    faqs: [
      {
        question: "Why does required CTR increase when margin is lower?",
        answer:
          "Lower margin means less contribution per conversion. To cover the same CPM, you need more conversions per 1,000 impressions, which requires higher CTR (or higher CVR).",
      },
      {
        question: "Should I use this for subscription products?",
        answer:
          "Use it as a first-order sanity check, but subscription businesses should typically use LTV-based targets (because value is not captured in a single purchase AOV).",
      },
    ],
  },
  {
    slug: "dcf-sensitivity-calculator",
    title: "DCF Sensitivity Calculator",
    description:
      "Estimate how enterprise value changes with discount rate and terminal growth assumptions (simple 3×3 sensitivity).",
    category: "finance",
    guideSlug: "dcf-sensitivity-guide",
    relatedGlossarySlugs: ["dcf", "discount-rate", "terminal-value", "wacc", "sensitivity-analysis"],
    seo: {
      intro: [
        "Most DCFs are dominated by discount rate and terminal value assumptions. A sensitivity grid helps you see how fragile (or robust) your valuation is.",
        "This calculator computes enterprise value at a 3×3 grid around your base discount rate and terminal growth assumptions.",
      ],
      steps: [
        "Enter current annual free cash flow (FCF) and a simple forecast (years + growth).",
        "Enter base discount rate and terminal growth.",
        "Enter steps for discount rate and terminal growth to generate a 3×3 grid.",
      ],
      pitfalls: [
        "Terminal growth ≥ discount rate (invalid in perpetuity model).",
        "Treating a single scenario as precise (false precision).",
        "Using accounting profit instead of free cash flow.",
      ],
    },
    inputs: [
      {
        key: "annualFcf",
        label: "Current annual free cash flow (FCF)",
        placeholder: "5000000",
        prefix: "$",
        defaultValue: "5000000",
        min: 0,
      },
      {
        key: "forecastYears",
        label: "Forecast years",
        placeholder: "5",
        defaultValue: "5",
        min: 1,
        step: 1,
      },
      {
        key: "forecastGrowthPercent",
        label: "Forecast growth (annual)",
        placeholder: "15",
        suffix: "%",
        defaultValue: "15",
        min: -100,
        step: 0.1,
      },
      {
        key: "baseDiscountRatePercent",
        label: "Base discount rate",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
        step: 0.1,
      },
      {
        key: "discountRateStepPercent",
        label: "Discount rate step",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0,
        step: 0.1,
      },
      {
        key: "baseTerminalGrowthPercent",
        label: "Base terminal growth",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        min: -50,
        step: 0.1,
      },
      {
        key: "terminalGrowthStepPercent",
        label: "Terminal growth step",
        placeholder: "1",
        suffix: "%",
        defaultValue: "1",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const years = Math.max(1, Math.floor(values.forecastYears));
      if (values.forecastYears !== years)
        warnings.push("Forecast years was rounded down to a whole number.");

      const g = values.forecastGrowthPercent / 100;
      const baseR = values.baseDiscountRatePercent / 100;
      const rStep = values.discountRateStepPercent / 100;
      const baseTg = values.baseTerminalGrowthPercent / 100;
      const tgStep = values.terminalGrowthStepPercent / 100;

      if (values.annualFcf <= 0) warnings.push("FCF should be greater than 0 for valuation.");
      if (baseR <= 0) warnings.push("Discount rate must be greater than 0%.");

      const evAt = (r: number, tg: number) => {
        let pvForecast = 0;
        let fcf = values.annualFcf;
        for (let t = 1; t <= years; t++) {
          fcf = fcf * (1 + g);
          pvForecast += fcf / Math.pow(1 + r, t);
        }
        const fcfTerminal = fcf * (1 + tg);
        if (tg >= r) return null;
        const terminalValue = fcfTerminal / (r - tg);
        const pvTerminal = terminalValue / Math.pow(1 + r, years);
        return pvForecast + pvTerminal;
      };

      const rLow = Math.max(0.0001, baseR - rStep);
      const rMid = baseR;
      const rHigh = baseR + rStep;

      const tgLow = baseTg - tgStep;
      const tgMid = baseTg;
      const tgHigh = baseTg + tgStep;

      const baseEv = evAt(rMid, tgMid);
      if (baseEv === null) warnings.push("Base inputs are invalid: terminal growth must be less than discount rate.");
      const baseGap = rMid - tgMid;

      const grid: Array<{ key: string; label: string; value: number }> = [];
      const points: Array<[string, number, number]> = [
        ["ev_rLow_tgLow", rLow, tgLow],
        ["ev_rLow_tgMid", rLow, tgMid],
        ["ev_rLow_tgHigh", rLow, tgHigh],
        ["ev_rMid_tgLow", rMid, tgLow],
        ["ev_rMid_tgMid", rMid, tgMid],
        ["ev_rMid_tgHigh", rMid, tgHigh],
        ["ev_rHigh_tgLow", rHigh, tgLow],
        ["ev_rHigh_tgMid", rHigh, tgMid],
        ["ev_rHigh_tgHigh", rHigh, tgHigh],
      ];

      for (const [key, r, tg] of points) {
        const ev = evAt(r, tg);
        if (ev === null) continue;
        grid.push({
          key,
          label: `EV @ ${(r * 100).toFixed(1)}% / ${(tg * 100).toFixed(1)}%`,
          value: ev,
        });
      }

      if (grid.length < 5) {
        warnings.push(
          "Many grid points are invalid because terminal growth is too close to or above the discount rate. Reduce terminal growth or increase discount rate.",
        );
      }

      const headlineEv = baseEv ?? (grid[0]?.value ?? 0);

      return {
        headline: {
          key: "evBase",
          label: "Enterprise value (base case)",
          value: headlineEv,
          format: "currency",
          currency: "USD",
          detail: `Base: ${values.baseDiscountRatePercent}% / ${values.baseTerminalGrowthPercent}%`,
        },
        secondary: grid.map((g) => ({
          key: g.key,
          label: g.label,
          value: g.value,
          format: "currency",
          currency: "USD",
        })),
        breakdown: [
          {
            key: "baseGap",
            label: "Base (r - g) gap",
            value: baseGap,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Keep positive; smaller gap inflates terminal value",
          },
        ],
        warnings,
      };
    },
    formula:
      "EV = Σ(FCF_t/(1+r)^t) + (FCF_(n+1)/(r - g_terminal))/(1+r)^n; Sensitivity varies r and g_terminal",
    assumptions: [
      "Uses a simple constant growth forecast during the explicit period.",
      "Terminal value uses a perpetuity growth model.",
      "Only shows a small grid; use broader scenarios for full sensitivity analysis.",
    ],
    faqs: [
      {
        question: "Why do some grid points disappear?",
        answer:
          "Because the perpetuity model requires terminal growth to be less than the discount rate (r > g). When g is too high relative to r, the terminal value becomes mathematically invalid.",
      },
      {
        question: "How should I pick the steps?",
        answer:
          "A common starting point is ±1–3% for discount rate and ±0.5–1% for terminal growth. If valuation changes wildly, you need more conservative assumptions and/or better forecasting detail.",
      },
    ],
  },
  {
    slug: "ab-test-sample-size-calculator",
    title: "A/B Test Sample Size Calculator",
    description:
      "Estimate sample size per variant for a conversion rate A/B test given baseline CVR, MDE, significance, and power.",
    category: "paid-ads",
    guideSlug: "ab-test-sample-size-guide",
    relatedGlossarySlugs: ["ab-test", "statistical-significance", "power", "mde", "cvr"],
    seo: {
      intro: [
        "A/B tests are easy to misread when samples are small. Planning sample size upfront helps you avoid false positives, false negatives, and endless tests.",
        "This calculator estimates required sample size per variant for a conversion rate test using a standard normal approximation (two-sided).",
      ],
      steps: [
        "Enter baseline conversion rate (CVR) and your minimum detectable effect (MDE).",
        "Choose significance level (alpha) and statistical power (1 - beta).",
        "Use the output as a baseline and add buffer for tracking loss and seasonality.",
      ],
      pitfalls: [
        "Stopping early when a result looks good (peeking inflates false positives).",
        "Using an MDE that’s smaller than what you can act on (forces huge samples).",
        "Mixing click-based and session-based conversion rates (definition mismatch).",
      ],
    },
    inputs: [
      {
        key: "baselineCvrPercent",
        label: "Baseline conversion rate",
        placeholder: "2.5",
        suffix: "%",
        defaultValue: "2.5",
        min: 0.01,
        step: 0.01,
      },
      {
        key: "mdePercentPoints",
        label: "MDE (absolute lift)",
        help: "Minimum detectable effect as percentage points (e.g., 0.5 means 2.5% → 3.0%).",
        placeholder: "0.5",
        suffix: "pp",
        defaultValue: "0.5",
        min: 0.01,
        step: 0.01,
      },
      {
        key: "alphaPercent",
        label: "Significance level (alpha)",
        placeholder: "5",
        suffix: "%",
        defaultValue: "5",
        min: 0.1,
        step: 0.1,
      },
      {
        key: "powerPercent",
        label: "Power (1 - beta)",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 50,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const p1 = values.baselineCvrPercent / 100;
      const delta = values.mdePercentPoints / 100;
      const p2 = p1 + delta;
      const alpha = values.alphaPercent / 100;
      const power = values.powerPercent / 100;

      if (p1 <= 0 || p1 >= 1) warnings.push("Baseline CVR must be between 0% and 100%.");
      if (delta <= 0) warnings.push("MDE must be greater than 0.");
      if (p2 <= 0 || p2 >= 1) warnings.push("Baseline + MDE must be between 0% and 100%.");
      if (alpha <= 0 || alpha >= 1) warnings.push("Alpha must be between 0% and 100%.");
      if (power <= 0 || power >= 1) warnings.push("Power must be between 0% and 100%.");

      const z = (p: number) => {
        // Acklam's inverse normal approximation for p in (0,1)
        const a = [
          -3.969683028665376e1,
          2.209460984245205e2,
          -2.759285104469687e2,
          1.38357751867269e2,
          -3.066479806614716e1,
          2.506628277459239,
        ];
        const b = [
          -5.447609879822406e1,
          1.615858368580409e2,
          -1.556989798598866e2,
          6.680131188771972e1,
          -1.328068155288572e1,
        ];
        const c = [
          -7.784894002430293e-3,
          -3.223964580411365e-1,
          -2.400758277161838,
          -2.549732539343734,
          4.374664141464968,
          2.938163982698783,
        ];
        const d = [
          7.784695709041462e-3,
          3.224671290700398e-1,
          2.445134137142996,
          3.754408661907416,
        ];

        const plow = 0.02425;
        const phigh = 1 - plow;
        let q: number;

        if (p < plow) {
          q = Math.sqrt(-2 * Math.log(p));
          return (
            (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q +
              c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
          );
        }
        if (p > phigh) {
          q = Math.sqrt(-2 * Math.log(1 - p));
          return (
            -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q +
              c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)
          );
        }

        const qCentral = p - 0.5;
        const r = qCentral * qCentral;
        return (
          (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r +
            a[5]) *
            qCentral /
          (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1)
        );
      };

      const zAlpha = z(1 - alpha / 2);
      const zBeta = z(power);

      const pBar = (p1 + p2) / 2;
      const s1 = Math.sqrt(2 * pBar * (1 - pBar));
      const s2 = Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
      const n =
        delta > 0
          ? (Math.pow(zAlpha * s1 + zBeta * s2, 2) / Math.pow(delta, 2))
          : 0;
      const nPerVariant = Math.ceil(n);

      const total = nPerVariant * 2;

      return {
        headline: {
          key: "nPerVariant",
          label: "Required sample size per variant",
          value: nPerVariant,
          format: "number",
          maxFractionDigits: 0,
          detail: "Two-sided test (normal approximation)",
        },
        secondary: [
          {
            key: "totalSample",
            label: "Total sample size (A + B)",
            value: total,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "p1",
            label: "Baseline CVR",
            value: p1,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "p2",
            label: "Variant CVR (baseline + MDE)",
            value: p2,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "n ≈ ((z_(1-α/2)√(2p̄(1-p̄)) + z_(power)√(p1(1-p1)+p2(1-p2)))²) / (p2-p1)²",
    assumptions: [
      "Two-sided z-test approximation for proportions.",
      "Independent samples and stable baseline rate.",
      "Does not adjust for multiple testing or sequential stopping rules.",
    ],
    faqs: [
      {
        question: "Why does sample size explode when CVR is low?",
        answer:
          "When conversion is rare, noise is high relative to the signal. Detecting small lifts requires much larger samples.",
      },
      {
        question: "Should I run until I hit the sample size exactly?",
        answer:
          "Use it as a baseline and add buffer. Also avoid peeking; if you want to stop early, use sequential testing methods instead of naive p-values.",
      },
    ],
  },
  {
    slug: "cpl-to-cac-calculator",
    title: "CPL to CAC Calculator",
    description:
      "Convert cost per lead (CPL) into CAC using lead-to-customer rate (and compute targets).",
    category: "paid-ads",
    guideSlug: "cpl-to-cac-guide",
    relatedGlossarySlugs: ["cpl", "cac", "cpa", "conversion-rate", "lead-to-customer-rate"],
    seo: {
      intro: [
        "Lead gen metrics can be misleading: a low CPL can still produce an expensive CAC if lead quality or close rate is weak.",
        "This calculator translates CPL into CAC using lead-to-customer conversion and shows what close rate you need to hit a target CAC.",
      ],
      steps: [
        "Enter your cost per lead (CPL).",
        "Enter the % of leads that become paying customers (lead-to-customer rate).",
        "Optionally set a target CAC to compute required lead-to-customer rate.",
      ],
      pitfalls: [
        "Using MQLs as leads without a consistent definition (denominator drift).",
        "Ignoring sales cycle length and cohort lag (today's leads close later).",
        "Optimizing for volume and destroying lead quality (CAC rises).",
      ],
    },
    inputs: [
      {
        key: "cpl",
        label: "Cost per lead (CPL)",
        placeholder: "80",
        prefix: "$",
        defaultValue: "80",
        min: 0,
      },
      {
        key: "leadToCustomerRatePercent",
        label: "Lead-to-customer rate",
        placeholder: "5",
        suffix: "%",
        defaultValue: "5",
        min: 0.01,
        step: 0.01,
      },
        {
          key: "targetCac",
          label: "Target CAC (optional)",
          help: "Set 0 to disable target rate calculation.",
          placeholder: "1500",
          prefix: "$",
          defaultValue: "1500",
          min: 0,
        },
        {
          key: "salesCostPerLead",
          label: "Additional sales cost per lead (optional)",
          help: "Use to estimate all-in CPL when sales costs are not included.",
          placeholder: "0",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const rate = values.leadToCustomerRatePercent / 100;
        if (values.cpl <= 0) warnings.push("CPL must be greater than 0.");
        if (rate <= 0) warnings.push("Lead-to-customer rate must be greater than 0%.");

        const cac = rate > 0 ? values.cpl / rate : 0;
        const allInCpl = values.cpl + Math.max(0, values.salesCostPerLead);
        const allInCac = rate > 0 ? allInCpl / rate : 0;
        const requiredRate =
          values.targetCac > 0 ? safeDivide(values.cpl, values.targetCac) : null;

      return {
        headline: {
          key: "cac",
          label: "Estimated CAC",
          value: cac,
          format: "currency",
          currency: "USD",
          detail: "CPL ÷ lead-to-customer rate",
        },
        secondary: [
          {
            key: "rate",
            label: "Lead-to-customer rate",
            value: rate,
            format: "percent",
            maxFractionDigits: 2,
          },
            {
              key: "requiredRate",
              label: "Required lead-to-customer rate for target CAC",
              value: requiredRate ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: requiredRate === null ? "Target CAC disabled" : "CPL ÷ target CAC",
            },
            {
              key: "allInCpl",
              label: "All-in CPL (with sales cost)",
              value: allInCpl,
              format: "currency",
              currency: "USD",
              detail: values.salesCostPerLead > 0 ? "CPL + sales cost per lead" : "Add sales cost per lead",
            },
            {
              key: "allInCac",
              label: "All-in CAC (with sales cost)",
              value: allInCac,
              format: "currency",
              currency: "USD",
              detail: values.salesCostPerLead > 0 ? "All-in CPL ÷ lead-to-customer rate" : "Add sales cost per lead",
            },
          ],
          breakdown: [
            {
              key: "cpl",
              label: "CPL",
              value: values.cpl,
              format: "currency",
              currency: "USD",
            },
            {
              key: "salesCostPerLead",
              label: "Sales cost per lead",
              value: values.salesCostPerLead,
              format: "currency",
              currency: "USD",
            },
            {
              key: "targetCac",
              label: "Target CAC",
              value: values.targetCac,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "CAC = CPL ÷ (lead-to-customer rate)",
    assumptions: [
      "Lead-to-customer rate reflects final paying customers (not MQLs).",
      "CPL and close rate are measured over consistent time windows.",
      "Excludes sales salaries unless your CPL includes them (definition matters).",
    ],
    faqs: [
      {
        question: "Should I include sales cost in CPL or CAC?",
        answer:
          "For planning, include sales salaries and tooling in CAC (blended CAC). For channel optimization, teams often track paid CPL/CPA separately. The key is labeling and consistency.",
      },
      {
        question: "What if leads convert over multiple months?",
        answer:
          "Then use cohort-based tracking (lead cohorts) and measure lead-to-customer rate after enough time has passed. Short windows can undercount conversions and overstate CAC.",
      },
    ],
  },
  {
    slug: "break-even-cvr-calculator",
    title: "Break-even CVR Calculator",
    description:
      "Compute the CVR required to break even (and hit a target) given CPM, CTR, AOV, and contribution margin.",
    category: "paid-ads",
    guideSlug: "break-even-cvr-guide",
    relatedGlossarySlugs: ["cvr", "cpm", "ctr", "aov", "contribution-margin", "break-even-cpm"],
    seo: {
      intro: [
        "When buying impressions, CVR is a major profit lever. If CVR is too low, even great CTR won’t save economics at a given CPM.",
        "This calculator computes break-even CVR at a given CPM and CTR, plus a target CVR with a profit buffer.",
      ],
      steps: [
        "Enter CPM and CTR to determine cost per click implied by impressions buying.",
        "Enter AOV and contribution margin to determine contribution per conversion.",
        "Compute required CVR for break-even and target buffer.",
      ],
      pitfalls: [
        "Mixing click CVR with session CVR (denominator mismatch).",
        "Using revenue margin instead of contribution margin (overstates economics).",
        "Ignoring incremental lift at scale (retargeting bias).",
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
        step: 0.01,
      },
      {
        key: "ctrPercent",
        label: "CTR",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0.01,
        step: 0.01,
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
        key: "contributionMarginPercent",
        label: "Contribution margin",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
        {
          key: "profitBufferPercent",
          label: "Profit buffer",
          placeholder: "20",
          suffix: "%",
          defaultValue: "20",
          min: 0,
          step: 0.1,
        },
        {
          key: "currentCvrPercent",
          label: "Current CVR (optional)",
          help: "Used to estimate current ROAS and profit per 1,000 impressions.",
          placeholder: "2.0",
          suffix: "%",
          defaultValue: "2.0",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const ctr = values.ctrPercent / 100;
        const margin = values.contributionMarginPercent / 100;
        const buffer = values.profitBufferPercent / 100;
        const currentCvr = values.currentCvrPercent / 100;

      if (values.cpm <= 0) warnings.push("CPM must be greater than 0.");
      if (ctr <= 0) warnings.push("CTR must be greater than 0%.");
      if (values.aov <= 0) warnings.push("AOV must be greater than 0.");
      if (margin <= 0) warnings.push("Contribution margin must be greater than 0%.");

      const denom = 1000 * ctr * values.aov * margin;
        const breakEvenCvr = denom > 0 ? values.cpm / denom : 0;
        const targetCvr =
          denom > 0 ? values.cpm / (denom * Math.max(0.0001, 1 - buffer)) : 0;

        const impliedCpc = ctr > 0 ? values.cpm / (1000 * ctr) : 0;
        const currentClicksPerThousand = 1000 * ctr;
        const currentConversionsPerThousand = currentClicksPerThousand * currentCvr;
        const currentRevenuePerThousand = currentConversionsPerThousand * values.aov;
        const currentContributionPerThousand = currentRevenuePerThousand * margin;
        const currentProfitPerThousand = currentContributionPerThousand - values.cpm;
        const currentRoas = values.cpm > 0 ? currentRevenuePerThousand / values.cpm : 0;

        return {
          headline: {
            key: "targetCvr",
          label: "Target CVR",
          value: targetCvr,
          format: "percent",
          maxFractionDigits: 2,
          detail: "CVR needed to hit profit buffer at this CPM/CTR",
        },
        secondary: [
          {
            key: "breakEvenCvr",
            label: "Break-even CVR",
            value: breakEvenCvr,
            format: "percent",
            maxFractionDigits: 2,
            detail: "CVR where profit = 0 (variable economics)",
          },
            {
              key: "impliedCpc",
              label: "Implied CPC from CPM and CTR",
              value: impliedCpc,
              format: "currency",
              currency: "USD",
            },
            {
              key: "currentRoas",
              label: "Current ROAS (from current CVR)",
              value: currentRoas,
              format: "multiple",
              maxFractionDigits: 2,
              detail: currentCvr > 0 ? "Revenue per 1,000 / CPM" : "Add current CVR",
            },
            {
              key: "currentProfitPerThousand",
              label: "Current profit per 1,000 impressions",
              value: currentProfitPerThousand,
              format: "currency",
              currency: "USD",
              detail: currentCvr > 0 ? "Contribution per 1,000 - CPM" : "Add current CVR",
            },
          ],
        breakdown: [
          {
            key: "cpm",
            label: "CPM",
            value: values.cpm,
            format: "currency",
            currency: "USD",
          },
          {
            key: "ctr",
            label: "CTR",
            value: ctr,
            format: "percent",
            maxFractionDigits: 2,
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
      "Break-even CVR = CPM / (1000×CTR×AOV×margin); Target CVR = break-even / (1-buffer)",
    assumptions: [
      "CTR and CVR are measured on a click basis (consistent denominators).",
      "Margin reflects variable economics (contribution margin).",
      "Best for one-time purchase economics; subscription needs LTV-based targets.",
    ],
    faqs: [
      {
        question: "If my CVR is below break-even, what can I do?",
        answer:
          "Increase CVR via landing page/offer improvements, increase AOV, improve margin, lower CPM, or improve CTR. If none are feasible, the placement may not be viable.",
      },
      {
        question: "How does this relate to break-even CTR?",
        answer:
          "They’re symmetric levers. Break-even CTR and CVR are both derived from the same underlying economics; improving either increases allowable CPM.",
      },
    ],
  },
  {
    slug: "click-through-conversion-calculator",
    title: "Click-through Conversion Rate Calculator",
    description:
      "Calculate click-through conversion rate (click-to-conversion CVR) and estimate required clicks for target conversions.",
    category: "paid-ads",
    guideSlug: "paid-ads-measurement-hub-guide",
    relatedGlossarySlugs: ["click-through-conversion", "cvr", "ctr", "conversion-rate"],
    seo: {
      intro: [
        "Click-through conversion rate (click CVR) measures conversions divided by clicks. It tells you how efficiently clicks turn into outcomes.",
        "Use click-based CVR when your spend is click-driven (CPC) or when you want a clean post-click view that avoids session definition drift.",
      ],
      steps: [
        "Enter total clicks and conversions for the same time window.",
        "Review click CVR and the implied clicks per conversion.",
        "Optionally enter a target conversions number to estimate required clicks.",
      ],
      pitfalls: [
        "Mixing clicks from one attribution window with conversions from another.",
        "Using session-based CVR when your denominator is clicks (unit mismatch).",
        "Comparing blended CVR without segmenting by campaign or landing page.",
      ],
    },
    inputs: [
      {
        key: "clicks",
        label: "Clicks (period)",
        placeholder: "12000",
        defaultValue: "12000",
        min: 0,
      },
      {
        key: "conversions",
        label: "Conversions (period)",
        placeholder: "360",
        defaultValue: "360",
        min: 0,
      },
        {
          key: "targetConversions",
          label: "Target conversions (optional)",
          placeholder: "500",
          defaultValue: "500",
          min: 0,
        },
        {
          key: "spend",
          label: "Ad spend (optional)",
          help: "Used to estimate CPC and CPA from clicks and conversions.",
          placeholder: "12000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
        {
          key: "revenue",
          label: "Revenue (optional)",
          help: "Used to estimate ROAS from spend.",
          placeholder: "36000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.clicks <= 0) warnings.push("Clicks must be greater than 0.");
        if (values.conversions < 0) warnings.push("Conversions must be 0 or greater.");
        if (values.conversions > values.clicks)
          warnings.push("Conversions exceed clicks (check inputs).");

        const cvr = safeDivide(values.conversions, values.clicks);
        const clicksPerConversion =
          values.conversions > 0 ? values.clicks / values.conversions : null;
        const requiredClicksForTarget =
          cvr && cvr > 0 ? values.targetConversions / cvr : null;
        const cpc = values.spend > 0 ? safeDivide(values.spend, values.clicks) : null;
        const cpa =
          values.spend > 0 && values.conversions > 0
            ? safeDivide(values.spend, values.conversions)
            : null;
        const roas = values.spend > 0 ? safeDivide(values.revenue, values.spend) : null;

        return {
          headline: {
            key: "clickCvr",
            label: "Click-through CVR",
          value: cvr ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Conversions ÷ clicks",
        },
        secondary: [
          {
            key: "clicksPerConversion",
            label: "Clicks per conversion",
            value: clicksPerConversion ?? 0,
            format: "number",
            maxFractionDigits: 1,
            detail: values.conversions > 0 ? "Clicks ÷ conversions" : "No conversions",
          },
            {
              key: "requiredClicks",
              label: "Required clicks for target",
              value: requiredClicksForTarget ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: cvr && cvr > 0 ? "Target conversions ÷ CVR" : "Enter valid clicks",
            },
            {
              key: "cpc",
              label: "CPC (from spend)",
              value: cpc ?? 0,
              format: "currency",
              currency: "USD",
              detail: cpc === null ? "Add spend" : "Spend ÷ clicks",
            },
            {
              key: "cpa",
              label: "CPA (from spend)",
              value: cpa ?? 0,
              format: "currency",
              currency: "USD",
              detail: cpa === null ? "Add spend and conversions" : "Spend ÷ conversions",
            },
            {
              key: "roas",
              label: "ROAS (from revenue)",
              value: roas ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: roas === null ? "Add spend and revenue" : "Revenue ÷ spend",
            },
          ],
          breakdown: [
            {
              key: "clicks",
              label: "Clicks",
            value: values.clicks,
            format: "number",
            maxFractionDigits: 0,
          },
            {
              key: "conversions",
              label: "Conversions",
              value: values.conversions,
              format: "number",
              maxFractionDigits: 0,
            },
            {
              key: "spend",
              label: "Spend",
              value: values.spend,
              format: "currency",
              currency: "USD",
            },
            {
              key: "revenue",
              label: "Revenue",
              value: values.revenue,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
    formula: "Click-through CVR = conversions ÷ clicks",
    assumptions: [
      "Clicks and conversions are measured over the same window and attribution rules.",
      "Uses click-based CVR (not session-based).",
    ],
    faqs: [
      {
        question: "Is this the same as session CVR?",
        answer:
          "No. Session CVR uses sessions as the denominator. If your spend is click-based, click CVR keeps units consistent.",
      },
      {
        question: "What if my conversions lag clicks?",
        answer:
          "Use a longer attribution window or wait for lag to settle before calculating CVR. Short windows often understate true conversion rate.",
      },
    ],
  },
  {
    slug: "retention-targets-planner-calculator",
    title: "Retention Targets Planner (NRR/GRR)",
    description:
      "Compute required expansion (for a target NRR) and allowable churn+contraction (for a target GRR) using monthly rates.",
    category: "saas-metrics",
    guideSlug: "retention-targets-planner-guide",
    relatedGlossarySlugs: [
      "nrr",
      "grr",
      "net-retention",
      "gross-retention",
      "expansion-mrr",
      "contraction-mrr",
      "revenue-churn",
    ],
    seo: {
      intro: [
        "Targets are only useful if they translate into actionable levers. NRR targets translate into required expansion; GRR targets translate into a maximum combined churn+contraction.",
        "This calculator uses monthly rates and shows implied annualized outcomes to help planning.",
      ],
      steps: [
        "Enter current monthly churn and contraction rates (revenue).",
        "Enter your target monthly NRR and GRR.",
        "Use outputs to set expansion targets and churn reduction goals by segment.",
      ],
      pitfalls: [
        "Mixing annual and monthly units (annual NRR used as monthly).",
        "Using blended rates across segments (plan/channel) and hiding weak cohorts.",
        "Assuming churn reduction and expansion are independent (often correlated).",
      ],
    },
    inputs: [
      {
        key: "monthlyChurnPercent",
        label: "Monthly churn rate (revenue)",
        placeholder: "1.5",
        suffix: "%",
        defaultValue: "1.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "monthlyContractionPercent",
        label: "Monthly contraction rate",
        placeholder: "0.5",
        suffix: "%",
        defaultValue: "0.5",
        min: 0,
        step: 0.1,
      },
      {
        key: "targetMonthlyNrrPercent",
        label: "Target monthly NRR",
        placeholder: "102",
        suffix: "%",
        defaultValue: "102",
        min: 0,
        step: 0.1,
      },
        {
          key: "targetMonthlyGrrPercent",
          label: "Target monthly GRR",
          placeholder: "98",
          suffix: "%",
          defaultValue: "98",
          min: 0,
          step: 0.1,
        },
        {
          key: "currentMonthlyExpansionPercent",
          label: "Current monthly expansion (optional)",
          placeholder: "2",
          suffix: "%",
          defaultValue: "2",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const churn = values.monthlyChurnPercent / 100;
        const contraction = values.monthlyContractionPercent / 100;
        const targetNrr = values.targetMonthlyNrrPercent / 100;
        const targetGrr = values.targetMonthlyGrrPercent / 100;
        const currentExpansion = values.currentMonthlyExpansionPercent / 100;

        if (targetNrr <= 0) warnings.push("Target NRR must be greater than 0%.");
        if (targetGrr <= 0) warnings.push("Target GRR must be greater than 0%.");
        if (currentExpansion < 0 || currentExpansion >= 1)
          warnings.push("Current expansion must be between 0% and 99.9%.");

        const requiredExpansion = targetNrr - 1 + contraction + churn;
        const maxChurnPlusContraction = 1 - targetGrr;
        const currentChurnPlusContraction = churn + contraction;
        const gapToGrr = currentChurnPlusContraction - maxChurnPlusContraction;
        const currentMonthlyNrr = 1 + currentExpansion - contraction - churn;
        const currentMonthlyGrr = 1 - contraction - churn;
        const gapToNrr = requiredExpansion - currentExpansion;

        const annualizedNrr = Math.pow(targetNrr, 12) - 1;
        const annualizedGrr = Math.pow(targetGrr, 12) - 1;
        const annualizedCurrentNrr = Math.pow(currentMonthlyNrr, 12) - 1;
        const annualizedCurrentGrr = Math.pow(currentMonthlyGrr, 12) - 1;

      if (requiredExpansion < 0) {
        warnings.push(
          "Required expansion is negative with these inputs (target NRR is below 100% after churn+contraction). Check targets.",
        );
      }
      if (maxChurnPlusContraction < 0) {
        warnings.push("Target GRR is above 100%, which is not typical for GRR.");
      }

      return {
        headline: {
          key: "requiredExpansion",
          label: "Required monthly expansion rate (to hit target NRR)",
          value: Math.max(0, requiredExpansion),
          format: "percent",
          maxFractionDigits: 2,
          detail: "Target NRR - 1 + churn + contraction",
        },
        secondary: [
          {
            key: "maxChurnContraction",
            label: "Max churn + contraction (to hit target GRR)",
            value: Math.max(0, maxChurnPlusContraction),
            format: "percent",
            maxFractionDigits: 2,
            detail: "1 - target GRR",
          },
          {
            key: "currentChurnContraction",
            label: "Current churn + contraction",
            value: currentChurnPlusContraction,
            format: "percent",
            maxFractionDigits: 2,
          },
            {
              key: "gapToGrr",
              label: "Gap to GRR target (needs reduction)",
              value: Math.max(0, gapToGrr),
              format: "percent",
              maxFractionDigits: 2,
              detail: gapToGrr > 0 ? "Reduce churn and/or contraction" : "At or better than target",
            },
            {
              key: "gapToNrr",
              label: "Gap to NRR target (needs expansion)",
              value: Math.max(0, gapToNrr),
              format: "percent",
              maxFractionDigits: 2,
              detail: gapToNrr > 0 ? "Increase expansion or reduce churn" : "At or above target",
            },
            {
              key: "annualizedNrr",
              label: "Implied annual NRR (from target monthly)",
              value: annualizedNrr,
              format: "percent",
              maxFractionDigits: 0,
            },
            {
              key: "annualizedGrr",
              label: "Implied annual GRR (from target monthly)",
              value: annualizedGrr,
              format: "percent",
              maxFractionDigits: 0,
            },
            {
              key: "currentMonthlyNrr",
              label: "Current monthly NRR (from inputs)",
              value: currentMonthlyNrr,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "currentMonthlyGrr",
              label: "Current monthly GRR (from inputs)",
              value: currentMonthlyGrr,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "annualizedCurrentNrr",
              label: "Implied annual NRR (current)",
              value: annualizedCurrentNrr,
              format: "percent",
              maxFractionDigits: 0,
            },
            {
              key: "annualizedCurrentGrr",
              label: "Implied annual GRR (current)",
              value: annualizedCurrentGrr,
              format: "percent",
              maxFractionDigits: 0,
            },
          ],
        breakdown: [
          {
            key: "churn",
            label: "Monthly churn",
            value: churn,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "contraction",
            label: "Monthly contraction",
            value: contraction,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "targetNrr",
            label: "Target monthly NRR",
            value: targetNrr,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "targetGrr",
            label: "Target monthly GRR",
            value: targetGrr,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Target NRR = 1 + expansion - contraction - churn; Target GRR = 1 - contraction - churn",
    assumptions: [
      "Rates are monthly and measured on the same revenue base.",
      "Target NRR/GRR are for an existing cohort (exclude new customers).",
      "Annualized rates are compound transformations of monthly targets.",
    ],
    faqs: [
      {
        question: "Why annualizing monthly NRR/GRR can look extreme?",
        answer:
          "Because compounding is powerful. A small monthly difference compounds over 12 months, so always sanity-check annualized implied outcomes.",
      },
      {
        question: "Should I set targets by segment?",
        answer:
          "Yes. Blended NRR/GRR can hide weak segments. Set targets by plan, channel, cohort, and customer size to make them actionable.",
      },
    ],
  },
  {
    slug: "quota-attainment-calculator",
    title: "Quota Attainment Calculator",
    description:
      "Calculate quota attainment and pacing from booked revenue to date, quota, and days elapsed in the period.",
    category: "saas-metrics",
    guideSlug: "quota-attainment-guide",
    relatedGlossarySlugs: ["quota", "quota-attainment", "pipeline", "sales-cycle"],
    seo: {
      intro: [
        "Quota attainment shows how close you are to a revenue target. Pacing adds context by projecting end-of-period bookings based on progress so far.",
        "Use pacing for weekly check-ins, but sanity-check with pipeline coverage and win rate to avoid false confidence.",
      ],
      steps: [
        "Enter the period quota and booked revenue so far.",
        "Enter how many days have elapsed and total days in the period.",
        "Review attainment %, projected bookings, and required daily pace to hit quota.",
      ],
      pitfalls: [
        "Using calendar days when only business days matter (be consistent).",
        "Assuming early-period pace will hold (deal timing is lumpy).",
        "Ignoring sales cycle length and pipeline coverage when forecasting.",
      ],
    },
    inputs: [
      {
        key: "quota",
        label: "Quota (period)",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "bookedToDate",
        label: "Booked to date",
        placeholder: "180000",
        prefix: "$",
        defaultValue: "180000",
        min: 0,
      },
      {
        key: "daysElapsed",
        label: "Days elapsed",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
      {
        key: "daysInPeriod",
        label: "Total days in period",
        placeholder: "30",
        defaultValue: "30",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const daysElapsed = Math.floor(values.daysElapsed);
      const daysInPeriod = Math.floor(values.daysInPeriod);

      if (values.quota <= 0) warnings.push("Quota must be greater than 0.");
      if (values.bookedToDate < 0) warnings.push("Booked to date must be 0 or greater.");
      if (daysElapsed <= 0) warnings.push("Days elapsed must be greater than 0.");
      if (daysInPeriod <= 0) warnings.push("Days in period must be greater than 0.");
      if (daysElapsed > daysInPeriod)
        warnings.push("Days elapsed cannot be greater than total days in period.");

      const attainment = safeDivide(values.bookedToDate, values.quota);
      const projectedBookings =
        daysElapsed > 0 ? (values.bookedToDate / daysElapsed) * daysInPeriod : 0;
      const projectedAttainment = safeDivide(projectedBookings, values.quota);
      const onTrackToDate =
        daysInPeriod > 0 ? (values.quota * daysElapsed) / daysInPeriod : 0;
      const paceRatio =
        onTrackToDate > 0 ? values.bookedToDate / onTrackToDate : null;

      const remainingDays = Math.max(0, daysInPeriod - daysElapsed);
      const remainingToQuota = Math.max(0, values.quota - values.bookedToDate);
      const requiredPerDay =
        remainingDays > 0 ? remainingToQuota / remainingDays : remainingToQuota > 0 ? 0 : 0;

      return {
        headline: {
          key: "attainment",
          label: "Quota attainment",
          value: attainment ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Booked ÷ quota",
        },
        secondary: [
          {
            key: "projected",
            label: "Projected bookings (at current pace)",
            value: projectedBookings,
            format: "currency",
            currency: "USD",
            detail: "Booked/day × total days",
          },
          {
            key: "projectedAttainment",
            label: "Projected attainment (at current pace)",
            value: projectedAttainment ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Projected bookings ÷ quota",
          },
          {
            key: "remaining",
            label: "Remaining to quota",
            value: remainingToQuota,
            format: "currency",
            currency: "USD",
          },
          {
            key: "onTrack",
            label: "On-track bookings by today",
            value: onTrackToDate,
            format: "currency",
            currency: "USD",
            detail: "Quota × (days elapsed ÷ total days)",
          },
          {
            key: "paceRatio",
            label: "Pace vs on-track",
            value: paceRatio ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Booked to date ÷ on-track",
          },
          {
            key: "requiredPerDay",
            label: "Required per day (remaining)",
            value: requiredPerDay,
            format: "currency",
            currency: "USD",
            detail: remainingDays > 0 ? "Remaining ÷ remaining days" : "No remaining days",
          },
        ],
        warnings,
      };
    },
    formula:
      "Attainment = booked ÷ quota; projected bookings ≈ (booked ÷ days elapsed) × days in period",
    assumptions: [
      "Uses a simple linear pace projection (deal timing is often lumpy).",
      "Uses calendar-day pacing; use business days if that matches your process.",
      "Quota and booked revenue are measured on the same basis (bookings/ARR/ACV).",
    ],
    faqs: [
      {
        question: "Should I pace using business days?",
        answer:
          "If your team sells primarily on business days, yes. The key is consistency—use the same day definition for both pacing and period length.",
      },
      {
        question: "Why can projected bookings be misleading early in the period?",
        answer:
          "Many teams close deals late in the month/quarter. Early pace can understate or overstate the final outcome depending on your deal timing pattern.",
      },
    ],
    guide: [
      {
        title: "Quota tips",
        bullets: [
          "Pair attainment with pipeline coverage to avoid false confidence.",
          "Segment by rep, region, and deal size to spot risks early.",
          "Forecast with cohorts of opportunities by expected close date (not only pace).",
        ],
      },
    ],
  },
  {
    slug: "pipeline-coverage-calculator",
    title: "Pipeline Coverage Calculator",
    description:
      "Compute pipeline coverage ratio and expected bookings from pipeline and win rate.",
    category: "saas-metrics",
    guideSlug: "pipeline-coverage-guide",
    relatedGlossarySlugs: ["pipeline", "pipeline-coverage", "quota", "win-rate"],
    seo: {
      intro: [
        "Pipeline coverage is a simple sanity check: pipeline ÷ quota. If win rate is below 100%, you usually need multiple turns of pipeline to hit quota.",
        "This calculator also converts pipeline into expected bookings using your win rate so you can compare expected output to quota.",
      ],
      steps: [
        "Enter quota for the period and current pipeline amount.",
        "Enter estimated win rate for the same stage definition.",
        "Review coverage ratio and expected bookings / expected attainment.",
      ],
      pitfalls: [
        "Using pipeline that includes unqualified deals (inflates coverage).",
        "Using a win rate from a different stage definition (SQL vs closed-won).",
        "Ignoring sales cycle length and timing (coverage must be time-bound).",
      ],
    },
    inputs: [
      {
        key: "quota",
        label: "Quota (period)",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "pipelineAmount",
        label: "Pipeline amount",
        placeholder: "1500000",
        prefix: "$",
        defaultValue: "1500000",
        min: 0,
      },
      {
        key: "winRatePercent",
        label: "Win rate",
        placeholder: "25",
        suffix: "%",
        defaultValue: "25",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const winRate = values.winRatePercent / 100;
      if (values.quota <= 0) warnings.push("Quota must be greater than 0.");
      if (values.pipelineAmount < 0) warnings.push("Pipeline amount must be 0 or greater.");
      if (winRate < 0 || winRate > 1) warnings.push("Win rate must be between 0% and 100%.");

      const coverage = safeDivide(values.pipelineAmount, values.quota);
      const expectedBookings = values.pipelineAmount * winRate;
      const expectedAttainment = safeDivide(expectedBookings, values.quota);
      const requiredPipeline = winRate > 0 ? values.quota / winRate : null;
      const pipelineGap =
        requiredPipeline === null ? null : values.pipelineAmount - requiredPipeline;

      return {
        headline: {
          key: "coverage",
          label: "Pipeline coverage",
          value: coverage ?? 0,
          format: "multiple",
          maxFractionDigits: 2,
          detail: "Pipeline ÷ quota",
        },
        secondary: [
          {
            key: "expectedBookings",
            label: "Expected bookings (from pipeline)",
            value: expectedBookings,
            format: "currency",
            currency: "USD",
            detail: "Pipeline × win rate",
          },
          {
            key: "expectedAttainment",
            label: "Expected attainment (from pipeline)",
            value: expectedAttainment ?? 0,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "requiredPipeline",
            label: "Pipeline required to hit quota",
            value: requiredPipeline ?? 0,
            format: "currency",
            currency: "USD",
            detail: "Quota ÷ win rate",
          },
          {
            key: "pipelineGap",
            label: "Pipeline surplus / shortfall",
            value: pipelineGap ?? 0,
            format: "currency",
            currency: "USD",
            detail: "Current pipeline - required",
          },
        ],
        breakdown: [
          {
            key: "winRate",
            label: "Win rate",
            value: winRate,
            format: "percent",
            maxFractionDigits: 2,
          },
        ],
        warnings,
      };
    },
    formula:
      "Coverage = pipeline ÷ quota; expected bookings = pipeline × win rate; expected attainment = expected bookings ÷ quota",
    assumptions: [
      "Pipeline is for the same time window as quota (e.g., this quarter) and similarly staged.",
      "Win rate is applied as an average and assumes stable conversion.",
    ],
    faqs: [
      {
        question: "What coverage ratio is 'good'?",
        answer:
          "It depends on win rate and stage quality. A rough rule is coverage ≈ 1 ÷ win rate (e.g., 25% win rate implies ~4× coverage), adjusted for deal slippage and timing.",
      },
      {
        question: "Should I use pipeline value or weighted pipeline?",
        answer:
          "If you have reliable stage probabilities, weighted pipeline can be more realistic. But many teams start with unweighted pipeline + historical win rate for simplicity.",
      },
    ],
  },
  {
    slug: "pipeline-required-calculator",
    title: "Required Pipeline Calculator",
    description:
      "Estimate how much pipeline (and how many opportunities) you need to hit a revenue target given win rate and average deal size.",
    category: "saas-metrics",
    guideSlug: "pipeline-required-guide",
    relatedGlossarySlugs: ["pipeline", "quota", "win-rate", "acv"],
    seo: {
      intro: [
        "A revenue target implies a required number of wins. Wins imply a required number of opportunities based on your win rate.",
        "This calculator converts quota into required pipeline and required opportunity count so you can plan top-of-funnel demand and capacity.",
      ],
      steps: [
        "Enter your quota/target for the period.",
        "Enter win rate and average deal size (ACV/ARR/bookings).",
        "Review required pipeline $ and required opportunities and wins.",
      ],
      pitfalls: [
        "Using average deal size without segmenting (SMB vs enterprise).",
        "Using win rate from a different stage definition.",
        "Ignoring sales cycle slippage (time-bound pipeline matters).",
      ],
    },
    inputs: [
      {
        key: "target",
        label: "Target revenue (period)",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0,
      },
      {
        key: "winRatePercent",
        label: "Win rate",
        placeholder: "25",
        suffix: "%",
        defaultValue: "25",
        min: 0.1,
        step: 0.1,
      },
      {
        key: "avgDealSize",
        label: "Average deal size (ACV)",
        placeholder: "25000",
        prefix: "$",
        defaultValue: "25000",
        min: 0.01,
      },
      {
        key: "activeReps",
        label: "Active reps (optional)",
        help: "Used to estimate pipeline per rep.",
        placeholder: "5",
        defaultValue: "5",
        min: 0,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const winRate = values.winRatePercent / 100;
      if (values.target <= 0) warnings.push("Target must be greater than 0.");
      if (winRate <= 0) warnings.push("Win rate must be greater than 0%.");
      if (values.avgDealSize <= 0) warnings.push("Average deal size must be greater than 0.");
      if (values.activeReps < 0) warnings.push("Active reps must be 0 or greater.");

      const requiredWins = safeDivide(values.target, values.avgDealSize);
      const requiredOpps =
        requiredWins !== null && winRate > 0 ? requiredWins / winRate : null;
      const requiredPipeline = winRate > 0 ? values.target / winRate : 0;
      const impliedCoverage = safeDivide(requiredPipeline, values.target);
      const reps = Math.floor(values.activeReps);
      const pipelinePerRep =
        reps > 0 ? safeDivide(requiredPipeline, reps) : null;
      const oppsPerRep = reps > 0 ? safeDivide(requiredOpps ?? 0, reps) : null;

      return {
        headline: {
          key: "requiredPipeline",
          label: "Required pipeline ($)",
          value: requiredPipeline,
          format: "currency",
          currency: "USD",
          detail: "Target ÷ win rate",
        },
        secondary: [
          {
            key: "requiredOpps",
            label: "Required opportunities",
            value: requiredOpps ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail: requiredOpps === null ? "Invalid inputs" : "Wins ÷ win rate",
          },
          {
            key: "requiredWins",
            label: "Required wins",
            value: requiredWins ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail: requiredWins === null ? "Invalid inputs" : "Target ÷ avg deal size",
          },
          {
            key: "impliedCoverage",
            label: "Implied coverage ratio",
            value: impliedCoverage ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Required pipeline ÷ target",
          },
          {
            key: "pipelinePerRep",
            label: "Pipeline per rep",
            value: pipelinePerRep ?? 0,
            format: "currency",
            currency: "USD",
            detail: reps > 0 ? "Required pipeline ÷ reps" : "Add reps to estimate",
          },
          {
            key: "oppsPerRep",
            label: "Opportunities per rep",
            value: oppsPerRep ?? 0,
            format: "number",
            maxFractionDigits: 1,
            detail: reps > 0 ? "Required opps ÷ reps" : "Add reps to estimate",
          },
        ],
        warnings,
      };
    },
    formula:
      "Required pipeline = target ÷ win rate; wins = target ÷ avg deal size; opps = wins ÷ win rate",
    assumptions: [
      "Uses average deal size; segment for higher accuracy.",
      "Win rate is stable and measured on the same stage definition as your pipeline.",
    ],
    faqs: [
      {
        question: "Why is required pipeline target ÷ win rate?",
        answer:
          "If you win X% of pipeline value on average, you need about 1/X times the target in pipeline to produce the target in closed revenue (before adding buffer for slippage).",
      },
      {
        question: "Should I add a buffer above required pipeline?",
        answer:
          "Often yes. Deal slippage and push-outs can be material. Many teams set an additional buffer (e.g., +10–30%) based on historical slippage.",
      },
    ],
  },
  {
    slug: "sales-capacity-calculator",
    title: "Sales Capacity Calculator (with Ramp)",
    description:
      "Estimate period bookings capacity from team size, quota per rep, expected attainment, and ramped vs ramping mix.",
    category: "saas-metrics",
    guideSlug: "sales-capacity-guide",
    relatedGlossarySlugs: ["sales-ramp", "quota", "quota-attainment", "pipeline"],
    seo: {
      intro: [
        "Sales capacity is the output your team can produce given headcount and productivity. Ramp matters: new reps rarely produce full quota immediately.",
        "This calculator estimates bookings capacity using an expected attainment rate and a ramped vs ramping mix.",
      ],
      steps: [
        "Enter number of reps and quota per rep for the period.",
        "Enter expected attainment % for ramped reps.",
        "Enter what % of the team is ramped and a productivity factor for ramping reps.",
        "Optionally enter a target bookings number to estimate required reps.",
      ],
      pitfalls: [
        "Assuming all reps are fully ramped.",
        "Using quota that doesn’t match the same period definition.",
        "Ignoring pipeline constraints (capacity without pipeline is theoretical).",
      ],
    },
    inputs: [
      {
        key: "reps",
        label: "Sales reps",
        placeholder: "10",
        defaultValue: "10",
        min: 0,
        step: 1,
      },
      {
        key: "quotaPerRep",
        label: "Quota per rep (period)",
        placeholder: "150000",
        prefix: "$",
        defaultValue: "150000",
        min: 0,
      },
      {
        key: "attainmentPercent",
        label: "Expected attainment (ramped reps)",
        placeholder: "85",
        suffix: "%",
        defaultValue: "85",
        min: 0,
        step: 0.1,
      },
      {
        key: "rampedPercent",
        label: "% of team fully ramped",
        placeholder: "70",
        suffix: "%",
        defaultValue: "70",
        min: 0,
        step: 0.1,
      },
      {
        key: "rampingProductivityPercent",
        label: "Ramping reps productivity",
        help: "Productivity of ramping reps relative to ramped reps.",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
      {
        key: "targetBookings",
        label: "Target bookings (optional)",
        placeholder: "1200000",
        prefix: "$",
        defaultValue: "1200000",
        min: 0,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const reps = Math.floor(values.reps);
      const attainment = values.attainmentPercent / 100;
      const ramped = values.rampedPercent / 100;
      const rampingProd = values.rampingProductivityPercent / 100;

      if (reps < 0) warnings.push("Sales reps must be 0 or greater.");
      if (values.quotaPerRep < 0) warnings.push("Quota per rep must be 0 or greater.");
      if (attainment < 0 || attainment > 2)
        warnings.push("Attainment should be between 0% and 200% (check input).");
      if (ramped < 0 || ramped > 1) warnings.push("Ramped % must be between 0% and 100%.");
      if (rampingProd < 0 || rampingProd > 1)
        warnings.push("Ramping productivity must be between 0% and 100%.");
      if (values.targetBookings < 0) warnings.push("Target bookings must be 0 or greater.");

      const effectiveReps = reps * (ramped + (1 - ramped) * rampingProd);
      const perRepCapacity = values.quotaPerRep * attainment;
      const capacity = effectiveReps * perRepCapacity;
      const denom =
        values.quotaPerRep > 0 ? perRepCapacity * (ramped + (1 - ramped) * rampingProd) : 0;
      const requiredReps =
        values.targetBookings > 0 && denom > 0 ? values.targetBookings / denom : null;
      const capacityGap =
        values.targetBookings > 0 ? capacity - values.targetBookings : null;

      return {
        headline: {
          key: "capacity",
          label: "Estimated bookings capacity",
          value: capacity,
          format: "currency",
          currency: "USD",
          detail: "Reps × quota × attainment × ramp mix",
        },
        secondary: [
          {
            key: "effectiveReps",
            label: "Effective reps (ramp-adjusted)",
            value: effectiveReps,
            format: "number",
            maxFractionDigits: 2,
          },
          {
            key: "perRepCapacity",
            label: "Capacity per rep (ramped)",
            value: perRepCapacity,
            format: "currency",
            currency: "USD",
            detail: "Quota per rep x attainment",
          },
          {
            key: "requiredReps",
            label: "Required reps for target",
            value: requiredReps ?? 0,
            format: "number",
            maxFractionDigits: 2,
            detail: values.targetBookings > 0 ? "Target / per-rep capacity" : "Add target",
          },
          {
            key: "capacityGap",
            label: "Capacity surplus / shortfall",
            value: capacityGap ?? 0,
            format: "currency",
            currency: "USD",
            detail: values.targetBookings > 0 ? "Capacity - target" : "Add target",
          },
        ],
        warnings,
      };
    },
    formula:
      "Capacity ≈ reps × quota per rep × attainment × (ramped% + (1-ramped%)×ramping productivity)",
    assumptions: [
      "Ramping productivity is expressed relative to ramped rep productivity.",
      "Attainment applies to ramped productivity; actual outcomes vary by segment and seasonality.",
    ],
    faqs: [
      {
        question: "Why use ramp-adjusted effective reps?",
        answer:
          "Because a team with many new hires has fewer 'fully productive' reps. Adjusting for ramp helps you avoid over-forecasting bookings.",
      },
      {
        question: "How should I pick ramping productivity?",
        answer:
          "Use historical ramp curves (month 1, 2, 3 productivity). If you don’t have data, start conservative (e.g., 20–50%) and refine with observed cohorts.",
      },
    ],
  },
  {
    slug: "ote-commission-rate-calculator",
    title: "OTE & Commission Rate Calculator",
    description:
      "Compute on-target earnings (OTE), commission rate, and compensation split from base salary, variable pay, and quota.",
    category: "saas-metrics",
    guideSlug: "ote-guide",
    relatedGlossarySlugs: ["ote", "quota", "quota-attainment"],
    seo: {
      intro: [
        "Sales compensation often starts with OTE (on-target earnings): base + variable at 100% attainment.",
        "From OTE and quota you can derive a simple commission rate (variable ÷ quota) and sanity-check incentive alignment.",
      ],
      steps: [
        "Enter base and variable compensation for the period (usually annual).",
        "Enter quota for the same period.",
        "Review OTE, commission rate, and base/variable split.",
        "Use the payout scenarios to see how earnings move at 80%, 100%, and 120% attainment.",
      ],
      pitfalls: [
        "Mixing annual OTE with quarterly quota (unit mismatch).",
        "Ignoring accelerators/decels and thresholds (this is a simplified model).",
        "Optimizing commission rate without checking CAC/payback and sales cycle.",
      ],
    },
    inputs: [
      {
        key: "basePay",
        label: "Base pay (annual)",
        placeholder: "90000",
        prefix: "$",
        defaultValue: "90000",
        min: 0,
      },
      {
        key: "variablePay",
        label: "Variable pay at 100% attainment (annual)",
        placeholder: "90000",
        prefix: "$",
        defaultValue: "90000",
        min: 0,
      },
      {
        key: "quota",
        label: "Quota (annual)",
        placeholder: "900000",
        prefix: "$",
        defaultValue: "900000",
        min: 0.01,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      if (values.quota <= 0) warnings.push("Quota must be greater than 0.");
      if (values.basePay < 0) warnings.push("Base pay must be 0 or greater.");
      if (values.variablePay < 0) warnings.push("Variable pay must be 0 or greater.");
      if (values.variablePay === 0)
        warnings.push("Variable pay is 0; commission rate and incentives will be 0.");

      const ote = values.basePay + values.variablePay;
      const commissionRate = safeDivide(values.variablePay, values.quota);
      const baseSplit = safeDivide(values.basePay, ote);
      const variableSplit = safeDivide(values.variablePay, ote);
      const monthlyOte = ote / 12;
      const monthlyBase = values.basePay / 12;
      const monthlyVariable = values.variablePay / 12;
      const payoutAt = (attainment: number) =>
        values.basePay + values.variablePay * attainment;
      const variableAt = (attainment: number) => values.variablePay * attainment;

      return {
        headline: {
          key: "ote",
          label: "OTE (annual)",
          value: ote,
          format: "currency",
          currency: "USD",
          detail: "Base + variable",
        },
        secondary: [
          {
            key: "commissionRate",
            label: "Commission rate (variable ÷ quota)",
            value: commissionRate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "baseSplit",
            label: "Base split",
            value: baseSplit ?? 0,
            format: "percent",
            maxFractionDigits: 0,
          },
          {
            key: "variableSplit",
            label: "Variable split",
            value: variableSplit ?? 0,
            format: "percent",
            maxFractionDigits: 0,
          },
          {
            key: "monthlyOte",
            label: "Monthly OTE",
            value: monthlyOte,
            format: "currency",
            currency: "USD",
            detail: "Annual OTE / 12",
          },
          {
            key: "monthlyBase",
            label: "Monthly base",
            value: monthlyBase,
            format: "currency",
            currency: "USD",
          },
          {
            key: "monthlyVariable",
            label: "Monthly variable (at 100%)",
            value: monthlyVariable,
            format: "currency",
            currency: "USD",
          },
        ],
        breakdown: [
          {
            key: "payout80",
            label: "Payout at 80% attainment",
            value: payoutAt(0.8),
            format: "currency",
            currency: "USD",
          },
          {
            key: "payout75",
            label: "Payout at 75% attainment",
            value: payoutAt(0.75),
            format: "currency",
            currency: "USD",
          },
          {
            key: "payout100",
            label: "Payout at 100% attainment",
            value: payoutAt(1),
            format: "currency",
            currency: "USD",
          },
          {
            key: "payout120",
            label: "Payout at 120% attainment",
            value: payoutAt(1.2),
            format: "currency",
            currency: "USD",
          },
          {
            key: "payout125",
            label: "Payout at 125% attainment",
            value: payoutAt(1.25),
            format: "currency",
            currency: "USD",
          },
          {
            key: "variable100",
            label: "Variable payout at 100%",
            value: variableAt(1),
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula: "OTE = base + variable; commission rate ≈ variable ÷ quota",
    assumptions: [
      "Assumes linear commission proportional to quota attainment (no accelerators/decels).",
      "Base and quota are for the same time unit (annual vs quarterly).",
    ],
    faqs: [
      {
        question: "What’s a typical OTE split?",
        answer:
          "Many AE roles use ~50/50 base/variable, but it varies by motion and market. Use this as a sanity check, not a rule.",
      },
      {
        question: "Does this include accelerators?",
        answer:
          "No. Accelerators can materially change effective commission rate at high attainment. Use a full comp plan model if you need precision.",
      },
    ],
  },
  {
    slug: "sales-funnel-targets-calculator",
    title: "Sales Funnel Targets Calculator",
    description:
      "Translate a revenue target into required wins, opportunities, SQLs, MQLs, and leads using funnel conversion rates.",
    category: "saas-metrics",
    guideSlug: "sales-funnel-targets-guide",
    relatedGlossarySlugs: ["acv", "mql", "sql", "win-rate", "pipeline"],
    seo: {
      intro: [
        "If you want $X in new revenue, you need a certain number of wins. Wins require opportunities, and opportunities require qualified leads.",
        "This calculator converts a revenue target into funnel volume targets using your conversion rates so you can plan demand generation and sales capacity.",
      ],
      steps: [
        "Enter your revenue target and average deal size (ACV).",
        "Enter funnel conversion rates from lead → MQL → SQL → opp → win.",
        "Review required counts at each funnel stage.",
      ],
      pitfalls: [
        "Using conversion rates from a different segment (SMB vs enterprise).",
        "Mixing definitions (what counts as an MQL/SQL).",
        "Ignoring time lag (leads generated now may close next period).",
      ],
    },
    inputs: [
      {
        key: "revenueTarget",
        label: "Revenue target (period)",
        placeholder: "500000",
        prefix: "$",
        defaultValue: "500000",
        min: 0.01,
      },
      {
        key: "avgDealSize",
        label: "Average deal size (ACV)",
        placeholder: "25000",
        prefix: "$",
        defaultValue: "25000",
        min: 0.01,
      },
      {
        key: "leadToMqlPercent",
        label: "Lead → MQL",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0.01,
        step: 0.1,
      },
      {
        key: "mqlToSqlPercent",
        label: "MQL → SQL",
        placeholder: "30",
        suffix: "%",
        defaultValue: "30",
        min: 0.01,
        step: 0.1,
      },
      {
        key: "sqlToOppPercent",
        label: "SQL → Opportunity",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0.01,
        step: 0.1,
      },
      {
        key: "oppToWinPercent",
        label: "Opportunity → Win",
        placeholder: "25",
        suffix: "%",
        defaultValue: "25",
        min: 0.01,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const leadToMql = values.leadToMqlPercent / 100;
      const mqlToSql = values.mqlToSqlPercent / 100;
      const sqlToOpp = values.sqlToOppPercent / 100;
      const oppToWin = values.oppToWinPercent / 100;

      if (values.revenueTarget <= 0) warnings.push("Revenue target must be greater than 0.");
      if (values.avgDealSize <= 0) warnings.push("Average deal size must be greater than 0.");
      if (leadToMql <= 0) warnings.push("Lead → MQL must be greater than 0%.");
      if (mqlToSql <= 0) warnings.push("MQL → SQL must be greater than 0%.");
      if (sqlToOpp <= 0) warnings.push("SQL → Opportunity must be greater than 0%.");
      if (oppToWin <= 0) warnings.push("Opportunity → Win must be greater than 0%.");

      const wins = safeDivide(values.revenueTarget, values.avgDealSize);
      const opps = wins !== null ? safeDivide(wins, oppToWin) : null;
      const sqls = opps !== null ? safeDivide(opps, sqlToOpp) : null;
      const mqls = sqls !== null ? safeDivide(sqls, mqlToSql) : null;
      const leads = mqls !== null ? safeDivide(mqls, leadToMql) : null;

      return {
        headline: {
          key: "leads",
          label: "Required leads",
          value: leads ?? 0,
          format: "number",
          maxFractionDigits: 0,
          detail: "Back-solved from revenue target and conversion rates",
        },
        secondary: [
          {
            key: "mqls",
            label: "Required MQLs",
            value: mqls ?? 0,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "sqls",
            label: "Required SQLs",
            value: sqls ?? 0,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "opps",
            label: "Required opportunities",
            value: opps ?? 0,
            format: "number",
            maxFractionDigits: 0,
          },
          {
            key: "wins",
            label: "Required wins",
            value: wins ?? 0,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "wins = target ÷ deal size; opps = wins ÷ opp→win; SQLs = opps ÷ SQL→opp; MQLs = SQLs ÷ MQL→SQL; leads = MQLs ÷ lead→MQL",
    assumptions: [
      "Conversion rates are stable and measured over consistent windows.",
      "Ignores time lag (sales cycle); align inputs to the same period.",
      "Assumes average deal size is representative; segment for higher accuracy.",
    ],
    faqs: [
      {
        question: "Why does a small change in conversion rates move leads a lot?",
        answer:
          "Because conversion rates multiply. Small improvements at each stage compound into a large reduction in top-of-funnel volume required.",
      },
      {
        question: "Should I use leads or MQLs as the starting point?",
        answer:
          "Use the earliest stage you can measure consistently. If lead quality varies widely by channel, model channels separately for accuracy.",
      },
    ],
  },
  {
    slug: "activation-rate-calculator",
    title: "Activation Rate Calculator",
    description:
      "Compute activation rate: what % of new signups reach your activation event (and what you need to hit a target).",
    category: "saas-metrics",
    guideSlug: "activation-rate-guide",
    relatedGlossarySlugs: ["activation-rate", "conversion-rate", "funnel", "arrr-funnel"],
    seo: {
      intro: [
        "Activation is a leading indicator of retention. If users don’t reach an 'aha moment', they’re unlikely to stick.",
        "This calculator computes activation rate from signups and activated users, and optionally computes the activated users needed to hit a target activation rate.",
      ],
      steps: [
        "Enter new signups for the time window.",
        "Enter activated users (as defined by your activation event).",
        "Optionally enter a target activation rate to compute the required activated users.",
      ],
      pitfalls: [
        "Using vanity events as activation (not linked to retention).",
        "Mixing denominators (users vs accounts) across periods.",
        "Comparing activation rates across channels without segmenting intent.",
      ],
    },
    inputs: [
      {
        key: "signups",
        label: "New signups",
        placeholder: "5000",
        defaultValue: "5000",
        min: 0,
        step: 1,
      },
      {
        key: "activated",
        label: "Activated users",
        placeholder: "1200",
        defaultValue: "1200",
        min: 0,
        step: 1,
      },
      {
        key: "targetActivationPercent",
        label: "Target activation rate (optional)",
        help: "Set 0 to disable target calculation.",
        placeholder: "30",
        suffix: "%",
        defaultValue: "30",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const signups = Math.floor(values.signups);
      const activated = Math.floor(values.activated);
      if (signups < 0) warnings.push("New signups must be 0 or greater.");
      if (activated < 0) warnings.push("Activated users must be 0 or greater.");
      if (activated > signups)
        warnings.push("Activated users exceeds signups (check definitions/time window).");

      const rate = signups > 0 ? activated / signups : null;
      const target = values.targetActivationPercent / 100;
      const requiredActivated =
        values.targetActivationPercent > 0 ? Math.ceil(signups * target) : null;

      return {
        headline: {
          key: "activationRate",
          label: "Activation rate",
          value: rate ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Activated ÷ signups",
        },
        secondary: [
          {
            key: "requiredActivated",
            label: "Activated users needed for target",
            value: requiredActivated ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail:
              requiredActivated === null ? "Target disabled" : `${values.targetActivationPercent}% × signups`,
          },
        ],
        warnings,
      };
    },
    formula: "Activation rate = activated users ÷ signups",
    assumptions: [
      "Activation is defined by a single event/threshold (custom per product).",
      "Inputs reflect the same cohort and time window.",
    ],
    faqs: [
      {
        question: "What should count as 'activated'?",
        answer:
          "Use an event that correlates with retention and value (the 'aha' moment). Avoid vanity events like 'visited settings' unless they predict long-term use.",
      },
      {
        question: "Should I measure activation by account instead of user?",
        answer:
          "If your product is sold per account, account-level activation is often more meaningful. The key is choosing a denominator that matches your business model and staying consistent.",
      },
    ],
  },
  {
    slug: "trial-to-paid-calculator",
    title: "Trial-to-paid Conversion Calculator",
    description:
      "Compute trial-to-paid conversion rate and estimate required conversions to hit a target.",
    category: "saas-metrics",
    guideSlug: "trial-to-paid-guide",
    relatedGlossarySlugs: ["trial-to-paid", "conversion-rate", "funnel", "arrr-funnel"],
    seo: {
      intro: [
        "Trial-to-paid measures the % of trial users who become paying customers within a defined window.",
        "Track by cohort and channel to understand lead quality and where onboarding or pricing friction is blocking conversion.",
      ],
      steps: [
        "Enter trials started for the cohort/window.",
        "Enter trials that converted to paid within the window.",
        "Optionally enter a target trial-to-paid rate to compute required paid conversions.",
      ],
      pitfalls: [
        "Using a window that’s too short (under-counts conversions for long sales cycles).",
        "Mixing self-serve and sales-assisted trials (different funnels).",
        "Changing trial definitions and comparing rates as if equal.",
      ],
    },
    inputs: [
      {
        key: "trialsStarted",
        label: "Trials started",
        placeholder: "2000",
        defaultValue: "2000",
        min: 0,
        step: 1,
      },
      {
        key: "paidConversions",
        label: "Trials converted to paid",
        placeholder: "180",
        defaultValue: "180",
        min: 0,
        step: 1,
      },
      {
        key: "targetPercent",
        label: "Target trial-to-paid (optional)",
        help: "Set 0 to disable target calculation.",
        placeholder: "12",
        suffix: "%",
        defaultValue: "12",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const trials = Math.floor(values.trialsStarted);
      const paid = Math.floor(values.paidConversions);
      if (trials < 0) warnings.push("Trials started must be 0 or greater.");
      if (paid < 0) warnings.push("Paid conversions must be 0 or greater.");
      if (paid > trials) warnings.push("Paid conversions exceeds trials (check inputs).");

      const rate = trials > 0 ? paid / trials : null;
      const target = values.targetPercent / 100;
      const requiredPaid =
        values.targetPercent > 0 ? Math.ceil(trials * target) : null;

      return {
        headline: {
          key: "trialToPaid",
          label: "Trial-to-paid conversion",
          value: rate ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Paid ÷ trials",
        },
        secondary: [
          {
            key: "requiredPaid",
            label: "Paid conversions needed for target",
            value: requiredPaid ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail: requiredPaid === null ? "Target disabled" : `${values.targetPercent}% × trials`,
          },
        ],
        warnings,
      };
    },
    formula: "Trial-to-paid = paid conversions ÷ trials started",
    assumptions: [
      "Uses a single conversion window; use cohorts for long sales cycles.",
      "Trials and paid conversions reflect the same cohort definition.",
    ],
    faqs: [
      {
        question: "What window should I use (7/14/30 days)?",
        answer:
          "Use a window that matches your typical conversion lag. If sales-assisted conversions take longer, track them separately or extend the window so you don’t undercount conversions.",
      },
      {
        question: "Should I include free users in trials?",
        answer:
          "Only if the definition is consistent. Many teams separate free-to-paid and trial-to-paid because the activation and conversion behavior differs.",
      },
    ],
  },
  {
    slug: "dau-mau-calculator",
    title: "DAU/MAU (Stickiness) Calculator",
    description:
      "Compute DAU/MAU stickiness and translate it into implied active days per month.",
    category: "saas-metrics",
    guideSlug: "dau-mau-guide",
    relatedGlossarySlugs: ["dau", "mau", "stickiness"],
    seo: {
      intro: [
        "DAU/MAU is a common stickiness metric: how frequently monthly active users are active on a typical day.",
        "It’s useful for product engagement, but it depends on how you define 'active' and can vary widely by product type.",
      ],
      steps: [
        "Enter DAU and MAU for the same period and same 'active' definition.",
        "Review DAU/MAU and implied active days per month.",
      ],
      pitfalls: [
        "Using inconsistent 'active' definitions (sessions vs key event).",
        "Comparing across products with different usage cadences (daily vs weekly).",
        "Using DAU and MAU from different date ranges.",
      ],
    },
    inputs: [
      {
        key: "dau",
        label: "DAU",
        placeholder: "1200",
        defaultValue: "1200",
        min: 0,
        step: 1,
      },
      {
        key: "mau",
        label: "MAU",
        placeholder: "8000",
        defaultValue: "8000",
        min: 0.01,
        step: 1,
      },
      {
        key: "targetPercent",
        label: "Target DAU/MAU (optional)",
        help: "Set 0 to disable target calculation.",
        placeholder: "20",
        suffix: "%",
        defaultValue: "20",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const dau = Math.floor(values.dau);
      const mau = Math.floor(values.mau);
      if (dau < 0) warnings.push("DAU must be 0 or greater.");
      if (mau <= 0) warnings.push("MAU must be greater than 0.");
      if (dau > mau) warnings.push("DAU exceeds MAU (check measurement definitions).");

      const ratio = safeDivide(dau, mau);
      const activeDaysPerMonth = (ratio ?? 0) * 30;
      const target = values.targetPercent / 100;
      const requiredDau = values.targetPercent > 0 ? Math.ceil(mau * target) : null;

      return {
        headline: {
          key: "stickiness",
          label: "DAU/MAU (stickiness)",
          value: ratio ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "DAU ÷ MAU",
        },
        secondary: [
          {
            key: "activeDays",
            label: "Implied active days per month",
            value: activeDaysPerMonth,
            format: "number",
            maxFractionDigits: 1,
            detail: "DAU/MAU × 30",
          },
          {
            key: "requiredDau",
            label: "DAU needed for target",
            value: requiredDau ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail: requiredDau === null ? "Target disabled" : `${values.targetPercent}% × MAU`,
          },
        ],
        warnings,
      };
    },
    formula: "DAU/MAU = DAU ÷ MAU",
    assumptions: [
      "DAU and MAU use the same 'active' definition and time period.",
      "Implied active days per month uses a 30-day approximation.",
    ],
    faqs: [
      {
        question: "What is a good DAU/MAU?",
        answer:
          "It depends on product cadence. Daily tools can be 20–60%+; weekly workflows may be lower. Track trends and segment by persona/plan for actionability.",
      },
      {
        question: "Should I use WAU/MAU instead?",
        answer:
          "If your product is naturally weekly (not daily), WAU/MAU can be a better stickiness metric and less noisy than DAU/MAU.",
      },
    ],
  },
  {
    slug: "wau-mau-calculator",
    title: "WAU/MAU Calculator",
    description:
      "Compute WAU/MAU and translate it into implied active weeks per month.",
    category: "saas-metrics",
    guideSlug: "wau-mau-guide",
    relatedGlossarySlugs: ["wau", "mau", "stickiness"],
    seo: {
      intro: [
        "WAU/MAU measures weekly engagement within the month and is often better for products with weekly usage cadence.",
        "It reduces daily noise and can align better with weekly workflows and B2B usage patterns.",
      ],
      steps: [
        "Enter WAU and MAU for the same period and same 'active' definition.",
        "Review WAU/MAU and implied active weeks per month.",
      ],
      benchmarks: [
        "Higher WAU/MAU usually implies a tighter weekly habit (stickiness), but expectations vary by product type.",
        "Compare WAU/MAU by segment (plan, team size, use case) to find where engagement is strongest.",
        "Track WAU/MAU alongside retention; stickiness without retention can still be fragile.",
      ],
      pitfalls: [
        "Mixing different 'active' definitions between WAU and MAU.",
        "Comparing across segments with different usage frequency expectations.",
        "Using WAU from a different month than MAU.",
      ],
    },
    inputs: [
      {
        key: "wau",
        label: "WAU",
        placeholder: "3000",
        defaultValue: "3000",
        min: 0,
        step: 1,
      },
      {
        key: "mau",
        label: "MAU",
        placeholder: "8000",
        defaultValue: "8000",
        min: 0.01,
        step: 1,
      },
      {
        key: "targetPercent",
        label: "Target WAU/MAU (optional)",
        help: "Set 0 to disable target calculation.",
        placeholder: "50",
        suffix: "%",
        defaultValue: "50",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const wau = Math.floor(values.wau);
      const mau = Math.floor(values.mau);
      if (wau < 0) warnings.push("WAU must be 0 or greater.");
      if (mau <= 0) warnings.push("MAU must be greater than 0.");
      if (wau > mau) warnings.push("WAU exceeds MAU (check measurement definitions).");

      const ratio = safeDivide(wau, mau);
      const weeksPerMonth = (ratio ?? 0) * 4.33;
      const activeWeeks = Math.min(4.33, Math.max(0, weeksPerMonth));
      const target = values.targetPercent / 100;
      const requiredWau = values.targetPercent > 0 ? Math.ceil(mau * target) : null;

      return {
        headline: {
          key: "wauMau",
          label: "WAU/MAU",
          value: ratio ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "WAU / MAU",
        },
        secondary: [
          {
            key: "weeksPerMonth",
            label: "Implied active weeks per month",
            value: weeksPerMonth,
            format: "number",
            maxFractionDigits: 2,
            detail: "WAU/MAU * 4.33",
          },
          {
            key: "activeWeeks",
            label: "Active weeks per month (capped)",
            value: activeWeeks,
            format: "number",
            maxFractionDigits: 2,
            detail: "Capped at 4.33 weeks",
          },
          {
            key: "requiredWau",
            label: "WAU needed for target",
            value: requiredWau ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail: requiredWau === null ? "Target disabled" : `${values.targetPercent}% * MAU`,
          },
          {
            key: "wauGap",
            label: "WAU gap to target",
            value: requiredWau === null ? 0 : Math.max(0, requiredWau - wau),
            format: "number",
            maxFractionDigits: 0,
            detail: requiredWau === null ? "Target disabled" : "Max(0, required - current)",
          },
        ],
        warnings,
      };
    },
    formula: "WAU/MAU = WAU / MAU",
    assumptions: [
      "WAU and MAU use the same 'active' definition and time period.",
      "Implied active weeks per month uses a 4.33-week approximation.",
    ],
    faqs: [
      {
        question: "When should I use WAU/MAU instead of DAU/MAU?",
        answer:
          "Use WAU/MAU when usage is naturally weekly (e.g., planning, reporting). It’s often a more stable signal than DAU/MAU for weekly cadence products.",
      },
      {
        question: "Can WAU/MAU be above 100%?",
        answer:
          "No, not with consistent definitions. If it happens, it usually indicates you’re using mismatched denominators or date ranges.",
      },
    ],
  },
  {
    slug: "feature-adoption-rate-calculator",
    title: "Feature Adoption Rate Calculator",
    description:
      "Compute feature adoption: what % of active users used a specific feature in a time window.",
    category: "saas-metrics",
    guideSlug: "feature-adoption-guide",
    relatedGlossarySlugs: ["feature-adoption", "activation-rate", "conversion-rate"],
    seo: {
      intro: [
        "Feature adoption measures whether users are using a specific feature that drives value (and often retention).",
        "Use adoption by cohort and persona to find where onboarding and product discovery are failing.",
      ],
      steps: [
        "Define the feature event (what counts as 'used').",
        "Enter active users for the window and users who used the feature.",
        "Review adoption % and required users to hit a target adoption.",
      ],
      pitfalls: [
        "Counting one-time clicks as adoption (use meaningful usage thresholds).",
        "Using total users instead of active users as the denominator.",
        "Comparing adoption across versions without aligning event tracking.",
      ],
    },
    inputs: [
      {
        key: "activeUsers",
        label: "Active users (window)",
        placeholder: "8000",
        defaultValue: "8000",
        min: 0.01,
        step: 1,
      },
      {
        key: "usersUsedFeature",
        label: "Users who used the feature",
        placeholder: "2400",
        defaultValue: "2400",
        min: 0,
        step: 1,
      },
      {
        key: "targetPercent",
        label: "Target adoption (optional)",
        help: "Set 0 to disable target calculation.",
        placeholder: "40",
        suffix: "%",
        defaultValue: "40",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const active = Math.floor(values.activeUsers);
      const used = Math.floor(values.usersUsedFeature);
      if (active <= 0) warnings.push("Active users must be greater than 0.");
      if (used < 0) warnings.push("Users who used feature must be 0 or greater.");
      if (used > active) warnings.push("Users who used feature exceeds active users (check definitions).");

      const adoption = safeDivide(used, active);
      const target = values.targetPercent / 100;
      const requiredUsers = values.targetPercent > 0 ? Math.ceil(active * target) : null;

      return {
        headline: {
          key: "adoption",
          label: "Feature adoption rate",
          value: adoption ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Users who used ÷ active users",
        },
        secondary: [
          {
            key: "requiredUsers",
            label: "Users needed for target",
            value: requiredUsers ?? 0,
            format: "number",
            maxFractionDigits: 0,
            detail: requiredUsers === null ? "Target disabled" : `${values.targetPercent}% × active users`,
          },
        ],
        warnings,
      };
    },
    formula: "Feature adoption rate = users who used feature ÷ active users",
    assumptions: [
      "Active users and feature users are measured over the same window and same identity (user/account).",
      "Feature usage threshold is meaningful (define it clearly).",
    ],
    faqs: [
      {
        question: "Should I measure adoption by user or account?",
        answer:
          "Use the unit that matches how value is realized. In B2B tools, account-level adoption can be more meaningful than user-level adoption for expansion and retention.",
      },
      {
        question: "What’s the difference between adoption and activation?",
        answer:
          "Activation is the first meaningful value moment early in the lifecycle. Adoption usually means ongoing usage of a feature over time (often after activation).",
      },
    ],
  },
  {
    slug: "pql-to-paid-calculator",
    title: "PQL to Paid Conversion Calculator",
    description:
      "Compute PQL-to-paid conversion rate and the number of paid customers implied by PQL volume.",
    category: "saas-metrics",
    guideSlug: "pql-to-paid-guide",
    relatedGlossarySlugs: ["pql", "pql-to-paid", "trial-to-paid", "conversion-rate"],
    seo: {
      intro: [
        "PQLs (product-qualified leads) are users/accounts that show product usage signals correlated with conversion and retention.",
        "Tracking PQL-to-paid conversion helps connect product usage to revenue outcomes and improves prioritization between activation and sales follow-up.",
      ],
      steps: [
        "Enter PQLs generated in a period/cohort.",
        "Enter paid customers that originated from those PQLs (same window definition).",
        "Optionally enter a target paid count to compute required PQL-to-paid rate.",
      ],
      pitfalls: [
        "Defining PQLs using vanity actions (not predictive of retention).",
        "Mixing cohorts (PQLs from one month, paid conversions from another).",
        "Not separating self-serve vs sales-assisted conversion paths.",
      ],
    },
    inputs: [
      {
        key: "pqls",
        label: "PQLs",
        placeholder: "900",
        defaultValue: "900",
        min: 0,
        step: 1,
      },
      {
        key: "paidCustomers",
        label: "Paid customers from PQLs",
        placeholder: "90",
        defaultValue: "90",
        min: 0,
        step: 1,
      },
      {
        key: "targetPaid",
        label: "Target paid customers (optional)",
        help: "Set 0 to disable target rate calculation.",
        placeholder: "120",
        defaultValue: "120",
        min: 0,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const pqls = Math.floor(values.pqls);
      const paid = Math.floor(values.paidCustomers);
      if (pqls < 0) warnings.push("PQLs must be 0 or greater.");
      if (paid < 0) warnings.push("Paid customers must be 0 or greater.");
      if (paid > pqls) warnings.push("Paid customers exceeds PQLs (check definitions).");

      const rate = pqls > 0 ? paid / pqls : null;
      const requiredRate = values.targetPaid > 0 ? safeDivide(values.targetPaid, pqls) : null;

      return {
        headline: {
          key: "pqlToPaid",
          label: "PQL-to-paid conversion",
          value: rate ?? 0,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Paid ÷ PQLs",
        },
        secondary: [
          {
            key: "requiredRate",
            label: "Required conversion rate for target paid",
            value: requiredRate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: requiredRate === null ? "Target disabled" : "Target paid ÷ PQLs",
          },
        ],
        warnings,
      };
    },
    formula: "PQL-to-paid = paid customers from PQLs ÷ PQLs",
    assumptions: [
      "PQL definition is stable and predictive (not vanity).",
      "Paid customers are attributed back to the originating PQL cohort consistently.",
    ],
    faqs: [
      {
        question: "What should define a PQL?",
        answer:
          "Use product signals that correlate with conversion and retention (e.g., invited teammates, created X items, integrated Y). Validate PQL definitions by cohort outcomes.",
      },
      {
        question: "Should I track PQL-to-paid by channel?",
        answer:
          "Yes. PQL quality varies by channel and persona. Segmenting helps you invest in channels that produce PQLs that convert and retain.",
      },
    ],
  },
  {
    slug: "gross-margin-impact-calculator",
    title: "Gross Margin Impact Calculator",
    description:
      "Quantify how gross margin changes affect gross profit LTV, payback, and LTV:CAC (before vs after).",
    category: "saas-metrics",
    guideSlug: "gross-margin-impact-guide",
    relatedGlossarySlugs: ["gross-margin", "ltv", "payback-period", "cac", "arpa", "churn-rate"],
    seo: {
      intro: [
        "Margin improvements can be as powerful as growth: they increase gross profit per customer and can reduce payback dramatically without changing CAC.",
        "This calculator compares unit economics before vs after a gross margin change using a churn-based LTV shortcut.",
      ],
      steps: [
        "Enter ARPA, churn, and CAC.",
        "Enter current and target gross margin.",
        "Review LTV, payback, and LTV:CAC improvements.",
      ],
      pitfalls: [
        "Using revenue LTV instead of gross profit LTV.",
        "Mixing time units (monthly churn with annual ARPA).",
        "Assuming churn stays constant when pricing changes (may affect retention).",
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
        key: "monthlyChurnPercent",
        label: "Monthly churn",
        placeholder: "2",
        suffix: "%",
        defaultValue: "2",
        min: 0.01,
        step: 0.01,
      },
      {
        key: "cac",
        label: "CAC",
        placeholder: "6000",
        prefix: "$",
        defaultValue: "6000",
        min: 0,
      },
      {
        key: "currentGrossMarginPercent",
        label: "Current gross margin",
        placeholder: "70",
        suffix: "%",
        defaultValue: "70",
        min: 0,
        step: 0.1,
      },
      {
        key: "targetGrossMarginPercent",
        label: "Target gross margin",
        placeholder: "80",
        suffix: "%",
        defaultValue: "80",
        min: 0,
        step: 0.1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const churn = values.monthlyChurnPercent / 100;
      if (values.arpaMonthly <= 0) warnings.push("ARPA must be greater than 0.");
      if (churn <= 0) warnings.push("Churn must be greater than 0%.");
      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");

      const m0 = values.currentGrossMarginPercent / 100;
      const m1 = values.targetGrossMarginPercent / 100;
      if (m0 <= 0 || m1 <= 0)
        warnings.push("Gross margin must be greater than 0%.");

      const gpPerMonth0 = values.arpaMonthly * m0;
      const gpPerMonth1 = values.arpaMonthly * m1;

      const ltv0 = churn > 0 ? gpPerMonth0 / churn : 0;
      const ltv1 = churn > 0 ? gpPerMonth1 / churn : 0;

      const payback0 = gpPerMonth0 > 0 ? values.cac / gpPerMonth0 : 0;
      const payback1 = gpPerMonth1 > 0 ? values.cac / gpPerMonth1 : 0;

      const ratio0 = values.cac > 0 ? ltv0 / values.cac : 0;
      const ratio1 = values.cac > 0 ? ltv1 / values.cac : 0;

      return {
        headline: {
          key: "deltaPayback",
          label: "Payback improvement (months)",
          value: payback0 - payback1,
          format: "months",
          maxFractionDigits: 1,
          detail: "Positive means faster payback",
        },
        secondary: [
          {
            key: "ltv0",
            label: "Gross profit LTV (current)",
            value: ltv0,
            format: "currency",
            currency: "USD",
          },
          {
            key: "ltv1",
            label: "Gross profit LTV (target)",
            value: ltv1,
            format: "currency",
            currency: "USD",
          },
          {
            key: "payback0",
            label: "Payback (current)",
            value: payback0,
            format: "months",
            maxFractionDigits: 1,
          },
          {
            key: "payback1",
            label: "Payback (target)",
            value: payback1,
            format: "months",
            maxFractionDigits: 1,
          },
          {
            key: "ratio0",
            label: "LTV:CAC (current)",
            value: ratio0,
            format: "multiple",
            maxFractionDigits: 2,
          },
          {
            key: "ratio1",
            label: "LTV:CAC (target)",
            value: ratio1,
            format: "multiple",
            maxFractionDigits: 2,
          },
        ],
        breakdown: [
          {
            key: "gpPerMonth0",
            label: "Gross profit / month (current)",
            value: gpPerMonth0,
            format: "currency",
            currency: "USD",
          },
          {
            key: "gpPerMonth1",
            label: "Gross profit / month (target)",
            value: gpPerMonth1,
            format: "currency",
            currency: "USD",
          },
        ],
        warnings,
      };
    },
    formula:
      "Gross profit LTV ≈ (ARPA×gross margin) ÷ churn; Payback ≈ CAC ÷ (ARPA×gross margin)",
    assumptions: [
      "Churn-based LTV shortcut (constant churn).",
      "ARPA constant; ignores expansion and contraction.",
      "Gross margin change does not change churn (scenario test if it might).",
    ],
    faqs: [
      {
        question: "Should I use contribution margin instead of gross margin?",
        answer:
          "If variable costs beyond COGS materially affect profit (fees, shipping, support), contribution margin can be a better proxy. Use the definition that matches your unit economics model.",
      },
      {
        question: "How can I improve gross margin?",
        answer:
          "Reduce COGS/infra costs, optimize support and success costs, improve pricing and packaging, and reduce refunds/returns where applicable.",
      },
    ],
  },
  {
    slug: "pricing-packaging-guardrails-calculator",
    title: "Pricing & Packaging Guardrails Calculator",
    description:
      "Set guardrails for pricing changes by translating ARPA, margin, churn, and target payback into max discount and min price targets.",
    category: "saas-metrics",
    guideSlug: "pricing-packaging-guardrails-guide",
    relatedGlossarySlugs: ["arpa", "gross-margin", "cac-payback-period", "price-increase", "discount-rate"],
    seo: {
      intro: [
        "Pricing changes affect unit economics through ARPA and margin, and sometimes through churn. Guardrails help you avoid shipping discounts/pricing that break payback.",
        "This calculator translates a target payback into a minimum ARPA (or maximum discount) given CAC and gross margin assumptions.",
      ],
      steps: [
        "Enter CAC, gross margin, and a target payback.",
        "Compute required monthly gross profit and therefore minimum ARPA.",
        "Compare to current ARPA to compute max allowable discount.",
      ],
      pitfalls: [
        "Using revenue instead of gross profit for payback.",
        "Ignoring churn changes from pricing updates.",
        "Using blended ARPA across segments (hides price sensitivity).",
      ],
    },
    inputs: [
      {
        key: "currentArpaMonthly",
        label: "Current ARPA (monthly)",
        placeholder: "800",
        prefix: "$",
        defaultValue: "800",
        min: 0,
      },
      {
        key: "cac",
        label: "CAC",
        placeholder: "6000",
        prefix: "$",
        defaultValue: "6000",
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
        key: "targetPaybackMonths",
        label: "Target payback (months)",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const margin = values.grossMarginPercent / 100;
      const paybackMonths = Math.max(1, Math.floor(values.targetPaybackMonths));
      if (values.targetPaybackMonths !== paybackMonths)
        warnings.push("Target payback was rounded down to a whole number.");

      if (values.currentArpaMonthly <= 0) warnings.push("Current ARPA must be greater than 0.");
      if (values.cac <= 0) warnings.push("CAC must be greater than 0.");
      if (margin <= 0) warnings.push("Gross margin must be greater than 0%.");

      const requiredGrossProfitPerMonth = values.cac / paybackMonths;
      const minArpa = margin > 0 ? requiredGrossProfitPerMonth / margin : 0;
      const maxDiscount = values.currentArpaMonthly > 0 ? 1 - minArpa / values.currentArpaMonthly : 0;

      return {
        headline: {
          key: "minArpa",
          label: "Minimum ARPA to hit target payback",
          value: minArpa,
          format: "currency",
          currency: "USD",
          detail: "Derived from CAC, margin, and payback target",
        },
        secondary: [
          {
            key: "requiredGrossProfitPerMonth",
            label: "Required gross profit per month",
            value: requiredGrossProfitPerMonth,
            format: "currency",
            currency: "USD",
            detail: "CAC ÷ target payback months",
          },
          {
            key: "maxDiscount",
            label: "Max discount from current ARPA",
            value: Math.max(0, maxDiscount),
            format: "percent",
            maxFractionDigits: 1,
            detail: maxDiscount < 0 ? "Current ARPA is below required minimum" : "Directional guardrail",
          },
        ],
        breakdown: [
          {
            key: "currentArpa",
            label: "Current ARPA",
            value: values.currentArpaMonthly,
            format: "currency",
            currency: "USD",
          },
          {
            key: "cac",
            label: "CAC",
            value: values.cac,
            format: "currency",
            currency: "USD",
          },
          {
            key: "margin",
            label: "Gross margin",
            value: margin,
            format: "percent",
            maxFractionDigits: 1,
          },
          {
            key: "paybackMonths",
            label: "Target payback",
            value: paybackMonths,
            format: "months",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Payback = CAC ÷ (ARPA×margin) ⇒ min ARPA = (CAC ÷ payback) ÷ margin; max discount = 1 - minARPA/currentARPA",
    assumptions: [
      "Payback is computed on gross profit (ARPA × gross margin).",
      "Ignores churn changes from pricing; validate with cohort data.",
      "Use segment-level ARPA/CAC for realistic guardrails.",
    ],
    faqs: [
      {
        question: "Is this the only pricing guardrail I should use?",
        answer:
          "No. Pair payback guardrails with retention risk (churn) and value perception. A discount can hit payback and still be bad if it changes customer quality or expansion potential.",
      },
      {
        question: "Should I use contribution margin instead of gross margin?",
        answer:
          "If variable costs beyond COGS are meaningful, contribution margin is more conservative and usually better for payback guardrails.",
      },
    ],
  },
  {
    slug: "loan-payment-calculator",
    title: "Loan Payment Calculator",
    description:
      "Compute monthly payment, total interest, and total paid for a loan using amortization.",
    category: "finance",
    guideSlug: "loan-payment-guide",
    relatedGlossarySlugs: ["apr", "amortization", "principal", "interest-rate"],
    seo: {
      intro: [
        "Loan payments are driven by three things: principal, interest rate, and term. Amortization spreads principal repayment over time, so early payments are interest-heavy.",
        "This calculator computes the standard fixed-rate monthly payment and summarizes interest cost over the full term.",
      ],
      steps: [
        "Enter loan amount (principal), APR, and term in years.",
        "Review monthly payment, total interest, and total paid.",
        "Use it to compare refinance scenarios or affordability.",
      ],
      pitfalls: [
        "Mixing APR and monthly rate incorrectly (use APR/12).",
        "Ignoring fees and points (APR may not capture all costs).",
        "Assuming all loans amortize the same (interest-only, balloon loans differ).",
      ],
    },
    inputs: [
      {
        key: "principal",
        label: "Loan principal",
        placeholder: "300000",
        prefix: "$",
        defaultValue: "300000",
        min: 0,
      },
      {
        key: "aprPercent",
        label: "APR",
        placeholder: "6.5",
        suffix: "%",
        defaultValue: "6.5",
        min: 0,
        step: 0.01,
      },
      {
        key: "termYears",
        label: "Term (years)",
        placeholder: "30",
        defaultValue: "30",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const years = Math.max(1, Math.floor(values.termYears));
      if (values.termYears !== years)
        warnings.push("Term years was rounded down to a whole number.");

      const n = years * 12;
      const r = values.aprPercent / 100 / 12;

      if (values.principal <= 0) warnings.push("Principal must be greater than 0.");
      if (values.aprPercent < 0) warnings.push("APR must be >= 0%.");

      let payment = 0;
      if (values.principal > 0) {
        if (r === 0) payment = values.principal / n;
        else {
          const pow = Math.pow(1 + r, n);
          payment = (values.principal * r * pow) / (pow - 1);
        }
      }

        const totalPaid = payment * n;
        const totalInterest = totalPaid - values.principal;
        const firstMonthInterest = values.principal * r;
        const firstMonthPrincipal =
          payment > 0 ? Math.max(0, payment - firstMonthInterest) : 0;
        const interestShare =
          payment > 0 ? firstMonthInterest / payment : null;
        const totalInterestPercent =
          values.principal > 0 ? totalInterest / values.principal : null;

        return {
          headline: {
            key: "monthlyPayment",
            label: "Monthly payment",
          value: payment,
          format: "currency",
          currency: "USD",
          detail: "Fixed-rate amortizing loan",
        },
        secondary: [
            {
              key: "totalInterest",
              label: "Total interest paid",
              value: totalInterest,
              format: "currency",
              currency: "USD",
            },
            {
              key: "totalPaid",
              label: "Total paid",
              value: totalPaid,
              format: "currency",
              currency: "USD",
            },
            {
              key: "firstMonthInterest",
              label: "First-month interest",
              value: firstMonthInterest,
              format: "currency",
              currency: "USD",
              detail: "Principal x monthly rate",
            },
            {
              key: "firstMonthPrincipal",
              label: "First-month principal",
              value: firstMonthPrincipal,
              format: "currency",
              currency: "USD",
              detail: "Payment - interest",
            },
            {
              key: "interestShare",
              label: "Interest share of first payment",
              value: interestShare ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: interestShare === null ? "Payment is 0" : "Interest / payment",
            },
            {
              key: "totalInterestPercent",
              label: "Total interest as % of principal",
              value: totalInterestPercent ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                totalInterestPercent === null
                  ? "Principal is 0"
                  : "Total interest / principal",
            },
          ],
        breakdown: [
          {
            key: "principal",
            label: "Principal",
            value: values.principal,
            format: "currency",
            currency: "USD",
          },
          {
            key: "apr",
            label: "APR",
            value: values.aprPercent / 100,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "months",
            label: "Term (months)",
            value: n,
            format: "number",
            maxFractionDigits: 0,
          },
        ],
        warnings,
      };
    },
    formula:
      "Payment = P×r×(1+r)^n / ((1+r)^n - 1) where r is monthly rate and n is months (for r>0)",
    assumptions: [
      "Fixed-rate, fully amortizing loan with constant monthly payments.",
      "Does not include taxes, insurance, or extra fees.",
      "APR is treated as nominal annual rate divided by 12 for monthly rate.",
    ],
    faqs: [
      {
        question: "Why is total interest so high on long terms?",
        answer:
          "Because interest accrues on outstanding principal over many months. Longer terms reduce payment but increase total interest paid.",
      },
      {
        question: "What if I make extra payments?",
        answer:
          "Extra principal payments reduce outstanding balance faster, lowering total interest and shortening term. This calculator assumes no extra payments.",
      },
    ],
  },
  {
    slug: "apr-to-apy-calculator",
    title: "APR to APY Calculator",
    description:
      "Convert APR to APY (and APY to APR) given compounding frequency.",
    category: "finance",
    guideSlug: "apr-vs-apy-guide",
    relatedGlossarySlugs: ["apr", "apy", "interest-rate", "compounding"],
    seo: {
      intro: [
        "APR is a nominal rate; APY reflects compounding. For comparing savings products or loans with frequent compounding, APY is often the better comparison metric.",
        "This calculator converts between APR and APY using the chosen compounding frequency.",
      ],
      steps: [
        "Enter APR (or APY) and compounding periods per year.",
        "Review the converted rate and the effective periodic rate.",
      ],
      pitfalls: [
        "Comparing APRs with different compounding conventions.",
        "Confusing APY with real return (inflation matters).",
        "Ignoring fees that change effective cost/return.",
      ],
    },
    inputs: [
      {
        key: "aprPercent",
        label: "APR",
        placeholder: "6.0",
        suffix: "%",
        defaultValue: "6.0",
        min: 0,
        step: 0.01,
      },
      {
        key: "compoundsPerYear",
        label: "Compounds per year",
        placeholder: "12",
        defaultValue: "12",
        min: 1,
        step: 1,
      },
    ],
    compute(values) {
      const warnings: string[] = [];
      const n = Math.max(1, Math.floor(values.compoundsPerYear));
      if (values.compoundsPerYear !== n)
        warnings.push("Compounds per year was rounded down to a whole number.");

      const apr = values.aprPercent / 100;
      const apy = Math.pow(1 + apr / n, n) - 1;
      const periodic = apr / n;

      return {
        headline: {
          key: "apy",
          label: "APY (effective annual rate)",
          value: apy,
          format: "percent",
          maxFractionDigits: 3,
          detail: "Includes compounding",
        },
        secondary: [
          {
            key: "apr",
            label: "APR (nominal annual rate)",
            value: apr,
            format: "percent",
            maxFractionDigits: 3,
          },
          {
            key: "periodic",
            label: "Periodic rate",
            value: periodic,
            format: "percent",
            maxFractionDigits: 3,
            detail: `APR ÷ ${n}`,
          },
        ],
        warnings,
      };
    },
    formula: "APY = (1 + APR/n)^n - 1",
    assumptions: [
      "Compounding frequency is constant.",
      "APR is nominal and evenly split across compounding periods.",
      "Fees are not included; they can change effective return/cost.",
    ],
    faqs: [
      {
        question: "Is APY always higher than APR?",
        answer:
          "If APR is positive and compounding occurs more than once per year, APY is higher because interest earns interest. If APR is 0, APY is 0.",
      },
      {
        question: "Why do banks advertise APY for savings?",
        answer:
          "APY standardizes the effective annual yield including compounding, making products easier to compare.",
      },
    ],
  },
  {
    slug: "real-return-calculator",
    title: "Real Return (Inflation-adjusted) Calculator",
    description:
      "Convert nominal return into real return given an inflation rate (and compare the difference).",
    category: "finance",
    guideSlug: "real-vs-nominal-return-guide",
    relatedGlossarySlugs: ["inflation", "real-return", "interest-rate"],
    seo: {
      intro: [
        "Nominal returns don’t account for inflation. Real return measures how much purchasing power you gain after inflation.",
        "This calculator converts nominal return to real return and shows the inflation drag.",
      ],
      steps: [
        "Enter nominal annual return and inflation rate.",
        "Review real return and the difference vs nominal.",
      ],
      pitfalls: [
        "Ignoring inflation when comparing long-term returns.",
        "Using CPI inflation when your personal basket differs (approximation).",
        "Mixing monthly and annual rates (unit mismatch).",
      ],
    },
    inputs: [
      {
        key: "nominalReturnPercent",
        label: "Nominal annual return",
        placeholder: "10",
        suffix: "%",
        defaultValue: "10",
        step: 0.1,
      },
      {
        key: "inflationPercent",
        label: "Inflation rate",
        placeholder: "3",
        suffix: "%",
        defaultValue: "3",
        step: 0.1,
      },
    ],
    compute(values) {
      const nominal = values.nominalReturnPercent / 100;
      const inflation = values.inflationPercent / 100;
      const real = (1 + nominal) / (1 + inflation) - 1;
      const drag = nominal - real;

      return {
        headline: {
          key: "real",
          label: "Real return (inflation-adjusted)",
          value: real,
          format: "percent",
          maxFractionDigits: 2,
          detail: "Approx: (1+nominal)/(1+inflation) - 1",
        },
        secondary: [
          {
            key: "nominal",
            label: "Nominal return",
            value: nominal,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "inflation",
            label: "Inflation rate",
            value: inflation,
            format: "percent",
            maxFractionDigits: 2,
          },
          {
            key: "drag",
            label: "Inflation drag",
            value: drag,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Nominal - real (approx)",
          },
        ],
      };
    },
    formula: "Real return = (1 + nominal) ÷ (1 + inflation) - 1",
    assumptions: [
      "Inflation rate is an approximation (e.g., CPI).",
      "Uses annual rates; use consistent units for inputs.",
      "Does not model taxes; real after-tax return can be lower.",
    ],
    faqs: [
      {
        question: "Why can real return be negative?",
        answer:
          "If inflation exceeds nominal return, your purchasing power declines even though your nominal balance grows.",
      },
      {
        question: "Is real return the same as risk-adjusted return?",
        answer:
          "No. Real return adjusts for inflation. Risk-adjusted return accounts for volatility and risk (e.g., Sharpe ratio).",
      },
    ],
  },
];