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
    updatedAt: seed.updatedAt ?? "2026-01-23",
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
        question: "What discount rate should I use in a DCF-",
        answer:
          "Teams often use WACC as a starting point for an overall business discount rate, then run sensitivity scenarios. The right rate depends on risk and cash flow timing.",
      },
      {
        question: "Why does terminal value dominate many DCFs-",
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
      "If next year's FCF is $6M, discount rate is 12%, and terminal growth is 3%, terminal value = $6M / (0.12 - 0.03) = $66.7M (before discounting it back to today).",
    mistakes: [
      "Letting terminal value dominate without sensitivity analysis.",
      "Using aggressive terminal growth that implies implausible long-run scale.",
    ],
    faqs: [
      {
        question: "Why must discount rate be higher than terminal growth-",
        answer:
          "In the perpetuity formula, if growth >= discount rate, the denominator goes to zero or negative and the terminal value explodes or becomes invalid.",
      },
      {
        question: "What's a reasonable terminal growth rate-",
        answer:
          "Often a conservative long-run growth rate below the discount rate. Use scenarios rather than a single point estimate.",
      },
    ],
    relatedGuideSlugs: ["dcf-valuation-guide"],
    relatedCalculatorSlugs: ["dcf-valuation-calculator"],
  },
  {
    slug: "wacc",
    title: "WACC (Cost of Capital)",
    description:
      "WACC is a blended required return for capital providers (equity and debt). It is commonly used as a discount rate proxy in DCF models.",
    updatedAt: "2026-01-28",
    formula: "WACC = (E/V)*Re + (D/V)*Rd*(1 - tax rate)",
    example:
      "If E/V = 70%, D/V = 30%, Re = 15%, Rd = 7%, and tax rate = 25%, WACC ~ 0.7*0.15 + 0.3*0.07*(1-0.25) = 12.1%.",
    bullets: [
      "Higher WACC lowers present value; lower WACC raises it.",
      "WACC depends on capital structure, market risk, and interest rates.",
    ],
    faqs: [
      {
        question: "Can I use WACC for every project-",
        answer:
          "Not always. If a project has different risk than the overall business, you may need an adjusted discount rate rather than the company-wide WACC.",
      },
      {
        question: "Should WACC use market value weights or book value weights-",
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
      "If risk-free rate is 4%, beta is 1.2, and equity risk premium is 5%, cost of equity ~ 4% + 1.2*5% = 10%.",
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
        question: "Is cost of equity the same as expected stock return-",
        answer:
          "It's a required return estimate, not a guarantee. It's commonly used as an input to WACC and valuation, but realized returns can differ materially.",
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
    formula: "After-tax cost of debt ~ cost of debt * (1 - tax rate)",
    example:
      "If cost of debt is 7% and tax rate is 25%, after-tax cost of debt ~ 7%*(1-0.25) = 5.25%.",
    bullets: [
      "Use the company's current borrowing rate for similar maturity and risk.",
      "Remember the tax shield: after-tax cost of debt is lower than the nominal coupon.",
      "Use the weighted average rate if multiple debt instruments exist.",
      "Include fees and amortized costs when estimating effective debt cost.",
    ],
    mistakes: [
      "Using old debt coupons when the firm's risk or rates have changed.",
      "Forgetting the tax shield when using WACC as a discount rate proxy.",
      "Ignoring fees or amortization costs that raise effective rates.",
      "Using short-term debt rates to price long-term cash flows.",
    ],
    faqs: [
      {
        question: "What if the company has no debt today-",
        answer:
          "You can still estimate a cost of debt from comparable firms or an assumed target rating/capital structure for WACC scenarios.",
      },
      {
        question: "Should I use pre-tax or after-tax cost of debt-",
        answer:
          "Use after-tax cost of debt in WACC. Use pre-tax cost of debt when modeling interest expense directly.",
      },
      {
        question: "How do variable-rate loans affect cost of debt-",
        answer:
          "Model variable-rate debt with rate scenarios, then use a blended expected rate for WACC sensitivity analysis.",
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
      "Use PI to rank projects when you can't fund everything (capital rationing).",
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
      "Net debt is total debt minus cash and cash equivalents. It bridges enterprise value to equity value in valuation models.",
    updatedAt: "2026-01-27",
    formula: "Net debt = debt - cash",
    bullets: [
      "Include short-term and long-term debt; exclude operating liabilities unless they are debt-like.",
      "Use the same balance sheet date as your enterprise value inputs.",
      "If cash exceeds debt, net debt is negative (net cash).",
    ],
    mistakes: [
      "Mixing market value of equity with a balance sheet from a different date.",
      "Counting restricted cash as fully available.",
      "Double-counting lease liabilities if EV already includes them.",
    ],
    relatedGuideSlugs: ["equity-value-guide"],
    relatedCalculatorSlugs: ["equity-value-calculator"],
  },
  {
    slug: "sensitivity-analysis",
    title: "Sensitivity Analysis",
    description:
      "Sensitivity analysis shows how outputs change when key inputs vary within a reasonable range. In valuation, it's used to test how fragile a DCF is to discount rate and terminal assumptions.",
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
    example:
      "If APR is 12% and compounding is monthly (n=12), APY = (1+0.12/12)^12 - 1 = 12.68%.",
    bullets: [
      "APY includes compounding; APR does not.",
      "The difference between APR and APY grows with more frequent compounding.",
      "Use APY for savings yields and APR for loan costs.",
      "Compare products with the same compounding frequency when possible.",
      "Ask whether the rate is fixed or variable; APY can change with rate resets.",
    ],
    mistakes: [
      "Comparing APY on one product to APR on another.",
      "Ignoring fees that reduce the effective yield.",
      "Mixing nominal APR assumptions with effective APY outcomes.",
      "Using a teaser APY without checking how long it lasts.",
    ],
    faqs: [
      {
        question: "Does a higher APY always mean a better product-",
        answer:
          "Not always. Fees, minimum balances, and withdrawal limits can reduce real returns despite a higher stated APY.",
      },
      {
        question: "How often should I recalculate APY-",
        answer:
          "Recalculate when rates reset or compounding frequency changes. For variable-rate products, check APY each statement period.",
      },
    ],
    relatedGuideSlugs: ["apr-vs-apy-guide"],
    relatedCalculatorSlugs: ["apr-to-apy-calculator"],
  },
  {
    slug: "compounding",
    title: "Compounding",
    description:
      "Compounding is earning interest on interest. More frequent compounding increases the effective annual rate (APY) for a given APR.",
    formula: "APY = (1 + APR / n)^n - 1",
    example:
      "At 10% APR, annual compounding yields 10%. Monthly compounding yields 10.47% APY.",
    bullets: [
      "Compounding frequency (daily, monthly, quarterly) changes the effective return.",
      "APR is the nominal rate; APY reflects compounding effects.",
      "Small rate differences can compound into large gaps over long horizons.",
      "Compounding applies to growth rates too (revenue, users, and cash).",
      "Use the same compounding basis when comparing products.",
      "Long horizons amplify small compounding differences.",
      "Align compounding with payment timing when modeling loans or savings.",
    ],
    mistakes: [
      "Comparing APR to APY without converting to the same basis.",
      "Assuming compounding frequency does not matter for short horizons.",
      "Ignoring fees that reduce effective yield.",
      "Mixing nominal and effective rates in the same model.",
      "Using annual rates in monthly models without converting.",
      "Applying compounding to one line item but not to the related assumptions.",
    ],
    faqs: [
      {
        question: "Does compounding matter over short periods-",
        answer:
          "It matters less over very short periods, but even small differences accumulate over time. For planning, use the same compounding basis across scenarios.",
      },
      {
        question: "Is daily compounding always better than monthly-",
        answer:
          "For a given nominal rate, more frequent compounding yields a slightly higher effective rate. The practical impact depends on the time horizon and fees.",
      },
    ],
    relatedGuideSlugs: ["apr-vs-apy-guide"],
    relatedCalculatorSlugs: ["apr-to-apy-calculator"],
  },
  {
    slug: "amortization",
    title: "Amortization",
    description:
      "Amortization is the process of paying down a loan over time with scheduled payments that include both interest and principal.",
    example:
      "In a 30-year mortgage, early payments are mostly interest, but the principal share increases over time.",
    bullets: [
      "Early payments are mostly interest; principal share grows over time.",
      "An amortization schedule shows the split between interest and principal each period.",
      "Longer terms lower monthly payments but increase total interest paid.",
      "Prepayments reduce interest and shorten the effective term.",
      "Use the schedule to forecast cash outflows and remaining balance.",
    ],
    mistakes: [
      "Assuming the interest share is constant over the term.",
      "Comparing loans without aligning term length and compounding.",
      "Ignoring fees that change the effective rate.",
      "Using amortization schedules with mismatched payment frequency.",
      "Confusing accounting amortization with loan amortization.",
    ],
    faqs: [
      {
        question: "Does amortization apply to intangible assets-",
        answer:
          "In accounting, amortization can also refer to expensing intangible assets over time. In lending, it refers to loan repayment schedules.",
      },
      {
        question: "How do extra payments change amortization-",
        answer:
          "Extra principal payments reduce the balance, lower total interest, and shorten the loan term. They may or may not change the required monthly payment.",
      },
    ],
    relatedGuideSlugs: ["loan-payment-guide"],
    relatedCalculatorSlugs: ["loan-payment-calculator"],
  },
  {
    slug: "principal",
    title: "Principal",
    description:
      "Principal is the amount borrowed (or invested) before interest. For loans, interest is calculated on the outstanding principal balance.",
    formula: "Interest = principal x rate x time",
    example:
      "If principal is $10,000 at 6% annual interest, first-year interest is about $600.",
    bullets: [
      "Principal declines as you repay a loan; interest is charged on the balance.",
      "Extra payments reduce principal and total interest over time.",
      "For investments, principal is the initial amount you contribute.",
      "Principal is different from total cost over the life of a loan.",
    ],
    mistakes: [
      "Confusing principal with total amount repaid (principal + interest).",
      "Ignoring how principal changes in an amortization schedule.",
      "Using original principal when interest should be based on current balance.",
    ],
    faqs: [
      {
        question: "Does interest ever get added to principal-",
        answer:
          "It can, in cases like capitalized interest or negative amortization. In standard loans, interest is paid separately from principal reduction.",
      },
    ],
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
    example:
      "If prices rise 3% per year, a $100 basket costs about $103 next year.",
    bullets: [
      "Inflation affects costs, pricing power, and real returns.",
      "Even low inflation compounds into large real differences over time.",
      "Use consistent inflation assumptions across scenarios.",
      "Separate short-term price spikes from long-term inflation assumptions.",
      "Adjust multi-year forecasts to keep comparisons in real terms.",
    ],
    mistakes: [
      "Assuming inflation is zero in long-term planning.",
      "Mixing nominal and real rates in the same model.",
      "Using national inflation rates for local cost structures without adjustment.",
      "Forgetting that wage inflation can differ from overall CPI.",
    ],
    faqs: [
      {
        question: "Is inflation always bad for businesses-",
        answer:
          "Not always. Companies with strong pricing power can pass through costs, but inflation still pressures cash flow and can reduce demand in price-sensitive segments.",
      },
    ],
    relatedGuideSlugs: ["real-vs-nominal-return-guide"],
    relatedCalculatorSlugs: ["real-return-calculator"],
  },
  {
    slug: "real-return",
    title: "Real Return",
    description:
      "Real return is the inflation-adjusted return that reflects change in purchasing power rather than just nominal balances.",
    formula: "Real return ~ (1 + nominal return) / (1 + inflation) - 1",
    example:
      "If nominal return is 8% and inflation is 3%, real return is about 4.85%.",
    bullets: [
      "Real return is the right metric for long-term purchasing power.",
      "When inflation is high, nominal gains can hide flat real outcomes.",
      "Use the same period basis for return and inflation assumptions.",
      "Model real return for retirement or long-term planning, not just nominal growth.",
      "Compare real return to your spending growth, not just market benchmarks.",
      "Stress test real return with low-return, high-inflation scenarios.",
    ],
    mistakes: [
      "Comparing nominal returns to real targets.",
      "Using monthly inflation with annual return rates without conversion.",
      "Ignoring taxes, which further reduce real purchasing power.",
    ],
    faqs: [
      {
        question: "Should I use CPI for inflation-",
        answer:
          "CPI is a common proxy, but use an inflation measure that matches your spending basket if it differs materially.",
      },
      {
        question: "Can real return be negative even if nominal return is positive-",
        answer:
          "Yes. If inflation exceeds nominal return, purchasing power falls even when the account balance grows.",
      },
    ],
    relatedGuideSlugs: ["real-vs-nominal-return-guide"],
    relatedCalculatorSlugs: ["real-return-calculator"],
  },
  {
    slug: "gross-margin",
    title: "Gross Margin",
    description:
      "Gross margin is gross profit as a percentage of revenue. It is foundational for payback, LTV, and break-even analysis.",
    formula: "Gross margin (%) = (revenue - COGS) / revenue",
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
    formula: "Gross profit = revenue - COGS",
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
    formula: "Contribution margin = revenue - variable costs",
    example:
      "If revenue is $100 and variable costs (COGS + fees + shipping + returns) are $60, contribution margin is $40 (40%).",
    bullets: [
      "Use contribution margin when setting break-even ROAS/CPA targets (profitability depends on variable costs).",
      "Separate variable costs from fixed costs (rent, base salaries) to avoid double counting.",
    ],
    mistakes: [
      "Mixing fixed and variable costs inconsistently.",
      "Ignoring variable costs like payment fees, returns, or shipping when they matter.",
    ],
    faqs: [
      {
        question: "Contribution margin vs gross margin: what's the difference-",
        answer:
          "Gross margin usually means revenue minus COGS. Contribution margin often subtracts additional variable costs like payment fees, shipping, and returns, so it's closer to per-order profit.",
      },
      {
        question: "Why does contribution margin matter for paid ads-",
        answer:
          "Because break-even ROAS/CPA depends on profit per conversion, not revenue. Using revenue-only targets can make campaigns look profitable when they're not.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-funnel-guide", "break-even-pricing-guide"],
    relatedCalculatorSlugs: [
      "paid-ads-funnel-calculator",
      "break-even-pricing-calculator",
      "break-even-roas-calculator",
    ],
  },
  {
    slug: "fixed-costs",
    title: "Fixed Costs",
    description:
      "Fixed costs do not scale directly with volume in the short term (rent, base salaries, core tools). They matter for break-even and operating leverage.",
    example:
      "Rent and full-time salaries stay constant whether you sell 100 or 1,000 units.",
    bullets: [
      "Fixed costs create operating leverage as revenue scales.",
      "Some costs are fixed only within a volume range (step costs).",
      "Separate fixed vs variable to compute contribution margin correctly.",
      "Review fixed cost growth when planning new hiring or facilities.",
      "Model fixed costs over the same period as your revenue target.",
    ],
    mistakes: [
      "Classifying step-function costs as purely fixed.",
      "Ignoring fixed costs when setting break-even targets.",
      "Allocating fixed costs to units inconsistently across periods.",
      "Treating fixed costs as sunk when planning new programs.",
    ],
    faqs: [
      {
        question: "Are software subscriptions fixed or variable costs-",
        answer:
          "They are often fixed within a range but can become step costs as usage grows. Track when pricing tiers change.",
      },
      {
        question: "Do fixed costs ever become variable-",
        answer:
          "Yes. At scale, fixed costs can become step costs (new teams, data centers, or office space). Model thresholds explicitly.",
      },
    ],
    relatedGuideSlugs: ["break-even-pricing-guide"],
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
  },
  {
    slug: "variable-costs",
    title: "Variable Costs",
    description:
      "Variable costs scale with volume (payment fees, shipping, returns, usage-based infrastructure). They determine contribution margin.",
    example:
      "If COGS is $20 and payment fees are $3 per order, variable cost per order is $23.",
    bullets: [
      "Variable costs drive contribution margin and break-even analysis.",
      "Some costs are semi-variable (fixed base plus usage spikes).",
      "Model variable costs per unit to estimate scale economics.",
      "Track variable costs by segment when mix shifts are large.",
      "Recalculate variable cost per unit when suppliers change pricing.",
    ],
    mistakes: [
      "Treating fixed overhead as variable and overstating contribution margin.",
      "Ignoring refund, chargeback, or returns costs.",
      "Using averages when costs vary materially by segment.",
      "Excluding usage-based infrastructure costs in SaaS.",
      "Mixing variable cost definitions across periods.",
    ],
    faqs: [
      {
        question: "How do I estimate variable costs for new products-",
        answer:
          "Start with per-unit COGS, fees, and fulfillment, then add a buffer for early-stage variability and update after initial cohorts.",
      },
    ],
    relatedGuideSlugs: ["break-even-pricing-guide"],
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
  },
  {
    slug: "break-even-revenue",
    title: "Break-even Revenue",
    description:
      "Break-even revenue is the revenue required to cover fixed costs given your gross or contribution margin.",
    formula: "Break-even revenue = fixed costs / gross margin",
    example:
      "If fixed costs are $50,000/month and gross margin is 60% (0.6), break-even revenue ~ $50,000 / 0.6 = $83,333/month.",
    bullets: [
      "Use contribution margin when variable costs beyond COGS are material.",
      "Recalculate when pricing, mix, or discounts change materially.",
      "Segment break-even by product or plan if margins differ.",
      "Pair break-even revenue with volume assumptions to estimate break-even units.",
    ],
    mistakes: [
      "Using net margin instead of gross/contribution margin.",
      "Forgetting semi-fixed costs that are effectively fixed at your scale.",
      "Ignoring seasonality that creates temporary break-even misses.",
    ],
    faqs: [
      {
        question: "Should I use gross margin or contribution margin-",
        answer:
          "Use contribution margin if variable costs beyond COGS are material (fees, shipping, returns). Otherwise gross margin can be a reasonable shortcut.",
      },
      {
        question: "Is break-even revenue the same as cash break-even-",
        answer:
          "No. Cash break-even also depends on timing (collections, payables, deferred revenue). Use a cash flow view for runway decisions.",
      },
    ],
    relatedGuideSlugs: ["break-even-pricing-guide"],
    relatedCalculatorSlugs: ["break-even-pricing-calculator"],
  },
  {
    slug: "runway",
    title: "Runway",
    description:
      "Runway estimates how many months you can operate before running out of cash at the current net burn.",
    formula: "Runway (months) = cash balance / net monthly burn",
    example:
      "If cash balance is $1.2M and net burn is $150k/month, runway ~ $1.2M / $150k = 8 months.",
    bullets: [
      "Use net burn (cash outflows minus cash inflows), not accounting losses.",
      "Recalculate runway whenever revenue, collections, or spend changes materially.",
    ],
    mistakes: [
      "Using gross burn instead of net burn (runway becomes overly pessimistic).",
      "Ignoring working capital timing (AR/AP) and deferred revenue effects.",
    ],
    relatedGuideSlugs: ["cash-runway-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator"],
  },
  {
    slug: "burn-rate",
    title: "Burn Rate",
    description:
      "Burn rate measures how quickly a company spends cash. Teams often track monthly gross burn and net burn.",
    example:
      "If monthly cash outflows are $500k and cash inflows are $350k, gross burn is $500k and net burn is $150k.",
    bullets: [
      "Gross burn: total cash outflows.",
      "Net burn: cash outflows minus cash inflows.",
    ],
    faqs: [
      {
        question: "Burn rate vs burn multiple: how are they different-",
        answer:
          "Burn rate is dollars of cash consumed per period. Burn multiple relates cash burn to growth output (e.g., net new ARR) and is a growth efficiency metric.",
      },
    ],
    relatedGuideSlugs: ["cash-runway-guide", "burn-multiple-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator", "burn-multiple-calculator"],
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
    formula: "Net burn = cash outflows - cash inflows",
    example:
      "If outflows are $500k and inflows are $350k, net burn = $500k - $350k = $150k for the period.",
    relatedGuideSlugs: ["cash-runway-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator"],
  },
  {
    slug: "cash-breakeven",
    title: "Cash Break-even",
    description:
      "Cash break-even is when cash inflows cover cash outflows (net burn is ~0). It can differ from accounting break-even due to timing.",
    example:
      "If monthly inflows are $500k and outflows are $500k, cash break-even is reached.",
    bullets: [
      "Cash break-even focuses on cash timing (collections, payables, prepay), not accounting profit.",
      "A company can be accounting-profitable but still cash-negative if working capital is consuming cash.",
      "Track cash break-even alongside runway to gauge survival risk.",
    ],
    mistakes: [
      "Confusing cash break-even with profitability in financial statements.",
      "Ignoring collections timing (AR) and deferred revenue effects.",
      "Treating one-time cash events as sustainable break-even.",
    ],
    faqs: [
      {
        question: "How is cash break-even different from EBITDA break-even-",
        answer:
          "EBITDA excludes working capital and capex. Cash break-even reflects actual cash in and out, which can differ materially.",
      },
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-runway-guide"],
    relatedCalculatorSlugs: ["cash-runway-calculator"],
  },
  {
    slug: "cash-flow",
    title: "Cash Flow",
    description:
      "Cash flow is the net movement of cash in and out of the business. It differs from profit due to working capital and timing.",
    example:
      "A common reason profit and cash diverge is accounts receivable: you can record revenue today but collect cash later.",
    bullets: [
      "Operating cash flow is affected by working capital (AR/AP/deferred revenue).",
      "Investing cash flow includes capex and acquisitions.",
      "Financing cash flow includes debt, equity, and repayments.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-conversion-cycle-guide"],
  },
  {
    slug: "working-capital",
    title: "Working Capital",
    description:
      "Working capital reflects short-term assets and liabilities (receivables, payables, deferred revenue). It can cause profit and cash to diverge.",
    bullets: [
      "AR increases consume cash (you sold but haven't collected yet).",
      "AP increases can preserve cash (you haven't paid yet).",
      "Deferred revenue increases can boost cash (prepay) while revenue is recognized later.",
    ],
    faqs: [
      {
        question: "How does working capital affect runway-",
        answer:
          "Working capital changes can increase or decrease net burn without changing headline revenue. Faster collections and better payment terms can extend runway.",
      },
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-conversion-cycle-guide"],
  },
  {
    slug: "accounts-receivable",
    title: "Accounts Receivable (AR)",
    description:
      "Accounts receivable is money owed by customers for invoices issued but not yet paid. It affects cash flow and collections risk.",
    example:
      "If you invoice $100k this month but only collect $60k, AR increased by $40k, reducing cash even if revenue looked strong.",
    bullets: [
      "High AR can create cash strain even with healthy revenue growth.",
      "Improving collections (DSO) is one of the fastest levers to extend runway.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-conversion-cycle-guide"],
  },
  {
    slug: "accounts-payable",
    title: "Accounts Payable (AP)",
    description:
      "Accounts payable is money you owe suppliers/vendors for invoices received but not yet paid. It affects cash timing.",
    example:
      "If you negotiate net-60 payment terms instead of net-30, you can improve short-term cash timing without changing total costs.",
    bullets: [
      "AP timing can extend runway, but don't damage vendor relationships or reliability.",
      "Match payment terms to your collections cycle where possible.",
    ],
    relatedGuideSlugs: ["runway-burn-cash-guide", "cash-conversion-cycle-guide"],
  },
  {
    slug: "cash-conversion-cycle",
    title: "Cash Conversion Cycle (CCC)",
    description:
      "The cash conversion cycle (CCC) measures how long cash is tied up between paying out cash (to suppliers) and collecting cash (from customers). It's a working-capital lens on runway.",
    formula: "CCC = DSO + DIO - DPO (often DIO ~ 0 for SaaS)",
    bullets: [
      "Lower CCC means cash comes back faster (less runway risk).",
      "In SaaS, CCC is usually driven by collections (DSO) and vendor terms (DPO), not inventory.",
      "Use CCC trends to explain why cash can worsen even when revenue looks strong (growth can consume cash).",
    ],
    mistakes: [
      "Treating bookings or recognized revenue as cash collected.",
      "Planning runway from P&L only (ignoring AR/AP movement).",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "days-sales-outstanding",
    title: "Days Sales Outstanding (DSO)",
    description:
      "DSO estimates how many days it takes, on average, to collect cash after you issue invoices. Lower DSO improves cash flow and runway.",
    formula: "DSO ~ accounts receivable / (revenue per day)",
    bullets: [
      "Improve DSO with tighter terms, clearer invoicing, and disciplined collections cadence.",
      "Segment DSO by customer type and invoice size; a few large accounts can dominate AR.",
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide", "runway-burn-cash-guide"],
  },
  {
    slug: "days-payables-outstanding",
    title: "Days Payables Outstanding (DPO)",
    description:
      "DPO estimates how many days, on average, you take to pay suppliers. Higher DPO can improve short-term cash timing, but it can also strain vendor relationships.",
    formula: "DPO ~ accounts payable / (COGS per day)",
    example:
      "If accounts payable is $300k and COGS is $3.6M per year ($9,863 per day), DPO is about 30 days.",
    bullets: [
      "Negotiate longer terms when appropriate, but protect reliability and trust with key vendors.",
      "Match payment terms to your collections cycle to reduce cash stress.",
      "Track DPO alongside DSO and DIO to monitor the cash conversion cycle.",
      "Watch for early-pay discounts that can outperform holding cash.",
    ],
    mistakes: [
      "Pushing terms too far and creating hidden costs (supply risk, penalties, lower service levels).",
      "Comparing DPO across periods without adjusting for seasonality in COGS.",
    ],
    faqs: [
      {
        question: "Is higher DPO always better-",
        answer:
          "Not always. Higher DPO can improve cash timing, but it can also reduce vendor priority or pricing. Balance cash benefits with supply reliability.",
      },
    ],
    relatedGuideSlugs: ["cash-conversion-cycle-guide"],
  },
  {
    slug: "billings",
    title: "Billings",
    description:
      "Billings are amounts invoiced in a period. Billings can differ from cash collected and recognized revenue due to timing.",
    example:
      "You invoice $120k annual contracts in Q1; billings are $120k even if revenue is recognized monthly.",
    bullets: [
      "Billings are useful for sales execution and collections tracking.",
      "Compare billings to deferred revenue to see cash timing shifts.",
      "Keep billings definitions consistent (include or exclude one-time fees).",
    ],
    mistakes: [
      "Using billings as a proxy for revenue in SaaS reporting.",
      "Mixing billings and bookings in the same metric without clarity.",
    ],
    faqs: [
      {
        question: "Are billings the same as cash receipts-",
        answer:
          "No. Billings are invoices issued, while cash receipts are money collected. Timing differences can be significant.",
      },
    ],
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
    example:
      "A $12,000 annual SaaS contract is recognized as about $1,000 per month.",
    bullets: [
      "Recognition follows delivery or service over time, not payment timing.",
      "Annual prepay increases cash but revenue is recognized ratably.",
      "Track recognized revenue to compare performance across periods.",
      "Reconcile recognized revenue to deferred revenue rollforward.",
      "Align revenue recognition with performance obligations and contract terms.",
      "Separate recurring and non-recurring revenue for cleaner trend analysis.",
    ],
    mistakes: [
      "Using billings or cash receipts as a proxy for revenue.",
      "Comparing recognized revenue across periods without consistent deferrals.",
      "Including one-time items in recurring revenue without disclosure.",
      "Changing recognition policies without re-baselining historical metrics.",
    ],
    faqs: [
      {
        question: "Why does recognized revenue matter for SaaS metrics-",
        answer:
          "It reflects delivered value and keeps margin and growth analysis consistent across billing terms.",
      },
      {
        question: "How does recognized revenue affect ARR reporting-",
        answer:
          "ARR is a run-rate metric; recognized revenue is actual delivered revenue. Use both, but do not mix them in the same trend without labels.",
      },
    ],
    relatedGuideSlugs: ["deferred-revenue-guide"],
    relatedCalculatorSlugs: ["deferred-revenue-rollforward-calculator"],
  },
  {
    slug: "deferred-revenue",
    title: "Deferred Revenue",
    description:
      "Deferred revenue is a liability representing cash collected (or billed) for services not yet delivered. It becomes recognized revenue over time as you deliver.",
    formula: "Ending deferred revenue = beginning deferred revenue + billings - recognized revenue",
    example:
      "A $12,000 annual contract paid upfront creates $12,000 deferred revenue that is recognized monthly.",
    bullets: [
      "Annual prepay increases deferred revenue up front.",
      "Deferred revenue declines as revenue is recognized.",
      "Track deferred revenue rollforward to validate recognition.",
      "Large deferred balances can signal strong cash collection but also delivery obligations.",
      "Split current vs long-term deferred revenue for better liquidity analysis.",
    ],
    mistakes: [
      "Treating deferred revenue as profit instead of a liability.",
      "Ignoring deferred revenue changes when analyzing cash vs revenue.",
      "Failing to reconcile billings, collections, and recognition schedules.",
    ],
    faqs: [
      {
        question: "Why does deferred revenue matter for SaaS metrics-",
        answer:
          "It shows the gap between cash collected and revenue recognized, which affects runway and growth analysis.",
      },
      {
        question: "Does deferred revenue equal future revenue-",
        answer:
          "Not always. It represents obligations to deliver; refunds, downgrades, or non-renewals can reduce the eventual recognized revenue.",
      },
    ],
    relatedGuideSlugs: ["deferred-revenue-guide"],
    relatedCalculatorSlugs: ["deferred-revenue-rollforward-calculator"],
  },
  {
    slug: "revenue-recognition",
    title: "Revenue Recognition",
    description:
      "Revenue recognition is the accounting process of recording revenue when earned (delivered), not necessarily when billed or collected.",
    example:
      "If a customer prepays $24,000 for 12 months, you recognize about $2,000 per month as revenue.",
    bullets: [
      "Accrual accounting recognizes revenue as performance obligations are met.",
      "Cash collection timing can differ from revenue recognition timing.",
      "For SaaS, revenue is often recognized ratably over the contract term.",
      "Document recognition policies so metrics remain comparable over time.",
      "Use deferred revenue schedules to validate recognition math.",
      "Separate one-time setup fees from recurring revenue for cleaner trends.",
      "Align recognition schedules with contract start dates and service periods.",
    ],
    mistakes: [
      "Using cash receipts as a proxy for revenue in SaaS reporting.",
      "Mixing bookings, billings, and revenue in the same report.",
      "Ignoring deferrals and refunds that affect recognized revenue.",
      "Changing recognition rules without re-baselining reports.",
      "Recognizing revenue before delivery milestones are met.",
      "Applying revenue recognition rules inconsistently across segments.",
    ],
    faqs: [
      {
        question: "Is revenue recognition the same as billings-",
        answer:
          "No. Billings reflect invoices issued, while revenue recognition reflects when the service is delivered. They can differ materially with annual prepay or multi-year contracts.",
      },
      {
        question: "Why does revenue recognition matter for SaaS metrics-",
        answer:
          "It ensures revenue reflects delivered value, which keeps margins, growth rates, and retention analysis consistent over time.",
      },
      {
        question: "How should I handle refunds in recognition-",
        answer:
          "Adjust recognized revenue and deferred revenue schedules to reflect refunds so revenue reflects delivered value net of reversals.",
      },
    ],
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
    formula: "Operating margin = operating income / revenue",
  },
  {
    slug: "ebitda",
    title: "EBITDA",
    description:
      "EBITDA approximates operating profit before interest, taxes, depreciation, and amortization. It is not the same as cash flow.",
    formula: "EBITDA = operating income + depreciation + amortization",
    example:
      "If operating profit is $2M and depreciation/amortization is $300k, EBITDA is about $2.3M.",
    bullets: [
      "EBITDA is useful for comparing operating performance across firms.",
      "It excludes capital intensity and working capital timing effects.",
      "Use EBITDA margin to compare profitability across different revenue scales.",
      "Pair EBITDA with cash flow to avoid overstating performance.",
    ],
    mistakes: [
      "Treating EBITDA as cash flow (working capital and CapEx matter).",
      "Ignoring stock-based compensation and other non-cash costs when they are material.",
      "Using EBITDA without noting revenue recognition or capitalization policies.",
    ],
    faqs: [
      {
        question: "Why do lenders care about EBITDA-",
        answer:
          "It is a proxy for operating earnings used in leverage and coverage ratios, even though it is not cash flow.",
      },
      {
        question: "Can EBITDA be negative while cash flow is positive-",
        answer:
          "Yes. Large collections, deferred revenue, or working capital shifts can make cash flow positive even when EBITDA is negative.",
      },
    ],
  },
  {
    slug: "free-cash-flow",
    title: "Free Cash Flow (FCF)",
    description:
      "Free cash flow is cash generated by operations minus capital expenditures. FCF is a key measure of financial sustainability.",
    formula: "Free cash flow = operating cash flow - capital expenditures",
    example:
      "If operating cash flow is $1.2M and capex is $300k, free cash flow is $900k.",
    bullets: [
      "Use FCF to compare how efficiently revenue turns into cash.",
      "Negative FCF is common during growth, but trend and drivers should be clear.",
      "Separate maintenance capex from growth capex when evaluating durability.",
    ],
    mistakes: [
      "Treating EBITDA as a proxy for FCF without adjusting for working capital.",
      "Ignoring seasonality in collections that swings operating cash flow.",
    ],
    faqs: [
      {
        question: "Is free cash flow the same as profit-",
        answer:
          "No. Profit is an accounting measure; free cash flow reflects actual cash generated after capital spending and working capital changes.",
      },
    ],
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
    formula: "PV = sum  cash_flow_t / (1 + r)^t",
    example:
      "If r = 10%, $100 received in 1 year is worth about $100 / 1.10 = $90.91 today.",
    bullets: [
      "Use a discount rate consistent with risk (higher risk -> higher required return).",
      "For business valuation, WACC is a common starting point (then run sensitivity).",
      "For project evaluation, use a hurdle rate / MARR aligned to opportunity cost.",
    ],
    mistakes: [
      "Using a single-point discount rate without scenario testing.",
      "Mixing nominal and real cash flows (adjust for inflation consistently).",
    ],
    faqs: [
      {
        question: "Discount rate vs interest rate: what's the difference-",
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
    formula: "NPV = sum  cash_flow_t / (1 + r)^t - initial investment",
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
        question: "If NPV is positive, should we always do the project-",
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
        question: "Why can IRR be misleading-",
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
    formula: "Payback period = time until cumulative cash flow >= initial investment",
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
        question: "Payback vs discounted payback: which should I use-",
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
    formula: "Operating leverage rises when fixed costs are high relative to variable costs",
    example:
      "If revenue grows 20% while fixed costs stay flat, operating profit can grow faster than revenue.",
    bullets: [
      "High operating leverage amplifies both upside and downside.",
      "Track contribution margin to understand how revenue scales into profit.",
      "Operating leverage improves as fixed costs are spread across more revenue.",
    ],
    mistakes: [
      "Assuming leverage is permanent despite rising support or infrastructure costs.",
      "Ignoring that pricing pressure can reduce leverage even as revenue grows.",
    ],
    faqs: [
      {
        question: "Is operating leverage always good-",
        answer:
          "It is powerful but risky. High fixed costs make downturns more painful, so balance leverage with cash runway and demand stability.",
      },
    ],
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
    title: "MARR (Minimum Acceptable Return)",
    description:
      "MARR is the minimum return threshold used to evaluate investments. It is often used as a hurdle rate in capital budgeting and NPV decisions.",
    updatedAt: "2026-01-28",
    bullets: [
      "Treat MARR as your opportunity cost and risk threshold.",
      "Use the same MARR when comparing comparable-risk projects; adjust MARR when risk differs.",
    ],
    mistakes: [
      "Using a single MARR for projects with very different risk profiles.",
      "Confusing MARR with IRR (MARR is your required threshold; IRR is a project's implied return).",
    ],
    faqs: [
      {
        question: "How is MARR different from WACC-",
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
      "Use pre-money and new investment to estimate investor ownership (investment / post-money).",
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
      "Investor ownership is often approximated as investment / post-money (simplified).",
      "Use a cap table to validate when option pool changes and convertibles are present.",
    ],
    mistakes: [
      "Assuming post-money always equals pre-money + investment without checking term details.",
      "Using post-money ownership numbers that aren't on a fully diluted basis.",
    ],
    relatedGuideSlugs: ["pre-money-post-money-guide"],
    relatedCalculatorSlugs: ["pre-money-post-money-calculator"],
  },
  {
    slug: "dilution",
    title: "Dilution",
    description:
      "Dilution is the reduction in an existing shareholder's ownership percentage when new shares are issued (new financing, option grants, or convertible conversions).",
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
    example:
      "If you own 5% and the company raises $10M, a simplified pro rata check is about $500k to maintain 5%.",
    bullets: [
      "A rough check-size estimate is current ownership % * round size (priced equity, simplified).",
      "Your ability to take pro rata can be limited by allocation and company discretion.",
      "Confirm whether pro rata applies to the full round or only to a portion.",
    ],
    mistakes: [
      "Assuming full pro rata is always available (many rounds are oversubscribed).",
      "Ignoring other dilution sources (option pool increases, SAFE/note conversions).",
      "Modeling pro rata without a fully diluted share count.",
    ],
    faqs: [
      {
        question: "Do all investors get pro rata rights-",
        answer:
          "No. Rights depend on the financing documents and sometimes require a minimum ownership threshold.",
      },
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
      "Cap price is often modeled as cap / fully diluted shares at conversion (simplified).",
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
    title: "SAFE (Future Equity)",
    description:
      "A SAFE is an instrument that typically converts into equity at a future priced round. It often includes a valuation cap, a discount, or both to reward early investors.",
    updatedAt: "2026-01-28",
    example:
      "A $500k SAFE with an $8M cap converts at the cap if the priced round is above $8M.",
    bullets: [
      "Conversion price is often the better (lower price) of cap vs discount (terms vary).",
      "Model conversion using fully diluted shares to avoid underestimating dilution.",
      "Understand post-money vs pre-money SAFE mechanics before modeling dilution.",
    ],
    mistakes: [
      "Ignoring post-money SAFE mechanics and MFN clauses (terms vary).",
      "Treating simplified math as legal truth without reconciling documents and cap table.",
      "Forgetting multiple SAFEs stack and compound dilution.",
    ],
    faqs: [
      {
        question: "Do SAFEs have interest or maturity-",
        answer:
          "No. SAFEs are not debt and typically do not accrue interest or have a maturity date, unlike convertible notes.",
      },
    ],
    relatedGuideSlugs: ["safe-guide"],
    relatedCalculatorSlugs: ["safe-conversion-calculator"],
  },
  {
    slug: "convertible-note",
    title: "Convertible Note",
    description:
      "A convertible note is debt that typically converts into equity at a future priced round. It often includes an interest rate, a maturity date, and cap/discount conversion terms.",
    example:
      "A $500k note at 6% interest converts at the better of an $8M cap or 20% discount in the next round.",
    bullets: [
      "Conversion amount may include accrued interest (terms vary).",
      "Conversion price may be set by valuation cap, discount, or round price (terms vary).",
      "Maturity terms can trigger repayment or conversion if no round happens.",
    ],
    mistakes: [
      "Modeling interest incorrectly (simple vs compounding; check the note).",
      "Ignoring stacked convertibles and option pool changes when estimating dilution.",
      "Assuming conversion is automatic without reading maturity clauses.",
    ],
    faqs: [
      {
        question: "How is a convertible note different from a SAFE-",
        answer:
          "Notes are debt with interest and maturity. SAFEs are not debt and usually do not accrue interest.",
      },
    ],
    relatedGuideSlugs: ["convertible-note-guide"],
    relatedCalculatorSlugs: ["convertible-note-conversion-calculator"],
  },
  {
    slug: "liquidation-preference",
    title: "Liquidation Preference",
    description:
      "Liquidation preference defines what preferred shareholders receive at an exit before common shareholders. A common structure is 1* non-participating preferred.",
    example:
      "In a $10M exit with $5M in preference, preferred holders take $5M first, and the remainder goes to common.",
    bullets: [
      "Non-participating preferred often takes the greater of preference payout or as-converted common payout.",
      "Multiple classes and seniority create a waterfall that requires a full model.",
      "Participation rights can materially change outcomes; model both cases.",
    ],
    mistakes: [
      "Ignoring stacked preferences and seniority across rounds.",
      "Confusing participating and non-participating preferred (very different outcomes).",
      "Using post-money ownership without modeling the preference stack.",
    ],
    faqs: [
      {
        question: "What does 1x non-participating mean-",
        answer:
          "Investors either take 1x their original investment or convert to common and take their ownership share, whichever is higher.",
      },
    ],
    relatedGuideSlugs: ["liquidation-preference-guide"],
    relatedCalculatorSlugs: ["liquidation-preference-calculator"],
  },
];

export const termsFinance: GlossaryTerm[] = seeds.map(make);
