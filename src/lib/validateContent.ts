import { calculators, categories } from "@/lib/calculators";
import { guides } from "@/lib/guides";
import { glossaryTerms } from "@/lib/glossary";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

export function validateContentOrThrow() {
  const categorySlugs = new Set(categories.map((c) => c.slug));

  const calculatorSlugs = new Set<string>();
  for (const calc of calculators) {
    assert(
      !calculatorSlugs.has(calc.slug),
      `Duplicate calculator slug: ${calc.slug}`,
    );
    calculatorSlugs.add(calc.slug);
    assert(
      categorySlugs.has(calc.category),
      `Calculator ${calc.slug} references missing category: ${calc.category}`,
    );
  }

  const guideSlugs = new Set<string>();
  for (const guide of guides) {
    assert(!guideSlugs.has(guide.slug), `Duplicate guide slug: ${guide.slug}`);
    guideSlugs.add(guide.slug);
  }

  const glossarySlugs = new Set(glossaryTerms.map((t) => t.slug));

  for (const calc of calculators) {
    if (calc.guideSlug) {
      assert(
        guideSlugs.has(calc.guideSlug),
        `Calculator ${calc.slug} references missing guideSlug: ${calc.guideSlug}`,
      );
    }
    for (const slug of calc.relatedGlossarySlugs ?? []) {
      assert(
        glossarySlugs.has(slug),
        `Calculator ${calc.slug} references missing glossary term: ${slug}`,
      );
    }
  }

  for (const guide of guides) {
    for (const slug of guide.relatedCalculatorSlugs ?? []) {
      assert(
        calculatorSlugs.has(slug),
        `Guide ${guide.slug} references missing calculator: ${slug}`,
      );
    }
    for (const slug of guide.relatedGlossarySlugs ?? []) {
      assert(
        glossarySlugs.has(slug),
        `Guide ${guide.slug} references missing glossary term: ${slug}`,
      );
    }
    for (const example of guide.examples ?? []) {
      assert(
        calculatorSlugs.has(example.calculatorSlug),
        `Guide ${guide.slug} example references missing calculator: ${example.calculatorSlug}`,
      );
    }
  }

  for (const term of glossaryTerms) {
    for (const slug of term.relatedGuideSlugs ?? []) {
      assert(
        guideSlugs.has(slug),
        `Glossary term ${term.slug} references missing guide: ${slug}`,
      );
    }
    for (const slug of term.relatedCalculatorSlugs ?? []) {
      assert(
        calculatorSlugs.has(slug),
        `Glossary term ${term.slug} references missing calculator: ${slug}`,
      );
    }
  }
}

