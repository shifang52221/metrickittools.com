import { calculators, categories } from "./definitions";
import type { CalculatorCategorySlug, CalculatorDefinition } from "./types";

function bySlug(a: { slug: string }, b: { slug: string }) {
  return a.slug.localeCompare(b.slug);
}

export { calculators, categories };
export type { CalculatorCategory, CalculatorDefinition } from "./types";

export function getCalculator(slug: string): CalculatorDefinition | undefined {
  return calculators.find((c) => c.slug === slug);
}

export function getCalculatorsByCategory(
  category: CalculatorCategorySlug,
): CalculatorDefinition[] {
  return calculators.filter((c) => c.category === category).sort(bySlug);
}

