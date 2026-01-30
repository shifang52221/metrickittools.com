import type { GlossaryFaq, GlossarySection, GlossaryTerm } from "../types";

type Seed = {
  slug: string;
  title: string;
  description: string;
  updatedAt?: string; // YYYY-MM-DD
  formula?: string;
  example?: string;
  bullets?: string[];
  mistakes?: string[];
  faqs?: GlossaryFaq[];
  relatedGuideSlugs?: string[];
  relatedCalculatorSlugs?: string[];
};

function sectionsFor(seed: Seed): GlossarySection[] {
  const sections: GlossarySection[] = [
    { type: "h2", text: "Definition" },
    { type: "p", text: seed.description },
  ];
  if (seed.formula) {
    sections.push({ type: "h2", text: "Formula" });
    sections.push({ type: "p", text: seed.formula });
  }
  if (seed.example) {
    sections.push({ type: "h2", text: "Example" });
    sections.push({ type: "p", text: seed.example });
  }
  if (seed.bullets?.length) {
    sections.push({ type: "h2", text: "How to use it" });
    sections.push({ type: "bullets", items: seed.bullets });
  }
  if (seed.mistakes?.length) {
    sections.push({ type: "h2", text: "Common mistakes" });
    sections.push({ type: "bullets", items: seed.mistakes });
  }
  return sections;
}

