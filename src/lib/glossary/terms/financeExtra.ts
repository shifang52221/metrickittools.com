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
    category: "finance",
    updatedAt: seed.updatedAt ?? "2026-01-24",
    sections: sectionsFor(seed),
    faqs: seed.faqs,
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "cash-balance",
    title: "Cash Balance",
    description:
      "Cash balance is the amount of cash (and often cash equivalents) available at a point in time. It is the starting point for runway planning.",
    bullets: [
      "Use cash balance with net burn to estimate runway.",
      "Separate restricted cash from available operating cash for planning.",
    ],
    relatedGuideSlugs: ["cash-runway-guide", "runway-burn-cash-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator"],
  },
  {
    slug: "cash-reserve",
    title: "Cash Reserve",
    description:
      "A cash reserve is a buffer of cash set aside to absorb shocks (revenue drops, delayed collections) without forcing emergency cuts.",
    bullets: [
      "Define reserve policy in months of net burn (for example 3-6 months).",
      "Reserves reduce downside risk but have opportunity cost; revisit as your risk profile changes.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide"],
  },
  {
    slug: "operating-cash-flow",
    title: "Operating Cash Flow",
    description:
      "Operating cash flow is cash generated (or consumed) by core business operations, including working capital movement (AR/AP/deferred revenue).",
    bullets: [
      "Operating cash flow can diverge from operating profit due to working capital.",
      "Improving collections and payment terms often improves operating cash flow quickly.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "investing-cash-flow",
    title: "Investing Cash Flow",
    description:
      "Investing cash flow captures cash used for or generated from long-term investments (capex, acquisitions, asset sales).",
    bullets: [
      "Treat large capex as a runway event; it can shorten runway even if operating metrics are stable.",
      "Separate maintenance capex from growth capex for clearer planning.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "investment-decision-guide"],
    relatedCalculatorSlugs: ["investment-decision-calculator"],
  },
  {
    slug: "financing-cash-flow",
    title: "Financing Cash Flow",
    description:
      "Financing cash flow captures cash from debt and equity financing, and cash used for repayments, dividends, or buybacks.",
    bullets: [
      "Financing cash flow can extend runway temporarily, but repayments reduce future cash flexibility.",
      "For startups, equity financing changes dilution; debt changes fixed obligations.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "fundraising-valuation-hub-guide"],
  },
  {
    slug: "cash-flow-statement",
    title: "Cash Flow Statement",
    description:
      "A cash flow statement shows cash movement over a period, typically split into operating, investing, and financing cash flows.",
    bullets: [
      "Use the cash flow statement to understand why cash moved even when profit did not.",
      "Focus on operating cash flow and working capital for runway planning.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-conversion-cycle-guide"],
  },
  {
    slug: "balance-sheet",
    title: "Balance Sheet",
    description:
      "A balance sheet is a snapshot of assets, liabilities, and equity at a point in time. Working capital items (AR/AP/deferred revenue) live here.",
    bullets: [
      "Balance sheet changes explain many cash surprises (AR growth consumes cash).",
      "Use it with the cash flow statement to connect profit to cash reality.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "income-statement",
    title: "Income Statement (P&L)",
    description:
      "An income statement (P&L) summarizes revenue and expenses over a period. It shows profitability, but not necessarily cash timing.",
    bullets: [
      "Use P&L to evaluate unit economics and margins; use cash flow to evaluate runway.",
      "Be explicit about non-cash items (depreciation, accruals) when reconciling to cash.",
    ],
    relatedGuideSlugs: ["unit-economics-hub-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "accrual-accounting",
    title: "Accrual Accounting",
    description:
      "Accrual accounting recognizes revenue when earned and expenses when incurred, not when cash is received or paid.",
    bullets: [
      "Accrual profit can look healthy while cash is negative (working capital).",
      "Use accrual statements with a cash flow view for runway decisions.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide"],
  },
  {
    slug: "cash-accounting",
    title: "Cash Accounting",
    description:
      "Cash accounting recognizes revenue and expenses when cash is received or paid. It can be simpler but may not reflect economic reality for longer-term contracts.",
    bullets: [
      "Cash views are helpful for runway, but they can mislead about profitability in prepay businesses.",
      "Use consistent definitions when comparing periods to avoid timing noise.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide"],
  },
  {
    slug: "current-ratio",
    title: "Current Ratio",
    description:
      "Current ratio measures short-term liquidity: current assets divided by current liabilities. Higher usually implies more near-term flexibility.",
    formula: "Current ratio = current assets / current liabilities",
    bullets: [
      "Interpret with context: a high ratio can still hide slow collections (AR).",
      "Track trends, not only a single snapshot, especially during rapid growth.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "acid-test-ratio",
    title: "Acid-test Ratio (Quick Ratio)",
    description:
      "The acid-test ratio is a stricter liquidity ratio that excludes less-liquid current assets. It focuses on cash-like assets versus current liabilities.",
    formula: "Acid-test ratio = (cash + marketable securities + receivables) / current liabilities",
    bullets: [
      "Use it when inventory is significant and you want a stricter liquidity lens.",
      "Receivables quality matters; aging and bad debt risk can distort the ratio.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "liquidity",
    title: "Liquidity",
    description:
      "Liquidity is the ability to meet near-term obligations with available cash or assets that can be quickly converted to cash.",
    bullets: [
      "Liquidity risk is a common failure mode even when the business is profitable on paper.",
      "Working capital management (AR/AP) is one of the fastest ways to improve liquidity.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "interest-coverage-ratio",
    title: "Interest Coverage Ratio",
    description:
      "Interest coverage ratio measures how easily a business can pay interest from operating earnings.",
    formula: "Interest coverage = EBIT / interest expense (common)",
    bullets: [
      "Low coverage increases financing risk and can constrain growth.",
      "Use cash flow based views when earnings are noisy or non-cash heavy.",
    ],
    relatedGuideSlugs: ["loan-payment-guide"],
  },
  {
    slug: "debt-service-coverage-ratio",
    title: "DSCR (Debt Service Coverage Ratio)",
    description:
      "DSCR compares cash available to debt obligations (principal + interest). Lenders use it to assess repayment capacity.",
    formula: "DSCR = cash available for debt service / total debt service",
    bullets: [
      "DSCR is more cash-oriented than interest coverage because it includes principal.",
      "Run scenarios: DSCR can fall quickly when revenue drops or collections slow.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "cash-conversion-cycle-guide"],
  },
  {
    slug: "receivables-aging",
    title: "Receivables Aging",
    description:
      "Receivables aging breaks accounts receivable into buckets by how long invoices have been outstanding (for example 0-30, 31-60, 61-90 days).",
    bullets: [
      "Use aging to find collections risk and prioritize follow-ups.",
      "Aging trends often predict future bad debt and cash strain.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "bad-debt",
    title: "Bad Debt",
    description:
      "Bad debt is accounts receivable that are unlikely to be collected. It reduces profit and can create sudden cash strain if not forecasted.",
    updatedAt: "2026-01-27",
    bullets: [
      "Track bad debt rate by segment, payment terms, and cohort month.",
      "Age receivables and flag accounts that pass your collection threshold.",
      "Use credit checks, deposit requirements, or shorter terms for higher-risk segments.",
      "Review write-offs vs allowance so expected losses are visible before cash gaps hit.",
    ],
    mistakes: [
      "Treating bad debt as a one-time event instead of a recurring rate.",
      "Mixing cash timing with revenue recognition (watch the AR ledger).",
      "Ignoring concentration risk in a few large customers.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "allowance-for-doubtful-accounts",
    title: "Allowance for Doubtful Accounts",
    description:
      "An allowance for doubtful accounts is an estimate of receivables that may not be collected. It is used to recognize expected credit losses.",
    bullets: [
      "Use historical loss rates and adjust for segment and macro changes.",
      "Keep allowance policy consistent so trends are comparable.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "days-inventory-outstanding",
    title: "Days Inventory Outstanding (DIO)",
    description:
      "DIO estimates how many days inventory sits before it is sold. It is a component of the cash conversion cycle for inventory-heavy businesses.",
    formula: "DIO ~ average inventory / (COGS per day)",
    bullets: [
      "Lower DIO usually improves cash conversion, but too low can risk stockouts.",
      "For SaaS, DIO is often near zero; focus on AR/AP instead.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "net-margin",
    title: "Net Margin",
    description:
      "Net margin measures how much profit remains after all expenses (including overhead, interest, and taxes) as a share of revenue.",
    formula: "Net margin = net income / revenue",
    bullets: [
      "Net margin is downstream; improve it by improving unit margin, then operating leverage.",
      "Use net margin with cash flow to avoid confusing accounting profit with runway.",
    ],
    relatedGuideSlugs: ["unit-economics-hub-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "capital-structure",
    title: "Capital Structure",
    description:
      "Capital structure is the mix of debt and equity used to finance a business. It drives risk, flexibility, and the weighted cost of capital.",
    updatedAt: "2026-01-28",
    formula: "Debt ratio = debt / (debt + equity)",
    example:
      "If debt is $2M and equity is $3M, the debt ratio is 2 / 5 = 40%.",
    bullets: [
      "Match debt levels to cash flow stability and downside risk tolerance.",
      "Revisit structure after large funding rounds or major capex plans.",
    ],
    mistakes: [
      "Assuming a single target ratio fits every business stage.",
      "Ignoring covenants and refinancing risk when adding leverage.",
    ],
    relatedGuideSlugs: ["wacc-guide", "fundraising-valuation-hub-guide"],
  },
  {
    slug: "debt-to-equity",
    title: "Debt to Equity (D/E)",
    description:
      "Debt to equity compares total debt to total equity to show how leveraged a balance sheet is.",
    updatedAt: "2026-01-28",
    formula: "Debt to equity = total debt / total equity",
    example: "Total debt $2M and equity $4M gives D/E = 0.5.",
    bullets: [
      "Track trends over time rather than a single snapshot.",
      "Compare to peers with similar growth and cash flow profiles.",
    ],
    mistakes: [
      "Using book equity without noting large fair value adjustments.",
      "Comparing companies with very different revenue visibility.",
    ],
    relatedGuideSlugs: ["fundraising-valuation-hub-guide"],
  },
  {
    slug: "effective-tax-rate",
    title: "Effective Tax Rate",
    description:
      "Effective tax rate is the actual tax expense divided by pre-tax income, reflecting credits and timing differences.",
    updatedAt: "2026-01-28",
    formula: "Effective tax rate = income tax expense / pre-tax income",
    example: "Tax expense $210k on $1M pre-tax income equals 21%.",
    bullets: [
      "Use effective rate for forecasting when statutory rates are not reflective.",
      "Explain major shifts with credits, NOL usage, or jurisdiction mix.",
    ],
    mistakes: [
      "Assuming the effective rate stays constant across income levels.",
      "Ignoring one-time items that distort the period rate.",
    ],
  },
  {
    slug: "tax-shield",
    title: "Tax Shield",
    description:
      "A tax shield is the tax savings from deductible expenses such as interest or depreciation.",
    updatedAt: "2026-01-28",
    formula: "Tax shield = deductible expense * tax rate",
    example: "Interest $100k and tax rate 25% produces a $25k shield.",
    bullets: [
      "Interest tax shields raise the value of debt in many valuation models.",
      "The shield only matters if the company has taxable income.",
    ],
    mistakes: [
      "Counting tax shields in periods with losses and no taxable income.",
      "Using statutory rates when the effective rate is materially different.",
    ],
    relatedGuideSlugs: ["wacc-guide", "dcf-valuation-guide"],
  },
  {
    slug: "discount-factor",
    title: "Discount Factor",
    description:
      "A discount factor converts future cash flows into present value using a chosen discount rate and time period.",
    updatedAt: "2026-01-28",
    formula: "Discount factor = 1 / (1 + r)^t",
    example: "At 10% over 3 years, the factor is 1 / 1.1^3 = 0.751.",
    bullets: [
      "Use a rate consistent with the risk of the cash flow stream.",
      "Apply the same timing convention across all line items.",
    ],
    mistakes: [
      "Mixing mid-year and end-year conventions without adjustment.",
      "Using a nominal rate with real cash flows (or vice versa).",
    ],
    relatedGuideSlugs: ["dcf-valuation-guide"],
  },
  {
    slug: "net-working-capital",
    title: "Net Working Capital",
    description:
      "Net working capital is current assets minus current liabilities. It shows short-term funding tied to operations.",
    updatedAt: "2026-01-28",
    formula: "Net working capital = current assets - current liabilities",
    example: "CA $900k and CL $650k gives NWC of $250k.",
    bullets: [
      "Rising NWC often means cash is tied up in receivables or inventory.",
      "Use NWC changes to explain gaps between profit and cash.",
    ],
    mistakes: [
      "Including cash in NWC when analyzing operating working capital.",
      "Ignoring seasonality that can distort one-month snapshots.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "interest-expense",
    title: "Interest Expense",
    description:
      "Interest expense is the cost of debt over a period. It includes cash interest and can include amortized fees.",
    updatedAt: "2026-01-28",
    formula: "Interest expense = average debt balance * interest rate",
    example: "Average debt $1M at 8% implies $80k annual interest expense.",
    bullets: [
      "Separate cash interest from non-cash amortization for runway planning.",
      "Model variable-rate debt with rate scenarios, not a single point.",
    ],
    mistakes: [
      "Using ending balance instead of average balance for the period.",
      "Ignoring refinancing risk when interest rates are rising.",
    ],
  },
  {
    slug: "cash-flow-forecast",
    title: "Cash Flow Forecast",
    description:
      "A cash flow forecast projects cash in/out and ending cash balance over time to manage liquidity.",
    updatedAt: "2026-01-28",
    formula: "Ending cash = beginning cash + inflows - outflows",
    example:
      "Starting cash $2M plus $1.2M inflows minus $1.5M outflows ends at $1.7M.",
    bullets: [
      "Use weekly or monthly granularity depending on burn and volatility.",
      "Align assumptions to pipeline, collections, and vendor payment terms.",
    ],
    mistakes: [
      "Using revenue instead of cash collections for timing-sensitive plans.",
      "Failing to update the forecast after large hiring or capex changes.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-runway-guide"],
  },
  {
    slug: "operating-expense-ratio",
    title: "Operating Expense Ratio",
    description:
      "Operating expense ratio measures operating expenses as a percentage of revenue.",
    updatedAt: "2026-01-28",
    formula: "Operating expense ratio = operating expenses / revenue",
    example: "Opex $600k on $2M revenue yields a 30% ratio.",
    bullets: [
      "Track by function to see which teams scale with revenue.",
      "Use trailing periods to smooth volatile months.",
    ],
    mistakes: [
      "Comparing ratios without adjusting for revenue recognition timing.",
      "Treating one-time expenses as recurring operating cost.",
    ],
  },
  {
    slug: "maintenance-capex",
    title: "Maintenance CapEx",
    description:
      "Maintenance CapEx is spending required to keep current operations running without expanding capacity.",
    updatedAt: "2026-01-28",
    formula: "Maintenance CapEx = total CapEx - growth CapEx (estimate)",
    example:
      "If total CapEx is $500k and $200k is for new growth projects, maintenance CapEx is $300k.",
    bullets: [
      "Separate maintenance from growth to avoid overstating free cash flow.",
      "Review asset lifecycles to estimate recurring replacement spend.",
    ],
    mistakes: [
      "Treating all CapEx as growth and inflating cash flow quality.",
      "Ignoring rising maintenance needs as systems age.",
    ],
    relatedGuideSlugs: ["investment-decision-guide"],
  },
  {
    slug: "working-capital-change",
    title: "Change in Working Capital",
    description:
      "Change in working capital is the period-over-period movement in operating working capital (typically AR, inventory, AP). It explains cash shifts that do not show in profit.",
    updatedAt: "2026-01-28",
    formula: "Change in working capital = current period NWC - prior period NWC",
    example:
      "If NWC rises from $200k to $320k, change in working capital is +$120k, which uses cash.",
    bullets: [
      "Rising receivables or inventory usually consumes cash even if revenue is growing.",
      "Improving payables terms can release cash without changing revenue.",
    ],
    mistakes: [
      "Treating higher NWC as always good; it can signal collections issues.",
      "Mixing operating items with cash or short-term debt in the calculation.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "operating-cash-margin",
    title: "Operating Cash Margin",
    description:
      "Operating cash margin measures operating cash flow as a share of revenue to show how efficiently revenue turns into cash.",
    updatedAt: "2026-01-28",
    formula: "Operating cash margin = operating cash flow / revenue",
    example: "Operating cash flow $400k on $2M revenue equals 20%.",
    bullets: [
      "Use trailing periods to smooth volatility from collections timing.",
      "Compare to operating margin to see how much accruals shift cash timing.",
    ],
    mistakes: [
      "Using net income instead of operating cash flow.",
      "Comparing margins across periods with different revenue recognition timing.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide"],
  },
  {
    slug: "cash-interest-coverage",
    title: "Cash Interest Coverage",
    description:
      "Cash interest coverage measures how many times cash flow can cover cash interest expense.",
    updatedAt: "2026-01-28",
    formula: "Cash interest coverage = operating cash flow / cash interest expense",
    example: "Operating cash flow $600k and cash interest $120k yields 5.0x.",
    bullets: [
      "Use cash interest, not total interest expense, for liquidity testing.",
      "Stress test coverage using downside revenue scenarios.",
    ],
    mistakes: [
      "Ignoring principal payments that also affect solvency.",
      "Using EBITDA when working capital swings are large.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "debt-capacity",
    title: "Debt Capacity",
    description:
      "Debt capacity is the amount of debt a business can support while maintaining acceptable coverage ratios and covenant buffers.",
    updatedAt: "2026-01-28",
    formula: "Debt capacity ~= sustainable cash flow / target coverage ratio",
    example:
      "If sustainable cash flow is $1M and target coverage is 2.5x, debt capacity is about $400k of annual debt service.",
    bullets: [
      "Use conservative cash flow and stress-tested coverage thresholds.",
      "Recalculate capacity after major growth or margin shifts.",
    ],
    mistakes: [
      "Using peak cash flow instead of normalized cash flow.",
      "Ignoring covenant headroom and refinancing risk.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "capital-charge",
    title: "Capital Charge",
    description:
      "Capital charge is the dollar cost of capital applied to invested capital. It is used in EVA and value-based performance analysis.",
    updatedAt: "2026-01-28",
    formula: "Capital charge = invested capital * cost of capital",
    example: "Invested capital $5M with 10% cost of capital gives a $500k charge.",
    bullets: [
      "Use after-tax cost of capital to align with after-tax cash flows.",
      "Compare operating profit to the charge to assess value creation.",
    ],
    mistakes: [
      "Using book capital that excludes off-balance sheet investments.",
      "Mixing pre-tax profits with after-tax cost of capital.",
    ],
    relatedGuideSlugs: ["wacc-guide", "dcf-valuation-guide"],
  },
  {
    slug: "cash-sweep",
    title: "Cash Sweep",
    description:
      "A cash sweep is a loan feature that uses excess cash to pay down debt automatically, accelerating amortization.",
    updatedAt: "2026-01-28",
    formula: "Cash sweep = excess cash * sweep percentage",
    example:
      "Excess cash $200k with a 50% sweep applies $100k to debt repayment.",
    bullets: [
      "Sweeps reduce interest expense but can constrain growth capital.",
      "Model sweeps when forecasting cash and covenant compliance.",
    ],
    mistakes: [
      "Ignoring minimum liquidity requirements in sweep assumptions.",
      "Assuming sweep terms are optional when they are mandatory.",
    ],
    relatedGuideSlugs: ["loan-payment-guide"],
  },
  {
    slug: "revolving-credit",
    title: "Revolving Credit",
    description:
      "Revolving credit is a flexible debt facility that can be drawn, repaid, and redrawn up to a limit.",
    updatedAt: "2026-01-28",
    formula: "Available revolver = credit limit - current balance",
    example: "A $2M revolver with $500k drawn leaves $1.5M available.",
    bullets: [
      "Track availability daily when liquidity is tight.",
      "Revolvers often have covenants tied to cash flow or leverage.",
    ],
    mistakes: [
      "Assuming full availability without checking covenant headroom.",
      "Using revolvers for long-term funding instead of short-term needs.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "covenant-headroom",
    title: "Covenant Headroom",
    description:
      "Covenant headroom is the buffer between actual financial metrics and covenant thresholds in a debt agreement.",
    updatedAt: "2026-01-28",
    formula: "Headroom = covenant threshold - actual metric",
    example: "If leverage covenant is 4.0x and actual is 3.2x, headroom is 0.8x.",
    bullets: [
      "Track headroom monthly to avoid surprise defaults.",
      "Model downside cases to ensure buffers remain positive.",
    ],
    mistakes: [
      "Relying on trailing data when forward-looking forecasts are weaker.",
      "Ignoring cure rights or waivers when assessing near-term risk.",
    ],
    relatedGuideSlugs: ["loan-payment-guide"],
  },
  {
    slug: "ebit",
    title: "EBIT (Earnings Before Interest and Taxes)",
    description:
      "EBIT is operating profit before interest and taxes. It is used to compare operating performance across different capital structures.",
    updatedAt: "2026-01-28",
    formula: "EBIT = revenue - operating expenses (excluding interest and taxes)",
    example: "Revenue $5M and operating expenses $3.6M yields EBIT of $1.4M.",
    bullets: [
      "EBIT excludes financing choices, so it is useful for comparability.",
      "Use EBIT with interest coverage ratios to test debt capacity.",
    ],
    mistakes: [
      "Mixing one-time items into operating expenses without disclosure.",
      "Comparing EBIT across companies with different revenue recognition.",
    ],
    relatedGuideSlugs: ["wacc-guide", "dcf-valuation-guide"],
  },
  {
    slug: "ebt",
    title: "EBT (Earnings Before Taxes)",
    description:
      "EBT is profit before income taxes, showing earnings after interest but before tax effects.",
    updatedAt: "2026-01-28",
    formula: "EBT = EBIT - interest expense",
    example: "EBIT $1.4M minus interest $200k gives EBT of $1.2M.",
    bullets: [
      "Use EBT to compare pre-tax profitability across periods.",
      "Pair with effective tax rate to estimate net income.",
    ],
    mistakes: [
      "Using EBT when comparing companies with very different leverage.",
      "Ignoring non-operating income that can distort core earnings.",
    ],
    relatedGuideSlugs: ["wacc-guide", "dcf-valuation-guide"],
  },
];

export const termsFinanceExtra: GlossaryTerm[] = seeds.map(make);
