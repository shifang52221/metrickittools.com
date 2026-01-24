import type { GlossaryTerm } from "./types";
import { termsCore } from "./terms/core";
import { termsSaas } from "./terms/saas";
import { termsPaidAds } from "./terms/paidAds";
import { termsFinance } from "./terms/finance";
import { termsPaidAdsExtra } from "./terms/paidAdsExtra";
import { termsSaasExtra } from "./terms/saasExtra";
import { termsFinanceExtra } from "./terms/financeExtra";

const allTerms: GlossaryTerm[] = [
  ...termsCore,
  ...termsSaas,
  ...termsPaidAds,
  ...termsFinance,
  ...termsPaidAdsExtra,
  ...termsSaasExtra,
  ...termsFinanceExtra,
];

const bySlug = new Map<string, GlossaryTerm>();
for (const term of allTerms) {
  if (bySlug.has(term.slug)) {
    throw new Error(`Duplicate glossary slug: ${term.slug}`);
  }
  bySlug.set(term.slug, term);
}

export const glossaryTerms = [...bySlug.values()].sort((a, b) =>
  a.title.localeCompare(b.title),
);

export function getGlossaryTerm(slug: string): GlossaryTerm | undefined {
  return bySlug.get(slug);
}
