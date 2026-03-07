import type { CalculatorDefinition } from "./types";
import { safeDivide } from "./shared";

export const calculatorsPart4: CalculatorDefinition[] = [
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
          "Set an early churn rate and how many months it applies (e.g., months 1-3).",
          "Set a steady-state churn rate for later months.",
          "Enter ARPA and gross margin to convert retention into expected value.",
        ],
        pitfalls: [
          "Using churn rates from blended segments (plan/channel).",
          "Treating this as a substitute for real cohort curves; use it for planning and sensitivity.",
          "Ignoring expansion (revenue retention) when it's a major driver of value.",
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
        "Retention(m) = (1 - churn_early)^(min(m, earlyMonths)) x (1 - churn_steady)^(max(0, m - earlyMonths))",
      assumptions: [
        "Logo churn is modeled in two phases (early vs steady-state).",
        "ARPA and gross margin are constant over the horizon.",
        "Outputs are per original customer/account (expected value).",
      ],
      faqs: [
        {
          question: "When should I use two-stage churn-",
          answer:
            "When you observe a clear activation/onboarding drop early and much lower churn later. Two-stage models let you stress-test the impact of improving early retention vs improving steady-state retention.",
        },
        {
          question: "Does this replace cohort analysis-",
          answer:
            "No. It's a planning shortcut. Real cohort curves (by segment) are the gold standard for understanding retention dynamics and forecasting LTV.",
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
          "Revenue retention curves show how dollars retained change over time. They're more actionable than a single NRR/GRR snapshot because they reveal compounding effects.",
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
          question: "Why can NRR be above 100% while GRR is below 100%-",
          answer:
            "GRR excludes expansion, so churn and downgrades drive it down. NRR includes expansion, so upgrades can offset (or exceed) churn and contraction, pushing NRR above 100%.",
        },
        {
          question: "How do I make this more accurate-",
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
          "Max CPC answers: how much can you pay per click and still break even (or hit a profit target) given your conversion rate and order economics-",
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
              detail: "Contribution per conversion x (1 - buffer)",
            },
            {
              key: "breakEvenCpa",
              label: "Break-even CPA",
              value: breakEvenCpa,
              format: "currency",
              currency: "USD",
              detail: "Contribution per conversion (AOV x margin)",
            },
            {
              key: "breakEvenCpm",
              label: "Break-even CPM (if CTR provided)",
              value: breakEvenCpm ?? 0,
              format: "currency",
              currency: "USD",
              detail: breakEvenCpm === null ? "CTR is 0%" : "CPC x CTR x 1000",
            },
              {
                key: "targetCpm",
                label: "Target CPM (if CTR provided)",
                value: targetCpm ?? 0,
                format: "currency",
                currency: "USD",
                detail: targetCpm === null ? "CTR is 0%" : "Target CPC x CTR x 1000",
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
        "CVR is click-based (conversions / clicks).",
        "Ignores fixed costs and long-term LTV (use LTV-based targets for subscription).",
      ],
      faqs: [
        {
          question: "Should I use this for SaaS trials/leads-",
          answer:
            "If your conversion is a lead or trial (not a purchase), this is still useful, but you must adjust AOV to expected value per lead/trial (lead value), or use an LTV-based target CPA instead.",
        },
        {
          question: "Why does CPC depend on CVR-",
          answer:
            "Because CPA = CPC / CVR. If CVR drops, the same CPC produces a higher CPA, so your max CPC must fall to stay within your CPA target.",
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
          question: "Why does DCF give enterprise value instead of equity value-",
          answer:
            "Many DCFs discount unlevered free cash flows (available to all capital providers), producing EV. You then bridge to equity value using net debt and other claims.",
        },
        {
          question: "What about working capital, leases, and other liabilities-",
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
          "Investor ownership in a new round is typically approximated as investment / post-money (ignoring option pool changes and other instruments).",
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
            detail: "Investment / post-money",
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
      formula: "Post-money = pre-money + investment; investor % ~ investment / post-money",
      assumptions: [
        "Simplified equity financing model; ignores option pool changes, SAFEs/notes, and fees.",
        "Uses valuation-based ownership approximation rather than a full cap table.",
      ],
      faqs: [
        {
          question: "Is investor ownership always investment / post-money-",
          answer:
            "Often as a first approximation, yes. But option pool increases, SAFEs/notes converting, and share-class terms can change the final ownership.",
        },
        {
          question: "What is the option pool shuffle-",
          answer:
            "It's when the option pool is increased before the investment and counted in the pre-money, which dilutes existing shareholders more than the simple investment / post-money calculation suggests.",
        },
      ],
      guide: [
        {
          title: "Valuation tips",
          bullets: [
            "Use post-money for quick ownership math, but validate with a cap table model.",
            "Model the option pool shuffle explicitly if you're negotiating founder dilution.",
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
          "A simple model can estimate ownership dilution if you do not invest and the investment needed to keep ownership constant.",
        ],
        steps: [
          "Enter your current ownership (before the new round).",
          "Enter pre-money valuation and new investment amount.",
          "Review your ownership if you do not participate and your estimated pro rata check size.",
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
        const dilutionPercent =
          ownershipNoParticipate !== null && ownership > 0
            ? (ownership - ownershipNoParticipate) / ownership
            : null;
        const shareOfRound = values.investment > 0 ? proRataInvestment / values.investment : null;
  
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
            detail: "Current % x new investment",
          },
          secondary: [
            {
              key: "ownershipNoParticipate",
              label: "Ownership if you do not participate",
              value: ownershipNoParticipate ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Current % x (pre-money / post-money)",
            },
            {
              key: "dilutionPercent",
              label: "Dilution if you do not participate",
              value: dilutionPercent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: dilutionPercent === null ? "Ownership is 0" : "Loss vs current ownership",
            },
            {
              key: "shareOfRound",
              label: "Pro rata share of round",
              value: shareOfRound ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: shareOfRound === null ? "Round size is 0" : "Pro rata / round size",
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
      formula: "Pro rata check = current ownership % x round size; ownership (no participate) = current % x (pre-money / post-money)",
      assumptions: [
        "Simplified model; ignores option pool changes, SAFEs/notes, and share-class terms.",
        "Assumes ownership is measured on a consistent fully diluted basis before and after the round.",
      ],
      faqs: [
        {
          question: "Why is pro rata investment current % x round size-",
          answer:
            "If you own X% and want to keep X% after new shares are issued, you typically need to buy X% of the new issuance, which corresponds to about X% of the round size in a priced round.",
        },
        {
          question: "Why does ownership drop if I do not participate-",
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
        const existingPostNoTopUp = 1 - investorPost - p0;
        const poolDilution = Math.max(0, existingPostNoTopUp - existingPost);
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
              detail: "Investment / post-money",
            },
            {
              key: "poolPost",
              label: "Option pool (post-money target)",
              value: pt,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "poolDilution",
              label: "Dilution from pool top-up",
              value: poolDilution,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Existing % loss vs no top-up",
            },
            {
              key: "postMoney",
              label: "Post-money valuation",
              value: postMoney,
              format: "currency",
              currency: "USD",
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
            {
              key: "existingPostNoTopUp",
              label: "Existing holders (post-money, no top-up)",
              value: Math.max(0, existingPostNoTopUp),
              format: "percent",
              maxFractionDigits: 2,
              detail: "What existing holders would own without a pool increase",
            },
          ],
          warnings,
        };
      },
      formula: "Investor % = investment / post-money; option pool shuffle solves for extra pool shares to reach target pool % post-money (simplified share normalization).",
      assumptions: [
        "Uses a simplified fully diluted share model normalized to 1 pre-money share base.",
        "Ignores SAFE/note conversions and any share-class / liquidation preference terms.",
        "Assumes investor ownership approximation investment / post-money.",
      ],
      faqs: [
        {
          question: "Why does the option pool shuffle matter-",
          answer:
            "Because increasing the option pool before the investment effectively reduces the ownership left for existing holders (founders and prior investors), even if the headline valuation is unchanged.",
        },
        {
          question: "Is this a full cap table model-",
          answer:
            "No. It's a simplified model to estimate the direction and magnitude. For negotiation and legal accuracy, build a full cap table including SAFEs/notes and share classes.",
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
        if (values.discountPercent > 0 && discountPrice > 0 && discountPrice < conversionPrice) {
          conversionPrice = discountPrice;
          method = "Discount";
        }
  
        const safeShares = safeDivide(values.safeAmount, conversionPrice) ?? 0;
        const investorShares = safeDivide(values.newMoney, roundPrice) ?? 0;
        const postShares = shares + safeShares + investorShares;
        const safeOwnership = safeDivide(safeShares, postShares) ?? 0;
        const effectiveDiscount =
          roundPrice > 0 ? 1 - conversionPrice / roundPrice : null;
        const impliedPreMoney = conversionPrice * shares;
  
        return {
          headline: {
            key: "safeOwnership",
            label: "SAFE ownership (estimated)",
            value: safeOwnership,
            format: "percent",
            maxFractionDigits: 2,
            detail: "SAFE shares / post-round shares (simplified)",
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
            {
              key: "effectiveDiscount",
              label: "Effective discount vs round",
              value: effectiveDiscount ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: effectiveDiscount === null ? "Round price is 0" : "1 - conversion / round",
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
              key: "capPrice",
              label: "Cap price per share",
              value: capPrice ?? 0,
              format: "currency",
              currency: "USD",
              detail: capPrice === null ? "No cap" : "Valuation cap / shares",
            },
            {
              key: "discountPrice",
              label: "Discount price per share",
              value: discountPrice,
              format: "currency",
              currency: "USD",
              detail: "Round price x (1 - discount)",
            },
            {
              key: "impliedPreMoney",
              label: "Implied pre-money at conversion price",
              value: impliedPreMoney,
              format: "currency",
              currency: "USD",
              detail: "Conversion price x shares",
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
      formula: "Round price = pre-money / shares; SAFE price = min(cap price, discounted round price, round price); SAFE shares = SAFE amount / SAFE price",
      assumptions: [
        "Simplified priced-round model; ignores option pool changes, other SAFEs/notes, and legal nuances (post-money SAFE, MFN, etc.).",
        "Assumes existing shares input is fully diluted and matches the priced round pre-money valuation basis.",
      ],
      faqs: [
        {
          question: "Cap vs discount: which one applies-",
          answer:
            "Many SAFEs convert at the better (lower price) of the cap price or the discount price. Terms vary, so confirm your SAFE document.",
        },
        {
          question: "Why do I need existing shares-",
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
        if (values.discountPercent > 0 && discountPrice > 0 && discountPrice < conversionPrice) {
          conversionPrice = discountPrice;
          method = "Discount";
        }
  
        const noteShares = safeDivide(total, conversionPrice) ?? 0;
        const investorShares = safeDivide(values.newMoney, roundPrice) ?? 0;
        const postShares = shares + noteShares + investorShares;
        const noteOwnership = safeDivide(noteShares, postShares) ?? 0;
        const effectiveDiscount =
          roundPrice > 0 ? 1 - conversionPrice / roundPrice : null;
        const impliedPreMoney = conversionPrice * shares;
        const interestPercent = values.principal > 0 ? interest / values.principal : null;
  
        return {
          headline: {
            key: "noteOwnership",
            label: "Note ownership (estimated)",
            value: noteOwnership,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Note shares / post-round shares (simplified)",
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
            {
              key: "interest",
              label: "Interest accrued",
              value: interest,
              format: "currency",
              currency: "USD",
              detail: interestPercent === null ? "Principal is 0" : `${(interestPercent * 100).toFixed(2)}% of principal`,
            },
            {
              key: "effectiveDiscount",
              label: "Effective discount vs round",
              value: effectiveDiscount ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: effectiveDiscount === null ? "Round price is 0" : "1 - conversion / round",
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
              key: "capPrice",
              label: "Cap price per share",
              value: capPrice ?? 0,
              format: "currency",
              currency: "USD",
              detail: capPrice === null ? "No cap" : "Valuation cap / shares",
            },
            {
              key: "discountPrice",
              label: "Discount price per share",
              value: discountPrice,
              format: "currency",
              currency: "USD",
              detail: "Round price x (1 - discount)",
            },
            {
              key: "impliedPreMoney",
              label: "Implied pre-money at conversion price",
              value: impliedPreMoney,
              format: "currency",
              currency: "USD",
              detail: "Conversion price x shares",
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
      formula: "Total note = principal + interest; conversion price = min(cap price, discounted round price, round price); note shares = total / conversion price",
      assumptions: [
        "Uses simple interest (actual note terms may compound or accrue differently).",
        "Simplified priced-round model; ignores option pool changes, other instruments, and legal nuances.",
        "Assumes existing shares input is fully diluted and matches the priced round valuation basis.",
      ],
      faqs: [
        {
          question: "Does interest always convert into shares-",
          answer:
            "Often yes, but terms vary. Some notes may pay interest in cash or have specific conversion rules. Confirm the note documents.",
        },
        {
          question: "Is cap vs discount always best of-",
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
              detail: "Ownership % x exit",
            },
          ],
          breakdown: [
            {
              key: "preference",
              label: "Preference payout",
              value: preference,
              format: "currency",
              currency: "USD",
              detail: "Investment x preference multiple",
            },
          ],
          warnings,
        };
      },
      formula:
        "Investor proceeds (1x non-participating) = max(preference multiple x investment, ownership % x exit value)",
      assumptions: [
        "Models a single investor class with non-participating preferred only (simplified).",
        "Ignores stacked preferences, seniority, participation, dividends, and caps.",
      ],
      faqs: [
        {
          question: "What if there are multiple preference stacks-",
          answer:
            "You need a waterfall model with seniority (Series B before Series A, etc.). This calculator is a simplified single-layer version.",
        },
        {
          question: "What about participating preferred-",
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
          "Unit economics answer: do we create enough gross profit per customer to justify what we spend to acquire them, and how fast do we get cash back-",
          "This dashboard calculator computes gross profit LTV, CAC payback months, LTV:CAC, and simple break-even targets. It's designed for fast scenario testing and planning.",
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
        const annualGrossProfit = grossProfitPerMonth * 12;
        const ltvMinusCac =
          grossProfitLtv !== null ? grossProfitLtv - values.cac : null;
        const paybackToLifetime =
          paybackMonths !== null && lifetimeMonths !== null && lifetimeMonths > 0
            ? paybackMonths / lifetimeMonths
            : null;
  
        const targetPayback = Math.floor(values.targetPaybackMonths);
        if (values.targetPaybackMonths !== targetPayback)
          warnings.push("Target payback was rounded down to a whole number.");
  
        const maxCacForTargetPayback =
          targetPayback > 0 ? grossProfitPerMonth * targetPayback : null;
        const requiredArpaForTargetPayback =
          targetPayback > 0 && margin > 0
            ? (values.cac / targetPayback) / margin
            : null;
  
        const breakEvenMonthlyChurn =
          grossProfitLtv && grossProfitLtv > 0
            ? safeDivide(grossProfitPerMonth, grossProfitLtv)
            : churn;
        if (ltvToCac !== null && ltvToCac < 1) {
          warnings.push("LTV:CAC is below 1x; payback may not be achievable.");
        }
        if (paybackToLifetime !== null && paybackToLifetime > 1) {
          warnings.push("Payback exceeds estimated lifetime; unit economics are negative.");
        }
  
        return {
          headline: {
            key: "ltvToCac",
            label: "LTV:CAC (gross profit)",
            value: ltvToCac ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: ltvToCac === null ? "Enter valid churn and CAC" : "Gross profit LTV / CAC",
          },
          secondary: [
            {
              key: "grossProfitLtv",
              label: "Gross profit LTV (shortcut)",
              value: grossProfitLtv ?? 0,
              format: "currency",
              currency: "USD",
              detail: grossProfitLtv === null ? "Requires churn > 0" : "Gross profit/month x lifetime",
            },
            {
              key: "paybackMonths",
              label: "CAC payback (months)",
              value: paybackMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail: paybackMonths === null ? "Requires margin and ARPA" : "CAC / gross profit/month",
            },
            {
              key: "grossProfitPerMonth",
              label: "Gross profit per month",
              value: grossProfitPerMonth,
              format: "currency",
              currency: "USD",
              detail: "ARPA x gross margin",
            },
            {
              key: "annualGrossProfit",
              label: "Gross profit per year",
              value: annualGrossProfit,
              format: "currency",
              currency: "USD",
              detail: "Gross profit/month x 12",
            },
            {
              key: "lifetimeMonths",
              label: "Approx. lifetime (months)",
              value: lifetimeMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail: lifetimeMonths === null ? "Churn is 0%" : "1 / monthly churn",
            },
            {
              key: "ltvMinusCac",
              label: "Gross profit LTV - CAC",
              value: ltvMinusCac ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                ltvMinusCac === null ? "Requires churn > 0" : "Value created per customer",
            },
            {
              key: "maxCac",
              label: `Max CAC for ${targetPayback} month payback`,
              value: maxCacForTargetPayback ?? 0,
              format: "currency",
              currency: "USD",
              detail: maxCacForTargetPayback === null ? "Set target payback > 0" : "Gross profit/month x target months",
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
              label: "Payback / lifetime",
              value: paybackToLifetime ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                paybackToLifetime === null
                  ? "Requires churn > 0"
                  : "Payback months / lifetime months",
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
        "Gross profit LTV ~ (ARPAxgross margin) / churn; Payback ~ CAC / (ARPAxgross margin); LTV:CAC ~ LTV / CAC",
      assumptions: [
        "Uses logo churn as a shortcut lifetime estimate (1/churn).",
        "Assumes constant ARPA and gross margin over lifetime.",
        "For accuracy, use cohort-based LTV and segment-level retention curves.",
      ],
      faqs: [
        {
          question: "What LTV:CAC is good-",
          answer:
            "It depends on growth stage and payback constraints. Many teams use ~3x as a rough rule of thumb, but payback and cash constraints matter more than a single ratio.",
        },
        {
          question: "Why can this be misleading-",
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
          label: "CVR (click -> conversion)",
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
              detail: "1000xCTRxCVR",
            },
              {
                key: "contributionPerConversion",
                label: "Contribution per conversion",
                value: contributionPerConversion,
                format: "currency",
                currency: "USD",
                detail: "AOVxmargin",
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
        "Conversions/1000 = 1000xCTRxCVR; Break-even CPM = conversions/1000 x (AOVxmargin); Target CPM = break-even x (1-buffer)",
      assumptions: [
        "CVR is click-based (conversions / clicks).",
        "Contribution margin captures variable costs (not fixed overhead).",
        "Ignores long-term LTV; best for one-time purchase economics.",
      ],
      faqs: [
        {
          question: "How is this different from max CPC-",
          answer:
            "Max CPC tells you what you can pay per click. Break-even CPM tells you what you can pay per 1,000 impressions. They are linked via CTR: CPM ~ CPCxCTRx1000.",
        },
        {
          question: "What if my platform charges CPM but optimizes for conversions-",
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
          "This calculator estimates enterprise value (metric x multiple) and then bridges to equity value using cash and debt.",
        ],
        steps: [
          "Choose a metric value (ARR or annual revenue) and a multiple.",
          "Compute enterprise value = metric x multiple.",
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
        const equityToMetric = values.metricValue > 0 ? equityValue / values.metricValue : null;
        const netDebtToEv = enterpriseValue > 0 ? netDebt / enterpriseValue : null;
        const cashToDebt = values.debt > 0 ? values.cash / values.debt : null;
  
        if (equityValue < 0) warnings.push("Equity value is negative (net debt exceeds EV).");
  
        return {
          headline: {
            key: "enterpriseValue",
            label: "Enterprise value (EV)",
            value: enterpriseValue,
            format: "currency",
            currency: "USD",
            detail: "Metric x multiple",
          },
          secondary: [
            {
              key: "equityValue",
              label: "Equity value",
              value: equityValue,
              format: "currency",
              currency: "USD",
              detail: "EV + cash - debt",
            },
            {
              key: "netDebt",
              label: "Net debt",
              value: netDebt,
              format: "currency",
              currency: "USD",
              detail: "Debt - cash",
            },
            {
              key: "equityToMetric",
              label: "Equity value multiple",
              value: equityToMetric ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: equityToMetric === null ? "Metric is 0" : "Equity value / metric",
            },
            {
              key: "netDebtToEv",
              label: "Net debt as % of EV",
              value: netDebtToEv ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: netDebtToEv === null ? "EV is 0" : "Net debt / EV",
            },
            {
              key: "cashToDebt",
              label: "Cash to debt ratio",
              value: cashToDebt ?? 0,
              format: "ratio",
              maxFractionDigits: 2,
              detail: cashToDebt === null ? "Debt is 0" : "Cash / debt",
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
      formula: "EV = metric x multiple; Equity value = EV + cash - debt",
      assumptions: [
        "Multiple is applied to a single metric definition (be consistent).",
        "Uses a simplified EV-to-equity bridge (cash and debt only).",
        "Multiple selection should reflect growth, margin, and retention context.",
      ],
      faqs: [
        {
          question: "ARR multiple vs revenue multiple: which should I usex",
          answer:
            "For subscription businesses, ARR multiples are common because ARR captures recurring run-rate. Revenue multiples can be more appropriate when revenue is mostly recurring and recognized consistently. Always match the multiple to the metric definition used by comps.",
        },
        {
          question: "Why does equity value differ from EVx",
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
          const retention12 = retentionAt(12);
          const retention24 = retentionAt(24);
          const arpaMonth12 =
            values.arpaMonthly * Math.pow(1 + expansion, 11);
  
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
          const paybackGap =
            paybackMonth !== null ? horizon - paybackMonth : null;
  
        return {
          headline: {
            key: "payback",
            label: "Estimated payback (months)",
            value: paybackMonth ?? 0,
            format: "months",
            maxFractionDigits: 1,
            detail: paybackMonth === null ? "Not reached in horizon" : "Cumulative gross profit >= CAC",
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
              detail: "Cumulative gross profit / CAC",
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
                key: "retention12",
                label: "Retention after 12 months",
                value: retention12,
                format: "percent",
                maxFractionDigits: 1,
                detail: "Two-stage churn model",
              },
              {
                key: "retention24",
                label: "Retention after 24 months",
                value: retention24,
                format: "percent",
                maxFractionDigits: 1,
                detail: "Two-stage churn model",
              },
              {
                key: "arpaMonth12",
                label: "ARPA in month 12 (with expansion)",
                value: arpaMonth12,
                format: "currency",
                currency: "USD",
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
              {
                key: "paybackGap",
                label: "Months remaining after payback",
                value: paybackGap ?? 0,
                format: "months",
                maxFractionDigits: 1,
                detail: paybackGap === null ? "Payback not reached" : "Horizon - payback",
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
        "Cumulative gross profit = sum (retained_customers_t x ARPA_t x gross margin); Payback occurs when cumulative gross profit >= CAC",
      assumptions: [
        "Two-stage logo churn (early vs steady-state).",
        "Expansion applies to surviving customers' revenue each month (simplified).",
        "Gross margin is constant and used as a proxy for gross profit.",
      ],
      faqs: [
        {
          question: "Why model early churn separately-",
          answer:
            "Because early churn often dominates payback. Improving activation and onboarding can dramatically reduce payback even if steady-state churn is unchanged.",
        },
        {
          question: "Should I use logo churn or revenue churn-",
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
          label: "CVR (click -> conversion)",
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
        "Break-even CTR = CPM / (1000xCVRxAOVxmargin); Target CTR = break-even / (1 - buffer)",
      assumptions: [
        "CVR is click-based (conversions / clicks).",
        "Margin reflects variable economics (contribution margin).",
        "Ignores long-term LTV; best for one-time purchase economics.",
      ],
      faqs: [
        {
          question: "Why does required CTR increase when margin is lower-",
          answer:
            "Lower margin means less contribution per conversion. To cover the same CPM, you need more conversions per 1,000 impressions, which requires higher CTR (or higher CVR).",
        },
        {
          question: "Should I use this for subscription products-",
          answer:
            "Use it as a first-order sanity check, but subscription businesses should typically use LTV-based targets (because value is not captured in a single purchase AOV).",
        },
      ],
    },
  {
      slug: "dcf-sensitivity-calculator",
      title: "DCF Sensitivity Calculator",
      description:
        "Estimate how enterprise value changes with discount rate and terminal growth assumptions (simple 3x3 sensitivity).",
      category: "finance",
      guideSlug: "dcf-sensitivity-guide",
      relatedGlossarySlugs: ["dcf", "discount-rate", "terminal-value", "wacc", "sensitivity-analysis"],
      seo: {
        intro: [
          "Most DCFs are dominated by discount rate and terminal value assumptions. A sensitivity grid helps you see how fragile (or robust) your valuation is.",
          "This calculator computes enterprise value at a 3x3 grid around your base discount rate and terminal growth assumptions.",
        ],
        steps: [
          "Enter current annual free cash flow (FCF) and a simple forecast (years + growth).",
          "Enter base discount rate and terminal growth.",
          "Enter steps for discount rate and terminal growth to generate a 3x3 grid.",
        ],
        pitfalls: [
          "Terminal growth >= discount rate (invalid in perpetuity model).",
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
        "EV = sum (FCF_t/(1+r)^t) + (FCF_(n+1)/(r - g_terminal))/(1+r)^n; Sensitivity varies r and g_terminal",
      assumptions: [
        "Uses a simple constant growth forecast during the explicit period.",
        "Terminal value uses a perpetuity growth model.",
        "Only shows a small grid; use broader scenarios for full sensitivity analysis.",
      ],
      faqs: [
        {
          question: "Why do some grid points disappear-",
          answer:
            "Because the perpetuity model requires terminal growth to be less than the discount rate (r > g). When g is too high relative to r, the terminal value becomes mathematically invalid.",
        },
        {
          question: "How should I pick the steps-",
          answer:
            "A common starting point is +/-1-3% for discount rate and +/-0.5-1% for terminal growth. If valuation changes wildly, you need more conservative assumptions and/or better forecasting detail.",
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
          "Using an MDE that's smaller than what you can act on (forces huge samples).",
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
          help: "Minimum detectable effect as percentage points (e.g., 0.5 means 2.5% -> 3.0%).",
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
        "n ~ ((z_(1-alpha/2)sqrt(2p-(1-p-)) + z_(power)sqrt(p1(1-p1)+p2(1-p2)))2) / (p2-p1)2",
      assumptions: [
        "Two-sided z-test approximation for proportions.",
        "Independent samples and stable baseline rate.",
        "Does not adjust for multiple testing or sequential stopping rules.",
      ],
      faqs: [
        {
          question: "Why does sample size explode when CVR is low-",
          answer:
            "When conversion is rare, noise is high relative to the signal. Detecting small lifts requires much larger samples.",
        },
        {
          question: "Should I run until I hit the sample size exactly-",
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
            detail: "CPL / lead-to-customer rate",
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
                detail: requiredRate === null ? "Target CAC disabled" : "CPL / target CAC",
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
                detail: values.salesCostPerLead > 0 ? "All-in CPL / lead-to-customer rate" : "Add sales cost per lead",
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
      formula: "CAC = CPL / (lead-to-customer rate)",
      assumptions: [
        "Lead-to-customer rate reflects final paying customers (not MQLs).",
        "CPL and close rate are measured over consistent time windows.",
        "Excludes sales salaries unless your CPL includes them (definition matters).",
      ],
      faqs: [
        {
          question: "Should I include sales cost in CPL or CAC-",
          answer:
            "For planning, include sales salaries and tooling in CAC (blended CAC). For channel optimization, teams often track paid CPL/CPA separately. The key is labeling and consistency.",
        },
        {
          question: "What if leads convert over multiple months-",
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
          "When buying impressions, CVR is a major profit lever. If CVR is too low, even great CTR won't save economics at a given CPM.",
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
          const breakEvenCpa = breakEvenCvr > 0 ? impliedCpc / breakEvenCvr : 0;
          const targetCpa = targetCvr > 0 ? impliedCpc / targetCvr : 0;
          const breakEvenCpmAtCurrent =
            currentCvr > 0 ? 1000 * ctr * currentCvr * values.aov * margin : 0;
          const targetCpmAtCurrent =
            currentCvr > 0
              ? breakEvenCpmAtCurrent * Math.max(0, 1 - buffer)
              : 0;
  
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
              key: "breakEvenCpa",
              label: "Break-even CPA (implied)",
              value: breakEvenCpa,
              format: "currency",
              currency: "USD",
              detail: "Implied CPC / break-even CVR",
            },
              {
                key: "impliedCpc",
                label: "Implied CPC from CPM and CTR",
                value: impliedCpc,
                format: "currency",
                currency: "USD",
              },
              {
                key: "targetCpa",
                label: "Target CPA (with buffer)",
                value: targetCpa,
                format: "currency",
                currency: "USD",
                detail: "Implied CPC / target CVR",
              },
              {
                key: "breakEvenCpmAtCurrent",
                label: "Break-even CPM (at current CVR)",
                value: breakEvenCpmAtCurrent,
                format: "currency",
                currency: "USD",
                detail: currentCvr > 0 ? "CPM ceiling for current CVR" : "Add current CVR",
              },
              {
                key: "targetCpmAtCurrent",
                label: "Target CPM (at current CVR)",
                value: targetCpmAtCurrent,
                format: "currency",
                currency: "USD",
                detail: currentCvr > 0 ? "Break-even CPM x (1 - buffer)" : "Add current CVR",
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
        "Break-even CVR = CPM / (1000xCTRxAOVxmargin); Target CVR = break-even / (1-buffer)",
      assumptions: [
        "CTR and CVR are measured on a click basis (consistent denominators).",
        "Margin reflects variable economics (contribution margin).",
        "Best for one-time purchase economics; subscription needs LTV-based targets.",
      ],
      faqs: [
        {
          question: "If my CVR is below break-even, what can I do-",
          answer:
            "Increase CVR via landing page/offer improvements, increase AOV, improve margin, lower CPM, or improve CTR. If none are feasible, the placement may not be viable.",
        },
        {
          question: "How does this relate to break-even CTR-",
          answer:
            "They're symmetric levers. Break-even CTR and CVR are both derived from the same underlying economics; improving either increases allowable CPM.",
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
            detail: "Conversions / clicks",
          },
          secondary: [
            {
              key: "clicksPerConversion",
              label: "Clicks per conversion",
              value: clicksPerConversion ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail: values.conversions > 0 ? "Clicks / conversions" : "No conversions",
            },
              {
                key: "requiredClicks",
                label: "Required clicks for target",
                value: requiredClicksForTarget ?? 0,
                format: "number",
                maxFractionDigits: 0,
                detail: cvr && cvr > 0 ? "Target conversions / CVR" : "Enter valid clicks",
              },
              {
                key: "cpc",
                label: "CPC (from spend)",
                value: cpc ?? 0,
                format: "currency",
                currency: "USD",
                detail: cpc === null ? "Add spend" : "Spend / clicks",
              },
              {
                key: "cpa",
                label: "CPA (from spend)",
                value: cpa ?? 0,
                format: "currency",
                currency: "USD",
                detail: cpa === null ? "Add spend and conversions" : "Spend / conversions",
              },
              {
                key: "roas",
                label: "ROAS (from revenue)",
                value: roas ?? 0,
                format: "multiple",
                maxFractionDigits: 2,
                detail: roas === null ? "Add spend and revenue" : "Revenue / spend",
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
      formula: "Click-through CVR = conversions / clicks",
      assumptions: [
        "Clicks and conversions are measured over the same window and attribution rules.",
        "Uses click-based CVR (not session-based).",
      ],
      faqs: [
        {
          question: "Is this the same as session CVR-",
          answer:
            "No. Session CVR uses sessions as the denominator. If your spend is click-based, click CVR keeps units consistent.",
        },
        {
          question: "What if my conversions lag clicks-",
          answer:
            "Use a longer attribution window or wait for lag to settle before calculating CVR. Short windows often understate true conversion rate.",
        },
      ],
    }
];
