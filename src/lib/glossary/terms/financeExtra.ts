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
    example:
      "If you have $1.2M in the bank and $200k restricted cash, available cash balance is $1.0M.",
    bullets: [
      "Use cash balance with net burn to estimate runway.",
      "Separate restricted cash from available operating cash for planning.",
      "Track cash balance alongside collection timing and upcoming obligations.",
      "Reconcile bank balance to ledger monthly to catch timing issues early.",
    ],
    mistakes: [
      "Assuming all cash is available (ignoring restricted or pledged cash).",
      "Using a static balance without forecasting inflows and outflows.",
      "Ignoring upcoming debt payments or vendor prepayments that reduce usable cash.",
    ],
    faqs: [
      {
        question: "Should cash balance include undrawn credit lines-",
        answer:
          "Usually report cash separately from credit facilities. You can mention available credit as an additional liquidity buffer.",
      },
      {
        question: "How often should cash balance be updated-",
        answer:
          "Update at least monthly for reporting and weekly for runway planning during volatile periods or rapid growth.",
      },
    ],
    relatedGuideSlugs: ["cash-runway-guide", "runway-burn-cash-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator"],
  },
  {
    slug: "cash-reserve",
    title: "Cash Reserve",
    description:
      "A cash reserve is a buffer of cash set aside to absorb shocks (revenue drops, delayed collections) without forcing emergency cuts.",
    example:
      "A company targeting a 4-month reserve with $200k monthly burn keeps $800k in cash reserve.",
    bullets: [
      "Define reserve policy in months of net burn (for example 3-6 months).",
      "Reserves reduce downside risk but have opportunity cost; revisit as your risk profile changes.",
      "Separate operational reserves from strategic cash for acquisitions or growth.",
    ],
    mistakes: [
      "Setting a reserve target without modeling seasonality or sales cycle length.",
      "Treating restricted cash as part of the usable reserve.",
    ],
    faqs: [
      {
        question: "How large should a cash reserve be-",
        answer:
          "It depends on revenue volatility and access to capital. Many teams use 3-6 months of net burn as a baseline.",
      },
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
    example:
      "Buying $250k of servers shows as -$250k investing cash flow for the period.",
    bullets: [
      "Treat large capex as a runway event; it can shorten runway even if operating metrics are stable.",
      "Separate maintenance capex from growth capex for clearer planning.",
      "Review investing cash flow when planning hiring or marketing ramps.",
      "Track asset sales separately from operating performance to avoid noise.",
    ],
    mistakes: [
      "Classifying operating expenses as investing cash flow to smooth burn.",
      "Ignoring one-time asset sales that temporarily inflate cash.",
      "Assuming investing cash flow is always negative (asset sales can reverse it).",
    ],
    faqs: [
      {
        question: "Is software development investing or operating cash flow-",
        answer:
          "It depends on capitalization policy. Many companies expense it as operating, while some capitalize development costs as investing.",
      },
      {
        question: "Should acquisitions be included in investing cash flow-",
        answer:
          "Yes. Acquisition payments and related asset purchases typically flow through investing cash flow.",
      },
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
    example:
      "You deliver a $12,000 annual contract in January; accrual revenue is $1,000 per month, even if cash is prepaid.",
    bullets: [
      "Accrual profit can look healthy while cash is negative (working capital).",
      "Use accrual statements with a cash flow view for runway decisions.",
      "Track deferred revenue and receivables to connect accruals to cash timing.",
    ],
    mistakes: [
      "Assuming accrual profit equals cash available for spending.",
      "Ignoring changes in working capital when analyzing performance.",
    ],
    faqs: [
      {
        question: "Why does accrual accounting matter for SaaS-",
        answer:
          "SaaS often has prepayments and deferred revenue, so accrual accounting shows true recurring performance while cash flows can be lumpy.",
      },
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide"],
  },
  {
    slug: "cash-accounting",
    title: "Cash Accounting",
    description:
      "Cash accounting recognizes revenue and expenses when cash is received or paid. It can be simpler but may not reflect economic reality for longer-term contracts.",
    example:
      "If you bill $12,000 in January for a 12-month contract and collect cash immediately, cash accounting records the full $12,000 in January.",
    bullets: [
      "Cash views are helpful for runway, but they can mislead about profitability in prepay businesses.",
      "Use consistent definitions when comparing periods to avoid timing noise.",
      "Combine cash accounting with deferred revenue schedules to avoid overreacting to prepay swings.",
      "Use cash accounting to validate collections health, not to measure delivery performance.",
    ],
    mistakes: [
      "Assuming cash timing equals customer value delivery.",
      "Comparing cash-based periods with different billing terms without adjustment.",
    ],
    faqs: [
      {
        question: "When is cash accounting useful-",
        answer:
          "It is useful for cash runway, collections analysis, and very short-cycle businesses, but accrual accounting is usually better for performance tracking.",
      },
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide"],
  },
  {
    slug: "current-ratio",
    title: "Current Ratio",
    description:
      "Current ratio measures short-term liquidity: current assets divided by current liabilities. Higher usually implies more near-term flexibility.",
    formula: "Current ratio = current assets / current liabilities",
    example:
      "If current assets are $1.2M and current liabilities are $800k, current ratio is 1.5x.",
    bullets: [
      "Interpret with context: a high ratio can still hide slow collections (AR).",
      "Track trends, not only a single snapshot, especially during rapid growth.",
      "Use with DSO and AP aging to see liquidity quality.",
    ],
    mistakes: [
      "Counting inventory as fully liquid when it moves slowly.",
      "Using current ratio without trend or seasonality context.",
    ],
    faqs: [
      {
        question: "What is a healthy current ratio-",
        answer:
          "It varies by industry, but many businesses target around 1.5x to 2.0x. Use historical trends and peer benchmarks for context.",
      },
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "acid-test-ratio",
    title: "Acid-test Ratio (Quick Ratio)",
    description:
      "The acid-test ratio is a stricter liquidity ratio that excludes less-liquid current assets. It focuses on cash-like assets versus current liabilities.",
    formula: "Acid-test ratio = (cash + marketable securities + receivables) / current liabilities",
    example:
      "If cash + receivables are $900k and current liabilities are $600k, the ratio is 1.5x.",
    bullets: [
      "Use it when inventory is significant and you want a stricter liquidity lens.",
      "Receivables quality matters; aging and bad debt risk can distort the ratio.",
      "Track the ratio alongside DSO to catch collection slowdowns early.",
    ],
    mistakes: [
      "Counting slow or doubtful receivables as liquid.",
      "Using a single snapshot without trend context.",
    ],
    faqs: [
      {
        question: "What is a healthy acid-test ratio-",
        answer:
          "It depends on the business, but a ratio near or above 1.0x often indicates sufficient short-term coverage. Use industry benchmarks and trendlines.",
      },
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
    example:
      "If EBIT is $2M and interest expense is $400k, coverage is 5.0x.",
    bullets: [
      "Low coverage increases financing risk and can constrain growth.",
      "Use cash flow based views when earnings are noisy or non-cash heavy.",
      "Track trendline coverage, not just a single quarter.",
    ],
    mistakes: [
      "Using EBITDA instead of EBIT without noting the difference.",
      "Ignoring seasonality that makes coverage appear worse in slow quarters.",
    ],
    faqs: [
      {
        question: "What is a healthy interest coverage ratio-",
        answer:
          "It depends on industry, but many lenders look for 2.0x or higher. Use your loan covenants as the real standard.",
      },
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
    example:
      "If 70% of AR is in 0-30 and 15% is in 61-90, collections risk is rising.",
    bullets: [
      "Use aging to find collections risk and prioritize follow-ups.",
      "Aging trends often predict future bad debt and cash strain.",
      "Review aging by customer segment to spot high-risk cohorts.",
    ],
    mistakes: [
      "Letting disputed invoices sit in the oldest bucket without resolution.",
      "Ignoring payment terms changes that shift aging buckets.",
    ],
    faqs: [
      {
        question: "What is a healthy receivables aging mix-",
        answer:
          "It depends on your terms, but most AR should be in the current bucket. Rising 61-90 or 90+ buckets signal collections risk.",
      },
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
    example:
      "If you expect 2% of $3M AR to be uncollectible, the allowance is $60k.",
    bullets: [
      "Use historical loss rates and adjust for segment and macro changes.",
      "Keep allowance policy consistent so trends are comparable.",
      "Reconcile write-offs against the allowance to keep accuracy.",
    ],
    mistakes: [
      "Using a single flat rate despite changes in customer mix or macro risk.",
      "Failing to update the allowance after large write-offs.",
    ],
    faqs: [
      {
        question: "How often should the allowance be updated-",
        answer:
          "At least quarterly, or more often if collections risk changes or large customers become delinquent.",
      },
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "days-inventory-outstanding",
    title: "Days Inventory Outstanding (DIO)",
    description:
      "DIO estimates how many days inventory sits before it is sold. It is a component of the cash conversion cycle for inventory-heavy businesses.",
    formula: "DIO ~ average inventory / (COGS per day)",
    example:
      "If average inventory is $900k and COGS per day is $10k, DIO is 90 days.",
    bullets: [
      "Lower DIO usually improves cash conversion, but too low can risk stockouts.",
      "For SaaS, DIO is often near zero; focus on AR/AP instead.",
      "Track DIO alongside DSO and DPO to see the full cash cycle.",
    ],
    mistakes: [
      "Reducing DIO too aggressively and causing stockouts.",
      "Comparing DIO without accounting for seasonality.",
    ],
    faqs: [
      {
        question: "What is a healthy DIO-",
        answer:
          "It depends on the industry. Compare to peers and your own historical trend rather than using a universal benchmark.",
      },
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
      "Separate operating NWC from excess cash to avoid double counting liquidity.",
      "Track NWC days (DSO, DIO, DPO) to see which lever drives changes.",
    ],
    mistakes: [
      "Including cash in NWC when analyzing operating working capital.",
      "Ignoring seasonality that can distort one-month snapshots.",
      "Comparing NWC across periods without accounting for growth or mix shifts.",
    ],
    faqs: [
      {
        question: "Is higher net working capital always good-",
        answer:
          "Not necessarily. It can signal more liquidity, but it can also mean cash is stuck in receivables or inventory.",
      },
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "interest-expense",
    title: "Interest Expense",
    description:
      "Interest expense is the cost of debt over a period (meaning cash interest plus any amortized fees).",
    updatedAt: "2026-02-22",
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
    faqs: [
      {
        question: "What does interest expense mean-",
        answer:
          "Interest expense means the cost of borrowing over a period, including cash interest and any non-cash amortized fees.",
      },
      {
        question: "Is interest expense the same as interest paid-",
        answer:
          "Not always. Interest expense can include non-cash amortization of fees or discounts, while interest paid is the cash outflow.",
      },
      {
        question: "How do I calculate net interest expense-",
        answer:
          "Net interest expense equals interest expense minus interest income. If the result is negative, it is net interest income.",
      },
    ],
    relatedGuideSlugs: ["interest-expense-guide"],
    relatedCalculatorSlugs: ["loan-payment-calculator"],
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
      "Monitor working capital drivers (DSO, DPO, inventory) to explain changes.",
      "Use cash margin for runway planning, not just profitability reporting.",
    ],
    mistakes: [
      "Using net income instead of operating cash flow.",
      "Comparing margins across periods with different revenue recognition timing.",
      "Ignoring one-time cash inflows that temporarily inflate margin.",
    ],
    faqs: [
      {
        question: "Why can operating cash margin differ from operating margin-",
        answer:
          "Because cash margin includes working capital timing. Collections, payables, and deferred revenue shifts can move cash without changing profit.",
      },
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
      "Confirm how 'excess cash' is defined in the credit agreement.",
    ],
    mistakes: [
      "Ignoring minimum liquidity requirements in sweep assumptions.",
      "Assuming sweep terms are optional when they are mandatory.",
      "Using sweeps without modeling growth capex needs.",
    ],
    faqs: [
      {
        question: "Is a cash sweep always required-",
        answer:
          "It depends on the loan agreement. Some sweeps are mandatory, others are triggered by performance thresholds.",
      },
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
    title: "EBIT (Operating Profit)",
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
  {
    slug: "fixed-charge-coverage",
    title: "Fixed Charge Coverage",
    description:
      "Fixed charge coverage measures how well cash flow covers fixed obligations like interest and lease payments.",
    updatedAt: "2026-01-28",
    formula: "Fixed charge coverage = (EBIT + fixed charges) / fixed charges",
    example:
      "If EBIT is $900k and fixed charges are $300k, coverage is (900 + 300) / 300 = 4.0x.",
    bullets: [
      "Use cash-based variants when working capital swings are large.",
      "Track coverage alongside debt covenants to avoid surprises.",
    ],
    mistakes: [
      "Mixing operating leases and capital leases inconsistently.",
      "Using one-time EBIT without normalization.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "debt-amortization",
    title: "Debt Amortization",
    description:
      "Debt amortization is the scheduled repayment of principal over time, reducing the outstanding balance.",
    updatedAt: "2026-01-28",
    formula: "Ending balance = beginning balance - principal payments",
    example:
      "A $1M loan with $20k monthly principal payments amortizes by $240k in year one.",
    bullets: [
      "Amortization reduces interest expense over time as the balance falls.",
      "Model amortization explicitly in cash forecasts and covenants.",
      "Separate principal from interest to avoid overstating operating expense.",
      "Use an amortization schedule to forecast DSCR and covenant headroom.",
    ],
    mistakes: [
      "Confusing amortization with interest-only periods.",
      "Ignoring prepayment penalties when accelerating principal.",
      "Mixing accounting amortization with actual cash repayments.",
    ],
    faqs: [
      {
        question: "How is amortization different from depreciation-",
        answer:
          "Debt amortization is principal repayment. Depreciation is a non-cash expense for asset wear. They affect cash flow differently.",
      },
    ],
    relatedGuideSlugs: ["loan-payment-guide"],
  },
  {
    slug: "operating-cash-conversion",
    title: "Operating Cash Conversion",
    description:
      "Operating cash conversion compares operating cash flow to operating profit to show how much profit turns into cash.",
    updatedAt: "2026-01-28",
    formula: "Operating cash conversion = operating cash flow / operating profit",
    example: "Operating cash flow $800k and operating profit $1M yields 80%.",
    bullets: [
      "Low conversion often points to receivables or deferred revenue shifts.",
      "Track conversion by quarter to catch working capital stress early.",
    ],
    mistakes: [
      "Using net income instead of operating profit in the denominator.",
      "Comparing periods with different revenue recognition policies.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "capex-budget",
    title: "CapEx Budget",
    description:
      "A CapEx budget is a plan for capital spending on long-lived assets over a period, split into maintenance and growth projects.",
    updatedAt: "2026-01-28",
    formula: "CapEx budget = maintenance CapEx + growth CapEx",
    example:
      "If maintenance CapEx is $300k and growth CapEx is $500k, the annual budget is $800k.",
    bullets: [
      "Review expected ROI and payback before approving growth projects.",
      "Match CapEx timing to cash flow seasonality to protect runway.",
    ],
    mistakes: [
      "Treating all CapEx as discretionary and delaying required maintenance.",
      "Approving projects without a post-investment review plan.",
    ],
    relatedGuideSlugs: ["investment-decision-guide", "capital-budgeting-hub-guide"],
  },
  {
    slug: "cash-buffer-policy",
    title: "Cash Buffer Policy",
    description:
      "A cash buffer policy sets the minimum cash balance the business will maintain to absorb shocks and avoid liquidity crises.",
    updatedAt: "2026-01-28",
    formula: "Minimum cash = target months of net burn * monthly net burn",
    example:
      "If target buffer is 3 months and net burn is $200k, minimum cash is $600k.",
    bullets: [
      "Set buffers based on revenue volatility and access to capital.",
      "Revisit the buffer after major headcount or pricing changes.",
    ],
    mistakes: [
      "Using a fixed dollar buffer while burn rate changes.",
      "Assuming revolver availability is always fully accessible.",
    ],
    relatedGuideSlugs: ["cash-runway-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "debt-schedule",
    title: "Debt Schedule",
    description:
      "A debt schedule tracks each facility's balance, interest rate, amortization, and maturity to model cash and covenant impacts.",
    updatedAt: "2026-01-28",
    formula: "Ending balance = beginning balance + draws - principal payments",
    example:
      "A schedule shows $1M term debt declining by $25k per month with 7% interest.",
    bullets: [
      "Separate term loans, revolvers, and leases for clarity.",
      "Update rates when debt is floating to avoid forecast errors.",
    ],
    mistakes: [
      "Ignoring fees and amortized financing costs.",
      "Assuming refinancing without validating lender terms.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "free-cash-flow-margin",
    title: "Free Cash Flow Margin",
    description:
      "Free cash flow margin shows free cash flow as a share of revenue, reflecting how much revenue turns into cash after CapEx.",
    updatedAt: "2026-01-28",
    formula: "Free cash flow margin = free cash flow / revenue",
    example: "Free cash flow $500k on $5M revenue yields a 10% margin.",
    bullets: [
      "Track margin over time to see operating leverage and discipline.",
      "Use normalized CapEx for comparability across years.",
    ],
    mistakes: [
      "Treating one-time working capital releases as recurring margin.",
      "Comparing margins without adjusting for seasonality.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "investment-decision-guide"],
  },
  {
    slug: "interest-rate-sensitivity",
    title: "Interest Rate Sensitivity",
    description:
      "Interest rate sensitivity shows how changes in rates affect interest expense and cash flow, especially for floating-rate debt.",
    updatedAt: "2026-01-28",
    formula: "Interest change = floating debt balance * rate change",
    example:
      "If floating debt is $5M, a 1% rate increase adds $50k annual interest.",
    bullets: [
      "Model multiple rate scenarios to stress-test coverage.",
      "Consider hedges if rate exposure is large.",
    ],
    mistakes: [
      "Ignoring base rate floors or caps in the debt agreement.",
      "Using ending debt balance instead of average balance.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "days-cash-on-hand",
    title: "Days Cash on Hand",
    description:
      "Days cash on hand estimates how long cash can cover operating expenses without new inflows.",
    updatedAt: "2026-01-28",
    formula: "Days cash on hand = cash balance / (operating expenses per day)",
    example:
      "Cash $900k and expenses $12k per day gives 75 days of cash on hand.",
    bullets: [
      "Use it with runway to communicate liquidity to stakeholders.",
      "Update frequently during periods of rapid burn changes.",
    ],
    mistakes: [
      "Using revenue instead of expenses in the denominator.",
      "Ignoring seasonal expense spikes in the calculation.",
    ],
    relatedGuideSlugs: ["cash-runway-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "working-capital-policy",
    title: "Working Capital Policy",
    description:
      "Working capital policy defines targets for receivables, payables, and inventory to balance growth with cash stability.",
    updatedAt: "2026-01-28",
    bullets: [
      "Set DSO/DPO targets by segment and enforce them with owners.",
      "Tie policy to forecast accuracy so cash plans remain reliable.",
    ],
    mistakes: [
      "Setting targets without changing billing and collections processes.",
      "Optimizing DPO without considering supplier risk.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "net-interest-margin",
    title: "Net Interest Margin",
    description:
      "Net interest margin measures the spread between interest income and interest expense relative to earning assets.",
    updatedAt: "2026-01-28",
    formula: "Net interest margin = (interest income - interest expense) / earning assets",
    example:
      "If interest income is $900k, expense is $500k, and earning assets are $20M, NIM is 2.0%.",
    bullets: [
      "Track NIM trend to spot pricing pressure or funding cost shifts.",
      "Use consistent earning asset definitions across periods.",
    ],
    mistakes: [
      "Mixing non-interest income into the numerator.",
      "Ignoring seasonality or rate reset timing.",
    ],
    relatedGuideSlugs: ["loan-payment-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "operating-margin-rate",
    title: "Operating Margin Rate",
    description:
      "Operating margin rate shows operating profit as a percent of revenue, reflecting core profitability before interest and taxes.",
    updatedAt: "2026-01-28",
    formula: "Operating margin rate = operating profit / revenue",
    example: "Operating profit $800k on $4M revenue yields a 20% margin.",
    bullets: [
      "Compare margin by segment to see where profit is concentrated.",
      "Use trailing periods to smooth noisy months.",
      "Track margin alongside revenue growth to see scale effects.",
      "Normalize for one-time expenses before comparing periods.",
    ],
    mistakes: [
      "Including one-time expenses without normalization.",
      "Comparing margins across different revenue recognition policies.",
      "Using operating margin alone to assess cash health.",
    ],
    faqs: [
      {
        question: "Should I use operating margin or EBITDA margin-",
        answer:
          "Operating margin includes depreciation and amortization. EBITDA margin excludes them. Use operating margin for core profitability and EBITDA for leverage-style comparisons.",
      },
    ],
    relatedGuideSlugs: ["unit-economics-hub-guide"],
  },
  {
    slug: "cash-burn-multiple",
    title: "Cash Burn Multiple",
    description:
      "Cash burn multiple compares net burn to net new ARR to show how efficiently cash turns into growth.",
    updatedAt: "2026-01-28",
    formula: "Burn multiple = net burn / net new ARR",
    example:
      "If net burn is $1.5M and net new ARR is $1M, burn multiple is 1.5x.",
    bullets: [
      "Lower multiples mean more efficient growth for the same burn.",
      "Track by quarter to reduce noise from timing.",
    ],
    mistakes: [
      "Mixing monthly burn with annual ARR without normalizing.",
      "Including one-time financing inflows in burn.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "unit-economics-hub-guide"],
  },
  {
    slug: "margin-of-safety",
    title: "Margin of Safety",
    description:
      "Margin of safety is the buffer between estimated intrinsic value and purchase price, used to protect against uncertainty.",
    updatedAt: "2026-01-28",
    formula: "Margin of safety = (intrinsic value - price) / intrinsic value",
    example:
      "If intrinsic value is $100 and price is $70, margin of safety is 30%.",
    bullets: [
      "Use larger margins of safety when assumptions are uncertain.",
      "Combine with sensitivity analysis to test downside risk.",
    ],
    mistakes: [
      "Treating a single valuation point as precise truth.",
      "Ignoring changes in discount rates or growth expectations.",
    ],
    relatedGuideSlugs: ["dcf-valuation-guide", "dcf-sensitivity-guide"],
  },
  {
    slug: "capital-efficiency",
    title: "Capital Efficiency",
    description:
      "Capital efficiency reflects how much output (revenue or ARR) you produce per dollar of capital invested or burned.",
    updatedAt: "2026-01-28",
    formula: "Capital efficiency = output metric / capital invested",
    example:
      "If $5M of capital produces $3M ARR, capital efficiency is 0.6x.",
    bullets: [
      "Define the output metric clearly (ARR, gross profit, or revenue).",
      "Use consistent time windows when comparing efficiency.",
    ],
    mistakes: [
      "Mixing equity raised with debt financing without context.",
      "Comparing efficiency across stages without normalization.",
    ],
    relatedGuideSlugs: ["unit-economics-hub-guide", "fundraising-valuation-hub-guide"],
  },
  {
    slug: "cash-flow-volatility",
    title: "Cash Flow Volatility",
    description:
      "Cash flow volatility measures how much cash inflows and outflows swing over time, affecting liquidity risk.",
    updatedAt: "2026-01-28",
    formula: "Volatility = standard deviation of cash flow over time",
    example:
      "If monthly net cash flow varies between -$300k and +$200k, volatility is high.",
    bullets: [
      "Volatility increases the value of a larger cash buffer.",
      "Use rolling windows to observe trend changes.",
    ],
    mistakes: [
      "Ignoring seasonality when interpreting volatility.",
      "Using revenue volatility as a proxy for cash volatility.",
    ],
    relatedGuideSlugs: ["cash-runway-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "cash-collection-forecast",
    title: "Cash Collection Forecast",
    description:
      "A cash collection forecast estimates when receivables will turn into cash based on aging and payment terms.",
    updatedAt: "2026-01-28",
    formula: "Collections = AR aging buckets * expected collection rates",
    example:
      "If $500k AR is 0-30 days at 90% expected collection, forecast $450k.",
    bullets: [
      "Base rates on historical collections by segment.",
      "Update forecasts after major pricing or contract term changes.",
    ],
    mistakes: [
      "Assuming 100% collection on aged receivables.",
      "Using invoice dates without considering dispute delays.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "capital-allocation",
    title: "Capital Allocation",
    description:
      "Capital allocation is how a company decides to invest cash across growth, maintenance, debt paydown, or returns to owners.",
    updatedAt: "2026-01-28",
    bullets: [
      "Prioritize projects with the highest risk-adjusted returns.",
      "Balance growth investments with liquidity and covenant needs.",
    ],
    mistakes: [
      "Chasing growth projects without measuring ROI.",
      "Ignoring opportunity cost when holding excess cash.",
    ],
    relatedGuideSlugs: ["investment-decision-guide", "capital-budgeting-hub-guide"],
  },
  {
    slug: "cost-of-capital-buffer",
    title: "Cost of Capital Buffer",
    description:
      "Cost of capital buffer is the extra return you require above the base cost of capital to cover model risk and uncertainty.",
    updatedAt: "2026-01-28",
    formula: "Target return = cost of capital + buffer",
    example: "If WACC is 10% and buffer is 3%, target return is 13%.",
    bullets: [
      "Use larger buffers for volatile cash flows or new markets.",
      "Document buffer logic to keep decisions consistent.",
    ],
    mistakes: [
      "Applying the same buffer to low-risk and high-risk projects.",
      "Double-counting risk if the discount rate already includes it.",
    ],
    relatedGuideSlugs: ["wacc-guide", "investment-decision-guide"],
  },
  {
    slug: "runway-extension-plan",
    title: "Runway Extension Plan",
    description:
      "A runway extension plan lays out actions to lengthen cash runway, such as expense cuts, pricing changes, or financing.",
    updatedAt: "2026-01-28",
    bullets: [
      "Rank actions by speed, impact, and reversibility.",
      "Validate that runway gains are sustainable beyond one quarter.",
    ],
    mistakes: [
      "Cutting growth initiatives without protecting core retention.",
      "Assuming financing will close without a backup plan.",
    ],
    relatedGuideSlugs: ["cash-runway-guide", "runway-burn-cash-guide"],
  },
];

export const termsFinanceExtra: GlossaryTerm[] = seeds.map(make);
