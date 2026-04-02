import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorCard } from "@/components/site/CalculatorCard";
import { categories, getCalculatorsByCategory } from "@/lib/calculators";
import type { CalculatorCategorySlug } from "@/lib/calculators/types";
import { guides } from "@/lib/guides";
import { AdUnit } from "@/components/ads/AdUnit";
import { JsonLd } from "@/components/seo/JsonLd";
import { clampMetaDescription } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getCategoryHubContent } from "@/lib/content/categoryIntro";
import { getAdSenseSlot } from "@/lib/adsense";

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
  const financeTitle = "Finance calculators for runway, burn, and planning";
  const title = category === "finance" ? financeTitle : cat?.title;
  const metaDescription = clampMetaDescription(cat?.description);
  return {
    title: category === "finance" ? { absolute: financeTitle } : title,
    description: metaDescription,
    alternates: { canonical: `/${category}` },
    openGraph: {
      title,
      description: metaDescription,
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
  const hubContent = getCategoryHubContent(category);

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
        <div className="inline-flex rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          Best for {hubContent.audience}
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            How to use this hub
          </div>
          <div className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
            {hubContent.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
          <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
            Quick checks before you compare tools
          </div>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {hubContent.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Choose a task
          </h2>
          <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Start from the question you are trying to answer, then jump into the calculator or guide that gets you moving fastest.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {hubContent.taskGroups.map((group) => (
            <section
              key={group.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black"
            >
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                {group.title}
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {group.description}
              </p>

              <div className="mt-5 space-y-4">
                {group.tasks.map((task) => (
                  <div
                    key={task.title}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <h3 className="text-base font-semibold tracking-tight">
                      {task.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {task.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={task.primary.href}
                        className="inline-flex items-center rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                      >
                        {task.primary.label}
                      </Link>
                      {task.secondary?.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition hover:bg-white hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-black dark:hover:text-zinc-100"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

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

      <AdUnit slot={getAdSenseSlot("categoryMid")} />

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
            Browse all guides {"\u2192"}
          </Link>
        </section>
      ) : null}

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
        Prefer to browse instead of following a task path? Start with{" "}
        <Link className="underline" href="/saas-metrics/cac-calculator">
          CAC
        </Link>{" "}
        ,{" "}
        <Link className="underline" href="/paid-ads/roas-calculator">
          ROAS
        </Link>
        , or{" "}
        <Link className="underline" href="/finance/cash-runway-calculator">
          cash runway
        </Link>
        .
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}
