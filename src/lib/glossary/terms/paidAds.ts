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
    category: "paid-ads",
    updatedAt: seed.updatedAt ?? "2026-01-23",
    sections: sectionsFor(seed),
    faqs: seed.faqs,
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "ab-test",
    title: "A/B Test",
    description:
      "An A/B test compares two variants (A and B) to measure whether a change improves an outcome (e.g., conversion rate).",
    bullets: [
      "Define a primary metric and a fixed test duration/sample size before starting.",
      "Avoid peeking and stopping early based on noisy intermediate results.",
    ],
    relatedGuideSlugs: ["ab-test-sample-size-guide"],
    relatedCalculatorSlugs: ["ab-test-sample-size-calculator"],
  },
  {
    slug: "statistical-significance",
    title: "Statistical Significance",
    description:
      "Statistical significance is a measure of whether an observed effect is likely to be real rather than due to random chance under a chosen false positive rate (alpha).",
    bullets: [
      "A statistically significant result is not automatically a practically meaningful result.",
      "Avoid repeated peeking; it inflates false positives unless you use sequential methods.",
    ],
    relatedGuideSlugs: ["ab-test-sample-size-guide"],
    relatedCalculatorSlugs: ["ab-test-sample-size-calculator"],
  },
  {
    slug: "power",
    title: "Statistical Power",
    description:
      "Statistical power is the probability of detecting an effect of a given size if it truly exists (1 - beta). Higher power requires larger sample sizes.",
    relatedGuideSlugs: ["ab-test-sample-size-guide"],
    relatedCalculatorSlugs: ["ab-test-sample-size-calculator"],
  },
  {
    slug: "mde",
    title: "Minimum Detectable Effect (MDE)",
    description:
      "MDE is the smallest effect size you want your experiment to reliably detect. Smaller MDE requires much larger samples.",
    bullets: [
      "Choose an MDE that is both realistic and action-worthy.",
      "Use absolute percentage points for conversion rates to avoid confusion.",
    ],
    relatedGuideSlugs: ["ab-test-sample-size-guide"],
    relatedCalculatorSlugs: ["ab-test-sample-size-calculator"],
  },
  {
    slug: "cpl",
    title: "CPL (Cost Per Lead)",
    description:
      "CPL is ad spend divided by leads generated. CPL is a top-of-funnel metric and should be connected to paying-customer outcomes (CAC).",
    formula: "CPL = ad spend / leads",
    mistakes: [
      "Optimizing CPL and destroying lead quality (CAC rises).",
      "Changing lead definitions (MQL/SQL drift) and breaking comparisons.",
    ],
    relatedGuideSlugs: ["cpl-to-cac-guide"],
    relatedCalculatorSlugs: ["cpl-to-cac-calculator"],
  },
  {
    slug: "lead-to-customer-rate",
    title: "Lead-to-customer Rate",
    description:
      "Lead-to-customer rate is the % of leads that become paying customers over a defined time window. It is a key bridge from CPL to CAC.",
    formula: "Lead-to-customer rate = customers / leads",
    relatedGuideSlugs: ["cpl-to-cac-guide"],
    relatedCalculatorSlugs: ["cpl-to-cac-calculator"],
  },
  {
    slug: "cpa",
    title: "CPA (Cost Per Acquisition)",
    description:
      "CPA is ad spend divided by conversions (purchase, signup, lead). It's a tactical metric; CAC usually refers to cost per new paying customer including broader costs.",
    formula: "CPA = ad spend / conversions",
    mistakes: [
      "Calling lead CPA 'CAC' (different denominators).",
      "Comparing CPA across campaigns with different conversion definitions.",
      "Ignoring downstream quality (refunds, churn, LTV).",
    ],
    relatedGuideSlugs: ["target-cpa-guide", "paid-ads-funnel-guide"],
    relatedCalculatorSlugs: ["target-cpa-ltv-calculator", "paid-ads-funnel-calculator"],
  },
  {
    slug: "cpc",
    title: "CPC (Cost Per Click)",
    description: "CPC measures how much you pay for each click on your ads.",
    formula: "CPC = ad spend / clicks",
    example:
      "If you spent $1,000 and got 800 clicks, CPC = $1,000 / 800 = $1.25.",
    bullets: [
      "Use CPC with CTR and CVR to locate bottlenecks (creative vs landing page).",
      "Compare CPC within similar audiences and placements.",
    ],
    mistakes: [
      "Comparing CPC across placements with very different intent (e.g., prospecting vs retargeting).",
      "Optimizing CPC without checking CPA and contribution margin (profit).",
    ],
    faqs: [
      {
        question: "How is CPC related to CPM and CTR?",
        answer:
          "When CTR is a fraction (not percent), CPC ~ CPM / (1000 * CTR). Higher CTR usually lowers CPC for a given CPM.",
      },
      {
        question: "Should I always optimize for lower CPC?",
        answer:
          "No. Lower CPC can come from lower-intent clicks that convert poorly, increasing CPA and reducing profit.",
      },
    ],
    relatedGuideSlugs: ["max-cpc-guide", "paid-ads-funnel-guide"],
    relatedCalculatorSlugs: ["max-cpc-calculator", "paid-ads-funnel-calculator"],
  },
  {
    slug: "cpm",
    title: "CPM (Cost Per Mille)",
    description:
      "CPM is the cost per 1,000 impressions. It varies by audience, placement, seasonality, and competition.",
    formula: "CPM = (ad spend / impressions) * 1000",
    example:
      "If you spent $1,200 for 100,000 impressions, CPM = ($1,200 / 100,000) * 1000 = $12.",
    bullets: [
      "Use CPM with CTR to estimate CPC, then with CVR to estimate CPA.",
      "Judge CPM against your economics, not as a standalone KPI.",
    ],
    faqs: [
      {
        question: "Is a high CPM always bad?",
        answer:
          "Not necessarily. High CPM can be normal in competitive auctions or premium audiences. What matters is the full funnel: CPM -> CTR -> CVR -> CPA/ROAS.",
      },
      {
        question: "Why does CPM fluctuate so much?",
        answer:
          "CPM changes with auction pressure (seasonality), audience size, placement mix, and creative relevance.",
      },
    ],
    relatedGuideSlugs: ["break-even-cpm-guide", "paid-ads-funnel-guide"],
    relatedCalculatorSlugs: ["break-even-cpm-calculator", "paid-ads-funnel-calculator"],
  },
  {
    slug: "max-cpc",
    title: "Max CPC",
    description:
      "Max CPC is the maximum cost per click you can pay while still meeting your unit economics target (break-even or with a profit buffer).",
    bullets: [
      "Compute max CPC from target CPA and click-to-conversion rate (CVR): max CPC = target CPA * CVR.",
      "Use contribution margin (not revenue) to avoid overstating allowable spend.",
    ],
    example:
      "If target CPA is $40 and click-based CVR is 2.5% (0.025), then max CPC = $40 * 0.025 = $1.00.",
    mistakes: [
      "Mixing session-based CVR with click-based CPC (denominator mismatch).",
      "Using short-window attribution without validating incrementality at scale.",
    ],
    faqs: [
      {
        question: "Should max CPC use click-based or session-based CVR?",
        answer:
          "Use click-based CVR if possible (conversions / clicks). If you only have session-based CVR, treat the result as a rough estimate and validate with real performance.",
      },
      {
        question: "Why add a profit buffer instead of using break-even?",
        answer:
          "Break-even leaves no room for noise, returns, attribution error, or overhead. A buffer makes bidding more robust.",
      },
    ],
    relatedGuideSlugs: ["max-cpc-guide"],
    relatedCalculatorSlugs: ["max-cpc-calculator"],
  },
  {
    slug: "break-even-cpm",
    title: "Break-even CPM",
    description:
      "Break-even CPM is the maximum cost per 1,000 impressions you can pay while still breaking even on variable economics at your CTR, CVR, and contribution margin.",
    bullets: [
      "Break-even CPM increases with CTR, CVR, AOV, and margin.",
      "Use a buffer; break-even is fragile under noise and attribution error.",
    ],
    relatedGuideSlugs: ["break-even-cpm-guide", "break-even-ctr-guide"],
    relatedCalculatorSlugs: ["break-even-cpm-calculator", "break-even-ctr-calculator"],
  },
  {
    slug: "ctr",
    title: "CTR (Click-Through Rate)",
    description: "CTR is the fraction of impressions that become clicks.",
    formula: "CTR = clicks / impressions",
    example:
      "If you got 2,000 clicks from 100,000 impressions, CTR = 2,000 / 100,000 = 2%.",
    bullets: [
      "Use CTR as a creative-market fit signal, but validate conversion quality and profit.",
      "Compare CTR within similar placements and objectives (feed vs search behave differently).",
    ],
    mistakes: [
      "Optimizing CTR alone (without conversion quality).",
      "Comparing CTR across very different placements (feed vs search).",
    ],
    faqs: [
      {
        question: "Does a higher CTR always mean better performance?",
        answer:
          "Not always. High CTR can come from curiosity clicks that don't convert. Always check CVR, CPA, and profit.",
      },
      {
        question: "How do I use break-even CTR?",
        answer:
          "Break-even CTR tells you the minimum CTR needed to hit a profitability target given CPM, CVR, and economics. It's a good creative-quality target for a placement mix.",
      },
    ],
    relatedGuideSlugs: ["break-even-ctr-guide", "paid-ads-funnel-guide"],
    relatedCalculatorSlugs: ["break-even-ctr-calculator", "paid-ads-funnel-calculator"],
  },
  {
    slug: "cvr",
    title: "CVR (Conversion Rate)",
    description:
      "Conversion rate measures the % of visitors who complete an action. In ads it's often conversions / clicks; on-site it can be conversions / sessions.",
    formula: "CVR = conversions / clicks (or sessions)",
    example:
      "If you had 50 purchases from 2,000 clicks, click-based CVR = 50 / 2,000 = 2.5%.",
    bullets: [
      "Use click-based CVR when you're bidding on clicks (CPC).",
      "Use session-based CVR when you're optimizing landing pages and on-site funnels.",
    ],
    mistakes: [
      "Mixing click-based and session-based CVR.",
      "Optimizing CVR by narrowing targeting and losing scale.",
    ],
    faqs: [
      {
        question: "Why does CVR drop when I scale spend?",
        answer:
          "Scaling often broadens audiences/placements (lower intent). CVR can also drop from creative mismatch, landing-page friction, or offer fatigue.",
      },
      {
        question: "What's a good CVR?",
        answer:
          "It depends on intent and offer. Compare CVR within the same funnel and traffic type rather than chasing a universal benchmark.",
      },
    ],
    relatedGuideSlugs: ["break-even-cvr-guide", "paid-ads-funnel-guide"],
    relatedCalculatorSlugs: ["break-even-cvr-calculator", "paid-ads-funnel-calculator"],
  },
  {
    slug: "aov",
    title: "AOV (Average Order Value)",
    description:
      "AOV measures the average revenue per order. It affects your allowable CPA at a given margin.",
    formula: "AOV = revenue / orders",
    example:
      "If you had $40,000 of revenue from 500 orders, AOV = $40,000 / 500 = $80.",
    bullets: [
      "Use AOV with gross margin to estimate contribution per order.",
      "Track AOV by channel and campaign (intent differs).",
    ],
    mistakes: [
      "Using AOV without accounting for refunds/returns (net revenue can be lower).",
      "Comparing AOV across channels with very different product mixes.",
    ],
    faqs: [
      {
        question: "How do I use AOV to set a target CPA?",
        answer:
          "AOV and contribution margin determine how much profit you have per order. Target CPA should be below profit per conversion (and usually below break-even to include a buffer).",
      },
    ],
  },
  {
    slug: "break-even-roas",
    title: "Break-even ROAS",
    description:
      "Break-even ROAS is the minimum ROAS needed to avoid losing money after variable costs (and optionally fixed costs / target profit).",
    bullets: [
      "Use break-even ROAS when margins, fees, shipping, and returns materially affect profitability.",
      "Set separate targets by channel and product because cost structures differ.",
    ],
    relatedGuideSlugs: ["break-even-roas-guide"],
    relatedCalculatorSlugs: ["break-even-roas-calculator"],
  },
  {
    slug: "target-roas",
    title: "Target ROAS",
    description:
      "Target ROAS is the ROAS you aim for to achieve a desired profit buffer after variable costs and fixed cost allocation.",
    relatedGuideSlugs: ["target-roas-guide"],
    relatedCalculatorSlugs: ["target-roas-calculator"],
  },
  {
    slug: "mer",
    title: "MER (Marketing Efficiency Ratio)",
    description:
      "MER (also called blended ROAS) is total revenue divided by total marketing spend over the same period. It's useful for top-down health checks.",
    formula: "MER = total revenue / total marketing spend",
    example:
      "If total revenue is $500k and total marketing spend is $100k, MER = $500k / $100k = 5.0.",
    mistakes: [
      "Using MER alone to optimize channel budgets (it hides what's working).",
      "Not adjusting for seasonality, promos, and pricing changes.",
    ],
    faqs: [
      {
        question: "MER vs ROAS: what's the difference?",
        answer:
          "ROAS is usually channel/campaign-level. MER is top-down across all marketing spend and reduces attribution noise, but it hides what's working.",
      },
      {
        question: "What should count as marketing spend in MER?",
        answer:
          "Be consistent. Many teams include paid media and variable acquisition costs; some include marketing headcount. The key is to keep the definition stable over time.",
      },
    ],
    relatedGuideSlugs: ["mer-guide"],
    relatedCalculatorSlugs: ["mer-calculator"],
  },
  {
    slug: "blended-roas",
    title: "Blended ROAS",
    description:
      "Blended ROAS is revenue divided by total ad spend across channels. It reduces attribution noise but hides channel-level performance.",
    formula: "Blended ROAS = total revenue / total ad spend",
    bullets: [
      "Use blended ROAS to align finance and marketing on top-down health.",
      "Use channel ROAS to optimize allocation within a blended target.",
    ],
    mistakes: [
      "Using blended ROAS to scale a single channel (it can hide weak channels).",
      "Comparing periods with different attribution windows or delayed revenue recognition.",
    ],
    faqs: [
      {
        question: "Is blended ROAS the same as MER?",
        answer:
          "They're often used similarly. MER is typically revenue / total marketing spend, while blended ROAS is usually revenue / total ad spend.",
      },
      {
        question: "Can blended ROAS still be misleading?",
        answer:
          "Yes. It can hide mix shifts (prospecting vs retargeting) and doesn't prove incrementality. Use experiments for causal truth when needed.",
      },
    ],
  },
  {
    slug: "attribution",
    title: "Attribution",
    description:
      "Attribution is the method used to assign credit for conversions to channels, campaigns, and touchpoints.",
    example:
      "In last-click attribution, 100% of credit goes to the final touchpoint. In multi-touch attribution, credit is split across touchpoints.",
    bullets: [
      "Define attribution consistently before comparing ROAS/CPA across channels.",
      "Use incrementality tests when possible to estimate true lift.",
    ],
    mistakes: [
      "Treating attribution as causal truth (it's model-based credit).",
      "Comparing channels with different windows and tracking coverage as if the numbers are comparable.",
    ],
    faqs: [
      {
        question: "Is attribution the same as incrementality?",
        answer:
          "No. Attribution assigns credit; incrementality estimates causal lift (what ads caused). Incrementality is best measured via experiments.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "attribution-window",
    title: "Attribution Window",
    description:
      "Attribution window is the time period after an ad interaction during which conversions are credited to that ad.",
    example:
      "A 7-day click window credits conversions that happen within 7 days after a click. A 1-day view window credits conversions within 24 hours after an impression.",
    bullets: [
      "Keep attribution windows consistent when comparing ROAS/CPA over time.",
      "Choose windows that match your purchase cycle; short windows can under-credit longer-cycle products.",
    ],
    mistakes: [
      "Comparing ROAS across platforms with different default windows.",
      "Shortening windows and concluding performance dropped when it is just timing.",
    ],
    faqs: [
      {
        question: "Should I use click-through or view-through attribution?",
        answer:
          "Click-through is usually less noisy. View-through can add insight for upper-funnel, but it's easier to over-credit. Validate with incrementality tests at scale.",
      },
      {
        question: "What window should I pick?",
        answer:
          "Pick one that matches your decision cycle and keep it stable. If you change windows, annotate reporting and avoid comparing across the change.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-funnel-guide", "incrementality-guide"],
  },
  {
    slug: "last-click-attribution",
    title: "Last-click Attribution",
    description:
      "Last-click attribution assigns 100% of conversion credit to the final touchpoint before conversion.",
    bullets: [
      "Last-click is simple and often actionable, but it under-credits demand creation.",
      "Use it for clarity, then validate major budget decisions with incrementality tests.",
    ],
    mistakes: [
      "Under-crediting upper-funnel channels that create demand.",
      "Over-crediting branded search for conversions driven by other channels.",
    ],
    faqs: [
      {
        question: "When is last-click attribution useful?",
        answer:
          "When you want a consistent, easy-to-explain model for day-to-day optimization. It's less reliable for long purchase cycles or multi-touch journeys.",
      },
    ],
  },
  {
    slug: "multi-touch-attribution",
    title: "Multi-touch Attribution (MTA)",
    description:
      "Multi-touch attribution spreads conversion credit across multiple touchpoints (first, last, and middle touches).",
    bullets: [
      "MTA can improve visibility into upper-funnel touches versus last-click.",
      "It's still attribution, not causality; validate with experiments for big bets.",
    ],
    mistakes: [
      "Assuming MTA is incrementality (it is still model-based attribution).",
      "Using complex models without validating against experiments.",
    ],
    faqs: [
      {
        question: "Does MTA prove that a channel is incremental?",
        answer:
          "No. It redistributes credit but doesn't prove causality. Use holdouts/geo tests to estimate true lift.",
      },
    ],
  },
  {
    slug: "incrementality",
    title: "Incrementality",
    description:
      "Incrementality estimates the conversions that would not have happened without ads (true lift).",
    example:
      "If the exposed group converts at 5.0% and the holdout group converts at 4.6%, incremental lift is 0.4 percentage points (about 8.7% relative lift).",
    bullets: [
      "Use holdouts or geo-experiments to estimate incremental lift.",
      "Be careful with short tests when purchase cycles are long.",
    ],
    mistakes: [
      "Treating attribution as causal truth (it's model-based credit).",
      "Running tests without clean holdouts (contamination breaks results).",
    ],
    faqs: [
      {
        question: "Is incrementality the same as attribution?",
        answer:
          "No. Attribution assigns credit; incrementality estimates causal lift (what ads caused). Incrementality is best measured with experiments.",
      },
      {
        question: "When should we run incrementality tests?",
        answer:
          "When spend is meaningful and you suspect attribution bias (retargeting disputes, diminishing returns, or channel credit conflicts).",
      },
    ],
    relatedGuideSlugs: ["incrementality-guide", "incrementality-lift-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "holdout-test",
    title: "Holdout Test",
    description:
      "A holdout test withholds ads from a control group and compares outcomes to measure incremental lift.",
    bullets: [
      "Define the holdout population and prevent spillover (contamination).",
      "Run long enough to cover your purchase cycle and seasonality effects.",
    ],
    mistakes: [
      "Peeking early and stopping on noise.",
      "Letting the holdout get exposed via other campaigns (invalidates the test).",
    ],
    relatedGuideSlugs: ["incrementality-lift-guide", "incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "marginal-roas",
    title: "Marginal ROAS",
    description:
      "Marginal ROAS is the incremental revenue generated by the next unit of ad spend. It is the metric you want for scaling decisions under diminishing returns.",
    formula: "Marginal ROAS = incremental revenue / incremental ad spend",
    example:
      "If an extra $10k of spend generates $25k of incremental revenue, marginal ROAS = $25k / $10k = 2.5.",
    bullets: [
      "Use marginal ROAS (or incremental profit) to decide when to scale or cut spend.",
      "Average ROAS can remain high even when marginal ROAS falls below break-even.",
      "Marginal ROAS is best estimated from experiments or response curves, not attribution alone.",
    ],
    mistakes: [
      "Scaling based on average ROAS rather than marginal profit.",
      "Ignoring margin/variable costs (revenue-only ROAS can mislead).",
    ],
    faqs: [
      {
        question: "What's the difference between average ROAS and marginal ROAS?",
        answer:
          "Average ROAS looks at total revenue / total spend. Marginal ROAS looks at what the next dollars of spend generate. Scaling decisions should use marginal ROAS (or incremental profit).",
      },
      {
        question: "How do we estimate marginal ROAS?",
        answer:
          "Best case: experiments (holdouts) or response curves. Attribution-only estimates can be biased, especially with retargeting overlap.",
      },
    ],
    relatedGuideSlugs: ["marginal-roas-guide"],
    relatedCalculatorSlugs: ["marginal-roas-calculator"],
  },
  {
    slug: "diminishing-returns",
    title: "Diminishing Returns (ads)",
    description:
      "Diminishing returns means each additional dollar of spend produces less incremental revenue than the previous dollar, often due to audience saturation and creative fatigue.",
    bullets: [
      "Expect marginal ROAS to decline as you scale spend.",
      "Segment curves by channel/audience; saturation happens at different levels.",
    ],
    mistakes: [
      "Assuming performance scales linearly with spend.",
      "Treating short-term volatility as a structural saturation signal (insufficient data).",
    ],
    relatedGuideSlugs: ["marginal-roas-guide"],
    relatedCalculatorSlugs: ["marginal-roas-calculator"],
  },
  {
    slug: "geo-test",
    title: "Geo Experiment",
    description:
      "A geo experiment measures lift by varying spend across regions and comparing outcomes against controls.",
    bullets: [
      "Use geo tests when user-level holdouts aren't feasible (e.g., offline or privacy constraints).",
      "Ensure regions are comparable and avoid cross-region spillover.",
    ],
    mistakes: [
      "Using too few regions (low power) and over-interpreting noise.",
      "Changing major campaigns mid-test (confounds).",
    ],
    relatedGuideSlugs: ["incrementality-guide", "incrementality-lift-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "pixel",
    title: "Tracking Pixel",
    description:
      "A tracking pixel is a snippet that records events (page views, purchases) for measurement and optimization in ad platforms.",
    bullets: [
      "Validate key events (view content, add to cart, purchase) after releases.",
      "Validate event firing after every site change (especially checkout).",
      "Deduplicate events (client + server) to avoid inflated conversion counts.",
      "Prefer server-side signals where possible to reduce loss from blockers.",
    ],
    mistakes: [
      "Duplicate firing (inflates conversions).",
      "Not validating events after site changes (breaks optimization).",
    ],
    faqs: [
      {
        question: "Why do conversions drop after a site release?",
        answer:
          "Often because events stopped firing or are double-counted then filtered. Always run an end-to-end event validation after changes to checkout and routing.",
      },
    ],
  },
  {
    slug: "utm-parameters",
    title: "UTM Parameters",
    description:
      "UTM parameters are URL tags (source/medium/campaign) used to track traffic in analytics tools.",
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
    bullets: [
      "Use consistent naming (lowercase, stable conventions).",
      "Avoid tagging internal links to prevent attribution pollution.",
    ],
    faqs: [
      {
        question: "Do UTMs affect SEO?",
        answer:
          "They shouldn't if you handle canonicals correctly. UTMs can create duplicate URLs, so canonical URLs should point to the clean version without query parameters.",
      },
    ],
  },
  {
    slug: "ga4",
    title: "GA4 (Google Analytics 4)",
    description:
      "GA4 is Google's analytics platform for web and app measurement. In paid ads workflows, GA4 is often used for consistent cross-channel reporting (but it can undercount due to privacy and cross-device gaps).",
    bullets: [
      "Use GA4 for consistent channel trends; use platforms for optimization, and reconcile with MER and incrementality tests.",
      "Validate that conversion events fire once (dedupe pixel + server events if you use both).",
      "Be explicit about attribution model and lookback windows when comparing reports.",
    ],
    mistakes: [
      "Treating GA4 as perfect truth in privacy-heavy environments (it will miss conversions).",
      "Comparing GA4 and platform dashboards without aligning windows and definitions.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "conversion",
    title: "Conversion",
    description:
      "A conversion is an action you care about (purchase, signup, lead, subscription) that you measure and optimize toward.",
    bullets: [
      "Define conversions with clear eligibility (new vs returning users) and a time window.",
      "Audit conversion tracking after site releases and checkout changes.",
      "Keep platform and analytics conversion definitions consistent where possible.",
    ],
    mistakes: [
      "Changing conversion definitions mid-stream and breaking trend comparisons.",
      "Counting duplicate events (inflates performance and misleads bidding).",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "frequency",
    title: "Frequency",
    description:
      "Frequency is the average number of times a person sees your ad in a period. High frequency can cause fatigue.",
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
    formula: "Frequency = impressions / reach",
    bullets: [
      "Watch frequency and CTR together; rising frequency with falling CTR can signal fatigue.",
      "Optimal frequency depends on offer, audience size, and creative variety.",
    ],
    faqs: [
      {
        question: "What frequency is too high?",
        answer:
          "There's no universal number. If frequency rises and CTR/CVR fall, that's a practical signal to refresh creative, expand audiences, or cap spend.",
      },
    ],
  },
  {
    slug: "frequency-cap",
    title: "Frequency Cap",
    description:
      "A frequency cap limits how often a person can see your ad in a time window (per day/week). It's used to reduce fatigue and wasted impressions in saturated audiences.",
    bullets: [
      "Use caps when frequency rises and CTR/CVR decay, especially in small audiences.",
      "Combine caps with audience expansion and creative refresh to avoid simply throttling delivery.",
      "Retargeting can tolerate higher frequency than prospecting; cap by funnel stage.",
    ],
    mistakes: [
      "Capping too aggressively and starving delivery (performance can look 'stable' but volume collapses).",
      "Using a cap instead of fixing the root cause (creative/offer mismatch or a too-narrow audience).",
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
  },
  {
    slug: "reach",
    title: "Reach",
    description:
      "Reach is the number of unique people who saw your ads over a period.",
    bullets: [
      "Use reach with frequency to understand how saturated an audience is.",
      "High reach with low frequency usually means you still have room to scale.",
    ],
  },
  {
    slug: "impressions",
    title: "Impressions",
    description:
      "Impressions count how many times your ads were shown (not unique people).",
    bullets: [
      "Impressions = reach * frequency (approximately, within a time window).",
      "Use impressions with CPM to estimate spend: spend ~ impressions/1000 * CPM.",
    ],
  },
  {
    slug: "landing-page",
    title: "Landing Page",
    description:
      "A landing page is the page users arrive on after clicking an ad. Landing page quality strongly affects CVR and CPA.",
    bullets: [
      "Match the ad promise: the first screen should confirm intent and offer.",
      "Remove friction: speed, fewer fields, clear CTA, trust signals.",
      "Segment landing pages by intent (prospecting vs retargeting).",
    ],
    mistakes: [
      "Sending all traffic to one generic page (intent mismatch).",
      "Optimizing CVR with dark patterns that increase refunds or churn.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "creative-fatigue",
    title: "Creative Fatigue",
    description:
      "Creative fatigue happens when performance declines because the audience has seen the same creatives too many times.",
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
    bullets: [
      "Monitor frequency and CTR trends to detect fatigue.",
      "Rotate creatives and refresh offers to maintain performance.",
    ],
    mistakes: [
      "Refreshing creative without changing the underlying message/offer (fatigue returns quickly).",
      "Blaming fatigue when the real issue is landing-page or pricing changes.",
    ],
    faqs: [
      {
        question: "How do I know if it's creative fatigue or audience saturation?",
        answer:
          "Fatigue often shows up as CTR decline at stable CPM, while saturation shows falling marginal returns as you scale. They can overlap, so test new creative and new audiences separately.",
      },
    ],
  },
  {
    slug: "retargeting",
    title: "Retargeting",
    description:
      "Retargeting targets users who previously visited or engaged. It often has higher ROAS but can be heavily attribution-biased.",
    mistakes: [
      "Over-crediting retargeting without incrementality checks.",
      "Excess frequency causing annoyance and wasted spend.",
    ],
    faqs: [
      {
        question: "Why does retargeting look so good in ROAS dashboards?",
        answer:
          "Retargeting targets people already close to conversion and can get disproportionate attribution credit. Validate with incrementality when spend becomes meaningful.",
      },
    ],
  },
  {
    slug: "prospecting",
    title: "Prospecting",
    description:
      "Prospecting targets new audiences to acquire new customers. It typically has lower short-term ROAS but drives incremental growth.",
    bullets: [
      "Judge prospecting with longer windows and cohort outcomes (LTV, retention), not just short-window ROAS.",
      "Use creative testing to find message-market fit before scaling spend.",
    ],
  },
  {
    slug: "branded-search",
    title: "Branded Search",
    description:
      "Branded search refers to search campaigns targeting your brand terms. It often shows very high ROAS but can overlap with organic demand.",
    bullets: [
      "Branded search is often closer to demand capture than demand creation.",
      "Validate incrementality before scaling aggressively (organic cannibalization risk).",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "non-branded-search",
    title: "Non-branded Search",
    description:
      "Non-branded search targets generic queries. It can be more incremental but often has higher CPC and requires strong landing pages.",
    bullets: [
      "Use clear intent segmentation (problem-aware vs solution-aware queries).",
      "Landing page relevance and quality score can materially change CPC.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "quality-score",
    title: "Quality Score (search ads)",
    description:
      "Quality score is an estimate of ad/landing relevance and expected CTR used by some platforms. It can influence CPC and impression share.",
    bullets: [
      "Higher quality score often reduces CPC for the same position.",
      "Improve it by aligning keyword -> ad -> landing page intent and reducing bounce.",
    ],
    mistakes: [
      "Optimizing quality score while ignoring conversion quality and profit.",
      "Using one landing page for many intents (relevance suffers).",
    ],
  },
  {
    slug: "impression-share",
    title: "Impression Share",
    description:
      "Impression share is the % of times your ads were shown out of total eligible impressions (search).",
    bullets: [
      "Lost impression share usually comes from budget limits or low rank (bid/quality).",
      "Increase impression share only if marginal ROAS/profit supports it.",
    ],
    relatedGuideSlugs: ["marginal-roas-guide", "attribution-incrementality-guide"],
  },
  {
    slug: "cvr-funnel",
    title: "Click-to-conversion Funnel",
    description:
      "A simplified ad funnel: impressions -> clicks -> conversions. Use CPM/CTR/CVR to diagnose where efficiency is lost.",
    bullets: [
      "CPM drives cost per impression.",
      "CTR turns impressions into visits.",
      "CVR turns visits into outcomes; combine with AOV and margin for profit.",
    ],
  },
];

export const termsPaidAds: GlossaryTerm[] = seeds.map(make);
