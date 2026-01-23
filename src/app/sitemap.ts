import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/calculators";
import { guides } from "@/lib/guides";
import { glossaryTerms } from "@/lib/glossary";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/guides",
    "/glossary",
  ].map((path) => ({
    url: path === "/" ? siteConfig.siteUrl : `${siteConfig.siteUrl}${path}`,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${siteConfig.siteUrl}/${c.slug}`,
  }));

  const calculatorRoutes = calculators.map((c) => ({
    url: `${siteConfig.siteUrl}/${c.category}/${c.slug}`,
  }));

  const guideRoutes = guides.map((g) => ({
    url: `${siteConfig.siteUrl}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
  }));

  const glossaryRoutes = glossaryTerms.map((t) => ({
    url: `${siteConfig.siteUrl}/glossary/${t.slug}`,
    lastModified: new Date(t.updatedAt),
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...calculatorRoutes,
    ...guideRoutes,
    ...glossaryRoutes,
  ];
}
