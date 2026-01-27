import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: { absolute: "Search MetricKit calculators, guides, and definitions" },
  description:
    "Search MetricKit calculators, guides, and glossary definitions by metric name, acronym, or workflow (ROAS, CAC, LTV, churn, payback, margin).",
  alternates: { canonical: "/search" },
  robots: { index: false, follow: true },
  openGraph: {
    title: "Search MetricKit calculators, guides, and definitions",
    description:
      "Search MetricKit calculators, guides, and glossary definitions by metric name, acronym, or workflow (ROAS, CAC, LTV, churn, payback, margin).",
    url: "/search",
    type: "website",
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
          Loading search...
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
