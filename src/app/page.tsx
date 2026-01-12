import Link from "next/link";
import { CalculatorCard } from "@/components/site/CalculatorCard";
import { calculators, categories } from "@/lib/calculators";
import { siteConfig } from "@/lib/site";
import { AdUnit } from "@/components/ads/AdUnit";

export default function Home() {
  const featured = calculators.filter((c) => c.featured).slice(0, 6);

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
          Free SaaS metrics & paid ads calculators
        </h1>
        <p className="max-w-2xl text-pretty text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {siteConfig.name} helps you quickly compute CAC, LTV, ROAS, payback
          period, and more - with clear formulas and assumptions.
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="rounded-full border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
            >
              {cat.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Popular calculators
          </h2>
          <Link
            href="/saas-metrics"
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Browse all {"\u2192"}
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <CalculatorCard key={c.slug} calc={c} />
          ))}
        </div>
      </section>

      <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID} />

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
        <h2 className="text-lg font-semibold tracking-tight">What you get</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-400">
          <li>Clear formulas and assumptions (so results are explainable).</li>
          <li>No login required.</li>
          <li>Fast pages and simple navigation.</li>
        </ul>
      </section>
    </div>
  );
}
