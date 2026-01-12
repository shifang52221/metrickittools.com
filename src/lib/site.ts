export const siteConfig = {
  name: "MetricKit",
  description:
    "Fast, free calculators for SaaS metrics and paid ads. Clear formulas, explanations, and examples - built for founders, marketers, and operators.",
  siteUrl: (() => {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl;
    if (process.env.NODE_ENV === "development") return "http://localhost:3000";
    throw new Error(
      "Missing NEXT_PUBLIC_SITE_URL (required in production for canonical URLs + sitemap).",
    );
  })(),
  email: "admin@metrickittools.com",
} as const;
