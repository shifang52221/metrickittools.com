import test from "node:test";
import assert from "node:assert/strict";
import { termsCore } from "./glossary/terms/core.ts";
import { termsSaas } from "./glossary/terms/saas.ts";
import { termsPaidAds } from "./glossary/terms/paidAds.ts";
import { termsFinance } from "./glossary/terms/finance.ts";
import { termsPaidAdsExtra } from "./glossary/terms/paidAdsExtra.ts";
import { termsSaasExtra } from "./glossary/terms/saasExtra.ts";
import { termsFinanceExtra } from "./glossary/terms/financeExtra.ts";
import {
  getGlossaryIndexingDecision,
  getIndexableGlossaryTerms,
  isGlossaryTermIndexable,
} from "./indexing.ts";

const glossaryTerms = [
  ...termsCore,
  ...termsSaas,
  ...termsPaidAds,
  ...termsFinance,
  ...termsPaidAdsExtra,
  ...termsSaasExtra,
  ...termsFinanceExtra,
];

function term(slug: string) {
  const glossaryTerm = glossaryTerms.find((entry) => entry.slug === slug);
  assert.ok(glossaryTerm, `expected glossary term ${slug} to exist`);
  return glossaryTerm;
}

test("proven and strategic glossary pages remain indexable", () => {
  for (const slug of [
    "arr",
    "mrr",
    "cac",
    "roas",
    "marginal-roas",
    "net-debt",
  ]) {
    assert.equal(
      isGlossaryTermIndexable(term(slug)),
      true,
      `expected ${slug} to stay indexable`,
    );
  }
});

test("low-value glossary pages move to noindex follow", () => {
  for (const slug of ["capital-allocation", "runway-extension-plan"]) {
    const decision = getGlossaryIndexingDecision(term(slug));

    assert.equal(decision.index, false, `expected ${slug} to be noindex`);
    assert.equal(decision.follow, true, `expected ${slug} links to remain follow`);
  }
});

test("first-pass glossary policy contracts the indexable URL surface", () => {
  const indexableTerms = getIndexableGlossaryTerms(glossaryTerms);

  assert.ok(
    indexableTerms.length < glossaryTerms.length,
    "expected not every glossary term to remain indexable",
  );
  assert.ok(
    indexableTerms.length >= 100,
    "expected the first pass to avoid over-pruning glossary inventory",
  );
});
