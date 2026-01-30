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
    example:
      "A landing page URL includes -fbclid=... so Meta can match the click to a conversion event.",
    bullets: [
      "Avoid blocking the parameter on redirects; keep the full query string intact.",
      "Use server-side events and deduplication if you track both pixel and server events.",
      "Store FBCLID only as long as needed for attribution windows.",
    ],
    mistakes: [
      "Stripping query parameters during redirect chains and losing attribution.",
      "Relying on FBCLID without consistent UTMs for readable reporting.",
      "Treating FBCLID as a user ID instead of a click identifier.",
    ],
    faqs: [
      {
        question: "Should I store FBCLID in my database-",
        answer:
          "Only if you have a clear attribution or offline conversion use case and privacy consent. Otherwise store it briefly and avoid unnecessary retention.",
      },
      {
        question: "Does FBCLID work across devices-",
        answer:
          "No. It identifies a click on a specific device and session. Cross-device attribution still requires platform matching and consented signals.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "msclkid",
    title: "MSCLKID (Microsoft Click ID)",
    description:
      "MSCLKID is the click identifier appended by Microsoft Ads (Bing) to attribute sessions and conversions back to ads.",
    example:
      "A landing page URL includes -msclkid=... so the click can be tied to a conversion upload.",
    bullets: [
      "Keep MSCLKID through redirects and analytics tracking.",
      "Use UTMs as the human-readable layer; click IDs are the machine layer.",
      "Store the ID only as long as needed for attribution and offline conversion matching.",
    ],
    mistakes: [
      "Stripping query parameters during redirects and losing attribution.",
      "Relying only on click IDs without consistent UTMs for reporting.",
    ],
    faqs: [
      {
        question: "Do I need both MSCLKID and UTMs-",
        answer:
          "Yes. MSCLKID is for platform matching, while UTMs make reports readable and consistent across tools.",
      },
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
    example:
      "If a user declines ads storage, ad tags run in a restricted mode and conversions may be modeled.",
    bullets: [
      "Implement it with a clear consent banner and store choices consistently.",
      "Expect modeled conversions to differ from direct measurements; reconcile with blended metrics.",
      "Keep consent status synced across analytics and ad platforms.",
    ],
    mistakes: [
      "Firing tags before consent and trying to fix it later.",
      "Assuming modeled conversions are the same as observed conversions.",
    ],
    faqs: [
      {
        question: "Does Consent Mode replace a consent banner-",
        answer:
          "No. Consent Mode works with a consent banner to control tag behavior. You still need a compliant banner and storage logic.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "server-side-tagging",
    title: "Server-side Tagging",
    description:
      "Server-side tagging routes tracking events through your server or a server-side tag container to reduce loss from blockers and improve control.",
    example:
      "A purchase event is sent from your server with a consistent event ID, then forwarded to ad platforms.",
    bullets: [
      "Use it to improve event reliability and to enforce consistent event schemas.",
      "Always implement event deduplication if you also send browser events.",
      "Audit server latency so conversion events arrive within platform windows.",
    ],
    mistakes: [
      "Assuming server-side means no privacy or consent requirements.",
      "Breaking attribution by stripping query parameters in redirects.",
      "Forwarding events without validating required fields (value, currency).",
    ],
    faqs: [
      {
        question: "Does server-side tagging improve attribution-",
        answer:
          "It can improve event reliability and match rates, but it does not eliminate consent or data quality requirements.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "conversion-api",
    title: "Conversion API (Server Events)",
    description:
      "A conversion API sends events from your server to ad platforms (for example purchases, leads) to improve measurement when browser tracking is limited.",
    example:
      "A purchase event is sent from your server with value, currency, and event ID for deduplication.",
    bullets: [
      "Use a stable event ID for deduplication between pixel and server events.",
      "Send value and currency consistently to support bidding and reporting.",
      "Validate event volume and match quality after each release.",
    ],
    mistakes: [
      "Sending duplicate events without deduplication IDs.",
      "Omitting consent checks or sending data without legal basis.",
    ],
    faqs: [
      {
        question: "Does Conversion API replace the pixel-",
        answer:
          "No. Most setups use both for resilience. The key is deduplication so conversions are counted once.",
      },
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
    example:
      "A purchase event is sent from the pixel and the server with the same event ID, so the platform counts it once.",
    bullets: [
      "Use a shared event ID across sources.",
      "Test deduplication on real checkouts and real lead forms after releases.",
      "Align event values and currencies so deduped events match exactly.",
      "Track dedupe rate so you can spot double-counting early.",
    ],
    mistakes: [
      "Assuming the platform dedupes without consistent event IDs.",
      "Using different timestamps or values across sources for the same event.",
      "Letting multiple tags fire the same event with different IDs.",
    ],
    faqs: [
      {
        question: "How do I know if deduplication is working-",
        answer:
          "Compare pixel and server event counts, then confirm platform reported conversions are closer to one source rather than the sum of both.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "data-layer",
    title: "Data Layer",
    description:
      "A data layer is a structured object (often on the page) that exposes events and attributes for analytics and tag managers.",
    example:
      "window.dataLayer.push({ event: \"purchase\", value: 120, currency: \"USD\" })",
    bullets: [
      "Define an event schema (event name + required fields) and keep it versioned.",
      "Use the data layer to avoid fragile DOM scraping in tags.",
      "Validate the data layer on key flows (checkout, signup, lead form).",
    ],
    mistakes: [
      "Changing event names without updating tag rules.",
      "Sending personally identifiable data without consent or hashing.",
    ],
    faqs: [
      {
        question: "What should go into the data layer-",
        answer:
          "Only the fields needed for measurement and optimization, such as event name, value, currency, product IDs, and user segment flags.",
      },
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
      "Document event naming and trigger rules to keep tracking consistent.",
    ],
    mistakes: [
      "Letting anyone publish tags (breaks measurement).",
      "Triggering duplicate events via multiple tags and rules.",
      "Shipping tags without performance checks (LCP and CLS regressions).",
    ],
    faqs: [
      {
        question: "Should every team manage tags directly-",
        answer:
          "No. Centralize governance and use approvals so new tags follow naming, consent, and QA standards.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "attribution-model",
    title: "Attribution Model",
    description:
      "An attribution model defines how you assign conversion credit across touchpoints (for example first-click, last-click, or multi-touch).",
    example:
      "A last-click model gives 100% credit to branded search, while a linear model splits credit across ads, email, and organic.",
    bullets: [
      "Keep model and window consistent when comparing campaigns.",
      "Use incrementality tests when attribution is heavily biased (especially retargeting).",
      "Document the model used in dashboards so teams do not compare apples to oranges.",
    ],
    mistakes: [
      "Changing the model mid-quarter and breaking performance baselines.",
      "Treating attribution as causal without validation.",
    ],
    faqs: [
      {
        question: "Which attribution model is best-",
        answer:
          "There is no universal best. Use a consistent model for trend tracking and validate major budget decisions with lift or holdout tests.",
      },
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
      "Translate iROAS into profit impact using contribution margin, not just revenue.",
    ],
    mistakes: [
      "Confusing attributed ROAS with incremental ROAS (attribution often over-credits).",
      "Scaling based on short windows that ignore conversion lag and seasonality.",
      "Ignoring diminishing returns when spend increases.",
    ],
    faqs: [
      {
        question: "What is a good iROAS target-",
        answer:
          "Set iROAS targets based on contribution margin and cash constraints. It should clear break-even with a buffer for risk.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide", "marginal-roas-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator", "marginal-roas-calculator"],
  },
  {
    slug: "data-driven-attribution",
    title: "Data-driven Attribution",
    description:
      "Data-driven attribution assigns credit based on observed conversion paths rather than a fixed rule, but it still relies on tracked data and assumptions.",
    example:
      "A platform model assigns more credit to a mid-funnel touch if it often precedes conversions.",
    bullets: [
      "Use it as one lens; validate with holdouts and blended MER where possible.",
      "Expect instability when data volume is low or tracking is incomplete.",
      "Keep conversion definitions stable so model outputs are comparable.",
      "Audit touchpoint windows regularly to keep model inputs consistent.",
    ],
    mistakes: [
      "Treating model output as causal truth without experiments.",
      "Comparing results across periods with different tracking coverage.",
      "Ignoring consent loss or blocked signals that bias credit allocation.",
    ],
    faqs: [
      {
        question: "When is data-driven attribution most useful-",
        answer:
          "When you have strong tracking coverage and enough volume to support model stability, and you still validate with incrementality tests.",
      },
      {
        question: "Can data-driven attribution replace incrementality tests-",
        answer:
          "No. It explains observed paths, but only experiments can estimate causal lift.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "first-click-attribution",
    title: "First-click Attribution",
    description:
      "First-click attribution assigns 100% of the conversion credit to the first known touchpoint in the path.",
    example:
      "A prospect clicks a blog ad and later converts via email; first-click assigns full credit to the blog ad.",
    bullets: [
      "Useful for evaluating acquisition channels, but it can under-credit closers.",
      "Keep lookback windows consistent; first-click is sensitive to window length.",
      "Use it to inform top-of-funnel investment, not final ROI decisions.",
    ],
    mistakes: [
      "Using first-click to judge retargeting performance.",
      "Comparing first-click results to last-click without context.",
    ],
    faqs: [
      {
        question: "When is first-click most useful-",
        answer:
          "When you want to identify which channels introduce new demand and you accept that it will under-credit closer channels.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "linear-attribution",
    title: "Linear Attribution",
    description:
      "Linear attribution spreads conversion credit evenly across all recorded touchpoints in a conversion path.",
    example:
      "If a user has four touches, each gets 25% of the credit under linear attribution.",
    bullets: [
      "Helpful for multi-touch narratives, but it can over-credit low-impact touches.",
      "Use it for directional insights; validate decisions with tests.",
      "Keep the same lookback window when comparing periods.",
    ],
    mistakes: [
      "Comparing linear to last-click without acknowledging different intents.",
      "Assuming linear credit is causal for every touchpoint.",
    ],
    faqs: [
      {
        question: "When should I use linear attribution-",
        answer:
          "Use it when you want a balanced view of multi-touch paths and you are not ready to run lift tests.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "time-decay-attribution",
    title: "Time-decay Attribution",
    description:
      "Time-decay attribution assigns more credit to touchpoints closer in time to the conversion.",
    example:
      "An ad clicked yesterday gets more credit than an ad clicked two weeks ago.",
    bullets: [
      "Often better than linear when buying cycles are short and tracking is clean.",
      "Still biased for retargeting and branded search in many accounts.",
      "Keep the same decay rule so trends remain comparable.",
    ],
    mistakes: [
      "Using time-decay without checking conversion lag patterns.",
      "Comparing results across models without aligning windows.",
    ],
    faqs: [
      {
        question: "When is time-decay most useful-",
        answer:
          "When your sales cycle is short and you want recent touches to matter more than early discovery touches.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "position-based-attribution",
    title: "Position-based Attribution (U-shaped)",
    description:
      "Position-based attribution assigns most credit to the first and last touchpoints, with the remaining credit spread across the middle touches.",
    example:
      "A 40/40/20 model gives 40% to first touch, 40% to last touch, and 20% to the middle steps.",
    bullets: [
      "Use when you believe first touch creates demand and last touch captures it.",
      "Be explicit about the rule (for example 40/40/20) to keep comparisons stable.",
      "Validate with lift tests when budget decisions are material.",
    ],
    mistakes: [
      "Changing the split across reports and breaking trend comparisons.",
      "Using it as a causal truth without incrementality checks.",
    ],
    faqs: [
      {
        question: "Is position-based better than linear-",
        answer:
          "It depends on your funnel. If first and last touches are clearly more important, position-based can be more intuitive than linear.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "view-through-conversion",
    title: "View-through Conversion",
    description:
      "A view-through conversion is credited to an ad impression when the user saw the ad but did not click before converting within a lookback window.",
    example:
      "A user views an ad, does not click, but buys within 7 days; the platform credits a view-through conversion.",
    bullets: [
      "Treat view-through as directional; it is often heavily over-credited without lift tests.",
      "Compare with click-through and with MER trends to avoid budget waste.",
      "Check lookback windows; long windows inflate view-through credit.",
      "Report by placement and device; view-through is usually higher on mobile and upper-funnel placements.",
      "Use a holdout or PSA test to estimate what share is truly incremental.",
    ],
    mistakes: [
      "Reporting view-through without separating it from click-through conversions.",
      "Using view-through to justify spend without incrementality validation.",
      "Attributing view-through to retargeting and treating it as prospecting lift.",
      "Ignoring overlap across platforms when the same user sees multiple impressions.",
    ],
    faqs: [
      {
        question: "Should view-through conversions be included in ROAS-",
        answer:
          "Use them carefully. Many teams report click-through ROAS and view-through separately, then validate with incrementality tests before using view-through for scaling decisions.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["mer-calculator", "incrementality-lift-calculator"],
  },
  {
    slug: "click-through-conversion",
    title: "Click-through Conversion",
    description:
      "A click-through conversion is credited to an ad click when the user clicked and converted within the attribution window.",
    example:
      "A user clicks an ad and purchases within 7 days; the platform credits a click-through conversion.",
    bullets: [
      "Align click window definitions when comparing platforms and GA4.",
      "Combine with conversion lag to avoid premature decisions.",
      "Use incrementality tests to validate whether clicks were causal.",
      "Separate brand and non-brand clicks; intent levels change the meaning of click-through credit.",
      "Pair click-through ROAS with margin or payback to avoid optimizing for low-quality orders.",
      "Use consistent conversion definitions so click-through rates stay comparable.",
    ],
    mistakes: [
      "Assuming every click-through conversion is incremental.",
      "Comparing channels without matching attribution windows.",
      "Changing the attribution window mid-quarter and breaking trend continuity.",
      "Ignoring post-click refunds or cancellations when evaluating true impact.",
      "Counting duplicate events when both pixel and server send conversions.",
    ],
    faqs: [
      {
        question: "What is a typical click-through window-",
        answer:
          "Common windows are 1, 7, or 28 days depending on platform and product. Pick a window that matches your conversion lag and stick with it.",
      },
      {
        question: "Should I optimize to click-through conversions for lead gen-",
        answer:
          "Yes, but validate lead quality with downstream SQL or revenue to avoid optimizing for low-quality leads.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "conversion-lag",
    title: "Conversion Lag",
    description:
      "Conversion lag is the time delay between an ad interaction and the conversion event (purchase, signup, lead).",
    example:
      "If most conversions happen 5-10 days after click, your lag is about a week.",
    bullets: [
      "Use lag to choose reporting windows and to avoid turning off campaigns too early.",
      "Long lag increases the value of cohort reporting and incrementality checks.",
      "Track lag by channel; lead gen often has longer lag than ecommerce.",
      "Use p75 lag for budget pacing to avoid undercounting late conversions.",
    ],
    mistakes: [
      "Using short attribution windows that ignore lag.",
      "Pausing campaigns before lagged conversions arrive.",
      "Assuming lag is stable across seasons or promos.",
    ],
    faqs: [
      {
        question: "How do I measure conversion lag-",
        answer:
          "Look at time-to-conversion reports by channel or cohort and use median or p75 lag to set windows.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "assisted-conversions",
    title: "Assisted Conversions",
    description:
      "Assisted conversions are conversions where a channel contributed in the path but did not get full last-click credit.",
    example:
      "A webinar ad introduces the product, but the user later converts via branded search.",
    bullets: [
      "Use assisted conversions to spot upper-funnel channels that create demand.",
      "Do not budget purely from assists; validate incrementality at scale.",
      "Use assists with conversion lag to avoid under-crediting long-cycle channels.",
    ],
    mistakes: [
      "Treating assists as equivalent to last-click conversions.",
      "Ignoring overlap between channels when paths are short.",
    ],
    faqs: [
      {
        question: "Should assisted conversions count toward ROI-",
        answer:
          "They are directional signals. Use them to understand influence, but validate with incrementality before shifting budgets.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "last-non-direct-click",
    title: "Last Non-direct Click",
    description:
      "Last non-direct click attribution ignores direct traffic and assigns credit to the last known non-direct channel before conversion.",
    example:
      "If a user visits from an email, then returns via direct and buys, the email gets credit.",
    bullets: [
      "Common in analytics tools because direct traffic often represents unknown or returning behavior.",
      "Keep definitions consistent when comparing with platform reports.",
      "Pair with conversion lag to avoid over-crediting late touches.",
    ],
    mistakes: [
      "Treating last non-direct click as causal for every conversion.",
      "Comparing it to platform attribution without aligning windows.",
    ],
    faqs: [
      {
        question: "When is last non-direct click most useful-",
        answer:
          "When you want a consistent analytics baseline for trend tracking and you accept that direct visits often represent returning users.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "direct-traffic",
    title: "Direct Traffic",
    description:
      "Direct traffic in analytics typically means the source is unknown (no referrer, no UTM). It often includes bookmarks, apps, and untagged links.",
    example:
      "A user clicks a link from a PDF or native app and shows up as direct traffic.",
    bullets: [
      "Direct traffic often increases when tagging is inconsistent or when tracking is blocked.",
      "Reduce it by enforcing UTM standards on all owned links.",
      "Watch spikes after site changes or domain moves.",
    ],
    mistakes: [
      "Treating direct traffic as purely brand demand without validation.",
      "Ignoring broken UTMs or missing referrers in key campaigns.",
    ],
    faqs: [
      {
        question: "How can I reduce direct traffic-",
        answer:
          "Standardize UTMs, fix cross-domain tracking, and review link sources (apps, PDFs, email) that strip referrers.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "cross-domain-tracking",
    title: "Cross-domain Tracking",
    description:
      "Cross-domain tracking connects user sessions across multiple domains (for example marketing site -> checkout) to preserve attribution and funnels.",
    example:
      "Users move from marketing.site.com to checkout.site.com without losing the original source.",
    bullets: [
      "Ensure linker parameters pass across redirects and payment providers.",
      "Test end-to-end after changes to checkout, routing, or domains.",
      "Align cookie domain settings so sessions do not reset across subdomains.",
    ],
    mistakes: [
      "Breaking attribution by stripping query parameters on redirects.",
      "Letting self-referrals inflate new sessions and distort ROAS in analytics.",
      "Changing domains without updating linker configuration.",
    ],
    faqs: [
      {
        question: "How do I test cross-domain tracking-",
        answer:
          "Run a full user journey and confirm the source/medium persists in analytics when moving across domains.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "referral-exclusion",
    title: "Referral Exclusion",
    description:
      "Referral exclusion prevents certain domains (for example payment providers) from taking credit as a referrer in analytics.",
    example:
      "Exclude stripe.com and paypal.com so checkout traffic does not overwrite the original source.",
    bullets: [
      "Exclude payment providers and key subdomains that should be treated as internal.",
      "Fix root causes (cross-domain tracking) rather than relying only on exclusions.",
      "Re-test after domain changes or new checkout providers are added.",
    ],
    mistakes: [
      "Excluding true partner referrals that should remain attribution sources.",
      "Using exclusions without fixing broken cross-domain tracking.",
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "self-referral",
    title: "Self-referral",
    description:
      "A self-referral happens when your own domain appears as a referral source, usually due to broken cross-domain tracking or misconfigured analytics.",
    example:
      "Users go from marketing.metrickittools.com to checkout.metrickittools.com and analytics reports the checkout domain as the referrer.",
    bullets: [
      "Self-referrals can inflate direct/returning behavior and distort attribution.",
      "Check checkout flows, redirects, and subdomain tracking first.",
      "Audit internal links that strip UTMs or overwrite source parameters.",
    ],
    mistakes: [
      "Ignoring self-referrals and assuming the attribution model will fix it.",
      "Changing analytics settings without re-testing the funnel end-to-end.",
    ],
    faqs: [
      {
        question: "How do I know if self-referrals are happening-",
        answer:
          "Look for your own domain in referral reports and spikes in direct traffic after checkout or subdomain changes.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "utm-content",
    title: "UTM Content",
    description:
      "UTM content is an optional UTM parameter used to differentiate creatives, placements, or variations within a campaign.",
    example:
      "Use utm_content=hook_a vs utm_content=hook_b to compare ad creative variants.",
    bullets: [
      "Use it to track creative variants (for example hook-1 vs hook-2) in analytics.",
      "Keep values short, stable, and lowercase to avoid reporting fragmentation.",
      "Document allowed values so teams do not invent new formats.",
    ],
    mistakes: [
      "Over-segmenting content values and making reports unreadable.",
      "Changing content values mid-test and breaking comparisons.",
    ],
    faqs: [
      {
        question: "Should UTM content be unique per ad-",
        answer:
          "Not necessarily. Use it for meaningful groupings (hook, offer, placement) so you can analyze at a useful level.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "utm-term",
    title: "UTM Term",
    description:
      "UTM term is an optional UTM parameter often used to track keywords in paid search (or any internal taxonomy you define).",
    example:
      "Use utm_term=project-management to group keyword themes in reporting.",
    bullets: [
      "Use it for keyword themes rather than raw keywords if you need stable reporting.",
      "Do not over-segment: too many distinct values reduces interpretability.",
      "Keep a controlled list so terms stay consistent over time.",
      "Align utm_term with search term themes used in reporting dashboards.",
    ],
    mistakes: [
      "Letting teams create ad-hoc terms that fragment reports.",
      "Changing term definitions mid-quarter and breaking comparisons.",
      "Using utm_term for campaign names instead of keyword themes.",
    ],
    faqs: [
      {
        question: "Should utm_term match the exact keyword-",
        answer:
          "Not necessarily. Group terms by theme or intent so reporting is stable and actionable.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "campaign-naming-convention",
    title: "Campaign Naming Convention",
    description:
      "A campaign naming convention is a consistent format for naming campaigns and assets so reporting stays readable and scalable.",
    example:
      "Use a format like nb-search-us-brand-jan to encode intent, geo, and theme.",
    bullets: [
      "Encode intent and geography consistently (for example nb-search-us).",
      "Separate campaign objectives from creative concepts to avoid mixing meanings.",
      "Document required fields and enforce them in launch checklists.",
      "Keep naming rules short enough to be used consistently by every team.",
    ],
    mistakes: [
      "Allowing free-form names that fragment reporting.",
      "Renaming campaigns mid-test and losing historical comparability.",
      "Using different naming rules across regions or agencies.",
      "Encoding too many fields so names become unreadable.",
    ],
    faqs: [
      {
        question: "What should a naming convention include-",
        answer:
          "At minimum include objective, geo, and audience or intent. Add creative angle or offer if it is a test variable.",
      },
      {
        question: "How do we enforce a naming convention-",
        answer:
          "Use templates in launch checklists and QA gates so campaigns cannot go live without the required fields.",
      },
    ],
    relatedGuideSlugs: ["utm-ga4-attribution-guide"],
  },
  {
    slug: "match-type",
    title: "Match Type",
    description:
      "Match type controls how closely a search query must match your keyword in paid search. It affects reach, intent, and cost.",
    example:
      "Exact match controls intent tightly, while broad match expands reach at the cost of relevance.",
    bullets: [
      "Broader match increases volume but may reduce intent; use negatives to control quality.",
      "Evaluate match types using downstream metrics (CPA, profit), not CTR alone.",
      "Segment reporting by match type to see where quality drops.",
    ],
    mistakes: [
      "Using broad match without a negative keyword strategy.",
      "Comparing match types without normalizing for intent or volume.",
    ],
    faqs: [
      {
        question: "Should I start with exact or broad match-",
        answer:
          "Start with exact or phrase for intent control, then expand to broad once conversion signals and negatives are strong.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "broad-match",
    title: "Broad Match",
    description:
      "Broad match allows ads to show on searches related to your keyword, not only exact matches. It increases reach but can reduce relevance.",
    example:
      "A keyword like project management software can match queries about project tools, templates, or comparisons.",
    bullets: [
      "Use broad match with strong negatives and clear conversion signals.",
      "Monitor search terms to avoid wasted spend on irrelevant queries.",
      "Pair with smart bidding only after conversion tracking is stable.",
    ],
    mistakes: [
      "Turning on broad match without enough conversion volume.",
      "Ignoring match type performance differences by segment.",
    ],
    faqs: [
      {
        question: "When should I expand from phrase to broad-",
        answer:
          "After you have stable conversion data and a mature negatives list. Expand gradually and review search terms weekly.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "phrase-match",
    title: "Phrase Match",
    description:
      "Phrase match shows ads on queries that include the meaning of your keyword phrase, balancing reach and intent.",
    example:
      "Keyword \"project management\" can match \"best project management tool\" but not unrelated terms.",
    bullets: [
      "Use phrase match to scale while keeping stronger intent control than broad.",
      "Still review search terms; phrase match can expand into adjacent queries.",
      "Pair with negatives to block low-intent variants.",
    ],
    mistakes: [
      "Assuming phrase match means exact intent.",
      "Not reviewing search terms regularly after expansion.",
    ],
    faqs: [
      {
        question: "When should I use phrase match-",
        answer:
          "Use phrase match when you want more scale than exact match while keeping intent closer than broad match.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "exact-match",
    title: "Exact Match",
    description:
      "Exact match shows ads on queries that closely match your keyword intent. It offers strong intent control but limited reach.",
    example:
      "If the keyword is project management software, exact match targets closely related queries rather than broad variations.",
    bullets: [
      "Use exact match for high-intent queries and stable CPA control.",
      "Expand with phrase/broad once you have conversion signal and negatives.",
      "Review search terms to confirm intent stays tight as platforms evolve.",
    ],
    mistakes: [
      "Expecting exact match to deliver scale on its own.",
      "Ignoring close variants that can change intent over time.",
    ],
    faqs: [
      {
        question: "Should I start with exact match for new campaigns-",
        answer:
          "Yes if you need tight intent control. Expand to phrase or broad once you validate conversion quality and build a negative list.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "negative-keywords",
    title: "Negative Keywords",
    description:
      "Negative keywords prevent your ads from showing for specific search terms, improving relevance and efficiency.",
    example:
      "If you sell enterprise software, add negatives like free, job, and template to block low-intent searches.",
    bullets: [
      "Build a shared negative list for irrelevant intents (jobs, free, definition).",
      "Use negatives to protect brand campaigns from low-intent queries when needed.",
      "Review negatives after major launches to avoid blocking new demand.",
    ],
    mistakes: [
      "Over-blocking and reducing volume on profitable queries.",
      "Not reviewing search terms regularly (waste creeps in).",
      "Adding broad negatives that block valuable long-tail queries.",
    ],
    faqs: [
      {
        question: "How do I decide which negatives to add-",
        answer:
          "Start with obvious irrelevant intent and low-converting queries, then expand based on search term report data.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "search-terms-report",
    title: "Search Terms Report",
    description:
      "A search terms report shows the actual queries that triggered your ads in paid search, used to refine targeting and negatives.",
    example:
      "A broad match keyword surfaces irrelevant queries that you add as negatives.",
    bullets: [
      "Mine it for new profitable keywords and for negative candidates.",
      "Review by intent (brand vs non-brand) to keep strategy clean.",
      "Check for shifts after match-type changes or new campaigns.",
      "Use conversion lag when evaluating newly added negatives.",
    ],
    mistakes: [
      "Reviewing too infrequently and letting waste creep in.",
      "Adding negatives without checking conversion lag.",
      "Ignoring geographic or device differences in query intent.",
    ],
    faqs: [
      {
        question: "How often should I review search terms-",
        answer:
          "Weekly for high-spend campaigns and at least monthly for lower spend.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "keyword-cannibalization",
    title: "Keyword Cannibalization",
    description:
      "Keyword cannibalization happens when multiple keywords or campaigns compete for the same queries, increasing cost or distorting reporting.",
    example:
      "A brand campaign and a generic campaign both match the same query and split impressions.",
    bullets: [
      "Separate brand and non-brand with clear negatives and routing rules.",
      "Consolidate overlapping ad groups when you cannot tell what is working.",
      "Use search term reports to find overlapping queries regularly.",
    ],
    mistakes: [
      "Letting automated bidding create overlap without negative rules.",
      "Optimizing bids without consolidating duplicate keywords.",
    ],
    faqs: [
      {
        question: "How do I fix keyword cannibalization-",
        answer:
          "Use negatives, consolidate ad groups, and define clear intent-based routing so queries map to one primary campaign.",
      },
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
    example:
      "If eligible impressions are 100,000 and you miss 20,000 due to budget, loss (budget) is 20%.",
    bullets: [
      "Increase budget only when marginal ROAS/profit supports it.",
      "If you are budget-limited, prioritize high-intent segments first.",
      "Track alongside impression share lost (rank) to separate budget vs quality issues.",
    ],
    mistakes: [
      "Raising budget without confirming incremental returns.",
      "Ignoring auction volatility and seasonality when interpreting loss.",
    ],
    faqs: [
      {
        question: "Should I always reduce impression share lost (budget)-",
        answer:
          "Only if incremental profit supports it. A lower loss is not worth it if marginal ROAS falls below target.",
      },
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
    example:
      "Improving ad relevance and CTR history can lift expected CTR in auctions.",
    bullets: [
      "Improve expected CTR by matching intent and refreshing creative angles.",
      "Compare within similar placements and query intent, not across everything.",
      "Use CTR trends with conversion rate to avoid optimizing for clicks only.",
    ],
    mistakes: [
      "Comparing expected CTR across very different keywords or match types.",
      "Chasing clicks with low-intent creative that hurts CVR.",
    ],
    faqs: [
      {
        question: "Is expected CTR the same as actual CTR-",
        answer:
          "No. Expected CTR is a model-based quality estimate used in auctions, while actual CTR is what you observe in reporting.",
      },
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
  },
  {
    slug: "ad-relevance",
    title: "Ad Relevance",
    description:
      "Ad relevance measures how well your ad matches a user's intent and query/context. Higher relevance tends to improve CTR and efficiency.",
    example:
      "A search ad that mirrors the user's query and shows the exact product page tends to score higher.",
    bullets: [
      "Align headlines and first screen of landing page with the same promise.",
      "Use intent-specific ad groups or audiences to avoid mixed messaging.",
      "Refresh copy when CTR drops to keep relevance signals healthy.",
    ],
    mistakes: [
      "Sending mixed-intent traffic to one generic ad and landing page.",
      "Over-optimizing for CTR while reducing conversion quality.",
    ],
    faqs: [
      {
        question: "Is ad relevance the same as quality score-",
        answer:
          "It is one input. Quality score also considers expected CTR and landing page experience.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "landing-page-experience",
    title: "Landing Page Experience",
    description:
      "Landing page experience reflects how helpful and relevant your landing page is for the user, impacting conversion and quality in many ad platforms.",
    example:
      "A page that matches the ad promise, loads fast, and answers key objections tends to score higher.",
    bullets: [
      "Match the ad promise and reduce friction (speed, clarity, strong CTA).",
      "Optimize for post-click outcomes (CVR and profit), not only bounce rate.",
      "Ensure mobile experience is clean; most paid traffic is mobile.",
    ],
    mistakes: [
      "Sending all traffic to a generic homepage with weak message match.",
      "Ignoring page speed and mobile usability issues.",
    ],
    faqs: [
      {
        question: "How do I improve landing page experience quickly-",
        answer:
          "Start with message match, speed improvements, and a clear primary CTA. Then test variations using conversion rate data.",
      },
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
    example:
      "If your target ROAS is 4.0x, the platform aims to return $4 in value for each $1 spent.",
    bullets: [
      "Use consistent conversion value rules (refunds and discounts matter).",
      "Validate with marginal ROAS and incrementality as spend scales.",
      "Start with a realistic target based on break-even and margin goals.",
    ],
    mistakes: [
      "Setting a target ROAS above what your funnel can sustain and starving delivery.",
      "Changing target ROAS too often and resetting learning.",
    ],
    faqs: [
      {
        question: "How do I choose a target ROAS-",
        answer:
          "Start from contribution margin to compute break-even ROAS, then add a profit buffer. Revisit the target when margins or return rates change.",
      },
    ],
    relatedGuideSlugs: ["marginal-roas-guide", "attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["target-roas-calculator", "marginal-roas-calculator"],
  },
  {
    slug: "target-cpa-bidding",
    title: "Target CPA Bidding",
    description:
      "Target CPA bidding tries to get as many conversions as possible at or below a target cost per acquisition. It relies on stable conversion definitions and volume.",
    example:
      "If your target CPA is $80, the platform bids to keep average CPA near $80.",
    bullets: [
      "Set targets from unit economics, not from historic averages alone.",
      "Watch for quality drift: cheaper conversions can be lower value.",
      "Use stable conversion definitions so the model can learn.",
      "Segment by funnel stage if lead quality differs materially.",
    ],
    mistakes: [
      "Setting a target CPA below break-even and starving delivery.",
      "Changing targets too frequently and resetting learning.",
      "Judging performance without a conversion lag window.",
    ],
    faqs: [
      {
        question: "How do I choose a target CPA-",
        answer:
          "Start from your allowable CAC based on LTV and payback, then test a realistic target and adjust with marginal performance data.",
      },
      {
        question: "Should I use the same target CPA across campaigns-",
        answer:
          "Only if conversion value is similar. If lead quality differs by channel or audience, set separate targets.",
      },
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
      "Set pacing guards for seasonality (promo weeks vs baseline weeks).",
    ],
    mistakes: [
      "Using aggressive daily caps that throttle high-performing periods.",
      "Changing pacing mid-campaign without tracking conversion lag impact.",
    ],
    faqs: [
      {
        question: "Should pacing be even or front-loaded-",
        answer:
          "Even pacing is safer for stable performance. Front-load only when you have proven seasonality or short windows.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "dayparting",
    title: "Dayparting",
    description:
      "Dayparting schedules when ads can run (hours/days) to focus spend on higher-performing times, but it can bias learning and measurement.",
    example:
      "You pause ads overnight and run only 8am-8pm when sales teams can respond to leads.",
    bullets: [
      "Use dayparting only after validating stable time-of-day patterns.",
      "Consider operations constraints (sales coverage, support) for lead gen.",
      "Re-check performance after seasonal changes or creative updates.",
    ],
    mistakes: [
      "Using dayparting too early and starving the learning phase.",
      "Assuming historical time-of-day performance will stay stable.",
    ],
    faqs: [
      {
        question: "When does dayparting help most-",
        answer:
          "When you have clear, stable performance differences by hour and limited budget or sales coverage windows.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-bidding-budgeting-hub-guide"],
  },
  {
    slug: "creative-angle",
    title: "Creative Angle",
    description:
      "A creative angle is the core message or positioning used to persuade a specific audience (for example speed, price, risk reduction, social proof).",
    example:
      "One angle highlights speed, another highlights risk reversal with a guarantee.",
    bullets: [
      "Test angles systematically; keep targeting stable while testing creative.",
      "Write landing pages to support the same angle (message match).",
      "Document results so the team learns which angles scale.",
    ],
    mistakes: [
      "Changing angle and offer at the same time (no clear signal).",
      "Using one angle across audiences with different pain points.",
    ],
    faqs: [
      {
        question: "How many angles should I test at once-",
        answer:
          "Start with 2-3 distinct angles, then expand the winner with variations on hook and proof.",
      },
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
      "Compare hook rate by audience to see which segments respond to the opener.",
    ],
    mistakes: [
      "Optimizing hook rate without confirming downstream conversion quality.",
      "Comparing hook rates across platforms with different definitions.",
    ],
    faqs: [
      {
        question: "What is a good hook rate-",
        answer:
          "It depends on format and platform. Use your historical baseline and focus on trend direction after changes.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "thumbstop-rate",
    title: "Thumbstop Rate",
    description:
      "Thumbstop rate is a creative metric for paid social that estimates how many users stop scrolling and pay attention to your ad (definitions vary by platform).",
    example:
      "If 10,000 people see a video and 2,200 watch long enough to count as a thumbstop, the rate is 22%.",
    bullets: [
      "Treat it as an input to CTR; it is not the business outcome.",
      "Use it to detect creative fatigue before CPA worsens.",
      "Compare thumbstop across similar placements and formats.",
    ],
    mistakes: [
      "Optimizing for thumbstop while ignoring conversion quality.",
      "Comparing rates across platforms with different definitions.",
    ],
    faqs: [
      {
        question: "What is a good thumbstop rate-",
        answer:
          "It depends on platform and format. Use your historical baseline and focus on trend direction.",
      },
    ],
    relatedGuideSlugs: ["frequency-creative-fatigue-guide"],
  },
  {
    slug: "conversion-lift-test",
    title: "Conversion Lift Test",
    description:
      "A conversion lift test compares a control group (not exposed) with a test group (exposed) to estimate true incremental impact beyond attribution.",
    example:
      "Exposed users convert at 2.4% vs control at 2.0%, implying a 0.4-point lift.",
    bullets: [
      "Use holdouts when attribution is biased (retargeting, branded search).",
      "Define success metrics before the test and use enough duration for conversion lag.",
      "Balance sample sizes and check baseline conversion rates for parity.",
      "Lock creative and audience definitions to avoid leakage between test and control.",
      "Track both incremental conversions and incremental revenue if AOV differs by group.",
      "Confirm randomization and avoid overlap across experiments running at the same time.",
    ],
    mistakes: [
      "Running tests without enough sample size to detect the target lift.",
      "Changing creative or offers mid-test and contaminating results.",
      "Comparing results without checking that control and test groups stayed balanced.",
      "Stopping early after a few good days and overestimating lift.",
      "Using mismatched attribution windows between control and test groups.",
    ],
    faqs: [
      {
        question: "How long should a conversion lift test run-",
        answer:
          "Long enough to cover conversion lag and reach the planned sample size. Short tests often overstate lift due to noise.",
      },
      {
        question: "What should I do if lift is negative-",
        answer:
          "Validate the test design and confidence intervals first. If results hold, revisit targeting, creative, and offer fit before scaling.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "geo-holdout",
    title: "Geo Holdout",
    description:
      "A geo holdout is an incrementality test that turns ads off in selected geographies and compares outcomes versus similar geographies where ads remain on.",
    example:
      "You pause ads in two matched regions and compare sales to two regions where ads continue.",
    bullets: [
      "Match geos by baseline demand and seasonality; otherwise results are noisy.",
      "Use longer windows for longer sales cycles or higher conversion lag.",
      "Control for distribution changes, pricing changes, or competitor shocks.",
      "Use multiple matched pairs to reduce volatility from local events.",
      "Confirm media weight is large enough to create a measurable delta.",
      "Run a pre-period to confirm the geos track closely before the test.",
    ],
    mistakes: [
      "Using too few regions and over-interpreting noise.",
      "Choosing geos with different baseline demand patterns.",
      "Letting organic or PR spikes in a single region distort outcomes.",
      "Changing budgets outside the test and masking the true lift.",
    ],
    faqs: [
      {
        question: "When is geo holdout better than user-level holdout-",
        answer:
          "Geo holdout is useful when user-level holdout is not possible or when you need to test broader regional impact. It requires careful geo matching.",
      },
      {
        question: "How long should a geo holdout test run-",
        answer:
          "Long enough to cover conversion lag and typical seasonality. Longer cycles and low-volume markets require longer tests.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
    relatedCalculatorSlugs: ["incrementality-lift-calculator"],
  },
  {
    slug: "psa-test",
    title: "PSA Test",
    description:
      "A PSA (public service announcement) test replaces your ads with neutral ads to estimate incrementality while keeping auction dynamics similar.",
    example:
      "Instead of pausing ads, you serve a neutral PSA creative to a holdout group and compare conversions.",
    bullets: [
      "Useful when you cannot fully turn off ads without affecting auctions.",
      "Interpret with care; PSA design and audience leakage can bias results.",
      "Ensure the PSA creative is neutral and does not change user intent.",
    ],
    mistakes: [
      "Using a PSA that attracts clicks and contaminates the control group.",
      "Running tests too short to cover conversion lag.",
    ],
    faqs: [
      {
        question: "When should I use a PSA test-",
        answer:
          "Use PSA tests when turning off ads would change auction dynamics or when you need a controlled holdout without losing bidding data.",
      },
    ],
    relatedGuideSlugs: ["attribution-incrementality-guide"],
  },
  {
    slug: "lift-study",
    title: "Lift Study",
    description:
      "A lift study measures incremental impact by comparing exposed vs control groups (or regions) under a test design, often run by ad platforms.",
    example:
      "A platform reports +12% incremental conversions at 90% confidence in a lift study.",
    bullets: [
      "Define primary metric (incremental conversions, revenue) before running.",
      "Use lift alongside MER and marginal ROAS for budget decisions.",
      "Check confidence intervals before making large budget shifts.",
      "Validate experiment design (randomization, holdout %) before launch.",
      "Use the same attribution window in pre and post periods for a clean read.",
      "Document test settings so future studies are comparable.",
    ],
    mistakes: [
      "Reading lift as causal without proper randomization.",
      "Ignoring small sample sizes that make results unstable.",
      "Mixing multiple objectives (clicks and purchases) in the same test.",
      "Assuming lift is durable without re-testing after major changes.",
      "Reallocating spend before the test is complete.",
    ],
    faqs: [
      {
        question: "Can lift studies be compared across platforms-",
        answer:
          "Only if the test design, audience, and success metric are comparable. Otherwise treat them as directional inputs, not absolute truth.",
      },
      {
        question: "How large should the holdout be-",
        answer:
          "Large enough to detect the expected lift with confidence. Many platforms recommend a 10-20% holdout, but it depends on volume.",
      },
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
    example:
      "Test two hooks with the same offer and audience to isolate the creative effect.",
    bullets: [
      "Test one variable at a time to isolate the driver (hook, offer, format).",
      "Use enough spend to reach stable CTR and conversion signals.",
      "Document results and reuse winning angles across channels.",
      "Rotate fresh concepts before frequency spikes to avoid fatigue.",
    ],
    mistakes: [
      "Calling a winner after a few clicks without conversion data.",
      "Changing multiple variables at once and losing signal clarity.",
      "Comparing creatives with different landing pages or offers.",
      "Ignoring negative signal from high CTR but low conversion rate.",
    ],
    faqs: [
      {
        question: "How long should a creative test run-",
        answer:
          "Run until you hit a stable conversion sample size and cover typical conversion lag. Avoid ending on short-term spikes.",
      },
    ],
    relatedGuideSlugs: ["paid-ads-creative-landing-playbook-guide"],
  },
  {
    slug: "ad-fatigue",
    title: "Ad Fatigue",
    description:
      "Ad fatigue happens when an audience sees the same creative too often and performance declines.",
    updatedAt: "2026-01-28",
    example:
      "CTR drops from 1.8% to 0.9% as frequency climbs from 2.5 to 6.0.",
    bullets: [
      "Watch frequency and CTR trends to spot fatigue early.",
      "Rotate new hooks and offers before CPA worsens.",
      "Segment by audience size; small retargeting pools fatigue faster.",
    ],
    mistakes: [
      "Letting frequency climb without refreshing creative.",
      "Pausing too early without confirming that fatigue, not targeting, is the issue.",
      "Reusing the same creative angle across all placements.",
    ],
    faqs: [
      {
        question: "How do I know if fatigue is the real problem-",
        answer:
          "Look for rising frequency alongside falling CTR or CVR. If performance drops without frequency changes, the issue may be targeting or offer fit.",
      },
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
    example:
      "If 120 conversions are incremental out of 400 total, incremental conversion rate is 30%.",
    bullets: [
      "Estimate with holdout or lift tests instead of attribution alone.",
      "Use the rate to adjust reported ROAS to true incremental ROAS.",
      "Track it by channel; incrementality varies by intent and audience.",
      "Track by cohort and audience maturity to avoid overstating new-user impact.",
      "Recalculate after creative, offer, or bidding changes that alter user mix.",
      "Report confidence intervals to reflect test uncertainty.",
      "Use the rate to set scaling thresholds for incremental profit.",
    ],
    mistakes: [
      "Assuming last-click conversions are all incremental.",
      "Ignoring conversion lag when measuring incremental impact.",
      "Using short windows that miss delayed conversions.",
      "Comparing incremental rate across channels with different test designs.",
      "Treating small lift tests as definitive for large budget shifts.",
      "Ignoring differences in average order value across test groups.",
    ],
    faqs: [
      {
        question: "How is incremental conversion rate different from CVR-",
        answer:
          "CVR is conversions per click or visit. Incremental conversion rate is the share of conversions that are truly caused by ads after removing what would have happened anyway.",
      },
      {
        question: "How often should I re-estimate incrementality-",
        answer:
          "Re-test after major changes in budget, targeting, creative, or seasonality, and on a regular cadence if spend is large.",
      },
      {
        question: "Can incremental conversion rate be above 100%-",
        answer:
          "No. It is a share of conversions attributed to lift, so it should be between 0% and 100% within measurement error.",
      },
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
    example:
      "A 2s LCP page converts better than a 5s LCP page at the same traffic quality.",
    bullets: [
      "Measure on mobile first; most paid traffic is mobile.",
      "Speed improvements compound with creative and offer wins.",
      "Track Core Web Vitals to catch regression after releases.",
      "Audit third-party tags; they often cause the biggest slowdowns.",
    ],
    mistakes: [
      "Optimizing only time-to-first-byte while LCP remains slow.",
      "Ignoring page weight from analytics tags and heavy images.",
      "Testing speed on desktop only while mobile traffic dominates.",
      "Launching new scripts without measuring impact on LCP and CLS.",
    ],
    faqs: [
      {
        question: "What speed metric matters most for conversion-",
        answer:
          "LCP is a strong proxy for perceived load speed. Use it with TTFB and CLS to diagnose issues.",
      },
      {
        question: "How much does speed improvement matter-",
        answer:
          "Even small improvements can lift conversion rate, especially on mobile. Measure lift with a controlled test when possible.",
      },
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
    example:
      "Shift 10% of budget from a high-CPA prospecting campaign to a higher-margin retargeting campaign after verifying incrementality.",
    bullets: [
      "Use marginal ROAS, not blended ROAS, to guide shifts.",
      "Move budget gradually to avoid learning phase resets.",
      "Set guardrails to protect high-performing evergreen campaigns.",
      "Validate tracking before reallocating large budgets.",
      "Check inventory limits; scaling a saturated audience can raise CPM and hurt ROAS.",
      "Document the reason for each shift so you can audit outcomes later.",
      "Review creative readiness so new budget has fresh assets to scale.",
    ],
    mistakes: [
      "Over-rotating weekly and destabilizing delivery.",
      "Moving spend without validating tracking quality changes.",
      "Reallocating to channels with saturated audiences and low incrementality.",
      "Chasing short-term ROAS spikes that do not scale.",
      "Ignoring seasonality and attribution lag when shifting budgets.",
    ],
    faqs: [
      {
        question: "How fast should budget be reallocated-",
        answer:
          "Make small, staged shifts and wait for performance to stabilize before moving more. Large swings often reset learning and add noise.",
      },
      {
        question: "Should I reallocate based on last-click ROAS-",
        answer:
          "Use last-click only as a directional signal. Validate with incrementality or blended MER before making large shifts.",
      },
      {
        question: "How do I avoid destabilizing learning-",
        answer:
          "Change budgets in small steps, avoid moving multiple levers at once, and wait for performance to stabilize before making further shifts.",
      },
      {
        question: "What is a safe first step for reallocation-",
        answer:
          "Start with a 5-10% shift, then hold for a full conversion lag window before adjusting again.",
      },
      {
        question: "What should I watch after a reallocation-",
        answer:
          "Monitor marginal ROAS, CPM, and conversion volume for at least one lag window to confirm stability.",
      },
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
    example:
      "Separate prospecting and retargeting into different campaigns so budgets do not compete.",
    bullets: [
      "Keep structure simple unless you have clear audience or offer differences.",
      "Separate prospecting and retargeting to avoid budget leakage.",
      "Align naming conventions with reporting to reduce analysis friction.",
    ],
    mistakes: [
      "Fragmenting spend across too many small ad sets.",
      "Mixing very different conversion goals in one campaign.",
      "Changing structure too often and resetting learning.",
    ],
    faqs: [
      {
        question: "How many campaigns should I have-",
        answer:
          "As few as possible while preserving key segmentation (prospecting vs retargeting, major offers, or regions).",
      },
    ],
    relatedGuideSlugs: ["paid-ads-measurement-hub-guide"],
  },
  {
    slug: "utm-governance",
    title: "UTM Governance",
    description:
      "UTM governance is the discipline of consistent naming, required fields, and QA for campaign tracking parameters.",
    updatedAt: "2026-01-28",
    example:
      "Use a shared template: utm_source=google&utm_medium=cpc&utm_campaign=brand_us.",
    bullets: [
      "Use a naming convention and enforce it with templates.",
      "Audit UTMs regularly to prevent broken attribution.",
      "Require UTMs for all paid and owned links to reduce direct traffic noise.",
    ],
    mistakes: [
      "Letting campaign naming drift across teams or agencies.",
      "Changing UTM definitions mid-quarter and breaking reporting.",
      "Using inconsistent casing or separators that fragment reporting.",
    ],
    faqs: [
      {
        question: "Do UTMs affect SEO-",
        answer:
          "Not if canonicals are set correctly. Always canonicalize to the clean URL without UTMs.",
      },
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
