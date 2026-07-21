import type { Metadata } from "next";
import Link from "next/link";
import { guides } from "@/lib/guides";
import { AdUnit } from "@/components/ads/AdUnit";
import { getAdSenseSlot } from "@/lib/adsense";
import { guideDecisionPaths } from "@/lib/content/hubHighlights";

export const metadata: Metadata = {
  title: { absolute: "SaaS metrics and paid ads guides" },
  description:
    "Decision-oriented guides for SaaS metrics, paid ads, and finance: choose the right workflow, calculator, and assumptions for the problem you are solving.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "SaaS metrics and paid ads guides",
    description:
      "Decision-oriented guides for SaaS metrics, paid ads, and finance: choose the right workflow, calculator, and assumptions for the problem you are solving.",
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

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Start from the decision
          </h2>
          <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            Choose the business question first. Each path below connects the
            strongest existing guides so you can move from definition to
            interpretation without guessing where to start.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {guideDecisionPaths.map((path) => (
            <section
              key={path.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black"
            >
              <h3 className="text-lg font-semibold tracking-tight">
                {path.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {path.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={path.primary.href}
                  className="inline-flex items-center rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                >
                  {path.primary.label}
                </Link>
                {path.secondary?.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950 dark:hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

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
