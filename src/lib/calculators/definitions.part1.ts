import type { CalculatorDefinition, ResultValue } from "./types";
import { safeDivide } from "./shared";

export const calculatorsPart1: CalculatorDefinition[] = [
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
        {
          key: "targetProfitPercent",
          label: "Target profit after ads",
          help: "Desired profit after ads as % of revenue (optional).",
          placeholder: "10",
          suffix: "%",
          defaultValue: "10",
          min: 0,
          step: 0.1,
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
        const targetProfit = values.targetProfitPercent / 100;
        const requiredRevenueForBreakEven =
          contributionMargin > 0 ? values.adSpend / contributionMargin : null;
        const requiredRevenueForTargetProfit =
          contributionMargin > targetProfit && targetProfit >= 0
            ? values.adSpend / (contributionMargin - targetProfit)
            : null;
        const profitMarginAfterAds =
          values.revenue > 0 ? profitAfterAds / values.revenue : null;
        const profitPerDollar =
          values.adSpend > 0 ? profitAfterAds / values.adSpend : 0;
        if (targetProfit >= contributionMargin && values.targetProfitPercent > 0) {
          warnings.push(
            "Target profit exceeds contribution margin. Increase margin or lower profit target.",
          );
        }
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
              key: "profitMarginAfterAds",
              label: "Profit margin after ads",
              value: profitMarginAfterAds ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                profitMarginAfterAds === null
                  ? "Add revenue and ad spend"
                  : "Profit after ads / revenue",
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
            {
              key: "requiredRevenueBreakEven",
              label: "Revenue needed to break even",
              value: requiredRevenueForBreakEven ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredRevenueForBreakEven === null
                  ? "Contribution margin must be > 0"
                  : "Ad spend / contribution margin",
            },
            {
              key: "requiredRevenueTargetProfit",
              label: "Revenue needed for target profit",
              value: requiredRevenueForTargetProfit ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredRevenueForTargetProfit === null
                  ? "Target profit too high for margin"
                  : "Ad spend / (margin - target profit)",
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
          question: "What is a good ROAS-",
          answer:
            "It depends on your margins, fulfillment costs, and fixed costs. A ROAS that looks 'good' can still lose money if margins are low.",
        },
        {
          question: "What's the difference between ROAS and ROI-",
          answer:
            "ROAS is revenue divided by ad spend. ROI is profit relative to cost. ROAS can look great while ROI is negative if margins or costs are poor.",
        },
        {
          question: "Can I use ROAS for subscription businesses-",
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
          question: "Is break-even ROAS the same as target ROAS-",
          answer:
            "No. Break-even ROAS is the minimum ROAS to avoid losses on variable economics. Target ROAS should be higher to cover fixed costs and desired profit.",
        },
        {
          question: "Should I include fixed costs in break-even ROAS-",
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
          question: "How do I choose a fixed cost allocation-",
          answer:
            "Pick a conservative percent based on your business: total fixed costs divided by your expected revenue in the same period. Keep it stable for comparisons.",
        },
        {
          question: "Why can't I get a target ROAS-",
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
        "Model CPM -> CTR -> CVR to estimate CPC, CPA, ROAS, and profit per 1,000 impressions (with margin and variable costs).",
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
          "Most ad performance can be decomposed into a simple funnel: cost per 1,000 impressions (CPM) -> click-through rate (CTR) -> conversion rate (CVR) -> average order value (AOV).",
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
        const breakEvenRoas = contributionMargin > 0 ? 1 / contributionMargin : 0;
        const breakEvenCpa = contributionMargin > 0 ? values.aov * contributionMargin : 0;
        const profitPerOrder = values.aov * Math.max(contributionMargin, 0);
  
        return {
          headline: {
            key: "profitPer1000",
            label: "Profit per 1,000 impressions",
            value: profitPer1000,
            format: "currency",
            currency: "USD",
            detail: "Contribution per 1,000 - CPM",
          },
          secondary: [
            {
              key: "cpa",
              label: "CPA",
              value: cpa ?? 0,
              format: "currency",
              currency: "USD",
              detail: "CPC / CVR",
            },
            {
              key: "roas",
              label: "ROAS",
              value: roas ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "Revenue / spend",
            },
            {
              key: "breakEvenRoas",
              label: "Break-even ROAS",
              value: breakEvenRoas,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "1 / contribution margin",
            },
            {
              key: "breakEvenCpa",
              label: "Break-even CPA",
              value: breakEvenCpa,
              format: "currency",
              currency: "USD",
              detail: "AOV x contribution margin",
            },
            {
              key: "profitPerOrder",
              label: "Profit per order (gross profit)",
              value: profitPerOrder,
              format: "currency",
              currency: "USD",
              detail: "AOV x contribution margin",
            },
          ],
          breakdown: [
            {
              key: "cpc",
              label: "CPC",
              value: cpc ?? 0,
              format: "currency",
              currency: "USD",
              detail: "CPM / (CTR x 1000)",
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
            {
              key: "spendPer1000",
              label: "Spend per 1,000 impressions (CPM)",
              value: spendPer1000,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
      formula:
        "Clicks/1000 = 1000 x CTR; CPC = CPM / (1000 x CTR); CPA = CPC / CVR; ROAS = revenue / spend; Profit/1000 = (revenue x contribution margin) - CPM",
      assumptions: [
        "CTR and CVR are expressed as decimals for calculations (percent inputs are converted).",
        "Contribution margin = gross margin - fees - shipping - returns (simplified).",
        "Per-1,000-impressions view assumes attribution is consistent and conversions are attributable to ads.",
      ],
      faqs: [
        {
          question: "Why focus on profit per 1,000 impressions-",
          answer:
            "It reveals where performance is coming from. If profit is negative, you can see whether the lever is CPM, CTR, CVR, AOV, or contribution margin.",
        },
        {
          question: "How is break-even CPA computed-",
          answer:
            "Break-even CPA is the maximum you can pay per conversion without losing money on variable economics: AOV x contribution margin.",
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
          question: "Is ROI the same as ROAS-",
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
          "The key is consistency: define what costs you include and what counts as a \"new customer\", then use the same definition across time and segments.",
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
        {
          key: "targetPaybackMonths",
          label: "Target payback (months, optional)",
          help: "Set 0 to disable target CAC guidance.",
          placeholder: "12",
          defaultValue: "12",
          min: 0,
          step: 1,
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
        const annualGrossProfit =
          grossProfitPerMonth && grossProfitPerMonth > 0
            ? grossProfitPerMonth * 12
            : null;
        const cacToAnnualGrossProfit =
          annualGrossProfit && annualGrossProfit > 0 && cac
            ? cac / annualGrossProfit
            : null;
        const targetPayback = Math.max(0, Math.floor(values.targetPaybackMonths));
        if (values.targetPaybackMonths !== targetPayback)
          warnings.push("Target payback was rounded down to a whole number.");
        const maxCacForTargetPayback =
          grossProfitPerMonth && targetPayback > 0
            ? grossProfitPerMonth * targetPayback
            : null;
        const requiredArpaForTargetPayback =
          targetPayback > 0 && grossMargin > 0 && cac
            ? (cac / targetPayback) / grossMargin
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
              detail: "Spend / New customers",
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
              key: "annualGrossProfit",
              label: "Gross profit per account / year",
              value: annualGrossProfit ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                annualGrossProfit === null
                  ? "Add ARPA and gross margin"
                  : "Gross profit/month x 12",
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
            {
              key: "cacToAnnualGrossProfit",
              label: "CAC / annual gross profit",
              value: cacToAnnualGrossProfit ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail:
                cacToAnnualGrossProfit === null
                  ? "Add ARPA and gross margin"
                  : "CAC / annual gross profit",
            },
            {
              key: "maxCacForTargetPayback",
              label: `Max CAC for ${targetPayback} month payback`,
              value: maxCacForTargetPayback ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                maxCacForTargetPayback === null
                  ? "Set target payback > 0"
                  : "Gross profit/month x target months",
            },
            {
              key: "requiredArpaForTargetPayback",
              label: "Min ARPA for target payback",
              value: requiredArpaForTargetPayback ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredArpaForTargetPayback === null
                  ? "Add CAC, margin, and target payback"
                  : "CAC / target months / margin",
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
      formula: "CAC = Sales & Marketing Spend / New Customers",
      assumptions: [
        "Spend and new customers are measured over the same time window.",
        "New customers means net new paying customers (not leads or trials).",
        "Use a consistent cost definition (paid-only vs fully-loaded).",
        "Exclude retention costs unless you explicitly allocate them.",
      ],
      faqs: [
        {
          question: "Should I include salaries in CAC-",
          answer:
            "Many teams include the portion of sales/marketing salaries and tools attributable to acquisition; keep your definition consistent over time.",
        },
        {
          question: "What's the difference between paid CAC and blended CAC-",
          answer:
            "Paid CAC uses only paid acquisition spend (ads). Blended CAC includes all acquisition costs (paid + sales + marketing + tools) divided by new customers.",
        },
        {
          question: "Is CAC a good metric on its own-",
          answer:
            "Not by itself. Pair CAC with payback period and retention/LTV. A low CAC can still be bad if churn is high, and a high CAC can be fine if payback is fast and retention is strong.",
        },
        {
          question: "What if my sales cycle is long-",
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
          "Compute fully-loaded CAC = total acquisition costs / new customers.",
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
            detail: "Total acquisition costs / new customers",
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
        "Fully-loaded CAC = (paid spend + salaries + tools + other) / new customers",
      assumptions: [
        "All costs and new customers are measured over the same time window.",
        "Salaries/tools are allocated to acquisition consistently (planning definition).",
        "Use segment-level CAC (channel/plan) when possible; blended numbers can hide weak cohorts.",
      ],
      faqs: [
        {
          question: "Is fully-loaded CAC better than paid CAC-",
          answer:
            "They answer different questions. Paid CAC helps optimize paid channels; fully-loaded CAC is more useful for planning and unit economics because it includes the costs required to acquire customers.",
        },
        {
          question: "Should I include support and COGS in CAC-",
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
          question: "Should I use revenue churn or customer churn-",
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
          question: "Why is LTV so sensitive to churn-",
          answer:
            "Because churn is in the denominator. Small changes in churn can create large changes in lifetime and therefore in LTV in simple models.",
        },
        {
          question: "Should I use this instead of cohort LTV-",
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
          question: "What is a good LTV:CAC ratio-",
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
          "Payback is a cash-efficiency lens, not a profitability guarantee. Pair it with churn and margin assumptions.",
        ],
        steps: [
          "Choose a segment (channel/plan/geo) and a time window (usually monthly).",
          "Estimate ARPA per month for the segment.",
          "Choose gross margin for the same revenue base (product gross margin is common).",
          "Compute gross profit per month: ARPA * gross margin.",
          "Divide CAC by gross profit per month to get payback months.",
          "Optionally compare payback to expected lifetime (1 / churn) to sanity-check viability.",
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
          "Treating cash collected upfront as payback without matching gross margin timing.",
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
        {
          key: "targetPaybackMonths",
          label: "Target payback (months, optional)",
          help: "Set 0 to disable target CAC and ARPA guidance.",
          placeholder: "12",
          defaultValue: "12",
          min: 0,
          step: 1,
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
  
        const paybackYears = months / 12;
        const grossProfitPerYear = grossProfitPerMonth * 12;
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
        const targetPayback = Math.max(0, Math.floor(values.targetPaybackMonths));
        if (values.targetPaybackMonths !== targetPayback) {
          warnings.push("Target payback was rounded down to a whole number.");
        }
        const maxCacForTargetPayback =
          targetPayback > 0 ? grossProfitPerMonth * targetPayback : null;
        const requiredArpaForTargetPayback =
          targetPayback > 0 && grossMargin > 0
            ? (values.cac / targetPayback) / grossMargin
            : null;
  
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
              key: "grossProfitPerYear",
              label: "Gross profit / year",
              value: grossProfitPerYear,
              format: "currency",
              currency: "USD",
              detail: "Gross profit / month x 12",
            },
            {
              key: "paybackYears",
              label: "Payback (years)",
              value: paybackYears,
              format: "number",
              maxFractionDigits: 2,
              detail: "Payback months / 12",
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
              key: "maxCacForTargetPayback",
              label: `Max CAC for ${targetPayback} month payback`,
              value: maxCacForTargetPayback ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                maxCacForTargetPayback === null
                  ? "Set target payback > 0"
                  : "Gross profit / month x target months",
            },
            {
              key: "requiredArpaForTargetPayback",
              label: "Min ARPA for target payback",
              value: requiredArpaForTargetPayback ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredArpaForTargetPayback === null
                  ? "Set target payback and margin"
                  : "CAC / target months / margin",
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
          question: "Should payback include onboarding costs-",
          answer:
            "If onboarding costs are significant and variable per customer, include them in CAC so payback reflects full acquisition cost.",
        },
        {
          question: "How do I calculate months to recover CAC-",
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
          question: "Why use gross margin instead of revenue for payback-",
          answer:
            "Because payback should reflect contribution (value created after COGS). Revenue-based payback can overstate how fast you recover CAC.",
        },
        {
          question: "What ARPA and margin ranges should I test-",
          answer:
            "Test ranges that reflect pricing/mix uncertainty. A common starting point is +/-10-20% ARPA and +/-5-10% margin, then widen if your business is volatile.",
        },
        {
          question: "Is this the same as cohort payback curves-",
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
          "Optionally add forecast periods to estimate how many customers remain.",
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
        {
          key: "forecastPeriods",
          label: "Forecast periods (optional)",
          help: "Used to estimate retained customers after N periods.",
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
        if (values.lostCustomers < 0) warnings.push("Customers lost must be 0 or greater.");
        if (values.lostCustomers > values.startingCustomers)
          warnings.push("Customers lost cannot exceed customers at start.");
  
        const periodsPerYear = Math.max(1, Math.floor(values.periodsPerYear));
        if (values.periodsPerYear !== periodsPerYear) {
          warnings.push("Periods per year was rounded down to a whole number.");
        }
        const forecastPeriods = Math.max(1, Math.floor(values.forecastPeriods));
        if (values.forecastPeriods !== forecastPeriods) {
          warnings.push("Forecast periods was rounded down to a whole number.");
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
        const expectedRetention =
          retention > 0 ? Math.pow(retention, forecastPeriods) : 0;
        const expectedRemaining =
          values.startingCustomers * expectedRetention;
        const lifetimePeriods = churn > 0 ? 1 / churn : null;
        const halfLifePeriods =
          retention > 0 && retention < 1 ? Math.log(0.5) / Math.log(retention) : null;
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
            {
              key: "expectedRemaining",
              label: "Expected customers remaining",
              value: expectedRemaining,
              format: "number",
              maxFractionDigits: 0,
              detail: `${forecastPeriods} periods @ same churn`,
            },
            {
              key: "expectedRetention",
              label: "Expected retention after forecast",
              value: expectedRetention,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "lifetimePeriods",
              label: "Estimated customer lifetime (periods)",
              value: lifetimePeriods ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail: "1 / churn",
            },
            {
              key: "halfLifePeriods",
              label: "Half-life (periods)",
              value: halfLifePeriods ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail: "Time to 50% retention",
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
            {
              key: "forecastPeriods",
              label: "Forecast periods",
              value: forecastPeriods,
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
          question: "What about expansion revenue-",
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
          "Optionally add forecast periods to estimate remaining customers over time.",
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
        {
          key: "forecastPeriods",
          label: "Forecast periods (optional)",
          help: "Used to estimate retained customers after N periods.",
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
        if (values.endingCustomers < 0) warnings.push("Customers at end must be 0 or greater.");
        if (values.newCustomers < 0) warnings.push("New customers must be 0 or greater.");
  
        const periodsPerYear = Math.max(1, Math.floor(values.periodsPerYear));
        if (values.periodsPerYear !== periodsPerYear) {
          warnings.push("Periods per year was rounded down to a whole number.");
        }
        const forecastPeriods = Math.max(1, Math.floor(values.forecastPeriods));
        if (values.forecastPeriods !== forecastPeriods) {
          warnings.push("Forecast periods was rounded down to a whole number.");
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
        const expectedRetention =
          retention > 0 ? Math.pow(retention, forecastPeriods) : 0;
        const expectedRemaining =
          values.startingCustomers * expectedRetention;
        const lifetimePeriods = churn > 0 ? 1 / churn : null;
        const halfLifePeriods =
          retention > 0 && retention < 1 ? Math.log(0.5) / Math.log(retention) : null;
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
            {
              key: "expectedRemaining",
              label: "Expected customers remaining",
              value: expectedRemaining,
              format: "number",
              maxFractionDigits: 0,
              detail: `${forecastPeriods} periods @ same retention`,
            },
            {
              key: "expectedRetention",
              label: "Expected retention after forecast",
              value: expectedRetention,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "lifetimePeriods",
              label: "Estimated customer lifetime (periods)",
              value: lifetimePeriods ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail: "1 / churn",
            },
            {
              key: "halfLifePeriods",
              label: "Half-life (periods)",
              value: halfLifePeriods ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail: "Time to 50% retention",
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
            {
              key: "forecastPeriods",
              label: "Forecast periods",
              value: forecastPeriods,
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
          question: "Can retention rate be above 100%-",
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
          "This ARPU calculator computes Average Revenue Per User by dividing revenue by average active users for a period. It is commonly used to track monetization changes from pricing, packaging, and user mix.",
          "To calculate ARPU correctly, make sure your revenue and user count are measured over the same period and that you define what an \"active user\" means for your product.",
          "Use ARPU to compare monetization across segments (plan, geo, channel), not just a blended average.",
        ],
        steps: [
          "Pick a time window (month/quarter) and define \"active user\".",
          "Sum revenue for that same window (be consistent: gross vs net of refunds).",
          "Compute average active users for the window (e.g., average DAU, or (start + end) / 2).",
          "Divide revenue by average active users to get ARPU.",
          "Optional: annualize ARPU to compare across different window lengths.",
          "Optional: add a target ARPU to see required revenue.",
        ],
        pitfalls: [
          "Using total signups as the denominator instead of active users.",
          "Mixing active users and accounts (ARPU vs ARPA mismatch).",
          "Comparing ARPU across periods without segmenting by plan or geo when pricing changes.",
          "Changing revenue recognition (gross vs net) without updating historical comparisons.",
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
        {
          key: "targetArpu",
          label: "Target ARPU (optional)",
          help: "Use the same period as revenue.",
          placeholder: "30",
          prefix: "$",
          defaultValue: "0",
          min: 0,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        if (values.avgUsers <= 0) warnings.push("Average users must be greater than 0.");
        if (values.periodMonths <= 0) warnings.push("Period length must be greater than 0.");
        if (values.grossMarginPercent < 0 || values.grossMarginPercent > 100) {
          warnings.push("Gross margin must be between 0% and 100%.");
        }
        if (values.targetArpu < 0) warnings.push("Target ARPU must be 0 or greater.");
        const arpu = safeDivide(values.revenue, values.avgUsers);
        const monthlyArpu =
          arpu !== null && values.periodMonths > 0
            ? arpu / values.periodMonths
            : null;
        const annualizedArpu =
          arpu !== null && values.periodMonths > 0
            ? (arpu / values.periodMonths) * 12
            : null;
        const grossMargin = values.grossMarginPercent / 100;
        const grossProfitPerUser =
          arpu !== null && grossMargin > 0 ? arpu * grossMargin : null;
        const grossProfitPerUserMonthly =
          monthlyArpu !== null && grossMargin > 0 ? monthlyArpu * grossMargin : null;
        const grossProfitPerUserAnnual =
          monthlyArpu !== null && grossMargin > 0
            ? monthlyArpu * 12 * grossMargin
            : null;
        const requiredRevenueForTarget =
          values.targetArpu > 0 ? values.targetArpu * values.avgUsers : null;
        const gapToTarget =
          requiredRevenueForTarget !== null ? requiredRevenueForTarget - values.revenue : null;
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
            detail: "Revenue / Avg. users",
          },
          secondary: [
            {
              key: "monthlyArpu",
              label: "Monthly ARPU",
              value: monthlyArpu ?? 0,
              format: "currency",
              currency: "USD",
              detail: monthlyArpu === null ? "Add period months" : "ARPU / period months",
            },
            {
              key: "annualizedArpu",
              label: "Annualized ARPU",
              value: annualizedArpu ?? 0,
              format: "currency",
              currency: "USD",
              detail: "ARPU / period months x 12",
            },
            {
              key: "grossProfitPerUser",
              label: "Gross profit per user",
              value: grossProfitPerUser ?? 0,
              format: "currency",
              currency: "USD",
              detail: "ARPU x gross margin",
            },
            {
              key: "grossProfitPerUserMonthly",
              label: "Gross profit per user / month",
              value: grossProfitPerUserMonthly ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                grossProfitPerUserMonthly === null
                  ? "Add period months and margin"
                  : "Monthly ARPU x gross margin",
            },
            {
              key: "grossProfitPerUserAnnual",
              label: "Gross profit per user / year",
              value: grossProfitPerUserAnnual ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                grossProfitPerUserAnnual === null
                  ? "Add period months and margin"
                  : "Monthly ARPU x 12 x gross margin",
            },
            {
              key: "requiredRevenueForTarget",
              label: "Revenue needed for target ARPU",
              value: requiredRevenueForTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.targetArpu > 0 ? "Target ARPU x avg users" : "Add target ARPU",
            },
            {
              key: "gapToTarget",
              label: "Revenue gap to target",
              value: gapToTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.targetArpu > 0 ? "Required - current revenue" : "Add target ARPU",
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
              key: "avgUsers",
              label: "Average active users",
              value: values.avgUsers,
              format: "number",
              maxFractionDigits: 0,
            },
            {
              key: "periodMonths",
              label: "Period months",
              value: values.periodMonths,
              format: "months",
              maxFractionDigits: 2,
            },
            {
              key: "grossMargin",
              label: "Gross margin",
              value: grossMargin,
              format: "percent",
              maxFractionDigits: 1,
            },
            {
              key: "targetArpu",
              label: "Target ARPU",
              value: values.targetArpu,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
      formula: "ARPU = Revenue / Average Active Users",
      assumptions: [
        "Revenue, users, and period length use the same time window.",
        "Annualized ARPU scales linearly by period length.",
      ],
      faqs: [
        {
          question: "ARPU vs ARPA-",
          answer:
            "ARPU is per user; ARPA is per account. Choose the one that matches your product and reporting.",
        },
        {
          question: "How do you calculate ARPU-",
          answer:
            "ARPU = total revenue / average active users for the same period. Choose a time window (month/quarter), define 'active user', compute average active users, then divide revenue by that average.",
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
        "Calculate Average Revenue Per Account (ARPA) for SaaS businesses and understand the ARPA formula.",
      category: "saas-metrics",
      guideSlug: "arpa-guide",
      relatedGlossarySlugs: ["arpa", "arpa-vs-arpu"],
      seo: {
        intro: [
          "ARPA (Average Revenue Per Account) is revenue / average paying accounts for a period. It often matches B2B SaaS pricing better than ARPU because you sell to companies, not individual users.",
          "To compare ARPA over time, keep the definition of 'paying account' and the revenue base consistent (gross vs net of refunds/credits).",
          "ARPA is most useful when paired with churn or payback to understand unit economics.",
        ],
        steps: [
          "Pick a time window (month/quarter) and define what counts as a paying account.",
          "Sum revenue for that same window (choose a consistent revenue base).",
          "Compute the average number of paying accounts for the window.",
          "Divide revenue by average paying accounts to get ARPA.",
          "Optional: annualize ARPA to compare across period lengths.",
          "Optional: add a target ARPA to see required revenue.",
        ],
        pitfalls: [
          "Mixing accounts and users (ARPA vs ARPU mismatch).",
          "Including free/trial accounts in the denominator without labeling.",
          "Comparing ARPA across periods with big pricing/mix changes without segmentation.",
          "Using booked revenue instead of recurring revenue for SaaS run-rate comparisons.",
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
        {
          key: "targetArpa",
          label: "Target ARPA (optional)",
          help: "Use the same period as revenue.",
          placeholder: "2000",
          prefix: "$",
          defaultValue: "0",
          min: 0,
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
        if (values.targetArpa < 0) warnings.push("Target ARPA must be 0 or greater.");
  
        const arpa = safeDivide(values.revenue, values.avgAccounts);
        const monthlyArpa =
          arpa !== null && values.periodMonths > 0
            ? arpa / values.periodMonths
            : null;
        const annualizedArpa =
          arpa !== null && values.periodMonths > 0
            ? (arpa / values.periodMonths) * 12
            : null;
        const grossMargin = values.grossMarginPercent / 100;
        const grossProfitPerAccount =
          arpa !== null && grossMargin > 0 ? arpa * grossMargin : null;
        const grossProfitPerAccountMonthly =
          monthlyArpa !== null && grossMargin > 0 ? monthlyArpa * grossMargin : null;
        const grossProfitPerAccountAnnual =
          monthlyArpa !== null && grossMargin > 0
            ? monthlyArpa * 12 * grossMargin
            : null;
        const requiredRevenueForTarget =
          values.targetArpa > 0 ? values.targetArpa * values.avgAccounts : null;
        const gapToTarget =
          requiredRevenueForTarget !== null ? requiredRevenueForTarget - values.revenue : null;
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
            detail: "Revenue / Avg. accounts",
          },
          secondary: [
            {
              key: "monthlyArpa",
              label: "Monthly ARPA",
              value: monthlyArpa ?? 0,
              format: "currency",
              currency: "USD",
              detail: monthlyArpa === null ? "Add period months" : "ARPA / period months",
            },
            {
              key: "annualizedArpa",
              label: "Annualized ARPA",
              value: annualizedArpa ?? 0,
              format: "currency",
              currency: "USD",
              detail: "ARPA / period months x 12",
            },
            {
              key: "grossProfitPerAccount",
              label: "Gross profit per account",
              value: grossProfitPerAccount ?? 0,
              format: "currency",
              currency: "USD",
              detail: "ARPA x gross margin",
            },
            {
              key: "grossProfitPerAccountMonthly",
              label: "Gross profit per account / month",
              value: grossProfitPerAccountMonthly ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                grossProfitPerAccountMonthly === null
                  ? "Add period months and margin"
                  : "Monthly ARPA x gross margin",
            },
            {
              key: "grossProfitPerAccountAnnual",
              label: "Gross profit per account / year",
              value: grossProfitPerAccountAnnual ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                grossProfitPerAccountAnnual === null
                  ? "Add period months and margin"
                  : "Monthly ARPA x 12 x gross margin",
            },
            {
              key: "requiredRevenueForTarget",
              label: "Revenue needed for target ARPA",
              value: requiredRevenueForTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.targetArpa > 0 ? "Target ARPA x avg accounts" : "Add target ARPA",
            },
            {
              key: "gapToTarget",
              label: "Revenue gap to target",
              value: gapToTarget ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.targetArpa > 0 ? "Required - current revenue" : "Add target ARPA",
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
              key: "avgAccounts",
              label: "Average paying accounts",
              value: values.avgAccounts,
              format: "number",
              maxFractionDigits: 0,
            },
            {
              key: "periodMonths",
              label: "Period months",
              value: values.periodMonths,
              format: "months",
              maxFractionDigits: 2,
            },
            {
              key: "grossMargin",
              label: "Gross margin",
              value: grossMargin,
              format: "percent",
              maxFractionDigits: 1,
            },
            {
              key: "targetArpa",
              label: "Target ARPA",
              value: values.targetArpa,
              format: "currency",
              currency: "USD",
            },
          ],
          warnings,
        };
      },
      formula: "ARPA = Revenue / Average Paying Accounts",
      assumptions: [
        "Revenue, accounts, and period length use the same time window.",
        "Annualized ARPA scales linearly by period length.",
      ],
      faqs: [
        {
          question: "ARPA vs ARPU-",
          answer:
            "ARPA is per paying account/customer. ARPU is per active user. If you sell to companies, ARPA often matches pricing and reporting better.",
        },
        {
          question: "Should ARPA use revenue or gross profit-",
          answer:
            "ARPA is usually revenue-based. For unit economics decisions, also compute gross profit per account (ARPA x gross margin).",
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
          "This calculator uses a standard two-factor decomposition: revenue = users x ARPU.",
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
            detail: "End revenue - start revenue",
          },
          secondary: [
            {
              key: "startArpu",
              label: "ARPU (start)",
              value: startArpu,
              format: "currency",
              currency: "USD",
              detail: "Start revenue / start users",
            },
            {
              key: "endArpu",
              label: "ARPU (end)",
              value: endArpu,
              format: "currency",
              currency: "USD",
              detail: "End revenue / end users",
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
              label: "Interaction (users x ARPU change)",
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
              detail: userGrowth === null ? "Start users must be > 0" : "Delta  users / start users",
            },
            {
              key: "arpuGrowth",
              label: "ARPU growth rate",
              value: arpuGrowth ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: arpuGrowth === null ? "Start ARPU must be > 0" : "Delta  ARPU / start ARPU",
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
          question: "Why is there an 'interaction' term-",
          answer:
            "Because users and ARPU can change at the same time. The interaction term captures growth that comes from both increasing together (or offsetting each other).",
        },
        {
          question: "Should I use ARPU or ARPA for B2B SaaS-",
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
          "Optionally add targets to back-solve required customers or ARPA.",
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
            key: "targetCustomers",
            label: "Target customers (optional)",
            placeholder: "400",
            defaultValue: "0",
            min: 0,
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
          if (values.targetCustomers < 0)
            warnings.push("Target customers must be 0 or greater.");
          const mrr = values.customers * values.arpaMonthly;
          const arr = mrr * 12;
          const requiredCustomers =
            values.targetMrr > 0 && values.arpaMonthly > 0
              ? values.targetMrr / values.arpaMonthly
              : null;
          const requiredArpa =
            values.targetMrr > 0 && values.targetCustomers > 0
              ? values.targetMrr / values.targetCustomers
              : null;
          const arpaLow = values.arpaMonthly * 0.9;
          const arpaHigh = values.arpaMonthly * 1.1;
          const requiredCustomersLowArpa =
            values.targetMrr > 0 && arpaLow > 0 ? values.targetMrr / arpaLow : null;
          const requiredCustomersHighArpa =
            values.targetMrr > 0 && arpaHigh > 0 ? values.targetMrr / arpaHigh : null;
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
              {
                key: "requiredArpa",
                label: "Required ARPA for target MRR",
                value: requiredArpa ?? 0,
                format: "currency",
                currency: "USD",
                detail:
                  requiredArpa === null ? "Add target MRR and target customers" : "Target MRR / target customers",
              },
              {
                key: "requiredCustomersLowArpa",
                label: "Required customers (ARPA -10%)",
                value: requiredCustomersLowArpa ?? 0,
                format: "number",
                maxFractionDigits: 1,
                detail: values.targetMrr > 0 ? "Target MRR / (ARPA -10%)" : "Add target MRR",
              },
              {
                key: "requiredCustomersHighArpa",
                label: "Required customers (ARPA +10%)",
                value: requiredCustomersHighArpa ?? 0,
                format: "number",
                maxFractionDigits: 1,
                detail: values.targetMrr > 0 ? "Target MRR / (ARPA +10%)" : "Add target MRR",
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
                key: "targetCustomers",
                label: "Target customers",
                value: values.targetCustomers,
                format: "number",
                maxFractionDigits: 0,
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
          question: "Does MRR include one-time fees-",
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
          question: "Is MRR growth the same as revenue growth-",
          answer:
            "Not necessarily. MRR is a recurring run-rate snapshot. Revenue is what you recognize over time and can include non-recurring items.",
        },
        {
          question: "Should I use CMGR or YoY growth-",
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
          question: "Is MRR churn the same as customer churn-",
          answer:
            "No. MRR churn is revenue churn (lost recurring revenue). Customer churn is logo churn (lost customers). They can move differently if account sizes vary.",
        },
        {
          question: "Should I include downgrades in churned MRR-",
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
    }
];
