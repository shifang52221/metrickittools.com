import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { AdUnit } from "@/components/ads/AdUnit";
import { getAdSenseSlot } from "@/lib/adsense";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Practical guides for SaaS metrics and paid ads: definitions, formulas, benchmarks, and pitfalls.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Guides",
    description:
      "Practical guides for SaaS metrics and paid ads: definitions, formulas, benchmarks, and pitfalls.",
    url: "/guides",
    type: "website",
  },
};

export default function GuidesIndexPage() {
  const byCategory = (cat: string) => guides.filter((g) => g.category === cat);
  const paidAds = byCategory("paid-ads");
  const saas = byCategory("saas-metrics");
  const finance = byCategory("finance");

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Guides
        </h1>
        <p className="max-w-2xl text-pretty text-zinc-600 dark:text-zinc-400">
          Practical, opinionated explanations to help you interpret metrics and
          avoid common mistakes.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">How to use these guides</h2>
        <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
          <li>Start with the guide that matches your decision (bidding, payback, retention, runway).</li>
          <li>Use formulas as a baseline, then validate assumptions with your data.</li>
          <li>Prefer cohort and segment views over blended averages when diagnosing issues.</li>
          <li>Use the linked calculators to sanity-check targets and break-even points.</li>
          <li>Watch common pitfalls (time windows, denominators, attribution bias) before changing budgets.</li>
          <li>Bookmark the hubs for ongoing operations (retention/churn, unit economics, measurement).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Paid ads</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paidAds.map((g) => (
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
      </section>

      <AdUnit slot={getAdSenseSlot("guidesIndexMid")} />

      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">SaaS metrics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saas.map((g) => (
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
      </section>

      {finance.length ? (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Finance</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {finance.map((g) => (
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
        </section>
      ) : null}
    </div>
  );
}
