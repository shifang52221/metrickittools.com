export type HubLink = {
  label: string;
  href: string;
};

export type GuideDecisionPath = {
  title: string;
  description: string;
  primary: HubLink;
  secondary?: HubLink[];
};

export const guideDecisionPaths: GuideDecisionPath[] = [
  {
    title: "Connect ARR, CAC, LTV, and payback",
    description:
      "Start here when you need a board-ready view of unit economics instead of one isolated SaaS metric.",
    primary: {
      label: "Read the unit economics guide",
      href: "/guides/unit-economics-guide",
    },
    secondary: [
      { label: "ARR guide", href: "/guides/arr-guide" },
      { label: "CAC guide", href: "/guides/cac-guide" },
    ],
  },
  {
    title: "Explain MRR movement and retention",
    description:
      "Use this path when recurring revenue changed and you need to separate new, expansion, contraction, churn, and forecast assumptions.",
    primary: {
      label: "Read the MRR forecast guide",
      href: "/guides/mrr-forecast-guide",
    },
    secondary: [
      { label: "Retention and churn hub", href: "/guides/retention-churn-hub-guide" },
      { label: "LTV guide", href: "/guides/ltv-guide" },
    ],
  },
  {
    title: "Judge acquisition efficiency",
    description:
      "Use this path when CAC, payback, or LTV:CAC looks off and you need to decide whether to scale, fix conversion, or improve retention.",
    primary: {
      label: "Read the CAC guide",
      href: "/guides/cac-guide",
    },
    secondary: [
      { label: "CAC payback guide", href: "/guides/cac-payback-guide" },
      { label: "Blended CAC guide", href: "/guides/blended-cac-guide" },
    ],
  },
  {
    title: "Set paid ads targets without fooling yourself",
    description:
      "Use this path when ROAS, MER, or marginal ROAS disagree and you need to separate blended health from next-dollar efficiency.",
    primary: {
      label: "Read the MER guide",
      href: "/guides/mer-guide",
    },
    secondary: [
      { label: "Target ROAS guide", href: "/guides/target-roas-guide" },
      { label: "ROAS guide", href: "/guides/roas-guide" },
    ],
  },
  {
    title: "Plan runway, burn, and valuation scenarios",
    description:
      "Use this path when cash timing, break-even plans, or valuation assumptions need a scenario model rather than a single-point answer.",
    primary: {
      label: "Read the cash runway guide",
      href: "/guides/cash-runway-guide",
    },
    secondary: [
      { label: "DCF sensitivity guide", href: "/guides/dcf-sensitivity-guide" },
      { label: "Runway and burn guide", href: "/guides/runway-burn-cash-guide" },
    ],
  },
];

export const glossaryHubHighlightSlugs = [
  "arr",
  "mrr",
  "cac",
  "ltv",
  "gross-margin",
  "payback-period",
  "roas",
  "mer",
  "net-debt",
] as const;
