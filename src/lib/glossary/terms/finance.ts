import type { GlossaryFaq, GlossarySection, GlossaryTerm } from "../types";

type Seed = {
  slug: string;
  title: string;
  description: string;
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
    updatedAt: "2026-01-23",
    sections: sectionsFor(seed),
    faqs: seed.faqs,
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "dcf",
    title: "DCF (Discounted Cash Flow)",
    description:
      "DCF values an asset or business by discounting expected future free cash flows back to present value and adding a terminal value for cash flows beyond the forecast period.",
    formula: "Enterprise value = PV(forecast FCF) + PV(terminal value)",
    example:
      "If you forecast annual free cash flows and discount them back to today, then add a discounted terminal value, the sum is your enterprise value estimate (before converting to equity value).",
    bullets: [
      "DCF is highly sensitive to discount rate and terminal assumptions; always run scenarios.",
      "Use free cash flow (cash) rather than accounting profit where possible.",
    ],
    mistakes: [
      "Using terminal growth that is higher than the discount rate (invalid in perpetuity model).",
      "Treating a single scenario as a precise estimate (false precision).",
    ],
    faqs: [
      {
        question: "What discount rate should I use in a DCF?",
        answer:
          "Teams often use WACC as a starting point for an overall business discount rate, then run sensitivity scenarios. The right rate depends on risk and cash flow timing.",
      },
      {
        question: "Why does terminal value dominate many DCFs?",
        answer:
          "Because a large share of cash flows occur after the explicit forecast window. This is why sensitivity analysis and conservative terminal assumptions matter.",
      },
    ],
    relatedGuideSlugs: ["dcf-valuation-guide"],
    relatedCalculatorSlugs: ["dcf-valuation-calculator"],
  },
  {
    slug: "terminal-value",
    title: "Terminal Value",
    description:
      "Terminal value represents the value of cash flows beyond the explicit forecast period in a DCF. It often contributes a large share of enterprise value.",
    formula:
      "Terminal value (perpetuity) = FCF_(n+1) / (discount rate - terminal growth)",
    example:
      "If next year’s FCF is $6M, discount rate is 12%, and terminal growth is 3%, terminal value = $6M / (0.12 - 0.03) = $66.7M (before discounting it back to today).",
    mistakes: [
      "Letting terminal value dominate without sensitivity analysis.",
      "Using aggressive terminal growth that implies implausible long-run scale.",
    ],
    faqs: [
      {
        question: "Why must discount rate be higher than terminal growth?",
        answer:
          "In the perpetuity formula, if growth ≥ discount rate, the denominator goes to zero or negative and the terminal value explodes or becomes invalid.",
      },
      {
        question: "What’s a reasonable terminal growth rate?",
        answer:
          "Often a conservative long-run growth rate below the discount rate. Use scenarios rather than a single point estimate.",
      },
    ],
    relatedGuideSlugs: ["dcf-valuation-guide"],
    relatedCalculatorSlugs: ["dcf-valuation-calculator"],
  },
  {
    slug: "wacc",
    title: "WACC (Weighted Average Cost of Capital)",
    description:
      "WACC is a blended required return for capital providers (equity and debt). It is commonly used as a discount rate proxy in DCF models.",
    formula: "WACC = (E/V)*Re + (D/V)*Rd*(1 - tax rate)",
    example:
      "If E/V = 70%, D/V = 30%, Re = 15%, Rd = 7%, and tax rate = 25%, WACC ≈ 0.7*0.15 + 0.3*0.07*(1-0.25) = 12.1%.",
    bullets: [
      "Higher WACC lowers present value; lower WACC raises it.",
      "WACC depends on capital structure, market risk, and interest rates.",
    ],
    faqs: [
      {
        question: "Can I use WACC for every project?",
        answer:
          "Not always. If a project has different risk than the overall business, you may need an adjusted discount rate rather than the company-wide WACC.",
      },
      {
        question: "Should WACC use market value weights or book value weights?",
        answer:
          "Market value weights are often preferred for valuation work. The key is consistency between weights and cost assumptions.",
      },
    ],
    relatedGuideSlugs: ["wacc-guide", "dcf-valuation-guide"],
    relatedCalculatorSlugs: ["wacc-calculator", "dcf-valuation-calculator"],
  },
  {
    slug: "cost-of-equity",
    title: "Cost of Equity",
    description:
      "Cost of equity is the return equity investors require for the risk of owning the business. It is a key input to WACC and discount rate selection.",
    formula: "CAPM (common) = risk-free rate + beta * equity risk premium",
    example:
      "If risk-free rate is 4%, beta is 1.2, and equity risk premium is 5%, cost of equity ≈ 4% + 1.2*5% = 10%.",
    bullets: [
      "Often estimated using CAPM as a starting point, then adjusted with judgment for company-specific risk.",
      "Higher risk implies higher cost of equity and lower present value in a DCF.",
    ],
    mistakes: [
      "Using a single-point estimate without sensitivity analysis.",
      "Mixing short-term market moves into long-term discount assumptions without context.",
    ],
    faqs: [
      {
        question: "Is cost of equity the same as expected stock return?",
        answer:
          "It’s a required return estimate, not a guarantee. It’s commonly used as an input to WACC and valuation, but realized returns can differ materially.",
      },
    ],
    relatedGuideSlugs: ["wacc-guide", "dcf-valuation-guide"],
    relatedCalculatorSlugs: ["wacc-calculator"],
  },
  {
    slug: "cost-of-debt",
    title: "Cost of Debt",
    description:
      "Cost of debt is the effective interest rate a company pays on its borrowings. In WACC, debt is often adjusted for taxes because interest can be tax deductible.",
    formula: "After-tax cost of debt ≈ cost of debt * (1 - tax rate)",
    example:
      "If cost of debt is 7% and tax rate is 25%, after-tax cost of debt ≈ 7%*(1-0.25) = 5.25%.",
    bullets: [
      "Use the company’s current borrowing rate for similar maturity and risk.",
      "Remember the tax shield: after-tax cost of debt is lower than the nominal coupon.",
    ],
    mistakes: [
      "Using old debt coupons when the firm’s risk or rates have changed.",
      "Forgetting the tax shield when using WACC as a discount rate proxy.",
    ],
    faqs: [
      {
        question: "What if the company has no debt today?",
        answer:
          "You can still estimate a cost of debt from comparable firms or an assumed target rating/capital structure for WACC scenarios.",
      },
    ],
    relatedGuideSlugs: ["wacc-guide"],
    relatedCalculatorSlugs: ["wacc-calculator"],
  },
  {
    slug: "profitability-index",
    title: "Profitability Index (PI)",
    description:
      "Profitability index (PI) measures the present value of cash inflows per dollar invested. PI is useful when capital is constrained and you want value per dollar.",
    formula: "PI = PV(inflows) / initial investment",
    example:
      "If PV(inflows) is $130k and initial investment is $100k, PI = 1.30 (positive NPV).",
    bullets: [
      "PI > 1 implies positive NPV; PI < 1 implies negative NPV.",
      "Use PI to rank projects when you can’t fund everything (capital rationing).",
    ],
    mistakes: [
      "Using PI to choose between mutually exclusive projects of different scale (compare NPV too).",
    ],
    relatedGuideSlugs: ["investment-decision-guide"],
    relatedCalculatorSlugs: ["investment-decision-calculator"],
  },
  {
    slug: "enterprise-value",
    title: "Enterprise Value (EV)",
    description:
      "Enterprise value (EV) represents the value of the operating business available to all capital providers (debt and equity). DCF models that discount unlevered free cash flows typically produce EV.",
    bullets: [
      "EV is often bridged to equity value by adjusting for net debt and other claims.",
      "EV multiples (EV/Revenue, EV/EBITDA) are not the same as equity multiples (P/E).",
    ],
    relatedGuideSlugs: ["equity-value-guide", "dcf-valuation-guide"],
    relatedCalculatorSlugs: ["equity-value-calculator", "dcf-valuation-calculator"],
  },
  {
    slug: "equity-value",
    title: "Equity Value",
    description:
      "Equity value is the value attributable to shareholders after subtracting debt and other senior claims and adding cash (relative to enterprise value). Public-market equity value is often approximated by market capitalization.",
    formula: "Equity value = EV + cash - debt - preferred - minority + adjustments",
    mistakes: [
      "Comparing equity value (market cap) to EV multiples (mismatch).",
      "Using inconsistent dates for EV and balance sheet inputs.",
    ],
    relatedGuideSlugs: ["equity-value-guide"],
    relatedCalculatorSlugs: ["equity-value-calculator"],
  },
  {
    slug: "net-debt",
    title: "Net Debt",
    description:
      "Net debt is debt minus cash. It is a common bridge item between enterprise value and equity value.",
    formula: "Net debt = debt - cash",
    relatedGuideSlugs: ["equity-value-guide"],
    relatedCalculatorSlugs: ["equity-value-calculator"],
  },
  {
    slug: "sensitivity-analysis",
    title: "Sensitivity Analysis",
    description:
      "Sensitivity analysis shows how outputs change when key inputs vary within a reasonable range. In valuation, it’s used to test how fragile a DCF is to discount rate and terminal assumptions.",
    bullets: [
      "Use sensitivity grids to avoid false precision from single-point estimates.",
      "Pick ranges that reflect uncertainty (not just tiny deltas).",
    ],
    mistakes: [
      "Picking ranges that are too narrow and concluding the result is certain.",
      "Changing many inputs at once without tracking what drove the change.",
    ],
    relatedGuideSlugs: ["dcf-sensitivity-guide"],
    relatedCalculatorSlugs: ["dcf-sensitivity-calculator"],
  },
  {
    slug: "apr",
    title: "APR (Annual Percentage Rate)",
    description:
      "APR is a nominal annual interest rate used to describe the cost of borrowing or the return on a product. APR does not directly include the effect of compounding.",
    bullets: [
      "APR is often used as a standardized comparison, but fees and structure can still matter.",
      "Convert APR to APY to compare effective annual yield under compounding.",
    ],
    relatedGuideSlugs: ["apr-vs-apy-guide", "loan-payment-guide"],
    relatedCalculatorSlugs: ["apr-to-apy-calculator", "loan-payment-calculator"],
  },
  {
    slug: "apy",
    title: "APY (Annual Percentage Yield)",
    description:
      "APY is the effective annual rate after compounding. It makes products with different compounding frequencies easier to compare.",
    formula: "APY = (1 + APR/n)^n - 1",
    relatedGuideSlugs: ["apr-vs-apy-guide"],
    relatedCalculatorSlugs: ["apr-to-apy-calculator"],
  },
  {
    slug: "compounding",
    title: "Compounding",
    description:
      "Compounding is earning interest on interest. More frequent compounding increases the effective annual rate (APY) for a given APR.",
    relatedGuideSlugs: ["apr-vs-apy-guide"],
    relatedCalculatorSlugs: ["apr-to-apy-calculator"],
  },
  {
    slug: "amortization",
    title: "Amortization",
    description:
      "Amortization is the process of paying down a loan over time with scheduled payments that include both interest and principal.",
    relatedGuideSlugs: ["loan-payment-guide"],
    relatedCalculatorSlugs: ["loan-payment-calculator"],
  },
  {
    slug: "principal",
    title: "Principal",
    description:
      "Principal is the amount borrowed (or invested) before interest. For loans, interest is calculated on the outstanding principal balance.",
    relatedGuideSlugs: ["loan-payment-guide"],
    relatedCalculatorSlugs: ["loan-payment-calculator"],
  },
  {
    slug: "interest-rate",
    title: "Interest Rate",
    description:
      "Interest rate is the price of borrowing (or return on lending) expressed as a percentage over a time period. Make sure rates are compared on consistent bases (APR vs APY).",
    relatedGuideSlugs: ["apr-vs-apy-guide", "loan-payment-guide", "real-vs-nominal-return-guide"],
    relatedCalculatorSlugs: ["apr-to-apy-calculator", "loan-payment-calculator", "real-return-calculator"],
  },
  {
    slug: "inflation",
    title: "Inflation",
    description:
      "Inflation is the general rise in prices over time, which reduces purchasing power. Inflation is why real return can differ from nominal return.",
    relatedGuideSlugs: ["real-vs-nominal-return-guide"],
    relatedCalculatorSlugs: ["real-return-calculator"],
  },
  {
    slug: "real-return",
    title: "Real Return",
    description:
      "Real return is the inflation-adjusted return that reflects change in purchasing power rather than just nominal balances.",
    formula: "Real return ≈ (1 + nominal return) ÷ (1 + inflation) - 1",
    relatedGuideSlugs: ["real-vs-nominal-return-guide"],
    relatedCalculatorSlugs: ["real-return-calculator"],
  },
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
    relatedGuideSlugs: ["break-even-pricing-guide"],
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
  },
  {
    slug: "variable-costs",
    title: "Variable Costs",
    description:
      "Variable costs scale with volume (payment fees, shipping, returns, usage-based infrastructure). They determine contribution margin.",
    relatedGuideSlugs: ["break-even-pricing-guide"],
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
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
    relatedGuideSlugs: ["break-even-pricing-guide"],
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
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
    relatedGuideSlugs: ["deferred-revenue-guide", "bookings-vs-arr-guide"],
    relatedCalculatorSlugs: [
      "deferred-revenue-rollforward-calculator",
      "bookings-vs-arr-calculator",
    ],
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
    relatedGuideSlugs: ["deferred-revenue-guide"],
    relatedCalculatorSlugs: ["deferred-revenue-rollforward-calculator"],
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
    relatedGuideSlugs: ["deferred-revenue-guide"],
    relatedCalculatorSlugs: ["deferred-revenue-rollforward-calculator"],
  },
  {
    slug: "revenue-recognition",
    title: "Revenue Recognition",
    description:
      "Revenue recognition is the accounting process of recording revenue when earned (delivered), not necessarily when billed or collected.",
    relatedGuideSlugs: ["deferred-revenue-guide"],
    relatedCalculatorSlugs: ["deferred-revenue-rollforward-calculator"],
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
    formula: "PV = Σ cash_flow_t / (1 + r)^t",
    example:
      "If r = 10%, $100 received in 1 year is worth about $100 / 1.10 = $90.91 today.",
    bullets: [
      "Use a discount rate consistent with risk (higher risk → higher required return).",
      "For business valuation, WACC is a common starting point (then run sensitivity).",
      "For project evaluation, use a hurdle rate / MARR aligned to opportunity cost.",
    ],
    mistakes: [
      "Using a single-point discount rate without scenario testing.",
      "Mixing nominal and real cash flows (adjust for inflation consistently).",
    ],
    faqs: [
      {
        question: "Discount rate vs interest rate: what’s the difference?",
        answer:
          "Interest rates are observed borrowing/lending rates. Discount rate is the required return used to value risky cash flows (it may include risk premiums).",
      },
    ],
    relatedGuideSlugs: ["dcf-valuation-guide", "wacc-guide", "investment-decision-guide"],
    relatedCalculatorSlugs: [
      "dcf-valuation-calculator",
      "wacc-calculator",
      "npv-calculator",
      "investment-decision-calculator",
    ],
  },
  {
    slug: "npv",
    title: "NPV (Net Present Value)",
    description:
      "NPV is the present value of future cash flows minus initial cost. NPV helps compare projects and investments.",
    formula: "NPV = Σ cash_flow_t / (1 + r)^t - initial investment",
    example:
      "If PV of future cash flows is $140k and the upfront investment is $100k, NPV = $40k (value created at the chosen discount rate).",
    bullets: [
      "Use NPV as the primary decision metric when you have a sensible discount rate (MARR).",
      "Compare projects on NPV for absolute value created; use PI for value per dollar under capital constraints.",
    ],
    mistakes: [
      "Using an arbitrary discount rate (NPV is only as good as r).",
      "Comparing NPVs across projects with very different risk without adjusting the discount rate.",
    ],
    faqs: [
      {
        question: "If NPV is positive, should we always do the project?",
        answer:
          "Not always. You still need to consider risk, capital constraints, operational capacity, and whether cash flow assumptions are realistic.",
      },
    ],
    relatedGuideSlugs: ["npv-guide", "investment-decision-guide", "capital-budgeting-hub-guide"],
    relatedCalculatorSlugs: ["npv-calculator", "investment-decision-calculator"],
  },
  {
    slug: "irr",
    title: "IRR (Internal Rate of Return)",
    description:
      "IRR is the discount rate that makes NPV equal zero. It's commonly used to compare investment opportunities.",
    formula: "IRR is the r where NPV(r) = 0",
    example:
      "If an investment is -$100k today and returns +$30k per year for several years, IRR is the discount rate that makes the present value of returns equal $100k.",
    bullets: [
      "IRR is sensitive to the timing of cash flows.",
      "Projects with multiple sign changes can have multiple IRRs or no IRR.",
      "Use NPV alongside IRR for clearer decision-making at a chosen discount rate.",
    ],
    mistakes: [
      "Using IRR alone to pick between projects of different scale (use NPV too).",
      "Assuming IRR exists for every cash flow stream (non-standard cash flows can break it).",
    ],
    faqs: [
      {
        question: "Why can IRR be misleading?",
        answer:
          "IRR ignores scale and can favor small projects. It can also produce multiple values or no value when cash flows change sign multiple times.",
      },
    ],
    relatedGuideSlugs: ["irr-guide", "investment-decision-guide", "capital-budgeting-hub-guide"],
    relatedCalculatorSlugs: ["irr-calculator", "investment-decision-calculator"],
  },
  {
    slug: "payback-period",
    title: "Payback Period (finance)",
    description:
      "Payback period is the time needed to recover an investment's cost from cash flows. In SaaS, 'CAC payback' is a specific variant.",
    formula: "Payback period = time until cumulative cash flow ≥ initial investment",
    example:
      "If you invest $100k and get $30k per year, simple payback is a bit over 3 years (ignoring discounting).",
    bullets: [
      "Use discounted payback when time value of money matters (riskier or longer projects).",
      "Use payback as a liquidity/risk lens, not the primary value metric (NPV is usually better).",
    ],
    mistakes: [
      "Using simple payback without discounting for long-duration projects.",
      "Ignoring cash flows after payback (can favor low-upside projects).",
    ],
    faqs: [
      {
        question: "Payback vs discounted payback: which should I use?",
        answer:
          "Discounted payback is more realistic because it accounts for time value of money. Simple payback is faster but can be misleading for longer projects.",
      },
    ],
    relatedGuideSlugs: ["discounted-payback-period-guide", "investment-decision-guide"],
    relatedCalculatorSlugs: ["discounted-payback-period-calculator", "investment-decision-calculator"],
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
    bullets: [
      "Treat MARR as your opportunity cost and risk threshold.",
      "Use the same MARR when comparing comparable-risk projects; adjust MARR when risk differs.",
    ],
    mistakes: [
      "Using a single MARR for projects with very different risk profiles.",
      "Confusing MARR with IRR (MARR is your required threshold; IRR is a project’s implied return).",
    ],
    faqs: [
      {
        question: "How is MARR different from WACC?",
        answer:
          "WACC is a blended required return for an overall business (often used in valuation). MARR is a project/decision hurdle rate and may be higher or lower depending on risk and constraints.",
      },
    ],
    relatedGuideSlugs: ["investment-decision-guide", "capital-budgeting-hub-guide"],
    relatedCalculatorSlugs: ["npv-calculator", "investment-decision-calculator"],
  },
  {
    slug: "pre-money-valuation",
    title: "Pre-money Valuation",
    description:
      "Pre-money valuation is the value of a company immediately before a new equity financing. It is used with the investment amount to determine post-money valuation and implied ownership.",
    formula: "Post-money (simplified) = pre-money + investment",
    bullets: [
      "Use pre-money and new investment to estimate investor ownership (investment ÷ post-money).",
      "Confirm whether option pool increases are included in the pre-money (option pool shuffle).",
    ],
    mistakes: [
      "Mixing pre-money and post-money definitions across different documents or cap tables.",
      "Treating the ownership math as exact without modeling the option pool and convertibles.",
    ],
    relatedGuideSlugs: ["pre-money-post-money-guide", "option-pool-shuffle-guide"],
    relatedCalculatorSlugs: ["pre-money-post-money-calculator", "option-pool-shuffle-calculator"],
  },
  {
    slug: "post-money-valuation",
    title: "Post-money Valuation",
    description:
      "Post-money valuation is the value of a company immediately after a new equity financing. It is commonly approximated as pre-money plus the new investment amount (simplified).",
    formula: "Post-money (simplified) = pre-money + investment",
    bullets: [
      "Investor ownership is often approximated as investment ÷ post-money (simplified).",
      "Use a cap table to validate when option pool changes and convertibles are present.",
    ],
    mistakes: [
      "Assuming post-money always equals pre-money + investment without checking term details.",
      "Using post-money ownership numbers that aren’t on a fully diluted basis.",
    ],
    relatedGuideSlugs: ["pre-money-post-money-guide"],
    relatedCalculatorSlugs: ["pre-money-post-money-calculator"],
  },
  {
    slug: "dilution",
    title: "Dilution",
    description:
      "Dilution is the reduction in an existing shareholder’s ownership percentage when new shares are issued (new financing, option grants, or convertible conversions).",
    bullets: [
      "Dilution can come from new investment, option pool increases, and SAFE/note conversions.",
      "Always specify the basis (issued shares vs fully diluted).",
    ],
    mistakes: [
      "Looking only at headline valuation instead of the full dilution package (pool, convertibles, etc.).",
      "Mixing different ownership bases in the same analysis.",
    ],
    relatedGuideSlugs: [
      "pre-money-post-money-guide",
      "pro-rata-rights-guide",
      "option-pool-shuffle-guide",
      "safe-guide",
      "convertible-note-guide",
    ],
    relatedCalculatorSlugs: [
      "pre-money-post-money-calculator",
      "pro-rata-investment-calculator",
      "option-pool-shuffle-calculator",
      "safe-conversion-calculator",
      "convertible-note-conversion-calculator",
    ],
  },
  {
    slug: "pro-rata-rights",
    title: "Pro Rata Rights",
    description:
      "Pro rata rights allow an existing investor to participate in a future financing to maintain ownership, typically by buying a proportional share of the new issuance (subject to terms and allocation).",
    bullets: [
      "A rough check-size estimate is current ownership % × round size (priced equity, simplified).",
      "Your ability to take pro rata can be limited by allocation and company discretion.",
    ],
    mistakes: [
      "Assuming full pro rata is always available (many rounds are oversubscribed).",
      "Ignoring other dilution sources (option pool increases, SAFE/note conversions).",
    ],
    relatedGuideSlugs: ["pro-rata-rights-guide"],
    relatedCalculatorSlugs: ["pro-rata-investment-calculator"],
  },
  {
    slug: "option-pool",
    title: "Option Pool",
    description:
      "An option pool is a reserve of equity (typically employee stock options) set aside for hiring and incentives. Option pools dilute existing shareholders on a fully diluted basis.",
    bullets: [
      "Option pools are often increased during fundraising; the timing determines who bears dilution.",
      "Always define the pool as a percent of fully diluted shares (not just issued shares).",
    ],
    mistakes: [
      "Confusing granted options with the full pool reserve.",
      "Modeling pool % on the wrong basis (issued vs fully diluted).",
    ],
    relatedGuideSlugs: ["option-pool-shuffle-guide"],
    relatedCalculatorSlugs: ["option-pool-shuffle-calculator"],
  },
  {
    slug: "valuation-cap",
    title: "Valuation Cap",
    description:
      "A valuation cap sets a maximum valuation used when converting a SAFE or convertible note into equity in a priced round. A lower cap generally means a lower conversion price and more shares for the investor.",
    bullets: [
      "Cap price is often modeled as cap ÷ fully diluted shares at conversion (simplified).",
      "Caps matter most when the priced round valuation is meaningfully higher than the cap.",
    ],
    mistakes: [
      "Using non-fully diluted share counts when computing cap price per share.",
      "Assuming cap mechanics are identical across SAFEs and notes (terms vary).",
    ],
    relatedGuideSlugs: ["safe-guide", "convertible-note-guide"],
    relatedCalculatorSlugs: ["safe-conversion-calculator", "convertible-note-conversion-calculator"],
  },
  {
    slug: "safe",
    title: "SAFE (Simple Agreement for Future Equity)",
    description:
      "A SAFE is an instrument that typically converts into equity at a future priced round. It often includes a valuation cap, a discount, or both to reward early investors.",
    bullets: [
      "Conversion price is often the better (lower price) of cap vs discount (terms vary).",
      "Model conversion using fully diluted shares to avoid underestimating dilution.",
    ],
    mistakes: [
      "Ignoring post-money SAFE mechanics and MFN clauses (terms vary).",
      "Treating simplified math as legal truth without reconciling documents and cap table.",
    ],
    relatedGuideSlugs: ["safe-guide"],
    relatedCalculatorSlugs: ["safe-conversion-calculator"],
  },
  {
    slug: "convertible-note",
    title: "Convertible Note",
    description:
      "A convertible note is debt that typically converts into equity at a future priced round. It often includes an interest rate, a maturity date, and cap/discount conversion terms.",
    bullets: [
      "Conversion amount may include accrued interest (terms vary).",
      "Conversion price may be set by valuation cap, discount, or round price (terms vary).",
    ],
    mistakes: [
      "Modeling interest incorrectly (simple vs compounding; check the note).",
      "Ignoring stacked convertibles and option pool changes when estimating dilution.",
    ],
    relatedGuideSlugs: ["convertible-note-guide"],
    relatedCalculatorSlugs: ["convertible-note-conversion-calculator"],
  },
  {
    slug: "liquidation-preference",
    title: "Liquidation Preference",
    description:
      "Liquidation preference defines what preferred shareholders receive at an exit before common shareholders. A common structure is 1× non-participating preferred.",
    bullets: [
      "Non-participating preferred often takes the greater of preference payout or as-converted common payout.",
      "Multiple classes and seniority create a waterfall that requires a full model.",
    ],
    mistakes: [
      "Ignoring stacked preferences and seniority across rounds.",
      "Confusing participating and non-participating preferred (very different outcomes).",
    ],
    relatedGuideSlugs: ["liquidation-preference-guide"],
    relatedCalculatorSlugs: ["liquidation-preference-calculator"],
  },
];

export const termsFinance: GlossaryTerm[] = seeds.map(make);