function make(seed: Seed): GlossaryTerm {
  return {
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    category: "saas-metrics",
    updatedAt: seed.updatedAt ?? "2026-01-24",
    sections: sectionsFor(seed),
    faqs: seed.faqs,
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "pipeline-velocity",
    title: "Pipeline Velocity",
    description:
      "Pipeline velocity estimates how quickly pipeline converts into revenue. It combines deal size, win rate, and sales cycle length.",
    formula:
      "Pipeline velocity (per period) ~= opportunities * win rate * average deal size / sales cycle length",
    bullets: [
      "Use it to diagnose whether growth comes from more pipeline, higher win rate, larger deals, or faster cycles.",
      "Track velocity by segment (SMB vs enterprise) because deal size and cycle length differ.",
    ],
    mistakes: [
      "Mixing stage definitions (win rate) and pipeline numbers from different funnels.",
      "Optimizing velocity by inflating pipeline with unqualified opportunities.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "stage-conversion-rate",
    title: "Stage Conversion Rate",
    description:
      "Stage conversion rate is the % of records that move from one stage to the next (for example SQL -> Opportunity, Opportunity -> Won).",
    formula: "Stage conversion = next stage count / prior stage count",
    example:
      "If 200 SQLs become 80 opportunities, SQL -> Opportunity conversion is 40%.",
    bullets: [
      "Use stage conversion to find bottlenecks in your funnel.",
      "Keep stage definitions stable; otherwise trends become meaningless.",
      "Segment by channel or deal size to find weak stages faster.",
      "Track conversion by rep to diagnose coaching needs.",
    ],
    mistakes: [
      "Comparing stages with different entry criteria.",
      "Mixing time windows between stages and total pipeline.",
      "Using a single blended rate when segments behave differently.",
    ],
    faqs: [
      {
        question: "Should stage conversion be measured by count or value-",
        answer:
          "Use count when you care about process efficiency and value when deal size varies materially. Keep the method consistent over time.",
      },
      {
        question: "How often should stage conversion be reviewed-",
        answer:
          "Monthly for most teams and weekly for fast-moving funnels. Align review cadence with your sales cycle length.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "sales-forecast",
    title: "Sales Forecast",
    description:
      "A sales forecast is an estimate of bookings/revenue you expect to close in a future period based on pipeline, win rates, and timing.",
    bullets: [
      "Forecasts are only as good as pipeline hygiene and stage definitions.",
      "Use historical win rates and slippage by stage to reduce optimism bias.",
      "Separate committed, best-case, and pipeline to avoid blended optimism.",
    ],
    mistakes: [
      "Using stale close dates that overstate near-term bookings.",
      "Ignoring seasonality and procurement cycles in enterprise deals.",
    ],
    faqs: [
      {
        question: "How often should forecasts be updated-",
        answer:
          "Weekly for near-term quarters and monthly for longer horizons. Update after major pipeline changes.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "forecast-accuracy",
    title: "Forecast Accuracy",
    description:
      "Forecast accuracy measures how close your forecast was to the actual outcome (bookings/revenue) for a period.",
    example:
      "If you forecast $1.0M and book $900k, accuracy is about 90%.",
    bullets: [
      "Track accuracy by segment and by stage source to identify systemic bias.",
      "Use accuracy to improve process, not to punish teams (or you get sandbagging).",
      "Measure both over-forecast and under-forecast to see direction of bias.",
      "Review forecast accuracy alongside slippage to separate timing vs quality.",
      "Report accuracy by horizon (30, 60, 90 days) to see where signal breaks.",
    ],
    mistakes: [
      "Comparing accuracy across periods with different forecast definitions.",
      "Ignoring slippage rates that shift deals out of the period.",
      "Changing stage definitions without re-baselining accuracy.",
      "Measuring accuracy without excluding pulled-in deals from future periods.",
    ],
    faqs: [
      {
        question: "Should forecast accuracy be measured by value or count-",
        answer:
          "Value-based accuracy is common for revenue planning, but count-based can reveal deal-size bias. Use both if possible.",
      },
      {
        question: "What is a good forecast accuracy target-",
        answer:
          "Targets vary by model maturity, but consistent accuracy within 10% to 15% with low bias is a common goal.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "deal-slippage",
    title: "Deal Slippage",
    description:
      "Deal slippage is when opportunities expected to close in a period move out to a later period. It reduces forecast reliability and complicates capacity planning.",
    bullets: [
      "Track slippage rate by stage; late-stage slippage is especially costly.",
      "Slippage often signals weak qualification, procurement delays, or missing champions.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "average-sales-price",
    title: "Average Sales Price (ASP)",
    description:
      "Average sales price is the average booked value per closed-won deal over a period (often ACV for SaaS).",
    formula: "ASP = booked value / number of closed-won deals",
    example:
      "If $1.5M is booked across 30 deals, ASP is $50k.",
    bullets: [
      "Use ASP with win rate to understand whether growth comes from bigger deals or more deals.",
      "Segment ASP by plan and customer size to avoid mix-shift confusion.",
      "Track ASP with sales cycle length to see trade-offs in deal size.",
    ],
    mistakes: [
      "Mixing contract terms (monthly vs annual) without normalization.",
      "Comparing ASP across segments with different pricing models.",
    ],
    faqs: [
      {
        question: "Should ASP be based on ACV or TCV-",
        answer:
          "Use ACV for recurring comparisons. Use TCV when one-time fees are material and you need a full contract view.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "sales-accepted-lead",
    title: "SAL (Sales-accepted Lead)",
    description:
      "A sales-accepted lead (SAL) is a lead that sales agrees is worth working, often a checkpoint between MQL and SQL.",
    example:
      "An SDR reviews an MQL, confirms basic fit, and accepts it for follow-up as SAL.",
    bullets: [
      "Use SAL to align marketing and sales on quality expectations.",
      "Track SAL rate by channel to identify high-quality lead sources.",
      "Set a response-time SLA so accepted leads are worked quickly.",
    ],
    mistakes: [
      "Accepting leads without a quick qualification pass.",
      "Letting SAL criteria vary by rep, which breaks reporting.",
    ],
    faqs: [
      {
        question: "How is SAL different from SQL-",
        answer:
          "SAL is an initial sales acceptance that a lead is worth working. SQL is a deeper qualification that the lead meets sales criteria for an opportunity.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "sales-qualified-opportunity",
    title: "SQO (Sales-qualified Opportunity)",
    description:
      "A sales-qualified opportunity (SQO) is an opportunity that meets qualification criteria and is entered into the active sales pipeline.",
    bullets: [
      "Define SQO criteria clearly (need, authority, budget, timeline) to reduce pipeline noise.",
      "Track SQO -> Won conversion and time-to-close for capacity planning.",
      "Review SQO quality by segment to prevent inflated pipeline coverage.",
    ],
    mistakes: [
      "Promoting deals to SQO without a documented next step.",
      "Using SQO definitions that differ by rep or region.",
    ],
    faqs: [
      {
        question: "How is SQO different from SQL-",
        answer:
          "SQL is a qualified lead; SQO is a qualified opportunity in pipeline with a defined stage and next step.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "sales-qualified-pipeline",
    title: "Sales-qualified Pipeline",
    description:
      "Sales-qualified pipeline is the subset of pipeline that meets agreed qualification criteria, making it more predictive than raw pipeline.",
    example:
      "If total pipeline is $4M and $2.5M meets SQO criteria, qualified pipeline is $2.5M.",
    bullets: [
      "Use qualified pipeline for coverage planning (it is harder to game).",
      "Keep qualification rules consistent or you will break trends.",
      "Track qualified pipeline by segment to expose weak coverage.",
      "Audit qualification notes to ensure criteria are actually met.",
    ],
    mistakes: [
      "Changing qualification rules without backfilling history.",
      "Counting early-stage pipeline as qualified.",
      "Including pipeline with no next step or unclear close date.",
      "Treating qualified pipeline as guaranteed revenue.",
    ],
    faqs: [
      {
        question: "How often should qualified pipeline be updated-",
        answer:
          "Review weekly or biweekly, and after major stage definition changes or pricing updates.",
      },
      {
        question: "What coverage ratio should qualified pipeline target-",
        answer:
          "It varies by sales cycle and win rate, but many teams target 3x to 5x qualified coverage for the period.",
      },
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "opportunity-win-rate",
    title: "Opportunity Win Rate",
    description:
      "Opportunity win rate is the fraction of opportunities that become closed-won. It should be measured with a clear stage definition.",
    formula: "Opportunity win rate = closed-won / opportunities (same definition)",
    example:
      "If 40 of 160 opportunities close, win rate is 25%.",
    bullets: [
      "Track by segment and deal size; blended win rate hides problems.",
      "Use win rate with sales cycle length to estimate required pipeline.",
      "Separate inbound vs outbound win rates to improve targeting.",
    ],
    mistakes: [
      "Mixing stage definitions between teams or regions.",
      "Using a win rate from a different period than the target pipeline.",
    ],
    faqs: [
      {
        question: "Should I measure win rate by count or value-",
        answer:
          "Both can be useful. Count-based win rate shows conversion efficiency, while value-based win rate highlights deal-size impact.",
      },
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "sales-cycle-variance",
    title: "Sales Cycle Variance",
    description:
      "Sales cycle variance describes how spread out your time-to-close is (some deals close fast, others stall). High variance makes forecasting harder.",
    example:
      "If p50 is 45 days and p90 is 140 days, variance is high and forecast risk rises.",
    bullets: [
      "Track median and percentile cycle lengths (p50/p75/p90), not just averages.",
      "Use variance to identify deal types that consistently slip.",
      "Separate new business vs expansion deals; variance often differs.",
    ],
    mistakes: [
      "Using only average cycle length and missing long-tail delays.",
      "Mixing segments with different buying processes and calling it variance.",
    ],
    faqs: [
      {
        question: "How do I reduce sales cycle variance-",
        answer:
          "Tighten qualification, define stage exit criteria, and remove deals without clear next steps. Also segment the pipeline by deal type.",
      },
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "time-to-close",
    title: "Time to Close",
    description:
      "Time to close is the elapsed time from opportunity creation (or first touch) to closed-won or closed-lost.",
    bullets: [
      "Measure time-to-close by stage and segment to find the true bottleneck.",
      "Longer time-to-close increases cash needs and delays payback in practice.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide", "cash-runway-guide"],
  },
  {
    slug: "time-to-value",
    title: "Time to Value (TTV)",
    description:
      "Time to value (TTV) is how long it takes a new customer to reach a meaningful outcome. Shorter TTV tends to improve retention.",
    bullets: [
      "Define 'value' as the earliest outcome that predicts retention or expansion.",
      "Track TTV by segment to improve onboarding and product activation.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "onboarding-completion",
    title: "Onboarding Completion Rate",
    description:
      "Onboarding completion rate is the % of new users who finish your onboarding milestones within a defined window.",
    formula: "Onboarding completion = completed / started",
    example:
      "If 400 users start onboarding and 260 finish, completion rate is 65%.",
    bullets: [
      "Use it as an early leading indicator for activation and retention.",
      "Measure completion time as well as completion rate (speed matters).",
      "Segment by persona and acquisition channel to improve onboarding flows.",
      "Tie completion to activation outcomes to confirm value.",
      "Track where users drop off to prioritize onboarding fixes.",
    ],
    mistakes: [
      "Counting completion without verifying downstream activation.",
      "Changing milestones mid-period and breaking trend comparisons.",
      "Optimizing completion at the expense of time-to-value.",
    ],
    faqs: [
      {
        question: "What is a good onboarding completion rate-",
        answer:
          "It depends on product complexity. Track trends and cohort retention rather than chasing a single benchmark.",
      },
      {
        question: "Should onboarding be shorter or more thorough-",
        answer:
          "Balance speed and clarity. Shorter onboarding helps time-to-value, but missing key steps can reduce activation and retention.",
      },
      {
        question: "Should we require onboarding completion before paywalling-",
        answer:
          "Only if completion strongly predicts retention. Otherwise, consider partial onboarding before paywall to reduce friction.",
      },
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide"],
  },
  {
    slug: "product-adoption",
    title: "Product Adoption",
    description:
      "Product adoption measures how deeply and broadly customers use your product (features, frequency, breadth of teams). It is a driver of retention and expansion.",
    example:
      "An account uses three core features weekly across two teams, signaling high adoption.",
    bullets: [
      "Track adoption by cohort and by segment; blended adoption hides weak cohorts.",
      "Tie adoption metrics to retention outcomes to avoid vanity usage metrics.",
      "Separate breadth (how many features) from depth (how often) to see gaps.",
      "Monitor adoption drop-offs after releases to catch regressions.",
    ],
    mistakes: [
      "Using logins as a proxy for adoption without feature usage context.",
      "Aggregating adoption across very different personas.",
    ],
    faqs: [
      {
        question: "What is a good adoption target-",
        answer:
          "Set targets per segment based on behaviors that predict retention or expansion, not a single global benchmark.",
      },
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "customer-health-score",
    title: "Customer Health Score",
    description:
      "A customer health score is a composite metric that estimates churn risk using product usage, support signals, and account context.",
    bullets: [
      "Build health scores from behaviors that predict churn in your cohorts (not opinions).",
      "Use scores to trigger interventions, then validate impact on retention.",
    ],
    mistakes: [
      "Using a health score that is not validated against churn outcomes.",
      "Changing score definitions without versioning, which breaks comparisons.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "expansion-rate",
    title: "Expansion Rate",
    description:
      "Expansion rate measures how much additional recurring revenue comes from existing customers (upgrades, add-ons, more seats) over a period.",
    bullets: [
      "Track expansion by cohort to separate durable expansion from one-off spikes.",
      "Use expansion rate with GRR to understand whether growth is leaky or durable.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "unit-economics-hub-guide"],
  },
  {
    slug: "downgrade-rate",
    title: "Downgrade Rate",
    description:
      "Downgrade rate measures how often customers reduce plan level, seats, or usage, which reduces recurring revenue even if logos remain.",
    example:
      "If 20 of 400 customers downgrade in a quarter, downgrade rate is 5%.",
    bullets: [
      "Track downgrades by segment; price-sensitive segments behave differently.",
      "Pair downgrade rate with product adoption to identify value gaps.",
      "Separate voluntary downgrades from contract-driven reductions.",
      "Track downgrade reasons to prioritize roadmap fixes.",
      "Compare downgrade timing to feature usage to find friction points.",
    ],
    mistakes: [
      "Treating downgrades as churn and double-counting losses.",
      "Ignoring downgrade-driven support or product issues.",
      "Mixing seat reductions with plan downgrades without labeling.",
    ],
    faqs: [
      {
        question: "How do downgrades affect GRR and NRR-",
        answer:
          "Downgrades reduce GRR because contraction is included. NRR can still look healthy if expansion offsets downgrades.",
      },
      {
        question: "Should downgrades be treated as churn-",
        answer:
          "No. Downgrades are contraction, not churn. Track them separately so you can diagnose product value gaps.",
      },
      {
        question: "How do we reduce downgrade rate-",
        answer:
          "Improve activation, expand value delivery, and adjust packaging so customers grow into higher tiers instead of downsizing.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "renewal-rate",
    title: "Renewal Rate",
    description:
      "Renewal rate is the % of contracts that renew at the end of term. It is a contract-based lens on retention for annual or multi-year deals.",
    example:
      "If 80 of 100 contracts renew at term end, renewal rate is 80%.",
    bullets: [
      "Track renewal rate by cohort start year and segment (deal size, industry).",
      "Renewal rate can differ from monthly churn because the timing is lumpy.",
      "Separate auto-renewals from manual renewals to spot risk.",
    ],
    mistakes: [
      "Using renewal rate without checking expansion or contraction.",
      "Counting early renewals in the wrong period.",
    ],
    faqs: [
      {
        question: "How is renewal rate different from GRR-",
        answer:
          "Renewal rate is contract-based at term end. GRR is revenue-based and includes downgrades and churn over the period.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "renewal-forecast",
    title: "Renewal Forecast",
    description:
      "A renewal forecast estimates how much recurring revenue will renew in a future period based on contract terms, churn risk, and expansion expectations.",
    example:
      "A $2M renewal pool with 90% probability yields a $1.8M base forecast before expansion.",
    bullets: [
      "Build forecasts from contract-level data (term end dates, price, usage).",
      "Separate renewal probability from expected expansion to avoid double counting.",
      "Track forecast accuracy by segment to improve weighting.",
      "Use risk tiers so leaders can see base, target, and downside views.",
    ],
    mistakes: [
      "Assuming all renewals happen on time without slippage.",
      "Double counting expansion in both renewal and upsell forecasts.",
      "Ignoring product usage signals that flag churn risk early.",
    ],
    faqs: [
      {
        question: "How often should renewal forecasts be updated-",
        answer:
          "Weekly for the next 90 days and monthly for longer horizons, especially if usage or risk signals change.",
      },
      {
        question: "Should renewals include expected price increases-",
        answer:
          "Only if pricing policy is consistent and communicated. Track price uplift separately to avoid hiding churn risk.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "customer-success",
    title: "Customer Success",
    description:
      "Customer success is the function focused on helping customers achieve outcomes so retention and expansion improve over time.",
    example:
      "A CS team runs onboarding, adoption reviews, and renewal planning to reduce churn.",
    bullets: [
      "Customer success should be measured by retention outcomes (GRR/NRR), not only activity metrics.",
      "Segment playbooks by customer type; one motion rarely fits all.",
      "Tie success milestones to product adoption and business outcomes.",
      "Use health scoring to prioritize proactive outreach.",
    ],
    mistakes: [
      "Measuring CS by activity volume without retention impact.",
      "Using the same playbook for SMB and enterprise accounts.",
      "Treating renewal work as a last-minute task instead of an ongoing plan.",
    ],
    faqs: [
      {
        question: "What is a good CS leading indicator-",
        answer:
          "Time-to-value and adoption depth are strong leading indicators for retention and expansion.",
      },
      {
        question: "How do we scale CS without ballooning headcount-",
        answer:
          "Standardize playbooks, automate health alerts, and segment accounts so high-touch effort focuses on the highest risk or highest value customers.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "unit-economics-hub-guide"],
  },
  {
    slug: "customer-success-cost",
    title: "Customer Success Cost",
    description:
      "Customer success cost is the cost of onboarding, support, and success motions required to retain and expand customers. It should be included in unit economics when material.",
    bullets: [
      "Include CS cost when evaluating contribution margin and payback.",
      "Track CS cost per account by segment; enterprise motions are heavier.",
      "Allocate shared CS costs consistently across segments and periods.",
      "Include tooling and enablement costs when they are material.",
    ],
    mistakes: [
      "Ignoring CS costs in LTV or payback calculations.",
      "Mixing support-only costs with success costs without clarity.",
    ],
    faqs: [
      {
        question: "How do I allocate CS costs across accounts-",
        answer:
          "Use time-based allocation or headcount ratios by segment, and keep the method consistent across reporting periods.",
      },
    ],
    relatedGuideSlugs: ["unit-economics-hub-guide", "unit-economics-dashboard-guide"],
  },
  {
    slug: "churn-reasons",
    title: "Churn Reasons",
    description:
      "Churn reasons are categorized explanations for why customers cancel or downgrade (for example missing features, price, onboarding failure).",
    bullets: [
      "Collect churn reasons consistently (structured options + free text).",
      "Validate with cohort behavior; stated reasons can differ from drivers.",
    ],
    mistakes: [
      "Using churn reasons without linking them to measurable retention changes.",
      "Letting categories drift and losing trendability.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "churn-prediction",
    title: "Churn Prediction",
    description:
      "Churn prediction estimates which customers are at risk of churn using behavior, adoption, and account signals. The goal is intervention that improves retention.",
    example:
      "If usage drops below a 7-day threshold and support tickets spike, the account is flagged for proactive outreach.",
    bullets: [
      "Start simple: usage drop-offs that predict churn in cohorts.",
      "Evaluate models by retention impact, not by accuracy alone.",
      "Prioritize explainable signals so CS teams know what to fix.",
      "Calibrate scores by segment; enterprise and SMB patterns differ.",
    ],
    mistakes: [
      "Training on data that includes post-churn signals (label leakage).",
      "Optimizing for AUC without measuring retention lift from interventions.",
      "Triggering outreach on noisy signals that create alert fatigue.",
    ],
    faqs: [
      {
        question: "What is a good churn prediction threshold-",
        answer:
          "Pick a threshold that your CS team can act on. It is better to start with fewer, higher-risk accounts and expand as playbooks prove impact.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "plg",
    title: "PLG (Product-led Growth)",
    description:
      "Product-led growth is a go-to-market approach where the product drives acquisition, activation, retention, and expansion through self-serve value.",
    bullets: [
      "PLG needs strong activation and short time-to-value to work.",
      "Use cohorts to ensure growth quality: PLG can hide churn if onboarding is weak.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "slg",
    title: "SLG (Sales-led Growth)",
    description:
      "Sales-led growth relies on a sales motion (SDR/AE) to acquire customers, often with higher ACV and longer sales cycles than pure PLG.",
    bullets: [
      "SLG is sensitive to pipeline health, win rate, and sales cycle length.",
      "Connect SLG to cash: longer cycles increase runway needs.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "hybrid-growth",
    title: "Hybrid Growth (PLG + Sales)",
    description:
      "Hybrid growth combines product-led acquisition with sales-assisted conversion for larger accounts or more complex use cases.",
    bullets: [
      "Define routing rules: when does a lead become sales-assisted-",
      "Measure by cohort to avoid over-crediting sales for self-serve conversions.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "product-market-fit",
    title: "Product-market Fit (PMF)",
    description:
      "Product-market fit means your product reliably solves a real problem for a defined segment, shown by strong retention and efficient growth.",
    example:
      "Retention curves flatten after month 3 for a core segment and expansion accelerates without heavy discounts.",
    bullets: [
      "Retention curves are one of the clearest quantitative PMF signals.",
      "PMF is segment-specific; measure by cohort and segment, not blended averages.",
      "Combine qualitative feedback with cohort retention to confirm fit.",
    ],
    mistakes: [
      "Treating revenue growth as proof of PMF without retention proof.",
      "Assuming PMF in one segment means PMF in all segments.",
    ],
    faqs: [
      {
        question: "What is the strongest PMF signal-",
        answer:
          "Consistent retention and expansion in a target segment. Surveys help, but usage and retention curves are stronger proof.",
      },
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "retention-cohort",
    title: "Retention Cohort",
    description:
      "A retention cohort groups customers by a shared start point (for example signup month) and tracks how many remain active or paying over time.",
    bullets: [
      "Use retention cohorts to see where churn happens (early vs late).",
      "Segment cohorts by channel and plan to find quality differences.",
      "Track retention by activation milestone to separate onboarding issues from long-term fit.",
      "Use the same definition of active (login, usage, payment) across cohorts.",
    ],
    mistakes: [
      "Mixing cohorts defined by different start events (signup vs first value).",
      "Using blended averages that hide weak cohorts.",
    ],
    faqs: [
      {
        question: "How long should I track a cohort-",
        answer:
          "At least one full renewal or churn cycle. For annual contracts, that often means 12 to 18 months.",
      },
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "cohort-month",
    title: "Cohort Month",
    description:
      "Cohort month is the month index of a cohort relative to its start (month 0, month 1, month 2...). It is used to align retention curves.",
    example:
      "A cohort that started in March is in cohort month 2 in May, even if the calendar month is different.",
    bullets: [
      "Use cohort month to compare curves across different start dates.",
      "Report both cohort month and calendar month to avoid confusion.",
      "Keep the same cohort definition (signup vs first value) across reports.",
    ],
    mistakes: [
      "Mixing cohorts defined by different start events.",
      "Comparing cohort month 1 in one report to calendar month 1 in another.",
    ],
    faqs: [
      {
        question: "Should cohort month be counted from signup or first value-",
        answer:
          "Use the start event that best represents activation for your product. The key is to keep the definition consistent across all reports.",
      },
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide"],
  },
  {
    slug: "cohort-age",
    title: "Cohort Age",
    description:
      "Cohort age is how long a cohort has existed since start. Older cohorts often behave differently than new cohorts due to mix and lifecycle effects.",
    example:
      "A cohort that started in January is at cohort age month 6 in June.",
    bullets: [
      "Use cohort age to interpret why churn and expansion change over time.",
      "Avoid comparing cohorts without accounting for product and pricing changes.",
      "Compare cohorts at the same age to avoid maturity bias.",
      "Track cohort age when forecasting retention or expansion benchmarks.",
    ],
    mistakes: [
      "Comparing cohorts with different ages as if they are equivalent.",
      "Ignoring major product changes that shift cohort behavior.",
      "Mixing calendar time with cohort time in the same chart.",
    ],
    faqs: [
      {
        question: "Why is cohort age more useful than calendar time-",
        answer:
          "Cohort age aligns customers by lifecycle stage, which makes retention and expansion patterns comparable even across different start dates.",
      },
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide"],
  },
  {
    slug: "cohort-maturity",
    title: "Cohort Maturity",
    description:
      "Cohort maturity describes whether a cohort has reached stable, longer-term retention behavior (often after early churn decays).",
    example:
      "A cohort becomes mature when monthly retention stabilizes after early churn drops.",
    bullets: [
      "Do not forecast long-term LTV from immature cohorts without a decay model.",
      "Use two-stage retention curves when early churn differs from steady-state churn.",
      "Compare mature cohorts to see true product-market fit improvements.",
    ],
    mistakes: [
      "Projecting long-term LTV from only the first few months of data.",
      "Comparing cohorts at different maturity levels as if they are equal.",
    ],
    faqs: [
      {
        question: "When is a cohort considered mature-",
        answer:
          "When retention or churn rates stabilize and early decay has largely passed. The timing varies by product and contract length.",
      },
    ],
    relatedGuideSlugs: ["two-stage-retention-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "usage-based-pricing",
    title: "Usage-based Pricing",
    description:
      "Usage-based pricing charges customers based on consumption (for example API calls, GB processed). It can align price with value but can increase revenue variability.",
    bullets: [
      "Use clear value metrics and predictability guardrails (caps, tiers).",
      "Track retention and expansion by cohort; bill shock can increase churn.",
    ],
    relatedGuideSlugs: ["pricing-packaging-guardrails-guide", "unit-economics-hub-guide"],
  },
  {
    slug: "seat-based-pricing",
    title: "Seat-based Pricing",
    description:
      "Seat-based pricing charges per user/seat. It is easy to understand and can drive expansion as teams grow, but it can create usage friction if pricing feels punitive.",
    bullets: [
      "Define what counts as a billable seat and enforce it consistently.",
      "Watch adoption and churn around pricing thresholds.",
    ],
    relatedGuideSlugs: ["pricing-packaging-guardrails-guide", "unit-economics-hub-guide"],
  },
  {
    slug: "annual-prepay",
    title: "Annual Prepay",
    description:
      "Annual prepay is when customers pay upfront for a year of service. It improves cash flow but changes billing and deferred revenue dynamics.",
    example:
      "A customer prepays $12,000 for a 12-month plan, providing cash today while revenue is recognized monthly.",
    bullets: [
      "Annual prepay can extend runway, but discounting too much can harm LTV:CAC.",
      "Measure retention impact; some segments churn at renewal if value is weak.",
      "Separate prepaid ARR from monthly billing to keep cohorts comparable.",
    ],
    mistakes: [
      "Treating prepaid cash as recurring revenue in performance dashboards.",
      "Offering deep discounts that attract low-retention customers.",
    ],
    faqs: [
      {
        question: "Does annual prepay improve unit economics-",
        answer:
          "It can improve cash flow and payback, but it does not fix weak retention. Measure renewal rates and expansion separately.",
      },
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator", "deferred-revenue-rollforward-calculator"],
  },
  {
    slug: "freemium",
    title: "Freemium",
    description:
      "Freemium is a pricing model where a free tier drives acquisition and a subset of users converts to paid via upgrades or usage limits.",
    bullets: [
      "Freemium works best when time-to-value is short and value is obvious.",
      "Track activation and free-to-paid conversion by cohort to avoid vanity signups.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "trial-length",
    title: "Trial Length",
    description:
      "Trial length is how long a trial user can evaluate your product before needing to convert to paid. It affects conversion and sales cycle dynamics.",
    example:
      "A 14-day trial may work for simple products, while a 30-day trial fits complex workflows.",
    bullets: [
      "Shorter trials can increase urgency but may reduce activation for complex products.",
      "Choose length based on time-to-value and onboarding complexity.",
      "Use in-product milestones to extend trials only when value is demonstrated.",
    ],
    mistakes: [
      "Using one trial length across segments with very different time-to-value.",
      "Extending trials without tracking activation, which can lower urgency.",
    ],
    faqs: [
      {
        question: "Should we extend trials when users ask-",
        answer:
          "Offer extensions when the user is actively onboarding and close to value. Avoid blanket extensions that train users to delay conversion.",
      },
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide"],
  },
  {
    slug: "activation-funnel",
    title: "Activation Funnel",
    description:
      "An activation funnel breaks down the steps from signup to the first meaningful outcome (for example connect data -> first report -> invite teammate).",
    example:
      "Signup -> connect data -> create first dashboard -> invite teammate.",
    bullets: [
      "Use funnel steps that correlate with retention, not vanity actions.",
      "Measure step conversion by cohort to see onboarding improvements over time.",
      "Track time between steps to find the real friction point.",
      "Instrument the funnel end-to-end before making changes to avoid measurement gaps.",
    ],
    mistakes: [
      "Using too many steps and losing signal clarity.",
      "Changing funnel definitions without re-baselining trends.",
      "Counting activation on the same day as signup without validating value.",
    ],
    faqs: [
      {
        question: "How many steps should an activation funnel have-",
        answer:
          "Use the smallest number of steps that still explain drop-offs clearly. Too many steps dilute the signal.",
      },
      {
        question: "Should activation be defined by product usage or outcomes-",
        answer:
          "Use outcomes when possible. Usage events should be chosen only if they strongly predict retention or expansion.",
      },
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "feature-activation",
    title: "Feature Activation",
    description:
      "Feature activation is when a customer successfully uses a key feature for the first time. It is often a leading indicator for adoption and retention.",
    example:
      "A user connects a data source and generates their first report within 7 days.",
    bullets: [
      "Define activation per feature with clear eligibility and time windows.",
      "Validate that activation predicts retention using cohort analysis.",
      "Track activation depth (first use) and repeat usage (habit formation).",
      "Instrument activation events consistently across platforms and devices.",
      "Pair activation rate with time-to-activation to spot friction.",
    ],
    mistakes: [
      "Using one generic activation event for very different features.",
      "Counting low-intent actions as activation.",
      "Skipping activation measurement for advanced features that drive expansion.",
      "Changing activation definitions without re-baselining cohorts.",
      "Optimizing activation without checking downstream retention impact.",
    ],
    faqs: [
      {
        question: "Should activation be measured per user or per account-",
        answer:
          "Use the unit that matches how value is realized. In B2B, account-level activation is often more meaningful.",
      },
      {
        question: "How long should the activation window be-",
        answer:
          "Use a window that matches time-to-value for the feature. Complex features may need longer than simple onboarding steps.",
      },
      {
        question: "What if activation is a multi-step workflow-",
        answer:
          "Define the smallest completed workflow that signals real value, then measure completion rate and time-to-complete.",
      },
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide"],
  },
  {
    slug: "expansion-playbook",
    title: "Expansion Playbook",
    description:
      "An expansion playbook is a repeatable process to drive upgrades, add-ons, and renewals based on usage signals and customer goals.",
    bullets: [
      "Trigger outreach on leading indicators (adoption depth, seats approaching limits).",
      "Measure expansion by cohort and segment to ensure durability.",
      "Align expansion offers with verified outcomes to avoid discount-driven churn.",
      "Document timing, owners, and success criteria for each playbook step.",
    ],
    mistakes: [
      "Launching expansion outreach before activation milestones are met.",
      "Using the same playbook for SMB and enterprise accounts.",
    ],
    faqs: [
      {
        question: "When should expansion outreach start-",
        answer:
          "After a clear adoption milestone is reached and value is demonstrated. Premature outreach often increases churn risk.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "sales-efficiency",
    title: "Sales Efficiency",
    description:
      "Sales efficiency compares net new revenue to sales and marketing spend over a period. It shows how effectively spend converts into growth.",
    updatedAt: "2026-01-28",
    formula: "Sales efficiency = net new ARR (or MRR) / sales and marketing spend",
    example: "If net new ARR is $1.2M and S&M spend is $1M, efficiency is 1.2x.",
    bullets: [
      "Use consistent windows (for example, quarter vs quarter) to avoid timing distortions.",
      "Pair with payback period to see both speed and magnitude of returns.",
    ],
    mistakes: [
      "Mixing booking metrics with recognized revenue in the numerator.",
      "Ignoring expansion vs new logos when interpreting efficiency.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "logo-retention-rate",
    title: "Logo Retention Rate",
    description:
      "Logo retention rate is the share of customers retained over a period, excluding expansion or contraction in revenue.",
    updatedAt: "2026-01-28",
    formula: "Logo retention = (starting customers - churned customers) / starting customers",
    example: "Start with 200 customers, lose 15: logo retention is 185 / 200 = 92.5%.",
    bullets: [
      "Use alongside revenue retention to separate customer count vs revenue effects.",
      "Segment by plan or cohort to find churn drivers.",
    ],
    mistakes: [
      "Including new customers in the numerator (it should be based on starting customers).",
      "Using logo retention to judge expansion-led businesses without context.",
    ],
    relatedGuideSlugs: ["retention-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "gross-adds",
    title: "Gross Adds",
    description:
      "Gross adds is the number of new customers (or new MRR/ARR) added in a period before accounting for churn.",
    updatedAt: "2026-01-28",
    formula: "Gross adds = new customers acquired in the period",
    example: "If you sign 120 new customers in a month, gross adds is 120.",
    bullets: [
      "Track gross adds with churn to understand net growth drivers.",
      "Use a consistent definition for what counts as a new customer.",
    ],
    mistakes: [
      "Counting reactivations as new adds without disclosing it.",
      "Comparing gross adds across periods with different marketing intensity.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "churn-guide"],
  },
  {
    slug: "expansion-bookings",
    title: "Expansion Bookings",
    description:
      "Expansion bookings are new contracted revenue from existing customers (upsells, seat expansion, upgrades) in a period.",
    updatedAt: "2026-01-28",
    formula: "Expansion bookings = bookings from existing customers",
    example: "If 30 customers upgrade and add $150k ARR, expansion bookings are $150k.",
    bullets: [
      "Separate expansion from new bookings to see growth mix.",
      "Use consistent contract terms so expansion is comparable over time.",
    ],
    mistakes: [
      "Blending expansion with new logos and losing visibility into retention health.",
      "Counting renewals as expansion when price or scope is unchanged.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "sales-capacity",
    title: "Sales Capacity",
    description:
      "Sales capacity is the amount of pipeline or revenue a sales team can realistically handle given headcount, ramp, and quota.",
    updatedAt: "2026-01-28",
    formula: "Sales capacity ~= active reps * quota * attainment rate",
    example: "10 reps with $600k quota and 70% attainment implies $4.2M capacity.",
    bullets: [
      "Adjust for ramping reps; new reps contribute less initially.",
      "Use capacity to set pipeline targets and hiring plans.",
    ],
    mistakes: [
      "Assuming 100% quota attainment across all reps.",
      "Ignoring time to productivity for new hires.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "ramp-time",
    title: "Ramp Time",
    description:
      "Ramp time is the time it takes a new rep to reach full productivity or a target quota level.",
    updatedAt: "2026-01-28",
    formula: "Ramp time = months to reach target productivity",
    example: "If reps hit 80% quota by month 6, ramp time is about 6 months.",
    bullets: [
      "Use ramp curves, not single averages, for hiring plans.",
      "Shorter ramp time improves CAC payback and growth velocity.",
      "Track ramp by role and region to avoid misleading averages.",
      "Validate ramp with cohort data after comp plan or product changes.",
    ],
    mistakes: [
      "Using peak performance as the ramp benchmark.",
      "Ignoring enablement and lead flow constraints.",
      "Using ramp assumptions that do not reflect turnover.",
      "Applying one ramp assumption across very different segments.",
    ],
    faqs: [
      {
        question: "How should I model partial ramp months-",
        answer:
          "Use a ramp curve (for example 25%, 50%, 75%, 100%) rather than a binary on/off assumption.",
      },
      {
        question: "What data should I use to update ramp time-",
        answer:
          "Use recent cohorts of new reps by segment and role, and exclude outliers caused by temporary pipeline spikes or droughts.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "sales-quota-coverage",
    title: "Sales Quota Coverage",
    description:
      "Sales quota coverage compares pipeline to quota for a period to estimate whether enough pipeline exists to hit targets.",
    updatedAt: "2026-01-28",
    formula: "Quota coverage = pipeline / quota",
    example: "If pipeline is $3M and quota is $1M, coverage is 3.0x.",
    bullets: [
      "Target coverage varies by win rate; lower win rates need higher coverage.",
      "Measure coverage by segment because win rates differ.",
    ],
    mistakes: [
      "Using unqualified pipeline to inflate coverage.",
      "Comparing coverage across teams with different stage definitions.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "win-loss-analysis",
    title: "Win-Loss Analysis",
    description:
      "Win-loss analysis reviews why deals were won or lost to improve messaging, qualification, and competitive strategy.",
    updatedAt: "2026-01-28",
    example:
      "After each quarter, review 20 wins and 20 losses using a consistent reason taxonomy.",
    bullets: [
      "Classify wins/losses by competitor, reason, and segment.",
      "Close the loop with product and marketing teams using the findings.",
      "Track changes in win-loss reasons after pricing or product updates.",
      "Use a neutral interviewer to reduce bias in responses.",
    ],
    mistakes: [
      "Collecting anecdotes without a consistent taxonomy.",
      "Skipping post-mortems on late-stage losses.",
      "Letting sales reps self-report without third-party validation.",
      "Ignoring churned customers in win-loss research.",
    ],
    faqs: [
      {
        question: "How many deals should we review-",
        answer:
          "Start with a representative sample each quarter. If deal volume is low, review all material wins and losses.",
      },
      {
        question: "How should we capture reasons consistently-",
        answer:
          "Use a fixed taxonomy with optional free text so trends remain comparable over time.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "lead-response-time",
    title: "Lead Response Time",
    description:
      "Lead response time measures how long it takes to contact a new inbound lead after it is created.",
    updatedAt: "2026-01-28",
    formula: "Lead response time = time of first response - lead creation time",
    example: "A lead created at 10:00 and first contacted at 10:30 has a 30-minute response time.",
    bullets: [
      "Faster response times usually increase conversion rates.",
      "Track by channel; paid leads often decay faster than referrals.",
    ],
    mistakes: [
      "Measuring only business hours when leads arrive 24/7.",
      "Counting automated emails as true responses without qualification.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "pipeline-hygiene",
    title: "Pipeline Hygiene",
    description:
      "Pipeline hygiene is the quality and accuracy of pipeline data, including stage updates, close dates, and qualification criteria.",
    updatedAt: "2026-01-28",
    bullets: [
      "Clean pipeline improves forecast accuracy and capacity planning.",
      "Enforce stage exit criteria and stale deal cleanup policies.",
    ],
    mistakes: [
      "Letting deals sit without activity and inflating pipeline size.",
      "Allowing inconsistent stage definitions across teams.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "sales-pipeline-coverage",
    title: "Sales Pipeline Coverage",
    description:
      "Sales pipeline coverage compares pipeline value to quota or revenue targets to gauge whether enough pipeline exists to hit goals.",
    updatedAt: "2026-01-28",
    formula: "Pipeline coverage = qualified pipeline / quota",
    example: "If pipeline is $4M and quota is $1M, coverage is 4.0x.",
    bullets: [
      "Coverage targets vary by win rate and sales cycle length.",
      "Measure coverage by segment for accuracy.",
      "Add a slippage buffer if close dates often push out.",
    ],
    mistakes: [
      "Counting unqualified deals to inflate coverage.",
      "Using stale close dates that hide slippage.",
      "Comparing coverage across teams with different stage definitions.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "sales-cycle-length",
    title: "Sales Cycle Duration",
    description:
      "Sales cycle length is the average time from first touch to closed-won. It affects cash timing and pipeline planning.",
    updatedAt: "2026-01-28",
    formula: "Sales cycle length = average days from lead to close",
    example: "If average time to close is 62 days, cycle length is 62 days.",
    bullets: [
      "Track by segment and deal size for more accurate planning.",
      "Shortening the cycle improves cash flow and forecast reliability.",
    ],
    mistakes: [
      "Mixing inbound and outbound cycles without segmentation.",
      "Ignoring stalled deals that inflate averages.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "quota-carrying-reps",
    title: "Quota-carrying Reps",
    description:
      "Quota-carrying reps are salespeople with assigned revenue targets. They are the core capacity unit for forecasting.",
    updatedAt: "2026-01-28",
    example:
      "If you have 8 fully ramped AEs with $500k quarterly quotas, total capacity is about $4M.",
    bullets: [
      "Count only fully ramped reps when modeling near-term capacity.",
      "Track attainment distribution, not just averages.",
      "Separate new-hire ramp cohorts from tenured reps in forecasts.",
      "Use quota-carrying headcount to size pipeline coverage targets.",
    ],
    mistakes: [
      "Including SDRs or non-quota roles in capacity models.",
      "Assuming 100% attainment across all reps.",
      "Ignoring ramp time when hiring to close a coverage gap.",
      "Mixing part-time and full-time reps without adjusting capacity.",
    ],
    faqs: [
      {
        question: "Should ramping reps count toward quota capacity-",
        answer:
          "Only partially. Use a ramp curve (for example 25%, 50%, 75%) to avoid over-forecasting near-term bookings.",
      },
      {
        question: "How should quota be set across rep tiers-",
        answer:
          "Align quota to historical attainment by segment and role. A single quota across very different territories creates noise.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "pipeline-review",
    title: "Pipeline Review",
    description:
      "A pipeline review is a structured inspection of active deals, stages, and close dates to improve forecast accuracy.",
    updatedAt: "2026-01-28",
    bullets: [
      "Focus on stage exit criteria and next steps per deal.",
      "Flag stalled deals and reset close dates quickly.",
    ],
    mistakes: [
      "Turning reviews into status meetings instead of decision checkpoints.",
      "Letting deals linger without clear next actions.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "deal-age",
    title: "Deal Age",
    description:
      "Deal age is how long a deal has been in pipeline since creation. It helps identify stalls and slippage risk.",
    updatedAt: "2026-01-28",
    formula: "Deal age = today - opportunity created date",
    example: "A deal created 45 days ago has a deal age of 45 days.",
    bullets: [
      "Compare deal age to average sales cycle by segment.",
      "Use age thresholds to trigger cleanup or requalification.",
    ],
    mistakes: [
      "Ignoring stage-level age, which can be more diagnostic.",
      "Resetting close dates without resolving blockers.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "sales-stage-velocity",
    title: "Sales Stage Velocity",
    description:
      "Sales stage velocity measures how quickly opportunities move through each pipeline stage.",
    updatedAt: "2026-01-28",
    formula: "Stage velocity = deals moving stages / time in stage",
    example: "If 20 deals exit a stage in a week, velocity is 20 per week.",
    bullets: [
      "Low velocity usually signals stage friction or weak qualification.",
      "Use velocity to prioritize enablement and process fixes.",
      "Track velocity by segment and rep to spot coaching opportunities.",
      "Review velocity after pricing or process changes to confirm impact.",
      "Use p50 and p75 stage duration alongside velocity for clarity.",
    ],
    mistakes: [
      "Comparing velocity across stages with different definitions.",
      "Ignoring seasonality that affects buyer behavior.",
      "Measuring velocity without excluding stalled or recycled deals.",
      "Relying on averages instead of p50/p75 by stage.",
    ],
    faqs: [
      {
        question: "What is a good stage velocity-",
        answer:
          "There is no universal benchmark. Use historical medians by segment and focus on improving the slowest stages first.",
      },
      {
        question: "Should velocity be measured by count or value-",
        answer:
          "Count-based velocity shows process speed; value-based velocity shows how fast revenue is moving. Use both if you can.",
      },
      {
        question: "How do we improve stage velocity safely-",
        answer:
          "Tighten qualification, provide sales enablement, and remove internal approval bottlenecks before pushing reps to move faster.",
      },
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "account-expansion-rate",
    title: "Account Expansion Rate",
    description:
      "Account expansion rate measures how many existing accounts expand (upgrade, add seats) over a period.",
    updatedAt: "2026-01-28",
    formula: "Expansion rate = expanding accounts / total active accounts",
    example: "If 40 of 200 accounts expand, the rate is 20%.",
    bullets: [
      "Segment by plan or cohort to find expansion levers.",
      "Pair with expansion revenue to measure depth and breadth.",
    ],
    mistakes: [
      "Counting renewals without any increase as expansion.",
      "Blending expansion with new logos in reporting.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "customer-advocacy",
    title: "Customer Advocacy",
    description:
      "Customer advocacy reflects how willing customers are to recommend, review, or co-market with you.",
    updatedAt: "2026-01-28",
    example:
      "A customer agrees to a case study, leaves a public review, and refers two peers in a quarter.",
    bullets: [
      "Track advocacy signals like referrals, reviews, and case study participation.",
      "Advocacy is a leading indicator for expansion and retention.",
      "Build structured advocacy asks into renewal or success milestones.",
      "Reward advocacy with visibility, not just discounts, to avoid incentives bias.",
      "Measure advocacy by segment to identify the happiest customer profiles.",
    ],
    mistakes: [
      "Using NPS alone without tracking actual advocacy actions.",
      "Ignoring advocacy drop-offs after product changes.",
      "Over-asking the same advocates and burning goodwill.",
      "Treating advocacy as a one-time campaign instead of a program.",
    ],
    faqs: [
      {
        question: "How do we measure advocacy beyond NPS-",
        answer:
          "Track concrete actions such as reviews posted, referrals sent, co-marketing participation, and willingness to join reference calls.",
      },
      {
        question: "When should we ask for advocacy-",
        answer:
          "After a documented success milestone, not immediately after signup. Timing matters for quality and response rate.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "csm-to-account-ratio",
    title: "CSM to Account Ratio",
    description:
      "CSM to account ratio measures how many customer accounts each customer success manager supports.",
    updatedAt: "2026-01-28",
    formula: "CSM to account ratio = number of accounts / number of CSMs",
    example: "200 accounts supported by 5 CSMs yields a 40:1 ratio.",
    bullets: [
      "Set different ratios for high-touch vs tech-touch segments.",
      "Watch churn and expansion as leading indicators of overload.",
    ],
    mistakes: [
      "Using one ratio across very different customer tiers.",
      "Ignoring time spent on onboarding and renewals.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "renewal-playbook",
    title: "Renewal Playbook",
    description:
      "A renewal playbook is a repeatable process for driving on-time renewals and expansion, including health scoring and executive alignment.",
    updatedAt: "2026-01-28",
    example:
      "Start renewal outreach 120 days before term end with usage review, ROI recap, and expansion options.",
    bullets: [
      "Start renewal motions early based on contract terms and usage health.",
      "Use multi-threaded relationships to reduce single-point risk.",
      "Align legal, finance, and CS timelines so paperwork does not delay renewal.",
    ],
    mistakes: [
      "Waiting until 30 days before renewal to engage.",
      "Treating renewals as a procurement event instead of a value review.",
      "Relying on a single champion without executive coverage.",
    ],
    faqs: [
      {
        question: "When should renewal outreach start-",
        answer:
          "Start early enough to run a value review and address risk. Many teams begin 90-120 days before term end for annual contracts.",
      },
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
];

export const termsSaasExtra: GlossaryTerm[] = seeds.map(make);
