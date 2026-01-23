import type { GlossarySection, GlossaryTerm } from "../types";

type Seed = {
  slug: string;
  title: string;
  description: string;
  formula?: string;
  example?: string;
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
    updatedAt: "2026-01-23",
    sections: sectionsFor(seed),
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "cpa",
    title: "CPA (Cost Per Acquisition)",
    description:
      "CPA is ad spend divided by conversions (purchase, signup, lead). It's a tactical metric; CAC usually refers to cost per new paying customer including broader costs.",
    formula: "CPA = ad spend ÷ conversions",
    mistakes: [
      "Calling lead CPA 'CAC' (different denominators).",
      "Comparing CPA across campaigns with different conversion definitions.",
      "Ignoring downstream quality (refunds, churn, LTV).",
    ],
  },
  {
    slug: "cpc",
    title: "CPC (Cost Per Click)",
    description: "CPC measures how much you pay for each click on your ads.",
    formula: "CPC = ad spend ÷ clicks",
    bullets: [
      "Use CPC with CTR and CVR to locate bottlenecks (creative vs landing page).",
      "Compare CPC within similar audiences and placements.",
    ],
  },
  {
    slug: "cpm",
    title: "CPM (Cost Per Mille)",
    description:
      "CPM is the cost per 1,000 impressions. It varies by audience, placement, seasonality, and competition.",
    formula: "CPM = (ad spend ÷ impressions) × 1000",
  },
  {
    slug: "ctr",
    title: "CTR (Click-Through Rate)",
    description: "CTR is the fraction of impressions that become clicks.",
    formula: "CTR = clicks ÷ impressions",
    mistakes: [
      "Optimizing CTR alone (without conversion quality).",
      "Comparing CTR across very different placements (feed vs search).",
    ],
  },
  {
    slug: "cvr",
    title: "CVR (Conversion Rate)",
    description:
      "Conversion rate measures the % of visitors who complete an action. In ads it's often conversions ÷ clicks; on-site it can be conversions ÷ sessions.",
    formula: "CVR = conversions ÷ clicks (or sessions)",
    mistakes: [
      "Mixing click-based and session-based CVR.",
      "Optimizing CVR by narrowing targeting and losing scale.",
    ],
  },
  {
    slug: "aov",
    title: "AOV (Average Order Value)",
    description:
      "AOV measures the average revenue per order. It affects your allowable CPA at a given margin.",
    formula: "AOV = revenue ÷ orders",
    bullets: [
      "Use AOV with gross margin to estimate contribution per order.",
      "Track AOV by channel and campaign (intent differs).",
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
    formula: "MER = total revenue ÷ total marketing spend",
    mistakes: [
      "Using MER alone to optimize channel budgets (it hides what's working).",
      "Not adjusting for seasonality, promos, and pricing changes.",
    ],
  },
  {
    slug: "blended-roas",
    title: "Blended ROAS",
    description:
      "Blended ROAS is revenue ÷ total ad spend across channels. It reduces attribution noise but hides channel-level performance.",
    formula: "Blended ROAS = total revenue ÷ total ad spend",
  },
  {
    slug: "attribution",
    title: "Attribution",
    description:
      "Attribution is the method used to assign credit for conversions to channels, campaigns, and touchpoints.",
    bullets: [
      "Define attribution consistently before comparing ROAS/CPA across channels.",
      "Use incrementality tests when possible to estimate true lift.",
    ],
  },
  {
    slug: "attribution-window",
    title: "Attribution Window",
    description:
      "Attribution window is the time period after an ad interaction during which conversions are credited to that ad.",
    mistakes: [
      "Comparing ROAS across platforms with different default windows.",
      "Shortening windows and concluding performance dropped when it is just timing.",
    ],
  },
  {
    slug: "last-click-attribution",
    title: "Last-click Attribution",
    description:
      "Last-click attribution assigns 100% of conversion credit to the final touchpoint before conversion.",
    mistakes: [
      "Under-crediting upper-funnel channels that create demand.",
      "Over-crediting branded search for conversions driven by other channels.",
    ],
  },
  {
    slug: "multi-touch-attribution",
    title: "Multi-touch Attribution (MTA)",
    description:
      "Multi-touch attribution spreads conversion credit across multiple touchpoints (first, last, and middle touches).",
    mistakes: [
      "Assuming MTA is incrementality (it is still model-based attribution).",
      "Using complex models without validating against experiments.",
    ],
  },
  {
    slug: "incrementality",
    title: "Incrementality",
    description:
      "Incrementality estimates the conversions that would not have happened without ads (true lift).",
    bullets: [
      "Use holdouts or geo-experiments to estimate incremental lift.",
      "Be careful with short tests when purchase cycles are long.",
    ],
    relatedGuideSlugs: ["incrementality-guide", "incrementality-lift-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "holdout-test",
    title: "Holdout Test",
    description:
      "A holdout test withholds ads from a control group and compares outcomes to measure incremental lift.",
    relatedGuideSlugs: ["incrementality-lift-guide", "incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "geo-test",
    title: "Geo Experiment",
    description:
      "A geo experiment measures lift by varying spend across regions and comparing outcomes against controls.",
  },
  {
    slug: "pixel",
    title: "Tracking Pixel",
    description:
      "A tracking pixel is a snippet that records events (page views, purchases) for measurement and optimization in ad platforms.",
    mistakes: [
      "Duplicate firing (inflates conversions).",
      "Not validating events after site changes (breaks optimization).",
    ],
  },
  {
    slug: "utm-parameters",
    title: "UTM Parameters",
    description:
      "UTM parameters are URL tags (source/medium/campaign) used to track traffic in analytics tools.",
    bullets: [
      "Use consistent naming (lowercase, stable conventions).",
      "Avoid tagging internal links to prevent attribution pollution.",
    ],
  },
  {
    slug: "frequency",
    title: "Frequency",
    description:
      "Frequency is the average number of times a person sees your ad in a period. High frequency can cause fatigue.",
    formula: "Frequency = impressions ÷ reach",
  },
  {
    slug: "reach",
    title: "Reach",
    description:
      "Reach is the number of unique people who saw your ads over a period.",
  },
  {
    slug: "impressions",
    title: "Impressions",
    description:
      "Impressions count how many times your ads were shown (not unique people).",
  },
  {
    slug: "landing-page",
    title: "Landing Page",
    description:
      "A landing page is the page users arrive on after clicking an ad. Landing page quality strongly affects CVR and CPA.",
    bullets: [
      "Match message-to-market: ad promise must match landing content.",
      "Reduce friction: fast load, clear CTA, fewer form fields.",
    ],
  },
  {
    slug: "creative-fatigue",
    title: "Creative Fatigue",
    description:
      "Creative fatigue happens when performance declines because the audience has seen the same creatives too many times.",
    bullets: [
      "Monitor frequency and CTR trends to detect fatigue.",
      "Rotate creatives and refresh offers to maintain performance.",
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
  },
  {
    slug: "prospecting",
    title: "Prospecting",
    description:
      "Prospecting targets new audiences to acquire new customers. It typically has lower short-term ROAS but drives incremental growth.",
  },
  {
    slug: "branded-search",
    title: "Branded Search",
    description:
      "Branded search refers to search campaigns targeting your brand terms. It often shows very high ROAS but can overlap with organic demand.",
  },
  {
    slug: "non-branded-search",
    title: "Non-branded Search",
    description:
      "Non-branded search targets generic queries. It can be more incremental but often has higher CPC and requires strong landing pages.",
  },
  {
    slug: "quality-score",
    title: "Quality Score (search ads)",
    description:
      "Quality score is an estimate of ad/landing relevance and expected CTR used by some platforms. It can influence CPC and impression share.",
  },
  {
    slug: "impression-share",
    title: "Impression Share",
    description:
      "Impression share is the % of times your ads were shown out of total eligible impressions (search).",
  },
  {
    slug: "cvr-funnel",
    title: "Click-to-conversion Funnel",
    description:
      "A simplified ad funnel: impressions → clicks → conversions. Use CPM/CTR/CVR to diagnose where efficiency is lost.",
    bullets: [
      "CPM drives cost per impression.",
      "CTR turns impressions into visits.",
      "CVR turns visits into outcomes; combine with AOV and margin for profit.",
    ],
  },
];

export const termsPaidAds: GlossaryTerm[] = seeds.map(make);
