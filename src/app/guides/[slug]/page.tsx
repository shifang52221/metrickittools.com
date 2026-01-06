import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { AdUnit } from "@/components/ads/AdUnit";
import { calculators } from "@/lib/calculators";
import { getGuide, guides } from "@/lib/guides";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ slug: string }> };

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, "")
    .replaceAll(/\s+/g, "-")
    .replaceAll(/-+/g, "-");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `/guides/${guide.slug}`,
      type: "article",
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const toc = guide.sections
    .map((s) => {
      if (s.type === "h2" || s.type === "h3") {
        return { level: s.type, text: s.text, id: slugify(s.text) };
      }
      return null;
    })
    .filter(Boolean) as Array<{ level: "h2" | "h3"; text: string; id: string }>;

  const relatedCalcs = calculators.filter((c) =>
    guide.relatedCalculatorSlugs.includes(c.slug),
  );

  const examples = (guide.examples ?? [])
    .map((ex) => {
      const calc = calculators.find((c) => c.slug === ex.calculatorSlug);
      if (!calc) return null;
      const url = new URL(`${siteConfig.siteUrl}/${calc.category}/${calc.slug}`);
      for (const [k, v] of Object.entries(ex.params)) url.searchParams.set(k, v);
      return {
        ...ex,
        calculatorTitle: calc.title,
        calculatorHref: `${calc.category}/${calc.slug}`,
        hrefWithParams: `${url.pathname}${url.search}`,
      };
    })
    .filter(Boolean) as Array<{
    label: string;
    calculatorSlug: string;
    params: Record<string, string>;
    note?: string;
    calculatorTitle: string;
    calculatorHref: string;
    hrefWithParams: string;
  }>;

  const inSameCategory = guides.filter(
    (g) => g.category === guide.category && g.slug !== guide.slug,
  );
  const relatedGuides = inSameCategory.slice(0, 3);
  const sortedGuides = [...guides].sort((a, b) => a.slug.localeCompare(b.slug));
  const idx = sortedGuides.findIndex((g) => g.slug === guide.slug);
  const prevGuide = idx > 0 ? sortedGuides[idx - 1] : null;
  const nextGuide =
    idx >= 0 && idx < sortedGuides.length - 1 ? sortedGuides[idx + 1] : null;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updatedAt,
    datePublished: guide.updatedAt,
    mainEntityOfPage: `${siteConfig.siteUrl}/guides/${guide.slug}`,
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  const faqLd =
    guide.faqs && guide.faqs.length
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: guide.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="space-y-8">
      <JsonLd data={articleLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title, href: `/guides/${guide.slug}` },
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {guide.title}
        </h1>
        <p className="max-w-3xl text-pretty text-zinc-600 dark:text-zinc-400">
          {guide.description}
        </p>
        <div className="text-sm text-zinc-500">Updated {guide.updatedAt}</div>
      </header>

      {examples.length ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
          <h2 className="text-lg font-semibold tracking-tight">
            Try it in a calculator
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {examples.map((ex) => (
              <Link
                key={ex.label}
                href={`/${ex.hrefWithParams}`}
                className="rounded-2xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
              >
                <div className="text-sm text-zinc-500">{ex.calculatorTitle}</div>
                <div className="mt-1 font-medium">{ex.label}</div>
                {ex.note ? (
                  <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {ex.note}
                  </div>
                ) : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-5">
        <article className="prose prose-zinc lg:col-span-3 dark:prose-invert">
          {guide.sections.map((s, idx) => {
            if (s.type === "h2")
              return (
                <h2 key={idx} id={slugify(s.text)}>
                  {s.text}
                </h2>
              );
            if (s.type === "h3")
              return (
                <h3 key={idx} id={slugify(s.text)}>
                  {s.text}
                </h3>
              );
            if (s.type === "p") return <p key={idx}>{s.text}</p>;
            return (
              <ul key={idx}>
                {s.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          })}
        </article>

        <aside className="space-y-4 lg:col-span-2">
          {toc.length ? (
            <div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
              <div className="text-sm font-medium">On this page</div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                {toc
                  .filter((t) => t.level === "h2")
                  .map((t) => (
                    <li key={t.id}>
                      <a className="hover:underline" href={`#${t.id}`}>
                        {t.text}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

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
        </aside>
      </div>

      {guide.faqs?.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">FAQ</h2>
          <div className="space-y-2">
            {guide.faqs.map((f) => (
              <details
                key={f.question}
                className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-black"
              >
                <summary className="cursor-pointer text-sm font-medium">
                  {f.question}
                </summary>
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {f.answer}
                </div>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_BOTTOM} />

      {relatedGuides.length ? (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-tight">
            More in {guide.category.replace("-", " ")}
          </h2>
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
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {prevGuide || nextGuide ? (
        <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {prevGuide ? (
              <Link className="text-sm hover:underline" href={`/guides/${prevGuide.slug}`}>
                ← {prevGuide.title}
              </Link>
            ) : null}
          </div>
          <div>
            {nextGuide ? (
              <Link className="text-sm hover:underline" href={`/guides/${nextGuide.slug}`}>
                {nextGuide.title} →
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}
