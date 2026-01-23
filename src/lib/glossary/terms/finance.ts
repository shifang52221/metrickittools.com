import type { GlossarySection, GlossaryTerm } from "../types";

type Seed = {
  slug: string;
  title: string;
  description: string;
  formula?: string;
  bullets?: string[];
  mistakes?: string[];
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
    updatedAt: "2026-01-23",
    sections: sectionsFor(seed),
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "gross-margin",
    title: "Gross Margin",
    description:
      "Gross margin is gross profit as a percentage of revenue. It is foundational for payback, LTV, and break-even analysis.",
    formula: "Gross margin (%) = (revenue − COGS) ÷ revenue",
    mistakes: [
      "Using net margin when a model expects gross margin.",
      "Not keeping COGS definitions consistent across time or segments.",
    ],
  },
  {
    slug: "gross-profit",
    title: "Gross Profit",
    description:
      "Gross profit is revenue minus COGS. Many unit economics models should use gross profit (not revenue) as the value created.",
    formula: "Gross profit = revenue − COGS",
  },
  {
    slug: "cogs",
    title: "COGS (Cost of Goods Sold)",
    description:
      "COGS are direct costs required to deliver the product/service. In SaaS, common COGS include hosting, third-party APIs, support, and payment processing depending on policy.",
    bullets: [
      "COGS drives gross margin, which powers LTV and payback.",
      "Segmented COGS can reveal unprofitable plans or cohorts.",
    ],
  },
  {
    slug: "contribution-margin",
    title: "Contribution Margin",
    description:
      "Contribution margin is revenue minus variable costs. It covers fixed costs and then profit.",
    formula: "Contribution margin = revenue − variable costs",
    mistakes: [
      "Mixing fixed and variable costs inconsistently.",
      "Ignoring variable costs like payment fees, returns, or shipping when they matter.",
    ],
  },
  {
    slug: "fixed-costs",
    title: "Fixed Costs",
    description:
      "Fixed costs do not scale directly with volume in the short term (rent, base salaries, core tools). They matter for break-even and operating leverage.",
  },
  {
    slug: "variable-costs",
    title: "Variable Costs",
    description:
      "Variable costs scale with volume (payment fees, shipping, returns, usage-based infrastructure). They determine contribution margin.",
  },
  {
    slug: "break-even-revenue",
    title: "Break-even Revenue",
    description:
      "Break-even revenue is the revenue required to cover fixed costs given your gross or contribution margin.",
    formula: "Break-even revenue = fixed costs ÷ gross margin",
    mistakes: [
      "Using net margin instead of gross/contribution margin.",
      "Forgetting semi-fixed costs that are effectively fixed at your scale.",
    ],
  },
  {
    slug: "runway",
    title: "Runway",
    description:
      "Runway estimates how many months you can operate before running out of cash at the current net burn.",
    formula: "Runway (months) = cash balance ÷ net monthly burn",
    relatedGuideSlugs: ["cash-runway-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator"],
  },
  {
    slug: "burn-rate",
    title: "Burn Rate",
    description:
      "Burn rate measures how quickly a company spends cash. Teams often track monthly gross burn and net burn.",
    bullets: [
      "Gross burn: total cash outflows.",
      "Net burn: cash outflows minus cash inflows.",
    ],
  },
  {
    slug: "gross-burn",
    title: "Gross Burn",
    description:
      "Gross burn is the total cash outflow in a period (ignoring inflows). It helps you see the true spending level.",
    formula: "Gross burn = total cash outflows",
  },
  {
    slug: "net-burn",
    title: "Net Burn",
    description:
      "Net burn is cash outflows minus cash inflows in a period (net cash loss). Runway calculations typically use net burn.",
    formula: "Net burn = cash outflows − cash inflows",
  },
  {
    slug: "cash-breakeven",
    title: "Cash Break-even",
    description:
      "Cash break-even is when cash inflows cover cash outflows (net burn is ~0). It can differ from accounting break-even due to timing.",
    mistakes: [
      "Confusing cash break-even with profitability in financial statements.",
      "Ignoring collections timing (AR) and deferred revenue effects.",
    ],
  },
  {
    slug: "cash-flow",
    title: "Cash Flow",
    description:
      "Cash flow is the net movement of cash in and out of the business. It differs from profit due to working capital and timing.",
  },
  {
    slug: "working-capital",
    title: "Working Capital",
    description:
      "Working capital reflects short-term assets and liabilities (receivables, payables, deferred revenue). It can cause profit and cash to diverge.",
  },
  {
    slug: "accounts-receivable",
    title: "Accounts Receivable (AR)",
    description:
      "Accounts receivable is money owed by customers for invoices issued but not yet paid. It affects cash flow and collections risk.",
  },
  {
    slug: "accounts-payable",
    title: "Accounts Payable (AP)",
    description:
      "Accounts payable is money you owe suppliers/vendors for invoices received but not yet paid. It affects cash timing.",
  },
  {
    slug: "billings",
    title: "Billings",
    description:
      "Billings are amounts invoiced in a period. Billings can differ from cash collected and recognized revenue due to timing.",
  },
  {
    slug: "cash-receipts",
    title: "Cash Receipts",
    description:
      "Cash receipts are money collected from customers. They depend on billing terms, prepay, and collections timing.",
  },
  {
    slug: "recognized-revenue",
    title: "Recognized Revenue",
    description:
      "Recognized revenue is revenue recorded as earned based on delivery over time. It can differ from billings and cash receipts.",
  },
  {
    slug: "deferred-revenue",
    title: "Deferred Revenue",
    description:
      "Deferred revenue is a liability representing cash collected (or billed) for services not yet delivered. It becomes recognized revenue over time as you deliver.",
    bullets: [
      "Annual prepay increases deferred revenue up front.",
      "Deferred revenue declines as revenue is recognized.",
    ],
  },
  {
    slug: "revenue-recognition",
    title: "Revenue Recognition",
    description:
      "Revenue recognition is the accounting process of recording revenue when earned (delivered), not necessarily when billed or collected.",
  },
  {
    slug: "capex",
    title: "CapEx (Capital Expenditures)",
    description:
      "CapEx is spending on long-lived assets (equipment, capitalized software). CapEx affects cash flow differently than operating expenses.",
  },
  {
    slug: "opex",
    title: "OpEx (Operating Expenses)",
    description:
      "OpEx are ongoing operating costs (salaries, rent, marketing). OpEx drives operating margin and burn.",
  },
  {
    slug: "operating-margin",
    title: "Operating Margin",
    description:
      "Operating margin is operating income divided by revenue. It reflects profitability after operating expenses.",
    formula: "Operating margin = operating income ÷ revenue",
  },
  {
    slug: "ebitda",
    title: "EBITDA",
    description:
      "EBITDA approximates operating profit before interest, taxes, depreciation, and amortization. It is not the same as cash flow.",
    mistakes: ["Treating EBITDA as cash flow (working capital and CapEx matter)."],
  },
  {
    slug: "free-cash-flow",
    title: "Free Cash Flow (FCF)",
    description:
      "Free cash flow is cash generated by operations minus capital expenditures. FCF is a key measure of financial sustainability.",
  },
  {
    slug: "lifetime-gross-profit",
    title: "Lifetime Gross Profit",
    description:
      "Lifetime gross profit is the total gross profit expected from a customer over their lifetime (the value component in LTV).",
  },
  {
    slug: "pricing-power",
    title: "Pricing Power",
    description:
      "Pricing power is the ability to raise prices without losing demand. It affects ARPA/ARPU, margin, and payback.",
  },
  {
    slug: "discount-rate",
    title: "Discount Rate",
    description:
      "Discount rate is used to convert future cash flows into present value (time value of money). It's used in valuation models.",
  },
  {
    slug: "npv",
    title: "NPV (Net Present Value)",
    description:
      "NPV is the present value of future cash flows minus initial cost. NPV helps compare projects and investments.",
  },
  {
    slug: "irr",
    title: "IRR (Internal Rate of Return)",
    description:
      "IRR is the discount rate that makes NPV equal zero. It's commonly used to compare investment opportunities.",
    bullets: [
      "IRR is sensitive to the timing of cash flows.",
      "Projects with multiple sign changes can have multiple IRRs or no IRR.",
      "Use NPV alongside IRR for clearer decision-making at a chosen discount rate.",
    ],
  },
  {
    slug: "payback-period",
    title: "Payback Period (finance)",
    description:
      "Payback period is the time needed to recover an investment's cost from cash flows. In SaaS, 'CAC payback' is a specific variant.",
  },
  {
    slug: "operating-leverage",
    title: "Operating Leverage",
    description:
      "Operating leverage describes how profit changes as revenue grows when fixed costs are significant. SaaS often has high operating leverage at scale.",
  },
  {
    slug: "unit-margin",
    title: "Unit Margin",
    description:
      "Unit margin is contribution per unit (customer/order). It drives scalability and informs allowable acquisition cost.",
  },
  {
    slug: "break-even-point",
    title: "Break-even Point",
    description:
      "Break-even point is where profit equals zero. It can be expressed in revenue or units depending on the model.",
  },
  {
    slug: "marr",
    title: "MARR (Minimum Acceptable Rate of Return)",
    description:
      "MARR is the minimum return threshold used to evaluate investments. It is often used as a hurdle rate in capital budgeting and NPV decisions.",
  },
];

export const termsFinance: GlossaryTerm[] = seeds.map(make);
