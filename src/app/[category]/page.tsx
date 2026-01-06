import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorCard } from "@/components/site/CalculatorCard";
import { categories, getCalculatorsByCategory } from "@/lib/calculators";
import type { CalculatorCategorySlug } from "@/lib/calculators/types";
import { guides } from "@/lib/guides";
import { AdUnit } from "@/components/ads/AdUnit";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ category: string }> };

function isCategorySlug(value: string): value is CalculatorCategorySlug {
  return categories.some((c) => c.slug === value);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategorySlug(category)) return {};
  const cat = categories.find((c) => c.slug === category);
  return {
    title: cat?.title,
    description: cat?.description,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title: cat?.title,
      description: cat?.description,
      url: `/${category}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  if (!isCategorySlug(category)) notFound();

  const cat = categories.find((c) => c.slug === category)!;
  const calcs = getCalculatorsByCategory(category);
  const featured = calcs.filter((c) => c.featured).slice(0, 6);
  const relatedGuides = guides.filter((g) => g.category === category).slice(0, 6);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      ...calcs.map((c, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: c.title,
        url: `${siteConfig.siteUrl}/${c.category}/${c.slug}`,
      })),
      ...relatedGuides.map((g, index) => ({
        "@type": "ListItem",
        position: calcs.length + index + 1,
        name: g.title,
        url: `${siteConfig.siteUrl}/guides/${g.slug}`,
      })),
    ],
  };

  return (
    <div className="space-y-8">
      <JsonLd data={itemListLd} />
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {cat.title}
        </h1>
        <p className="max-w-2xl text-pretty text-zinc-600 dark:text-zinc-400">
          {cat.description}
        </p>
      </div>

      {featured.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Start here</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CalculatorCard key={c.slug} calc={c} />
            ))}
          </div>
        </section>
      ) : null}

      <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_MID} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">All calculators</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calcs.map((c) => (
            <CalculatorCard key={c.slug} calc={c} />
          ))}
        </div>
      </section>

      {relatedGuides.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">Guides</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-2xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
              >
                <div className="text-lg font-semibold tracking-tight hover:underline">
                  {g.title}
                </div>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {g.description}
                </div>
                <div className="mt-3 text-xs text-zinc-500">
                  Updated {g.updatedAt}
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/guides"
            className="inline-flex text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Browse all guides →
          </Link>
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
        Prefer a specific tool? Start with{" "}
        <Link className="underline" href="/saas-metrics/cac-calculator">
          CAC
        </Link>{" "}
        and{" "}
        <Link className="underline" href="/paid-ads/roas-calculator">
          ROAS
        </Link>
        .
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}
