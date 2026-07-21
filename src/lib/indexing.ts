import type { GlossaryTerm } from "./glossary/types";
import {
  getSharedGlossaryIndexingReason,
} from "./indexing-policy-data.js";

export type IndexingDecisionReason =
  | "gsc-observed"
  | "glossary-next-step"
  | "calculator-supported"
  | "strategic-glossary"
  | "low-value-glossary-first-pass";

export type IndexingDecision = {
  index: boolean;
  follow: boolean;
  reason: IndexingDecisionReason;
};

export function getGlossaryIndexingDecision(
  term: GlossaryTerm,
): IndexingDecision {
  const reason = getSharedGlossaryIndexingReason({
    slug: term.slug,
    hasNextStep: Boolean(term.seo?.nextStepHref),
  }) as IndexingDecisionReason;

  return {
    index: reason !== "low-value-glossary-first-pass",
    follow: true,
    reason,
  };
}

export function isGlossaryTermIndexable(term: GlossaryTerm): boolean {
  return getGlossaryIndexingDecision(term).index;
}

export function getIndexableGlossaryTerms<T extends GlossaryTerm>(
  terms: T[],
): T[] {
  return terms.filter(isGlossaryTermIndexable);
}
