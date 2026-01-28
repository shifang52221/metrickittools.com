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
    updatedAt: seed.updatedAt ?? "2026-01-24",
    sections: sectionsFor(seed),
    faqs: seed.faqs,
    relatedGuideSlugs: seed.relatedGuideSlugs,
    relatedCalculatorSlugs: seed.relatedCalculatorSlugs,
  };
}

const seeds: Seed[] = [
  {
    slug: "gclid",
    title: "GCLID (Google Click ID)",
    description:
      "GCLID is a click identifier Google Ads appends to landing page URLs to help attribute sessions and conversions back to ads.",
    bullets: [
      "Store GCLID on click and pass it to your conversion system (CRM, offline conversions) when needed.",
      "Treat GCLID as an attribution aid, not a guarantee (privacy and cross-device still matter).",
      "Use consistent UTMs alongside GCLID for readable reporting.",
    ],
    mistakes: [
      "Dropping the click ID on redirects or cross-domain hops.",
      "Relying on click IDs without validating conversion deduplication.",
    ],
    relatedGuideSlugs: [
      "utm-ga4-attribution-guide",
      "attribution-incrementality-guide",
    ],
  },
  {
    slug: "fbclid",
    title: "FBCLID (Facebook Click ID)",
    description:
      "FBCLID is a click identifier appended by Meta to landing page URLs to help connect on-site sessions and outcomes back to ads.",
    bullets: [
      "Avoid blocking the parameter on redirects; keep the full query string intact.",
      "Use server-side events and deduplication if you track both pixel and server events.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "msclkid",
    title: "MSCLKID (Microsoft Click ID)",
    description:
      "MSCLKID is the click identifier appended by Microsoft Ads (Bing) to attribute sessions and conversions back to ads.",
    bullets: [
      "Keep MSCLKID through redirects and analytics tracking.",
      "Use UTMs as the human-readable layer; click IDs are the machine layer.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "click-id",
    title: "Click ID",
    description:
      "A click ID is a unique identifier added to a landing page URL to link a click to an ad interaction (used for attribution and conversion uploads).",
    bullets: [
      "Capture it at landing, persist it (cookie/local storage), and attach it to conversions when allowed.",
      "Click IDs help with attribution, but incrementality still requires holdouts or experiments.",
    ],
    relatedGuideSlugs: [
      "utm-ga4-attribution-guide",
      "attribution-incrementality-guide",
    ],
  },
  {
    slug: "enhanced-conversions",
    title: "Enhanced Conversions",
    description:
      "Enhanced conversions use hashed first-party data (for example email) to improve conversion measurement when cookies or identifiers are limited.",
    bullets: [
      "Only send data you are allowed to collect and process; follow consent requirements.",
      "Validate match rate and deduplication to avoid double counting conversions.",
    ],
    mistakes: [
      "Sending inconsistent identifiers (low match rate).",
      "Treating enhanced conversions as a replacement for incrementality measurement.",
    ],
    relatedGuideSlugs: [
      "utm-ga4-attribution-guide",
      "attribution-incrementality-guide",
    ],
  },
  {
    slug: "consent-mode",
    title: "Consent Mode",
    description:
      "Consent Mode adapts how measurement tags behave based on user consent choices (for example analytics vs ads storage).",
    bullets: [
      "Implement it with a clear consent banner and store choices consistently.",
      "Expect modeled conversions to differ from direct measurements; reconcile with blended metrics.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "server-side-tagging",
    title: "Server-side Tagging",
    description:
      "Server-side tagging routes tracking events through your server or a server-side tag container to reduce loss from blockers and improve control.",
    bullets: [
      "Use it to improve event reliability and to enforce consistent event schemas.",
      "Always implement event deduplication if you also send browser events.",
    ],
    mistakes: [
      "Assuming server-side means no privacy or consent requirements.",
      "Breaking attribution by stripping query parameters in redirects.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "conversion-api",
    title: "Conversion API (Server Events)",
    description:
      "A conversion API sends events from your server to ad platforms (for example purchases, leads) to improve measurement when browser tracking is limited.",
    bullets: [
      "Use a stable event ID for deduplication between pixel and server events.",
      "Send value and currency consistently to support bidding and reporting.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "offline-conversions",
    title: "Offline Conversions",
    description:
      "Offline conversions link ad clicks to downstream outcomes that happen outside the website (for example CRM-qualified leads or closed-won deals).",
    bullets: [
      "Capture click IDs and upload outcomes with a consistent mapping and time window.",
      "Define one 'source of truth' for conversion states (lead, SQL, won).",
    ],
    mistakes: [
      "Uploading outcomes without deduplication (inflates reporting).",
      "Changing lifecycle definitions mid-stream and breaking optimization.",
    ],
    relatedGuideSlugs: [
      "utm-ga4-attribution-guide",
      "pipeline-coverage-sales-cycle-guide",
    ],
  },
  {
    slug: "event-deduplication",
    title: "Event Deduplication",
    description:
      "Event deduplication prevents counting the same conversion twice when you send events from multiple sources (browser + server).",
    bullets: [
      "Use a shared event ID across sources.",
      "Test deduplication on real checkouts and real lead forms after releases.",
    ],
    mistakes: [
      "Assuming the platform dedupes without consistent event IDs.",
      "Using different timestamps or values across sources for the same event.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "data-layer",
    title: "Data Layer",
    description:
      "A data layer is a structured object (often on the page) that exposes events and attributes for analytics and tag managers.",
    bullets: [
      "Define an event schema (event name + required fields) and keep it versioned.",
      "Use the data layer to avoid fragile DOM scraping in tags.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "tag-manager",
    title: "Tag Manager",
    description:
      "A tag manager (for example GTM) is a tool to deploy and manage tracking tags without code deploys (but you still need governance).",
    bullets: [
      "Use environments and approvals to prevent accidental tracking changes.",
      "Audit tags quarterly: remove unused tags and ensure consent is respected.",
    ],
    mistakes: [
      "Letting anyone publish tags (breaks measurement).",
      "Triggering duplicate events via multiple tags and rules.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "attribution-model",
    title: "Attribution Model",
    description:
      "An attribution model defines how you assign conversion credit across touchpoints (for example first-click, last-click, or multi-touch).",
    bullets: [
      "Keep model and window consistent when comparing campaigns.",
      "Use incrementality tests when attribution is heavily biased (especially retargeting).",
    ],
    relatedGuideSlugs: [
      "attribution-incrementality-guide",
      "utm-ga4-attribution-guide",
    ],
    relatedCalculatorSlugs: ["incrementality-lift-calculator", "mer-calculator"],
  },
  {
    slug: "incremental-roas",
    title: "Incremental ROAS (iROAS)",
    description:
      "Incremental ROAS estimates how much additional (incremental) revenue you generate per additional dollar of ad spend, rather than attributed revenue per spend.",
    bullets: [
      "Use iROAS for budget decisions at the margin (scale up only if incremental value stays above your target).",
      "Estimate with lift tests (holdouts, geo tests) and reconcile with blended MER over time.",
    ],
    mistakes: [
      "Confusing attributed ROAS with incremental ROAS (attribution often over-credits).",
      "Scaling based on short windows that ignore conversion lag and seasonality.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide", "marginal-roas-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator", "marginal-roas-calculator"],
  },
  {
    slug: "data-driven-attribution",
    title: "Data-driven Attribution",
    description:
      "Data-driven attribution assigns credit based on observed conversion paths rather than a fixed rule, but it still relies on tracked data and assumptions.",
    bullets: [
      "Use it as one lens; validate with holdouts and blended MER where possible.",
      "Expect instability when data volume is low or tracking is incomplete.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "first-click-attribution",
    title: "First-click Attribution",
    description:
      "First-click attribution assigns 100% of the conversion credit to the first known touchpoint in the path.",
    bullets: [
      "Useful for evaluating acquisition channels, but it can under-credit closers.",
      "Keep lookback windows consistent; first-click is sensitive to window length.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "linear-attribution",
    title: "Linear Attribution",
    description:
      "Linear attribution spreads conversion credit evenly across all recorded touchpoints in a conversion path.",
    bullets: [
      "Helpful for multi-touch narratives, but it can over-credit low-impact touches.",
      "Use it for directional insights; validate decisions with tests.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "time-decay-attribution",
    title: "Time-decay Attribution",
    description:
      "Time-decay attribution assigns more credit to touchpoints closer in time to the conversion.",
    bullets: [
      "Often better than linear when buying cycles are short and tracking is clean.",
      "Still biased for retargeting and branded search in many accounts.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "position-based-attribution",
    title: "Position-based Attribution (U-shaped)",
    description:
      "Position-based attribution assigns most credit to the first and last touchpoints, with the remaining credit spread across the middle touches.",
    bullets: [
      "Use when you believe first touch creates demand and last touch captures it.",
      "Be explicit about the rule (for example 40/40/20) to keep comparisons stable.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "view-through-conversion",
    title: "View-through Conversion",
    description:
      "A view-through conversion is credited to an ad impression when the user saw the ad but did not click before converting within a lookback window.",
    bullets: [
      "Treat view-through as directional; it is often heavily over-credited without lift tests.",
      "Compare with click-through and with MER trends to avoid budget waste.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["mer-calculator", "incrementality-lift-calculator"],
  },
  {
    slug: "click-through-conversion",
    title: "Click-through Conversion",
    description:
      "A click-through conversion is credited to an ad click when the user clicked and converted within the attribution window.",
    bullets: [
      "Align click window definitions when comparing platforms and GA4.",
      "Combine with conversion lag to avoid premature decisions.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "conversion-lag",
    title: "Conversion Lag",
    description:
      "Conversion lag is the time delay between an ad interaction and the conversion event (purchase, signup, lead).",
    bullets: [
      "Use lag to choose reporting windows and to avoid turning off campaigns too early.",
      "Long lag increases the value of cohort reporting and incrementality checks.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "assisted-conversions",
    title: "Assisted Conversions",
    description:
      "Assisted conversions are conversions where a channel contributed in the path but did not get full last-click credit.",
    bullets: [
      "Use assisted conversions to spot upper-funnel channels that create demand.",
      "Do not budget purely from assists; validate incrementality at scale.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "last-non-direct-click",
    title: "Last Non-direct Click",
    description:
      "Last non-direct click attribution ignores direct traffic and assigns credit to the last known non-direct channel before conversion.",
    bullets: [
      "Common in analytics tools because direct traffic often represents unknown or returning behavior.",
      "Keep definitions consistent when comparing with platform reports.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "direct-traffic",
    title: "Direct Traffic",
    description:
      "Direct traffic in analytics typically means the source is unknown (no referrer, no UTM). It often includes bookmarks, apps, and untagged links.",
    bullets: [
      "Direct traffic often increases when tagging is inconsistent or when tracking is blocked.",
      "Reduce it by enforcing UTM standards on all owned links.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "cross-domain-tracking",
    title: "Cross-domain Tracking",
    description:
      "Cross-domain tracking connects user sessions across multiple domains (for example marketing site -> checkout) to preserve attribution and funnels.",
    bullets: [
      "Ensure linker parameters pass across redirects and payment providers.",
      "Test end-to-end after changes to checkout, routing, or domains.",
    ],
    mistakes: [
      "Breaking attribution by stripping query parameters on redirects.",
      "Letting self-referrals inflate new sessions and distort ROAS in analytics.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "referral-exclusion",
    title: "Referral Exclusion",
    description:
      "Referral exclusion prevents certain domains (for example payment providers) from taking credit as a referrer in analytics.",
    bullets: [
      "Exclude payment providers and key subdomains that should be treated as internal.",
      "Fix root causes (cross-domain tracking) rather than relying only on exclusions.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "self-referral",
    title: "Self-referral",
    description:
      "A self-referral happens when your own domain appears as a referral source, usually due to broken cross-domain tracking or misconfigured analytics.",
    bullets: [
      "Self-referrals can inflate direct/returning behavior and distort attribution.",
      "Check checkout flows, redirects, and subdomain tracking first.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "utm-content",
    title: "UTM Content",
    description:
      "UTM content is an optional UTM parameter used to differentiate creatives, placements, or variations within a campaign.",
    bullets: [
      "Use it to track creative variants (for example hook-1 vs hook-2) in analytics.",
      "Keep values short, stable, and lowercase to avoid reporting fragmentation.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "utm-term",
    title: "UTM Term",
    description:
      "UTM term is an optional UTM parameter often used to track keywords in paid search (or any internal taxonomy you define).",
    bullets: [
      "Use it for keyword themes rather than raw keywords if you need stable reporting.",
      "Do not over-segment: too many distinct values reduces interpretability.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "campaign-naming-convention",
    title: "Campaign Naming Convention",
    description:
      "A campaign naming convention is a consistent format for naming campaigns and assets so reporting stays readable and scalable.",
    bullets: [
      "Encode intent and geography consistently (for example nb-search-us).",
      "Separate campaign objectives from creative concepts to avoid mixing meanings.",
    ],
    mistakes: [
      "Allowing free-form names that fragment reporting.",
      "Renaming campaigns mid-test and losing historical comparability.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "match-type",
    title: "Match Type",
    description:
      "Match type controls how closely a search query must match your keyword in paid search. It affects reach, intent, and cost.",
    bullets: [
      "Broader match increases volume but may reduce intent; use negatives to control quality.",
      "Evaluate match types using downstream metrics (CPA, profit), not CTR alone.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "broad-match",
    title: "Broad Match",
    description:
      "Broad match allows ads to show on searches related to your keyword, not only exact matches. It increases reach but can reduce relevance.",
    bullets: [
      "Use broad match with strong negatives and clear conversion signals.",
      "Monitor search terms to avoid wasted spend on irrelevant queries.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "phrase-match",
    title: "Phrase Match",
    description:
      "Phrase match shows ads on queries that include the meaning of your keyword phrase, balancing reach and intent.",
    bullets: [
      "Use phrase match to scale while keeping stronger intent control than broad.",
      "Still review search terms; phrase match can expand into adjacent queries.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "exact-match",
    title: "Exact Match",
    description:
      "Exact match shows ads on queries that closely match your keyword intent. It offers strong intent control but limited reach.",
    bullets: [
      "Use exact match for high-intent queries and stable CPA control.",
      "Expand with phrase/broad once you have conversion signal and negatives.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "negative-keywords",
    title: "Negative Keywords",
    description:
      "Negative keywords prevent your ads from showing for specific search terms, improving relevance and efficiency.",
    bullets: [
      "Build a shared negative list for irrelevant intents (jobs, free, definition).",
      "Use negatives to protect brand campaigns from low-intent queries when needed.",
    ],
    mistakes: [
      "Over-blocking and reducing volume on profitable queries.",
      "Not reviewing search terms regularly (waste creeps in).",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "search-terms-report",
    title: "Search Terms Report",
    description:
      "A search terms report shows the actual queries that triggered your ads in paid search, used to refine targeting and negatives.",
    bullets: [
      "Mine it for new profitable keywords and for negative candidates.",
      "Review by intent (brand vs non-brand) to keep strategy clean.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "keyword-cannibalization",
    title: "Keyword Cannibalization",
    description:
      "Keyword cannibalization happens when multiple keywords or campaigns compete for the same queries, increasing cost or distorting reporting.",
    bullets: [
      "Separate brand and non-brand with clear negatives and routing rules.",
      "Consolidate overlapping ad groups when you cannot tell what is working.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "auction-overlap",
    title: "Auction Overlap",
    description:
      "Auction overlap measures how often your ads compete in the same auctions as another advertiser. It can explain CPM/CPC pressure and ranking dynamics.",
    bullets: [
      "Use overlap and outranking share to understand competitive pressure.",
      "Do not chase impression share blindly; use marginal ROAS and profit constraints.",
    ],
    relatedGuideSlugs: ["marginal-roas-guide", "paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "impression-share-lost-budget",
    title: "Impression Share Lost (Budget)",
    description:
      "Impression share lost (budget) is the share of impressions you missed because your budget was insufficient.",
    bullets: [
      "Increase budget only when marginal ROAS/profit supports it.",
      "If you are budget-limited, prioritize high-intent segments first.",
    ],
    relatedGuideSlugs: ["marginal-roas-guide"],
  },
  {
    slug: "impression-share-lost-rank",
    title: "Impression Share Lost (Rank)",
    description:
      "Impression share lost (rank) is the share of impressions you missed due to insufficient ad rank (bid and quality).",
    bullets: [
      "Improve rank via relevance, landing page, and creative quality, not only bids.",
      "Use break-even CPC/CPA constraints to avoid bidding into unprofitable territory.",
    ],
    relatedGuideSlugs: ["max-cpc-guide", "paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "ad-rank",
    title: "Ad Rank",
    description:
      "Ad rank is a system used in search auctions to decide ad position. It is influenced by bid and quality signals.",
    bullets: [
      "Higher bid does not guarantee top position if quality is weak.",
      "Improve landing page experience and relevance to raise rank efficiently.",
    ],
    relatedGuideSlugs: ["max-cpc-guide", "paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "expected-ctr",
    title: "Expected CTR",
    description:
      "Expected CTR is a quality component representing the likelihood your ad will be clicked. Higher expected CTR can reduce cost for the same position.",
    bullets: [
      "Improve expected CTR by matching intent and refreshing creative angles.",
      "Compare within similar placements and query intent, not across everything.",
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
  },
  {
    slug: "ad-relevance",
    title: "Ad Relevance",
    description:
      "Ad relevance measures how well your ad matches a user's intent and query/context. Higher relevance tends to improve CTR and efficiency.",
    bullets: [
      "Align headlines and first screen of landing page with the same promise.",
      "Use intent-specific ad groups or audiences to avoid mixed messaging.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "landing-page-experience",
    title: "Landing Page Experience",
    description:
      "Landing page experience reflects how helpful and relevant your landing page is for the user, impacting conversion and quality in many ad platforms.",
    bullets: [
      "Match the ad promise and reduce friction (speed, clarity, strong CTA).",
      "Optimize for post-click outcomes (CVR and profit), not only bounce rate.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "learning-phase",
    title: "Learning Phase",
    description:
      "Learning phase is the period when an ad platform is exploring and adjusting delivery to stabilize performance. Big changes can reset learning.",
    bullets: [
      "Avoid changing targeting, budget, and creative all at once.",
      "Use stable conversion definitions and enough volume to let learning complete.",
    ],
    mistakes: [
      "Resetting campaigns repeatedly and never reaching stable performance.",
      "Optimizing for a low-quality conversion that is easy to get but not valuable.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "bid-strategy",
    title: "Bid Strategy",
    description:
      "A bid strategy is the method you use to set bids (manual CPC, target CPA, target ROAS, maximize conversions) based on your goals and constraints.",
    bullets: [
      "Choose a strategy that matches your measurement quality and volume.",
      "Use break-even targets to prevent automated bidding from buying unprofitable volume.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide", "paid-ads-funnel-guide"],
  },
  {
    slug: "target-roas-bidding",
    title: "Target ROAS Bidding",
    description:
      "Target ROAS bidding tries to maximize conversion value while hitting a target ROAS. It requires stable value tracking and enough data volume.",
    bullets: [
      "Use consistent conversion value rules (refunds and discounts matter).",
      "Validate with marginal ROAS and incrementality as spend scales.",
    ],
    relatedGuideSlugs: ["marginal-roas-guide", "attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["target-roas-calculator", "marginal-roas-calculator"],
  },
  {
    slug: "target-cpa-bidding",
    title: "Target CPA Bidding",
    description:
      "Target CPA bidding tries to get as many conversions as possible at or below a target cost per acquisition. It relies on stable conversion definitions and volume.",
    bullets: [
      "Set targets from unit economics, not from historic averages alone.",
      "Watch for quality drift: cheaper conversions can be lower value.",
    ],
    relatedGuideSlugs: ["target-cpa-guide", "paid-ads-funnel-guide"],
    relatedCalculatorSlugs: ["target-cpa-ltv-calculator", "paid-ads-funnel-calculator"],
  },
  {
    slug: "budget-pacing",
    title: "Budget Pacing",
    description:
      "Budget pacing is how spend is distributed over time (day/week/month). Poor pacing can cause end-of-period spikes or missed opportunities.",
    bullets: [
      "Use pacing to avoid blowing budget early and losing high-intent inventory later.",
      "Pacing should respect conversion lag; short windows can mislead.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "dayparting",
    title: "Dayparting",
    description:
      "Dayparting schedules when ads can run (hours/days) to focus spend on higher-performing times, but it can bias learning and measurement.",
    bullets: [
      "Use dayparting only after validating stable time-of-day patterns.",
      "Consider operations constraints (sales coverage, support) for lead gen.",
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "creative-angle",
    title: "Creative Angle",
    description:
      "A creative angle is the core message or positioning used to persuade a specific audience (for example speed, price, risk reduction, social proof).",
    bullets: [
      "Test angles systematically; keep targeting stable while testing creative.",
      "Write landing pages to support the same angle (message match).",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "creative-iteration",
    title: "Creative Iteration",
    description:
      "Creative iteration is the process of shipping new variations (hooks, visuals, offers) to avoid fatigue and improve performance over time.",
    bullets: [
      "Rotate creatives before CTR collapse when frequency rises.",
      "Keep a record of angles, hooks, and outcomes to avoid random changes.",
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide", "paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "hook-rate",
    title: "Hook Rate",
    description:
      "Hook rate is the share of viewers who stay engaged through the first seconds of a video ad (platform definition varies). It is an early creative quality signal.",
    bullets: [
      "Use hook rate with CTR and CVR to avoid optimizing only for views.",
      "Test hooks as isolated variables (same offer, different first 2-3 seconds).",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "thumbstop-rate",
    title: "Thumbstop Rate",
    description:
      "Thumbstop rate is a creative metric for paid social that estimates how many users stop scrolling and pay attention to your ad (definitions vary by platform).",
    bullets: [
      "Treat it as an input to CTR; it is not the business outcome.",
      "Use it to detect creative fatigue before CPA worsens.",
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
  },
  {
    slug: "conversion-lift-test",
    title: "Conversion Lift Test",
    description:
      "A conversion lift test compares a control group (not exposed) with a test group (exposed) to estimate true incremental impact beyond attribution.",
    bullets: [
      "Use holdouts when attribution is biased (retargeting, branded search).",
      "Define success metrics before the test and use enough duration for conversion lag.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "geo-holdout",
    title: "Geo Holdout",
    description:
      "A geo holdout is an incrementality test that turns ads off in selected geographies and compares outcomes versus similar geographies where ads remain on.",
    bullets: [
      "Match geos by baseline demand and seasonality; otherwise results are noisy.",
      "Use longer windows for longer sales cycles or higher conversion lag.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "psa-test",
    title: "PSA Test",
    description:
      "A PSA (public service announcement) test replaces your ads with neutral ads to estimate incrementality while keeping auction dynamics similar.",
    bullets: [
      "Useful when you cannot fully turn off ads without affecting auctions.",
      "Interpret with care; PSA design and audience leakage can bias results.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "lift-study",
    title: "Lift Study",
    description:
      "A lift study measures incremental impact by comparing exposed vs control groups (or regions) under a test design, often run by ad platforms.",
    bullets: [
      "Define primary metric (incremental conversions, revenue) before running.",
      "Use lift alongside MER and marginal ROAS for budget decisions.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator", "mer-calculator"],
  },
  {
    slug: "marketing-mix-modeling",
    title: "Marketing Mix Modeling (MMM)",
    description:
      "Marketing mix modeling uses aggregated time series data to estimate how marketing channels contribute to outcomes (for example revenue) when user-level tracking is limited.",
    bullets: [
      "Useful for privacy-constrained environments and for long time windows.",
      "MMM needs clean historical data, consistent spend records, and controls for seasonality.",
    ],
    mistakes: [
      "Treating MMM coefficients as precise at short horizons (they are noisy).",
      "Ignoring creative and offer shifts that change channel effectiveness.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide", "paid-ads-measurement-hub-guide"],
  },
  {
    slug: "creative-testing",
    title: "Creative Testing",
    description:
      "Creative testing is the structured process of comparing ad concepts, hooks, and formats to find what drives clicks and conversions.",
    updatedAt: "2026-01-28",
    bullets: [
      "Test one variable at a time to isolate the driver (hook, offer, format).",
      "Use enough spend to reach stable CTR and conversion signals.",
    ],
    mistakes: [
      "Calling a winner after a few clicks without conversion data.",
      "Changing multiple variables at once and losing signal clarity.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "ad-fatigue",
    title: "Ad Fatigue",
    description:
      "Ad fatigue happens when an audience sees the same creative too often and performance declines.",
    updatedAt: "2026-01-28",
    bullets: [
      "Watch frequency and CTR trends to spot fatigue early.",
      "Rotate new hooks and offers before CPA worsens.",
    ],
    mistakes: [
      "Letting frequency climb without refreshing creative.",
      "Pausing too early without confirming that fatigue, not targeting, is the issue.",
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
  },
  {
    slug: "frequency-saturation",
    title: "Frequency Saturation",
    description:
      "Frequency saturation is the point where additional impressions stop increasing conversions and start wasting spend.",
    updatedAt: "2026-01-28",
    formula: "Saturation signal = rising frequency + flat or declining conversion rate",
    bullets: [
      "Monitor frequency by segment; retargeting saturates faster than prospecting.",
      "Use frequency caps or creative rotation to avoid waste.",
    ],
    mistakes: [
      "Using one global cap across very different audience sizes.",
      "Ignoring post-click conversion rate when judging saturation.",
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide", "paid-ads-measurement-hub-guide"],
  },
  {
    slug: "incremental-conversion-rate",
    title: "Incremental Conversion Rate",
    description:
      "Incremental conversion rate measures the share of conversions that would not have happened without ads.",
    updatedAt: "2026-01-28",
    formula: "Incremental conversion rate = incremental conversions / total conversions",
    bullets: [
      "Estimate with holdout or lift tests instead of attribution alone.",
      "Use the rate to adjust reported ROAS to true incremental ROAS.",
    ],
    mistakes: [
      "Assuming last-click conversions are all incremental.",
      "Ignoring conversion lag when measuring incremental impact.",
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "landing-page-speed",
    title: "Landing Page Speed",
    description:
      "Landing page speed is how quickly a landing page becomes usable and visible after a click. It directly affects conversion rate.",
    updatedAt: "2026-01-28",
    bullets: [
      "Measure on mobile first; most paid traffic is mobile.",
      "Speed improvements compound with creative and offer wins.",
    ],
    mistakes: [
      "Optimizing only time-to-first-byte while LCP remains slow.",
      "Ignoring page weight from analytics tags and heavy images.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "offer-structure",
    title: "Offer Structure",
    description:
      "Offer structure is the bundle of price, discount, value framing, and risk reversal you present in ads and landing pages.",
    updatedAt: "2026-01-28",
    bullets: [
      "Test price anchors, guarantees, and bonuses as separate variables.",
      "Align the offer with the stage of awareness (cold vs warm traffic).",
    ],
    mistakes: [
      "Changing the offer without updating creative and landing copy.",
      "Using heavy discounts that raise churn or refund rates.",
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide", "paid-ads-funnel-guide"],
  },
  {
    slug: "budget-reallocation",
    title: "Budget Reallocation",
    description:
      "Budget reallocation shifts spend across campaigns or channels based on marginal performance and capacity.",
    updatedAt: "2026-01-28",
    bullets: [
      "Use marginal ROAS, not blended ROAS, to guide shifts.",
      "Move budget gradually to avoid learning phase resets.",
    ],
    mistakes: [
      "Over-rotating weekly and destabilizing delivery.",
      "Moving spend without validating tracking quality changes.",
    ],
    relatedGuideSlugs: ["paid-ads-measurement-hub-guide"],
    relatedCalculatorSlugs: ["marginal-roas-calculator"],
  },
  {
    slug: "account-structure",
    title: "Account Structure",
    description:
      "Account structure is how you organize campaigns, ad sets, and audiences to balance control with algorithmic learning.",
    updatedAt: "2026-01-28",
    bullets: [
      "Keep structure simple unless you have clear audience or offer differences.",
      "Separate prospecting and retargeting to avoid budget leakage.",
    ],
    mistakes: [
      "Fragmenting spend across too many small ad sets.",
      "Mixing very different conversion goals in one campaign.",
    ],
    relatedGuideSlugs: ["paid-ads-measurement-hub-guide"],
  },
  {
    slug: "utm-governance",
    title: "UTM Governance",
    description:
      "UTM governance is the discipline of consistent naming, required fields, and QA for campaign tracking parameters.",
    updatedAt: "2026-01-28",
    bullets: [
      "Use a naming convention and enforce it with templates.",
      "Audit UTMs regularly to prevent broken attribution.",
    ],
    mistakes: [
      "Letting campaign naming drift across teams or agencies.",
      "Changing UTM definitions mid-quarter and breaking reporting.",
    ],
    relatedGuideSlugs: ["paid-ads-measurement-hub-guide"],
  },
  {
    slug: "retention-remarketing",
    title: "Retention Remarketing",
    description:
      "Retention remarketing targets existing customers to reduce churn, drive repeat usage, or expand accounts.",
    updatedAt: "2026-01-28",
    bullets: [
      "Segment by lifecycle stage (new, active, at-risk) for relevance.",
      "Measure incremental impact to avoid paying for organic repeats.",
    ],
    mistakes: [
      "Using the same creative for new and existing customers.",
      "Retargeting without frequency caps and annoying loyal users.",
    ],
    relatedGuideSlugs: ["retention-churn-hub-guide", "paid-ads-funnel-guide"],
  },
];

export const termsPaidAdsExtra: GlossaryTerm[] = seeds.map(make);
