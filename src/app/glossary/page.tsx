import type { Metadata } from "next";
import Link from "next/link";
import { glossaryTerms } from "@/lib/glossary";

export const metadata: Metadata = {
  title: "Glossary",
  description:
    "Definitions for SaaS metrics, paid ads metrics, and finance terms - with formulas, examples, and common mistakes.",
  alternates: { canonical: "/glossary" },
  openGraph: {
    title: "Glossary",
    description:
      "Definitions for SaaS metrics, paid ads metrics, and finance terms - with formulas, examples, and common mistakes.",
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

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
        Tip: use <Link className="underline" href="/search">Search</Link> for
        calculators and guides, or browse terms below.
      </div>

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

