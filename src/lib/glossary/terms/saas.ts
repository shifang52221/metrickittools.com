import type {
  GlossaryCategorySlug,
  GlossaryFaq,
  GlossarySection,
  GlossaryTerm,
} from "../types";

type Seed = {
  slug: string;
  title: string;
  description: string;
  category?: GlossaryCategorySlug;
  updatedAt?: string; // YYYY-MM-DD
  formula?: string;
  example?: string;
  bullets?: string[];
  mistakes?: string[];
  faqs?: GlossaryFaq[];
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
    updatedAt: seed.updatedAt ?? "2026-01-23",
    sections: buildSections(seed),
    faqs: seed.faqs,
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
    formula: "ARPA = revenue / average paying accounts",
    bullets: [
      "Use ARPA when you bill per company account (not per seat).",
      "Segment ARPA by plan, industry, and channel to understand monetization.",
      "Pair ARPA with CAC payback and LTV for unit economics.",
    ],
    relatedGuideSlugs: ["arpu-guide", "cac-payback-guide"],
    relatedCalculatorSlugs: ["arpu-calculator", "cac-payback-period-calculator"],
  },
  {
    slug: "cac-payback-period",
    title: "CAC Payback Period",
    description:
      "CAC payback period estimates how long it takes to recover customer acquisition cost (CAC) using the gross profit generated each month by a customer/account.",
    formula: "Payback (months) ~ CAC / (ARPA * gross margin)",
    bullets: [
      "Shorter payback reduces cash risk and improves your ability to scale acquisition.",
      "Use gross profit (margin) rather than revenue to avoid overstating payback speed.",
      "Track payback by channel and plan; blended payback can hide weak cohorts.",
    ],
    mistakes: [
      "Using revenue payback while CAC includes fully-loaded spend (mismatch).",
      "Mixing monthly ARPA with annual churn or annual CAC (time window mismatch).",
      "Ignoring early churn and assuming steady-state behavior from day 1.",
    ],
    relatedGuideSlugs: ["cac-payback-guide", "cohort-payback-curve-guide"],
    relatedCalculatorSlugs: [
      "cac-payback-period-calculator",
      "cohort-payback-curve-calculator",
    ],
  },
  {
    slug: "arr-vs-bookings",
    title: "Bookings vs ARR",
    description:
      "Bookings are contracted value closed in a period; ARR is a recurring run-rate snapshot (MRR * 12). They answer different questions.",
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
    formula: "ACV = total recurring contract value / contract years",
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
    slug: "price-increase",
    title: "Price Increase (SaaS)",
    description:
      "A price increase raises ARPA/MRR for an existing customer base. It is high leverage, but it can trigger churn or downgrades if customers perceive reduced value-for-money.",
    formula:
      "Break-even immediate churn (one-time) ~ 1 - 1/(1 + price increase)",
    bullets: [
      "Segment price changes by plan, usage, value delivered, and tenure.",
      "Watch revenue churn (downgrades + cancellations), not only logo churn.",
      "Use a rollout (grandfathering, phased increases) to reduce shock and learn safely.",
    ],
    mistakes: [
      "Applying a blanket increase without segmentation.",
      "Over-focusing on short-term MRR while ignoring retention damage.",
      "Using platform-reported attribution to justify pricing changes (different problem).",
    ],
    relatedGuideSlugs: ["price-increase-guide"],
    relatedCalculatorSlugs: ["price-increase-break-even-calculator"],
  },
  {
    slug: "retention-rate",
    title: "Retention Rate",
    description:
      "Retention rate measures the fraction of customers (or revenue) that remains over a period. It is the complement of churn when measured on the same basis and time window.",
    formula: "Retention rate = 1 - churn rate (with consistent definitions)",
    example:
      "If monthly logo churn is 3% for a cohort, monthly logo retention is about 97% (for the same definition and period).",
    bullets: [
      "Specify whether you mean logo retention (customers) or revenue retention (dollars).",
      "Use cohort retention curves to see where retention drops over time.",
      "Pair retention with gross margin to understand LTV and payback feasibility.",
    ],
    mistakes: [
      "Mixing logo churn with revenue retention (different denominators).",
      "Comparing retention across periods without consistent cohort definitions.",
    ],
    faqs: [
      {
        question: "Retention rate vs GRR/NRR: how are they related?",
        answer:
          "Retention rate can be measured on logos or revenue. GRR/NRR are revenue retention variants for a cohort (GRR excludes expansion; NRR includes it).",
      },
      {
        question: "Should we use cohort retention or aggregate retention?",
        answer:
          "Use cohort retention for diagnosing lifecycle changes. Aggregate retention can be distorted by mix shift (new vs old customers).",
      },
    ],
    relatedGuideSlugs: ["retention-curve-guide", "cohort-vs-aggregate-guide"],
    relatedCalculatorSlugs: ["retention-rate-calculator", "retention-curve-calculator"],
  },
  {
    slug: "churn-rate",
    title: "Churn Rate",
    description:
      "Churn rate measures the fraction of customers (logo churn) or recurring revenue (revenue churn) lost over a period. It is one of the most important drivers of LTV and payback.",
    formula: "Churn rate = losses / starting base (customers or revenue)",
    example:
      "If you start the month with 1,000 customers and lose 35, logo churn = 35 / 1,000 = 3.5% for the month.",
    bullets: [
      "Specify whether churn is logo churn (count) or revenue churn (dollars).",
      "Keep time units consistent (monthly vs annual) when using churn in formulas.",
      "Use cohort curves to see how churn changes over time rather than relying on a single average.",
    ],
    mistakes: [
      "Mixing logo churn with revenue retention metrics (NRR/GRR).",
      "Using annual churn as if it were monthly churn (time unit mismatch).",
      "Relying on blended churn when segments behave differently.",
    ],
    faqs: [
      {
        question: "Is churn the same as 1 - retention?",
        answer:
          "Only if you're measuring the same base (logos or revenue) over the same period with consistent definitions. Otherwise they can differ.",
      },
      {
        question: "Why does churn change after a price increase?",
        answer:
          "A price increase can increase churn for price-sensitive segments. Track churn/retention by segment and update LTV/payback models after pricing changes.",
      },
    ],
    relatedGuideSlugs: ["retention-curve-guide", "cohort-ltv-forecast-guide"],
    relatedCalculatorSlugs: ["churn-rate-calculator", "retention-rate-calculator"],
  },
  {
    slug: "net-new-mrr",
    title: "Net New MRR",
    description:
      "Net new MRR is the change in MRR in a period after expansions, contractions, and churn. It combines growth and retention movements.",
    formula:
      "Net new MRR = new MRR + expansion MRR - contraction MRR - churned MRR",
    example:
      "If new MRR is $40k, expansion is $15k, contraction is $5k, and churned MRR is $10k, net new MRR = $40k+$15k-$5k-$10k = $40k.",
    bullets: [
      "Track net new MRR by segment to find durable growth sources.",
      "Pair with churn/retention to diagnose whether growth is leaky.",
      "Use consistent definitions across months for clean trend analysis.",
    ],
    mistakes: [
      "Mixing MRR (run-rate) with billings or cash (timing differs).",
      "Counting reactivations inconsistently (treat them consistently as new or separate).",
    ],
    relatedGuideSlugs: ["mrr-waterfall-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["net-new-mrr-calculator", "mrr-waterfall-calculator"],
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
    relatedGuideSlugs: ["mrr-waterfall-guide"],
    relatedCalculatorSlugs: ["mrr-waterfall-calculator", "net-new-mrr-calculator"],
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
    mistakes: [
      "Counting expansion as ‘retention' without also tracking GRR (NRR can hide churn).",
      "Mixing price-driven expansions with true usage expansion (separate when possible).",
    ],
    relatedGuideSlugs: ["nrr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["nrr-calculator", "nrr-vs-grr-calculator"],
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
    relatedGuideSlugs: ["grr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["grr-calculator", "nrr-vs-grr-calculator"],
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
    relatedGuideSlugs: ["mrr-churn-rate-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["mrr-churn-rate-calculator", "net-new-mrr-calculator"],
  },
  {
    slug: "logo-churn",
    title: "Logo Churn",
    description:
      "Logo churn is customer churn measured in count (accounts lost), not dollars. It can be high even when NRR is strong.",
    formula: "Logo churn = customers lost / customers at start of period",
    example:
      "If you started with 1,000 customers and lost 30, logo churn = 30 / 1,000 = 3% for the period.",
    mistakes: [
      "Looking only at blended logo churn (hides segment differences).",
      "Assuming strong NRR means churn is fine (expansion can mask losses).",
    ],
    faqs: [
      {
        question: "Can logo churn be high while NRR is high?",
        answer:
          "Yes. If you lose many small customers but expand strongly in larger accounts, NRR can stay high. Track both logo churn and GRR/NRR by segment.",
      },
    ],
    relatedGuideSlugs: ["churn-guide", "nrr-guide", "grr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["churn-rate-calculator", "nrr-calculator", "grr-calculator"],
  },
  {
    slug: "revenue-churn",
    title: "Revenue Churn",
    description:
      "Revenue churn measures how much recurring revenue you lose (MRR dollars) over a period. It differs from logo churn.",
    formula: "Revenue churn = revenue lost / starting revenue (same cohort and period)",
    example:
      "If starting MRR is $100k and you lose $6k of MRR from churn and downgrades, gross revenue churn = $6k / $100k = 6% for the period.",
    bullets: [
      "Track revenue churn when customer sizes vary a lot.",
      "Use GRR to measure churn + downgrades without expansion.",
    ],
    relatedGuideSlugs: ["grr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["gross-revenue-churn-calculator", "grr-calculator"],
  },
  {
    slug: "gross-revenue-churn",
    title: "Gross Revenue Churn",
    description:
      "Gross revenue churn is the share of starting MRR lost to downgrades (contraction) and cancellations (churn) over a period. It excludes expansion by definition.",
    formula:
      "Gross revenue churn = (contraction MRR + churned MRR) / starting MRR",
    bullets: [
      "It's a loss metric (how much revenue you lost), not a remaining metric.",
      "Use the same cohort and time window for starting MRR and losses.",
      "Track gross churn alongside GRR/NRR to avoid being misled by expansion.",
    ],
    mistakes: [
      "Including expansion (gross churn excludes it).",
      "Mixing cohorts or time windows (start from one cohort, losses from another).",
      "Using ending MRR as the denominator instead of starting MRR.",
    ],
    relatedGuideSlugs: ["gross-revenue-churn-guide", "churn-guide", "grr-guide", "nrr-guide"],
    relatedCalculatorSlugs: [
      "gross-revenue-churn-calculator",
      "grr-calculator",
      "nrr-calculator",
    ],
  },
  {
    slug: "nrr",
    title: "NRR (Net Revenue Retention)",
    description:
      "NRR measures how revenue from an existing cohort changes over time, including expansion and contraction.",
    formula:
      "NRR = (starting MRR + expansion - contraction - churn) / starting MRR",
    example:
      "If starting MRR is $100k, expansion is $15k, contraction is $5k, and churn is $10k, NRR = ($100k+$15k-$5k-$10k)/$100k = 100%.",
    bullets: [
      "NRR > 100% means the cohort grows without new customers.",
      "Track NRR by segment (plan, size) to avoid blended averages.",
    ],
    mistakes: [
      "Using different cohorts for starting MRR vs expansion/churn (inconsistent denominators).",
      "Letting expansion hide churn (track GRR alongside NRR).",
    ],
    faqs: [
      {
        question: "NRR vs GRR: why track both?",
        answer:
          "NRR includes expansion and can be high even with significant churn. GRR isolates churn and downgrades, making it harder to ‘hide' retention problems.",
      },
    ],
    relatedGuideSlugs: ["nrr-guide", "nrr-vs-grr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["nrr-calculator", "nrr-vs-grr-calculator"],
  },
  {
    slug: "grr",
    title: "GRR (Gross Revenue Retention)",
    description:
      "GRR measures how much of a cohort's starting revenue remains after churn and downgrades, excluding expansion.",
    formula: "GRR = (starting MRR - contraction - churn) / starting MRR",
    example:
      "If starting MRR is $100k, contraction is $5k, and churn is $10k, GRR = ($100k-$5k-$10k)/$100k = 85%.",
    bullets: [
      "GRR isolates durability (product stickiness) from expansion.",
      "Use GRR to validate that growth isn't masking underlying churn.",
    ],
    mistakes: [
      "Including expansion in GRR (by definition it's excluded).",
      "Mixing cohorts or time windows (start from one cohort, losses from another).",
    ],
    faqs: [
      {
        question: "Is GRR supposed to be lower than NRR?",
        answer:
          "Yes, typically. NRR adds expansion on top of GRR. If GRR is weak, NRR can still look good temporarily if expansion is strong.",
      },
    ],
    relatedGuideSlugs: ["grr-guide", "nrr-guide", "nrr-vs-grr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["grr-calculator", "nrr-calculator", "nrr-vs-grr-calculator"],
  },
  {
    slug: "cohort-analysis",
    title: "Cohort Analysis",
    description:
      "Cohort analysis groups customers by a shared start point (e.g., signup month) and tracks outcomes (retention, revenue) over time.",
    example:
      "A common cohort view is monthly signup cohorts: track what % of each cohort is still active (or paying) after 1, 3, 6, and 12 months.",
    bullets: [
      "Use cohorts to see where retention drops (month 1 vs month 6+).",
      "Segment cohorts by channel and plan to see quality differences.",
    ],
    mistakes: [
      "Mixing cohorts with different start definitions (signup vs paid vs activated).",
      "Comparing cohorts without controlling for seasonality or product changes.",
    ],
    faqs: [
      {
        question: "What should define the cohort start?",
        answer:
          "Use the start point that matches your question: signup for onboarding, activation for product usage, paid conversion for revenue retention.",
      },
    ],
    relatedGuideSlugs: [
      "retention-curve-guide",
      "cohort-payback-curve-guide",
      "cohort-analysis-playbook-guide",
      "retention-churn-hub-guide",
    ],
    relatedCalculatorSlugs: [
      "retention-curve-calculator",
      "two-stage-retention-curve-calculator",
      "cohort-payback-curve-calculator",
    ],
  },
  {
    slug: "activation-rate",
    title: "Activation Rate",
    description:
      "Activation rate measures what % of new users reach a meaningful 'aha' moment after signup (an early predictor of retention).",
    formula: "Activation rate = activated users / new signups",
    example:
      "If 1,200 of 5,000 signups reached activation, activation rate = 1,200 / 5,000 = 24%.",
    mistakes: [
      "Using vanity actions as activation (not linked to retention).",
      "Comparing activation across products without aligning definitions.",
    ],
    faqs: [
      {
        question: "How do I pick the right activation event?",
        answer:
          "Pick the earliest behavior that strongly predicts retention or revenue (the ‘aha' moment). Validate it with cohort analysis before locking it in.",
      },
    ],
    relatedGuideSlugs: ["activation-rate-guide", "plg-metrics-hub-guide"],
    relatedCalculatorSlugs: ["activation-rate-calculator"],
  },
  {
    slug: "trial-to-paid",
    title: "Trial-to-paid Conversion Rate",
    description:
      "Trial-to-paid conversion measures what % of trial users become paying customers within a defined window.",
    formula: "Trial-to-paid = trial users who paid / trial users started",
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
    formula: "Conversion rate = conversions / opportunities (views/clicks/sessions)",
    mistakes: [
      "Mixing denominators (clicks vs sessions) and comparing as if equal.",
      "Optimizing conversion rate by narrowing intent and losing scale.",
    ],
  },
  {
    slug: "dau",
    title: "DAU (Daily Active Users)",
    description:
      "DAU counts unique active users on a given day. The definition of 'active' must be consistent (session vs key event).",
    formula: "DAU = unique active users in a day",
    bullets: [
      "Define 'active' using a meaningful value event when possible.",
      "Track DAU alongside MAU/WAU to understand frequency and seasonality.",
    ],
    mistakes: [
      "Using DAU from one definition and MAU from another (not comparable).",
      "Comparing DAU across segments without adjusting for expected cadence.",
    ],
    relatedGuideSlugs: ["dau-mau-guide"],
    relatedCalculatorSlugs: ["dau-mau-calculator"],
  },
  {
    slug: "wau",
    title: "WAU (Weekly Active Users)",
    description:
      "WAU counts unique active users over a 7-day window. It's often a better engagement signal for weekly cadence products than DAU.",
    formula: "WAU = unique active users in a week",
    bullets: [
      "Use WAU/MAU for weekly workflows and B2B cadence products.",
      "Keep 'active' definition consistent across WAU and MAU.",
    ],
    mistakes: [
      "Using inconsistent windows (rolling 7 days vs calendar week) without noting it.",
      "Comparing WAU across products with different usage expectations.",
    ],
    relatedGuideSlugs: ["wau-mau-guide", "dau-mau-guide"],
    relatedCalculatorSlugs: ["wau-mau-calculator", "dau-mau-calculator"],
  },
  {
    slug: "mau",
    title: "MAU (Monthly Active Users)",
    description:
      "MAU counts unique active users over a month (or rolling 30 days). It measures reach and is often paired with DAU/WAU to measure frequency (stickiness).",
    formula: "MAU = unique active users in a month",
    bullets: [
      "Use a consistent window (calendar month vs rolling 30 days).",
      "Pair with DAU/WAU to measure usage frequency, not just reach.",
    ],
    mistakes: [
      "Mixing rolling 30-day MAU with calendar-month MAU in trends.",
      "Using a low-quality 'active' definition that overcounts accidental users.",
    ],
    relatedGuideSlugs: ["dau-mau-guide", "wau-mau-guide"],
    relatedCalculatorSlugs: ["dau-mau-calculator", "wau-mau-calculator"],
  },
  {
    slug: "stickiness",
    title: "Stickiness (DAU/MAU, WAU/MAU)",
    description:
      "Stickiness measures how frequently users return. The most common versions are DAU/MAU (daily stickiness) and WAU/MAU (weekly stickiness).",
    formula: "Stickiness = DAU / MAU (or WAU / MAU)",
    bullets: [
      "Use DAU/MAU for daily cadence products; use WAU/MAU for weekly cadence products.",
      "Track stickiness by segment (persona/plan) for actionability.",
    ],
    mistakes: [
      "Comparing DAU/MAU across products with different cadence expectations.",
      "Using inconsistent 'active' definitions across numerator and denominator.",
    ],
    relatedGuideSlugs: ["dau-mau-guide", "wau-mau-guide"],
    relatedCalculatorSlugs: ["dau-mau-calculator", "wau-mau-calculator"],
  },
  {
    slug: "feature-adoption",
    title: "Feature Adoption Rate",
    description:
      "Feature adoption rate measures what % of active users used a specific feature in a time window. It helps validate that users are discovering and using value-driving capabilities.",
    formula: "Feature adoption rate = users who used feature / active users",
    bullets: [
      "Use a meaningful usage threshold (not a one-off click).",
      "Segment adoption by cohort and persona and connect it to retention outcomes.",
    ],
    mistakes: [
      "Using total users instead of active users as the denominator.",
      "Optimizing adoption of a feature that doesn't drive retention or revenue.",
    ],
    relatedGuideSlugs: ["feature-adoption-guide"],
    relatedCalculatorSlugs: ["feature-adoption-rate-calculator"],
  },
  {
    slug: "pql-to-paid",
    title: "PQL-to-paid Conversion",
    description:
      "PQL-to-paid conversion measures what % of product-qualified leads (PQLs) become paying customers. It connects product usage signals to revenue outcomes.",
    formula: "PQL-to-paid = paid customers from PQLs / PQLs",
    bullets: [
      "Define PQLs using signals correlated with retention, not vanity actions.",
      "Segment by channel and persona to see where PQL quality differs.",
    ],
    mistakes: [
      "Mixing cohorts/time windows when attributing paid conversions to PQLs.",
      "Optimizing PQL volume at the expense of quality (conversion drops).",
    ],
    relatedGuideSlugs: ["pql-to-paid-guide"],
    relatedCalculatorSlugs: ["pql-to-paid-calculator"],
  },
  {
    slug: "funnel",
    title: "Funnel",
    description:
      "A funnel models a sequence of steps users take (visit -> signup -> activate -> pay) and the conversion rates between steps.",
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
    formula: "Payback (months) ~ CAC / (ARPA * gross margin)",
    example:
      "If CAC is $6,000, ARPA is $500/month, and gross margin is 80% (0.8), payback ~ $6,000 / ($500 * 0.8) = 15 months.",
    faqs: [
      {
        question: "Why use gross margin in payback?",
        answer:
          "Because CAC is paid in cash, and payback is about cash recovery. Using revenue instead of gross profit overstates how fast you recover CAC.",
      },
    ],
    relatedGuideSlugs: ["cac-payback-guide"],
    relatedCalculatorSlugs: ["cac-payback-period-calculator"],
  },
  {
    slug: "unit-economics",
    title: "Unit Economics",
    description:
      "Unit economics evaluate profitability and cash efficiency at the level of a unit (customer/account/order). Common unit metrics are CAC, LTV, and payback.",
    example:
      "A simple unit economics stack is: compute CAC, estimate LTV, sanity-check LTV:CAC, then confirm cash feasibility with CAC payback and runway.",
    bullets: [
      "Pick a unit (customer/account) and keep definitions consistent.",
      "Use gross profit (not revenue) when comparing to CAC.",
      "Segment by channel/plan to avoid blended averages.",
    ],
    mistakes: [
      "Mixing fully-loaded CAC with revenue-only LTV (definition mismatch).",
      "Using blended averages that hide unprofitable segments.",
    ],
    faqs: [
      {
        question: "What's the fastest way to improve unit economics?",
        answer:
          "Usually by improving retention (raises LTV) and/or improving margin. Lowering CAC helps too, but it often has trade-offs with scale.",
      },
    ],
    relatedGuideSlugs: ["unit-economics-guide", "unit-economics-hub-guide"],
    relatedCalculatorSlugs: [
      "unit-economics-calculator",
      "unit-economics-dashboard-calculator",
      "ltv-to-cac-calculator",
      "cac-payback-period-calculator",
    ],
  },
  {
    slug: "rule-of-40",
    title: "Rule of 40",
    description:
      "Rule of 40 is a SaaS heuristic: growth rate (%) + profit margin (%) should be ~40%+. It balances growth and profitability.",
    formula: "Rule of 40 score = revenue growth (%) + profit margin (%)",
    example:
      "If revenue growth is 35% and profit margin is 10%, the Rule of 40 score is 45% (often considered strong).",
    bullets: [
      "Use it as a stage-aware heuristic, not a universal law.",
      "Be explicit about the margin type (EBITDA vs operating vs FCF) and the growth definition.",
    ],
    mistakes: [
      "Mixing margin types (EBITDA vs FCF) without clarity.",
      "Using the score as a target without considering stage and motion.",
    ],
    faqs: [
      {
        question: "Does a high Rule of 40 score guarantee a good business?",
        answer:
          "No. It's a rough heuristic. You still need to check retention quality (NRR/GRR), cash efficiency (burn multiple), and whether growth is durable.",
      },
    ],
    relatedGuideSlugs: ["rule-of-40-guide", "unit-economics-hub-guide"],
    relatedCalculatorSlugs: ["rule-of-40-calculator", "burn-multiple-calculator"],
  },
  {
    slug: "burn-multiple",
    title: "Burn Multiple",
    description:
      "Burn multiple is a growth efficiency metric: how much net cash you burn to generate $1 of net new ARR.",
    formula: "Burn multiple = net burn / net new ARR",
    example:
      "If net burn is $2.5M in a quarter and net new ARR is $1.0M, burn multiple = 2.5.",
    bullets: [
      "Use consistent windows (typically quarterly).",
      "Adjust for annual prepay seasonality if needed.",
      "Pair with retention and gross margin to judge growth quality.",
    ],
    faqs: [
      {
        question: "What's a ‘good' burn multiple?",
        answer:
          "It depends on stage and market. Lower is generally better, but you should compare against peers and consider retention and margin quality.",
      },
    ],
    relatedGuideSlugs: ["burn-multiple-guide", "net-new-arr-guide", "unit-economics-hub-guide"],
    relatedCalculatorSlugs: ["burn-multiple-calculator", "net-new-arr-calculator"],
  },
  {
    slug: "net-new-arr",
    title: "Net New ARR",
    description:
      "Net new ARR is the net change in ARR over a period after adding new and expansion ARR and subtracting contraction and churn.",
    formula: "Net new ARR = new ARR + expansion ARR - contraction ARR - churned ARR",
    example:
      "If new ARR is $1.2M, expansion is $0.6M, contraction is $0.2M, and churn is $0.4M, net new ARR = $1.2M + $0.6M - $0.2M - $0.4M = $1.2M.",
    bullets: [
      "Use net new ARR for efficiency metrics like burn multiple and magic number.",
      "Compute it for the same period as burn/spend (often quarterly).",
      "Segment by channel, plan, and customer size to avoid blended noise.",
    ],
    mistakes: [
      "Mixing ARR movements with bookings/cash (different concepts and timing).",
      "Using inconsistent windows (monthly net new ARR with quarterly burn).",
      "Counting one-time fees as recurring ARR movements.",
    ],
    relatedGuideSlugs: ["net-new-arr-guide", "burn-multiple-guide"],
    relatedCalculatorSlugs: ["net-new-arr-calculator", "burn-multiple-calculator"],
  },
  {
    slug: "saas-magic-number",
    title: "SaaS Magic Number",
    description:
      "SaaS Magic Number is a heuristic for sales efficiency using net new ARR relative to sales & marketing spend (with a lag).",
    formula:
      "Magic Number ~ (net new ARR in quarter * 4) / prior-quarter sales & marketing spend",
    example:
      "If net new ARR in the quarter is $1.0M and prior-quarter sales & marketing spend was $2.0M, Magic Number ~ ($1.0M * 4) / $2.0M = 2.0.",
    mistakes: [
      "Ignoring lag effects between spend and revenue.",
      "Using blended averages that hide channel differences.",
    ],
    faqs: [
      {
        question: "Why multiply by 4?",
        answer:
          "Net new ARR is often measured quarterly. Multiplying by 4 annualizes the quarterly ARR change before comparing it to spend.",
      },
    ],
  },
  {
    slug: "ltv-to-cac",
    title: "LTV:CAC Ratio",
    description:
      "LTV:CAC compares lifetime value to acquisition cost. It's a unit economics sanity check, but can mislead if definitions mismatch.",
    formula: "LTV:CAC = LTV / CAC",
    example: "If LTV is $5,400 and CAC is $600, LTV:CAC = $5,400 / $600 = 9.0.",
    mistakes: [
      "Comparing revenue-based LTV to fully-loaded CAC (mismatch).",
      "Ignoring payback and cash constraints.",
    ],
    faqs: [
      {
        question: "Is a high LTV:CAC always good?",
        answer:
          "Not always. It can be inflated by optimistic LTV assumptions or long payback. Pair it with CAC payback and cohort retention.",
      },
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
    formula: "ARR multiple = enterprise value / ARR",
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
      "Net retention = (starting revenue + expansion - contraction - churn) / starting revenue",
  },
  {
    slug: "gross-retention",
    title: "Gross Retention",
    description:
      "Gross retention is the same idea as GRR: revenue retained from a cohort excluding expansion (only churn and contraction).",
    formula: "Gross retention = (starting revenue - contraction - churn) / starting revenue",
  },
  {
    slug: "quick-ratio",
    title: "SaaS Quick Ratio",
    description:
      "SaaS quick ratio measures growth quality by comparing positive MRR movements to negative movements in a period.",
    formula:
      "Quick ratio = (new MRR + expansion MRR) / (contraction MRR + churned MRR)",
    example:
      "If new MRR is $40k and expansion is $10k, while contraction is $5k and churn is $15k, quick ratio = ($40k+$10k)/($5k+$15k) = 2.5.",
    bullets: [
      "Use it to assess whether growth is healthy vs leaky.",
      "Track by segment; blended ratios can hide churn pockets.",
    ],
    mistakes: [
      "Comparing periods with different definitions of MRR movements.",
      "Using quick ratio alone without checking margin and payback.",
    ],
    faqs: [
      {
        question: "What's a ‘good' quick ratio?",
        answer:
          "It depends on stage. Higher is better, but the key is trend and segment mix. Pair it with NRR/GRR and payback to judge quality.",
      },
    ],
    relatedGuideSlugs: ["saas-quick-ratio-guide", "mrr-waterfall-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["saas-quick-ratio-calculator", "mrr-waterfall-calculator"],
  },
  {
    slug: "mrr-churn-rate",
    title: "MRR Churn Rate",
    description:
      "MRR churn rate measures churned MRR (lost recurring revenue from cancellations) as a percentage of starting MRR for a period.",
    formula: "MRR churn rate = churned MRR / starting MRR",
    example:
      "If starting MRR is $200k and churned MRR is $8k in a month, MRR churn rate = $8k / $200k = 4% for the month.",
    bullets: [
      "MRR churn is revenue churn (not customer/logo churn).",
      "Track churned MRR and contraction MRR separately, then use GRR/NRR for the full picture.",
      "Convert longer windows to monthly-equivalent churn to compare periods consistently.",
    ],
    mistakes: [
      "Mixing churned MRR with contraction MRR without labeling.",
      "Using ending MRR as the denominator instead of starting MRR.",
      "Mixing billings/cash with run-rate churn metrics.",
    ],
    faqs: [
      {
        question: "MRR churn vs GRR: which should I track?",
        answer:
          "MRR churn focuses on cancellations (churned MRR). GRR includes both churn and downgrades (contraction). Track both for a complete loss picture.",
      },
    ],
    relatedGuideSlugs: ["mrr-churn-rate-guide", "churn-guide", "mrr-guide"],
    relatedCalculatorSlugs: ["mrr-churn-rate-calculator", "mrr-waterfall-calculator"],
  },
  {
    slug: "mrr-growth-rate",
    title: "MRR Growth Rate",
    description:
      "MRR growth rate measures how MRR changed between two points in time. It can be expressed as period growth, CMGR, or annualized growth.",
    formula: "MRR growth (period) = (end MRR - start MRR) / start MRR",
    bullets: [
      "Use CMGR to compare growth across different horizons.",
      "Use an MRR waterfall to explain drivers (new vs expansion vs churn).",
      "Pair growth with retention (NRR/GRR) and payback to judge quality.",
    ],
    relatedGuideSlugs: ["mrr-growth-rate-guide", "mrr-guide"],
    relatedCalculatorSlugs: ["mrr-growth-rate-calculator", "mrr-waterfall-calculator"],
  },
  {
    slug: "arr-waterfall",
    title: "ARR Waterfall",
    description:
      "An ARR waterfall reconciles starting ARR to ending ARR using new, expansion, contraction, and churned ARR movements.",
    formula:
      "Ending ARR = starting ARR + new ARR + expansion ARR - contraction ARR - churned ARR",
    bullets: [
      "Use it as a reporting bridge to compute net new ARR and ARR growth.",
      "Segment by plan/channel/customer size to avoid blended averages hiding churn pockets.",
      "Use net new ARR as the numerator base for burn multiple (same period).",
    ],
    relatedGuideSlugs: ["arr-waterfall-guide", "net-new-arr-guide"],
    relatedCalculatorSlugs: ["arr-waterfall-calculator", "net-new-arr-calculator"],
  },
  {
    slug: "customer-lifetime",
    title: "Customer Lifetime",
    description:
      "Customer lifetime is the expected duration a customer stays subscribed. It's often approximated from churn rate (with consistent time units).",
    formula: "Customer lifetime ~ 1 / churn rate",
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
      "Track MQL->SQL and SQL->Closed rates to find funnel bottlenecks.",
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
    slug: "pipeline-coverage",
    title: "Pipeline Coverage",
    description:
      "Pipeline coverage is pipeline value divided by quota for a time window. It's a sanity check that you have enough opportunity value to produce the target outcome given your win rate.",
    formula: "Pipeline coverage = pipeline / quota",
    bullets: [
      "Use time-bound pipeline (closing in the period), not all open opportunities.",
      "A rough rule: coverage ~ 1 / win rate (then add buffer for slippage).",
      "Segment by deal size and stage because win rates differ.",
    ],
    mistakes: [
      "Counting unqualified early-stage deals as real pipeline (inflates coverage).",
      "Using a win rate from a different stage definition.",
      "Ignoring sales cycle length and timing (coverage must match the period).",
    ],
    relatedGuideSlugs: [
      "pipeline-coverage-guide",
      "pipeline-required-guide",
      "pipeline-coverage-sales-cycle-guide",
    ],
    relatedCalculatorSlugs: ["pipeline-coverage-calculator", "pipeline-required-calculator"],
  },
  {
    slug: "win-rate",
    title: "Win Rate",
    description:
      "Win rate is the fraction of opportunities that convert to closed-won. It can be measured by count or by value and varies by stage definition.",
    formula: "Win rate = wins / opportunities (same stage definition)",
    bullets: [
      "Always specify the stage definition (e.g., SQL->Won vs Opp->Won).",
      "Track by segment (ACV band, channel, region) because blended win rate hides problems.",
    ],
    mistakes: [
      "Mixing win rate from one stage definition with pipeline from another.",
      "Using a short window that undercounts late closes (seasonality/timing).",
    ],
    relatedGuideSlugs: [
      "pipeline-coverage-guide",
      "pipeline-required-guide",
      "pipeline-coverage-sales-cycle-guide",
      "sales-funnel-targets-guide",
    ],
    relatedCalculatorSlugs: [
      "pipeline-coverage-calculator",
      "pipeline-required-calculator",
      "sales-funnel-targets-calculator",
    ],
  },
  {
    slug: "quota",
    title: "Sales Quota",
    description:
      "Sales quota is a target revenue amount for a rep/team over a time period (monthly/quarterly/annual). Quota is used for planning, compensation, and forecasting.",
    bullets: [
      "Keep quota time units consistent with booked/attainment reporting.",
      "Pair quota with pipeline coverage and win rate for forecasting.",
    ],
    mistakes: [
      "Comparing annual quota to monthly bookings (unit mismatch).",
      "Using quota as the only forecast signal (deal timing is lumpy).",
    ],
    relatedGuideSlugs: ["quota-attainment-guide", "sales-capacity-guide", "ote-guide"],
    relatedCalculatorSlugs: [
      "quota-attainment-calculator",
      "sales-capacity-calculator",
      "ote-commission-rate-calculator",
    ],
  },
  {
    slug: "quota-attainment",
    title: "Quota Attainment",
    description:
      "Quota attainment is booked revenue divided by quota for a period. It's used to track progress toward targets and to manage pacing.",
    formula: "Attainment = booked / quota",
    bullets: [
      "Use pacing to project end-of-period, but cross-check with pipeline and win rate.",
      "Segment by rep and region to identify risks early.",
    ],
    mistakes: [
      "Overreacting to pacing without pipeline context.",
      "Mixing bookings/ARR/ACV definitions across reports.",
    ],
    relatedGuideSlugs: ["quota-attainment-guide"],
    relatedCalculatorSlugs: ["quota-attainment-calculator"],
  },
  {
    slug: "sales-ramp",
    title: "Sales Ramp",
    description:
      "Sales ramp is the time and productivity curve it takes for a new sales rep to reach full quota productivity. Ramp affects capacity, forecasting, and hiring plans.",
    bullets: [
      "Use historical ramp cohorts (month 1/2/3) instead of a single assumption.",
      "Ramp often differs by segment and motion (SMB vs enterprise).",
    ],
    mistakes: [
      "Assuming new hires are fully productive immediately.",
      "Using a single ramp assumption across very different roles/territories.",
    ],
    relatedGuideSlugs: ["sales-capacity-guide"],
    relatedCalculatorSlugs: ["sales-capacity-calculator"],
  },
  {
    slug: "ote",
    title: "OTE (On-target Earnings)",
    description:
      "OTE (on-target earnings) is total sales compensation at 100% quota attainment: base pay plus target variable pay.",
    formula: "OTE = base pay + variable pay (at 100% attainment)",
    bullets: [
      "Use OTE and quota to estimate a simplified commission rate (variable / quota).",
      "Keep time units consistent (annual OTE with annual quota).",
    ],
    mistakes: [
      "Mixing annual OTE with quarterly quota (unit mismatch).",
      "Ignoring accelerators/decels when comparing comp plans.",
    ],
    relatedGuideSlugs: ["ote-guide"],
    relatedCalculatorSlugs: ["ote-commission-rate-calculator"],
  },
  {
    slug: "sales-cycle",
    title: "Sales Cycle Length",
    description:
      "Sales cycle length is the time from first touch or opportunity creation to close. It impacts CAC payback and forecasting.",
    example:
      "If your median sales cycle is 90 days, the cash you spend on acquisition today may not convert into customers (and revenue) until a quarter later.",
    bullets: [
      "Longer cycles increase cash needs and make payback slower in practice.",
      "Track by segment (SMB vs enterprise) because cycles differ.",
    ],
    mistakes: [
      "Using one blended sales cycle for all segments and channels.",
      "Ignoring sales cycle when comparing CAC payback across channels (timing matters).",
    ],
    relatedGuideSlugs: [
      "sales-capacity-guide",
      "pipeline-coverage-sales-cycle-guide",
      "unit-economics-hub-guide",
    ],
    relatedCalculatorSlugs: ["sales-capacity-calculator", "cac-payback-period-calculator"],
  },
  {
    slug: "net-dollar-retention",
    title: "NDR (Net Dollar Retention)",
    description:
      "NDR is another name for NRR in dollar terms. It measures how existing revenue changes including expansion.",
    formula:
      "NDR = (starting revenue + expansion - contraction - churn) / starting revenue",
    example:
      "If starting revenue is $100k, expansion is $20k, contraction is $5k, and churn is $10k, NDR = ($100k+$20k-$5k-$10k)/$100k = 105%.",
    relatedGuideSlugs: ["nrr-guide", "nrr-vs-grr-guide", "retention-churn-hub-guide"],
    relatedCalculatorSlugs: ["nrr-calculator", "nrr-vs-grr-calculator"],
  },
];

export const termsSaas: GlossaryTerm[] = seeds.map(makeTerm);
