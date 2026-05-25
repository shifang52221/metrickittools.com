import test from "node:test";
import assert from "node:assert/strict";
import { getGuide } from "./guides/index.ts";
import { termsCore } from "./glossary/terms/core.ts";

test("CAC guide exposes a topic hub for the cluster", () => {
  const guide = getGuide("cac-guide");

  assert.ok(guide, "expected cac-guide to exist");
  assert.equal(guide.topicHub?.title, "Understand CAC end to end");
  assert.deepEqual(guide.topicHub?.guideSlugs, [
    "fully-loaded-cac-guide",
    "cac-payback-guide",
    "blended-cac-guide",
    "ltv-cac-guide",
  ]);
  assert.deepEqual(guide.topicHub?.calculatorSlugs, [
    "cac-calculator",
    "fully-loaded-cac-calculator",
    "cac-payback-period-calculator",
    "ltv-to-cac-calculator",
    "blended-cac-calculator",
  ]);
});

test("CAC spoke guides point back to the parent topic", () => {
  assert.equal(getGuide("fully-loaded-cac-guide")?.partOfGuideSlug, "cac-guide");
  assert.equal(getGuide("cac-payback-guide")?.partOfGuideSlug, "cac-guide");
  assert.equal(getGuide("blended-cac-guide")?.partOfGuideSlug, "cac-guide");
});

test("CAC glossary entry routes quick-definition traffic to the full guide", () => {
  const term = termsCore.find((entry) => entry.slug === "cac");

  assert.ok(term, "expected glossary term cac to exist");
  assert.equal(term.seo?.nextStepLabel, "Read the full CAC guide");
  assert.equal(term.seo?.nextStepHref, "/guides/cac-guide");
  assert.match(
    term.seo?.heroNote ?? "",
    /full CAC guide/i,
  );
});

test("LTV guide exposes a topic hub for the cluster", () => {
  const guide = getGuide("ltv-guide");

  assert.ok(guide, "expected ltv-guide to exist");
  assert.equal(guide.topicHub?.title, "Understand LTV with more confidence");
  assert.deepEqual(guide.topicHub?.guideSlugs, [
    "ltv-sensitivity-guide",
    "customer-lifetime-guide",
    "cohort-ltv-forecast-guide",
    "ltv-cac-guide",
  ]);
  assert.deepEqual(guide.topicHub?.calculatorSlugs, [
    "ltv-calculator",
    "ltv-sensitivity-calculator",
    "cohort-ltv-forecast-calculator",
    "ltv-to-cac-calculator",
    "unit-economics-calculator",
  ]);
});

test("Direct LTV spoke guides point back to the parent topic", () => {
  assert.equal(getGuide("ltv-sensitivity-guide")?.partOfGuideSlug, "ltv-guide");
  assert.equal(getGuide("customer-lifetime-guide")?.partOfGuideSlug, "ltv-guide");
  assert.equal(getGuide("cohort-ltv-forecast-guide")?.partOfGuideSlug, "ltv-guide");
});

test("LTV glossary entry routes quick-definition traffic to the full guide", () => {
  const term = termsCore.find((entry) => entry.slug === "ltv");

  assert.ok(term, "expected glossary term ltv to exist");
  assert.equal(term.seo?.nextStepLabel, "Read the full LTV guide");
  assert.equal(term.seo?.nextStepHref, "/guides/ltv-guide");
  assert.match(
    term.seo?.heroNote ?? "",
    /full LTV guide/i,
  );
});
