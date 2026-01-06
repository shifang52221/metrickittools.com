import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/calculators";
import { guides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "/",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/guides",
  ].map((path) => ({
      url: `${siteConfig.siteUrl}${path}`,
      lastModified: now,
    }));

  const categoryRoutes = categories.map((c) => ({
    url: `${siteConfig.siteUrl}/${c.slug}`,
    lastModified: now,
  }));

  const calculatorRoutes = calculators.map((c) => ({
    url: `${siteConfig.siteUrl}/${c.category}/${c.slug}`,
    lastModified: now,
  }));

  const guideRoutes = guides.map((g) => ({
    url: `${siteConfig.siteUrl}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
  }));

  return [...staticRoutes, ...categoryRoutes, ...calculatorRoutes, ...guideRoutes];
}
