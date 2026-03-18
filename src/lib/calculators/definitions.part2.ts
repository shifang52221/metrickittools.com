import type { CalculatorDefinition } from "./types";
import { safeDivide } from "./shared";

export const calculatorsPart2: CalculatorDefinition[] = [
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
          "Optional: add targets to back-solve required customers or ARPA.",
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
            key: "targetCustomers",
            label: "Target customers (optional)",
            placeholder: "400",
            defaultValue: "0",
            min: 0,
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
          if (values.targetCustomers < 0)
            warnings.push("Target customers must be 0 or greater.");
          const mrr = values.customers * values.arpaMonthly;
          const arr = mrr * 12;
          const requiredCustomers =
            values.targetArr > 0 && values.arpaMonthly > 0
              ? values.targetArr / 12 / values.arpaMonthly
              : null;
          const requiredArpa =
            values.targetArr > 0 && values.targetCustomers > 0
              ? values.targetArr / 12 / values.targetCustomers
              : null;
          const arpaLow = values.arpaMonthly * 0.9;
          const arpaHigh = values.arpaMonthly * 1.1;
          const requiredCustomersLowArpa =
            values.targetArr > 0 && arpaLow > 0 ? values.targetArr / 12 / arpaLow : null;
          const requiredCustomersHighArpa =
            values.targetArr > 0 && arpaHigh > 0 ? values.targetArr / 12 / arpaHigh : null;
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
              {
                key: "requiredArpa",
                label: "Required ARPA for target ARR",
                value: requiredArpa ?? 0,
                format: "currency",
                currency: "USD",
                detail:
                  requiredArpa === null
                    ? "Add target ARR and target customers"
                    : "Target ARR / (12 x target customers)",
              },
              {
                key: "requiredCustomersLowArpa",
                label: "Required customers (ARPA -10%)",
                value: requiredCustomersLowArpa ?? 0,
                format: "number",
                maxFractionDigits: 1,
                detail: values.targetArr > 0 ? "Target ARR / (12 x ARPA -10%)" : "Add target ARR",
              },
              {
                key: "requiredCustomersHighArpa",
                label: "Required customers (ARPA +10%)",
                value: requiredCustomersHighArpa ?? 0,
                format: "number",
                maxFractionDigits: 1,
                detail: values.targetArr > 0 ? "Target ARR / (12 x ARPA +10%)" : "Add target ARR",
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
          question: "ARR vs annual revenue-",
          answer:
            "ARR is recurring revenue on an annualized basis. It doesn't include one-time fees or services revenue.",
        },
        {
          question: "Bookings vs ARR-",
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
          question: "Is ARR the same as annual revenue-",
          answer:
            "Not always. ARR is a run-rate snapshot of recurring revenue. Annual revenue is what you recognize over a year and can include one-time items.",
        },
        {
          question: "Should ARR always equal MRR x 12-",
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
          question: "Is ARR growth the same as revenue growth-",
          answer:
            "Not necessarily. ARR is a recurring run-rate snapshot. Revenue is what you recognize over time and can include non-recurring items.",
        },
        {
          question: "Should I use CMGR or YoY growth-",
          answer:
            "Use YoY growth for seasonal businesses and for external comparisons. Use CMGR for planning and comparing scenarios over different horizons.",
        },
      ],
      guide: [
        {
          title: "ARR growth tips",
          bullets: [
            "Use consistent point-in-time snapshots (start and end of the period).",
            "Segment ARR growth by plan and channel to find what's driving momentum.",
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
          question: "What multiple should I use-",
          answer:
            "Use a range (e.g., 4x-10x) and sanity-check against growth rate, gross margin, and retention. Market conditions can move multiples significantly.",
        },
        {
          question: "Is ARR the same as annual revenue-",
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
        "Estimate valuation sensitivity to ARR and revenue multiple assumptions (simple 3x3 grid).",
      category: "saas-metrics",
      guideSlug: "arr-valuation-sensitivity-guide",
      relatedGlossarySlugs: ["arr", "arr-valuation-multiple", "sensitivity-analysis"],
      seo: {
        intro: [
          "ARR multiple valuation is fast: enterprise value ~ ARR x multiple. But both ARR and multiples move with market conditions, pricing, and retention.",
          "A small sensitivity grid helps you see how fragile (or robust) the valuation is to reasonable changes in ARR and the multiple.",
        ],
        steps: [
          "Enter your base ARR and base multiple.",
          "Choose step sizes for ARR and the multiple (+/- around the base).",
          "Review the 3x3 grid of valuations.",
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
          help: "Uses +/- step around ARR base to create a 3x3 grid.",
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
          help: "Uses +/- step around the multiple base to create a 3x3 grid.",
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
            label: `EV @ $${arr.toFixed(0)} / ${multiple.toFixed(1)}x`,
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
            detail: `Base: $${values.baseArr.toFixed(0)} / ${values.baseMultiple.toFixed(1)}x`,
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
      formula: "Enterprise value ~ ARR x multiple; Sensitivity varies ARR and multiple around a base case",
      assumptions: [
        "This is a heuristic. Real valuation depends on growth, margin, retention, and market conditions.",
        "Uses enterprise value (EV) as ARR x multiple (simplified).",
        "Only shows a small grid; use broader scenarios for full planning.",
      ],
      faqs: [
        {
          question: "Is this a full valuation model-",
          answer:
            "No. This is a multiple-based heuristic. For deeper analysis, use DCF or a comps model that reflects retention, growth, margin, and risk.",
        },
        {
          question: "Why sensitivity on ARR as well as multiple-",
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
          "NRR (Net Revenue Retention) measures how revenue from an existing customer cohort changes over a period, including expansion, contraction, and churn. It answers: do customers grow, shrink, or leave after they start-",
          "NRR is most useful when measured by cohort and segment (plan, size, channel). A blended NRR can hide problems in parts of the business.",
        ],
        steps: [
          "Pick a cohort and time window (often monthly or quarterly).",
          "Measure starting MRR for that cohort at the beginning of the window.",
          "Add expansion MRR and subtract contraction and churned MRR.",
          "Compute NRR = ending MRR / starting MRR.",
          "Optional: add a target NRR to back-solve required expansion.",
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
        {
          key: "targetNrrPercent",
          label: "Target NRR (optional)",
          placeholder: "110",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
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
        const netChange = endingMrr - values.startingMrr;
        const grossRetention = safeDivide(
          values.startingMrr - values.contractionMrr - values.churnedMrr,
          values.startingMrr,
        );
        const expansionRate = safeDivide(values.expansionMrr, values.startingMrr);
        const contractionRate = safeDivide(values.contractionMrr, values.startingMrr);
        const churnRate = safeDivide(values.churnedMrr, values.startingMrr);
        const netChangePercent = safeDivide(netChange, values.startingMrr);
        const targetNrr = values.targetNrrPercent / 100;
        const requiredExpansionMrr =
          values.targetNrrPercent > 0
            ? values.startingMrr * targetNrr +
              values.contractionMrr +
              values.churnedMrr -
              values.startingMrr
            : null;
        const expansionGap =
          requiredExpansionMrr !== null ? requiredExpansionMrr - values.expansionMrr : null;
  
        const nrr = safeDivide(endingMrr, values.startingMrr);
        if (endingMrr < 0) warnings.push("Ending MRR is negative; check inputs.");
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
              key: "netChange",
              label: "Net MRR change",
              value: netChange,
              format: "currency",
              currency: "USD",
              detail: "Ending MRR - starting MRR",
            },
            {
              key: "grossRetention",
              label: "GRR (gross retention)",
              value: grossRetention ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Excludes expansion",
            },
            {
              key: "netChangePercent",
              label: "Net change (% of starting)",
              value: netChangePercent ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Net change / starting MRR",
            },
            {
              key: "expansionRate",
              label: "Expansion rate",
              value: expansionRate ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Expansion / starting MRR",
            },
            {
              key: "contractionRate",
              label: "Contraction rate",
              value: contractionRate ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Contraction / starting MRR",
            },
            {
              key: "churnRate",
              label: "Churn rate",
              value: churnRate ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: "Churn / starting MRR",
            },
            {
              key: "nrrMultiple",
              label: "NRR (multiple)",
              value: nrr,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "Same metric in multiple form",
            },
            {
              key: "requiredExpansionMrr",
              label: "Expansion needed for target NRR",
              value: requiredExpansionMrr ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                requiredExpansionMrr === null
                  ? "Add target NRR"
                  : "Target NRR x start + contraction + churn - start",
            },
            {
              key: "expansionGap",
              label: "Expansion gap to target",
              value: expansionGap ?? 0,
              format: "currency",
              currency: "USD",
              detail:
                expansionGap === null
                  ? "Add target NRR"
                  : "Required expansion - current expansion",
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
            {
              key: "targetNrrPercent",
              label: "Target NRR",
              value: targetNrr,
              format: "percent",
              maxFractionDigits: 1,
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
          question: "What is a good NRR-",
          answer:
            "NRR benchmarks vary by segment. NRR > 100% means the cohort grows without new customers. SMB businesses can succeed with NRR near 100% if CAC payback is short and margins are strong.",
        },
        {
          question: "NRR vs GRR-",
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
          "GRR (Gross Revenue Retention) measures how much of a cohort's starting revenue remains after churn and downgrades, excluding expansion. It is a clean durability metric.",
        ],
        steps: [
          "Pick a cohort and time window.",
          "Measure starting MRR for the cohort.",
          "Subtract contraction and churned MRR to get ending gross MRR.",
          "Compute GRR = ending gross MRR / starting MRR.",
          "Optional: add a target GRR to see allowable churn + contraction.",
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
        {
          key: "targetGrrPercent",
          label: "Target GRR (optional)",
          placeholder: "95",
          suffix: "%",
          defaultValue: "0",
          min: 0,
          step: 0.1,
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
          const targetGrr = values.targetGrrPercent / 100;
          const requiredGrossLoss =
            values.targetGrrPercent > 0 ? values.startingMrr * (1 - targetGrr) : null;
          const currentGrossLoss = values.contractionMrr + values.churnedMrr;
          const lossReductionNeeded =
            requiredGrossLoss !== null ? currentGrossLoss - requiredGrossLoss : null;
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
            detail: "(Starting - Contraction - Churn) / Starting",
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
              {
                key: "requiredGrossLoss",
                label: "Max churn + contraction for target",
                value: requiredGrossLoss ?? 0,
                format: "currency",
                currency: "USD",
                detail:
                  requiredGrossLoss === null
                    ? "Add target GRR"
                    : "Starting MRR x (1 - target GRR)",
              },
              {
                key: "lossReductionNeeded",
                label: "Reduction needed to hit target",
                value: lossReductionNeeded ?? 0,
                format: "currency",
                currency: "USD",
                detail:
                  lossReductionNeeded === null
                    ? "Add target GRR"
                    : "Current losses - allowed losses",
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
              {
                key: "targetGrrPercent",
                label: "Target GRR",
                value: targetGrr,
                format: "percent",
                maxFractionDigits: 1,
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
          question: "Why track GRR if I already track NRR-",
          answer:
            "NRR can look strong due to expansion even when underlying churn/downgrades are weak. GRR isolates durability without expansion.",
        },
        {
          question: "What is a good GRR-",
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
            detail: "(Start + expansion - contraction - churn) / start",
          },
            secondary: [
              {
                key: "grr",
                label: "GRR",
                value: grr,
                format: "percent",
                maxFractionDigits: 2,
                detail: "(Start - contraction - churn) / start",
              },
              {
                key: "gap",
                label: "NRR - GRR (expansion offset)",
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
          question: "Can NRR be above 100%-",
          answer:
            "Yes. If expansion exceeds contraction + churn, the cohort grows without new customers and NRR can exceed 100%.",
        },
        {
          question: "Why track GRR if NRR looks strong-",
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
          "Compute gross revenue churn = (contraction + churn) / starting MRR.",
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
          question: "Is gross revenue churn the same as GRR-",
          answer:
              "They are closely related. GRR is the remaining revenue after losses (ending gross / starting). Gross revenue churn focuses on the losses ((contraction + churn) / starting).",
        },
        {
          question: "Should I include expansion in gross churn-",
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
          question: "Is net new MRR the same as MRR growth rate-",
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
        "Build an MRR waterfall: starting MRR + new + expansion - contraction - churn = ending MRR.",
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
              detail: "New + Expansion - Contraction - Churn",
            },
            {
              key: "growthRate",
              label: "MRR growth rate (net new / starting)",
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
                detail: quickRatio === null ? "Losses must be > 0" : "(New + Expansion) / (Contraction + Churn)",
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
        "Ending MRR = starting MRR + new + expansion - contraction - churn; Net new MRR = new + expansion - contraction - churn",
      assumptions: [
        "All inputs represent the same period and use the same MRR definition.",
        "This is a reporting bridge; it does not model cohorts or timing within the period.",
      ],
      faqs: [
        {
          question: "Is this the same as net new MRR-",
          answer:
            "Net new MRR is the change (delta) in MRR. A waterfall adds starting MRR and produces an ending MRR to reconcile the period.",
        },
        {
          question: "Should I segment the waterfall-",
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
        "Calculate the SaaS quick ratio: (new + expansion) / (contraction + churn).",
      category: "saas-metrics",
      guideSlug: "saas-quick-ratio-guide",
      seo: {
        intro: [
          "SaaS quick ratio is a growth quality metric that compares positive MRR movements (new + expansion) to negative movements (contraction + churn).",
        ],
        steps: [
          "Measure new and expansion MRR for the period.",
          "Measure contraction and churned MRR for the same period.",
          "Compute quick ratio = (new + expansion) / (contraction + churn).",
          "Optional: add a target quick ratio to back-solve additions or max losses.",
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
        {
          key: "targetQuickRatio",
          label: "Target quick ratio (optional)",
          placeholder: "4",
          defaultValue: "0",
          min: 0,
          step: 0.1,
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
              detail: "(New + Expansion) / (Contraction + Churn)",
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
            {
              key: "targetQuickRatio",
              label: "Target quick ratio",
              value: values.targetQuickRatio,
              format: "ratio",
              maxFractionDigits: 2,
            },
          ],
          warnings,
        };
      },
      formula: "Quick ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churned MRR)",
      assumptions: [
        "All movements are measured for the same period.",
        "Use MRR movements (not billings/cash) to keep the metric consistent.",
      ],
      faqs: [
        {
          question: "What is a good SaaS quick ratio-",
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
          "Optional: add a target score to see required growth or margin.",
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
        {
          key: "targetRuleOf40Percent",
          label: "Target Rule of 40 (optional)",
          placeholder: "40",
          suffix: "%",
          defaultValue: "40",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const score = (values.growthPercent + values.marginPercent) / 100;
        const targetScore = values.targetRuleOf40Percent / 100;
        const requiredGrowth = targetScore - values.marginPercent / 100;
        const requiredMargin = targetScore - values.growthPercent / 100;
        return {
          headline: {
            key: "ruleOf40",
            label: "Rule of 40 score",
            value: score,
            format: "percent",
            maxFractionDigits: 1,
            detail: "Growth (%) + Margin (%)",
          },
          secondary: [
            {
              key: "requiredGrowth",
              label: "Growth needed to hit target",
              value: requiredGrowth,
              format: "percent",
              maxFractionDigits: 1,
              detail: requiredGrowth > 0 ? "Target - margin" : "Already at/above target",
            },
            {
              key: "requiredMargin",
              label: "Margin needed to hit target",
              value: requiredMargin,
              format: "percent",
              maxFractionDigits: 1,
              detail: requiredMargin > 0 ? "Target - growth" : "Already at/above target",
            },
          ],
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
            {
              key: "targetRuleOf40Percent",
              label: "Target Rule of 40",
              value: targetScore,
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
          question: "Which margin should I use for Rule of 40-",
          answer:
            "Teams commonly use operating margin, EBITDA margin, or free cash flow margin. Pick one and keep it consistent so you can compare trends.",
        },
        {
          question: "Does Rule of 40 guarantee good performance-",
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
          "It's commonly used in efficiency metrics like burn multiple and the SaaS magic number.",
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
      formula: "Net new ARR = new ARR + expansion ARR - contraction ARR - churned ARR",
      assumptions: [
        "All movements are measured for the same period using a consistent ARR definition.",
        "ARR is treated as recurring run-rate (not recognized revenue).",
      ],
      faqs: [
        {
          question: "Is net new ARR the same as ARR growth rate-",
          answer:
            "Net new ARR is a dollar change (Delta ARR). Growth rate is net new ARR divided by starting ARR for the period.",
        },
        {
          question: "How is net new ARR used for burn multiple-",
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
        "Build an ARR waterfall: starting ARR + new + expansion - contraction - churn = ending ARR.",
      category: "saas-metrics",
      guideSlug: "arr-waterfall-guide",
      relatedGlossarySlugs: ["arr", "net-new-arr", "arr-waterfall"],
      seo: {
        intro: [
          "An ARR waterfall reconciles a starting ARR snapshot to an ending ARR snapshot using ARR movements: new, expansion, contraction, and churned ARR.",
          "It's a practical reporting template and a clean way to compute net new ARR and ARR growth for a period.",
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
              detail: "New + Expansion - Contraction - Churn",
            },
            {
              key: "growthRate",
              label: "ARR growth rate (net new / starting)",
              value: growthRate ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: growthRate === null ? "Starting ARR must be > 0" : undefined,
            },
              {
                key: "ratio",
                label: "ARR quick ratio (additions / losses)",
                value: quickRatio ?? 0,
                format: "ratio",
                maxFractionDigits: 2,
                detail: quickRatio === null ? "Losses must be > 0" : "(New + Expansion) / (Contraction + Churn)",
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
        "Ending ARR = starting ARR + new + expansion - contraction - churn; Net new ARR = new + expansion - contraction - churn",
      assumptions: [
        "All inputs represent the same period and use the same ARR definition (clean recurring run-rate).",
        "This is a reporting bridge; it does not model intra-period timing or cohort curves.",
      ],
      faqs: [
        {
          question: "Is net new ARR the same as ARR growth-",
          answer:
            "Net new ARR is a dollar amount (Delta ARR). ARR growth rate is net new ARR divided by starting ARR for the period.",
        },
        {
          question: "Should I segment the waterfall-",
          answer:
            "Yes when possible. Segment by plan, channel, and customer size so blended numbers don't hide churn pockets or weak cohorts.",
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
        "Calculate burn multiple: net burn / net new ARR (a growth efficiency metric).",
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
          "Compute burn multiple = net burn / net new ARR.",
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
              detail: "Net burn / Net new ARR",
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
      formula: "Burn multiple = Net burn / Net new ARR",
      assumptions: [
        "Use the same time window for burn and net new ARR (often quarterly).",
        "Net burn is net cash outflow (cash out - cash in) for the period.",
      ],
      faqs: [
        {
          question: "What is a good burn multiple-",
          answer:
            "Benchmarks vary widely by stage and go-to-market motion. Use trends and compare within your peer group. Pair burn multiple with retention and gross margin to judge growth quality.",
        },
        {
          question: "Is burn multiple the same as the SaaS magic number-",
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
          "Enter monthly churn (%). This approximates customer lifetime (1 / churn).",
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
            detail: "CAC / monthly gross profit",
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
              detail: "1 / churn",
            },
          ],
          warnings,
        };
      },
      formula:
        "Payback = CAC / (ARPA x gross margin); LTV ~ (ARPA x gross margin) / churn; LTV:CAC = LTV / CAC",
      assumptions: [
        "Uses a simple constant-churn model (lifetime ~ 1 / churn).",
        "LTV is modeled as gross profit (revenue x gross margin) to align with CAC.",
      ],
      faqs: [
        {
          question: "Should LTV be revenue or gross profit-",
          answer:
            "For unit economics, LTV should usually be based on gross profit so it reflects the value created after COGS. If you use revenue LTV, label it clearly and be consistent when comparing to CAC.",
        },
        {
          question: "Why does this use monthly churn-",
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
            "Use bookings for sales performance, ARR for recurring scale, and cash for runway planning.",
        ],
        steps: [
          "Enter the total contract value (TCV) and the term length (months).",
          "Enter any one-time fees/services included in the contract.",
            "Compute recurring value = TCV - one-time.",
            "Compute MRR = recurring / term months, then ARR = MRR x 12.",
            "Compare cash collected upfront vs remaining billed cash to understand timing.",
        ],
        pitfalls: [
          "Treating bookings as recurring run-rate (especially with annual prepay).",
          "Including one-time services in ARR.",
          "Comparing bookings to ARR without normalizing term length.",
          "Mixing bookings and recognized revenue (timing differs).",
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
        const recurringShare = bookings > 0 ? recurring / bookings : null;
        const oneTimeShare = bookings > 0 ? values.oneTimeFees / bookings : null;
        const arrToBookings = bookings > 0 ? arr / bookings : null;
        const upfrontCashShare = bookings > 0 ? upfrontCash / bookings : null;
  
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
              key: "recurringShare",
              label: "Recurring share of bookings",
              value: recurringShare ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: recurringShare === null ? "Bookings is 0" : "Recurring / bookings",
            },
            {
              key: "oneTimeShare",
              label: "One-time share of bookings",
              value: oneTimeShare ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: oneTimeShare === null ? "Bookings is 0" : "One-time / bookings",
            },
            {
              key: "upfrontCash",
              label: "Cash collected upfront",
              value: upfrontCash,
              format: "currency",
              currency: "USD",
            },
            {
              key: "upfrontCashShare",
              label: "Upfront cash share",
              value: upfrontCashShare ?? 0,
              format: "percent",
              maxFractionDigits: 1,
              detail: upfrontCashShare === null ? "Bookings is 0" : "Upfront cash / bookings",
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
            {
              key: "arrToBookings",
              label: "ARR / bookings",
              value: arrToBookings ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: arrToBookings === null ? "Bookings is 0" : "Run-rate vs signed value",
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
          question: "Is bookings the same as ARR-",
          answer:
              "No. Bookings measure contracted value signed in a period. ARR measures recurring run-rate (MRR x 12). They answer different questions.",
        },
        {
          question: "Why can bookings be much higher than ARR-",
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
          "This calculator models a simple deferred revenue rollforward: ending deferred = beginning deferred + billings - recognized revenue.",
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
        {
          key: "periodMonths",
          label: "Period length (months)",
          placeholder: "12",
          defaultValue: "12",
          min: 1,
          step: 1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const months = Math.max(1, Math.floor(values.periodMonths));
        if (values.periodMonths !== months)
          warnings.push("Period months was rounded down to a whole number.");
  
        const endingDeferred = values.beginningDeferred + values.billings - values.recognizedRevenue;
        const change = endingDeferred - values.beginningDeferred;
        const netBillings = values.billings - values.recognizedRevenue;
        const avgMonthlyRecognized = months > 0 ? values.recognizedRevenue / months : null;
        const deferredCoverageMonths =
          avgMonthlyRecognized && avgMonthlyRecognized > 0
            ? endingDeferred / avgMonthlyRecognized
            : null;
        const billingsToRevenue =
          values.recognizedRevenue > 0 ? values.billings / values.recognizedRevenue : null;
  
        if (endingDeferred < 0) {
          warnings.push(
            "Ending deferred revenue is negative. Double-check definitions (billings vs cash, revenue timing) or inputs.",
          );
        }
        if (values.recognizedRevenue <= 0) {
          warnings.push("Recognized revenue must be greater than 0 for coverage ratios.");
        }
  
        return {
          headline: {
            key: "endingDeferred",
            label: "Ending deferred revenue",
            value: endingDeferred,
            format: "currency",
            currency: "USD",
            detail: "Begin + billings - recognized",
          },
          secondary: [
            {
              key: "change",
              label: "Change in deferred revenue",
              value: change,
              format: "currency",
              currency: "USD",
              detail: "Ending - beginning",
            },
            {
              key: "netBillings",
              label: "Billings minus recognized",
              value: netBillings,
              format: "currency",
              currency: "USD",
              detail: "Billings - recognized revenue",
            },
            {
              key: "billingsToRevenue",
              label: "Billings to revenue ratio",
              value: billingsToRevenue ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: billingsToRevenue === null ? "Recognized revenue is 0" : "Billings / recognized",
            },
            {
              key: "deferredCoverageMonths",
              label: "Deferred coverage (months)",
              value: deferredCoverageMonths ?? 0,
              format: "months",
              maxFractionDigits: 1,
              detail:
                deferredCoverageMonths === null
                  ? "Add period months and recognized revenue"
                  : "Ending deferred / avg monthly recognized",
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
      formula: "Ending deferred = beginning deferred + billings - recognized revenue",
      assumptions: [
        "Billings are invoices issued in the period (simplified).",
        "Recognized revenue reflects what was earned/delivered in the period.",
        "Ignores FX effects, write-offs, and detailed revenue recognition policies (simplified).",
      ],
      faqs: [
        {
          question: "Is deferred revenue the same as cash-",
          answer:
            "No. Deferred revenue is a balance sheet liability (unearned revenue). Cash is cash. Deferred revenue often increases with annual prepay, but cash and deferred can still differ due to collections timing.",
        },
        {
          question: "Why does deferred revenue matter for SaaS metrics-",
          answer:
            "Because it explains timing differences between billings/cash and recognized revenue. It's especially important when customers prepay annually or when billing terms change.",
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
      title: "SaaS Magic Number Calculator: Formula, Benchmark, and Example",
      description:
        "Calculate SaaS Magic Number using net new ARR and prior-period sales and marketing spend, with formula, benchmark ranges, and example.",
      category: "saas-metrics",
      guideSlug: "saas-magic-number-guide",
      relatedGlossarySlugs: ["arr", "net-new-arr", "sales-efficiency", "burn-multiple"],
      seo: {
        intro: [
          "The SaaS Magic Number formula is annualized net new ARR divided by prior-period sales and marketing spend.",
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
          question: "Is Magic Number the same as burn multiple-",
          answer:
            "No. Magic Number uses sales & marketing spend and net new ARR. Burn multiple uses net cash burn and net new ARR.",
        },
      ],
    }
];
