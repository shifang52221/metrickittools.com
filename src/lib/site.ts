export const siteConfig = {
  name: "MetricKit",
  description:
    "Fast, free calculators for SaaS metrics and paid ads. Clear formulas, explanations, and examples - built for founders, marketers, and operators.",
  siteUrl: (() => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl;
    if (process.env.NODE_ENV === "development") return "http://localhost:3000";
    return "https://www.metrickittools.com";
  })(),
  email: "admin@metrickittools.com",
} as const;
