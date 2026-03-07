import type { CalculatorDefinition } from "./types";
import { safeDivide } from "./shared";

export const calculatorsPart3: CalculatorDefinition[] = [
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
          question: "Why is this only an estimate-",
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
          "Break-even revenue answers: how much revenue do you need to cover fixed costs given a contribution margin (gross margin is a common proxy)-",
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
          question: "What if my costs are not fixed-",
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
          question: "What discount rate should I use-",
          answer:
            "Use your required return or hurdle rate (often called MARR). Many teams test a range (e.g., 8%-20%) to see sensitivity.",
        },
        {
          question: "NPV vs IRR-",
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
          "Enter expected annual cash flows for years 1-5.",
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
          question: "IRR vs NPV: which should I use-",
          answer:
            "Use NPV for decisions at a chosen required return (MARR) because it measures value created in dollars. Use IRR to compare opportunities when capital is constrained, but validate with NPV to avoid misleading results.",
        },
        {
          question: "Why might IRR be undefined or weird-",
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
          "Discounted payback answers: how long until the present value of cash flows pays back the initial investment-",
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
          question: "Why is discounted payback longer than simple payback-",
          answer:
            "Discounting reduces the present value of future cash flows, so it usually takes longer (in discounted terms) to recover the initial investment.",
        },
      ],
    },
  {
      slug: "mrr-forecast-calculator",
      title: "MRR Forecast Calculator",
      description:
        "MRR forecast calculator: project MRR over time using new MRR plus expansion, contraction, and churn rates.",
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
          "This MRR forecast calculator helps you stress-test growth assumptions and see which lever matters most: new MRR vs retention and expansion.",
          "This calculator models a simple monthly MRR bridge: starting MRR plus new MRR, expansion, minus contraction and churn, repeated for the number of months you choose.",
        ],
        steps: [
          "Enter your starting MRR (current recurring run-rate).",
          "Estimate new MRR added per month (from new customers).",
          "Set monthly expansion, contraction, and churn rates for existing MRR.",
          "Choose a horizon (e.g., 6-24 months) and compare scenarios.",
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
          let mrrAt3 = 0;
          let mrrAt6 = 0;
          let mrrAt12 = 0;
  
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
          if (month === 3) mrrAt3 = mrr;
          if (month === 6) mrrAt6 = mrr;
          if (month === 12) mrrAt12 = mrr;
          if (next < 0) warnings.push("Your assumptions drive MRR below $0; the forecast is floored at $0.");
        }
  
          const netNewMrr = mrr - baseMrr;
          const averageMrr = sumMrr / months;
          const cmgr = baseMrr > 0 ? Math.pow(mrr / baseMrr, 1 / months) - 1 : 0;
          const totalNetNew = totalNew + totalExpansion - totalContraction - totalChurn;
          const endingMultiple = baseMrr > 0 ? mrr / baseMrr : 0;
          const netChangePercent = baseMrr > 0 ? netNewMrr / baseMrr : 0;
  
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
              label: "ARR run-rate (ending MRR x 12)",
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
              key: "netChangePercent",
              label: "Net change (% of starting MRR)",
              value: netChangePercent,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Net new / starting MRR",
            },
            {
              key: "endingMultiple",
              label: "Ending MRR multiple",
              value: endingMultiple,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "Ending MRR / starting MRR",
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
                key: "mrrAt3",
                label: "MRR at month 3",
                value: mrrAt3,
                format: "currency",
                currency: "USD",
                detail: months < 3 ? "Horizon < 3 months" : "Ending MRR at month 3",
              },
              {
                key: "mrrAt6",
                label: "MRR at month 6",
                value: mrrAt6,
                format: "currency",
                currency: "USD",
                detail: months < 6 ? "Horizon < 6 months" : "Ending MRR at month 6",
              },
              {
                key: "mrrAt12",
                label: "MRR at month 12",
                value: mrrAt12,
                format: "currency",
                currency: "USD",
                detail: months < 12 ? "Horizon < 12 months" : "Ending MRR at month 12",
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
          question: "Is this the same as NRR forecasting-",
          answer:
            "This model includes both new customer growth (new MRR) and existing customer dynamics (expansion, contraction, churn). NRR focuses only on existing customers; here we show the implied monthly NRR from your assumptions.",
        },
        {
          question: "What horizon should I use-",
          answer:
            "For execution planning, 6-12 months is common. For longer-range strategy, use scenarios (base/optimistic/conservative) because small rate changes compound quickly.",
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
          "Runway answers a simple question: how many months can you operate before cash hits zero at your current net burn-",
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
          question: "Why is runway different from profitability-",
          answer:
            "Runway is about cash. You can be profitable on an accounting basis but still have cash issues due to collections timing, prepayments, capex, or working capital changes.",
        },
        {
          question: "Should I include non-recurring revenue-",
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
            detail: "Variable + fixed S&M spend / new customers",
          },
          secondary: [
            {
              key: "paidCac",
              label: "Paid-only CAC",
              value: paidCac,
              format: "currency",
              currency: "USD",
              detail: "Variable acquisition spend / new customers",
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
                  : "CAC / monthly gross profit per customer",
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
          question: "When should I use paid CAC vs blended CAC-",
          answer:
            "Use paid CAC to optimize channels and campaigns. Use blended CAC for planning and to understand whether your overall go-to-market is efficient after salaries and tools.",
        },
        {
          question: "What should the denominator be-",
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
          "Choose a horizon (e.g., 36-60 months) and an optional annual discount rate.",
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
                detail: approxLifetimeMonths === null ? "Churn is 0%" : "1 / monthly churn",
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
        "Expected revenue_t = ARPA * (1+expansion)^(t-1) * (1-churn)^(t-1); LTV = sum  gross_profit_t (optionally discounted)",
      assumptions: [
        "Uses constant monthly churn and expansion assumptions.",
        "Expansion is applied to surviving accounts' revenue each month.",
        "Outputs are per original account in the cohort (expected value).",
      ],
      faqs: [
        {
          question: "Is this better than LTV = ARPA * margin / churn-",
          answer:
            "Often yes for planning. The simple churn formula assumes constant churn and no expansion and can be very sensitive to small churn changes. Cohort-style forecasts are easier to scenario test and extend with discounting.",
        },
        {
          question: "What discount rate should I use-",
          answer:
            "Use your required return / cost of capital as a rough starting point (e.g., 8-20% annually). If you're comparing scenarios, keep the discount rate consistent.",
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
  
        const margin = values.contributionMarginPercent / 100;
        const incrementalRevenue = incrementalConversions * values.aov;
        const incrementalGrossProfit = incrementalRevenue * margin;
        const incrementalProfitAfterSpend = incrementalGrossProfit - values.adSpend;
  
        const incrementalRoas = safeDivide(incrementalRevenue, values.adSpend);
        const incrementalCpa =
          incrementalConversions > 0 ? safeDivide(values.adSpend, incrementalConversions) : null;
        const incrementalProfitPerOrder =
          incrementalConversions > 0 ? incrementalGrossProfit / incrementalConversions : null;
        const liftPercent = holdoutCvr > 0 ? (exposedCvr - holdoutCvr) / holdoutCvr : null;
  
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
              maxFractionDigits: 1,
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
              detail: "Incremental revenue / ad spend",
            },
            {
              key: "incrementalCpa",
              label: "Incremental CPA",
              value: incrementalCpa ?? 0,
              format: "currency",
              currency: "USD",
              detail: incrementalCpa === null ? "Incremental conversions <= 0" : "Ad spend / incremental conversions",
            },
            {
              key: "liftPercent",
              label: "Lift vs holdout",
              value: liftPercent ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: liftPercent === null ? "Holdout CVR is 0%" : "(Exposed - holdout) / holdout",
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
              key: "incrementalGrossProfit",
              label: "Incremental gross profit",
              value: incrementalGrossProfit,
              format: "currency",
              currency: "USD",
            },
            {
              key: "profitPerOrder",
              label: "Incremental gross profit per order",
              value: incrementalProfitPerOrder ?? 0,
              format: "currency",
              currency: "USD",
              detail: incrementalProfitPerOrder === null ? "Incremental conversions <= 0" : "Gross profit / incremental conversions",
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
          question: "Why can incremental ROAS be lower than platform ROAS-",
          answer:
            "Platforms often claim credit for conversions that would have happened anyway (especially retargeting). Incremental ROAS isolates lift, so it's often lower but more decision-useful.",
        },
        {
          question: "What if my holdout conversion rate is higher than exposed-",
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
        const marginOfSafetyUnits =
          breakEvenUnits !== null ? unitsSold - breakEvenUnits : null;
        const marginOfSafetyPercent =
          marginOfSafetyUnits !== null && unitsSold > 0
            ? marginOfSafetyUnits / unitsSold
            : null;
  
        if (marginOfSafetyUnits !== null && marginOfSafetyUnits < 0) {
          warnings.push("Expected units are below break-even (negative margin of safety).");
        }
  
        return {
          headline: {
            key: "breakEvenUnits",
            label: "Break-even units",
            value: breakEvenUnits ?? 0,
            format: "number",
            maxFractionDigits: 1,
            detail:
              breakEvenUnits === null
                ? "No break-even (margin <= 0)"
                : "Fixed costs / contribution per unit",
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
              key: "marginOfSafetyUnits",
              label: "Margin of safety (units)",
              value: marginOfSafetyUnits ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail:
                marginOfSafetyUnits === null
                  ? "Break-even undefined"
                  : "Expected units - break-even units",
            },
            {
              key: "marginOfSafetyPercent",
              label: "Margin of safety (%)",
              value: marginOfSafetyPercent ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                marginOfSafetyPercent === null
                  ? "Expected units is 0"
                  : "Margin of safety / expected units",
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
              detail:
                contributionMarginPercent === null
                  ? "Price is 0"
                  : "(Price - variable cost) / price",
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
          question: "Is break-even the same as profitability-",
          answer:
            "Break-even is the point where profit is exactly zero. Profitability means you are above break-even (positive profit) and ideally have margin to absorb uncertainty and fund growth.",
        },
        {
          question: "Should marketing spend be fixed or variable-",
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
          "Choose a forecast horizon (e.g., 6-24 months).",
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
        "Break-even immediate churn ~ 1 - 1/(1+price increase). For ongoing churn, compare the discounted retention of cash flows over the horizon.",
      assumptions: [
        "Models the existing revenue base only (no new customer MRR).",
        "Baseline churn is constant over the horizon.",
        "Immediate churn is a one-time shock; ongoing churn increase applies each month.",
      ],
      faqs: [
        {
          question: "Why does break-even immediate churn depend only on price increase-",
          answer:
            "If churn happens as a one-time shock right after the change, the break-even point is when (1 + increase) x (1 - churn) = 1. Horizon affects payback and compounding effects, but the immediate break-even threshold is purely arithmetic.",
        },
        {
          question: "Should I model downgrades as churn-",
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
        let k: number | null = null;
        if (spend0 > 0 && rev0 > 0 && margin > 0 && b > 0 && b < 1) {
          k = rev0 / Math.pow(spend0, b);
          const numerator = margin * b * k;
          optimalSpend = Math.pow(numerator, 1 / (1 - b));
        }
  
        if (values.maxSpendCap > 0) optimalSpend = Math.min(optimalSpend, values.maxSpendCap);
  
        const revenueAt = (spend: number) => {
          if (spend0 <= 0 || rev0 <= 0 || spend <= 0 || b <= 0) return 0;
          const coeff = k ?? rev0 / Math.pow(spend0, b);
          return coeff * Math.pow(spend, b);
        };
  
        const revenueOpt = revenueAt(optimalSpend);
        const profitOpt = revenueOpt * margin - optimalSpend;
        const roasOpt = safeDivide(revenueOpt, optimalSpend) ?? 0;
        const spendGap = optimalSpend - spend0;
        const profitDelta = profitOpt - currentProfit;
  
        const marginalRevenuePerDollar =
          spend0 > 0 && rev0 > 0 && optimalSpend > 0 && b > 0
            ? (k ?? rev0 / Math.pow(spend0, b)) * b * Math.pow(optimalSpend, b - 1)
            : 0;
        const marginalRoas = marginalRevenuePerDollar;
        const marginalProfitPerDollar = margin * marginalRevenuePerDollar - 1;
        const marginalRevenueAtCurrent =
          spend0 > 0 && rev0 > 0 && b > 0
            ? (k ?? rev0 / Math.pow(spend0, b)) * b * Math.pow(spend0, b - 1)
            : 0;
        const marginalRoasAtCurrent = marginalRevenueAtCurrent;
        const marginalProfitAtCurrent = margin * marginalRevenueAtCurrent - 1;
        if (marginalProfitAtCurrent < 0) {
          warnings.push("Marginal profit is negative at current spend (scaling likely loses money).");
        }
  
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
              detail: "Revenue x margin - spend",
            },
            {
              key: "spendGap",
              label: "Spend gap vs current",
              value: spendGap,
              format: "currency",
              currency: "USD",
              detail: spendGap >= 0 ? "Additional spend to reach optimum" : "Reduce spend to reach optimum",
            },
            {
              key: "profitDelta",
              label: "Profit change vs current",
              value: profitDelta,
              format: "currency",
              currency: "USD",
              detail: "Profit at optimal - current profit",
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
              key: "marginalRoasCurrent",
              label: "Marginal ROAS at current spend",
              value: marginalRoasAtCurrent,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "Incremental revenue per $1 at current spend",
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
              key: "marginalProfitCurrent",
              label: "Marginal profit per $1 at current spend",
              value: marginalProfitAtCurrent,
              format: "currency",
              currency: "USD",
              detail: "If negative, reduce spend or improve economics",
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
        "Assume revenue = k * spend^b (0<b<1). Profit = margin*revenue - spend. Optimal spend occurs when marginal profit ~ 0.",
      assumptions: [
        "Uses a simple power-law response curve; real curves vary by channel and saturation.",
        "Current spend/revenue anchor the curve (k).",
        "Ignores fixed costs and long-term LTV effects (use incrementality and LTV when possible).",
      ],
      faqs: [
        {
          question: "What exponent should I use-",
          answer:
            "If you don't know, start with 0.7-0.85 and scenario test. Lower means stronger diminishing returns. The right value varies by channel, creative freshness, audience size, and tracking.",
        },
        {
          question: "How is marginal ROAS different from average ROAS-",
          answer:
            "Average ROAS is total revenue / total spend. Marginal ROAS is incremental revenue from an extra $1 of spend. Scaling decisions should use marginal ROAS (or incremental profit), not average ROAS.",
        },
      ],
    },
  {
      slug: "dcf-valuation-calculator",
      title: "DCF Valuation Calculator",
      description:
        "Estimate enterprise value using a simple DCF: forecast cash flows, apply a discount rate (often WACC), and add a terminal value.",
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
          "Using terminal growth >= discount rate (blows up the terminal value).",
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
        if (years < 3) warnings.push("Short forecast horizons can over-weight terminal value.");
  
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
        const pvForecastShare = enterpriseValue > 0 ? pvForecast / enterpriseValue : 0;
        const equityValue = enterpriseValue - values.netDebt;
        const terminalGrowthGap = r - tg;
          const evToFcf =
            values.annualFcf > 0 ? enterpriseValue / values.annualFcf : null;
          const terminalMultiple =
            fcfTerminal > 0 ? terminalValue / fcfTerminal : null;
  
        if (terminalShare > 0.7) {
          warnings.push("Terminal value exceeds 70% of EV; sensitivity is high.");
        }
  
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
                key: "pvForecastShare",
                label: "Forecast value share",
                value: pvForecastShare,
                format: "percent",
                maxFractionDigits: 0,
                detail: "Share of EV from forecast period",
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
        "EV = sum (FCF_t / (1+r)^t) + (FCF_(n+1) / (r - g_terminal)) / (1+r)^n",
      assumptions: [
        "FCF grows at a constant rate during the forecast period.",
        "Terminal value uses a perpetuity growth model.",
        "Discount rate is constant and represents risk (e.g., WACC as a proxy).",
      ],
      faqs: [
        {
          question: "Why is terminal value often so large-",
          answer:
            "Because most businesses are assumed to operate beyond the explicit forecast period. If terminal dominates, run sensitivity tables (discount rate, terminal growth) and consider extending the forecast period or using more conservative assumptions.",
        },
        {
          question: "Is enterprise value the same as equity value-",
          answer:
            "No. Enterprise value is value of the business operations. To get equity value you'd adjust for net debt (cash, debt) and other claims. This calculator focuses on EV.",
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
                detail: lifetimeMonths === null ? "Churn is 0%" : "1 / monthly churn (rough)",
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
          question: "Why use a retention curve instead of a single churn rate-",
          answer:
            "Retention curves show where churn happens (early vs late). Two products can have the same average churn but very different early drop-off, which affects activation work and payback.",
        },
        {
          question: "How do I make this more realistic-",
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
          help: "Profit buffer as % of gross profit LTV (e.g., 20% means spend <= 80% of gross profit LTV).",
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
              detail: "Revenue LTV x contribution margin",
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
              detail: targetByShare === null ? "Disabled" : "Gross profit LTV x spend share",
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
        "Gross profit LTV = revenue LTV x contribution margin; Break-even CPA = gross profit LTV; Target CPA = break-even x (1 - buffer) or x spend share",
      assumptions: [
        "LTV is measured on a consistent basis with your CPA attribution window.",
        "Contribution margin reflects variable costs (not fixed overhead).",
        "Incrementality may be lower than attribution; validate with experiments when possible.",
      ],
      faqs: [
        {
          question: "Should I use CAC or CPA-",
          answer:
            "CPA is often used at the campaign level (purchase/lead). CAC usually means cost per new paying customer. Use the denominator that matches your funnel stage and label it clearly.",
        },
        {
          question: "Why set a target below break-even-",
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
        if (values.initialInvestment <= 0) warnings.push("Initial investment must be greater than 0.");
  
        const npvAt = (rate: number) => {
          let sum = -values.initialInvestment;
          for (let t = 1; t <= years; t++) {
            sum += values.annualCashFlow / Math.pow(1 + rate, t);
          }
          return sum;
        };
  
        const npv = npvAt(r);
        const totalCashInflow = values.annualCashFlow * years;
        const simplePaybackYears =
          values.annualCashFlow > 0 ? values.initialInvestment / values.annualCashFlow : null;
        const npvToInvestment =
          values.initialInvestment > 0 ? npv / values.initialInvestment : null;
        const annuityEquivalent =
          years > 0
            ? r > 0
              ? npv * (r / (1 - Math.pow(1 + r, -years)))
              : npv / years
            : null;
  
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
              detail: irr === null ? "No single IRR (check cash flow pattern)" : "Approx",
            },
            {
              key: "discountedPaybackYears",
              label: "Discounted payback (years)",
              value: discountedPaybackYears ?? 0,
              format: "number",
              maxFractionDigits: 2,
              detail:
                discountedPaybackYears === null ? "Not reached in horizon" : "Discounted cash flows",
            },
            {
              key: "simplePaybackYears",
              label: "Simple payback (years)",
              value: simplePaybackYears ?? 0,
              format: "number",
              maxFractionDigits: 2,
              detail:
                simplePaybackYears === null
                  ? "Annual cash flow is 0"
                  : "Investment / annual cash flow",
            },
            {
              key: "pi",
              label: "Profitability index (PI)",
              value: pi ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: pi === null ? "Investment is 0" : "PV inflows / investment",
            },
            {
              key: "npvToInvestment",
              label: "NPV to investment",
              value: npvToInvestment ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: npvToInvestment === null ? "Investment is 0" : "NPV / investment",
            },
            {
              key: "annuityEquivalent",
              label: "Equivalent annual value",
              value: annuityEquivalent ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                annuityEquivalent === null
                  ? "Invalid years"
                  : r > 0
                    ? "NPV converted to annual annuity"
                    : "NPV / years",
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
              key: "totalCashInflow",
              label: "Total cash inflow (undiscounted)",
              value: totalCashInflow,
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
            {
              key: "years",
              label: "Years",
              value: years,
              format: "number",
              maxFractionDigits: 0,
            },
          ],
          warnings,
        };
      },
      formula: "NPV = -I + sum(CF_t/(1+r)^t); IRR solves NPV(r)=0; PI = PV(inflows)/I; Discounted payback is when cumulative PV >= I",
      assumptions: [
        "Cash flows are annual and occur at the end of each year (except the upfront investment at t=0).",
        "Uses a constant annual cash flow for simplicity.",
        "IRR is approximated via bisection and may be undefined for some patterns.",
      ],
      faqs: [
        {
          question: "Which metric should I trust most-",
          answer:
            "NPV is usually the best decision metric at a chosen required return because it measures value created in dollars. Use IRR for intuition and comparison, and use payback/PI as constraints or secondary lenses.",
        },
        {
          question: "What does profitability index mean-",
          answer:
            "PI normalizes value by investment: PI > 1 means positive NPV. It's useful when capital is constrained and you want value per dollar invested.",
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
            detail: "PV inflows / initial investment",
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
              detail: values.targetPi > 0 ? "PV inflows / target PI" : "Target PI is 0",
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
      formula: "PI = PV(inflows) / initial investment; NPV = PV(inflows) - investment",
      assumptions: [
        "Cash flows are annual and occur at the end of each year.",
        "Uses a constant annual cash flow for simplicity.",
        "Discount rate reflects required return for the project.",
      ],
      faqs: [
        {
          question: "Is PI better than NPV-",
          answer:
            "PI is a ratio, so it helps rank projects when capital is constrained. NPV is still the best measure of total value created.",
        },
        {
          question: "What PI should I target-",
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
          "Treating WACC as precise; it's an estimate that should be scenario tested.",
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
              detail: "Cost of debt x (1 - tax rate)",
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
              detail: "Cost of debt x tax rate",
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
      formula: "WACC = w_exk_e + w_dxk_dx(1 - tax rate)",
      assumptions: [
        "Debt benefit is modeled via the interest tax shield (after-tax cost of debt).",
        "Weights should ideally reflect market value capital structure.",
        "WACC is an estimate; use sensitivity analysis.",
      ],
      faqs: [
        {
          question: "Should I use WACC as my DCF discount rate-",
          answer:
            "Often yes as a starting point for valuing the overall firm. For projects with different risk than the core business, use a risk-adjusted discount rate instead of the company WACC.",
        },
        {
          question: "Why do we adjust debt for taxes-",
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
          "This MER calculator uses total revenue divided by total marketing spend over the same period. It's a useful top-down health metric that reduces channel attribution noise.",
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
        const profitMarginAfterSpend =
          values.totalRevenue > 0 ? profitAfterSpend / values.totalRevenue : null;
        const spendShare =
          values.totalRevenue > 0 ? values.totalMarketingSpend / values.totalRevenue : null;
  
          const breakEvenMer = margin > 0 ? 1 / margin : null;
          const buffer = values.profitBufferPercent / 100;
          const targetMer = margin > 0 ? 1 / (margin * Math.max(0.0001, 1 - buffer)) : null;
          const breakEvenRevenue = margin > 0 ? values.totalMarketingSpend / margin : null;
          const revenueShortfall =
            breakEvenRevenue !== null ? breakEvenRevenue - values.totalRevenue : null;
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
            detail: "Total revenue / total marketing spend",
          },
          secondary: [
            {
              key: "profitAfterSpend",
              label: "Estimated profit after marketing spend",
              value: profitAfterSpend,
              format: "currency",
              currency: "USD",
              detail: "Revenue x margin - marketing spend",
            },
            {
              key: "grossProfit",
              label: "Gross profit (from margin)",
              value: grossProfit,
              format: "currency",
              currency: "USD",
            },
            {
              key: "profitMarginAfterSpend",
              label: "Profit margin after spend",
              value: profitMarginAfterSpend ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail:
                profitMarginAfterSpend === null
                  ? "Add revenue and spend"
                  : "Profit after spend / revenue",
            },
            {
              key: "spendShare",
              label: "Marketing spend share of revenue",
              value: spendShare ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: spendShare === null ? "Add revenue" : "Spend / revenue",
            },
            {
              key: "breakEvenMer",
              label: "Break-even MER",
              value: breakEvenMer ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: breakEvenMer === null ? "Margin is 0%" : "1 / margin",
            },
            {
              key: "breakEvenRevenue",
              label: "Revenue needed to break even",
              value: breakEvenRevenue ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                breakEvenRevenue === null
                  ? "Add contribution margin"
                  : "Spend / margin",
            },
            {
              key: "revenueShortfall",
              label: "Break-even revenue gap",
              value: revenueShortfall ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                revenueShortfall === null
                  ? "Add contribution margin"
                  : "Break-even revenue - current revenue",
            },
            {
              key: "targetMer",
              label: "Target MER (with profit buffer)",
              value: targetMer ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: targetMer === null ? "Margin is 0%" : "1 / (margin x (1 - buffer))",
            },
              {
                key: "maxSpendAtTargetMer",
                label: "Max spend at target MER",
                value: maxSpendAtTargetMer ?? 0,
                format: "currency",
                currency: "USD",
                detail: values.targetMer > 0 ? "Revenue / target MER" : "Target MER is 0",
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
        "MER = revenue / marketing spend; Profit ~ revenuexmargin - spend; Break-even MER = 1 / margin",
      assumptions: [
        "Uses contribution margin as a simplified proxy for gross profit after variable costs.",
        "Revenue and spend are measured over the same period and on the same attribution basis.",
        "MER is top-down; use channel-level metrics for optimization.",
      ],
      faqs: [
        {
          question: "Is MER the same as ROAS-",
          answer:
            "It's a blended version. ROAS is often channel/campaign-level attributed revenue / spend. MER uses total revenue / total marketing spend, which reduces attribution noise but hides what's driving performance.",
        },
        {
          question: "How do I pick a profit buffer-",
          answer:
            "Start with 10-30% of gross profit as buffer for uncertainty, overhead, refunds, and measurement error. More volatility and longer payback generally require a larger buffer.",
        },
      ],
    }
];
