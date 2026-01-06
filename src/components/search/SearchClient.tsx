"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { calculators, categories } from "@/lib/calculators";
import { guides } from "@/lib/guides";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function includesText(haystack: string, needle: string): boolean {
  return normalize(haystack).includes(needle);
}

type FilterKind = "all" | "calculators" | "guides";

export function SearchClient() {
  const params = useSearchParams();
  const router = useRouter();
  const initial = params.get("q") ?? "";

  const [query, setQuery] = useState(initial);
  const [kind, setKind] = useState<FilterKind>("all");

  const needle = useMemo(() => normalize(query), [query]);

  const calculatorResults = useMemo(() => {
    if (!needle) return [];
    return calculators.filter((c) => {
      return (
        includesText(c.title, needle) ||
        includesText(c.description, needle) ||
        includesText(c.category, needle)
      );
    });
  }, [needle]);

  const guideResults = useMemo(() => {
    if (!needle) return [];
    return guides.filter((g) => {
      return (
        includesText(g.title, needle) ||
        includesText(g.description, needle) ||
        includesText(g.category, needle)
      );
    });
  }, [needle]);

  const visibleCalculators = kind === "guides" ? [] : calculatorResults;
  const visibleGuides = kind === "calculators" ? [] : guideResults;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Search
        </h1>
        <p className="max-w-2xl text-pretty text-zinc-600 dark:text-zinc-400">
          Search calculators and guides.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => {
              const next = e.target.value;
              setQuery(next);
              const q = next.trim();
              router.replace(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
            }}
            placeholder="Search (e.g., CAC, ROAS, churn, payback)"
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-black dark:focus:border-zinc-600"
          />
          <div className="flex flex-wrap gap-2">
            {(["all", "calculators", "guides"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={[
                  "rounded-full border px-3 py-1.5 text-sm",
                  kind === k
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900",
                ].join(" ")}
              >
                {k === "all"
                  ? "All"
                  : k === "calculators"
                    ? "Calculators"
                    : "Guides"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 text-xs text-zinc-500">
          Tip: results update as you type.
        </div>
      </div>

      {!needle ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-black dark:text-zinc-400">
          Popular categories:{" "}
          {categories.map((c, idx) => (
            <span key={c.slug}>
              <Link className="underline" href={`/${c.slug}`}>
                {c.title}
              </Link>
              {idx < categories.length - 1 ? ", " : ""}
            </span>
          ))}
          .
        </div>
      ) : null}

      {needle ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">Calculators</h2>
            {visibleCalculators.length ? (
              <div className="space-y-2">
                {visibleCalculators.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/${c.category}/${c.slug}`}
                    className="block rounded-2xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
                  >
                    <div className="text-sm text-zinc-500">
                      {categories.find((x) => x.slug === c.category)?.title ??
                        c.category}
                    </div>
                    <div className="mt-1 font-semibold tracking-tight">
                      {c.title}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {c.description}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                No calculator results.
              </div>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold tracking-tight">Guides</h2>
            {visibleGuides.length ? (
              <div className="space-y-2">
                {visibleGuides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/guides/${g.slug}`}
                    className="block rounded-2xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
                  >
                    <div className="text-sm text-zinc-500">
                      {g.category.replace("-", " ")}
                    </div>
                    <div className="mt-1 font-semibold tracking-tight">
                      {g.title}
                    </div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {g.description}
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                      Updated {g.updatedAt}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                No guide results.
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  );
}
