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
    slug: "cac-payback-sensitivity-guide",
    title: "CAC payback sensitivity: ARPA × margin scenarios (months to recover CAC)",
    description:
      "A practical guide to CAC payback sensitivity: vary ARPA and gross margin to see how months to recover CAC changes under realistic scenarios.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: [
      "cac-payback-sensitivity-calculator",
      "cac-payback-period-calculator",
      "unit-economics-dashboard-calculator",
    ],
    relatedGlossarySlugs: [
      "cac",
      "cac-payback-period",
      "arpa",
      "gross-margin",
      "sensitivity-analysis",
    ],
    sections: [
      { type: "h2", text: "Why sensitivity matters" },
      {
        type: "p",
        text: "CAC payback is a simple formula, but the inputs are not stable. ARPA shifts with pricing and mix, and gross margin shifts with COGS and usage. Sensitivity analysis helps you avoid false confidence by showing how payback changes under a small set of scenarios.",
      },
      { type: "h2", text: "Payback formula (gross profit payback)" },
      {
        type: "p",
        text: "Payback (months) = CAC ÷ (ARPA × gross margin).",
      },
      { type: "h2", text: "How to pick scenario ranges" },
      {
        type: "bullets",
        items: [
          "Start with ranges that reflect your uncertainty: e.g., ±10–20% ARPA and ±5–10% gross margin.",
          "If you have segmented data, do sensitivity per segment (plan/channel) instead of using blended averages.",
          "Widen ranges when channels are volatile or pricing is changing; narrow them once economics stabilize.",
        ],
      },
      { type: "h2", text: "How to interpret the grid" },
      {
        type: "bullets",
        items: [
          "If payback is highly sensitive to margin, invest in COGS reduction and variable cost control.",
          "If payback is highly sensitive to ARPA, focus on pricing, packaging, and upsell/expansion paths.",
          "Use payback with retention: long payback + high early churn can still be unprofitable even if LTV is high on paper.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue-based payback while CAC is fully-loaded (mismatch).",
          "Mixing time units (monthly ARPA with annual CAC, or vice-versa).",
          "Treating sensitivity outputs as precision instead of scenario planning.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is this the same as cohort payback curves?",
        answer:
          "No. Sensitivity analysis varies assumptions (ARPA/margin) around a steady-state model. Cohort payback curves model payback over time with early churn and changing revenue/margin.",
      },
      {
        question: "What should I change first to improve payback?",
        answer:
          "Start with the lever that moves payback the most in sensitivity: ARPA (pricing/mix) or gross margin (COGS/variable cost). Then validate the change with cohort retention so you don’t trade payback for churn.",
      },
    ],
    examples: [
      {
        label: "Sensitivity example (CAC $6k; ARPA $800; margin 80%; ±10% ARPA; ±5% margin)",
        calculatorSlug: "cac-payback-sensitivity-calculator",
        params: {
          cac: "6000",
          arpaMonthly: "800",
          grossMarginPercent: "80",
          arpaStepPercent: "10",
          grossMarginStepPercent: "5",
        },
      },
    ],
  },
  {
    slug: "churn-guide",
    title: "Churn: How to measure churn rate correctly",
    description:
      "A guide to churn rate: customer churn vs revenue churn, measurement choices, and how to track churn by cohort.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: [
      "churn-rate-calculator",
      "retention-rate-calculator",
      "mrr-churn-rate-calculator",
      "nrr-calculator",
      "grr-calculator",
    ],
    relatedGlossarySlugs: ["churn-rate", "logo-churn", "revenue-churn", "nrr", "grr", "mrr"],
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
      { type: "h2", text: "Logo churn vs MRR churn" },
      {
        type: "bullets",
        items: [
          "Logo churn (customer churn) counts customers lost, regardless of size.",
          "MRR churn measures lost recurring revenue (churned MRR) ÷ starting MRR.",
          "They diverge when large customers churn less (or more) than small customers.",
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
      { type: "h2", text: "Pair churn with retention metrics" },
      {
        type: "bullets",
        items: [
          "GRR isolates churn and downgrades (durability without expansion).",
          "NRR includes expansion and can mask churn if upsells are strong.",
          "Use both, and always segment by customer size/plan for diagnostics.",
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
      {
        label: "MRR churn example (start $200k; churned $8k; 1 month)",
        calculatorSlug: "mrr-churn-rate-calculator",
        params: { startingMrr: "200000", churnedMrr: "8000", periodMonths: "1" },
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
    slug: "arpu-growth-decomposition-guide",
    title: "ARPU growth decomposition: what drove revenue (ARPU vs users)",
    description:
      "A practical guide to decomposing revenue growth into ARPU change vs user growth (and interaction), with a worked example.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: [
      "arpu-growth-decomposition-calculator",
      "arpu-calculator",
      "mrr-calculator",
    ],
    relatedGlossarySlugs: ["arpu", "arpa", "arpa-vs-arpu"],
    sections: [
      { type: "h2", text: "What this decomposition answers" },
      {
        type: "p",
        text: "Revenue can grow because you have more active users, because you earn more per user (ARPU), or both. Decomposition is a quick way to explain growth without guessing: it splits the change into a user effect, an ARPU effect, and an interaction term.",
      },
      { type: "h2", text: "Core identity" },
      { type: "p", text: "Revenue = users × ARPU." },
      { type: "h2", text: "Decomposition formula" },
      {
        type: "p",
        text: "ΔRevenue = ΔUsers×ARPU_start + ΔARPU×Users_start + ΔUsers×ΔARPU.",
      },
      { type: "h2", text: "How to use it in practice" },
      {
        type: "bullets",
        items: [
          "User-driven growth often points to acquisition, distribution, or activation improvements.",
          "ARPU-driven growth often points to pricing/packaging, upsell, or mix shifts toward higher-value segments.",
          "If ARPU rises but user growth slows, segment conversion and retention (pricing can change who you attract).",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Changing the definition of 'active user' between periods.",
          "Mixing net revenue (after refunds/credits) with gross revenue across periods.",
          "Treating the decomposition as proof of causality; it’s an explanation tool, not an experiment.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why is there an interaction term?",
        answer:
          "Because users and ARPU can change simultaneously. The interaction term captures the portion of growth created by both changing at the same time.",
      },
      {
        question: "Should I use ARPU or ARPA?",
        answer:
          "Use ARPU when your denominator is users/seats. Use ARPA when you bill per company account/customer. Pick the metric that matches how you price and report.",
      },
    ],
    examples: [
      {
        label: "Example (start $50k / 2,000 users → end $65k / 2,300 users)",
        calculatorSlug: "arpu-growth-decomposition-calculator",
        params: {
          startRevenue: "50000",
          startUsers: "2000",
          endRevenue: "65000",
          endUsers: "2300",
        },
      },
    ],
  },
  {
    slug: "mrr-guide",
    title: "MRR: what it means (and how to track it cleanly)",
    description:
      "A guide to MRR: definitions, what to include/exclude, and how to decompose MRR changes over time.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: [
      "mrr-calculator",
      "mrr-waterfall-calculator",
      "net-new-mrr-calculator",
      "mrr-growth-rate-calculator",
      "mrr-churn-rate-calculator",
      "arr-vs-mrr-calculator",
      "arr-calculator",
    ],
    relatedGlossarySlugs: ["mrr", "arr", "net-new-mrr", "quick-ratio", "cmgr"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "MRR (Monthly Recurring Revenue) is the recurring revenue you expect from active subscriptions in a month. It's the standard momentum metric for subscription businesses.",
      },
      { type: "h2", text: "What to include (and exclude)" },
      {
        type: "bullets",
        items: [
          "Recurring subscription charges (normalized to monthly).",
          "Exclude one-time fees, services, setup, and usage spikes that are not recurring.",
          "For annual plans, count monthly equivalent (annual price / 12).",
        ],
      },
      { type: "h2", text: "MRR movement breakdown (the waterfall)" },
      {
        type: "bullets",
        items: [
          "New MRR, Expansion MRR, Contraction MRR, Churned MRR.",
          "Net new MRR = new + expansion − contraction − churn.",
          "Ending MRR = starting MRR + net new MRR (reconciliation).",
        ],
      },
      { type: "h2", text: "MRR vs ARR" },
      {
        type: "bullets",
        items: [
          "MRR is monthly run-rate; ARR is the same run-rate annualized (usually MRR × 12).",
          "Use MRR for monthly momentum and decomposition; use ARR for scale and many efficiency metrics (burn multiple, magic number).",
          "Both are run-rate snapshots, not recognized revenue.",
        ],
      },
      { type: "h2", text: "MRR growth rate" },
      {
        type: "bullets",
        items: [
          "MRR growth (period) = (end MRR − start MRR) ÷ start MRR.",
          "Use CMGR to compare growth across different time horizons.",
          "If you don’t know what drove growth, use an MRR waterfall (new vs expansion vs churn).",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing MRR with bookings, billings, cash receipts, or recognized revenue (different timing).",
          "Changing the MRR definition month-to-month (breaks trends).",
          "Using blended MRR movements without segmenting by plan or customer size.",
        ],
      },
    ],
    faqs: [
      {
        question: "Does MRR include one-time fees?",
        answer:
          "Typically no. MRR is meant to reflect recurring run-rate only. Track one-time fees separately so you don't distort growth trends.",
      },
      {
        question: "What is net new MRR?",
        answer:
          "Net new MRR is the net change in MRR for a period: new + expansion − contraction − churn. It explains whether growth is driven by acquisition or retention/expansion.",
      },
      {
        question: "Is MRR the same as revenue?",
        answer:
          "No. MRR is a run-rate snapshot. Revenue is recognized over time and can include non-recurring items.",
      },
    ],
    examples: [
      {
        label: "MRR example (250 customers; $200 ARPA/month)",
        calculatorSlug: "mrr-calculator",
        params: { customers: "250", arpaMonthly: "200" },
      },
      {
        label: "MRR waterfall example (start $200k; +$12k new; +$8k expansion; −$3k contraction; −$5k churn)",
        calculatorSlug: "mrr-waterfall-calculator",
        params: {
          startingMrr: "200000",
          newMrr: "12000",
          expansionMrr: "8000",
          contractionMrr: "3000",
          churnedMrr: "5000",
        },
      },
      {
        label: "MRR churn rate example (start $200k; churned $8k; 1 month)",
        calculatorSlug: "mrr-churn-rate-calculator",
        params: { startingMrr: "200000", churnedMrr: "8000", periodMonths: "1" },
      },
      {
        label: "MRR growth rate example (start $200k → end $240k over 6 months)",
        calculatorSlug: "mrr-growth-rate-calculator",
        params: { startMrr: "200000", endMrr: "240000", months: "6" },
      },
    ],
  },
  {
    slug: "arr-vs-mrr-guide",
    title: "ARR vs MRR: definitions, formulas, and how to convert",
    description:
      "ARR vs MRR explained: what each metric means, the formulas (MRR×12 and ARR÷12), and common pitfalls.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["arr-vs-mrr-calculator", "arr-calculator", "mrr-calculator"],
    relatedGlossarySlugs: ["arr", "mrr"],
    sections: [
      { type: "h2", text: "Definition (quick)" },
      {
        type: "bullets",
        items: [
          "MRR (Monthly Recurring Revenue) is monthly recurring run-rate.",
          "ARR (Annual Recurring Revenue) is the same run-rate annualized (usually MRR × 12).",
          "Both are run-rate snapshots, not recognized revenue.",
        ],
      },
      { type: "h2", text: "Formulas" },
      { type: "p", text: "ARR = MRR × 12" },
      { type: "p", text: "MRR = ARR ÷ 12" },
      { type: "h2", text: "When ARR and MRR do not match" },
      {
        type: "bullets",
        items: [
          "You mixed one-time fees/services into one metric but not the other.",
          "Numbers are from different dates (MRR moved since last ARR snapshot).",
          "Definitions drifted (active base, refunds/credits, what is 'recurring').",
        ],
      },
      { type: "h2", text: "How to use each metric" },
      {
        type: "bullets",
        items: [
          "Use MRR for monthly momentum and decomposition (new/expansion/churn).",
          "Use ARR for scale comparisons and many efficiency metrics (burn multiple, magic number).",
          "Always pair run-rate with retention (NRR/GRR) so growth is durable, not leaky.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is ARR the same as annual revenue?",
        answer:
          "Not always. ARR is a recurring run-rate snapshot. Annual revenue is recognized over a year and can include one-time items.",
      },
      {
        question: "Should ARR always equal MRR × 12?",
        answer:
          "If both are defined as recurring run-rate and measured at the same point in time, yes. If they don’t match, check definitions and timestamps.",
      },
    ],
    examples: [
      {
        label: "Conversion example (MRR $200k; ARR $2.4M)",
        calculatorSlug: "arr-vs-mrr-calculator",
        params: { mrr: "200000", arr: "2400000" },
      },
    ],
  },
  {
    slug: "mrr-growth-rate-guide",
    title: "MRR growth rate: how to measure recurring momentum",
    description:
      "A practical MRR growth guide: compute period growth, CMGR, and annualized growth (CAGR) from start and end MRR.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["mrr-growth-rate-calculator", "mrr-calculator", "mrr-waterfall-calculator"],
    relatedGlossarySlugs: ["mrr", "cmgr"],
    sections: [
      { type: "h2", text: "What MRR growth rate measures" },
      {
        type: "p",
        text: "MRR growth rate tracks how your recurring run-rate changed from one point in time to another. It’s a clean momentum metric when you keep the MRR definition consistent.",
      },
      { type: "h2", text: "Key formulas" },
      {
        type: "bullets",
        items: [
          "Period growth = (end MRR − start MRR) ÷ start MRR.",
          "CMGR = (end/start)^(1/months) − 1 (compounded monthly).",
          "Annualized growth = (end/start)^(12/months) − 1.",
        ],
      },
      { type: "h2", text: "How to make the metric actionable" },
      {
        type: "bullets",
        items: [
          "Use an MRR waterfall to explain what drove growth (new vs expansion vs churn).",
          "Segment by plan and customer size to avoid blended averages hiding churn pockets.",
          "Pair growth with retention metrics (NRR/GRR) and payback for quality.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Changing the MRR definition between snapshots (one-time items included sometimes).",
          "Comparing very short windows without seasonality context.",
          "Mixing run-rate metrics (MRR) with recognized revenue (accounting).",
        ],
      },
    ],
    examples: [
      {
        label: "MRR growth example (start $200k → end $240k over 6 months)",
        calculatorSlug: "mrr-growth-rate-calculator",
        params: { startMrr: "200000", endMrr: "240000", months: "6" },
      },
    ],
  },
  {
    slug: "mrr-churn-rate-guide",
    title: "MRR churn rate: definition, formula, and monthly-equivalent conversion",
    description:
      "MRR churn rate explained: churned MRR ÷ starting MRR, plus how to convert non-monthly windows into a monthly-equivalent rate.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["mrr-churn-rate-calculator", "mrr-waterfall-calculator", "grr-calculator", "nrr-calculator"],
    relatedGlossarySlugs: ["mrr", "mrr-churn-rate", "grr", "nrr"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "MRR churn rate measures lost recurring revenue from cancellations (churned MRR) as a percentage of starting MRR for a period. It is a revenue churn metric (not customer churn).",
      },
      { type: "h2", text: "Formula" },
      { type: "p", text: "MRR churn rate (period) = churned MRR ÷ starting MRR" },
      { type: "h2", text: "Monthly-equivalent churn (for non-monthly windows)" },
      {
        type: "p",
        text: "Monthly-equivalent churn = 1 − (1 − period churn)^(1/period months).",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "Track churned MRR and contraction MRR separately, then track GRR/NRR for the full picture.",
          "Use an MRR waterfall to explain whether growth is acquisition-driven or retention-driven.",
          "Segment by customer size and plan (blended churn hides weak cohorts).",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing logo churn (customers lost) with MRR churn (revenue lost).",
          "Using ending MRR as the denominator instead of starting MRR.",
          "Combining downgrades into churn without labeling (contraction vs churn).",
        ],
      },
    ],
    examples: [
      {
        label: "MRR churn example (start $200k; churned $8k; 1 month)",
        calculatorSlug: "mrr-churn-rate-calculator",
        params: { startingMrr: "200000", churnedMrr: "8000", periodMonths: "1" },
      },
      {
        label: "Quarterly-to-monthly conversion example (start $600k; churned $45k; 3 months)",
        calculatorSlug: "mrr-churn-rate-calculator",
        params: { startingMrr: "600000", churnedMrr: "45000", periodMonths: "3" },
      },
    ],
  },
  {
    slug: "arr-guide",
    title: "Bookings vs ARR: what ARR means (and what it doesn't)",
    description:
      "Bookings vs ARR explained: what ARR is (and isn't), plus how it differs from bookings and cash receipts.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: [
      "arr-calculator",
      "arr-vs-mrr-calculator",
      "arr-growth-rate-calculator",
      "arr-waterfall-calculator",
      "net-new-arr-calculator",
      "bookings-vs-arr-calculator",
      "mrr-calculator",
    ],
    relatedGlossarySlugs: [
      "arr",
      "mrr",
      "arr-vs-bookings",
      "billings",
      "recognized-revenue",
      "deferred-revenue",
    ],
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
      { type: "h2", text: "ARR vs MRR" },
      {
        type: "bullets",
        items: [
          "MRR is monthly run-rate; ARR is typically MRR × 12 (same run-rate, different time unit).",
          "Use MRR for monthly momentum and waterfalls; use ARR for scale comparisons and many efficiency metrics.",
          "If ARR and MRR don’t reconcile, definitions or timestamps likely differ.",
        ],
      },
      { type: "h2", text: "ARR movements (net new ARR)" },
      {
        type: "bullets",
        items: [
          "Net new ARR = new + expansion − contraction − churned ARR.",
          "Use an ARR waterfall to reconcile starting ARR to ending ARR for a period.",
          "Segment by plan/channel/customer size to avoid blended averages hiding churn pockets.",
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
          "Treating bookings/billings/cash timing as ARR growth (different concepts).",
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
    slug: "mrr-waterfall-guide",
    title: "MRR waterfall: reconcile starting MRR to ending MRR",
    description:
      "A practical MRR waterfall guide: starting MRR + new + expansion − contraction − churn = ending MRR, with an example and pitfalls.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["mrr-waterfall-calculator", "net-new-mrr-calculator", "saas-quick-ratio-calculator"],
    relatedGlossarySlugs: ["mrr", "net-new-mrr", "quick-ratio"],
    sections: [
      { type: "h2", text: "What an MRR waterfall shows" },
      {
        type: "p",
        text: "An MRR waterfall is a reconciliation. It explains how you moved from starting MRR to ending MRR by breaking the change into new, expansion, contraction, and churned MRR.",
      },
      { type: "h2", text: "Core formula" },
      {
        type: "p",
        text: "Ending MRR = starting MRR + new MRR + expansion MRR − contraction MRR − churned MRR.",
      },
      { type: "h2", text: "How to use it in reporting" },
      {
        type: "bullets",
        items: [
          "Use it monthly so growth is explainable, not just a single MRR number.",
          "Track churned and contraction MRR trends to catch leaky growth early.",
          "Segment by plan/channel/customer size when blended numbers hide churn pockets.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing billings/cash with MRR movements (different timing and definitions).",
          "Counting reactivations inconsistently (label them clearly).",
          "Comparing months without considering annual billing seasonality and deal timing.",
        ],
      },
    ],
    examples: [
      {
        label: "Waterfall example (start $200k; +$12k new; +$8k expansion; −$3k contraction; −$5k churn)",
        calculatorSlug: "mrr-waterfall-calculator",
        params: {
          startingMrr: "200000",
          newMrr: "12000",
          expansionMrr: "8000",
          contractionMrr: "3000",
          churnedMrr: "5000",
        },
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
    slug: "arr-growth-rate-guide",
    title: "ARR growth rate: how to measure recurring momentum",
    description:
      "A practical ARR growth guide: compute period growth, CMGR, and annualized growth (CAGR) from start and end ARR.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["arr-growth-rate-calculator", "arr-calculator", "mrr-calculator"],
    relatedGlossarySlugs: ["arr", "cmgr"],
    sections: [
      { type: "h2", text: "Why ARR growth matters" },
      {
        type: "p",
        text: "ARR growth tracks recurring momentum without mixing in one-time revenue. It’s useful for planning and for comparing recurring scale over time when you keep the ARR definition consistent.",
      },
      { type: "h2", text: "Three ways to express ARR growth" },
      {
        type: "bullets",
        items: [
          "Period growth: (end ARR − start ARR) ÷ start ARR.",
          "CMGR: compounded monthly growth over the period (useful for comparisons across horizons).",
          "Annualized growth (CAGR): converts the period change into an annualized rate.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using inconsistent ARR definitions (services/one-time items included sometimes).",
          "Comparing very short windows without adjusting for seasonality and deal timing.",
          "Mixing run-rate metrics (ARR) with recognized revenue (accounting).",
        ],
      },
      { type: "h2", text: "What to pair with ARR growth" },
      {
        type: "bullets",
        items: [
          "Retention (NRR/GRR) so growth is durable, not leaky.",
          "Payback and burn multiple so growth is cash-feasible.",
          "Gross margin so growth quality improves profitability, not just top-line.",
        ],
      },
    ],
    examples: [
      {
        label: "ARR growth example (start $1.2M → end $1.8M over 12 months)",
        calculatorSlug: "arr-growth-rate-calculator",
        params: { startArr: "1200000", endArr: "1800000", months: "12" },
      },
    ],
  },
  {
    slug: "arr-waterfall-guide",
    title: "ARR waterfall: reconcile starting ARR to ending ARR (net new ARR)",
    description:
      "A practical ARR waterfall guide: starting ARR + new + expansion − contraction − churn = ending ARR, with examples and pitfalls.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["arr-waterfall-calculator", "net-new-arr-calculator", "burn-multiple-calculator"],
    relatedGlossarySlugs: ["arr", "net-new-arr", "arr-waterfall", "burn-multiple"],
    sections: [
      { type: "h2", text: "What an ARR waterfall shows" },
      {
        type: "p",
        text: "An ARR waterfall is a reconciliation. It explains how you moved from a starting ARR snapshot to an ending ARR snapshot by breaking the change into new, expansion, contraction, and churned ARR.",
      },
      { type: "h2", text: "Core formula" },
      {
        type: "p",
        text: "Ending ARR = starting ARR + new ARR + expansion ARR − contraction ARR − churned ARR.",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "Use it quarterly if monthly ARR snapshots are noisy due to deal timing.",
          "Segment by plan/channel/customer size when blended numbers hide churn pockets.",
          "Use net new ARR as a consistent input to burn multiple (same period).",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing bookings/cash with ARR movements (different timing and definitions).",
          "Including one-time items or services in ARR movements.",
          "Using inconsistent time windows for ARR movements vs burn/spend metrics.",
        ],
      },
    ],
    examples: [
      {
        label: "ARR waterfall example (start $2.4M; +$240k new; +$160k expansion; −$60k contraction; −$100k churn)",
        calculatorSlug: "arr-waterfall-calculator",
        params: {
          startingArr: "2400000",
          newArr: "240000",
          expansionArr: "160000",
          contractionArr: "60000",
          churnedArr: "100000",
        },
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
    slug: "net-new-arr-guide",
    title: "Net new ARR: definition, formula, and how to calculate it",
    description:
      "Net new ARR explained: how to calculate net new ARR from new, expansion, contraction, and churned ARR movements - plus common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: ["net-new-arr-calculator", "burn-multiple-calculator"],
    relatedGlossarySlugs: ["arr", "net-new-arr"],
    sections: [
      { type: "h2", text: "Definition" },
      {
        type: "p",
        text: "Net new ARR is the net change in ARR for a period after adding new and expansion ARR and subtracting contraction and churned ARR. It’s a core input to burn multiple and other SaaS efficiency metrics.",
      },
      { type: "h2", text: "Formula" },
      {
        type: "p",
        text: "Net new ARR = new ARR + expansion ARR − contraction ARR − churned ARR",
      },
      { type: "h2", text: "How to calculate net new ARR" },
      {
        type: "bullets",
        items: [
          "Measure new ARR from customers acquired in the period (annualized recurring run-rate).",
          "Measure expansion ARR from existing customers (upsells, seats, add-ons).",
          "Measure contraction ARR (downgrades) and churned ARR (cancellations).",
          "Apply the formula and keep the definition consistent across months/quarters.",
        ],
      },
      { type: "h2", text: "Net new ARR vs growth rate" },
      {
        type: "bullets",
        items: [
          "Net new ARR is a dollar amount (ΔARR).",
          "ARR growth rate is net new ARR ÷ starting ARR for the period.",
          "Use growth rate for comparisons; use net new ARR for planning and efficiency metrics.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing bookings/cash with ARR movements (different timing and definitions).",
          "Using inconsistent windows (monthly net new ARR with quarterly burn).",
          "Including one-time fees/services in ARR movements.",
        ],
      },
    ],
    examples: [
      {
        label: "Net new ARR example (new $240k; expansion $160k; contraction $60k; churn $100k)",
        calculatorSlug: "net-new-arr-calculator",
        params: { newArr: "240000", expansionArr: "160000", contractionArr: "60000", churnedArr: "100000" },
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
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "incrementality-lift-calculator",
      "roas-calculator",
      "roi-calculator",
    ],
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
  {
    slug: "cohort-ltv-forecast-guide",
    title: "Cohort LTV forecasting: churn, expansion, discounting (practical model)",
    description:
      "A practical guide to cohort-based LTV: why it beats simple churn formulas, how to choose assumptions, and how to interpret discounted LTV.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["cohort-ltv-forecast-calculator", "ltv-calculator"],
    relatedGlossarySlugs: [
      "cohorted-ltv",
      "customer-lifetime",
      "logo-churn",
      "gross-margin",
      "discount-rate",
      "arpa",
    ],
    sections: [
      { type: "h2", text: "Why cohort-based LTV is worth it" },
      {
        type: "p",
        text: "The classic shortcut LTV ≈ (ARPA × gross margin) ÷ churn can mislead because it assumes constant churn, ignores expansion, and can explode when churn is small. A cohort model makes assumptions explicit and is easier to scenario test.",
      },
      { type: "h2", text: "A simple cohort model" },
      {
        type: "bullets",
        items: [
          "Start with ARPA and gross margin to compute monthly gross profit per account.",
          "Apply a monthly retention factor (1 - churn) to model survival.",
          "Apply monthly expansion to surviving accounts to model upgrades/seat growth.",
          "Optionally discount future cash flows to compute discounted LTV.",
        ],
      },
      { type: "h2", text: "Choosing assumptions" },
      {
        type: "bullets",
        items: [
          "Logo churn: start with trailing monthly churn by plan/segment if possible.",
          "Expansion: use observed net retention patterns (expansion often varies heavily by segment).",
          "Discount rate: pick a consistent annual rate (e.g., cost of capital) if you want a present-value lens.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing time units (annual churn plugged into monthly churn).",
          "Confusing logo churn with revenue churn (different denominators).",
          "Using blended averages when segments behave differently (plan, channel, cohort).",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use revenue or gross profit for LTV?",
        answer:
          "For unit economics decisions, gross profit is usually better because it accounts for COGS and variable delivery costs. If you use revenue, you can overstate value and set CAC targets too high.",
      },
      {
        question: "How long should the horizon be?",
        answer:
          "Use 36–60 months for many SaaS products as a practical horizon. For high retention businesses, also run scenarios since long tails dominate the sum.",
      },
    ],
    examples: [
      {
        label: "Example: $800 ARPA, 80% margin, 2% churn, 1% expansion, 60 months, 12% discount",
        calculatorSlug: "cohort-ltv-forecast-calculator",
        params: {
          arpaMonthly: "800",
          grossMarginPercent: "80",
          monthlyChurnPercent: "2",
          monthlyExpansionPercent: "1",
          months: "60",
          annualDiscountRatePercent: "12",
        },
      },
    ],
  },
  {
    slug: "incrementality-lift-guide",
    title: "Incrementality lift: how to compute incremental ROAS from holdouts",
    description:
      "Turn an exposed vs holdout test into incremental conversions, incremental ROAS, and incremental profit for decision-making.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "incrementality-lift-calculator",
      "roas-calculator",
      "break-even-roas-calculator",
    ],
    relatedGlossarySlugs: [
      "incrementality",
      "holdout-test",
      "cvr",
      "aov",
      "contribution-margin",
      "roas",
    ],
    sections: [
      { type: "h2", text: "What lift means" },
      {
        type: "p",
        text: "Lift is the incremental outcome caused by ads compared to a no-ads baseline. A holdout test estimates that baseline by withholding ads from a comparable control group.",
      },
      { type: "h2", text: "Core calculation (holdout scaled)" },
      {
        type: "bullets",
        items: [
          "Holdout CVR = holdout conversions ÷ holdout users.",
          "Expected conversions without ads = exposed users × holdout CVR.",
          "Incremental conversions = exposed conversions - expected without ads.",
          "Incremental ROAS = incremental revenue ÷ ad spend.",
        ],
      },
      { type: "h2", text: "Decision rules (practical)" },
      {
        type: "bullets",
        items: [
          "Use incremental profit, not reported ROAS, to decide what to scale.",
          "If lift is near zero, treat the campaign as demand capture (not demand creation).",
          "Prefer larger and longer tests to reduce noise; avoid changing many variables mid-test.",
        ],
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Holdout users still seeing ads (leakage).",
          "Selection bias: exposed users differ from holdout users.",
          "Ignoring variable costs (use contribution margin, not revenue).",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use revenue, gross profit, or contribution margin?",
        answer:
          "Use contribution margin when possible because it reflects variable costs (fees, shipping, returns). Revenue-only lift can be misleading for low-margin products.",
      },
      {
        question: "Can lift be negative?",
        answer:
          "Yes. It can occur due to noise, bad targeting/creative, or true cannibalization. Double-check randomization and that the holdout truly had no exposure.",
      },
    ],
    examples: [
      {
        label: "Example: 100k exposed users (1,200 conv) vs 100k holdout users (900 conv), $50k spend",
        calculatorSlug: "incrementality-lift-calculator",
        params: {
          exposedUsers: "100000",
          exposedConversions: "1200",
          holdoutUsers: "100000",
          holdoutConversions: "900",
          adSpend: "50000",
          aov: "80",
          contributionMarginPercent: "40",
        },
      },
    ],
  },
  {
    slug: "break-even-pricing-guide",
    title: "Break-even pricing: contribution margin, break-even units, and profit",
    description:
      "A practical guide to break-even pricing: how to compute contribution margin, break-even units, and profit at expected volume.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
    relatedGlossarySlugs: [
      "break-even-revenue",
      "fixed-costs",
      "variable-costs",
      "gross-margin",
      "contribution-margin",
    ],
    sections: [
      { type: "h2", text: "Why break-even pricing matters" },
      {
        type: "p",
        text: "Break-even analysis tells you how much volume you need to cover fixed costs at a given price and variable cost. It’s the fastest way to sanity-check whether a pricing model can work at expected demand.",
      },
      { type: "h2", text: "Key formulas" },
      {
        type: "bullets",
        items: [
          "Contribution per unit = price - variable cost per unit.",
          "Break-even units = fixed costs ÷ contribution per unit.",
          "Profit = units × contribution per unit - fixed costs.",
        ],
      },
      { type: "h2", text: "What to include in variable costs" },
      {
        type: "bullets",
        items: [
          "Payment processing fees, shipping, returns/refunds (ecommerce).",
          "Support or delivery costs that scale with usage (SaaS infrastructure, success).",
          "Any cost that rises with each additional unit/customer/order.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing time windows (monthly fixed costs with annual unit volumes).",
          "Ignoring step costs (capacity constraints can make 'fixed' costs jump).",
          "Treating break-even as success; you usually need buffer margin and profit.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if price equals variable cost?",
        answer:
          "Then contribution margin is zero and you will never break even because each unit contributes nothing toward fixed costs. You need either higher price or lower variable cost.",
      },
      {
        question: "Is break-even revenue more useful than break-even units?",
        answer:
          "They answer similar questions. Units is more intuitive for products with stable pricing; revenue is more general when pricing varies or you have multiple SKUs.",
      },
    ],
    examples: [
      {
        label: "Example: $100 price, $35 variable cost, $50k fixed costs, 1,200 units",
        calculatorSlug: "break-even-pricing-calculator",
        params: {
          pricePerUnit: "100",
          variableCostPerUnit: "35",
          fixedCosts: "50000",
          unitsSold: "1200",
        },
      },
    ],
  },
  {
    slug: "price-increase-guide",
    title: "Price increases in SaaS: break-even churn, segmentation, and rollout",
    description:
      "A practical guide to price increases: how to compute break-even churn, model revenue impact, and roll out changes safely.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["price-increase-break-even-calculator"],
    relatedGlossarySlugs: [
      "price-increase",
      "mrr",
      "arr",
      "arpa",
      "revenue-churn",
      "nrr",
      "grr",
    ],
    sections: [
      { type: "h2", text: "Why price increases are high leverage" },
      {
        type: "p",
        text: "A price increase lifts revenue immediately, and the compounding effect can be significant. The risk is churn, downgrades, or reduced expansion that can erase the uplift. The goal is to understand how much churn you can tolerate and then design a rollout that keeps you well inside that limit.",
      },
      { type: "h2", text: "Break-even churn (quick intuition)" },
      {
        type: "p",
        text: "If churn happens as a one-time shock right after the change, break-even churn is: (1 + increase) × (1 - churn) = 1, so churn_break-even ≈ 1 - 1/(1+increase).",
      },
      { type: "h2", text: "Why ongoing churn is different" },
      {
        type: "bullets",
        items: [
          "A one-time shock is painful but bounded; ongoing churn increase compounds every month.",
          "Downgrades are revenue churn (not logo churn) and often show up as contraction rather than cancellations.",
          "Segment behavior matters: high-usage customers may tolerate increases better than low-usage customers.",
        ],
      },
      { type: "h2", text: "Best practices for rollout" },
      {
        type: "bullets",
        items: [
          "Segment: apply increases by plan, usage, tenure, and value delivered.",
          "Grandfather or offer discounts for a time-bound window for price-sensitive cohorts.",
          "Communicate value and give notice; reduce surprise cancellations.",
          "Measure revenue churn and support tickets in the first 2–8 weeks.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I model new customer growth in the price increase math?",
        answer:
          "For the break-even question, focus on the existing base first. New customer growth can hide churn issues. Once you have baseline safety, layer on new customer MRR scenarios.",
      },
      {
        question: "Which churn should I use?",
        answer:
          "For revenue impact, use revenue churn (MRR lost) rather than logo churn. If you only have logo churn, treat the output as directional and sanity-check with revenue churn once the change ships.",
      },
    ],
    examples: [
      {
        label: "Example: $200k MRR, +10% price increase, 1.5% baseline churn, 12 months",
        calculatorSlug: "price-increase-break-even-calculator",
        params: {
          startingMrr: "200000",
          priceIncreasePercent: "10",
          baselineMonthlyChurnPercent: "1.5",
          horizonMonths: "12",
          immediateChurnPercent: "0",
          ongoingChurnIncreasePercent: "0",
        },
      },
    ],
  },
  {
    slug: "marginal-roas-guide",
    title: "Marginal ROAS: how to scale ads with diminishing returns",
    description:
      "A practical guide to marginal ROAS: why average ROAS misleads at scale, how diminishing returns work, and how to pick a profit-maximizing spend level.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "marginal-roas-calculator",
      "break-even-roas-calculator",
      "incrementality-lift-calculator",
    ],
    relatedGlossarySlugs: [
      "marginal-roas",
      "diminishing-returns",
      "roas",
      "incrementality",
      "contribution-margin",
    ],
    sections: [
      { type: "h2", text: "Average ROAS vs marginal ROAS" },
      {
        type: "p",
        text: "Average ROAS is total revenue divided by total spend. Marginal ROAS is the incremental revenue generated by the next dollar of spend. Scaling decisions should be based on marginal profit (or marginal ROAS vs break-even), not average ROAS.",
      },
      { type: "h2", text: "Why diminishing returns happen" },
      {
        type: "bullets",
        items: [
          "You exhaust the highest-intent users first (audience saturation).",
          "Creative fatigues and CTR drops.",
          "Incrementality declines as you capture more demand (more cannibalization).",
        ],
      },
      { type: "h2", text: "A simple decision rule" },
      {
        type: "p",
        text: "Scale until marginal profit is ~0. Equivalent: scale until marginal ROAS is close to break-even ROAS after variable costs.",
      },
      { type: "h2", text: "How to use this in practice" },
      {
        type: "bullets",
        items: [
          "Run incrementality tests as spend grows; platform ROAS often overstates lift.",
          "Estimate a response curve per channel (search vs paid social vs retargeting).",
          "Use scenario analysis: optimistic/base/conservative exponent and margin.",
        ],
      },
    ],
    faqs: [
      {
        question: "What’s a good marginal ROAS target?",
        answer:
          "It depends on your contribution margin and whether you include fixed costs. As a starting point, compare marginal ROAS to break-even ROAS (1 ÷ contribution margin) and add buffer for uncertainty.",
      },
      {
        question: "Can marginal ROAS be higher than average ROAS?",
        answer:
          "Yes at low spend or when you’re ramping into a new audience/creative. But as spend scales, marginal ROAS typically trends downward due to saturation.",
      },
    ],
    examples: [
      {
        label: "Example: $50k spend, $200k revenue, 40% margin, exponent 0.75",
        calculatorSlug: "marginal-roas-calculator",
        params: {
          currentSpend: "50000",
          currentRevenue: "200000",
          contributionMarginPercent: "40",
          diminishingReturnsExponent: "0.75",
          maxSpendCap: "0",
        },
      },
    ],
  },
  {
    slug: "deferred-revenue-guide",
    title: "Deferred revenue: bridge billings to recognized revenue (with formulas)",
    description:
      "A practical guide to deferred revenue: what it is, why billings and recognized revenue differ, and how to use a rollforward to stay consistent.",
    category: "finance",
    updatedAt: "2026-01-24",
    relatedCalculatorSlugs: [
      "deferred-revenue-rollforward-calculator",
      "bookings-vs-arr-calculator",
      "arr-calculator",
    ],
    relatedGlossarySlugs: [
      "billings",
      "recognized-revenue",
      "deferred-revenue",
      "revenue-recognition",
      "arr-vs-bookings",
    ],
    sections: [
      { type: "h2", text: "Why this topic matters" },
      {
        type: "p",
        text: "Teams often mix bookings, billings, cash, and recognized revenue. Deferred revenue is the bridge that explains timing: it increases when you bill/collect ahead of delivery and decreases as you recognize revenue over time.",
      },
      { type: "h2", text: "Key definitions (quick)" },
      {
        type: "bullets",
        items: [
          "Billings: invoices issued in a period.",
          "Recognized revenue: revenue recorded as earned/delivered.",
          "Deferred revenue: unearned revenue liability (what you billed/collected but haven’t earned yet).",
        ],
      },
      { type: "h2", text: "Deferred revenue rollforward formula" },
      {
        type: "p",
        text: "Ending deferred = beginning deferred + billings − recognized revenue.",
      },
      { type: "h2", text: "How this relates to bookings vs ARR" },
      {
        type: "bullets",
        items: [
          "Bookings are contracted value; they are not automatically billings or revenue.",
          "ARR is a recurring run-rate snapshot; it is not recognized revenue.",
          "Deferred revenue helps explain why billings/cash can spike (annual prepay) while ARR and recognized revenue move differently.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Treating billings as cash receipts (collections timing matters).",
          "Using bookings/TCV as billings without checking invoicing timing.",
          "Ignoring negative deferred revenue outputs (usually indicates definition mismatch).",
        ],
      },
    ],
    faqs: [
      {
        question: "Can deferred revenue go down even if you are growing?",
        answer:
          "Yes. If you shift from annual prepay to monthly billing, or if recognized revenue outpaces new billings for a period, deferred revenue can decline while the business still grows.",
      },
      {
        question: "Is deferred revenue the same as cash collected?",
        answer:
          "No. Deferred revenue is a liability balance. Cash collected is cash. They can move together under prepay, but they differ when collections timing, write-offs, or payment terms differ.",
      },
    ],
    examples: [
      {
        label: "Rollforward example (begin $250k; billings $400k; recognized $350k)",
        calculatorSlug: "deferred-revenue-rollforward-calculator",
        params: { beginningDeferred: "250000", billings: "400000", recognizedRevenue: "350000" },
      },
    ],
  },
  {
    slug: "dcf-valuation-guide",
    title: "DCF valuation: forecast cash flows, discount rate, and terminal value",
    description:
      "A practical guide to DCF valuation: how to forecast FCF, choose a discount rate, and avoid terminal value traps.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["dcf-valuation-calculator", "npv-calculator", "irr-calculator"],
    relatedGlossarySlugs: [
      "dcf",
      "cash-flow",
      "discount-rate",
      "npv",
      "terminal-value",
      "wacc",
    ],
    sections: [
      { type: "h2", text: "What DCF is doing" },
      {
        type: "p",
        text: "A DCF values a business by taking expected future free cash flows and discounting them back to present value. Because businesses last beyond the explicit forecast period, DCFs typically add a terminal value that represents cash flows after the forecast horizon.",
      },
      { type: "h2", text: "Key inputs and how to choose them" },
      {
        type: "bullets",
        items: [
          "Free cash flow (FCF): cash available after operating costs and reinvestment (capex/working capital).",
          "Forecast growth: should fade over time toward a mature level.",
          "Discount rate: risk-adjusted required return (WACC as a common proxy).",
          "Terminal growth: conservative long-run growth, lower than discount rate.",
        ],
      },
      { type: "h2", text: "Terminal value pitfalls" },
      {
        type: "bullets",
        items: [
          "Terminal dominates EV: run sensitivity (r, terminal growth).",
          "Terminal growth ≥ discount rate: mathematically invalid in perpetuity model.",
          "Using aggressive terminal growth: implies implausible long-run scale.",
        ],
      },
      { type: "h2", text: "Practical checklist" },
      {
        type: "bullets",
        items: [
          "Build base/optimistic/conservative scenarios.",
          "Separate unit economics vs macro assumptions (margin, reinvestment).",
          "Cross-check DCF with multiples as a sanity check (not a substitute).",
        ],
      },
    ],
    faqs: [
      {
        question: "Why does the DCF change so much with small discount rate moves?",
        answer:
          "Discounting compounds over time, and terminal value is very sensitive to (r - g). Small changes in r or terminal growth can meaningfully change EV, which is why sensitivity analysis is essential.",
      },
      {
        question: "Is this a full valuation model?",
        answer:
          "It’s a simplified enterprise value estimate. A full model would adjust to equity value using net debt and model reinvestment more explicitly (capex, working capital, taxes).",
      },
    ],
    examples: [
      {
        label: "Example: $5M FCF, 5 years, 15% growth, 12% discount, 3% terminal growth",
        calculatorSlug: "dcf-valuation-calculator",
        params: {
          annualFcf: "5000000",
          forecastYears: "5",
          forecastGrowthPercent: "15",
          discountRatePercent: "12",
          terminalGrowthPercent: "3",
        },
      },
    ],
  },
  {
    slug: "retention-curve-guide",
    title: "Retention curves: how to read them and why they matter",
    description:
      "A practical guide to retention curves: what they show, how to interpret churn vs retention, and how to connect retention to LTV and payback.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["retention-curve-calculator", "cohort-ltv-forecast-calculator"],
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
    sections: [
      { type: "h2", text: "What a retention curve shows" },
      {
        type: "p",
        text: "A retention curve shows the fraction of a cohort that remains active over time. Instead of a single churn number, the curve reveals where drop-off happens (activation period vs later months) and whether retention is improving across cohorts.",
      },
      { type: "h2", text: "Logo vs revenue retention" },
      {
        type: "bullets",
        items: [
          "Logo retention tracks customer count survival (accounts).",
          "Revenue retention (GRR/NRR) tracks dollars retained and can be high even if logo retention is weak (when expansion offsets churn).",
        ],
      },
      { type: "h2", text: "How to use retention curves" },
      {
        type: "bullets",
        items: [
          "Identify the biggest drop (month 1–3 often indicates activation/onboarding issues).",
          "Segment by plan, channel, and cohort start month to avoid blended averages.",
          "Connect to unit economics: retention drives LTV and payback feasibility.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using blended churn to forecast LTV when segments differ materially.",
          "Assuming constant churn forever (churn often decays over time).",
          "Looking at NRR alone and missing logo churn problems.",
        ],
      },
    ],
    faqs: [
      {
        question: "Do I need cohort curves if I already track churn?",
        answer:
          "Yes if you want better forecasting and diagnosis. The shape of the curve matters: two businesses can have the same average churn but very different early retention, which changes payback and growth quality.",
      },
      {
        question: "What’s a good retention curve?",
        answer:
          "It depends on product and segment. The key is improvement over time and strong early retention. Track benchmarks within your own history first, then compare to peers cautiously.",
      },
    ],
    examples: [
      {
        label: "Example: 2% monthly churn, $800 ARPA, 80% margin, 36 months",
        calculatorSlug: "retention-curve-calculator",
        params: {
          monthlyLogoChurnPercent: "2",
          arpaMonthly: "800",
          grossMarginPercent: "80",
          months: "36",
        },
      },
    ],
  },
  {
    slug: "target-cpa-guide",
    title: "Target CPA: how to set acquisition targets from LTV and margin",
    description:
      "A practical guide to target CPA: connect acquisition cost to LTV, contribution margin, and payback constraints (and avoid common mismatches).",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["target-cpa-ltv-calculator", "incrementality-lift-calculator"],
    relatedGlossarySlugs: ["cpa", "cac", "ltv", "contribution-margin", "payback-period", "incrementality"],
    sections: [
      { type: "h2", text: "Why target CPA is not one number" },
      {
        type: "p",
        text: "A CPA that looks great for one business can be disastrous for another. The right target depends on customer value (LTV), margin, and how quickly you need cash back (payback).",
      },
      { type: "h2", text: "Break-even vs target CPA" },
      {
        type: "bullets",
        items: [
          "Break-even CPA: the max you can pay and still make $0 profit on gross profit LTV (no buffer).",
          "Target CPA: a more conservative number that leaves buffer for uncertainty, overhead, and measurement error.",
        ],
      },
      { type: "h2", text: "Best practices" },
      {
        type: "bullets",
        items: [
          "Use gross profit LTV (or contribution after variable costs), not revenue LTV.",
          "Validate incrementality as spend scales; attribution can overstate value.",
          "Add buffer for refunds, fraud, churn shocks, and long payback cycles.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Calling lead CPA 'CAC' without converting leads to customers.",
          "Mixing fully-loaded CAC with revenue-based LTV (mismatch).",
          "Setting a target CPA above break-even because short-window ROAS looks good.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should target CPA include fixed costs?",
        answer:
          "For campaign optimization, target CPA usually reflects variable economics. For business planning, you can set more conservative targets to cover fixed costs and desired profit.",
      },
      {
        question: "What if my payback is too long?",
        answer:
          "Lower your target CPA, improve retention/expansion (raise LTV), raise margin, or change pricing. Long payback can make otherwise 'profitable' acquisition impossible due to cash constraints.",
      },
    ],
    examples: [
      {
        label: "Example: $3,000 revenue LTV, 60% margin, 20% buffer",
        calculatorSlug: "target-cpa-ltv-calculator",
        params: {
          ltvRevenue: "3000",
          contributionMarginPercent: "60",
          targetProfitBufferPercent: "20",
          maxSpendSharePercent: "0",
        },
      },
    ],
  },
  {
    slug: "investment-decision-guide",
    title: "Investment decision metrics: NPV vs IRR vs payback vs PI",
    description:
      "A practical guide to investment decision metrics: when to use NPV, when IRR misleads, and how payback and profitability index fit in.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "investment-decision-calculator",
      "npv-calculator",
      "irr-calculator",
      "discounted-payback-period-calculator",
    ],
    relatedGlossarySlugs: ["npv", "irr", "discount-rate", "marr", "payback-period", "profitability-index"],
    sections: [
      { type: "h2", text: "What each metric is optimizing" },
      {
        type: "bullets",
        items: [
          "NPV: value created in dollars at a chosen required return.",
          "IRR: implied return rate (can be undefined or misleading for some cash flows).",
          "Payback: how quickly you get cash back (often used as a risk constraint).",
          "Profitability index (PI): value per dollar invested (useful when capital is constrained).",
        ],
      },
      { type: "h2", text: "Common traps" },
      {
        type: "bullets",
        items: [
          "Using IRR for mutually exclusive projects of different scale (NPV is better).",
          "Ignoring time value by using simple payback only.",
          "Using a single discount rate without scenario analysis.",
        ],
      },
      { type: "h2", text: "Practical decision flow" },
      {
        type: "bullets",
        items: [
          "Start with NPV at your MARR.",
          "Use payback as a constraint if runway/risk matters.",
          "Use IRR for intuition and comparison, but validate with NPV.",
          "Use PI when you have limited capital and many opportunities.",
        ],
      },
    ],
    faqs: [
      {
        question: "If NPV is positive, should I always do the project?",
        answer:
          "Not always. Consider risk, capacity, strategic fit, and opportunity cost. Many teams require both positive NPV and payback within a threshold.",
      },
      {
        question: "What’s a good MARR?",
        answer:
          "It depends on risk and alternatives. Some teams use WACC for mature businesses and higher hurdle rates for risky projects. Consistency matters more than precision.",
      },
    ],
    examples: [
      {
        label: "Example: $100k investment, $30k/year for 10 years, 12% discount",
        calculatorSlug: "investment-decision-calculator",
        params: {
          initialInvestment: "100000",
          annualCashFlow: "30000",
          years: "10",
          discountRatePercent: "12",
        },
      },
    ],
  },
  {
    slug: "wacc-guide",
    title: "WACC explained: how to estimate a discount rate for DCF",
    description:
      "A practical guide to WACC: what it is, how to compute it, and how to use it (carefully) as a DCF discount rate.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["wacc-calculator", "dcf-valuation-calculator"],
    relatedGlossarySlugs: ["wacc", "discount-rate", "cost-of-equity", "cost-of-debt", "terminal-value"],
    sections: [
      { type: "h2", text: "What WACC means" },
      {
        type: "p",
        text: "WACC (weighted average cost of capital) is the blended required return of capital providers: equity holders and debt holders. Debt is adjusted for taxes because interest is often tax deductible.",
      },
      { type: "h2", text: "Core formula" },
      {
        type: "p",
        text: "WACC = w_e×k_e + w_d×k_d×(1 - tax rate)",
      },
      { type: "h2", text: "How to choose inputs (practical)" },
      {
        type: "bullets",
        items: [
          "Weights: use market-value capital structure when possible (not book values).",
          "Cost of equity: often estimated via CAPM as a starting point (risk-free + beta×equity risk premium).",
          "Cost of debt: current borrowing rate for the firm’s risk profile.",
          "Tax rate: marginal corporate tax rate applicable to interest deductions.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using WACC for projects with different risk than the business.",
          "Using a single-point WACC without sensitivity analysis.",
          "Letting terminal value dominate because discount rate is too low.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is WACC the same as discount rate?",
        answer:
          "WACC is often used as a discount rate proxy for valuing the overall firm. But the correct discount rate should match the risk of the cash flows being discounted.",
      },
      {
        question: "Should I use after-tax or pre-tax cash flows?",
        answer:
          "Be consistent. Most DCFs discount after-tax free cash flows and use WACC as an after-tax rate proxy. Mixing pre-tax cash flows with after-tax discount rates can distort valuation.",
      },
    ],
    examples: [
      {
        label: "Example: 70% equity, 30% debt, 15% cost of equity, 7% cost of debt, 25% tax",
        calculatorSlug: "wacc-calculator",
        params: {
          equityWeightPercent: "70",
          debtWeightPercent: "30",
          costOfEquityPercent: "15",
          costOfDebtPercent: "7",
          taxRatePercent: "25",
        },
      },
    ],
  },
  {
    slug: "mer-guide",
    title: "MER (blended ROAS): how to use it without fooling yourself",
    description:
      "A practical guide to MER: what it is, how it differs from ROAS, how to compute break-even/target MER, and common pitfalls.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["mer-calculator", "break-even-roas-calculator", "marginal-roas-calculator"],
    relatedGlossarySlugs: ["mer", "blended-roas", "roas", "contribution-margin", "incrementality", "attribution-window"],
    sections: [
      { type: "h2", text: "What MER is" },
      {
        type: "p",
        text: "MER (marketing efficiency ratio) is total revenue ÷ total marketing spend over the same period. It’s a top-down metric that reduces attribution noise, but it hides channel-level performance.",
      },
      { type: "h2", text: "Break-even and target MER" },
      {
        type: "bullets",
        items: [
          "Break-even MER ≈ 1 ÷ contribution margin (variable economics).",
          "Target MER should be higher than break-even to leave buffer for uncertainty, overhead, and measurement error.",
        ],
      },
      { type: "h2", text: "How to use MER in practice" },
      {
        type: "bullets",
        items: [
          "Track MER for overall health and directional trends.",
          "Use channel-level ROAS/CPA and incrementality for optimization decisions.",
          "Adjust analysis for seasonality, promos, pricing changes, and returns.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Optimizing to MER alone (can hide wasted spend).",
          "Comparing periods with different attribution windows or delayed revenue recognition.",
          "Using gross revenue without netting refunds/returns where meaningful.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is MER better than ROAS?",
        answer:
          "They’re different tools. MER is better for a top-down check across channels. ROAS (and CPA) are better for within-channel optimization, especially when paired with incrementality tests.",
      },
      {
        question: "What period should I use?",
        answer:
          "Use a consistent window that matches your business cycle (weekly for fast ecommerce, monthly for many teams). Make sure revenue and spend are aligned in time.",
      },
    ],
    examples: [
      {
        label: "Example: $500k revenue, $100k marketing spend, 40% margin, 20% buffer",
        calculatorSlug: "mer-calculator",
        params: {
          totalRevenue: "500000",
          totalMarketingSpend: "100000",
          contributionMarginPercent: "40",
          profitBufferPercent: "20",
        },
      },
    ],
  },
  {
    slug: "two-stage-retention-guide",
    title: "Two-stage churn: modeling early drop-off vs steady-state retention",
    description:
      "A practical guide to two-stage churn models: why early churn matters, how to model it, and how to connect retention improvements to LTV.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["two-stage-retention-curve-calculator", "retention-curve-calculator", "cohort-ltv-forecast-calculator"],
    relatedGlossarySlugs: ["retention-rate", "logo-churn", "activation-rate", "customer-lifetime", "cohorted-ltv", "arpa", "gross-margin"],
    sections: [
      { type: "h2", text: "Why two-stage churn is common" },
      {
        type: "p",
        text: "Many products lose a meaningful share of customers early (activation/onboarding), then settle into a lower steady-state churn rate among customers who achieved product-market fit. A two-stage model captures that pattern better than constant churn.",
      },
      { type: "h2", text: "Model structure" },
      {
        type: "bullets",
        items: [
          "Early phase churn: higher churn for the first N months.",
          "Steady-state churn: lower churn after customers survive the early phase.",
          "Translate retention into value using ARPA and gross margin.",
        ],
      },
      { type: "h2", text: "How to use it for strategy" },
      {
        type: "bullets",
        items: [
          "Improving early churn often has outsized impact because it increases the base that can expand later.",
          "Segment by channel/plan to identify cohorts with steep early drop-off.",
          "Use sensitivity: small changes in early churn can compound over 12–24 months.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Applying blended churn to all segments (hides pockets of weak retention).",
          "Assuming steady-state churn never changes (it can worsen with product changes).",
          "Ignoring expansion and contraction when revenue retention is the real driver.",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I pick early months?",
        answer:
          "Use your cohort curve: the early months are where retention drops most steeply. For many products it’s months 1–3, but it varies by onboarding and purchase cycle.",
      },
      {
        question: "Should I use logo churn or revenue churn?",
        answer:
          "For customer survival curves, use logo churn. For revenue planning, also model GRR/NRR and expansion. Both are useful but answer different questions.",
      },
    ],
    examples: [
      {
        label: "Example: 6% early churn for 3 months, then 1% steady churn, $800 ARPA, 80% margin, 36 months",
        calculatorSlug: "two-stage-retention-curve-calculator",
        params: {
          earlyMonthlyChurnPercent: "6",
          earlyMonths: "3",
          steadyMonthlyChurnPercent: "1",
          arpaMonthly: "800",
          grossMarginPercent: "80",
          months: "36",
        },
      },
    ],
  },
  {
    slug: "revenue-retention-curve-guide",
    title: "Revenue retention curves: GRR vs NRR over time (how to model)",
    description:
      "A practical guide to revenue retention curves: how GRR and NRR compound, how to interpret expansion vs churn, and how to avoid common mistakes.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["revenue-retention-curve-calculator", "nrr-calculator", "grr-calculator"],
    relatedGlossarySlugs: [
      "nrr",
      "grr",
      "net-retention",
      "gross-retention",
      "expansion-mrr",
      "contraction-mrr",
      "churned-mrr",
      "revenue-churn",
    ],
    sections: [
      { type: "h2", text: "Why retention curves matter" },
      {
        type: "p",
        text: "NRR and GRR are often reported as a snapshot, but the compounding effect over 12–24 months is what drives growth quality. A retention curve makes that compounding visible and helps you see which lever matters: expansion vs churn/contraction.",
      },
      { type: "h2", text: "GRR vs NRR (quick recap)" },
      {
        type: "bullets",
        items: [
          "GRR excludes expansion; it answers how leaky the bucket is after churn and downgrades.",
          "NRR includes expansion; it can exceed 100% when upgrades outweigh churn/contraction.",
          "Both can be true: strong NRR can hide weak GRR (expansion masking churn).",
        ],
      },
      { type: "h2", text: "Modeling approach (simple monthly compounding)" },
      {
        type: "bullets",
        items: [
          "Start with cohort MRR.",
          "Apply churn and contraction to get GRR.",
          "Apply expansion (and contraction/churn) to get NRR.",
          "Compound monthly to see 12–24 month outcomes.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using blended averages across segments (plan/channel) and hiding weak cohorts.",
          "Mixing time units (annual NRR used as monthly rates).",
          "Confusing logo churn with revenue churn (different denominators).",
        ],
      },
    ],
    faqs: [
      {
        question: "What’s a good GRR?",
        answer:
          "It depends on segment and stage, but GRR is a 'leakiness' metric: higher is better. Track GRR over time and by segment; improvement is often driven by product quality and customer success.",
      },
      {
        question: "Can I forecast growth using NRR alone?",
        answer:
          "NRR is only the existing base. Overall growth also depends on new customer MRR. Use an MRR forecast model that combines new MRR with retention and expansion.",
      },
    ],
    examples: [
      {
        label: "Example: $100k MRR, 2% expansion, 0.5% contraction, 1.5% churn, 24 months",
        calculatorSlug: "revenue-retention-curve-calculator",
        params: {
          startingMrr: "100000",
          monthlyExpansionPercent: "2",
          monthlyContractionPercent: "0.5",
          monthlyChurnPercent: "1.5",
          months: "24",
        },
      },
    ],
  },
  {
    slug: "max-cpc-guide",
    title: "Max CPC and break-even CPC: how to set bidding targets from margin",
    description:
      "A practical guide to max CPC: translate AOV, CVR, and contribution margin into break-even CPC and a target CPC with buffer.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["max-cpc-calculator", "target-cpa-ltv-calculator", "break-even-roas-calculator"],
    relatedGlossarySlugs: ["cpc", "cpa", "cvr", "aov", "contribution-margin", "break-even-roas"],
    sections: [
      { type: "h2", text: "What max CPC answers" },
      {
        type: "p",
        text: "Max CPC answers a simple question: how much can you pay per click and still hit your unit economics targets? It’s derived from the max CPA you can afford and your click-to-conversion rate (CVR).",
      },
      { type: "h2", text: "Core relationships" },
      {
        type: "bullets",
        items: [
          "Contribution per conversion ≈ AOV × contribution margin.",
          "Break-even CPA = contribution per conversion.",
          "CPA = CPC ÷ CVR, so max CPC = target CPA × CVR.",
          "If you buy impressions (CPM): CPM = CPC × CTR × 1000.",
        ],
      },
      { type: "h2", text: "Best practices" },
      {
        type: "bullets",
        items: [
          "Use click-based CVR when computing CPC targets (avoid denominator mismatch).",
          "Add buffer for refunds/returns and tracking error; don’t run at break-even.",
          "For subscription businesses, prefer LTV-based targets rather than single-order AOV.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Mixing session CVR with click CPC (inconsistent measurement).",
          "Ignoring variable costs (fees, shipping, returns) and overstating margin.",
          "Scaling based on short-window ROAS without incrementality validation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I set bids to max CPC?",
        answer:
          "Usually you bid below max CPC so you have buffer. Use max CPC as a ceiling and then optimize using marginal ROAS and incrementality as spend scales.",
      },
      {
        question: "What if my funnel has multiple steps?",
        answer:
          "Convert CVR to 'click → purchase' (or click → customer) by multiplying stage conversion rates. Alternatively use a funnel calculator and LTV-based targets for more accuracy.",
      },
    ],
    examples: [
      {
        label: "Example: $80 AOV, 40% margin, 2.5% CVR, 20% buffer, CTR disabled",
        calculatorSlug: "max-cpc-calculator",
        params: {
          aov: "80",
          contributionMarginPercent: "40",
          conversionRatePercent: "2.5",
          profitBufferPercent: "20",
          ctrPercent: "0",
        },
      },
    ],
  },
  {
    slug: "equity-value-guide",
    title: "Enterprise value vs equity value: how to bridge EV to equity",
    description:
      "A practical guide to converting enterprise value (EV) into equity value using net debt and other claims (and avoiding common valuation mix-ups).",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["equity-value-calculator", "dcf-valuation-calculator"],
    relatedGlossarySlugs: ["enterprise-value", "equity-value", "net-debt", "dcf", "wacc"],
    sections: [
      { type: "h2", text: "Why this bridge matters" },
      {
        type: "p",
        text: "Valuation outputs are often quoted as enterprise value (EV), especially from DCF models that discount unlevered free cash flows. Investors care about equity value (what’s left for shareholders), which requires adjusting EV for net debt and other claims.",
      },
      { type: "h2", text: "Core bridge" },
      {
        type: "p",
        text: "Equity value = EV + cash - debt - preferred stock - minority interest + other adjustments.",
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Using EV/Revenue multiples but comparing to equity value market cap (mismatch).",
          "Using stale balance sheet numbers with a current EV estimate (date mismatch).",
          "Ignoring other claims (leases, pensions, non-operating assets/liabilities) when material.",
        ],
      },
      { type: "h2", text: "Practical checklist" },
      {
        type: "bullets",
        items: [
          "Make sure EV and balance sheet inputs are from the same date/time frame.",
          "Cross-check: equity value should be roughly market cap (if public) after adjustments.",
          "Use scenarios: EV can change a lot with discount rate and terminal assumptions.",
        ],
      },
    ],
    faqs: [
      {
        question: "If I have equity value, how do I get EV?",
        answer:
          "Reverse the bridge: EV = equity value + net debt + preferred + minority - other adjustments (depending on how you define adjustments). Consistency in definitions matters more than formulas.",
      },
      {
        question: "Do I include cash in EV?",
        answer:
          "By convention, EV represents the operating business value excluding excess cash. That’s why cash is added when converting EV to equity value.",
      },
    ],
    examples: [
      {
        label: "Example: $50M EV, $8M cash, $12M debt",
        calculatorSlug: "equity-value-calculator",
        params: {
          enterpriseValue: "50000000",
          cash: "8000000",
          debt: "12000000",
          preferredStock: "0",
          minorityInterest: "0",
          otherAdjustments: "0",
          sharesOutstanding: "0",
        },
      },
    ],
  },
  {
    slug: "unit-economics-dashboard-guide",
    title: "Unit economics dashboard: LTV, CAC, payback, and what to improve",
    description:
      "A practical guide to unit economics: how to compute gross profit LTV, CAC payback, and LTV:CAC (and what levers improve them).",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "unit-economics-dashboard-calculator",
      "ltv-calculator",
      "blended-cac-calculator",
      "cac-payback-period-calculator",
    ],
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
    sections: [
      { type: "h2", text: "What unit economics tells you" },
      {
        type: "p",
        text: "Unit economics evaluates whether acquiring a customer creates enough gross profit to justify acquisition cost, and whether payback is fast enough for your cash constraints.",
      },
      { type: "h2", text: "Core metrics" },
      {
        type: "bullets",
        items: [
          "Gross profit LTV: expected gross profit from a customer over their lifetime.",
          "CAC payback: months to recover CAC from monthly gross profit.",
          "LTV:CAC: value relative to acquisition cost (helpful, but not sufficient).",
        ],
      },
      { type: "h2", text: "How to improve the dashboard" },
      {
        type: "bullets",
        items: [
          "Increase ARPA: pricing, packaging, upsells, better monetization.",
          "Increase gross margin: reduce COGS/variable costs, optimize infra and support.",
          "Reduce churn: activation, onboarding, product quality, customer success.",
          "Reduce CAC: improve conversion rates, targeting, and sales efficiency.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue LTV instead of gross profit LTV.",
          "Mixing fully-loaded CAC with revenue-based LTV (mismatch).",
          "Relying on a single ratio (track payback and cash runway too).",
        ],
      },
    ],
    faqs: [
      {
        question: "Is LTV:CAC of 3× always good?",
        answer:
          "Not always. If payback is long, you can still run out of cash. For fast-growing businesses, payback and cash constraints often matter more than a single ratio.",
      },
      {
        question: "Should I use logo churn or revenue churn in LTV?",
        answer:
          "For accuracy, use cohort-based revenue retention curves (especially if expansion is meaningful). Logo churn is a shortcut that can mislead when revenue per account changes over time.",
      },
    ],
    examples: [
      {
        label: "Example: $800 ARPA, 80% margin, 2% churn, $6k CAC, 12 month target payback",
        calculatorSlug: "unit-economics-dashboard-calculator",
        params: {
          arpaMonthly: "800",
          grossMarginPercent: "80",
          monthlyLogoChurnPercent: "2",
          cac: "6000",
          targetPaybackMonths: "12",
        },
      },
    ],
  },
  {
    slug: "break-even-cpm-guide",
    title: "Break-even CPM: how to price impressions from CTR, CVR, and margin",
    description:
      "A practical guide to break-even CPM: translate CTR, CVR, AOV, and contribution margin into a max CPM and a target CPM with buffer.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["break-even-cpm-calculator", "max-cpc-calculator"],
    relatedGlossarySlugs: ["cpm", "ctr", "cvr", "aov", "contribution-margin", "max-cpc"],
    sections: [
      { type: "h2", text: "Why break-even CPM matters" },
      {
        type: "p",
        text: "If you buy impressions, your economics flow through CTR and CVR. Break-even CPM tells you the maximum cost per 1,000 impressions you can pay while still breaking even on variable economics.",
      },
      { type: "h2", text: "Core math" },
      {
        type: "bullets",
        items: [
          "Clicks/1000 = 1000×CTR.",
          "Conversions/1000 = clicks/1000 × CVR = 1000×CTR×CVR.",
          "Contribution per conversion ≈ AOV × contribution margin.",
          "Break-even CPM = conversions/1000 × contribution per conversion.",
        ],
      },
      { type: "h2", text: "Best practices" },
      {
        type: "bullets",
        items: [
          "Use click-based CVR if you’re using click-based CTR.",
          "Add a profit buffer; don’t operate at break-even.",
          "Validate incrementality as spend scales (attribution can overstate value).",
        ],
      },
    ],
    faqs: [
      {
        question: "How do I choose CTR and CVR inputs?",
        answer:
          "Start with observed averages for the same placement mix. Then run scenarios: small changes in CTR or CVR can materially change break-even CPM.",
      },
      {
        question: "How does this relate to CPC?",
        answer:
          "They’re linked: CPM ≈ CPC × CTR × 1000. If you know your max CPC and CTR, you can infer a max CPM and vice versa.",
      },
    ],
    examples: [
      {
        label: "Example: 1.5% CTR, 2.5% CVR, $80 AOV, 40% margin, 20% buffer",
        calculatorSlug: "break-even-cpm-calculator",
        params: {
          ctrPercent: "1.5",
          cvrPercent: "2.5",
          aov: "80",
          contributionMarginPercent: "40",
          profitBufferPercent: "20",
        },
      },
    ],
  },
  {
    slug: "multiple-valuation-guide",
    title: "Multiple valuation: how to use ARR/revenue multiples and avoid mix-ups",
    description:
      "A practical guide to multiple-based valuation: choosing a metric, applying EV multiples, and bridging to equity value via net debt.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["multiple-valuation-calculator", "equity-value-calculator"],
    relatedGlossarySlugs: ["arr", "arr-valuation-multiple", "enterprise-value", "equity-value", "net-debt"],
    sections: [
      { type: "h2", text: "What multiple valuation is doing" },
      {
        type: "p",
        text: "Multiple valuation estimates enterprise value by multiplying a metric (ARR or revenue) by a market multiple from comparable companies. It’s fast and useful for scenario planning, but it requires clean definitions and context.",
      },
      { type: "h2", text: "Key rules" },
      {
        type: "bullets",
        items: [
          "Match the multiple to the metric definition used by comps (ARR definition matters).",
          "EV multiples produce enterprise value; bridge to equity value using net debt.",
          "Use scenarios: multiples vary with growth, margin, and retention.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Comparing market cap (equity value) to EV/Revenue multiples (mismatch).",
          "Including one-time revenue in ARR and overvaluing the business.",
          "Ignoring retention and margin differences when picking a multiple.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do ARR multiples differ so much?",
        answer:
          "Because the market prices growth quality: higher growth, higher gross margin, and stronger NRR/GRR often support higher multiples. Interest rates and risk appetite also move multiples materially.",
      },
      {
        question: "Is multiple valuation better than DCF?",
        answer:
          "Neither is 'better' universally. Multiples are fast and market-anchored; DCF is assumption-driven and can be more detailed. Many teams use both as cross-checks.",
      },
    ],
    examples: [
      {
        label: "Example: $5M ARR, 6× multiple, $1M cash, $2M debt",
        calculatorSlug: "multiple-valuation-calculator",
        params: {
          metricValue: "5000000",
          multiple: "6",
          cash: "1000000",
          debt: "2000000",
        },
      },
    ],
  },
  {
    slug: "cohort-payback-curve-guide",
    title: "Cohort payback curves: how to model payback with early churn",
    description:
      "A practical guide to cohort payback: why payback matters for survival, how early churn affects payback, and how to improve it.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: [
      "cohort-payback-curve-calculator",
      "two-stage-retention-curve-calculator",
      "cash-runway-calculator",
    ],
    relatedGlossarySlugs: [
      "payback-period",
      "cac",
      "retention-rate",
      "logo-churn",
      "arpa",
      "gross-margin",
      "cohorted-ltv",
      "expansion-mrr",
      "runway",
    ],
    sections: [
      { type: "h2", text: "Why payback is a cash constraint" },
      {
        type: "p",
        text: "Payback asks how long it takes to recover CAC using gross profit from the customer. Even if LTV is high, long payback can be fatal if you run out of cash before the cohort pays back.",
      },
      { type: "h2", text: "Early churn is the main lever" },
      {
        type: "bullets",
        items: [
          "Early churn reduces the number of customers who generate month 6+ value.",
          "Improving activation/onboarding can reduce payback faster than improving steady-state churn.",
          "Expansion compounds on the customers you keep, so retention improvements amplify expansion.",
        ],
      },
      { type: "h2", text: "How to use a payback curve" },
      {
        type: "bullets",
        items: [
          "Model optimistic/base/conservative retention scenarios.",
          "Track payback by channel and plan (cohorts differ).",
          "Pair payback with runway to decide how aggressively you can scale acquisition.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue instead of gross profit (ignores margin and variable costs).",
          "Using blended churn rates across segments.",
          "Ignoring expansion and downgrades when revenue per account changes materially.",
        ],
      },
    ],
    faqs: [
      {
        question: "What payback is 'good'?",
        answer:
          "It depends on your cash position and growth model. Many SaaS teams aim for ~6–18 months, but earlier-stage or lower-margin businesses often need faster payback.",
      },
      {
        question: "Should I include sales salaries in CAC?",
        answer:
          "For planning, yes (blended CAC). For channel optimization, teams often track paid CAC separately. Be consistent in the definition you use to judge payback.",
      },
    ],
    examples: [
      {
        label: "Example: $6k CAC, $800 ARPA, 80% margin, 6% early churn (3 months), 1% steady churn, 0.5% expansion",
        calculatorSlug: "cohort-payback-curve-calculator",
        params: {
          cac: "6000",
          arpaMonthly: "800",
          grossMarginPercent: "80",
          earlyMonthlyChurnPercent: "6",
          earlyMonths: "3",
          steadyMonthlyChurnPercent: "1",
          monthlyExpansionPercent: "0.5",
          months: "36",
        },
      },
    ],
  },
  {
    slug: "break-even-ctr-guide",
    title: "Break-even CTR: required CTR at a given CPM (with buffer)",
    description:
      "A practical guide to break-even CTR: how to compute required CTR from CPM, CVR, AOV, and margin, and how to use it for creative targets.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["break-even-ctr-calculator", "break-even-cpm-calculator"],
    relatedGlossarySlugs: ["ctr", "cpm", "cvr", "aov", "contribution-margin", "break-even-cpm"],
    sections: [
      { type: "h2", text: "Why CTR targets matter" },
      {
        type: "p",
        text: "For impression-buying, CTR is a first-order lever. If your CTR is too low, you won't generate enough clicks and conversions per 1,000 impressions to cover CPM at your CVR and margin.",
      },
      { type: "h2", text: "Core math (quick reference)" },
      {
        type: "bullets",
        items: [
          "Conversions/1000 = 1000×CTR×CVR.",
          "Contribution/conversion ≈ AOV×margin.",
          "Break-even CPM = conversions/1000 × contribution/conversion.",
          "Break-even CTR = CPM ÷ (1000×CVR×AOV×margin).",
        ],
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "Use required CTR as a creative-quality target for a placement mix.",
          "If required CTR is unrealistic, you need better CVR, higher AOV, better margin, or lower CPM.",
          "Add a buffer; operating at break-even is fragile.",
        ],
      },
    ],
    faqs: [
      {
        question: "What if my CTR is high but I still lose money?",
        answer:
          "Then the bottleneck is likely CVR or margin. CTR only gets you clicks; conversion quality and economics determine profitability.",
      },
      {
        question: "Should I use click CVR or session CVR?",
        answer:
          "Use click-based CVR when computing CTR/CPC economics to avoid denominator mismatch. If you only have session CVR, treat results as directional.",
      },
    ],
    examples: [
      {
        label: "Example: $12 CPM, 2.5% CVR, $80 AOV, 40% margin, 20% buffer",
        calculatorSlug: "break-even-ctr-calculator",
        params: {
          cpm: "12",
          cvrPercent: "2.5",
          aov: "80",
          contributionMarginPercent: "40",
          profitBufferPercent: "20",
        },
      },
    ],
  },
  {
    slug: "dcf-sensitivity-guide",
    title: "DCF sensitivity: discount rate vs terminal growth (how to read it)",
    description:
      "A practical guide to DCF sensitivity analysis: why valuations swing, how to pick ranges, and how to avoid terminal value traps.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["dcf-sensitivity-calculator", "dcf-valuation-calculator", "wacc-calculator"],
    relatedGlossarySlugs: ["dcf", "wacc", "discount-rate", "terminal-value", "sensitivity-analysis"],
    sections: [
      { type: "h2", text: "Why sensitivity matters" },
      {
        type: "p",
        text: "DCF valuation is highly sensitive to discount rate and terminal assumptions. Sensitivity analysis shows how robust your conclusion is to reasonable ranges of inputs.",
      },
      { type: "h2", text: "How to pick ranges" },
      {
        type: "bullets",
        items: [
          "Discount rate: start with WACC as a base, then test ±1–3%.",
          "Terminal growth: test conservative long-run rates (often 0–4% depending on context).",
          "If terminal dominates EV, consider extending the forecast or making assumptions more conservative.",
        ],
      },
      { type: "h2", text: "Common traps" },
      {
        type: "bullets",
        items: [
          "Terminal growth ≥ discount rate (invalid in perpetuity model).",
          "Picking a range that’s too narrow and creating false confidence.",
          "Using accounting earnings instead of cash flow for valuation.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why does EV change so much when discount rate moves 1%?",
        answer:
          "Discounting compounds over time and terminal value is sensitive to (r - g). Small changes can meaningfully affect present value, especially for long-duration cash flows.",
      },
      {
        question: "Is a 3×3 grid enough?",
        answer:
          "It’s a quick sanity check. For important decisions, expand to more scenarios and also test key operating assumptions (margin, reinvestment, growth fade).",
      },
    ],
    examples: [
      {
        label: "Example: $5M FCF, 5 years @ 15% growth, base 12% discount ±2%, base 3% terminal ±1%",
        calculatorSlug: "dcf-sensitivity-calculator",
        params: {
          annualFcf: "5000000",
          forecastYears: "5",
          forecastGrowthPercent: "15",
          baseDiscountRatePercent: "12",
          discountRateStepPercent: "2",
          baseTerminalGrowthPercent: "3",
          terminalGrowthStepPercent: "1",
        },
      },
    ],
  },
  {
    slug: "ab-test-sample-size-guide",
    title: "A/B test sample size: how to plan conversion experiments",
    description:
      "A practical guide to A/B test planning: baseline CVR, MDE, alpha, power, sample size, and common pitfalls like peeking.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["ab-test-sample-size-calculator"],
    relatedGlossarySlugs: ["ab-test", "statistical-significance", "power", "mde", "cvr"],
    sections: [
      { type: "h2", text: "Why sample size planning matters" },
      {
        type: "p",
        text: "Without enough sample, A/B tests produce noisy results: you might ship a false win or miss a real improvement. Planning sample size sets expectations for how long a test must run.",
      },
      { type: "h2", text: "Key inputs" },
      {
        type: "bullets",
        items: [
          "Baseline CVR: your current conversion rate for the exact funnel definition.",
          "MDE: the smallest lift worth acting on (absolute percentage points).",
          "Alpha: tolerated false positive rate (commonly 5% for two-sided tests).",
          "Power: probability of detecting the effect if it’s real (commonly 80–90%).",
        ],
      },
      { type: "h2", text: "Common pitfalls" },
      {
        type: "bullets",
        items: [
          "Peeking and stopping early (inflates false positives).",
          "Picking an unrealistic MDE (forces huge sample sizes).",
          "Mixing denominators (click CVR vs session CVR) and invalidating the test.",
          "Running tests through seasonality or major site changes without controls.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use one-sided or two-sided tests?",
        answer:
          "Two-sided is safer and more standard unless you truly would never act on a negative result. This calculator assumes a two-sided test.",
      },
      {
        question: "What if traffic is low?",
        answer:
          "Increase MDE (test bigger changes), increase test duration, or test higher-funnel metrics first. You can also pool traffic across similar pages if the experience is consistent.",
      },
    ],
    examples: [
      {
        label: "Example: 2.5% baseline, 0.5pp MDE, 5% alpha, 80% power",
        calculatorSlug: "ab-test-sample-size-calculator",
        params: {
          baselineCvrPercent: "2.5",
          mdePercentPoints: "0.5",
          alphaPercent: "5",
          powerPercent: "80",
        },
      },
    ],
  },
  {
    slug: "cpl-to-cac-guide",
    title: "CPL to CAC: why lead gen metrics mislead (and how to fix it)",
    description:
      "A practical guide to converting CPL into CAC using lead-to-customer rates, and how to improve CAC by improving lead quality and close rate.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["cpl-to-cac-calculator", "blended-cac-calculator"],
    relatedGlossarySlugs: ["cpl", "cac", "cpa", "lead-to-customer-rate", "incrementality"],
    sections: [
      { type: "h2", text: "Why CPL can be a trap" },
      {
        type: "p",
        text: "CPL is only meaningful if lead quality is stable. If lead-to-customer rate falls, CAC rises even if CPL looks great. Always connect top-of-funnel metrics to paying-customer outcomes.",
      },
      { type: "h2", text: "Core relationship" },
      {
        type: "p",
        text: "CAC = CPL ÷ (lead-to-customer rate).",
      },
      { type: "h2", text: "How to improve CAC (practical levers)" },
      {
        type: "bullets",
        items: [
          "Improve lead quality: tighter targeting, better qualification, clearer messaging.",
          "Improve close rate: faster follow-up, better sales process, better offer.",
          "Reduce CPL without losing quality: creative testing, landing page optimization.",
          "Measure cohorts: today’s leads convert later; short windows can lie.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Changing lead definition (MQL/SQL drift) and breaking CAC comparisons.",
          "Optimizing for volume and reducing intent (close rate drops).",
          "Ignoring incrementality and counting conversions that would happen anyway.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I use CPA or CAC in reporting?",
        answer:
          "CPA often refers to cost per conversion event (lead, signup, purchase). CAC should refer to cost per new paying customer. Use both, but label the denominator clearly.",
      },
      {
        question: "What if my sales cycle is long?",
        answer:
          "Use cohort-based reporting: group leads by week/month acquired and measure eventual conversion to customer. Otherwise CAC will look worse in recent periods due to lag.",
      },
    ],
    examples: [
      {
        label: "Example: $80 CPL, 5% lead-to-customer rate, $1,500 target CAC",
        calculatorSlug: "cpl-to-cac-calculator",
        params: {
          cpl: "80",
          leadToCustomerRatePercent: "5",
          targetCac: "1500",
        },
      },
    ],
  },
  {
    slug: "break-even-cvr-guide",
    title: "Break-even CVR: required conversion rate at a given CPM and CTR",
    description:
      "A practical guide to break-even CVR: compute required CVR from CPM, CTR, AOV, and margin, and how to use it for landing page targets.",
    category: "paid-ads",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["break-even-cvr-calculator", "break-even-ctr-calculator", "break-even-cpm-calculator"],
    relatedGlossarySlugs: ["cvr", "cpm", "ctr", "aov", "contribution-margin", "break-even-cpm"],
    sections: [
      { type: "h2", text: "What break-even CVR tells you" },
      {
        type: "p",
        text: "Break-even CVR tells you how strong your click-to-conversion rate must be to justify a given CPM and CTR given your AOV and margin. It’s a fast way to sanity-check whether a placement mix can be profitable.",
      },
      { type: "h2", text: "Core relationship" },
      {
        type: "p",
        text: "Break-even CVR = CPM ÷ (1000 × CTR × AOV × margin).",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "If required CVR is unrealistic, you need lower CPM, higher CTR, higher AOV, or higher margin.",
          "Add a buffer; operating at break-even is fragile under noise and attribution error.",
          "Validate with incrementality as spend scales.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is CVR a landing page metric or a funnel metric?",
        answer:
          "Both. CVR can mean click→purchase, session→purchase, or click→lead depending on your definition. Use the definition that matches your spend denominator and your business model.",
      },
      {
        question: "How do I increase CVR fastest?",
        answer:
          "Improve offer clarity, reduce friction, speed up pages, improve trust signals, and match ad intent to landing content. Also filter low-intent traffic that inflates clicks without conversions.",
      },
    ],
    examples: [
      {
        label: "Example: $12 CPM, 1.5% CTR, $80 AOV, 40% margin, 20% buffer",
        calculatorSlug: "break-even-cvr-calculator",
        params: {
          cpm: "12",
          ctrPercent: "1.5",
          aov: "80",
          contributionMarginPercent: "40",
          profitBufferPercent: "20",
        },
      },
    ],
  },
  {
    slug: "retention-targets-planner-guide",
    title: "NRR/GRR targets: how to translate targets into expansion and churn goals",
    description:
      "A practical guide to retention targets: how NRR maps to required expansion and how GRR maps to maximum churn+contraction (with monthly vs annual units).",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["retention-targets-planner-calculator", "revenue-retention-curve-calculator"],
    relatedGlossarySlugs: [
      "nrr",
      "grr",
      "net-retention",
      "gross-retention",
      "expansion-mrr",
      "contraction-mrr",
      "revenue-churn",
    ],
    sections: [
      { type: "h2", text: "What targets should do" },
      {
        type: "p",
        text: "Retention targets are only useful if they turn into controllable levers. NRR targets imply an expansion requirement. GRR targets imply a maximum combined churn+contraction allowance.",
      },
      { type: "h2", text: "Two identities (monthly)" },
      {
        type: "bullets",
        items: [
          "NRR = 1 + expansion - contraction - churn.",
          "GRR = 1 - contraction - churn.",
        ],
      },
      { type: "h2", text: "Avoid unit mistakes" },
      {
        type: "bullets",
        items: [
          "Do not plug annual NRR into a monthly model without conversion.",
          "Monthly targets compound: small differences become huge over 12 months.",
          "Set targets by segment (plan/channel) to avoid blended averages.",
        ],
      },
      { type: "h2", text: "How to use targets operationally" },
      {
        type: "bullets",
        items: [
          "Expansion: upsells, seat growth, add-ons, pricing migrations.",
          "Contraction: prevent downgrades via value realization and success programs.",
          "Churn: activation, onboarding, product quality, support, pricing fit.",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I prioritize GRR or NRR?",
        answer:
          "Both matter. GRR measures leakiness (product quality). NRR measures total existing-base growth including expansion. Strong NRR can hide weak GRR, so track both.",
      },
      {
        question: "Do these formulas apply to all businesses?",
        answer:
          "They apply to recurring revenue cohorts. If you have one-time revenue, use different metrics or isolate the recurring base first.",
      },
    ],
    examples: [
      {
        label: "Example: 1.5% churn, 0.5% contraction, target 102% NRR and 98% GRR (monthly)",
        calculatorSlug: "retention-targets-planner-calculator",
        params: {
          monthlyChurnPercent: "1.5",
          monthlyContractionPercent: "0.5",
          targetMonthlyNrrPercent: "102",
          targetMonthlyGrrPercent: "98",
        },
      },
    ],
  },
  {
    slug: "gross-margin-impact-guide",
    title: "Gross margin improvements: how margin changes LTV, payback, and growth ability",
    description:
      "A practical guide to margin leverage: how improving gross margin increases gross profit LTV and speeds up CAC payback.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["gross-margin-impact-calculator", "unit-economics-dashboard-calculator"],
    relatedGlossarySlugs: ["gross-margin", "ltv", "payback-period", "cac", "arpa", "churn-rate"],
    sections: [
      { type: "h2", text: "Why margin is a growth lever" },
      {
        type: "p",
        text: "Higher gross margin increases gross profit per customer. That directly increases LTV (when modeled on gross profit) and reduces payback, which improves your ability to scale acquisition without running out of cash.",
      },
      { type: "h2", text: "Key relationships" },
      {
        type: "bullets",
        items: [
          "Gross profit/month = ARPA × gross margin.",
          "Payback ≈ CAC ÷ gross profit/month.",
          "Gross profit LTV ≈ (ARPA×gross margin) ÷ churn (shortcut).",
        ],
      },
      { type: "h2", text: "How to improve margin (practical)" },
      {
        type: "bullets",
        items: [
          "Reduce infrastructure and delivery costs (optimize usage, contracts, architecture).",
          "Reduce support and success costs per customer (self-serve, product improvements).",
          "Fix refunds/returns and payment fees (where applicable).",
          "Improve pricing and packaging (capture value delivered).",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue LTV and forgetting costs.",
          "Assuming churn stays constant after pricing changes.",
          "Ignoring segment differences (margin and churn can vary by plan).",
        ],
      },
    ],
    faqs: [
      {
        question: "Should I optimize gross margin or contribution margin?",
        answer:
          "If variable costs beyond COGS are meaningful, contribution margin is more decision-useful for acquisition and payback. Use the definition that matches your model.",
      },
      {
        question: "Can margin improvements hurt retention?",
        answer:
          "Yes if margin improvements come from reducing customer value (support cuts, feature removal). Validate with cohort retention and NRR/GRR trends.",
      },
    ],
    examples: [
      {
        label: "Example: $800 ARPA, 2% churn, $6k CAC, 70%→80% margin",
        calculatorSlug: "gross-margin-impact-calculator",
        params: {
          arpaMonthly: "800",
          monthlyChurnPercent: "2",
          cac: "6000",
          currentGrossMarginPercent: "70",
          targetGrossMarginPercent: "80",
        },
      },
    ],
  },
  {
    slug: "pricing-packaging-guardrails-guide",
    title: "Pricing guardrails: payback-based minimum price and max discount",
    description:
      "A practical guide to pricing guardrails: compute minimum ARPA (or max discount) from CAC, margin, and a target payback to avoid breaking unit economics.",
    category: "saas-metrics",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["pricing-packaging-guardrails-calculator", "price-increase-break-even-calculator"],
    relatedGlossarySlugs: ["cac-payback-period", "gross-margin", "arpa", "price-increase", "discount-rate"],
    sections: [
      { type: "h2", text: "Why payback guardrails matter" },
      {
        type: "p",
        text: "Discounts and packaging changes can quietly destroy payback. Guardrails convert a target payback into a minimum ARPA (or a maximum discount) so pricing decisions don’t break your cash model.",
      },
      { type: "h2", text: "Core relationship" },
      {
        type: "p",
        text: "Payback ≈ CAC ÷ (ARPA×margin). Rearranging gives min ARPA and max discount allowed for a payback target.",
      },
      { type: "h2", text: "How to use it" },
      {
        type: "bullets",
        items: [
          "Set guardrails by segment (plan, channel, region) rather than a blended average.",
          "Pair payback guardrails with retention risk checks (churn sensitivity).",
          "Use in discount approval workflows to prevent out-of-policy deals.",
        ],
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Using revenue instead of gross profit (margin).",
          "Ignoring churn changes from pricing changes.",
          "Using one guardrail for all segments despite different CAC and ARPA.",
        ],
      },
    ],
    faqs: [
      {
        question: "If I hit payback, am I safe?",
        answer:
          "Not always. Payback is a cash constraint, but you still need long-run profitability and retention. Pair payback with LTV and retention curves.",
      },
      {
        question: "Should I use ARR instead of ARPA?",
        answer:
          "For monthly payback, use monthly ARPA. You can convert annual pricing to monthly ARPA for consistent units.",
      },
    ],
    examples: [
      {
        label: "Example: $800 ARPA, $6k CAC, 80% margin, 12-month payback target",
        calculatorSlug: "pricing-packaging-guardrails-calculator",
        params: {
          currentArpaMonthly: "800",
          cac: "6000",
          grossMarginPercent: "80",
          targetPaybackMonths: "12",
        },
      },
    ],
  },
  {
    slug: "loan-payment-guide",
    title: "Loan amortization: how monthly payments and total interest work",
    description:
      "A practical guide to loan amortization: monthly payment formula, why interest dominates early, and how term and rate affect total interest.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["loan-payment-calculator"],
    relatedGlossarySlugs: ["apr", "amortization", "principal", "interest-rate"],
    sections: [
      { type: "h2", text: "What amortization means" },
      {
        type: "p",
        text: "Amortization is the process of repaying a loan over time with fixed payments. Each payment includes interest on the outstanding principal and a principal repayment component.",
      },
      { type: "h2", text: "Why early payments are interest-heavy" },
      {
        type: "p",
        text: "Interest is calculated on the remaining balance. Early on, the balance is high, so interest is high. Over time, as principal decreases, the interest portion falls and principal repayment increases.",
      },
      { type: "h2", text: "How to use this calculator" },
      {
        type: "bullets",
        items: [
          "Compare terms: longer term lowers monthly payment but increases total interest.",
          "Compare rates: small APR changes can have large payment impact over long terms.",
          "Use scenarios for refinance decisions (include fees separately).",
        ],
      },
    ],
    faqs: [
      {
        question: "Does this include property taxes or insurance?",
        answer:
          "No. This calculator is for principal+interest only. Taxes, insurance, PMI, and fees can materially change total monthly cost.",
      },
      {
        question: "How do extra payments affect the loan?",
        answer:
          "Extra principal payments reduce balance faster, which reduces total interest and can shorten the term. This calculator assumes no extra payments.",
      },
    ],
    examples: [
      {
        label: "Example: $300k principal, 6.5% APR, 30 years",
        calculatorSlug: "loan-payment-calculator",
        params: { principal: "300000", aprPercent: "6.5", termYears: "30" },
      },
    ],
  },
  {
    slug: "apr-vs-apy-guide",
    title: "APR vs APY: how compounding changes the effective rate",
    description:
      "A practical guide to APR vs APY: what each means, how to convert between them, and common comparison mistakes.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["apr-to-apy-calculator"],
    relatedGlossarySlugs: ["apr", "apy", "compounding", "interest-rate"],
    sections: [
      { type: "h2", text: "APR vs APY in plain English" },
      {
        type: "p",
        text: "APR is a nominal annual rate. APY is the effective annual rate after compounding. If interest compounds more than once per year, APY will be higher than APR (for positive rates).",
      },
      { type: "h2", text: "Conversion formula" },
      {
        type: "p",
        text: "APY = (1 + APR/n)^n - 1, where n is compounding periods per year.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Comparing APRs with different compounding conventions.",
          "Confusing APY (nominal compounding) with real return (inflation-adjusted).",
          "Ignoring fees and points that change the effective cost/return.",
        ],
      },
    ],
    faqs: [
      {
        question: "Why do savings accounts advertise APY?",
        answer:
          "APY standardizes the effective annual yield including compounding so products are easier to compare.",
      },
      {
        question: "Is APR always the right number for loans?",
        answer:
          "APR helps compare loans, but fees, points, and repayment structure can still matter. Always check total cost under your expected repayment plan.",
      },
    ],
    examples: [
      {
        label: "Example: 6.0% APR compounded monthly",
        calculatorSlug: "apr-to-apy-calculator",
        params: { aprPercent: "6.0", compoundsPerYear: "12" },
      },
    ],
  },
  {
    slug: "real-vs-nominal-return-guide",
    title: "Real vs nominal return: inflation-adjusted performance",
    description:
      "A practical guide to real return: how inflation changes purchasing power and why nominal returns can mislead over long horizons.",
    category: "finance",
    updatedAt: "2026-01-23",
    relatedCalculatorSlugs: ["real-return-calculator"],
    relatedGlossarySlugs: ["inflation", "real-return", "interest-rate"],
    sections: [
      { type: "h2", text: "Why real return matters" },
      {
        type: "p",
        text: "Nominal returns measure how your balance changes. Real returns measure how your purchasing power changes after inflation. Over long horizons, the difference can be huge.",
      },
      { type: "h2", text: "Core relationship" },
      {
        type: "p",
        text: "Real return ≈ (1 + nominal) ÷ (1 + inflation) - 1.",
      },
      { type: "h2", text: "Common mistakes" },
      {
        type: "bullets",
        items: [
          "Comparing nominal returns across periods with different inflation regimes.",
          "Using CPI inflation as a precise measure for personal spending baskets.",
          "Ignoring taxes (after-tax real return can be materially lower).",
        ],
      },
    ],
    faqs: [
      {
        question: "Can real return be negative when nominal return is positive?",
        answer:
          "Yes. If inflation exceeds nominal return, purchasing power falls even if the nominal balance grows.",
      },
      {
        question: "Is real return enough to compare investments?",
        answer:
          "It’s necessary but not sufficient. You also need to consider risk, volatility, and liquidity. Real return is about purchasing power, not risk-adjusted performance.",
      },
    ],
    examples: [
      {
        label: "Example: 10% nominal return, 3% inflation",
        calculatorSlug: "real-return-calculator",
        params: { nominalReturnPercent: "10", inflationPercent: "3" },
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
