import type { Guide } from "./types";

export const guides: Guide[] = [
  {
    slug: "roas-guide",
    title: "ROAS: What it is and how to use it",
    description:
      "A practical guide to ROAS (Return on Ad Spend): definitions, formulas, benchmarks, and common pitfalls.",
    category: "paid-ads",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["roas-calculator", "roi-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ROAS measures how much revenue you generate per dollar spent on ads. It's commonly used for paid social and search because it's fast to compute and easy to compare across campaigns.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "ROAS = revenue attributed to ads / ad spend" },
      { type: "h2", text: "Benchmarks (rule of thumb)" },
      {
        type: "bullets",
        items: [
          "Higher ROAS is not always better: very high ROAS can mean you're under-spending on a scalable campaign.",
          "A 'good' ROAS depends on gross margin and fulfillment costs. Tie ROAS targets to contribution margin, not vanity numbers.",
          "Compare ROAS within the same attribution model and time window.",
        ],
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Mixing attribution windows (e.g., platform 7-day click vs analytics last-click).",
          "Ignoring refunds, discounts, shipping, payment fees, and COGS.",
          "Using short windows for products with long consideration cycles.",
        ],
      },
      { type: "h2", text: "What to use alongside ROAS" },
      {
        type: "bullets",
        items: [
          "Gross margin / contribution margin (profit matters).",
          "CAC and payback period for subscription businesses.",
          "Incrementality tests for mature accounts (geo holdout, conversion lift).",
        ],
      },
    ],
    faqs: [
      {
        question: "What's the difference between ROAS and ROI?",
        answer:
          "ROAS is revenue divided by ad spend. ROI is profit relative to total cost. ROAS can look great while ROI is negative if margins or costs are poor.",
      },
      {
        question: "Can ROAS be used for subscription businesses?",
        answer:
          "Yes, but it's often better to pair ROAS with CAC, payback period, and LTV since revenue may recur over time and churn matters.",
      },
    ],
    examples: [
      {
        label: "Ecommerce example ($5,000 revenue; $1,000 spend)",
        calculatorSlug: "roas-calculator",
        params: { revenue: "5000", adSpend: "1000" },
        note: "A quick sanity-check for ROAS and a shareable example link.",
      },
    ],
  },
  {
    slug: "roi-guide",
    title: "ROI vs ROAS: definitions, formulas, and when to use each",
    description:
      "A concise guide to ROI and ROAS: what each metric measures, how to interpret results, and pitfalls in cost attribution.",
    category: "paid-ads",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["roi-calculator", "roas-calculator"],
    sections: [
      { type: "h2", text: "The difference" },
      {
        type: "bullets",
        items: [
          "ROAS focuses on revenue per ad dollar: revenue / ad spend.",
          "ROI focuses on profit relative to total cost: (revenue - cost) / cost.",
          "A high ROAS can still have a negative ROI if margins or costs are poor.",
        ],
      },
      { type: "h2", text: "When to use ROAS" },
      {
        type: "bullets",
        items: [
          "Channel/campaign optimization when you have stable margins and costs.",
          "Topline testing, creative iteration, and early funnel comparisons.",
          "When profit data is hard to attribute cleanly at campaign level.",
        ],
      },
      { type: "h2", text: "When to use ROI" },
      {
        type: "bullets",
        items: [
          "Budget allocation across initiatives (ads vs content vs partnerships).",
          "When you can include incremental costs reliably (fees, labor, tools).",
          "When profitability, not just revenue, is the decision metric.",
        ],
      },
      { type: "h2", text: "Attribution pitfalls" },
      {
        type: "bullets",
        items: [
          "Use the same attribution model and window for comparisons.",
          "Avoid mixing platform-reported conversions with last-click analytics without a clear rule.",
          "For mature accounts, validate with incrementality tests when possible.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I always prefer ROAS over ROI?",
        answer:
          "No. ROAS is fast for channel optimization, but ROI is better for comparing initiatives when you can attribute costs reliably.",
      },
    ],
    examples: [
      {
        label: "Campaign example ($5,000 revenue; $3,000 cost)",
        calculatorSlug: "roi-calculator",
        params: { revenue: "5000", cost: "3000" },
      },
    ],
  },
  {
    slug: "break-even-roas-guide",
    title: "Break-even ROAS: how to calculate it (and set a target ROAS)",
    description:
      "Learn how break-even ROAS works using contribution margin, what to include in the model, and how to turn it into a realistic target ROAS.",
    category: "paid-ads",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["break-even-roas-calculator", "roas-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Break-even ROAS is the minimum ROAS needed so your variable contribution profit is not negative. It's a floor, not a growth target.",
      },
      { type: "h2", text: "Contribution margin model" },
      {
        type: "p",
        text: "Contribution margin ~= gross margin - payment fees - shipping/fulfillment - returns/refunds (all as % of revenue).",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Break-even ROAS = 1 / contribution margin.",
      },
      { type: "h2", text: "What to include (practical)" },
      {
        type: "bullets",
        items: [
          "Include costs that scale with revenue (fees, fulfillment, returns).",
          "Do not include fixed costs here; handle them by setting a higher target ROAS.",
          "Keep assumptions consistent across campaigns so comparisons are fair.",
        ],
      },
      { type: "h2", text: "Turning break-even into a target ROAS" },
      {
        type: "bullets",
        items: [
          "Add a buffer for fixed costs and desired profit (e.g., 20-50% above break-even).",
          "Use different targets per channel based on volatility and scalability.",
          "Validate with incrementality tests as spend scales.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why does my break-even ROAS look too high?",
        answer:
          "It usually means contribution margin is low after fees/shipping/returns. Double-check gross margin and whether you are double-counting costs.",
      },
      {
        question: "Should I use break-even ROAS for subscription businesses?",
        answer:
          "For subscriptions, break-even ROAS on first purchase can be misleading. Consider CAC, payback period, and LTV instead, or model break-even on contribution profit over time.",
      },
    ],
    examples: [
      {
        label: "Example (60% margin; 3% fees; 0% shipping; 0% returns)",
        calculatorSlug: "break-even-roas-calculator",
        params: {
          grossMarginPercent: "60",
          paymentFeesPercent: "3",
          shippingPercent: "0",
          returnsPercent: "0",
        },
        note: "A common baseline for digital goods or light fulfillment costs.",
      },
    ],
  },
  {
    slug: "target-roas-guide",
    title: "Target ROAS: how to set a realistic ROAS goal",
    description:
      "A practical guide to target ROAS: use contribution margin and allocations for fixed costs and profit to set a ROAS goal that fits your business.",
    category: "paid-ads",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: [
      "target-roas-calculator",
      "break-even-roas-calculator",
      "roas-calculator",
    ],
    sections: [
      { type: "h2", text: "Break-even vs target ROAS" },
      {
        type: "bullets",
        items: [
          "Break-even ROAS is the minimum ROAS to avoid losses on variable costs.",
          "Target ROAS is higher: it should also cover fixed costs and desired profit (or a safety buffer).",
          "Targets can vary by channel depending on volatility and scalability.",
        ],
      },
      { type: "h2", text: "A simple planning model" },
      {
        type: "p",
        text: "Start from contribution margin (gross margin minus variable costs). Decide what percent of revenue must cover fixed costs and profit. The remainder is the maximum ad spend as a percent of revenue.",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Target ROAS = 1 / (contribution margin - fixed allocation - desired profit).",
      },
      { type: "h2", text: "How to choose allocations" },
      {
        type: "bullets",
        items: [
          "Fixed cost allocation: total fixed costs / expected revenue for the same period (as a %).",
          "Desired profit: your safety buffer or target profitability (as a %).",
          "If the result is unrealistic, improve margin or reduce allocations rather than forcing a low ROAS target.",
        ],
      },
      { type: "h2", text: "Use targets responsibly" },
      {
        type: "bullets",
        items: [
          "Avoid changing definitions week-to-week; keep targets comparable.",
          "Use incrementality tests when scaling spend to validate true impact.",
          "Pair ROAS targets with CAC/payback for subscription businesses.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use a single target ROAS for all channels?",
        answer:
          "Not necessarily. Channels differ in volatility and intent. Many teams use different targets by channel while keeping the same definition of contribution margin.",
      },
      {
        question: "What if my target ROAS is extremely high?",
        answer:
          "Your contribution margin may be low after fees/shipping/returns, or your fixed/profit allocations may be too high for current economics. Re-check assumptions first.",
      },
    ],
    examples: [
      {
        label: "Example (60% margin; 3% fees; 10% fixed; 10% profit)",
        calculatorSlug: "target-roas-calculator",
        params: {
          grossMarginPercent: "60",
          paymentFeesPercent: "3",
          shippingPercent: "0",
          returnsPercent: "0",
          fixedCostPercent: "10",
          desiredProfitPercent: "10",
        },
        note: "A quick planning target that includes fixed costs and a profit buffer.",
      },
    ],
  },
  {
    slug: "cac-guide",
    title: "CAC: How to calculate Customer Acquisition Cost",
    description:
      "Learn how to define and calculate CAC, what to include in costs, and how to segment CAC for better decisions.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: [
      "cac-calculator",
      "ltv-to-cac-calculator",
      "cac-payback-period-calculator",
    ],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "CAC (Customer Acquisition Cost) is the cost to acquire a new paying customer. It's a core unit economics metric for SaaS and subscription businesses.",
      },
      { type: "h2", text: "Core formula" },
      { type: "p", text: "CAC = acquisition spend / new customers acquired" },
      { type: "h2", text: "What costs to include" },
      {
        type: "bullets",
        items: [
          "Paid media (ad spend), agencies, creative production (if variable).",
          "Sales/marketing tools (CRM, email, analytics) if you include them consistently.",
          "Salaries/commissions: include if you want a fully-loaded CAC (recommended for planning).",
        ],
      },
      { type: "h2", text: "How to segment CAC" },
      {
        type: "bullets",
        items: [
          "By channel (paid search, paid social, partners, outbound).",
          "By customer segment (SMB vs mid-market vs enterprise).",
          "By cohort (month acquired) to see how CAC changes with scale.",
        ],
      },
      { type: "h2", text: "What to pair with CAC" },
      {
        type: "bullets",
        items: [
          "LTV and LTV:CAC to understand sustainability.",
          "Payback period to understand cash efficiency.",
          "Churn/retention to validate that customers stick around long enough.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should CAC include salaries?",
        answer:
          "For planning and true unit economics, many teams use fully-loaded CAC (including salaries/tools). For channel optimization, paid-only CAC can be useful if you keep the definition consistent.",
      },
      {
        question: "Should I use lead CAC or customer CAC?",
        answer:
          "Use customer CAC for unit economics. Lead CAC can help diagnose funnel performance but isn't directly comparable to LTV.",
      },
    ],
    examples: [
      {
        label: "Marketing spend example ($20,000; 40 new customers)",
        calculatorSlug: "cac-calculator",
        params: { spend: "20000", newCustomers: "40" },
      },
    ],
  },
  {
    slug: "ltv-guide",
    title: "LTV: How to estimate Lifetime Value (and when not to)",
    description:
      "A practical LTV guide: quick models vs cohort-based LTV, unit consistency, and pitfalls with churn and gross margin.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: [
      "ltv-calculator",
      "ltv-to-cac-calculator",
      "cac-payback-period-calculator",
    ],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "LTV (Lifetime Value) is the gross profit you expect to earn from a customer over their lifetime. The best LTV models are cohort-based, but simple formulas are useful for fast planning.",
      },
      { type: "h2", text: "A common quick model" },
      {
        type: "p",
        text: "LTV ~= (ARPA * gross margin) / churn rate (with consistent time units).",
      },
      { type: "h2", text: "Make sure your units match" },
      {
        type: "bullets",
        items: [
          "Monthly ARPA must use monthly churn; annual churn must use annual ARPA.",
          "Gross margin should reflect COGS, not operating expenses.",
          "If you use revenue churn (NRR/GRR), label it clearly; don't mix with customer churn.",
        ],
      },
      { type: "h2", text: "When the quick model breaks" },
      {
        type: "bullets",
        items: [
          "Expansion revenue is significant (upsells/cross-sells).",
          "Churn changes over time (early churn vs long-term retention).",
          "Different segments have very different retention curves.",
        ],
      },
      { type: "h2", text: "What to pair with LTV" },
      {
        type: "bullets",
        items: [
          "CAC and payback period for growth planning.",
          "NRR/GRR for revenue retention and expansion effects.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is LTV the same as revenue per customer?",
        answer:
          "Not necessarily. LTV is ideally based on gross profit over time, not just revenue, and depends on retention/churn.",
      },
      {
        question: "What churn should I use?",
        answer:
          "Use customer churn for a simple model, but consider revenue churn (NRR/GRR) if expansion and downgrades matter for your business.",
      },
    ],
    examples: [
      {
        label: "SaaS example (ARPA $200; margin 80%; churn 3%)",
        calculatorSlug: "ltv-calculator",
        params: {
          arpaMonthly: "200",
          grossMarginPercent: "80",
          churnPercent: "3",
        },
      },
    ],
  },
  {
    slug: "cac-payback-guide",
    title: "CAC Payback Period: What it means and how to improve it",
    description:
      "Understand CAC payback: calculation, benchmarks, and levers to improve payback through pricing, margin, and retention.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["cac-payback-period-calculator", "cac-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "CAC payback period estimates how long it takes to earn back the acquisition cost from monthly gross profit. Shorter payback generally means better cash efficiency.",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Payback (months) = CAC / (ARPA * gross margin).",
      },
      { type: "h2", text: "Benchmarks (rule of thumb)" },
      {
        type: "bullets",
        items: [
          "B2B SaaS often targets 6-18 months, depending on stage and burn.",
          "Long payback can work if churn is low and gross margin is high.",
          "Short payback reduces risk when channels fluctuate.",
        ],
      },
      { type: "h2", text: "Ways to improve payback" },
      {
        type: "bullets",
        items: [
          "Reduce CAC (channel mix, conversion rate optimization, sales efficiency).",
          "Increase ARPA (pricing, packaging, expansion).",
          "Improve gross margin (COGS reduction, infrastructure efficiency).",
          "Reduce churn (activation, support, product reliability).",
        ],
      },
    ],
    faqs: [
      {
        question: "What's a good CAC payback period?",
        answer:
          "It varies by business model and growth stage, but many SaaS businesses aim for roughly 6-18 months. Shorter is usually safer for cash efficiency.",
      },
    ],
    examples: [
      {
        label: "Payback example (CAC $500; ARPA $200; margin 80%)",
        calculatorSlug: "cac-payback-period-calculator",
        params: { cac: "500", arpaMonthly: "200", grossMarginPercent: "80" },
      },
    ],
  },
  {
    slug: "churn-guide",
    title: "Churn: How to measure churn rate correctly",
    description:
      "A guide to churn rate: customer churn vs revenue churn, measurement choices, and how to track churn by cohort.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["churn-rate-calculator", "retention-rate-calculator"],
    sections: [
      { type: "h2", text: "Customer churn vs revenue churn" },
      {
        type: "bullets",
        items: [
          "Customer churn = customers lost / customers at start.",
          "Revenue churn looks at MRR lost; NRR/GRR capture expansion and contraction.",
          "Use customer churn for product retention; use revenue churn for business health.",
        ],
      },
      { type: "h2", text: "Choose a consistent period" },
      {
        type: "bullets",
        items: [
          "Monthly is common for early-stage SaaS; quarterly for enterprise.",
          "Keep start/end definitions consistent (e.g., start-of-month snapshot).",
          "Exclude trial users unless they are part of your definition.",
        ],
      },
      { type: "h2", text: "Track churn by cohort" },
      {
        type: "bullets",
        items: [
          "Cohorts reveal where churn happens (first month vs month 6+).",
          "Segment cohorts by acquisition channel and plan.",
          "Separate involuntary churn (failed payments) from voluntary churn.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which churn should I track?",
        answer:
          "Track both customer churn and revenue churn (NRR/GRR). Customer churn reflects retention; revenue churn reflects business health when expansion exists.",
      },
    ],
    examples: [
      {
        label: "Monthly churn example (start 1,000; lost 30)",
        calculatorSlug: "churn-rate-calculator",
        params: { startingCustomers: "1000", lostCustomers: "30" },
      },
    ],
  },
  {
    slug: "retention-guide",
    title: "Retention rate: how to measure retention correctly",
    description:
      "Learn retention rate definitions, how it differs from churn, and how to measure retention by cohort and segment.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["retention-rate-calculator", "churn-rate-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Retention rate measures how many customers (or users) you keep over a period. A common customer retention definition accounts for new customers so you measure true retention rather than growth.",
      },
      { type: "h2", text: "A practical formula" },
      {
        type: "p",
        text: "Retention rate = (customers at end - new customers) / customers at start.",
      },
      { type: "h2", text: "Retention vs churn" },
      {
        type: "bullets",
        items: [
          "Churn focuses on who you lost; retention focuses on who stayed.",
          "Customer retention differs from revenue retention (NRR/GRR) when expansion is significant.",
          "Pick one definition and keep it consistent across reports.",
        ],
      },
      { type: "h2", text: "Measure by cohort" },
      {
        type: "bullets",
        items: [
          "Cohorts show where the retention curve drops (activation and early lifecycle).",
          "Segment cohorts by plan, industry, and acquisition channel.",
          "Track leading indicators like usage, time-to-value, and support contacts.",
        ],
      },
    ],
  },
  {
    slug: "arpu-guide",
    title: "ARPU: how to use Average Revenue Per User effectively",
    description:
      "A guide to ARPU: definitions, segmentation ideas, and how ARPU interacts with retention and LTV.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["arpu-calculator", "ltv-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARPU (Average Revenue Per User) is revenue divided by average active users in a period. It's useful for tracking monetization and pricing performance over time.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "ARPU = revenue / average active users" },
      { type: "h2", text: "How to segment ARPU" },
      {
        type: "bullets",
        items: [
          "By plan/tier to see packaging performance.",
          "By acquisition channel to understand lead quality and upsell potential.",
          "By geography to reflect different pricing and payment behaviors.",
        ],
      },
      { type: "h2", text: "Pair ARPU with retention" },
      {
        type: "bullets",
        items: [
          "ARPU + churn roughly determines LTV in simple models.",
          "If ARPU rises but churn rises too, you may be pricing out the wrong segments.",
          "Look for stable ARPU growth without degrading retention cohorts.",
        ],
      },
    ],
  },
  {
    slug: "mrr-guide",
    title: "MRR: what it means (and how to track it cleanly)",
    description:
      "A guide to MRR: definitions, what to include/exclude, and how to decompose MRR changes over time.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["mrr-calculator", "arr-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "MRR (Monthly Recurring Revenue) is the recurring revenue you expect from active subscriptions in a month. It's the standard momentum metric for subscription businesses.",
      },
      { type: "h2", text: "What to include" },
      {
        type: "bullets",
        items: [
          "Recurring subscription charges (normalized to monthly).",
          "Exclude one-time fees and services revenue from MRR.",
          "For annual plans, count monthly equivalent (annual price / 12).",
        ],
      },
      { type: "h2", text: "MRR movement breakdown" },
      {
        type: "bullets",
        items: [
          "New MRR, Expansion MRR, Contraction MRR, Churned MRR.",
          "Track net new MRR to understand growth rate and efficiency.",
          "Cohort MRR helps separate price/upsell from retention effects.",
        ],
      },
    ],
  },
  {
    slug: "arr-guide",
    title: "ARR: how to think about Annual Recurring Revenue",
    description:
      "ARR is a useful snapshot, but it's easy to misuse. Learn what ARR is (and isn't), and how it differs from bookings and cash.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["arr-calculator", "mrr-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARR (Annual Recurring Revenue) is MRR annualized (MRR * 12). It's an annualized run-rate snapshot, not a promise of revenue.",
      },
      { type: "h2", text: "ARR vs bookings vs cash" },
      {
        type: "bullets",
        items: [
          "ARR measures recurring run-rate; bookings measure contracted value; cash measures receipts.",
          "For annual prepay, cash can be high while ARR grows more steadily.",
          "Use ARR for comparability across SaaS businesses; use cash for runway planning.",
        ],
      },
      { type: "h2", text: "Pitfalls" },
      {
        type: "bullets",
        items: [
          "Counting services revenue as ARR inflates true recurring run-rate.",
          "Ignoring churn/retention when annualizing short-term MRR spikes.",
        ],
      },
    ],
  },
  {
    slug: "ltv-cac-guide",
    title: "LTV:CAC ratio: how to interpret the ratio (and avoid mistakes)",
    description:
      "Learn what LTV:CAC tells you, rough benchmarks, and how churn and payback change what 'good' looks like.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: [
      "ltv-to-cac-calculator",
      "ltv-calculator",
      "cac-calculator",
    ],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "LTV:CAC compares the lifetime value you earn to the cost to acquire a customer.",
      },
      { type: "h2", text: "Benchmarks (rule of thumb)" },
      {
        type: "bullets",
        items: [
          "~3:1 is a common target for many SaaS businesses.",
          "Very high ratios can mean you're under-investing in growth.",
          "Lower ratios can be acceptable with short payback and strong retention.",
        ],
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Using inconsistent definitions for CAC (fully-loaded vs paid-only).",
          "Using revenue LTV but comparing to fully-loaded CAC (mismatched bases).",
          "Ignoring payback period and cash constraints.",
        ],
      },
    ],
  },
  {
    slug: "break-even-guide",
    title: "Break-even revenue: calculate your break-even point",
    description:
      "Understand break-even revenue with gross margin and fixed costs, plus tips for improving contribution margin and pricing.",
    category: "finance",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["break-even-revenue-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Break-even revenue is the revenue required to cover your fixed costs given your gross margin. It's a quick way to understand the minimum revenue needed to avoid losses.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "Break-even revenue = fixed costs / gross margin" },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Using net margin instead of gross/contribution margin.",
          "Forgetting overhead items that are effectively fixed (core tools, base salaries).",
          "Not updating the model after pricing or COGS changes.",
        ],
      },
      { type: "h2", text: "How to improve break-even" },
      {
        type: "bullets",
        items: [
          "Increase gross margin (reduce COGS, improve infrastructure efficiency).",
          "Increase prices or move customers to higher tiers where value supports it.",
          "Reduce fixed costs carefully (avoid harming retention or delivery).",
        ],
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
