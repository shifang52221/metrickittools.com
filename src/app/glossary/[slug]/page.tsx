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

  const relatedCalcs = [
    ...(term.relatedCalculatorSlugs ?? [])
      .map((s) => calculators.find((c) => c.slug === s))
      .filter((c): c is Calculator => Boolean(c)),
    ...calculators.filter((c) => (c.relatedGlossarySlugs ?? []).includes(term.slug)),
  ].filter((c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i);

  const relatedGuides = [
    ...(term.relatedGuideSlugs ?? [])
      .map((s) => guides.find((g) => g.slug === s))
      .filter((g): g is Guide => Boolean(g)),
    ...guides.filter((g) => (g.relatedGlossarySlugs ?? []).includes(term.slug)),
  ].filter((g, i, arr) => arr.findIndex((x) => x.slug === g.slug) === i);

  const whyThisMatters = (() => {
    if (term.category === "paid-ads") {
      return `This term matters because it affects how you interpret performance and make budget decisions. If you use inconsistent definitions or windows, ROAS/CPA can look "better" while profit gets worse.`;
    }
    if (term.category === "finance") {
      return `This term matters because cash timing and risk are usually the difference between a plan that works on paper and a plan that survives. Use consistent definitions so decisions are comparable over time.`;
    }
    return `This term matters because small changes compound in SaaS metrics. Use consistent definitions by cohort and segment so you can diagnose retention, payback, and growth quality.`;
  })();

  const checklistItems = (() => {
    const items: string[] = [
      `Write a 1-line definition for "${term.title}" that your team will use consistently.`,
      "Keep the time window consistent (weekly/monthly/quarterly) when comparing trends.",
      "Segment results (channel/plan/cohort) before drawing big conclusions from blended averages.",
    ];
    if (relatedCalcs.length) {
      items.push(
        `Use a calculator that references this term (e.g., ${relatedCalcs[0].title}) to sanity-check assumptions.`,
      );
    } else {
      items.push("Sanity-check with a related calculator from the same category on MetricKit.");
    }
    if (relatedGuides.length) {
      items.push(
        `Read the related guide (e.g., ${relatedGuides[0].title}) for context and common pitfalls.`,
      );
    } else {
      items.push("Document common pitfalls so the metric doesn't get gamed.");
    }
    return items.slice(0, 6);
  })();

  const stableOffset = (value: string, modulo: number) => {
    let h = 0;
    for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0;
    return modulo ? h % modulo : 0;
  };

  const recommendedCalcs = (() => {
    if (relatedCalcs.length) return relatedCalcs.slice(0, 6);
    const inCategory = calculators.filter((c) => c.category === term.category);
    const start = stableOffset(term.slug, inCategory.length);
    const rotated = [...inCategory.slice(start), ...inCategory.slice(0, start)];
    return rotated.slice(0, 6);
  })();

  const recommendedGuides = (() => {
    if (relatedGuides.length) return relatedGuides.slice(0, 6);
    const inCategory = guides.filter((g) => g.category === term.category);
    const start = stableOffset(term.slug, inCategory.length);
    const rotated = [...inCategory.slice(start), ...inCategory.slice(0, start)];
    return rotated.slice(0, 6);
  })();

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

          <h2 className="text-lg font-semibold tracking-tight">Why this matters</h2>
          <p className="text-pretty text-zinc-700 dark:text-zinc-300">{whyThisMatters}</p>

          <h2 className="text-lg font-semibold tracking-tight">Practical checklist</h2>
          <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
            {checklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {recommendedCalcs.length || recommendedGuides.length ? (
            <>
              <h2 className="text-lg font-semibold tracking-tight">
                Where to use this on MetricKit
              </h2>
              <div className="space-y-4">
                {recommendedCalcs.length ? (
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Calculators</h3>
                    <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
                      {recommendedCalcs.slice(0, 5).map((c) => (
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

                {recommendedGuides.length ? (
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Guides</h3>
                    <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
                      {recommendedGuides.slice(0, 5).map((g) => (
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
