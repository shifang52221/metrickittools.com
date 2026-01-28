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
    bullets: [
      "Use stage conversion to find bottlenecks in your funnel.",
      "Keep stage definitions stable; otherwise trends become meaningless.",
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
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "forecast-accuracy",
    title: "Forecast Accuracy",
    description:
      "Forecast accuracy measures how close your forecast was to the actual outcome (bookings/revenue) for a period.",
    bullets: [
      "Track accuracy by segment and by stage source to identify systemic bias.",
      "Use accuracy to improve process, not to punish teams (or you get sandbagging).",
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
    bullets: [
      "Use ASP with win rate to understand whether growth comes from bigger deals or more deals.",
      "Segment ASP by plan and customer size to avoid mix-shift confusion.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide"],
  },
  {
    slug: "sales-accepted-lead",
    title: "SAL (Sales-accepted Lead)",
    description:
      "A sales-accepted lead (SAL) is a lead that sales agrees is worth working, often a checkpoint between MQL and SQL.",
    bullets: [
      "Use SAL to align marketing and sales on quality expectations.",
      "Track SAL rate by channel to identify high-quality lead sources.",
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
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "sales-qualified-pipeline",
    title: "Sales-qualified Pipeline",
    description:
      "Sales-qualified pipeline is the subset of pipeline that meets agreed qualification criteria, making it more predictive than raw pipeline.",
    bullets: [
      "Use qualified pipeline for coverage planning (it is harder to game).",
      "Keep qualification rules consistent or you will break trends.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "opportunity-win-rate",
    title: "Opportunity Win Rate",
    description:
      "Opportunity win rate is the fraction of opportunities that become closed-won. It should be measured with a clear stage definition.",
    formula: "Opportunity win rate = closed-won / opportunities (same definition)",
    bullets: [
      "Track by segment and deal size; blended win rate hides problems.",
      "Use win rate with sales cycle length to estimate required pipeline.",
    ],
    relatedGuideSlugs: ["pipeline-coverage-sales-cycle-guide"],
  },
  {
    slug: "sales-cycle-variance",
    title: "Sales Cycle Variance",
    description:
      "Sales cycle variance describes how spread out your time-to-close is (some deals close fast, others stall). High variance makes forecasting harder.",
    bullets: [
      "Track median and percentile cycle lengths (p50/p75/p90), not just averages.",
      "Use variance to identify deal types that consistently slip.",
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
    bullets: [
      "Use it as an early leading indicator for activation and retention.",
      "Measure completion time as well as completion rate (speed matters).",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide"],
  },
  {
    slug: "product-adoption",
    title: "Product Adoption",
    description:
      "Product adoption measures how deeply and broadly customers use your product (features, frequency, breadth of teams). It is a driver of retention and expansion.",
    bullets: [
      "Track adoption by cohort and by segment; blended adoption hides weak cohorts.",
      "Tie adoption metrics to retention outcomes to avoid vanity usage metrics.",
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
    bullets: [
      "Track downgrades by segment; price-sensitive segments behave differently.",
      "Pair downgrade rate with product adoption to identify value gaps.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "renewal-rate",
    title: "Renewal Rate",
    description:
      "Renewal rate is the % of contracts that renew at the end of term. It is a contract-based lens on retention for annual or multi-year deals.",
    bullets: [
      "Track renewal rate by cohort start year and segment (deal size, industry).",
      "Renewal rate can differ from monthly churn because the timing is lumpy.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide"],
  },
  {
    slug: "renewal-forecast",
    title: "Renewal Forecast",
    description:
      "A renewal forecast estimates how much recurring revenue will renew in a future period based on contract terms, churn risk, and expansion expectations.",
    bullets: [
      "Build forecasts from contract-level data (term end dates, price, usage).",
      "Separate renewal probability from expected expansion to avoid double counting.",
    ],
    relatedGuideSlugs: ["sales-ops-hub-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "customer-success",
    title: "Customer Success",
    description:
      "Customer success is the function focused on helping customers achieve outcomes so retention and expansion improve over time.",
    bullets: [
      "Customer success should be measured by retention outcomes (GRR/NRR), not only activity metrics.",
      "Segment playbooks by customer type; one motion rarely fits all.",
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
    bullets: [
      "Start simple: usage drop-offs that predict churn in cohorts.",
      "Evaluate models by retention impact, not by accuracy alone.",
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
      "Define routing rules: when does a lead become sales-assisted?",
      "Measure by cohort to avoid over-crediting sales for self-serve conversions.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "sales-ops-hub-guide"],
  },
  {
    slug: "product-market-fit",
    title: "Product-market Fit (PMF)",
    description:
      "Product-market fit means your product reliably solves a real problem for a defined segment, shown by strong retention and efficient growth.",
    bullets: [
      "Retention curves are one of the clearest quantitative PMF signals.",
      "PMF is segment-specific; measure by cohort and segment, not blended averages.",
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
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide", "retention-churn-hub-guide"],
  },
  {
    slug: "cohort-month",
    title: "Cohort Month",
    description:
      "Cohort month is the month index of a cohort relative to its start (month 0, month 1, month 2...). It is used to align retention curves.",
    bullets: [
      "Use cohort month to compare curves across different start dates.",
      "Report both cohort month and calendar month to avoid confusion.",
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide"],
  },
  {
    slug: "cohort-age",
    title: "Cohort Age",
    description:
      "Cohort age is how long a cohort has existed since start. Older cohorts often behave differently than new cohorts due to mix and lifecycle effects.",
    bullets: [
      "Use cohort age to interpret why churn and expansion change over time.",
      "Avoid comparing cohorts without accounting for product and pricing changes.",
    ],
    relatedGuideSlugs: ["cohort-analysis-playbook-guide"],
  },
  {
    slug: "cohort-maturity",
    title: "Cohort Maturity",
    description:
      "Cohort maturity describes whether a cohort has reached stable, longer-term retention behavior (often after early churn decays).",
    bullets: [
      "Do not forecast long-term LTV from immature cohorts without a decay model.",
      "Use two-stage retention curves when early churn differs from steady-state churn.",
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
    bullets: [
      "Annual prepay can extend runway, but discounting too much can harm LTV:CAC.",
      "Measure retention impact; some segments churn at renewal if value is weak.",
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
    bullets: [
      "Shorter trials can increase urgency but may reduce activation for complex products.",
      "Choose length based on time-to-value and onboarding complexity.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide"],
  },
  {
    slug: "activation-funnel",
    title: "Activation Funnel",
    description:
      "An activation funnel breaks down the steps from signup to the first meaningful outcome (for example connect data -> first report -> invite teammate).",
    bullets: [
      "Use funnel steps that correlate with retention, not vanity actions.",
      "Measure step conversion by cohort to see onboarding improvements over time.",
    ],
    relatedGuideSlugs: ["plg-metrics-hub-guide", "cohort-analysis-playbook-guide"],
  },
  {
    slug: "feature-activation",
    title: "Feature Activation",
    description:
      "Feature activation is when a customer successfully uses a key feature for the first time. It is often a leading indicator for adoption and retention.",
    bullets: [
      "Define activation per feature with clear eligibility and time windows.",
      "Validate that activation predicts retention using cohort analysis.",
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
    ],
    mistakes: [
      "Using peak performance as the ramp benchmark.",
      "Ignoring enablement and lead flow constraints.",
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
    bullets: [
      "Classify wins/losses by competitor, reason, and segment.",
      "Close the loop with product and marketing teams using the findings.",
    ],
    mistakes: [
      "Collecting anecdotes without a consistent taxonomy.",
      "Skipping post-mortems on late-stage losses.",
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
];

export const termsSaasExtra: GlossaryTerm[] = seeds.map(make);
