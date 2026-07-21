import type { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/lib/glossary";
import { glossaryHubHighlightSlugs } from "@/lib/content/hubHighlights";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Core definitions for SaaS metrics, paid ads, and finance terms - with formulas, examples, common mistakes, and links to the right guides and calculators.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Glossary",
    description:
      "Core definitions for SaaS metrics, paid ads, and finance terms - with formulas, examples, common mistakes, and links to the right guides and calculators.",
    url: "/glossary",
    type: "website",
  },
};

function groupLabel(category: string) {
  if (category === "saas-metrics") return "SaaS metrics";
  if (category === "paid-ads") return "Paid ads";
  if (category === "finance") return "Finance";
  return category;
}

export default function GlossaryIndexPage() {
  const groups = new Map<string, typeof glossaryTerms>();
  for (const term of glossaryTerms) {
    const arr = groups.get(term.category) ?? [];
    arr.push(term);
    groups.set(term.category, arr);
  }

  const order = ["saas-metrics", "paid-ads", "finance"];
  const coreHighlights = glossaryHubHighlightSlugs
    .map((slug) => glossaryTerms.find((term) => term.slug === slug))
    .filter((term): term is (typeof glossaryTerms)[number] => Boolean(term));

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Glossary
        </h1>
        <p className="max-w-3xl text-pretty text-zinc-600 dark:text-zinc-400">
          Definitions for SaaS metrics, paid ads, and finance terms - with
          practical formulas, examples, and common mistakes.
        </p>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Core definitions to start with
          </h2>
          <p className="max-w-3xl text-sm text-zinc-600 dark:text-zinc-400">
            These are the definitions most often used to make a planning,
            retention, acquisition, or valuation decision. Start here, then
            follow the linked guide or calculator when the formula alone is
            not enough.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreHighlights.map((term) => (
            <Link
              key={term.slug}
              href={`/glossary/${term.slug}`}
              className="rounded-2xl border border-zinc-200 bg-white p-5 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
            >
              <div className="text-lg font-semibold tracking-tight hover:underline">
                {term.title}
              </div>
              <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {term.description}
              </div>
              <div className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Read definition and next steps {"\u2192"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
        Tip: use <Link className="underline" href="/search">Search</Link> for
        calculators and guides, or browse terms below.
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">How to use the glossary</h2>
        <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
          <li>Read the definition first, then check the formula (if applicable).</li>
          <li>Use the example to validate units and denominators.</li>
          <li>Scan common mistakes before you set targets or report results.</li>
          <li>Use related calculators to sanity-check break-even points and constraints.</li>
          <li>Use related guides for decision-making context (not just definitions).</li>
          <li>Keep your team&apos;s definitions consistent so trends remain comparable.</li>
        </ul>
      </section>

      <div className="space-y-8">
        {order
          .filter((k) => groups.get(k)?.length)
          .map((category) => {
            const terms = groups.get(category) ?? [];
            return (
              <section key={category} className="space-y-3">
                <h2 className="text-lg font-semibold tracking-tight">
                  {groupLabel(category)}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {terms.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/glossary/${t.slug}`}
                      className="rounded-2xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
                    >
                      <div className="font-semibold tracking-tight hover:underline">
                        {t.title}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {t.description}
                      </div>
                      <div className="mt-2 text-xs text-zinc-500">
                        Updated {t.updatedAt}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
      </div>
    </div>
  );
}
