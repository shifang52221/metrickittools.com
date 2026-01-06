import Link from "next/link";
import type { CalculatorDefinition } from "@/lib/calculators";
import { categories } from "@/lib/calculators";

export function CalculatorCard({ calc }: { calc: CalculatorDefinition }) {
  const href = `/${calc.category}/${calc.slug}`;
  const categoryTitle =
    categories.find((c) => c.slug === calc.category)?.title ?? calc.category;
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-950"
    >
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {categoryTitle}
      </div>
      <div className="mt-1 text-lg font-semibold tracking-tight group-hover:underline">
        {calc.title}
      </div>
      <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {calc.description}
      </div>
    </Link>
  );
}
