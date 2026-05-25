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
