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
      "Bad debt is receivables you do not expect to collect. Bad debt reduces profit and can create sudden cash problems if it is not anticipated.",
    bullets: [
      "Track bad debt rate by segment and billing terms.",
      "Use stricter credit policies or prepay for higher-risk segments.",
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
];

export const termsFinanceExtra: GlossaryTerm[] = seeds.map(make);
