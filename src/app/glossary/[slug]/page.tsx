import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculators, categories } from "@/lib/calculators";
import { guides } from "@/lib/guides";
import { getGlossaryTerm, glossaryTerms } from "@/lib/glossary";
import { getGlossaryPageModules } from "@/lib/glossary/pageModules";
import { clampMetaDescription } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTerm(slug);
  if (!term) return {};
  const metaTitle = term.seo?.title ?? `${term.title} definition`;
  const metaDescription = clampMetaDescription(term.seo?.description ?? term.description);
  return {
    title: term.seo?.title ? { absolute: metaTitle } : metaTitle,
    description: metaDescription,
    alternates: { canonical: `/glossary/${term.slug}` },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
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

  const relatedCalcs = [
    ...(term.relatedCalculatorSlugs ?? [])
      .map((s) => calculators.find((c) => c.slug === s))
      .filter((c): c is (typeof calculators)[number] => Boolean(c)),
    ...calculators.filter((c) => (c.relatedGlossarySlugs ?? []).includes(term.slug)),
  ].filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i);

  const relatedGuides = [
    ...(term.relatedGuideSlugs ?? [])
      .map((s) => guides.find((g) => g.slug === s))
      .filter((g): g is (typeof guides)[number] => Boolean(g)),
    ...guides.filter((g) => (g.relatedGlossarySlugs ?? []).includes(term.slug)),
  ].filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i);

  const pageModules = getGlossaryPageModules(term, {
    relatedCalculators: relatedCalcs,
    relatedGuides,
  });

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
        {term.seo?.heroNote ? (
          <p className="max-w-3xl rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            {term.seo.heroNote}
          </p>
        ) : null}
        {term.seo?.nextStepLabel && term.seo.nextStepHref ? (
          <div>
            <Link
              href={term.seo.nextStepHref}
              className="inline-flex items-center rounded-full border border-zinc-900 px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-900 hover:text-white dark:border-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
            >
              {term.seo.nextStepLabel}
            </Link>
          </div>
        ) : null}
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

          {pageModules.map((module) => (
            <section key={module.key} className="space-y-3">
              <h2 className="text-lg font-semibold tracking-tight">{module.title}</h2>
              {module.items.length === 1 ? (
                <p className="text-pretty text-zinc-700 dark:text-zinc-300">
                  {module.items[0]}
                </p>
              ) : (
                <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
                  {module.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {relatedCalcs.length || relatedGuides.length ? (
            <>
              <h2 className="text-lg font-semibold tracking-tight">
                Where to use this on MetricKit
              </h2>
              <div className="space-y-4">
                {relatedCalcs.length ? (
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Calculators</h3>
                    <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
                      {relatedCalcs.slice(0, 5).map((c) => (
                        <li key={c.slug}>
                          <Link className="underline" href={`/${c.category}/${c.slug}`}>
                            {c.title}
                          </Link>
                          {`: ${c.description}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {relatedGuides.length ? (
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Guides</h3>
                    <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
                      {relatedGuides.slice(0, 5).map((g) => (
                        <li key={g.slug}>
                          <Link className="underline" href={`/guides/${g.slug}`}>
                            {g.title}
                          </Link>
                          {`: ${g.description}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
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
              <span className="text-zinc-400">-</span>
              <Link className="underline" href="/saas-metrics">
                SaaS metrics calculators
              </Link>
              <span className="text-zinc-400">-</span>
              <Link className="underline" href="/paid-ads">
                Paid ads calculators
              </Link>
              <span className="text-zinc-400">-</span>
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
