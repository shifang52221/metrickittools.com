import type { GlossaryCategorySlug, GlossarySection, GlossaryTerm } from "../types";

type Seed = {
  slug: string;
  title: string;
  description: string;
  category?: GlossaryCategorySlug;
  formula?: string;
  example?: string;
  bullets?: string[];
  mistakes?: string[];
  relatedGuideSlugs?: string[];
  relatedCalculatorSlugs?: string[];
};

function buildSections(seed: Seed): GlossarySection[] {
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

function makeTerm(seed: Seed): GlossaryTerm {
  return {
    slug: seed.slug,
    title: seed.title,
    description: seed.description,
    category: seed.category ?? "saas-metrics",
    updatedAt: "2026-01-23",
    sections: buildSections(seed),
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "arpa",
    title: "ARPA (Average Revenue Per Account)",
    description:
      "ARPA measures average revenue per paying account/customer in a period. In B2B SaaS, ARPA often matches pricing better than ARPU.",
    formula: "ARPA = revenue ÷ average paying accounts",
    bullets: [
      "Use ARPA when you bill per company account (not per seat).",
      "Segment ARPA by plan, industry, and channel to understand monetization.",
      "Pair ARPA with CAC payback and LTV for unit economics.",
    ],
    relatedGuideSlugs: ["arpu-guide", "cac-payback-guide"],
    relatedCalculatorSlugs: ["arpu-calculator", "cac-payback-period-calculator"],
  },
  {
    slug: "arr-vs-bookings",
    title: "Bookings vs ARR",
    description:
      "Bookings are contracted value closed in a period; ARR is a recurring run-rate snapshot (MRR × 12). They answer different questions.",
    bullets: [
      "Use bookings to evaluate sales performance and contracted demand.",
      "Use ARR to compare recurring scale and momentum over time.",
      "If you sell annual prepay, bookings and cash can spike while ARR moves more steadily.",
    ],
    mistakes: [
      "Treating bookings as recurring run-rate.",
      "Comparing bookings to ARR without excluding one-time services and setup fees.",
      "Ignoring term length and billing timing when comparing periods.",
    ],
    relatedGuideSlugs: ["arr-guide"],
  },
  {
    slug: "acv",
    title: "ACV (Annual Contract Value)",
    description:
      "ACV is the annualized value of a contract. Teams use ACV to compare deal size across different contract lengths.",
    formula: "ACV = total recurring contract value ÷ contract years",
    mistakes: [
      "Including one-time services fees in ACV and treating it as recurring.",
      "Comparing ACV across segments with different discount policies without context.",
    ],
  },
  {
    slug: "tcv",
    title: "TCV (Total Contract Value)",
    description:
      "TCV is the total signed contract value over the full term (often includes recurring plus one-time items depending on your definition).",
    bullets: [
      "Use TCV to understand total signed value and contract scope.",
      "Use ACV/ARR to understand recurring run-rate.",
    ],
    mistakes: [
      "Comparing TCV to ARR/MRR without normalizing for contract length.",
      "Treating services-heavy contracts as recurring run-rate.",
    ],
  },
  {
    slug: "net-new-mrr",
    title: "Net New MRR",
    description:
      "Net new MRR is the change in MRR in a period after expansions, contractions, and churn. It combines growth and retention movements.",
    formula:
      "Net new MRR = new MRR + expansion MRR − contraction MRR − churned MRR",
    bullets: [
      "Track net new MRR by segment to find durable growth sources.",
      "Pair with churn/retention to diagnose whether growth is leaky.",
      "Use consistent definitions across months for clean trend analysis.",
    ],
  },
  {
    slug: "new-mrr",
    title: "New MRR",
    description:
      "New MRR is recurring revenue added from brand-new customers in a period (excluding expansions from existing customers).",
    bullets: [
      "Use New MRR to measure new customer acquisition output.",
      "Segment by channel and plan to learn where new customers stick.",
    ],
  },
  {
    slug: "expansion-mrr",
    title: "Expansion MRR",
    description:
      "Expansion MRR is added recurring revenue from existing customers (upsells, upgrades, seat growth, add-ons). It drives high NRR.",
    bullets: [
      "Track expansion MRR by cohort and segment to find repeatable expansion.",
      "Separate expansion from reactivations and price increases for clean reporting.",
    ],
  },
  {
    slug: "contraction-mrr",
    title: "Contraction MRR",
    description:
      "Contraction MRR is the reduction in recurring revenue from existing customers due to downgrades or reduced usage/seats (not full churn).",
    bullets: [
      "Track contraction separately from churn to understand product value vs cancellations.",
      "Segment contraction by plan and lifecycle stage to locate downgrade drivers.",
    ],
  },
  {
    slug: "churned-mrr",
    title: "Churned MRR",
    description:
      "Churned MRR is recurring revenue lost from customers who cancel in a period. It is a key component of net new MRR and revenue retention.",
    bullets: [
      "Use churned MRR to quantify revenue leakage from cancellations.",
      "Pair churned MRR with logo churn to understand whether losses come from big or small customers.",
    ],
  },
  {
    slug: "logo-churn",
    title: "Logo Churn",
    description:
      "Logo churn is customer churn measured in count (accounts lost), not dollars. It can be high even when NRR is strong.",
    formula: "Logo churn = customers lost ÷ customers at start of period",
    mistakes: [
      "Looking only at blended logo churn (hides segment differences).",
      "Assuming strong NRR means churn is fine (expansion can mask losses).",
    ],
  },
  {
    slug: "revenue-churn",
    title: "Revenue Churn",
    description:
      "Revenue churn measures how much recurring revenue you lose (MRR dollars) over a period. It differs from logo churn.",
    bullets: [
      "Track revenue churn when customer sizes vary a lot.",
      "Use GRR to measure churn + downgrades without expansion.",
    ],
  },
  {
    slug: "nrr",
    title: "NRR (Net Revenue Retention)",
    description:
      "NRR measures how revenue from an existing cohort changes over time, including expansion and contraction.",
    formula:
      "NRR = (starting MRR + expansion − contraction − churn) ÷ starting MRR",
    bullets: [
      "NRR > 100% means the cohort grows without new customers.",
      "Track NRR by segment (plan, size) to avoid blended averages.",
    ],
  },
  {
    slug: "grr",
    title: "GRR (Gross Revenue Retention)",
    description:
      "GRR measures how much of a cohort's starting revenue remains after churn and downgrades, excluding expansion.",
    formula: "GRR = (starting MRR − contraction − churn) ÷ starting MRR",
    bullets: [
      "GRR isolates durability (product stickiness) from expansion.",
      "Use GRR to validate that growth isn't masking underlying churn.",
    ],
  },
  {
    slug: "cohort-analysis",
    title: "Cohort Analysis",
    description:
      "Cohort analysis groups customers by a shared start point (e.g., signup month) and tracks outcomes (retention, revenue) over time.",
    bullets: [
      "Use cohorts to see where retention drops (month 1 vs month 6+).",
      "Segment cohorts by channel and plan to see quality differences.",
    ],
  },
  {
    slug: "activation-rate",
    title: "Activation Rate",
    description:
      "Activation rate measures what % of new users reach a meaningful 'aha' moment after signup (an early predictor of retention).",
    formula: "Activation rate = activated users ÷ new signups",
    mistakes: [
      "Using vanity actions as activation (not linked to retention).",
      "Comparing activation across products without aligning definitions.",
    ],
  },
  {
    slug: "trial-to-paid",
    title: "Trial-to-paid Conversion Rate",
    description:
      "Trial-to-paid conversion measures what % of trial users become paying customers within a defined window.",
    formula: "Trial-to-paid = trial users who paid ÷ trial users started",
    bullets: [
      "Track by cohort and channel to understand lead quality.",
      "Separate self-serve vs sales-assisted conversions for clarity.",
    ],
  },
  {
    slug: "conversion-rate",
    title: "Conversion Rate",
    description:
      "Conversion rate measures the % of users who complete a goal action (signup, purchase, activation) out of those exposed to the step.",
    formula: "Conversion rate = conversions ÷ opportunities (views/clicks/sessions)",
    mistakes: [
      "Mixing denominators (clicks vs sessions) and comparing as if equal.",
      "Optimizing conversion rate by narrowing intent and losing scale.",
    ],
  },
  {
    slug: "funnel",
    title: "Funnel",
    description:
      "A funnel models a sequence of steps users take (visit → signup → activate → pay) and the conversion rates between steps.",
    bullets: [
      "Use funnels to identify the largest drop-off points.",
      "Analyze by segment (channel, device, geo) to find specific issues.",
    ],
  },
  {
    slug: "arrr-funnel",
    title: "ARRR Funnel (Pirate Metrics)",
    description:
      "ARRR is a product growth framework: Acquisition, Activation, Retention, Revenue, Referral. It helps pick the right KPI for each stage.",
    mistakes: [
      "Measuring stages with inconsistent definitions across teams.",
      "Focusing on acquisition while ignoring retention (leaky bucket).",
    ],
  },
  {
    slug: "payback-months",
    title: "Months to recover CAC",
    description:
      "Months to recover CAC is another name for CAC payback period: the months of gross profit needed to earn back acquisition cost.",
    formula: "Payback (months) = CAC ÷ (ARPA × gross margin)",
    relatedGuideSlugs: ["cac-payback-guide"],
    relatedCalculatorSlugs: ["cac-payback-period-calculator"],
  },
  {
    slug: "unit-economics",
    title: "Unit Economics",
    description:
      "Unit economics evaluate profitability and cash efficiency at the level of a unit (customer/account/order). Common unit metrics are CAC, LTV, and payback.",
    bullets: [
      "Pick a unit (customer/account) and keep definitions consistent.",
      "Use gross profit (not revenue) when comparing to CAC.",
      "Segment by channel/plan to avoid blended averages.",
    ],
  },
  {
    slug: "rule-of-40",
    title: "Rule of 40",
    description:
      "Rule of 40 is a SaaS heuristic: growth rate (%) + profit margin (%) should be ~40%+. It balances growth and profitability.",
    formula: "Rule of 40 score = revenue growth (%) + profit margin (%)",
    mistakes: [
      "Mixing margin types (EBITDA vs FCF) without clarity.",
      "Using the score as a target without considering stage and motion.",
    ],
  },
  {
    slug: "burn-multiple",
    title: "Burn Multiple",
    description:
      "Burn multiple is a growth efficiency metric: how much net cash you burn to generate $1 of net new ARR.",
    formula: "Burn multiple = net burn ÷ net new ARR",
    bullets: [
      "Use consistent windows (typically quarterly).",
      "Adjust for annual prepay seasonality if needed.",
      "Pair with retention and gross margin to judge growth quality.",
    ],
  },
  {
    slug: "saas-magic-number",
    title: "SaaS Magic Number",
    description:
      "SaaS Magic Number is a heuristic for sales efficiency using net new ARR relative to sales & marketing spend (with a lag).",
    formula:
      "Magic Number ≈ (net new ARR in quarter × 4) ÷ prior-quarter sales & marketing spend",
    mistakes: [
      "Ignoring lag effects between spend and revenue.",
      "Using blended averages that hide channel differences.",
    ],
  },
  {
    slug: "ltv-to-cac",
    title: "LTV:CAC Ratio",
    description:
      "LTV:CAC compares lifetime value to acquisition cost. It's a unit economics sanity check, but can mislead if definitions mismatch.",
    formula: "LTV:CAC = LTV ÷ CAC",
    mistakes: [
      "Comparing revenue-based LTV to fully-loaded CAC (mismatch).",
      "Ignoring payback and cash constraints.",
    ],
    relatedGuideSlugs: ["ltv-cac-guide"],
    relatedCalculatorSlugs: ["ltv-to-cac-calculator"],
  },
  {
    slug: "break-even-saas",
    title: "Break-even (SaaS context)",
    description:
      "Break-even means total contribution covers fixed costs (profit is zero). In SaaS, it depends heavily on gross margin and acquisition spend.",
    bullets: [
      "Use break-even revenue to understand minimum sustainable scale.",
      "Pair with payback period to ensure growth is cash-feasible.",
    ],
  },
  {
    slug: "cohorted-ltv",
    title: "Cohort-based LTV",
    description:
      "Cohort-based LTV estimates lifetime value using observed retention and gross profit over time for a cohort, rather than a simple churn formula.",
    bullets: [
      "More accurate when churn changes over time or expansion is meaningful.",
      "Use cohorts by plan/channel to avoid mixing behaviors.",
    ],
    relatedGuideSlugs: ["cohort-ltv-forecast-guide", "cohort-vs-aggregate-guide"],
    relatedCalculatorSlugs: ["cohort-ltv-forecast-calculator"],
  },
  {
    slug: "arr-valuation-multiple",
    title: "ARR Multiple (valuation)",
    description:
      "ARR multiple is a valuation shorthand: enterprise value divided by ARR. It is a heuristic that varies by growth, margin, and retention.",
    formula: "ARR multiple = enterprise value ÷ ARR",
    bullets: [
      "Use ARR multiple for rough comparisons, not as a complete valuation model.",
      "Higher NRR and faster growth often support higher multiples.",
      "Be careful with early-stage ARR definitions (clean recurring only).",
    ],
  },
  {
    slug: "net-retention",
    title: "Net Retention",
    description:
      "Net retention is the same idea as NRR: revenue retained from a cohort including expansion and contraction.",
    formula:
      "Net retention = (starting revenue + expansion − contraction − churn) ÷ starting revenue",
  },
  {
    slug: "gross-retention",
    title: "Gross Retention",
    description:
      "Gross retention is the same idea as GRR: revenue retained from a cohort excluding expansion (only churn and contraction).",
    formula: "Gross retention = (starting revenue − contraction − churn) ÷ starting revenue",
  },
  {
    slug: "quick-ratio",
    title: "SaaS Quick Ratio",
    description:
      "SaaS quick ratio measures growth quality by comparing positive MRR movements to negative movements in a period.",
    formula:
      "Quick ratio = (new MRR + expansion MRR) ÷ (contraction MRR + churned MRR)",
    bullets: [
      "Use it to assess whether growth is healthy vs leaky.",
      "Track by segment; blended ratios can hide churn pockets.",
    ],
  },
  {
    slug: "customer-lifetime",
    title: "Customer Lifetime",
    description:
      "Customer lifetime is the expected duration a customer stays subscribed. It's often approximated from churn rate (with consistent time units).",
    formula: "Customer lifetime ≈ 1 ÷ churn rate",
    mistakes: [
      "Using monthly churn to compute annual lifetime (unit mismatch).",
      "Assuming churn is constant over time (it often changes by tenure).",
    ],
  },
  {
    slug: "arpa-vs-arpu",
    title: "ARPA vs ARPU",
    description:
      "ARPU is revenue per active user; ARPA is revenue per paying account/customer. Choose the denominator that matches how you bill.",
    bullets: [
      "B2B SaaS often prefers ARPA (per account).",
      "Per-seat pricing can make ARPU more natural.",
      "Label the metric clearly so teams don't mix denominators.",
    ],
  },
  {
    slug: "pql",
    title: "PQL (Product-Qualified Lead)",
    description:
      "A PQL is a lead identified by product usage signals (not only form fills). PQLs often convert better when the product is the primary driver of value.",
    bullets: [
      "Define PQL events that correlate with retention, not vanity actions.",
      "Track PQL-to-paid conversion by cohort and segment.",
    ],
  },
  {
    slug: "mql",
    title: "MQL (Marketing-Qualified Lead)",
    description:
      "An MQL is a lead judged likely to become a customer based on marketing engagement signals (content, forms, intent).",
    mistakes: [
      "Treating MQL volume as a success metric without conversion quality.",
      "Changing MQL scoring frequently without recalibrating reporting.",
    ],
  },
  {
    slug: "sql",
    title: "SQL (Sales-Qualified Lead)",
    description:
      "An SQL is a lead that sales has validated as qualified for a sales conversation (budget/need/timing or product fit).",
    bullets: [
      "Track MQL→SQL and SQL→Closed rates to find funnel bottlenecks.",
      "Segment by channel to identify high-quality sources.",
    ],
  },
  {
    slug: "pipeline",
    title: "Sales Pipeline",
    description:
      "Sales pipeline is the set of open opportunities expected to close, usually tracked by stage, amount, and expected close date.",
    bullets: [
      "Use pipeline coverage to plan quota and hiring.",
      "Track conversion rates by stage to forecast more accurately.",
    ],
  },
  {
    slug: "sales-cycle",
    title: "Sales Cycle Length",
    description:
      "Sales cycle length is the time from first touch or opportunity creation to close. It impacts CAC payback and forecasting.",
    bullets: [
      "Longer cycles increase cash needs and make payback slower in practice.",
      "Track by segment (SMB vs enterprise) because cycles differ.",
    ],
  },
  {
    slug: "net-dollar-retention",
    title: "NDR (Net Dollar Retention)",
    description:
      "NDR is another name for NRR in dollar terms. It measures how existing revenue changes including expansion.",
    formula:
      "NDR = (starting revenue + expansion − contraction − churn) ÷ starting revenue",
  },
];

export const termsSaas: GlossaryTerm[] = seeds.map(makeTerm);
