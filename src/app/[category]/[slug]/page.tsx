import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorPageClient } from "@/components/calculators/CalculatorPageClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { calculators, categories, getCalculator } from "@/lib/calculators";
import type { CalculatorCategorySlug } from "@/lib/calculators/types";
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

  return {
    title: calc.title,
    description: calc.description,
    alternates: { canonical: `/${calc.category}/${calc.slug}` },
    openGraph: {
      title: calc.title,
      description: calc.description,
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
    </>
  );
}

export function generateStaticParams() {
  return calculators.map((c) => ({ category: c.category, slug: c.slug }));
}
