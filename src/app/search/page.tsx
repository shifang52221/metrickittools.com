import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Search",
  description: "Search calculators and guides.",
  alternates: { canonical: "/search" },
  openGraph: {
    title: "Search",
    description: "Search calculators and guides.",
    url: "/search",
    type: "website",
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
          Loading search…
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
