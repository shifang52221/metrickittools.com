import type { CalculatorCategorySlug } from "@/lib/calculators/types";

export type CategoryTaskLink = {
  label: string;
  href: string;
};

export type CategoryTask = {
  title: string;
  description: string;
  primary: CategoryTaskLink;
  secondary?: CategoryTaskLink[];
};

export type CategoryTaskGroup = {
  title: string;
  description: string;
  tasks: CategoryTask[];
};

export type CategoryHubContent = {
  audience: string;
  intro: string[];
  taskGroups: CategoryTaskGroup[];
  checklist: string[];
};

const categoryHubContent: Record<CalculatorCategorySlug, CategoryHubContent> = {
  "saas-metrics": {
    audience: "SaaS founders, finance partners, RevOps, and growth teams.",
    intro: [
      "Start with the operating question, not the metric name. Most SaaS teams are trying to judge growth quality, payback, retention, or capital efficiency.",
      "Choose the task below, then jump into the calculator or guide that gets you to a practical decision fastest.",
    ],
    taskGroups: [
      {
        title: "Acquisition and payback",
        description:
          "Use these when you need to understand whether new growth is creating value or just consuming cash faster.",
        tasks: [
          {
            title: "Check if acquisition is really paying back",
            description:
              "Move past headline CAC and see whether the company earns its acquisition spend back on a realistic timeline.",
            primary: {
              label: "Open CAC payback calculator",
              href: "/saas-metrics/cac-payback-period-calculator",
            },
            secondary: [
              {
                label: "Read fully-loaded CAC guide",
                href: "/guides/fully-loaded-cac-guide",
              },
              {
                label: "Use fully-loaded CAC calculator",
                href: "/saas-metrics/fully-loaded-cac-calculator",
              },
            ],
          },
          {
            title: "Model unit economics end to end",
            description:
              "Bring CAC, LTV, payback, and margin into one view before you change spend targets or growth plans.",
            primary: {
              label: "Read unit economics guide",
              href: "/guides/unit-economics-guide",
            },
            secondary: [
              {
                label: "Open unit economics calculator",
                href: "/saas-metrics/unit-economics-calculator",
              },
              {
                label: "Open LTV:CAC calculator",
                href: "/saas-metrics/ltv-to-cac-calculator",
              },
            ],
          },
        ],
      },
      {
        title: "Retention and growth quality",
        description:
          "Use these when top-line growth looks fine but you still need to understand whether users and revenue are actually sticking.",
        tasks: [
          {
            title: "See whether recurring revenue is holding up",
            description:
              "Check retention quality before you trust blended growth or aggressive acquisition targets.",
            primary: {
              label: "Open NRR calculator",
              href: "/saas-metrics/nrr-calculator",
            },
            secondary: [
              {
                label: "Open GRR calculator",
                href: "/saas-metrics/grr-calculator",
              },
              {
                label: "Read unit economics dashboard guide",
                href: "/guides/unit-economics-dashboard-guide",
              },
            ],
          },
          {
            title: "Check whether usage is habit or just signups",
            description:
              "Use stickiness metrics when activation is fine on paper but the product still does not feel meaningfully engaged.",
            primary: {
              label: "Read DAU/MAU guide",
              href: "/guides/dau-mau-guide",
            },
            secondary: [
              {
                label: "Open DAU/MAU calculator",
                href: "/saas-metrics/dau-mau-calculator",
              },
              {
                label: "Read unit economics hub guide",
                href: "/guides/unit-economics-hub-guide",
              },
            ],
          },
        ],
      },
    ],
    checklist: [
      "Keep cohort, revenue basis, and time window consistent before comparing CAC, LTV, or retention.",
      "Separate acquisition efficiency from product retention so one blended ratio does not hide the real constraint.",
      "Use scenario-based planning when burn, payback, and runway all move together.",
    ],
  },
  "paid-ads": {
    audience:
      "Performance marketers, growth leads, and analytics teams managing spend against profit.",
    intro: [
      "Paid ads decisions get better when you start from the job to be done: set spend guardrails, diagnose creative and funnel weakness, or decide whether attribution is trustworthy enough to scale.",
      "Choose a task path first, then use the linked calculator or guide to go deeper.",
    ],
    taskGroups: [
      {
        title: "Scaling and profitability",
        description:
          "Use these when you are deciding how far to scale without hiding weak unit economics behind platform reporting.",
        tasks: [
          {
            title: "Set spend guardrails before you scale",
            description:
              "Translate margin targets into a usable ROAS threshold so budget decisions stay tied to contribution, not vanity metrics.",
            primary: {
              label: "Open break-even ROAS calculator",
              href: "/paid-ads/break-even-roas-calculator",
            },
            secondary: [
              {
                label: "Open ROAS calculator",
                href: "/paid-ads/roas-calculator",
              },
              {
                label: "Read paid ads measurement hub",
                href: "/guides/paid-ads-measurement-hub-guide",
              },
            ],
          },
          {
            title: "Watch diminishing returns as spend rises",
            description:
              "Use top-down and incremental lenses before you treat a stable platform ROAS as proof you should keep increasing budget.",
            primary: {
              label: "Open marginal ROAS calculator",
              href: "/paid-ads/marginal-roas-calculator",
            },
            secondary: [
              {
                label: "Open MER calculator",
                href: "/paid-ads/mer-calculator",
              },
              {
                label: "Read attribution vs incrementality guide",
                href: "/guides/attribution-incrementality-guide",
              },
            ],
          },
        ],
      },
      {
        title: "Creative and measurement diagnostics",
        description:
          "Use these when clicks, conversions, and reported attribution no longer tell a clean story on their own.",
        tasks: [
          {
            title: "Troubleshoot the funnel when clicks stop converting",
            description:
              "Work through the funnel from traffic quality to landing-page economics before blaming only the creative or the platform.",
            primary: {
              label: "Open paid ads funnel calculator",
              href: "/paid-ads/paid-ads-funnel-calculator",
            },
            secondary: [
              {
                label: "Open break-even CVR calculator",
                href: "/paid-ads/break-even-cvr-calculator",
              },
              {
                label: "Open break-even CPM calculator",
                href: "/paid-ads/break-even-cpm-calculator",
              },
            ],
          },
          {
            title: "Decide whether attribution is trustworthy",
            description:
              "Compare reporting models before you scale on a signal that might just be windowing, overlap, or retargeting bias.",
            primary: {
              label: "Read attribution vs incrementality guide",
              href: "/guides/attribution-incrementality-guide",
            },
            secondary: [
              {
                label: "Open incrementality lift calculator",
                href: "/paid-ads/incrementality-lift-calculator",
              },
              {
                label: "Read paid ads measurement hub",
                href: "/guides/paid-ads-measurement-hub-guide",
              },
            ],
          },
        ],
      },
    ],
    checklist: [
      "Keep attribution window, conversion definition, and revenue basis stable before comparing ROAS or CPA.",
      "Pair platform metrics with business metrics such as MER, margin, and incremental lift before scaling spend.",
      "Treat creative metrics as diagnostic inputs, not proof of profitable growth on their own.",
    ],
  },
  finance: {
    audience: "Founders, finance teams, operators, and investors making cash and valuation decisions.",
    intro: [
      "Finance work usually starts with one of two questions: how much time do we have, or what is the asset actually worth under a stated set of assumptions.",
      "Choose the task that matches the decision in front of you, then use the linked guide or calculator to go deeper.",
    ],
    taskGroups: [
      {
        title: "Cash and operating risk",
        description:
          "Use these when liquidity, burn, or debt-service pressure is changing faster than your static forecast.",
        tasks: [
          {
            title: "Estimate runway and burn pressure",
            description:
              "Translate burn into actual operating time, then test whether current cash and efficiency targets still give you enough room to act.",
            primary: {
              label: "Read runway and burn guide",
              href: "/guides/runway-burn-cash-guide",
            },
            secondary: [
              {
                label: "Open cash runway calculator",
                href: "/finance/cash-runway-calculator",
              },
              {
                label: "Open burn multiple calculator",
                href: "/saas-metrics/burn-multiple-calculator",
              },
            ],
          },
          {
            title: "Check debt service and downside flexibility",
            description:
              "Model payment burden and downside scenarios before you assume the current debt structure is operationally safe.",
            primary: {
              label: "Open loan payment calculator",
              href: "/finance/loan-payment-calculator",
            },
            secondary: [
              {
                label: "Open investment decision calculator",
                href: "/finance/investment-decision-calculator",
              },
              {
                label: "Read runway and burn guide",
                href: "/guides/runway-burn-cash-guide",
              },
            ],
          },
        ],
      },
      {
        title: "Valuation and fundraising",
        description:
          "Use these when the question is about valuation range, financing mechanics, dilution, or exit outcomes.",
        tasks: [
          {
            title: "Build or challenge a valuation range",
            description:
              "Start with the modeling workflow, then move into the calculator that matches whether you need base-case value or sensitivity work.",
            primary: {
              label: "Read valuation modeling hub",
              href: "/guides/valuation-modeling-hub-guide",
            },
            secondary: [
              {
                label: "Open DCF valuation calculator",
                href: "/finance/dcf-valuation-calculator",
              },
              {
                label: "Open DCF sensitivity calculator",
                href: "/finance/dcf-sensitivity-calculator",
              },
            ],
          },
          {
            title: "Model dilution and financing terms",
            description:
              "Compare round structure, SAFE and note conversion, and preference outcomes before negotiating or presenting scenarios.",
            primary: {
              label: "Read fundraising and valuation hub",
              href: "/guides/fundraising-valuation-hub-guide",
            },
            secondary: [
              {
                label: "Open SAFE conversion calculator",
                href: "/finance/safe-conversion-calculator",
              },
              {
                label: "Open liquidation preference calculator",
                href: "/finance/liquidation-preference-calculator",
              },
            ],
          },
        ],
      },
    ],
    checklist: [
      "Match dates across cash balances, debt balances, share counts, and valuation outputs before comparing scenarios.",
      "Document which claims, costs, or debt-like items are included so your team can reconcile results later.",
      "Run downside and sensitivity cases whenever the decision depends on uncertain timing or market assumptions.",
    ],
  },
};

export function getCategoryHubContent(
  category: CalculatorCategorySlug,
): CategoryHubContent {
  return categoryHubContent[category];
}
