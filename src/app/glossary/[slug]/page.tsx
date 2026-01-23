import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculators, categories } from "@/lib/calculators";
import { guides } from "@/lib/guides";
import { getGlossaryTerm, glossaryTerms } from "@/lib/glossary";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};
  return {
    title: `${term.title} definition`,
    description: term.description,
    alternates: { canonical: `/glossary/${term.slug}` },
    openGraph: {
      title: `${term.title} definition`,
      description: term.description,
      url: `/glossary/${term.slug}`,
      type: "article",
    },
  };
}

function labelForCategory(category: string) {
  return categories.find((c) => c.slug === category)?.title ?? category;
}

export default async function GlossaryTermPage({ params }: PageProps) {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) notFound();

  type Calculator = (typeof calculators)[number];
  type Guide = (typeof guides)[number];

  const relatedCalcs = (term.relatedCalculatorSlugs ?? [])
    .map((s) => calculators.find((c) => c.slug === s))
    .filter((c): c is Calculator => Boolean(c));

  const relatedGuides = (term.relatedGuideSlugs ?? [])
    .map((s) => guides.find((g) => g.slug === s))
    .filter((g): g is Guide => Boolean(g));

  const definedTermLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.title,
    description: term.description,
    inDefinedTermSet: `${siteConfig.siteUrl}/glossary`,
    url: `${siteConfig.siteUrl}/glossary/${term.slug}`,
  };

  return (
    <div className="space-y-8">
      <JsonLd data={definedTermLd} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Glossary", href: "/glossary" },
          { label: term.title, href: `/glossary/${term.slug}` },
        ]}
      />

      <header className="space-y-3">
        <div className="text-sm text-zinc-500">{labelForCategory(term.category)}</div>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {term.title}
        </h1>
        <p className="max-w-3xl text-pretty text-zinc-600 dark:text-zinc-400">
          {term.description}
        </p>
        <div className="text-sm text-zinc-500">Updated {term.updatedAt}</div>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <article className="space-y-6 lg:col-span-3">
          {term.sections.map((s, idx) => {
            if (s.type === "h2") {
              return (
                <h2 key={idx} className="text-lg font-semibold tracking-tight">
                  {s.text}
                </h2>
              );
            }
            if (s.type === "p") {
              return (
                <p key={idx} className="text-pretty text-zinc-700 dark:text-zinc-300">
                  {s.text}
                </p>
              );
            }
            return (
              <ul
                key={idx}
                className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300"
              >
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })}
        </article>

        <aside className="space-y-4 lg:col-span-2">
          {relatedCalcs.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
              <div className="text-sm font-medium">Related calculators</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedCalcs.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.category}/${c.slug}`}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {relatedGuides.length ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
              <div className="text-sm font-medium">Related guides</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {relatedGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    {g.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
            <div className="text-sm font-medium">Explore more</div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link className="underline" href="/guides">
                Guides
              </Link>
              <span className="text-zinc-400">·</span>
              <Link className="underline" href="/saas-metrics">
                SaaS metrics calculators
              </Link>
              <span className="text-zinc-400">·</span>
              <Link className="underline" href="/paid-ads">
                Paid ads calculators
              </Link>
              <span className="text-zinc-400">·</span>
              <Link className="underline" href="/finance">
                Finance calculators
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ slug: t.slug }));
}
