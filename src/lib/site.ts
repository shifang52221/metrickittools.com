export const siteConfig = {
  name: "MetricKit",
  publisherName: "MetricKit",
  editorialTeamName: "MetricKit Editorial",
  reviewTeamName: "MetricKit Editorial Review",
  description:
    "Fast, free calculators for SaaS metrics and paid ads. Clear formulas, explanations, and examples - built for founders, marketers, and operators.",
  siteUrl: (() => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl;
    if (process.env.NODE_ENV === "development") return "http://localhost:3000";
    return "https://metrickittools.com";
  })(),
  email: "admin@metrickittools.com",
  logoPath: "/logo.svg",
  language: "en-US",
  aboutPath: "/about",
  contactPath: "/contact",
  methodologyPath: "/methodology",
  editorialPolicyPath: "/editorial-policy",
  contentReviewDate: "2026-05-09",
  knowledgeAreas: [
    "SaaS metrics",
    "paid ads measurement",
    "finance and valuation",
    "unit economics",
    "calculator methodology",
  ],
} as const;

export function absoluteUrl(path: string = "/") {
  if (!path || path === "/") return siteConfig.siteUrl;
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
