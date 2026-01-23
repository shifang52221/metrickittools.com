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
    slug: "paid-ads-funnel-guide",
    title: "Paid ads funnel: CPM, CTR, CVR → CPC, CPA, ROAS (with profit)",
    description:
      "A practical guide to the paid ads funnel: how CPM, CTR, and CVR drive CPC, CPA, ROAS, and profit - with formulas and common pitfalls.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "paid-ads-funnel-calculator",
      "roas-calculator",
      "break-even-roas-calculator",
      "target-roas-calculator",
    ],
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
      "attribution-window",
    ],
    sections: [
      { type: "h2", text: "Why a funnel view helps" },
      {
        type: "p",
        text: "Ads performance often looks confusing because metrics overlap. A simple funnel makes the levers clear: CPM determines how much you pay for exposure, CTR converts exposure into visits, CVR converts visits into orders, and AOV plus margin determine whether ads are profitable.",
      },
      { type: "h2", text: "Core formulas (quick reference)" },
      {
        type: "bullets",
        items: [
          "Clicks per 1,000 impressions = 1000 × CTR.",
          "CPC = CPM ÷ (1000 × CTR).",
          "CPA = CPC ÷ CVR.",
          "ROAS = revenue ÷ ad spend.",
          "Contribution margin = gross margin − fees − shipping − returns (simplified).",
          "Break-even ROAS = 1 ÷ contribution margin.",
          "Break-even CPA = AOV × contribution margin.",
        ],
      },
      { type: "h2", text: "How to diagnose issues" },
      {
        type: "table",
        columns: ["If this is bad…", "Look at…", "Typical fixes"],
        rows: [
          ["High CPC", "CPM and CTR", "Improve creative fit, targeting, placements; reduce CPM; lift CTR."],
          ["High CPA", "CPC and CVR", "Fix landing page and offer; improve intent; reduce friction; better audience."],
          ["ROAS looks okay but profit is negative", "Contribution margin and returns/fees", "Use margin-aware targets; exclude low-margin products; reduce returns; increase AOV."],
          ["Great short-term ROAS but growth stalls", "Attribution and incrementality", "Test holdouts; avoid over-crediting retargeting; invest in prospecting."],
        ],
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Attribution windows differ across platforms; compare apples-to-apples.",
          "Revenue-based ROAS can hide low margins and high returns.",
          "Optimizing CTR can decrease intent and lower CVR.",
          "Retargeting often looks great in ROAS but can be incremental only partly.",
        ],
      },
      { type: "h2", text: "Best practice targets" },
      {
        type: "bullets",
        items: [
          "Start with contribution margin to compute break-even ROAS and break-even CPA.",
          "Set different targets by channel (volatility and intent differ).",
          "Revisit targets when margin, fees, or return rates change.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is break-even ROAS the same as target ROAS?",
        answer:
          "No. Break-even ROAS only covers variable economics. Target ROAS should be higher to cover fixed costs and desired profit.",
      },
    ],
    examples: [
      {
        label: "Funnel example (CPM $12; CTR 1.5%; CVR 3%; AOV $80; 60% margin)",
        calculatorSlug: "paid-ads-funnel-calculator",
        params: {
          cpm: "12",
          ctrPercent: "1.5",
          cvrPercent: "3",
          aov: "80",
          grossMarginPercent: "60",
          paymentFeesPercent: "3",
          shippingPercent: "0",
          returnsPercent: "0",
        },
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
    title: "CAC: how to calculate Customer Acquisition Cost (formula + examples)",
    description:
      "Customer acquisition cost (CAC) explained: formula, what to include, and practical CAC metrics (paid vs fully-loaded) you can trust.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
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
      { type: "h2", text: "CAC formula" },
      { type: "p", text: "CAC = acquisition spend ÷ new customers acquired" },
      { type: "h2", text: "How to calculate CAC (step-by-step)" },
      {
        type: "bullets",
        items: [
          "Pick a time window (usually monthly) and a segment (channel, plan, geo).",
          "Sum acquisition spend for that window (paid spend + variable acquisition costs).",
          "Count new paying customers acquired in that window (not leads or trials).",
          "Divide spend by new customers to get CAC.",
        ],
      },
      { type: "h2", text: "Benchmarks (rule of thumb)" },
      {
        type: "bullets",
        items: [
          "There is no universal 'good CAC' without knowing ARPA, margin, and retention.",
          "Use CAC payback (months) to compare channels more fairly when pricing differs.",
          "Track CAC by cohort: CAC often rises as channels saturate.",
        ],
      },
      { type: "h2", text: "CAC metrics (paid vs fully-loaded)" },
      {
        type: "bullets",
        items: [
          "Paid CAC: ad spend (and variable creative/agency) ÷ new customers (useful for channel optimization).",
          "Fully-loaded CAC: paid spend + sales/marketing salaries + tools ÷ new customers (useful for planning).",
          "Blended CAC: includes all acquisition sources (paid + organic + outbound). Always label the definition.",
        ],
      },
      { type: "h2", text: "What costs to include" },
      {
        type: "bullets",
        items: [
          "Paid media (ad spend), agencies, creative production (if variable).",
          "Sales/marketing tools (CRM, email, analytics) if you include them consistently.",
          "Salaries/commissions: include if you want a fully-loaded CAC (recommended for planning).",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using leads/trials as 'customers' (denominator mismatch).",
          "Comparing paid-only CAC to a fully-loaded CAC target (definition drift).",
          "Ignoring churn: low CAC can still be bad if customers churn quickly.",
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
        question: "How do you calculate customer acquisition cost?",
        answer:
          "Pick a time window, sum acquisition spend for that window, count new paying customers acquired, and divide spend by customers. Make sure the spend window matches the customer count window.",
      },
      {
        question: "What is the customer acquisition cost formula?",
        answer:
          "Customer acquisition cost (CAC) = acquisition spend ÷ new customers acquired. The key is defining what you include in spend (paid-only vs fully-loaded) and what counts as a new customer.",
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
    title: "CAC Payback Period (Months to Recover CAC): definition, formula, benchmarks",
    description:
      "Learn how to calculate CAC payback (months to recover CAC) using gross profit, plus benchmarks and levers to improve it.",
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
        text: "Payback (months) = CAC ÷ (ARPA × gross margin).",
      },
      { type: "h2", text: "How to calculate CAC payback" },
      {
        type: "bullets",
        items: [
          "Pick a period (usually month) and a segment (plan/channel/geo).",
          "Compute gross profit per month: ARPA × gross margin.",
          "Compute payback months: CAC ÷ gross profit per month.",
          "Compare across channels and cohorts, not just the blended average.",
        ],
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
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue instead of gross profit (payback should reflect contribution).",
          "Mixing gross margin definitions (product margin vs fully-loaded margin).",
          "Ignoring churn: long payback + high churn can be unprofitable.",
          "Treating annual prepay cash receipts as immediate payback without adjusting margin timing.",
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
      {
        question: "Is CAC payback the same as break-even?",
        answer:
          "Related, but different. Payback asks how long it takes to recover acquisition cost from gross profit. Break-even considers fixed costs and overall business expenses.",
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
    title: "How to calculate ARPU (Average Revenue Per User)",
    description:
      "ARPU calculation guide: definition, formula, worked example, and how to use ARPU with retention and LTV.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["arpu-calculator", "ltv-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARPU (Average Revenue Per User) is calculated as revenue ÷ average active users for a period. It's useful for tracking monetization and pricing performance over time.",
      },
      { type: "h2", text: "ARPU formula" },
      { type: "p", text: "ARPU = revenue ÷ average active users" },
      { type: "h2", text: "How to calculate ARPU (step-by-step)" },
      {
        type: "bullets",
        items: [
          "Choose a time window (month/quarter) and define what counts as 'active user'.",
          "Sum revenue for the same window (be consistent: gross vs net of refunds).",
          "Compute average active users (e.g., average of daily active users, or (start + end) ÷ 2).",
          "Divide revenue by average active users to get ARPU.",
        ],
      },
      { type: "h2", text: "Example" },
      {
        type: "p",
        text: "If you made $50,000 this month and had 2,000 average active users, ARPU = $50,000 ÷ 2,000 = $25 per user for the month.",
      },
      { type: "h2", text: "ARPU vs ARPA (SaaS)" },
      {
        type: "bullets",
        items: [
          "ARPU is usually per active user; ARPA (average revenue per account) is per paying account/customer.",
          "B2B SaaS often uses ARPA because pricing is per company (not per user).",
          "Be consistent: if your denominator is accounts, label it ARPA/ARPC instead of ARPU.",
        ],
      },
      { type: "h2", text: "How to segment ARPU" },
      {
        type: "bullets",
        items: [
          "By plan/tier to see packaging performance.",
          "By acquisition channel to understand lead quality and upsell potential.",
          "By geography to reflect different pricing and payment behaviors.",
        ],
      },
      { type: "h2", text: "What is a good ARPU?" },
      {
        type: "bullets",
        items: [
          "There is no universal benchmark. 'Good' depends on gross margin, CAC, and retention.",
          "A useful check is whether ARPU supports a reasonable CAC payback period for your growth stage.",
          "Compare ARPU by segment (plan/channel) rather than only the blended average.",
        ],
      },
      { type: "h2", text: "ARPU vs LTV" },
      {
        type: "bullets",
        items: [
          "ARPU is a per-period monetization metric; LTV is the expected value over the customer lifetime.",
          "A simple relationship is LTV ~= ARPA × gross margin ÷ churn rate (with consistent time units).",
          "Use ARPU/ARPA to track pricing; use LTV with CAC to evaluate unit economics.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing active users with total signups (denominator mismatch).",
          "Including free/trial users without a clear definition.",
          "Comparing ARPU across periods while changing pricing or activation criteria without segmentation.",
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
    faqs: [
      {
        question: "What is the ARPU formula?",
        answer:
          "ARPU (average revenue per user) = revenue ÷ average active users for the same period. The key is defining 'active user' consistently.",
      },
      {
        question: "What is a good ARPU?",
        answer:
          "It depends on your business model. A 'good' ARPU is one that supports healthy unit economics: reasonable CAC payback, strong gross margin, and retention that makes LTV exceed CAC by a comfortable margin.",
      },
      {
        question: "ARPU vs ARPA: which should I use?",
        answer:
          "ARPU is per user. ARPA is per account. If you sell to companies with multiple seats, ARPA often matches how you price and report. If you sell per-seat, ARPU can be more natural.",
      },
      {
        question: "How does ARPU relate to LTV?",
        answer:
          "ARPU/ARPA is the per-period revenue, while LTV considers the whole customer lifetime. LTV models usually combine ARPA, gross margin, and retention/churn to estimate total value over time.",
      },
      {
        question: "Should ARPU use revenue or gross profit?",
        answer:
          "ARPU is usually revenue-based. For unit economics decisions, also compute gross profit per user (revenue × gross margin) to reflect profitability.",
      },
    ],
    examples: [
      {
        label: "Monthly example ($50,000 revenue; 2,000 avg users)",
        calculatorSlug: "arpu-calculator",
        params: { revenue: "50000", avgUsers: "2000" },
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
    title: "Bookings vs ARR: what ARR means (and what it doesn't)",
    description:
      "Bookings vs ARR explained: what ARR is (and isn't), plus how it differs from bookings and cash receipts.",
    category: "saas-metrics",
    updatedAt: "2026-01-05",
    relatedCalculatorSlugs: ["arr-calculator", "mrr-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "ARR (Annual Recurring Revenue) is MRR annualized (MRR * 12). It's an annualized run-rate snapshot, not a promise of revenue.",
      },
      { type: "h2", text: "Bookings vs ARR (and cash)" },
      {
        type: "bullets",
        items: [
          "ARR measures recurring run-rate; bookings measure contracted value; cash measures receipts.",
          "For annual prepay, cash can be high while ARR grows more steadily.",
          "Use ARR for comparability across SaaS businesses; use cash for runway planning.",
        ],
      },
      { type: "h2", text: "Bookings vs ARR vs cash: quick comparison" },
      {
        type: "table",
        columns: ["Metric", "What it measures", "When to use", "Common mistake"],
        rows: [
          [
            "ARR",
            "Recurring run-rate (typically MRR × 12). Excludes one-time fees/services.",
            "Comparing SaaS scale and momentum across time or companies.",
            "Treating ARR as guaranteed annual revenue or including services revenue.",
          ],
          [
            "Bookings",
            "Contracted value closed in a period (may include prepay, one-time fees, services).",
            "Sales performance, pipeline conversion, and forecasting contracted demand.",
            "Assuming bookings equals recurring run-rate or comparing bookings to ARR without adjusting for one-time items.",
          ],
          [
            "Cash",
            "Money collected (cash receipts). Sensitive to billing terms and prepay timing.",
            "Runway planning and cash-flow management.",
            "Using cash spikes from annual prepay as proof of recurring growth without checking retention and renewals.",
          ],
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
      { type: "h2", text: "Examples (annual prepay vs monthly)" },
      {
        type: "bullets",
        items: [
          "Annual prepay: cash may spike today, while ARR reflects ongoing run-rate (MRR × 12).",
          "A large annual contract can increase bookings immediately even if ARR only increases as recurring run-rate grows.",
          "If you add one-time services to a deal, bookings rise but ARR should not include the services portion.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is bookings?",
        answer:
          "Bookings are the value of contracts you sign in a period. Bookings can include recurring subscriptions and non-recurring items (services, setup fees) depending on how you define it.",
      },
      {
        question: "Why can bookings be higher than ARR?",
        answer:
          "Bookings often include the full contract value (including one-time or non-recurring items), while ARR is a recurring run-rate snapshot. A big annual prepay can increase bookings and cash immediately, while ARR reflects recurring value over time.",
      },
      {
        question: "Is ARR the same as annual revenue?",
        answer:
          "Not always. ARR is a recurring run-rate snapshot. Annual revenue can include one-time fees or services, and it reflects what you recognized over a year rather than a current run-rate.",
      },
      {
        question: "How does annual prepay affect ARR?",
        answer:
          "Annual prepay increases cash receipts immediately, but ARR reflects recurring run-rate. ARR typically increases based on the recurring subscription amount, not the timing of cash collection.",
      },
    ],
    examples: [
      {
        label: "ARR example (250 customers; $200 ARPA/month)",
        calculatorSlug: "arr-calculator",
        params: { customers: "250", arpaMonthly: "200" },
      },
      {
        label: "ARR valuation example ($2.4M ARR; 6× multiple)",
        calculatorSlug: "arr-valuation-calculator",
        params: { arr: "2400000", multiple: "6" },
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
    slug: "nrr-guide",
    title: "NRR (Net Revenue Retention): definition, formula, how to calculate",
    description:
      "NRR explained: what net revenue retention measures, the NRR formula, how to calculate it by cohort, and common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["nrr-calculator", "grr-calculator"],
    sections: [
      { type: "h2", text: "What NRR measures" },
      {
        type: "p",
        text: "NRR (Net Revenue Retention) measures how revenue from an existing customer cohort changes over a period, including expansion, contraction, and churn. It answers a simple question: after customers start, do they grow, shrink, or leave?",
      },
      { type: "h2", text: "NRR formula" },
      {
        type: "p",
        text: "NRR = (starting MRR + expansion − contraction − churn) ÷ starting MRR",
      },
      { type: "h2", text: "Components (quick reference)" },
      {
        type: "table",
        columns: ["Component", "What it is", "Example"],
        rows: [
          [
            "Starting MRR",
            "Recurring revenue from the cohort at the start of the window.",
            "Cohort starts the month at $100k MRR.",
          ],
          [
            "Expansion",
            "Upgrades, more seats, add-ons, usage growth for existing customers.",
            "+$15k expansion MRR",
          ],
          [
            "Contraction",
            "Downgrades, seat reductions, usage decreases (not full churn).",
            "−$5k contraction MRR",
          ],
          [
            "Churn",
            "Lost recurring revenue from cancellations.",
            "−$8k churned MRR",
          ],
        ],
      },
      { type: "h2", text: "How to calculate NRR (step-by-step)" },
      {
        type: "bullets",
        items: [
          "Pick a cohort and a time window (monthly or quarterly are common).",
          "Measure starting MRR for that cohort at the beginning of the window.",
          "Measure expansion, contraction, and churned MRR for the cohort over the window.",
          "Compute ending MRR = starting + expansion − contraction − churn.",
          "Compute NRR = ending MRR ÷ starting MRR.",
        ],
      },
      { type: "h2", text: "NRR vs GRR" },
      {
        type: "bullets",
        items: [
          "NRR includes expansion; GRR excludes expansion.",
          "NRR can look strong even when churn is high if expansion is large.",
          "Use GRR to understand durability; use NRR to understand cohort growth.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Including new customer revenue (NRR is existing cohort only).",
          "Using blended NRR without segmenting (SMB vs enterprise behaves differently).",
          "Mixing MRR movements with cash receipts or revenue recognition.",
          "Changing the definition of MRR or movements month-to-month.",
        ],
      },
      { type: "h2", text: "How to improve NRR" },
      {
        type: "bullets",
        items: [
          "Reduce churn: onboarding, activation, product reliability, support, and renewal process.",
          "Reduce contraction: packaging, value realization, and proactive customer success.",
          "Increase expansion: upsells, add-ons, usage-based pricing, and product-led growth loops.",
          "Segment and focus: improve NRR in the segments you want to scale.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a good NRR?",
        answer:
          "Benchmarks vary by segment and stage. NRR above 100% means the cohort grows without new customers. For many SMB businesses, NRR near 100% can still work if payback is short and churn is controlled.",
      },
      {
        question: "Should I calculate NRR monthly or quarterly?",
        answer:
          "Monthly gives faster feedback but can be noisy. Quarterly smooths seasonality and timing effects. Pick one and keep it consistent, and segment by cohort/plan when possible.",
      },
    ],
    examples: [
      {
        label: "NRR example (start $100k; +$15k expansion; −$5k contraction; −$8k churn)",
        calculatorSlug: "nrr-calculator",
        params: {
          startingMrr: "100000",
          expansionMrr: "15000",
          contractionMrr: "5000",
          churnedMrr: "8000",
        },
      },
    ],
  },
  {
    slug: "grr-guide",
    title: "GRR (Gross Revenue Retention): definition, formula, how to calculate",
    description:
      "GRR explained: gross revenue retention definition, GRR formula, how to calculate it, and why it matters alongside NRR.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["grr-calculator", "nrr-calculator"],
    sections: [
      { type: "h2", text: "What GRR measures" },
      {
        type: "p",
        text: "GRR (Gross Revenue Retention) measures how much of a cohort’s starting revenue remains after churn and downgrades, excluding expansion. It is a clean read of durability.",
      },
      { type: "h2", text: "GRR formula" },
      {
        type: "p",
        text: "GRR = (starting MRR − contraction − churn) ÷ starting MRR",
      },
      { type: "h2", text: "How to calculate GRR (step-by-step)" },
      {
        type: "bullets",
        items: [
          "Pick a cohort and a time window (monthly or quarterly).",
          "Measure starting MRR for the cohort at the beginning of the window.",
          "Measure contraction MRR and churned MRR for the cohort during the window.",
          "Compute ending gross MRR = starting − contraction − churn.",
          "Compute GRR = ending gross MRR ÷ starting MRR.",
        ],
      },
      { type: "h2", text: "Why GRR matters" },
      {
        type: "bullets",
        items: [
          "NRR can be strong due to expansion even when underlying churn is weak.",
          "GRR exposes churn and downgrades directly (durability without expansion).",
          "Improving GRR usually improves payback, valuation multiples, and predictability.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Including expansion (GRR excludes it by definition).",
          "Not segmenting by customer size or plan (blended GRR hides churn pockets).",
          "Mixing billing/cash timing with recurring revenue movements.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is GRR always lower than NRR?",
        answer:
          "Usually yes because GRR excludes expansion, but it depends on how you define the metrics. GRR focuses on losses only; NRR includes gains from expansion.",
      },
    ],
    examples: [
      {
        label: "GRR example (start $100k; −$5k contraction; −$8k churn)",
        calculatorSlug: "grr-calculator",
        params: {
          startingMrr: "100000",
          contractionMrr: "5000",
          churnedMrr: "8000",
        },
      },
    ],
  },
  {
    slug: "net-new-mrr-guide",
    title: "Net new MRR: definition, formula, and how to calculate it",
    description:
      "Net new MRR explained: how to calculate net new MRR from new, expansion, contraction, and churned MRR - plus common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["net-new-mrr-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Net new MRR is the net change in recurring revenue in a period after accounting for new customers, expansions, downgrades, and churn. It is a fast read on momentum.",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Net new MRR = new MRR + expansion MRR − contraction MRR − churned MRR",
      },
      { type: "h2", text: "How to calculate net new MRR" },
      {
        type: "bullets",
        items: [
          "Measure new MRR from customers that became paying in the period.",
          "Measure expansion MRR from existing customers in the same period.",
          "Measure contraction MRR (downgrades) and churned MRR (cancellations).",
          "Apply the net new MRR formula to get the net change.",
        ],
      },
      { type: "h2", text: "Net new MRR vs growth rate" },
      {
        type: "bullets",
        items: [
          "Net new MRR is a dollar amount.",
          "MRR growth rate is usually net new MRR ÷ starting MRR for the period.",
          "Use growth rate for comparing across time; use net new MRR for planning capacity and targets.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing MRR movements with invoices or cash receipts.",
          "Counting reactivations inconsistently (label them clearly).",
          "Comparing months without adjusting for annual billing seasonality and deal timing.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is net new MRR used for?",
        answer:
          "Net new MRR helps you track momentum and plan growth. Teams use it for forecasting, capacity planning, and understanding whether growth is driven by new customers or by expansion.",
      },
    ],
    examples: [
      {
        label: "Net new MRR example (new $12k; expansion $8k; contraction $3k; churn $5k)",
        calculatorSlug: "net-new-mrr-calculator",
        params: { newMrr: "12000", expansionMrr: "8000", contractionMrr: "3000", churnedMrr: "5000" },
      },
    ],
  },
  {
    slug: "saas-quick-ratio-guide",
    title: "SaaS Quick Ratio: definition, formula, and how to use it",
    description:
      "SaaS quick ratio explained: (new + expansion) ÷ (contraction + churn). Learn how to compute it and what it tells you about growth quality.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["saas-quick-ratio-calculator", "net-new-mrr-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "SaaS quick ratio is a growth quality metric that compares positive MRR movements (new + expansion) to negative movements (contraction + churn) in a period.",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Quick ratio = (new MRR + expansion MRR) ÷ (contraction MRR + churned MRR)",
      },
      { type: "h2", text: "How to calculate it" },
      {
        type: "bullets",
        items: [
          "Use the same time window for all movements (monthly or quarterly).",
          "Use MRR movements (not billings/cash) so the metric is consistent.",
          "Compute the quick ratio and track it over time by segment.",
        ],
      },
      { type: "h2", text: "How to interpret quick ratio" },
      {
        type: "bullets",
        items: [
          "Higher quick ratio means positive growth outweighs losses.",
          "A falling quick ratio often signals increasing churn or contraction.",
          "Segment-level quick ratio is more actionable than a blended number.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Treating quick ratio as a standalone goal without payback and cash context.",
          "Using different definitions for movements across months.",
          "Comparing across segments without normalizing contract terms.",
        ],
      },
    ],
    examples: [
      {
        label: "Quick ratio example (new $12k; expansion $8k; contraction $3k; churn $5k)",
        calculatorSlug: "saas-quick-ratio-calculator",
        params: { newMrr: "12000", expansionMrr: "8000", contractionMrr: "3000", churnedMrr: "5000" },
      },
    ],
  },
  {
    slug: "rule-of-40-guide",
    title: "Rule of 40: definition, formula, and how to interpret it",
    description:
      "Rule of 40 explained: growth rate + profit margin. Learn which margin to use, how to compute it, and common pitfalls.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["rule-of-40-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Rule of 40 is a common SaaS heuristic: revenue growth rate (%) plus profit margin (%) should be around 40% or higher. It is a coarse way to balance growth and profitability.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "Rule of 40 score = growth rate (%) + profit margin (%)" },
      { type: "h2", text: "Which margin should you use?" },
      {
        type: "bullets",
        items: [
          "Operating margin: good for operating performance comparisons.",
          "EBITDA margin: common in SaaS reporting but can differ from cash.",
          "Free cash flow margin: ties to cash efficiency but can be volatile.",
          "Pick one and keep it consistent over time.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing different margin types across periods.",
          "Comparing across companies with very different accounting and GTM models.",
          "Using Rule of 40 as a single KPI instead of a context metric.",
        ],
      },
    ],
    examples: [
      {
        label: "Rule of 40 example (35% growth; 10% margin)",
        calculatorSlug: "rule-of-40-calculator",
        params: { growthPercent: "35", marginPercent: "10" },
      },
    ],
  },
  {
    slug: "burn-multiple-guide",
    title: "Burn multiple: definition, formula, and how to use it",
    description:
      "Burn multiple explained: net burn ÷ net new ARR. Learn how to compute it, interpret it, and avoid common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["burn-multiple-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Burn multiple measures growth efficiency: how much net cash you burn to generate $1 of net new ARR. It is commonly tracked quarterly to reduce noise from timing.",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "Burn multiple = net burn ÷ net new ARR" },
      { type: "h2", text: "How to calculate it" },
      {
        type: "bullets",
        items: [
          "Compute net burn for the period (cash outflows minus inflows).",
          "Compute net new ARR for the same period (change in ARR after churn and expansions).",
          "Divide net burn by net new ARR to get burn multiple.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using mismatched time windows for burn and ARR.",
          "Letting annual prepay timing distort short measurement windows.",
          "Ignoring retention quality (burn multiple can improve temporarily if churn is hidden).",
        ],
      },
    ],
    examples: [
      {
        label: "Burn multiple example (net burn $300k; net new ARR $200k)",
        calculatorSlug: "burn-multiple-calculator",
        params: { netBurn: "300000", netNewArr: "200000" },
      },
    ],
  },
  {
    slug: "unit-economics-guide",
    title: "Unit economics: CAC, payback, LTV, and LTV:CAC (how to model them)",
    description:
      "A practical unit economics guide: consistent definitions for CAC and LTV, how to calculate CAC payback period, and how to interpret LTV:CAC.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "unit-economics-calculator",
      "cac-calculator",
      "cac-payback-period-calculator",
      "ltv-calculator",
      "ltv-to-cac-calculator",
    ],
    relatedGlossarySlugs: [
      "unit-economics",
      "cac",
      "ltv",
      "ltv-to-cac",
      "cac-payback-period",
      "gross-margin",
      "churn-rate",
      "customer-lifetime",
    ],
    sections: [
      { type: "h2", text: "What unit economics are" },
      {
        type: "p",
        text: "Unit economics measure profitability and cash efficiency at the level of a unit (usually a customer or account). For SaaS, the core unit stack is CAC (cost to acquire), LTV (value over lifetime), and payback (time to recover CAC from gross profit).",
      },
      { type: "h2", text: "Use gross profit, not revenue" },
      {
        type: "p",
        text: "A common mistake is to compute LTV using revenue but compare it to a fully-loaded CAC. For cleaner unit economics, compute LTV on gross profit (revenue × gross margin) and label CAC definitions clearly.",
      },
      { type: "h2", text: "Core formulas" },
      {
        type: "bullets",
        items: [
          "CAC = acquisition spend ÷ new customers acquired.",
          "Monthly gross profit per customer ≈ ARPA × gross margin.",
          "Payback (months) = CAC ÷ (ARPA × gross margin).",
          "Lifetime (months) ≈ 1 ÷ monthly churn (rough shortcut).",
          "LTV (gross profit) ≈ (ARPA × gross margin) ÷ monthly churn.",
          "LTV:CAC = LTV ÷ CAC.",
        ],
      },
      { type: "h2", text: "How to model it (step-by-step)" },
      {
        type: "bullets",
        items: [
          "Pick a segment (channel, plan, geo) and a consistent time unit (monthly is common).",
          "Measure ARPA and gross margin for that segment.",
          "Measure churn for that segment (logo churn or revenue churn; label it).",
          "Measure CAC with a clear definition (paid-only vs fully-loaded).",
          "Compute payback and LTV, then compare to your cash constraints.",
        ],
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Unit mismatch: using annual churn with monthly ARPA (or vice versa).",
          "Blended averages hiding segment problems (SMB vs enterprise).",
          "Optimizing LTV:CAC without checking payback (ratio can look good with very long payback).",
          "Treating churn as constant over time (cohort curves are more accurate).",
        ],
      },
      { type: "h2", text: "How to improve unit economics" },
      {
        type: "bullets",
        items: [
          "Reduce CAC: improve conversion rate, sales efficiency, and channel mix.",
          "Increase ARPA: pricing, packaging, expansion, and better lead quality.",
          "Improve gross margin: reduce COGS and variable costs.",
          "Reduce churn: onboarding/activation, reliability, customer success, and renewal execution.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a good LTV:CAC ratio?",
        answer:
          "It depends on payback and cash constraints, but ~3:1 is a common rough target. A lower ratio can still work with short payback and strong retention; a higher ratio can mean you're under-investing in growth.",
      },
      {
        question: "Should I use logo churn or revenue churn for LTV?",
        answer:
          "For a simple customer LTV model, logo churn (customer churn) is common. If expansion is meaningful, cohort-based revenue retention (NRR/GRR) may be more informative than a single churn number.",
      },
    ],
    examples: [
      {
        label: "Unit economics example (ARPA $200; margin 80%; churn 3%; CAC $800)",
        calculatorSlug: "unit-economics-calculator",
        params: {
          arpaMonthly: "200",
          grossMarginPercent: "80",
          monthlyChurnPercent: "3",
          cac: "800",
        },
      },
    ],
  },
  {
    slug: "bookings-vs-arr-guide",
    title: "Bookings vs ARR: definitions, formulas, and examples",
    description:
      "Bookings vs ARR explained: what each metric measures, the formulas, and how to avoid common mistakes with annual prepay and one-time fees.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["bookings-vs-arr-calculator", "arr-calculator", "mrr-calculator"],
    sections: [
      { type: "h2", text: "Bookings vs ARR (quick definition)" },
      {
        type: "p",
        text: "Bookings measure contracted value you sign in a period. ARR (Annual Recurring Revenue) is an annualized recurring run-rate snapshot (typically MRR × 12). They are related but not interchangeable.",
      },
      { type: "h2", text: "What each metric measures" },
      {
        type: "table",
        columns: ["Metric", "What it measures", "When to use", "Common mistake"],
        rows: [
          [
            "Bookings",
            "Contracted value signed in a period (may include one-time fees/services).",
            "Sales performance, pipeline conversion, forecasting demand.",
            "Treating bookings as recurring run-rate.",
          ],
          [
            "ARR",
            "Recurring run-rate snapshot (MRR × 12). Excludes one-time fees/services.",
            "Comparing SaaS scale and momentum across time or companies.",
            "Treating ARR as guaranteed annual revenue or including services.",
          ],
          [
            "Cash",
            "Money collected (cash receipts). Sensitive to billing terms and prepay timing.",
            "Runway planning and cash-flow management.",
            "Using annual prepay cash spikes as proof of recurring growth.",
          ],
        ],
      },
      { type: "h2", text: "Core formulas" },
      {
        type: "bullets",
        items: [
          "Bookings (simplified) ≈ total contract value signed in the period.",
          "MRR equivalent = recurring portion ÷ contract term months.",
          "ARR = MRR × 12.",
        ],
      },
      { type: "h2", text: "Worked example (annual prepay + one-time fees)" },
      {
        type: "p",
        text: "Suppose you close a $120,000 12-month contract that includes $10,000 of one-time onboarding. Bookings are $120,000. Recurring portion is $110,000. MRR equivalent is $110,000 ÷ 12 = ~$9,167. ARR run-rate is ~$110,000 (MRR × 12). Cash collected may be $120,000 upfront if prepaid.",
      },
      { type: "h2", text: "Common mistakes to avoid" },
      {
        type: "bullets",
        items: [
          "Including services/onboarding in ARR (inflates recurring run-rate).",
          "Comparing bookings to ARR without normalizing for term length.",
          "Mixing recognized revenue with bookings/cash (different timing).",
          "Using blended metrics without segmenting (SMB vs enterprise terms differ).",
        ],
      },
      { type: "h2", text: "How to use these metrics together" },
      {
        type: "bullets",
        items: [
          "Use bookings to manage sales execution and forecasting.",
          "Use ARR to track recurring momentum and valuation context.",
          "Use cash receipts and burn to plan runway and hiring.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why can bookings be higher than ARR?",
        answer:
          "Bookings can include the full contract value and one-time items, while ARR focuses on recurring run-rate. Annual prepay increases bookings and cash immediately, while ARR reflects recurring value.",
      },
      {
        question: "Is ARR the same as annual revenue?",
        answer:
          "Not always. ARR is a run-rate snapshot focused on recurring revenue. Annual revenue is what you recognize over a year and can include one-time items.",
      },
    ],
    examples: [
      {
        label: "Bookings vs ARR example ($120k TCV; 12 months; $10k one-time; 100% prepaid)",
        calculatorSlug: "bookings-vs-arr-calculator",
        params: { contractValue: "120000", termMonths: "12", oneTimeFees: "10000", prepaidPercent: "100" },
      },
    ],
  },
  {
    slug: "saas-magic-number-guide",
    title: "SaaS Magic Number: definition, formula, and how to use it",
    description:
      "SaaS Magic Number explained: what it measures, the formula, lag assumptions, and how to interpret it alongside burn multiple and payback.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["saas-magic-number-calculator", "burn-multiple-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "The SaaS Magic Number is a sales efficiency heuristic. It approximates how much recurring revenue output you generate relative to sales & marketing spend, using a lag to reflect conversion delay.",
      },
      { type: "h2", text: "Formula (common simplified version)" },
      {
        type: "p",
        text: "Magic Number ≈ (net new ARR in period × 4) ÷ prior-period sales & marketing spend",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "Track it as a trend metric (quarterly is common) rather than a single point.",
          "Segment by motion (self-serve vs sales-led) if possible.",
          "Pair with retention (NRR/GRR) to ensure growth is durable.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Ignoring lag effects between spend and revenue.",
          "Comparing across businesses with different cycles and expansion behavior.",
          "Using blended spend without understanding what is included (marketing-only vs sales+marketing).",
        ],
      },
    ],
    faqs: [
      {
        question: "Magic Number vs burn multiple: which is better?",
        answer:
          "They answer different questions. Magic Number focuses on sales & marketing efficiency. Burn multiple focuses on total cash efficiency. Many teams track both.",
      },
    ],
    examples: [
      {
        label: "Magic Number example ($250k net new ARR; $400k prior S&M spend)",
        calculatorSlug: "saas-magic-number-calculator",
        params: { netNewArr: "250000", salesMarketingSpend: "400000" },
      },
    ],
  },
  {
    slug: "customer-lifetime-guide",
    title: "Customer lifetime: definition, formula, and how to estimate it",
    description:
      "Customer lifetime explained: how to estimate lifetime from churn, why the simple formula can be wrong, and how to improve the estimate with cohorts.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["customer-lifetime-calculator", "churn-rate-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Customer lifetime is how long customers remain active before churn. Lifetime matters because it drives LTV and payback viability.",
      },
      { type: "h2", text: "Simple formula (shortcut)" },
      {
        type: "p",
        text: "Customer lifetime (months) ≈ 1 ÷ monthly churn rate",
      },
      { type: "h2", text: "Worked example" },
      {
        type: "p",
        text: "If monthly churn is 3%, the simple estimate is lifetime ≈ 1 / 0.03 ≈ 33.3 months. This is useful for planning but can be wrong if churn changes over tenure.",
      },
      { type: "h2", text: "Why the shortcut breaks" },
      {
        type: "bullets",
        items: [
          "Churn is usually higher early and lower later (tenure effects).",
          "Segments behave differently (SMB vs enterprise).",
          "Expansion and downgrades change revenue lifetime vs logo lifetime.",
        ],
      },
      { type: "h2", text: "A better approach" },
      {
        type: "bullets",
        items: [
          "Use cohort retention curves (logo and revenue) to measure observed survival over time.",
          "Estimate LTV by summing gross profit over the cohort curve.",
          "Track churn drivers and reduce early churn (activation and onboarding).",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use logo churn or revenue churn?",
        answer:
          "Use logo churn to estimate customer lifetime (accounts). Use revenue retention (GRR/NRR) to understand revenue lifetime when expansions exist.",
      },
    ],
    examples: [
      {
        label: "Lifetime example (3% monthly churn)",
        calculatorSlug: "customer-lifetime-calculator",
        params: { monthlyChurnPercent: "3" },
      },
    ],
  },
  {
    slug: "npv-guide",
    title: "NPV (Net Present Value): definition, formula, and example",
    description:
      "NPV explained: what net present value means, how to calculate NPV, how to pick a discount rate (MARR), and common pitfalls.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["npv-calculator"],
    relatedGlossarySlugs: ["npv", "discount-rate", "marr", "irr"],
    sections: [
      { type: "h2", text: "What NPV means" },
      {
        type: "p",
        text: "NPV (Net Present Value) measures the value created by an investment after discounting future cash flows back to today. If NPV is positive, the investment exceeds your required return (discount rate).",
      },
      { type: "h2", text: "NPV formula" },
      {
        type: "p",
        text: "NPV = Σ (cash flow_t / (1 + r)^t) − initial investment",
      },
      { type: "h2", text: "How to calculate NPV (step-by-step)" },
      {
        type: "bullets",
        items: [
          "List expected cash flows by year (or month).",
          "Choose a discount rate (your required return / MARR).",
          "Discount each cash flow back to present value.",
          "Sum discounted cash flows and subtract the upfront investment.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using an unrealistic discount rate (test a range).",
          "Ignoring risk differences across projects (one rate doesn’t fit all).",
          "Mixing nominal and real cash flows (inflation consistency).",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a good discount rate for NPV?",
        answer:
          "It depends on your required return and risk. Many teams start with a hurdle rate (MARR) and test a range to understand sensitivity.",
      },
    ],
    examples: [
      {
        label: "NPV example ($100k upfront; $30k/year for 5 years; 12% discount)",
        calculatorSlug: "npv-calculator",
        params: { initialInvestment: "100000", annualCashFlow: "30000", years: "5", discountRatePercent: "12" },
      },
    ],
  },
  {
    slug: "irr-guide",
    title: "IRR (Internal Rate of Return): definition, formula, and how to use it",
    description:
      "IRR explained: what internal rate of return means, how to calculate IRR, and when IRR can be misleading (use NPV too).",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["irr-calculator", "npv-calculator"],
    relatedGlossarySlugs: ["irr", "npv", "discount-rate", "marr"],
    sections: [
      { type: "h2", text: "What IRR means" },
      {
        type: "p",
        text: "IRR (Internal Rate of Return) is the discount rate that makes NPV equal zero. You can interpret IRR as the annualized return implied by a series of cash flows under standard assumptions.",
      },
      { type: "h2", text: "IRR definition" },
      { type: "p", text: "IRR is the rate r where NPV(r) = 0." },
      { type: "h2", text: "Why IRR is useful" },
      {
        type: "bullets",
        items: [
          "Compare opportunities with multi-year cash flows.",
          "Compare to a hurdle rate (MARR) to see if a project clears your required return.",
          "Works best for projects with one upfront investment followed by positive cash flows.",
        ],
      },
      { type: "h2", text: "When IRR can mislead" },
      {
        type: "bullets",
        items: [
          "Multiple IRRs can exist when cash flows change sign multiple times.",
          "IRR can hide scale (high IRR but low NPV).",
          "IRR implicitly assumes reinvestment at the IRR (often unrealistic).",
        ],
      },
      { type: "h2", text: "Best practice: use IRR with NPV" },
      {
        type: "bullets",
        items: [
          "Use NPV at your discount rate (MARR) to measure value created in dollars.",
          "Use IRR as a quick comparison, then validate with NPV and payback.",
          "Test sensitivity by varying discount rate and cash flow assumptions.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is higher IRR always better?",
        answer:
          "Not necessarily. Higher IRR is attractive, but a small project can have high IRR and still create little value. Use NPV to compare total value created at a consistent required return.",
      },
      {
        question: "What if IRR is undefined?",
        answer:
          "Some cash flow patterns don't produce a single IRR (or any IRR). In those cases, rely on NPV at a chosen discount rate instead.",
      },
    ],
    examples: [
      {
        label: "IRR example (upfront $100k; 5-year cash flows)",
        calculatorSlug: "irr-calculator",
        params: {
          initialInvestment: "100000",
          cashFlow1: "25000",
          cashFlow2: "30000",
          cashFlow3: "35000",
          cashFlow4: "40000",
          cashFlow5: "45000",
          terminalValue: "0",
          discountRatePercent: "12",
        },
      },
    ],
  },
  {
    slug: "discounted-payback-period-guide",
    title: "Discounted payback period: definition, formula, and how to calculate",
    description:
      "Discounted payback explained: how it differs from simple payback, the formula, and when discounted payback is the right metric.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["discounted-payback-period-calculator"],
    relatedGlossarySlugs: ["payback-period", "discount-rate", "npv", "marr"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Discounted payback period is the time it takes for cumulative discounted cash flows to recover the initial investment. Unlike simple payback, it accounts for the time value of money.",
      },
      { type: "h2", text: "Discounted payback vs simple payback" },
      {
        type: "table",
        columns: ["Metric", "Accounts for time value?", "Best for", "Common pitfall"],
        rows: [
          [
            "Simple payback",
            "No",
            "Quick sanity checks when discounting is less important.",
            "Underestimates payback when cash flows are far in the future.",
          ],
          [
            "Discounted payback",
            "Yes",
            "Comparing projects at a chosen discount rate and risk level.",
            "Using it alone (it ignores cash flows after payback).",
          ],
        ],
      },
      { type: "h2", text: "How to calculate discounted payback" },
      {
        type: "bullets",
        items: [
          "Choose a discount rate (your required return / MARR).",
          "Discount each cash flow: PV_t = cash flow_t / (1 + r)^t.",
          "Sum discounted cash flows cumulatively until the total reaches the initial investment.",
          "Interpolate within the year for partial-year payback.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using discounted payback alone instead of NPV for value creation.",
          "Ignoring risk (discount rate should reflect required return).",
          "Mixing nominal and real assumptions (inflation consistency).",
        ],
      },
    ],
    examples: [
      {
        label: "Discounted payback example ($100k upfront; $30k/year; 10 years; 12% discount)",
        calculatorSlug: "discounted-payback-period-calculator",
        params: { initialInvestment: "100000", annualCashFlow: "30000", years: "10", discountRatePercent: "12" },
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
  {
    slug: "contribution-margin-guide",
    title: "Contribution margin: what it is and why it matters",
    description:
      "Contribution margin connects revenue to variable costs. It's the foundation for break-even analysis, ROAS targets, and scaling decisions.",
    category: "finance",
    updatedAt: "2026-01-12",
    relatedCalculatorSlugs: [
      "break-even-revenue-calculator",
      "break-even-roas-calculator",
      "target-roas-calculator",
    ],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Contribution margin is the portion of revenue left after variable costs. It tells you how much each incremental dollar of revenue contributes to covering fixed costs (and eventually profit).",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Contribution margin ($) = revenue - variable costs. Contribution margin (%) = (revenue - variable costs) / revenue.",
      },
      { type: "h2", text: "What to include as variable costs" },
      {
        type: "bullets",
        items: [
          "COGS (hosting, fulfillment, support directly tied to usage).",
          "Payment processing fees.",
          "Shipping and returns (for ecommerce).",
          "Platform fees (marketplaces, app stores) when they scale with revenue.",
        ],
      },
      { type: "h2", text: "How it relates to break-even" },
      {
        type: "p",
        text: "Break-even models use contribution (or gross) margin because fixed costs are covered by the margin dollars left after variable costs. If you use net margin, you double-count fixed costs and the model becomes misleading.",
      },
      { type: "h2", text: "How it relates to ROAS" },
      {
        type: "p",
        text: "ROAS targets are really contribution margin targets. A campaign can have a high ROAS but still be unprofitable if variable costs and overhead allocations are large.",
      },
    ],
    faqs: [
      {
        question: "Is contribution margin the same as gross margin?",
        answer:
          "Not always. Gross margin usually includes COGS. Contribution margin often includes additional variable costs like fees, shipping, and returns.",
      },
      {
        question: "Should ad spend be included in contribution margin?",
        answer:
          "For paid acquisition, many teams treat ad spend as a variable cost and model 'contribution after marketing' to decide what to scale.",
      },
    ],
  },
  {
    slug: "incrementality-guide",
    title: "Incrementality: how to tell if ads are actually driving growth",
    description:
      "Platform-reported ROAS can overstate impact. Learn what incrementality means, when it matters, and practical ways to test it.",
    category: "paid-ads",
    updatedAt: "2026-01-12",
    relatedCalculatorSlugs: ["roas-calculator", "roi-calculator"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Incrementality asks: what would have happened without ads? The incremental lift is the difference between outcomes with ads and outcomes in a comparable no-ads baseline.",
      },
      { type: "h2", text: "Why ROAS can mislead" },
      {
        type: "bullets",
        items: [
          "Attribution often claims credit for conversions that would have happened anyway.",
          "Retargeting can inflate ROAS by capturing already-intent customers.",
          "Cross-channel effects (brand, email, organic) make last-click comparisons noisy.",
        ],
      },
      { type: "h2", text: "Common incrementality tests" },
      {
        type: "bullets",
        items: [
          "Geo holdout: pause ads in matched regions and compare outcomes.",
          "Audience split: randomize a subset of eligible users into a holdout group.",
          "Budget experiments: step changes in spend and measure response curves.",
        ],
      },
      { type: "h2", text: "Practical checklist" },
      {
        type: "bullets",
        items: [
          "Pick a primary outcome (profit, conversions, or contribution margin).",
          "Run the test long enough to smooth weekly seasonality.",
          "Validate that holdout and exposed groups are comparable.",
          "Use the result to set ROAS/CPA targets and scale rules.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need incrementality tests if I'm small?",
        answer:
          "Usually not. Early on, focus on creative-market fit and basic unit economics. Incrementality becomes more valuable as spend grows and attribution bias increases.",
      },
      {
        question: "What metric should I optimize for in a test?",
        answer:
          "If you can, optimize for contribution margin or profit. If not, use a proxy you trust (e.g., first purchases) and adjust using margin assumptions.",
      },
    ],
  },
  {
    slug: "cohort-vs-aggregate-guide",
    title: "Cohort vs aggregate metrics: why averages can mislead",
    description:
      "Aggregate metrics hide churn and expansion dynamics. Learn when to use cohort analysis and how to interpret retention and LTV.",
    category: "saas-metrics",
    updatedAt: "2026-01-12",
    relatedCalculatorSlugs: [
      "churn-rate-calculator",
      "retention-rate-calculator",
      "ltv-calculator",
    ],
    sections: [
      { type: "h2", text: "The problem with averages" },
      {
        type: "p",
        text: "Aggregates blend together customers acquired at different times, prices, and behaviors. When your product or acquisition channel changes, averages can look stable while underlying cohorts deteriorate (or improve).",
      },
      { type: "h2", text: "What is a cohort?" },
      {
        type: "p",
        text: "A cohort is a group of customers that share a start date (e.g., customers acquired in January). Cohort analysis tracks retention, expansion, and churn for that group over time.",
      },
      { type: "h2", text: "When cohort analysis matters most" },
      {
        type: "bullets",
        items: [
          "When you change pricing, packaging, or onboarding.",
          "When you add a new acquisition channel or targeting strategy.",
          "When you're trying to forecast LTV or payback more accurately.",
        ],
      },
      { type: "h2", text: "How to use cohorts with LTV and payback" },
      {
        type: "bullets",
        items: [
          "Compute retention/churn by cohort and segment (plan, channel, geo).",
          "Estimate LTV from retention curves rather than a single churn number.",
          "Compare payback by cohort to see whether acquisition quality is changing.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is customer churn enough, or do I need revenue retention?",
        answer:
          "Customer churn is useful, but revenue retention (NRR/GRR) is often more representative for SaaS because expansion and contraction can dominate the story.",
      },
    ],
  },
  {
    slug: "mrr-forecast-guide",
    title: "MRR forecasting: a simple bridge model (new, expansion, churn)",
    description:
      "A practical way to forecast MRR using a monthly bridge: starting MRR + new MRR + expansion - contraction - churn.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "mrr-forecast-calculator",
      "net-new-mrr-calculator",
      "nrr-calculator",
      "grr-calculator",
    ],
    relatedGlossarySlugs: [
      "mrr",
      "net-new-mrr",
      "new-mrr",
      "expansion-mrr",
      "contraction-mrr",
      "churned-mrr",
      "nrr",
      "grr",
      "cmgr",
    ],
    sections: [
      { type: "h2", text: "Why a bridge model is useful" },
      {
        type: "p",
        text: "MRR forecasts can get complicated fast. A bridge model keeps the levers explicit: how much MRR comes from new customers vs how much comes from retaining and expanding existing customers. It's a great first-pass planning tool for budgets, targets, and scenario analysis.",
      },
      { type: "h2", text: "Core monthly bridge" },
      {
        type: "p",
        text: "MRR_next = MRR + new MRR + expansion - contraction - churn (computed monthly).",
      },
      { type: "h2", text: "How to set inputs (practical defaults)" },
      {
        type: "bullets",
        items: [
          "Starting MRR: current month recurring run-rate (exclude one-time revenue).",
          "New MRR: use trailing 3-month average if growth is volatile.",
          "Expansion/churn rates: start with your trailing monthly revenue retention behavior (or approximate from NRR/GRR).",
          "Horizon: 6–12 months for execution, 12–24 months for strategy scenarios.",
        ],
      },
      { type: "h2", text: "How to interpret results" },
      {
        type: "bullets",
        items: [
          "Ending MRR and ARR run-rate show where the business lands if assumptions hold.",
          "CMGR helps compare scenarios (growth rate compounded monthly).",
          "Implied monthly NRR/GRR reflects existing-customer health independent of new MRR.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing monthly and annual rates (e.g., annual churn used as monthly churn).",
          "Double counting: including expansions inside 'new MRR' or vice versa.",
          "Forecasting long horizons without scenarios (small rate changes compound a lot).",
          "Using this instead of cohort curves when you have meaningful seasonality or changing retention by cohort.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I translate annual NRR to a monthly rate?",
        answer:
          "If you only have an annual NRR, you can approximate a monthly rate by taking the 12th root: monthly NRR ≈ (annual NRR)^(1/12). It’s still better to compute monthly retention directly when possible.",
      },
      {
        question: "Should expansion and churn be applied to starting MRR or ending MRR?",
        answer:
          "Most simple models apply the rates to the current MRR base at the start of each month (then update). For precision, use cohort-based retention curves and apply behavior by segment.",
      },
    ],
    examples: [
      {
        label: "Example: $100k start, $12k new, 2% expansion, 0.5% contraction, 1.5% churn, 12 months",
        calculatorSlug: "mrr-forecast-calculator",
        params: {
          startingMrr: "100000",
          newMrrPerMonth: "12000",
          expansionRatePercent: "2",
          contractionRatePercent: "0.5",
          churnRatePercent: "1.5",
          months: "12",
        },
      },
    ],
  },
  {
    slug: "cash-runway-guide",
    title: "Cash runway: how to estimate burn, break-even, and survival time",
    description:
      "A practical guide to runway: net burn, gross profit, break-even revenue, and how to avoid common cash planning mistakes.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["cash-runway-calculator"],
    relatedGlossarySlugs: [
      "runway",
      "burn-rate",
      "gross-burn",
      "net-burn",
      "gross-margin",
      "break-even-revenue",
      "cash-breakeven",
      "cash-flow",
      "working-capital",
      "accounts-receivable",
    ],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Runway estimates how many months you can operate before running out of cash. The key input is net burn: cash outflows minus cash inflows in a period.",
      },
      { type: "h2", text: "Quick formulas" },
      {
        type: "bullets",
        items: [
          "Net burn = cash outflows - cash inflows.",
          "Runway (months) = cash balance / net burn (if net burn > 0).",
          "Gross profit = revenue * gross margin (simplified).",
          "Break-even revenue ≈ operating expenses / gross margin (simplified).",
        ],
      },
      { type: "h2", text: "Why cash planning goes wrong" },
      {
        type: "bullets",
        items: [
          "Revenue is not cash: collections timing (AR) can delay inflows.",
          "Expenses are not always cash: prepayments, capex, and payroll timing matter.",
          "Growth often increases burn before it reduces it (sales/marketing ramp, hiring, infra).",
        ],
      },
      { type: "h2", text: "Practical checklist" },
      {
        type: "bullets",
        items: [
          "Model best/base/worst scenarios and update monthly.",
          "Separate recurring revenue from one-time revenue so you can see stability.",
          "Track runway by cash, not just by P&L profitability.",
          "If runway is short, prioritize actions with immediate cash impact (collections, spend control, pricing).",
        ],
      },
    ],
    faqs: [
      {
        question: "Is runway the same as burn multiple?",
        answer:
          "No. Runway is a cash survival metric. Burn multiple relates net burn to net new ARR and is a growth efficiency metric for SaaS.",
      },
      {
        question: "Should I include R&D in burn?",
        answer:
          "For runway, include all cash outflows required to operate: payroll, rent, tools, cloud, and any spending you can't avoid. For unit economics decisions, you may separate growth investments from maintenance spending.",
      },
    ],
    examples: [
      {
        label: "Example: $500k cash, $150k revenue, 80% margin, $220k opex, 0% growth, 24 months",
        calculatorSlug: "cash-runway-calculator",
        params: {
          cashBalance: "500000",
          monthlyRevenue: "150000",
          grossMarginPercent: "80",
          monthlyOperatingExpenses: "220000",
          monthlyRevenueGrowthPercent: "0",
          monthsToSimulate: "24",
        },
      },
    ],
  },
  {
    slug: "blended-cac-guide",
    title: "Blended CAC vs paid CAC: when each is the right metric",
    description:
      "CAC depends on what you include. Learn paid-only CAC vs fully-loaded blended CAC, how to avoid mismatches, and how to connect CAC to payback.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "blended-cac-calculator",
      "cac-calculator",
      "cac-payback-period-calculator",
      "ltv-to-cac-calculator",
    ],
    relatedGlossarySlugs: ["cac", "arpa", "gross-margin", "payback-period", "ltv"],
    sections: [
      { type: "h2", text: "Why CAC has multiple definitions" },
      {
        type: "p",
        text: "CAC is only meaningful when the numerator and denominator are clearly defined. Paid CAC helps you optimize acquisition channels. Blended (fully-loaded) CAC helps you plan the business by allocating salaries and overhead to acquisition.",
      },
      { type: "h2", text: "Two common CAC definitions" },
      {
        type: "bullets",
        items: [
          "Paid CAC = variable paid acquisition spend / new paying customers.",
          "Blended CAC = (variable spend + sales & marketing salaries + tools/overhead) / new paying customers.",
        ],
      },
      { type: "h2", text: "How to connect CAC to payback" },
      {
        type: "p",
        text: "Payback months estimates how long it takes to recover CAC using monthly gross profit per customer: payback = CAC / (ARPA * gross margin).",
      },
      { type: "h2", text: "Common mistakes (and how to avoid them)" },
      {
        type: "bullets",
        items: [
          "Using leads/signups as the denominator (that’s CPA/CPL; convert it to CAC using funnel conversion rates).",
          "Comparing revenue-based LTV to fully-loaded CAC (mismatch). Prefer gross profit LTV or label definitions clearly.",
          "Allocating fixed costs inconsistently across periods (creates fake CAC trend).",
        ],
      },
      { type: "h2", text: "Practical reporting template" },
      {
        type: "bullets",
        items: [
          "Paid CAC by channel/campaign (optimization).",
          "Blended CAC overall and by segment (planning).",
          "Payback months and LTV:CAC (health).",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I include brand marketing spend in CAC?",
        answer:
          "For planning (blended CAC), many teams include it if it contributes to acquisition at your stage. For channel optimization, keep the paid CAC numerator closer to variable costs tied to that channel.",
      },
      {
        question: "Can blended CAC go down even if paid CAC rises?",
        answer:
          "Yes. If you scale acquisition volume, fixed costs per customer can fall. That can offset a rising paid CAC, which is why it helps to track both metrics.",
      },
    ],
    examples: [
      {
        label: "Example: $60k ads + $10k creative + $80k salaries + $5k tools; 120 customers",
        calculatorSlug: "blended-cac-calculator",
        params: {
          adSpend: "60000",
          creativeAgency: "10000",
          salesMarketingSalaries: "80000",
          toolsOverhead: "5000",
          newCustomers: "120",
          arpaMonthly: "800",
          grossMarginPercent: "80",
        },
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
