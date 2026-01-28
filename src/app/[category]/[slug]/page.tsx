import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPageClient } from "@/components/calculators/CalculatorPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { calculators, categories, getCalculator } from "@/lib/calculators";
import type { CalculatorCategorySlug } from "@/lib/calculators/types";
import { clampMetaDescription } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

type PageProps = { params: Promise<{ category: string; slug: string }> };

function isCategorySlug(value: string): value is CalculatorCategorySlug {
  return categories.some((c) => c.slug === value);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};
  if (!isCategorySlug(category)) return {};
  if (calc.category !== category) return {};
  const metaDescription = clampMetaDescription(calc.description);

  return {
    title: calc.title,
    description: metaDescription,
    alternates: { canonical: `/${calc.category}/${calc.slug}` },
    openGraph: {
      title: calc.title,
      description: metaDescription,
      url: `/${calc.category}/${calc.slug}`,
      type: "article",
    },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { category, slug } = await params;
  if (!isCategorySlug(category)) notFound();
  const calc = getCalculator(slug);
  if (!calc) notFound();
  if (calc.category !== category) notFound();
  const categoryTitle =
    categories.find((c) => c.slug === category)?.title ?? category;

  const quickChecks = (() => {
    if (category === "paid-ads") {
      return [
        "Keep attribution model and window consistent when comparing campaigns.",
        "Pair efficiency metrics (ROAS/CPA) with profit assumptions (margin, refunds, fees).",
        "Validate tracking after site changes (pixels/events can silently break).",
      ];
    }
    if (category === "finance") {
      return [
        "Use consistent time units (monthly vs annual) when entering rates and cash flows.",
        "Run a sensitivity check on the input that drives the result most (often discount rate or growth).",
        "Treat the output as a decision aid, not a prediction; validate assumptions with reality.",
      ];
    }
    return [
      "Keep time units consistent (monthly vs annual) across inputs and outputs.",
      "Segment by cohort/channel/plan before trusting a blended average.",
      "Use the related guide to avoid common definition and denominator mismatches.",
    ];
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: calc.title,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${siteConfig.siteUrl}/${calc.category}/${calc.slug}`,
    description: calc.description,
  };

  const faqLd =
    calc.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: calc.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteConfig.siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: categoryTitle,
        item: `${siteConfig.siteUrl}/${category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calc.title,
        item: `${siteConfig.siteUrl}/${category}/${calc.slug}`,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: categoryTitle, href: `/${category}` },
            { label: calc.title, href: `/${category}/${calc.slug}` },
          ]}
        />
      </div>
      <noscript>
        <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-black dark:text-zinc-300">
          JavaScript is required for the interactive calculator. Please enable
          JavaScript and reload.
        </div>
      </noscript>
      <CalculatorPageClient slug={calc.slug} />
      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-semibold tracking-tight">Quick checks</h2>
        <ul className="list-disc space-y-1 pl-5 text-zinc-700 dark:text-zinc-300">
          {quickChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

export function generateStaticParams() {
  return calculators.map((c) => ({ category: c.category, slug: c.slug }));
}
