import type { CalculatorDefinition } from "./types";
import { safeDivide } from "./shared";

export const calculatorsPart5: CalculatorDefinition[] = [
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
          question: "Why annualizing monthly NRR/GRR can look extreme-",
          answer:
            "Because compounding is powerful. A small monthly difference compounds over 12 months, so always sanity-check annualized implied outcomes.",
        },
        {
          question: "Should I set targets by segment-",
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
      relatedGlossarySlugs: [
        "quota",
        "quota-attainment",
        "pipeline",
        "sales-cycle",
        "quota-carrying-reps",
      ],
      seo: {
        intro: [
          "Quota attainment shows how close you are to a revenue target. Pacing adds context by projecting end-of-period bookings based on progress so far.",
          "Use pacing for weekly check-ins, but sanity-check with pipeline coverage and win rate to avoid false confidence.",
        ],
        steps: [
          "Enter the period quota and booked revenue so far.",
          "Enter how many days have elapsed and total days in the period.",
          "Review attainment %, projected bookings, pace delta, and required daily pace to hit quota.",
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
        const remainingAttainment = safeDivide(remainingToQuota, values.quota);
        const currentDailyPace = daysElapsed > 0 ? values.bookedToDate / daysElapsed : 0;
        const requiredPerDay =
          remainingDays > 0 ? remainingToQuota / remainingDays : remainingToQuota > 0 ? 0 : 0;
        const paceDelta = requiredPerDay - currentDailyPace;
        const onTrackGap = values.bookedToDate - onTrackToDate;
  
        return {
          headline: {
            key: "attainment",
            label: "Quota attainment",
            value: attainment ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Booked / quota",
          },
          secondary: [
            {
              key: "projected",
              label: "Projected bookings (at current pace)",
              value: projectedBookings,
              format: "currency",
              currency: "USD",
              detail: "Booked/day x total days",
            },
            {
              key: "projectedAttainment",
              label: "Projected attainment (at current pace)",
              value: projectedAttainment ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Projected bookings / quota",
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
              detail: "Quota x (days elapsed / total days)",
            },
            {
              key: "paceRatio",
              label: "Pace vs on-track",
              value: paceRatio ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "Booked to date / on-track",
            },
            {
              key: "requiredPerDay",
              label: "Required per day (remaining)",
              value: requiredPerDay,
              format: "currency",
              currency: "USD",
              detail: remainingDays > 0 ? "Remaining / remaining days" : "No remaining days",
            },
          ],
          breakdown: [
            {
              key: "currentDailyPace",
              label: "Current daily pace",
              value: currentDailyPace,
              format: "currency",
              currency: "USD",
              detail: "Booked / days elapsed",
            },
            {
              key: "paceDelta",
              label: "Pace delta vs required",
              value: paceDelta,
              format: "currency",
              currency: "USD",
              detail: paceDelta > 0 ? "Need to increase daily pace" : "Ahead of required pace",
            },
            {
              key: "onTrackGap",
              label: "Ahead/behind on-track",
              value: onTrackGap,
              format: "currency",
              currency: "USD",
              detail: "Booked to date - on-track",
            },
            {
              key: "remainingAttainment",
              label: "Remaining quota %",
              value: remainingAttainment ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: "Remaining / quota",
            },
          ],
          warnings,
        };
      },
      formula:
        "Attainment = booked / quota; projected bookings ~ (booked / days elapsed) x days in period",
      assumptions: [
        "Uses a simple linear pace projection (deal timing is often lumpy).",
        "Uses calendar-day pacing; use business days if that matches your process.",
        "Quota and booked revenue are measured on the same basis (bookings/ARR/ACV).",
      ],
      faqs: [
        {
          question: "Should I pace using business days-",
          answer:
            "If your team sells primarily on business days, yes. The key is consistency-use the same day definition for both pacing and period length.",
        },
        {
          question: "Why can projected bookings be misleading early in the period-",
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
      slug: "sales-quota-calculator",
      title: "Sales Quota Calculator (Team to Rep)",
      description:
        "Sales quota calculator to estimate quota per rep from a team target using expected attainment, ramp mix, and optional pipeline coverage checks.",
      category: "saas-metrics",
      guideSlug: "sales-quota-setting-guide",
      relatedGlossarySlugs: [
        "quota-setting",
        "quota",
        "sales-capacity",
        "sales-ramp",
        "pipeline-coverage",
        "win-rate",
        "quota-carrying-reps",
      ],
      seo: {
        intro: [
          "This sales quota calculator converts a team target into an implied quota per rep based on headcount, ramp, and expected attainment.",
          "It also connects targets to pipeline needs using win rate so you can stress-test feasibility before locking quotas.",
        ],
        steps: [
          "Enter the team target and total reps for the period.",
          "Add expected attainment and ramp mix to compute effective reps.",
          "Optionally add current quota per rep and win rate to compare capacity and pipeline needs.",
          "Review conservative/base/optimistic quota per rep scenarios.",
        ],
        pitfalls: [
          "Mixing time units (annual targets with quarterly inputs).",
          "Treating all reps as fully ramped when hiring is mid-period.",
          "Setting quota without verifying pipeline coverage and win rate.",
        ],
      },
      inputs: [
        {
          key: "teamTarget",
          label: "Team target (period)",
          placeholder: "2000000",
          prefix: "$",
          defaultValue: "2000000",
          min: 0.01,
        },
        {
          key: "reps",
          label: "Total reps",
          placeholder: "10",
          defaultValue: "10",
          min: 0,
          step: 1,
        },
        {
          key: "expectedAttainmentPercent",
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
          key: "currentQuotaPerRep",
          label: "Current quota per rep (optional)",
          help: "Use to compare expected capacity vs target.",
          placeholder: "200000",
          prefix: "$",
          defaultValue: "200000",
          min: 0,
        },
        {
          key: "winRatePercent",
          label: "Win rate (optional)",
          placeholder: "25",
          suffix: "%",
          defaultValue: "25",
          min: 0,
          step: 0.1,
        },
        {
          key: "slippagePercent",
          label: "Slippage buffer (optional)",
          placeholder: "15",
          suffix: "%",
          defaultValue: "15",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const reps = Math.floor(values.reps);
        const attainment = values.expectedAttainmentPercent / 100;
        const ramped = values.rampedPercent / 100;
        const rampingProd = values.rampingProductivityPercent / 100;
        const winRate = values.winRatePercent / 100;
        const slippage = values.slippagePercent / 100;
  
        if (values.teamTarget <= 0) warnings.push("Team target must be greater than 0.");
        if (reps < 0) warnings.push("Total reps must be 0 or greater.");
        if (attainment < 0 || attainment > 2)
          warnings.push("Expected attainment should be between 0% and 200%.");
        if (ramped < 0 || ramped > 1) warnings.push("Ramped % must be between 0% and 100%.");
        if (rampingProd < 0 || rampingProd > 1)
          warnings.push("Ramping productivity must be between 0% and 100%.");
        if (values.currentQuotaPerRep < 0)
          warnings.push("Current quota per rep must be 0 or greater.");
        if (winRate < 0 || winRate > 1) warnings.push("Win rate must be between 0% and 100%.");
        if (slippage < 0 || slippage > 2)
          warnings.push("Slippage buffer should be between 0% and 200%.");
  
        const effectiveReps = reps * (ramped + (1 - ramped) * rampingProd);
        const targetPerRepAt100 = effectiveReps > 0 ? values.teamTarget / effectiveReps : 0;
        const quotaFromAttainment = (att: number) =>
          effectiveReps > 0 && att > 0 ? values.teamTarget / (effectiveReps * att) : 0;
        const targetPerRepAtExpected = quotaFromAttainment(attainment);
        const targetPerRepFlat = reps > 0 ? values.teamTarget / reps : 0;
        const capacityAtCurrentQuota =
          values.currentQuotaPerRep > 0
            ? values.currentQuotaPerRep * effectiveReps * attainment
            : null;
        const capacityGap =
          capacityAtCurrentQuota === null ? null : capacityAtCurrentQuota - values.teamTarget;
  
        const requiredPipeline = winRate > 0 ? values.teamTarget / winRate : null;
        const bufferedPipeline =
          requiredPipeline === null ? null : requiredPipeline * (1 + slippage);
        const pipelinePerRep =
          requiredPipeline !== null && effectiveReps > 0 ? requiredPipeline / effectiveReps : null;
        const bufferedPipelinePerRep =
          bufferedPipeline !== null && effectiveReps > 0 ? bufferedPipeline / effectiveReps : null;
  
        const rampedReps = reps * ramped;
        const rampingReps = reps - rampedReps;
        const conservativeAttainment = Math.max(0.05, attainment - 0.1);
        const optimisticAttainment = Math.min(2, attainment + 0.1);
        const quotaConservative = quotaFromAttainment(conservativeAttainment);
        const quotaOptimistic = quotaFromAttainment(optimisticAttainment);
  
        return {
          headline: {
            key: "quotaPerRep",
            label: "Quota per rep (implied)",
            value: targetPerRepAtExpected,
            format: "currency",
            currency: "USD",
            detail: "Team target / (effective reps x expected attainment)",
          },
          secondary: [
            {
              key: "quotaPerRepAt100",
              label: "Quota per rep (at 100% attainment)",
              value: targetPerRepAt100,
              format: "currency",
              currency: "USD",
              detail: "Team target / effective reps",
            },
            {
              key: "targetPerRepFlat",
              label: "Target per rep (simple split)",
              value: targetPerRepFlat,
              format: "currency",
              currency: "USD",
              detail: "Team target / total reps",
            },
            {
              key: "effectiveReps",
              label: "Effective reps (ramp-adjusted)",
              value: effectiveReps,
              format: "number",
              maxFractionDigits: 2,
            },
            {
              key: "capacityAtCurrentQuota",
              label: "Capacity at current quota",
              value: capacityAtCurrentQuota ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.currentQuotaPerRep > 0 ? "Current quota x effective reps x attainment" : "Add current quota",
            },
            {
              key: "capacityGap",
              label: "Capacity surplus / shortfall",
              value: capacityGap ?? 0,
              format: "currency",
              currency: "USD",
              detail: values.currentQuotaPerRep > 0 ? "Capacity - team target" : "Add current quota",
            },
            {
              key: "requiredPipeline",
              label: "Pipeline required (from win rate)",
              value: requiredPipeline ?? 0,
              format: "currency",
              currency: "USD",
              detail: winRate > 0 ? "Target / win rate" : "Add win rate",
            },
            {
              key: "pipelinePerRep",
              label: "Pipeline per rep",
              value: pipelinePerRep ?? 0,
              format: "currency",
              currency: "USD",
              detail: winRate > 0 ? "Required pipeline / effective reps" : "Add win rate",
            },
            {
              key: "bufferedPipelinePerRep",
              label: "Pipeline per rep (with buffer)",
              value: bufferedPipelinePerRep ?? 0,
              format: "currency",
              currency: "USD",
              detail: winRate > 0 ? "Pipeline per rep x (1 + buffer)" : "Add win rate",
            },
          ],
          breakdown: [
            {
              key: "rampedReps",
              label: "Ramped reps",
              value: rampedReps,
              format: "number",
              maxFractionDigits: 2,
            },
            {
              key: "rampingReps",
              label: "Ramping reps",
              value: rampingReps,
              format: "number",
              maxFractionDigits: 2,
            },
            {
              key: "attainment",
              label: "Expected attainment",
              value: attainment,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "rampedPercent",
              label: "Ramped %",
              value: ramped,
              format: "percent",
              maxFractionDigits: 2,
            },
            {
              key: "quotaConservative",
              label: "Quota per rep (conservative)",
              value: quotaConservative,
              format: "currency",
              currency: "USD",
              detail: "Attainment -10 pts",
            },
            {
              key: "quotaBase",
              label: "Quota per rep (base)",
              value: targetPerRepAtExpected,
              format: "currency",
              currency: "USD",
              detail: "Expected attainment",
            },
            {
              key: "quotaOptimistic",
              label: "Quota per rep (optimistic)",
              value: quotaOptimistic,
              format: "currency",
              currency: "USD",
              detail: "Attainment +10 pts",
            },
          ],
          warnings,
        };
      },
      formula:
        "Quota per rep = team target / (effective reps x expected attainment); effective reps = ramped% + ramping% x ramp productivity",
      assumptions: [
        "Assumes a single expected attainment for ramped reps (segment for accuracy).",
        "Ramp productivity is expressed relative to ramped rep productivity.",
        "Win rate is applied as an average for pipeline planning.",
      ],
      faqs: [
        {
          question: "Should I use effective reps or total reps-",
          answer:
            "Use effective reps. New hires contribute less than fully ramped reps, so using total reps overstates capacity and understates quota per rep.",
        },
        {
          question: "Why does quota per rep rise when attainment drops-",
          answer:
            "If expected attainment is lower, each rep needs a higher quota target to reach the same team goal. That is often a signal to adjust headcount or pipeline instead.",
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
          "Pipeline coverage is a simple sanity check: pipeline / quota. If win rate is below 100%, you usually need multiple turns of pipeline to hit quota.",
          "This calculator also converts pipeline into expected bookings using your win rate so you can compare expected output to quota.",
        ],
        steps: [
          "Enter quota for the period and current pipeline amount.",
          "Enter estimated win rate for the same stage definition.",
          "Optionally add a slippage buffer to see coverage targets with push-outs.",
          "Review coverage ratio, expected bookings, and scenario-based pipeline needs.",
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
        {
          key: "slippagePercent",
          label: "Slippage buffer (optional)",
          help: "Extra pipeline to cover deal slippage/push-outs.",
          placeholder: "10",
          suffix: "%",
          defaultValue: "10",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const winRate = values.winRatePercent / 100;
        const slippage = values.slippagePercent / 100;
        if (values.quota <= 0) warnings.push("Quota must be greater than 0.");
        if (values.pipelineAmount < 0) warnings.push("Pipeline amount must be 0 or greater.");
        if (winRate < 0 || winRate > 1) warnings.push("Win rate must be between 0% and 100%.");
        if (slippage < 0 || slippage > 2)
          warnings.push("Slippage buffer should be between 0% and 200%.");
  
        const coverage = safeDivide(values.pipelineAmount, values.quota);
        const expectedBookings = values.pipelineAmount * winRate;
        const expectedAttainment = safeDivide(expectedBookings, values.quota);
        const requiredPipeline = winRate > 0 ? values.quota / winRate : null;
        const pipelineGap =
          requiredPipeline === null ? null : values.pipelineAmount - requiredPipeline;
        const bufferedRequiredPipeline =
          requiredPipeline === null ? null : requiredPipeline * (1 + slippage);
        const bufferedCoverage =
          bufferedRequiredPipeline === null
            ? null
            : safeDivide(bufferedRequiredPipeline, values.quota);
        const bufferedGap =
          bufferedRequiredPipeline === null ? null : values.pipelineAmount - bufferedRequiredPipeline;
        const targetCoverage = winRate > 0 ? 1 / winRate : null;
        const winRateLow = Math.max(0.01, winRate - 0.05);
        const winRateHigh = Math.min(0.99, winRate + 0.05);
        const requiredPipelineLowWin = values.quota / winRateLow;
        const requiredPipelineHighWin = values.quota / winRateHigh;
        const bufferedLowWin = requiredPipelineLowWin * (1 + slippage);
        const bufferedHighWin = requiredPipelineHighWin * (1 + slippage);
  
        return {
          headline: {
            key: "coverage",
            label: "Pipeline coverage",
            value: coverage ?? 0,
            format: "multiple",
            maxFractionDigits: 2,
            detail: "Pipeline / quota",
          },
          secondary: [
            {
              key: "expectedBookings",
              label: "Expected bookings (from pipeline)",
              value: expectedBookings,
              format: "currency",
              currency: "USD",
              detail: "Pipeline x win rate",
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
              detail: "Quota / win rate",
            },
            {
              key: "pipelineGap",
              label: "Pipeline surplus / shortfall",
              value: pipelineGap ?? 0,
              format: "currency",
              currency: "USD",
              detail: "Current pipeline - required",
            },
            {
              key: "bufferedRequiredPipeline",
              label: "Pipeline required (with buffer)",
              value: bufferedRequiredPipeline ?? 0,
              format: "currency",
              currency: "USD",
              detail: "Required pipeline x (1 + slippage)",
            },
            {
              key: "bufferedGap",
              label: "Buffered surplus / shortfall",
              value: bufferedGap ?? 0,
              format: "currency",
              currency: "USD",
              detail: "Current pipeline - buffered required",
            },
            {
              key: "requiredPipelineLowWin",
              label: "Required pipeline (low win rate)",
              value: requiredPipelineLowWin,
              format: "currency",
              currency: "USD",
              detail: "Win rate -5 pts",
            },
            {
              key: "requiredPipelineHighWin",
              label: "Required pipeline (high win rate)",
              value: requiredPipelineHighWin,
              format: "currency",
              currency: "USD",
              detail: "Win rate +5 pts",
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
            {
              key: "targetCoverage",
              label: "Coverage target (1 / win rate)",
              value: targetCoverage ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
            },
            {
              key: "bufferedCoverage",
              label: "Coverage target (with buffer)",
              value: bufferedCoverage ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
            },
            {
              key: "bufferedLowWin",
              label: "Buffered pipeline (low win rate)",
              value: bufferedLowWin,
              format: "currency",
              currency: "USD",
              detail: "Required pipeline x (1 + buffer)",
            },
            {
              key: "bufferedHighWin",
              label: "Buffered pipeline (high win rate)",
              value: bufferedHighWin,
              format: "currency",
              currency: "USD",
              detail: "Required pipeline x (1 + buffer)",
            },
          ],
          warnings,
        };
      },
      formula:
        "Coverage = pipeline / quota; expected bookings = pipeline x win rate; expected attainment = expected bookings / quota",
      assumptions: [
        "Pipeline is for the same time window as quota (e.g., this quarter) and similarly staged.",
        "Win rate is applied as an average and assumes stable conversion.",
      ],
      faqs: [
        {
          question: "What coverage ratio is 'good'-",
          answer:
            "It depends on win rate and stage quality. A rough rule is coverage ~ 1 / win rate (e.g., 25% win rate implies ~4x coverage), adjusted for deal slippage and timing.",
        },
        {
          question: "Should I use pipeline value or weighted pipeline-",
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
          "Optionally add a slippage buffer and active reps for per-rep targets.",
          "Review required pipeline $, required opportunities, and scenario ranges.",
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
        {
          key: "slippagePercent",
          label: "Slippage buffer (optional)",
          help: "Extra buffer to cover pipeline push-outs.",
          placeholder: "15",
          suffix: "%",
          defaultValue: "15",
          min: 0,
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const winRate = values.winRatePercent / 100;
        const slippage = values.slippagePercent / 100;
        if (values.target <= 0) warnings.push("Target must be greater than 0.");
        if (winRate <= 0) warnings.push("Win rate must be greater than 0%.");
        if (values.avgDealSize <= 0) warnings.push("Average deal size must be greater than 0.");
        if (values.activeReps < 0) warnings.push("Active reps must be 0 or greater.");
        if (slippage < 0 || slippage > 2)
          warnings.push("Slippage buffer should be between 0% and 200%.");
  
        const requiredWins = safeDivide(values.target, values.avgDealSize);
        const requiredOpps =
          requiredWins !== null && winRate > 0 ? requiredWins / winRate : null;
        const requiredPipeline = winRate > 0 ? values.target / winRate : 0;
        const bufferedPipeline = requiredPipeline * (1 + slippage);
        const bufferedOpps =
          requiredOpps === null ? null : requiredOpps * (1 + slippage);
        const winRateLow = Math.max(0.01, winRate - 0.05);
        const winRateHigh = Math.min(0.99, winRate + 0.05);
        const requiredPipelineLowWin = values.target / winRateLow;
        const requiredPipelineHighWin = values.target / winRateHigh;
        const avgDealLow = values.avgDealSize * 0.9;
        const avgDealHigh = values.avgDealSize * 1.1;
        const requiredWinsLowDeal = safeDivide(values.target, avgDealHigh);
        const requiredWinsHighDeal = safeDivide(values.target, avgDealLow);
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
            detail: "Target / win rate",
          },
          secondary: [
            {
              key: "requiredOpps",
              label: "Required opportunities",
              value: requiredOpps ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: requiredOpps === null ? "Invalid inputs" : "Wins / win rate",
            },
            {
              key: "requiredWins",
              label: "Required wins",
              value: requiredWins ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: requiredWins === null ? "Invalid inputs" : "Target / avg deal size",
            },
            {
              key: "impliedCoverage",
              label: "Implied coverage ratio",
              value: impliedCoverage ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
              detail: "Required pipeline / target",
            },
            {
              key: "pipelinePerRep",
              label: "Pipeline per rep",
              value: pipelinePerRep ?? 0,
              format: "currency",
              currency: "USD",
              detail: reps > 0 ? "Required pipeline / reps" : "Add reps to estimate",
            },
            {
              key: "oppsPerRep",
              label: "Opportunities per rep",
              value: oppsPerRep ?? 0,
              format: "number",
              maxFractionDigits: 1,
              detail: reps > 0 ? "Required opps / reps" : "Add reps to estimate",
            },
            {
              key: "bufferedPipeline",
              label: "Pipeline with buffer",
              value: bufferedPipeline,
              format: "currency",
              currency: "USD",
              detail: "Required pipeline x (1 + slippage)",
            },
            {
              key: "bufferedOpps",
              label: "Opportunities with buffer",
              value: bufferedOpps ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: "Required opps x (1 + slippage)",
            },
            {
              key: "pipelineLowWin",
              label: "Pipeline required (low win rate)",
              value: requiredPipelineLowWin,
              format: "currency",
              currency: "USD",
              detail: "Win rate -5 pts",
            },
            {
              key: "pipelineHighWin",
              label: "Pipeline required (high win rate)",
              value: requiredPipelineHighWin,
              format: "currency",
              currency: "USD",
              detail: "Win rate +5 pts",
            },
          ],
          breakdown: [
            {
              key: "winsLowDeal",
              label: "Required wins (deal size +10%)",
              value: requiredWinsLowDeal ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: "Higher ACV reduces wins",
            },
            {
              key: "winsHighDeal",
              label: "Required wins (deal size -10%)",
              value: requiredWinsHighDeal ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: "Lower ACV increases wins",
            },
          ],
          warnings,
        };
      },
      formula:
        "Required pipeline = target / win rate; wins = target / avg deal size; opps = wins / win rate",
      assumptions: [
        "Uses average deal size; segment for higher accuracy.",
        "Win rate is stable and measured on the same stage definition as your pipeline.",
      ],
      faqs: [
        {
          question: "Why is required pipeline target / win rate-",
          answer:
            "If you win X% of pipeline value on average, you need about 1/X times the target in pipeline to produce the target in closed revenue (before adding buffer for slippage).",
        },
        {
          question: "Should I add a buffer above required pipeline-",
          answer:
            "Often yes. Deal slippage and push-outs can be material. Many teams set an additional buffer (e.g., +10-30%) based on historical slippage.",
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
      relatedGlossarySlugs: [
        "sales-capacity",
        "sales-ramp",
        "quota",
        "quota-attainment",
        "pipeline",
        "quota-carrying-reps",
      ],
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
          "Review capacity scenarios for lower and higher attainment.",
        ],
        pitfalls: [
          "Assuming all reps are fully ramped.",
          "Using quota that doesn't match the same period definition.",
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
        const rampedReps = reps * ramped;
        const rampingReps = reps - rampedReps;
  
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
        const rampedCapacity = rampedReps * perRepCapacity;
        const rampingCapacity = rampingReps * perRepCapacity * rampingProd;
        const capacity = rampedCapacity + rampingCapacity;
        const attainmentLow = Math.max(0, attainment - 0.1);
        const attainmentHigh = Math.min(2, attainment + 0.1);
        const capacityLowAttainment =
          reps * (ramped + (1 - ramped) * rampingProd) * values.quotaPerRep * attainmentLow;
        const capacityHighAttainment =
          reps * (ramped + (1 - ramped) * rampingProd) * values.quotaPerRep * attainmentHigh;
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
            detail: "Reps x quota x attainment x ramp mix",
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
          breakdown: [
            {
              key: "rampedReps",
              label: "Ramped reps",
              value: rampedReps,
              format: "number",
              maxFractionDigits: 2,
            },
            {
              key: "rampingReps",
              label: "Ramping reps",
              value: rampingReps,
              format: "number",
              maxFractionDigits: 2,
            },
            {
              key: "rampedCapacity",
              label: "Ramped capacity",
              value: rampedCapacity,
              format: "currency",
              currency: "USD",
            },
            {
              key: "rampingCapacity",
              label: "Ramping capacity",
              value: rampingCapacity,
              format: "currency",
              currency: "USD",
            },
            {
              key: "capacityLowAttainment",
              label: "Capacity (low attainment)",
              value: capacityLowAttainment,
              format: "currency",
              currency: "USD",
              detail: "Attainment -10 pts",
            },
            {
              key: "capacityHighAttainment",
              label: "Capacity (high attainment)",
              value: capacityHighAttainment,
              format: "currency",
              currency: "USD",
              detail: "Attainment +10 pts",
            },
          ],
          warnings,
        };
      },
      formula:
        "Capacity ~ reps x quota per rep x attainment x (ramped% + (1-ramped%)xramping productivity)",
      assumptions: [
        "Ramping productivity is expressed relative to ramped rep productivity.",
        "Attainment applies to ramped productivity; actual outcomes vary by segment and seasonality.",
      ],
      faqs: [
        {
          question: "Why use ramp-adjusted effective reps-",
          answer:
            "Because a team with many new hires has fewer 'fully productive' reps. Adjusting for ramp helps you avoid over-forecasting bookings.",
        },
        {
          question: "How should I pick ramping productivity-",
          answer:
            "Use historical ramp curves (month 1, 2, 3 productivity). If you don't have data, start conservative (e.g., 20-50%) and refine with observed cohorts.",
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
          "From OTE and quota you can derive a simple commission rate (variable / quota) and sanity-check incentive alignment.",
        ],
        steps: [
          "Enter base and variable compensation for the period (usually annual).",
          "Enter quota for the same period.",
          "Review OTE, OTE to quota ratio, commission rate, and base/variable split.",
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
        const oteToQuota = safeDivide(ote, values.quota);
        const baseToVariable = safeDivide(values.basePay, values.variablePay);
        const monthlyOte = ote / 12;
        const monthlyBase = values.basePay / 12;
        const monthlyVariable = values.variablePay / 12;
        const variablePerPoint = values.variablePay / 100;
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
              label: "Commission rate (variable / quota)",
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
            {
              key: "oteToQuota",
              label: "OTE to quota ratio",
              value: oteToQuota ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
            },
          ],
          breakdown: [
            {
              key: "baseToVariable",
              label: "Base to variable ratio",
              value: baseToVariable ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
            },
            {
              key: "variablePerPoint",
              label: "Variable payout per 1% attainment",
              value: variablePerPoint,
              format: "currency",
              currency: "USD",
            },
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
      formula: "OTE = base + variable; commission rate ~ variable / quota",
      assumptions: [
        "Assumes linear commission proportional to quota attainment (no accelerators/decels).",
        "Base and quota are for the same time unit (annual vs quarterly).",
      ],
      faqs: [
        {
          question: "What's a typical OTE split-",
          answer:
            "Many AE roles use ~50/50 base/variable, but it varies by motion and market. Use this as a sanity check, not a rule.",
        },
        {
          question: "Does this include accelerators-",
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
          "Enter funnel conversion rates from lead -> MQL -> SQL -> opp -> win.",
          "Review required counts at each funnel stage and implied pipeline value.",
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
          label: "Lead -> MQL",
          placeholder: "20",
          suffix: "%",
          defaultValue: "20",
          min: 0.01,
          step: 0.1,
        },
        {
          key: "mqlToSqlPercent",
          label: "MQL -> SQL",
          placeholder: "30",
          suffix: "%",
          defaultValue: "30",
          min: 0.01,
          step: 0.1,
        },
        {
          key: "sqlToOppPercent",
          label: "SQL -> Opportunity",
          placeholder: "40",
          suffix: "%",
          defaultValue: "40",
          min: 0.01,
          step: 0.1,
        },
        {
          key: "oppToWinPercent",
          label: "Opportunity -> Win",
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
        if (leadToMql <= 0) warnings.push("Lead -> MQL must be greater than 0%.");
        if (mqlToSql <= 0) warnings.push("MQL -> SQL must be greater than 0%.");
        if (sqlToOpp <= 0) warnings.push("SQL -> Opportunity must be greater than 0%.");
        if (oppToWin <= 0) warnings.push("Opportunity -> Win must be greater than 0%.");
  
        const wins = safeDivide(values.revenueTarget, values.avgDealSize);
        const opps = wins !== null ? safeDivide(wins, oppToWin) : null;
        const sqls = opps !== null ? safeDivide(opps, sqlToOpp) : null;
        const mqls = sqls !== null ? safeDivide(sqls, mqlToSql) : null;
        const leads = mqls !== null ? safeDivide(mqls, leadToMql) : null;
        const pipelineValue = opps !== null ? opps * values.avgDealSize : null;
        const pipelineCoverage =
          pipelineValue !== null ? safeDivide(pipelineValue, values.revenueTarget) : null;
        const leadsPerWin = wins !== null ? safeDivide(leads ?? 0, wins) : null;
  
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
            {
              key: "pipelineValue",
              label: "Implied pipeline value",
              value: pipelineValue ?? 0,
              format: "currency",
              currency: "USD",
              detail: "Opportunities x deal size",
            },
            {
              key: "pipelineCoverage",
              label: "Implied pipeline coverage",
              value: pipelineCoverage ?? 0,
              format: "multiple",
              maxFractionDigits: 2,
            },
          ],
          breakdown: [
            {
              key: "leadsPerWin",
              label: "Leads per win",
              value: leadsPerWin ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: "Required leads / required wins",
            },
          ],
          warnings,
        };
      },
      formula:
        "wins = target / deal size; opps = wins / opp->win; SQLs = opps / SQL->opp; MQLs = SQLs / MQL->SQL; leads = MQLs / lead->MQL",
      assumptions: [
        "Conversion rates are stable and measured over consistent windows.",
        "Ignores time lag (sales cycle); align inputs to the same period.",
        "Assumes average deal size is representative; segment for higher accuracy.",
      ],
      faqs: [
        {
          question: "Why does a small change in conversion rates move leads a lot-",
          answer:
            "Because conversion rates multiply. Small improvements at each stage compound into a large reduction in top-of-funnel volume required.",
        },
        {
          question: "Should I use leads or MQLs as the starting point-",
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
          "Activation is a leading indicator of retention. If users don't reach an 'aha moment', they're unlikely to stick.",
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
        const activationGap =
          requiredActivated !== null ? requiredActivated - activated : null;
        const gapPercent =
          values.targetActivationPercent > 0 && rate !== null ? target - rate : null;
  
        return {
          headline: {
            key: "activationRate",
            label: "Activation rate",
            value: rate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Activated / signups",
          },
          secondary: [
            {
              key: "requiredActivated",
              label: "Activated users needed for target",
              value: requiredActivated ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail:
                requiredActivated === null
                  ? "Target disabled"
                  : values.targetActivationPercent + "% x signups",
            },
            {
              key: "activationGap",
              label: "Activation gap (users)",
              value: activationGap ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail:
                activationGap === null
                  ? "Target disabled"
                  : "Required activated - current activated",
            },
            {
              key: "gapPercent",
              label: "Activation gap (percentage points)",
              value: gapPercent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail:
                gapPercent === null
                  ? "Target disabled"
                  : "Target activation - current activation",
            },
          ],
          warnings,
        };
      },
      formula: "Activation rate = activated users / signups",
      assumptions: [
        "Activation is defined by a single event/threshold (custom per product).",
        "Inputs reflect the same cohort and time window.",
      ],
      faqs: [
        {
          question: "What should count as 'activated'-",
          answer:
            "Use an event that correlates with retention and value (the 'aha' moment). Avoid vanity events like 'visited settings' unless they predict long-term use.",
        },
        {
          question: "Should I measure activation by account instead of user-",
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
          "Using a window that's too short (under-counts conversions for long sales cycles).",
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
        const requiredPaid = values.targetPercent > 0 ? Math.ceil(trials * target) : null;
        const gapPaid = requiredPaid !== null ? requiredPaid - paid : null;
        const gapPercent = values.targetPercent > 0 && rate !== null ? target - rate : null;
  
        return {
          headline: {
            key: "trialToPaid",
            label: "Trial-to-paid conversion",
            value: rate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Paid / trials",
          },
          secondary: [
            {
              key: "requiredPaid",
              label: "Paid conversions needed for target",
              value: requiredPaid ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: requiredPaid === null ? "Target disabled" : values.targetPercent + "% x trials",
            },
            {
              key: "gapPaid",
              label: "Paid conversion gap (users)",
              value: gapPaid ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: gapPaid === null ? "Target disabled" : "Required paid - current paid",
            },
            {
              key: "gapPercent",
              label: "Conversion gap (percentage points)",
              value: gapPercent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: gapPercent === null ? "Target disabled" : "Target rate - current rate",
            },
          ],
          warnings,
        };
      },
      formula: "Trial-to-paid = paid conversions / trials started",
      assumptions: [
        "Uses a single conversion window; use cohorts for long sales cycles.",
        "Trials and paid conversions reflect the same cohort definition.",
      ],
      faqs: [
        {
          question: "What window should I use (7/14/30 days)-",
          answer:
            "Use a window that matches your typical conversion lag. If sales-assisted conversions take longer, track them separately or extend the window so you don't undercount conversions.",
        },
        {
          question: "Should I include free users in trials-",
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
          "It's useful for product engagement, but it depends on how you define 'active' and can vary widely by product type.",
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
        const gapDau = requiredDau !== null ? requiredDau - dau : null;
        const gapPercent = values.targetPercent > 0 && ratio !== null ? target - ratio : null;
  
        return {
          headline: {
            key: "stickiness",
            label: "DAU/MAU (stickiness)",
            value: ratio ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "DAU / MAU",
          },
          secondary: [
            {
              key: "activeDays",
              label: "Implied active days per month",
              value: activeDaysPerMonth,
              format: "number",
              maxFractionDigits: 1,
              detail: "DAU/MAU x 30",
            },
            {
              key: "requiredDau",
              label: "DAU needed for target",
              value: requiredDau ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: requiredDau === null ? "Target disabled" : values.targetPercent + "% x MAU",
            },
            {
              key: "dauGap",
              label: "DAU gap (users)",
              value: gapDau ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: gapDau === null ? "Target disabled" : "Required DAU - current DAU",
            },
            {
              key: "dauGapPercent",
              label: "DAU gap (percentage points)",
              value: gapPercent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: gapPercent === null ? "Target disabled" : "Target stickiness - current stickiness",
            },
          ],
          warnings,
        };
      },
      formula: "DAU/MAU = DAU / MAU",
      assumptions: [
        "DAU and MAU use the same 'active' definition and time period.",
        "Implied active days per month uses a 30-day approximation.",
      ],
      faqs: [
        {
          question: "What is a good DAU/MAU-",
          answer:
            "It depends on product cadence. Daily tools can be 20-60%+; weekly workflows may be lower. Track trends and segment by persona/plan for actionability.",
        },
        {
          question: "Should I use WAU/MAU instead-",
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
          question: "When should I use WAU/MAU instead of DAU/MAU-",
          answer:
            "Use WAU/MAU when usage is naturally weekly (e.g., planning, reporting). It's often a more stable signal than DAU/MAU for weekly cadence products.",
        },
        {
          question: "Can WAU/MAU be above 100%-",
          answer:
            "No, not with consistent definitions. If it happens, it usually indicates you're using mismatched denominators or date ranges.",
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
        const gapUsers = requiredUsers !== null ? requiredUsers - used : null;
        const gapPercent = values.targetPercent > 0 && adoption !== null ? target - adoption : null;
  
        return {
          headline: {
            key: "adoption",
            label: "Feature adoption rate",
            value: adoption ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Users who used / active users",
          },
          secondary: [
            {
              key: "requiredUsers",
              label: "Users needed for target",
              value: requiredUsers ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: requiredUsers === null ? "Target disabled" : values.targetPercent + "% x active users",
            },
            {
              key: "adoptionGap",
              label: "Adoption gap (users)",
              value: gapUsers ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: gapUsers === null ? "Target disabled" : "Required users - current users",
            },
            {
              key: "adoptionGapPercent",
              label: "Adoption gap (percentage points)",
              value: gapPercent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: gapPercent === null ? "Target disabled" : "Target adoption - current adoption",
            },
          ],
          warnings,
        };
      },
      formula: "Feature adoption rate = users who used feature / active users",
      assumptions: [
        "Active users and feature users are measured over the same window and same identity (user/account).",
        "Feature usage threshold is meaningful (define it clearly).",
      ],
      faqs: [
        {
          question: "Should I measure adoption by user or account-",
          answer:
            "Use the unit that matches how value is realized. In B2B tools, account-level adoption can be more meaningful than user-level adoption for expansion and retention.",
        },
        {
          question: "What's the difference between adoption and activation-",
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
        const paidGap = values.targetPaid > 0 ? values.targetPaid - paid : null;
        const gapPercent = requiredRate !== null && rate !== null ? requiredRate - rate : null;
  
        return {
          headline: {
            key: "pqlToPaid",
            label: "PQL-to-paid conversion",
            value: rate ?? 0,
            format: "percent",
            maxFractionDigits: 2,
            detail: "Paid / PQLs",
          },
          secondary: [
            {
              key: "requiredRate",
              label: "Required conversion rate for target paid",
              value: requiredRate ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: requiredRate === null ? "Target disabled" : "Target paid / PQLs",
            },
            {
              key: "paidGap",
              label: "Paid customer gap (users)",
              value: paidGap ?? 0,
              format: "number",
              maxFractionDigits: 0,
              detail: paidGap === null ? "Target disabled" : "Target paid - current paid",
            },
            {
              key: "rateGap",
              label: "Conversion gap (percentage points)",
              value: gapPercent ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail: gapPercent === null ? "Target disabled" : "Target rate - current rate",
            },
          ],
          warnings,
        };
      },
      formula: "PQL-to-paid = paid customers from PQLs / PQLs",
      assumptions: [
        "PQL definition is stable and predictive (not vanity).",
        "Paid customers are attributed back to the originating PQL cohort consistently.",
      ],
      faqs: [
        {
          question: "What should define a PQL-",
          answer:
            "Use product signals that correlate with conversion and retention (e.g., invited teammates, created X items, integrated Y). Validate PQL definitions by cohort outcomes.",
        },
        {
          question: "Should I track PQL-to-paid by channel-",
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
        "Gross profit LTV ~ (ARPAxgross margin) / churn; Payback ~ CAC / (ARPAxgross margin)",
      assumptions: [
        "Churn-based LTV shortcut (constant churn).",
        "ARPA constant; ignores expansion and contraction.",
        "Gross margin change does not change churn (scenario test if it might).",
      ],
      faqs: [
        {
          question: "Should I use contribution margin instead of gross margin-",
          answer:
            "If variable costs beyond COGS materially affect profit (fees, shipping, support), contribution margin can be a better proxy. Use the definition that matches your unit economics model.",
        },
        {
          question: "How can I improve gross margin-",
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
        const maxDiscount =
          values.currentArpaMonthly > 0 ? 1 - minArpa / values.currentArpaMonthly : 0;
  
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
              detail: "CAC / target payback months",
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
        "Payback = CAC / (ARPAxmargin) - min ARPA = (CAC / payback) / margin; max discount = 1 - minARPA/currentARPA",
      assumptions: [
        "Payback is computed on gross profit (ARPA x gross margin).",
        "Ignores churn changes from pricing; validate with cohort data.",
        "Use segment-level ARPA/CAC for realistic guardrails.",
      ],
      faqs: [
        {
          question: "Is this the only pricing guardrail I should use-",
          answer:
            "No. Pair payback guardrails with retention risk (churn) and value perception. A discount can hit payback and still be bad if it changes customer quality or expansion potential.",
        },
        {
          question: "Should I use contribution margin instead of gross margin-",
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
        "Payment = Pxrx(1+r)^n / ((1+r)^n - 1) where r is monthly rate and n is months (for r>0)",
      assumptions: [
        "Fixed-rate, fully amortizing loan with constant monthly payments.",
        "Does not include taxes, insurance, or extra fees.",
        "APR is treated as nominal annual rate divided by 12 for monthly rate.",
      ],
      faqs: [
        {
          question: "Why is total interest so high on long terms-",
          answer:
            "Because interest accrues on outstanding principal over many months. Longer terms reduce payment but increase total interest paid.",
        },
        {
          question: "What if I make extra payments-",
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
          key: "apyPercent",
          label: "APY (optional)",
          help: "Used to compute an implied APR from an effective annual rate.",
          placeholder: "6.2",
          suffix: "%",
          defaultValue: "0",
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
        const apyInput = values.apyPercent / 100;
        const aprFromApy =
          values.apyPercent > 0 ? n * (Math.pow(1 + apyInput, 1 / n) - 1) : null;
        const periodic = apr / n;
  
        if (values.aprPercent === 0 && values.apyPercent === 0) {
          warnings.push("Enter APR or APY to convert between rates.");
        }
        if (values.aprPercent > 0 && values.apyPercent > 0) {
          warnings.push("Both APR and APY are set. Outputs show conversions for both.");
        }
  
        return {
          headline: {
            key: "apy",
            label: "APY (effective annual rate)",
            value: apy,
            format: "percent",
            maxFractionDigits: 3,
            detail: "From APR input",
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
              key: "aprFromApy",
              label: "APR (from APY input)",
              value: aprFromApy ?? 0,
              format: "percent",
              maxFractionDigits: 3,
              detail: aprFromApy === null ? "Add APY input" : "Nominal rate from APY",
            },
            {
              key: "periodic",
              label: "Periodic rate",
              value: periodic,
              format: "percent",
              maxFractionDigits: 3,
              detail: `APR / ${n}`,
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
          question: "Is APY always higher than APR-",
          answer:
            "If APR is positive and compounding occurs more than once per year, APY is higher because interest earns interest. If APR is 0, APY is 0.",
        },
        {
          question: "Why do banks advertise APY for savings-",
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
          "Nominal returns don't account for inflation. Real return measures how much purchasing power you gain after inflation.",
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
        {
          key: "targetRealPercent",
          label: "Target real return (optional)",
          placeholder: "5",
          suffix: "%",
          defaultValue: "0",
          step: 0.1,
        },
      ],
      compute(values) {
        const warnings: string[] = [];
        const nominal = values.nominalReturnPercent / 100;
        const inflation = values.inflationPercent / 100;
        const real = (1 + nominal) / (1 + inflation) - 1;
        const drag = nominal - real;
        const targetReal = values.targetRealPercent / 100;
        const requiredNominal =
          values.targetRealPercent > 0 ? (1 + targetReal) * (1 + inflation) - 1 : null;
  
        if (1 + inflation <= 0) {
          warnings.push("Inflation must be greater than -100% for real return math.");
        }
  
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
            {
              key: "requiredNominal",
              label: "Required nominal for target real",
              value: requiredNominal ?? 0,
              format: "percent",
              maxFractionDigits: 2,
              detail:
                requiredNominal === null
                  ? "Add target real return"
                  : "Target real + inflation interaction",
            },
          ],
          warnings,
        };
      },
      formula: "Real return = (1 + nominal) / (1 + inflation) - 1",
      assumptions: [
        "Inflation rate is an approximation (e.g., CPI).",
        "Uses annual rates; use consistent units for inputs.",
        "Does not model taxes; real after-tax return can be lower.",
      ],
      faqs: [
        {
          question: "Why can real return be negative-",
          answer:
            "If inflation exceeds nominal return, your purchasing power declines even though your nominal balance grows.",
        },
        {
          question: "Is real return the same as risk-adjusted return-",
          answer:
            "No. Real return adjusts for inflation. Risk-adjusted return accounts for volatility and risk (e.g., Sharpe ratio).",
        },
      ],
    }
];
