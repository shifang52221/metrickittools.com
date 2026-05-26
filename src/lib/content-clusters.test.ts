import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getGuide } from "./guides/index.ts";
import { termsCore } from "./glossary/terms/core.ts";
import { termsSaas } from "./glossary/terms/saas.ts";

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

test("Unit economics guide exposes a top-layer topic hub", () => {
  const guide = getGuide("unit-economics-guide");

  assert.ok(guide, "expected unit-economics-guide to exist");
  assert.equal(guide.topicHub?.title, "Connect the SaaS unit economics stack");
  assert.deepEqual(guide.topicHub?.guideSlugs, [
    "cac-guide",
    "cac-payback-guide",
    "ltv-guide",
    "ltv-cac-guide",
    "arr-guide",
    "unit-economics-dashboard-guide",
  ]);
  assert.deepEqual(guide.topicHub?.calculatorSlugs, [
    "unit-economics-calculator",
    "cac-calculator",
    "cac-payback-period-calculator",
    "ltv-calculator",
    "ltv-to-cac-calculator",
    "arr-calculator",
  ]);
});

test("Unit economics glossary entry routes quick-definition traffic to the full guide", () => {
  const term = termsSaas.find((entry) => entry.slug === "unit-economics");

  assert.ok(term, "expected glossary term unit-economics to exist");
  assert.equal(term.seo?.nextStepLabel, "Read the full unit economics guide");
  assert.equal(term.seo?.nextStepHref, "/guides/unit-economics-guide");
  assert.match(
    term.seo?.heroNote ?? "",
    /full unit economics guide/i,
  );
  assert.equal(term.updatedAt, "2026-05-25");
});

test("Unit economics dashboard guide points back to the unit economics hub", () => {
  const guide = getGuide("unit-economics-dashboard-guide");

  assert.ok(guide, "expected unit-economics-dashboard-guide to exist");
  assert.equal(guide.partOfGuideSlug, "unit-economics-guide");
  assert.match(guide.title, /dashboard/i);
  assert.match(
    guide.description,
    /which lever to fix first|what to improve|diagnostic/i,
  );
});

test("Cluster glossary entries keep updated timestamps aligned with the latest hub rollout", () => {
  const expectedDates = new Map([
    ["ltv-to-cac", "2026-05-25"],
    ["customer-lifetime", "2026-05-25"],
    ["net-new-arr", "2026-05-25"],
    ["arr-waterfall", "2026-05-25"],
    ["cac-payback-period", "2026-05-25"],
    ["fully-loaded-cac", "2026-05-25"],
    ["churn-rate", "2026-05-25"],
    ["logo-churn", "2026-05-25"],
    ["cohorted-ltv", "2026-05-25"],
  ]);

  for (const [slug, updatedAt] of expectedDates) {
    const term = [...termsCore, ...termsSaas].find((entry) => entry.slug === slug);

    assert.ok(term, `expected glossary term ${slug} to exist`);
    assert.equal(term.updatedAt, updatedAt, `expected ${slug} to have an aligned updatedAt`);
  }
});

test("Priority glossary terms route quick-definition traffic into the strongest full guides", () => {
  const expectedSeo = new Map([
    ["ltv-to-cac", "/guides/ltv-cac-guide"],
    ["cac-payback-period", "/guides/cac-payback-guide"],
    ["customer-lifetime", "/guides/customer-lifetime-guide"],
    ["net-new-arr", "/guides/net-new-arr-guide"],
    ["arr-waterfall", "/guides/arr-waterfall-guide"],
    ["churn-rate", "/guides/cohort-ltv-forecast-guide"],
    ["cohorted-ltv", "/guides/cohort-ltv-forecast-guide"],
    ["logo-churn", "/guides/retention-churn-hub-guide"],
  ]);

  for (const [slug, nextStepHref] of expectedSeo) {
    const term = [...termsCore, ...termsSaas].find((entry) => entry.slug === slug);

    assert.ok(term, `expected glossary term ${slug} to exist`);
    assert.ok(term.seo?.nextStepLabel, `expected ${slug} to expose a next-step label`);
    assert.equal(term.seo?.nextStepHref, nextStepHref, `expected ${slug} to point to the right full guide`);
    assert.match(
      term.seo?.heroNote ?? "",
      /fast definition|full guide/i,
      `expected ${slug} to frame the page as a quick definition with a stronger next step`,
    );
  }
});

test("Priority SaaS calculators expose interpretation depth, not just formulas", () => {
  const calculatorSources = [
    readFileSync(new URL("./calculators/definitions.part1.ts", import.meta.url), "utf8"),
    readFileSync(new URL("./calculators/definitions.part2.ts", import.meta.url), "utf8"),
    readFileSync(new URL("./calculators/definitions.part3.ts", import.meta.url), "utf8"),
  ];

  const getCalculatorChunk = (slug: string) => {
    for (const source of calculatorSources) {
      const marker = `slug: "${slug}"`;
      const start = source.indexOf(marker);
      if (start === -1) continue;

      const nextStart = source.indexOf('\n  {\n      slug: "', start + marker.length);
      return source.slice(start, nextStart === -1 ? undefined : nextStart);
    }

    return "";
  };

  const mustHaveBenchmarks = new Set([
    "ltv-to-cac-calculator",
    "cac-payback-period-calculator",
    "unit-economics-calculator",
  ]);

  for (const slug of [
    "ltv-to-cac-calculator",
    "cac-payback-period-calculator",
    "unit-economics-calculator",
    "cohort-ltv-forecast-calculator",
  ]) {
    const chunk = getCalculatorChunk(slug);

    assert.ok(chunk, `expected calculator ${slug} to exist`);
    assert.match(chunk, /intro:\s*\[/, `expected ${slug} to have intro guidance`);
    assert.match(chunk, /pitfalls:\s*\[/, `expected ${slug} to have pitfalls guidance`);
    assert.match(chunk, /guide:\s*\[/, `expected ${slug} to have interpretation guidance`);

    if (mustHaveBenchmarks.has(slug)) {
      assert.match(chunk, /benchmarks:\s*\[/, `expected ${slug} to have benchmark guidance`);
    }
  }
});

test("LTV:CAC and CAC payback calculators provide multi-step decision guidance", () => {
  const source = readFileSync(new URL("./calculators/definitions.part1.ts", import.meta.url), "utf8");

  const getCalculatorChunk = (slug: string) => {
    const marker = `slug: "${slug}"`;
    const start = source.indexOf(marker);
    if (start === -1) return "";

    const nextStart = source.indexOf('\n    },\n  {', start + marker.length);
    return source.slice(start, nextStart === -1 ? undefined : nextStart);
  };

  const expectedTitles = new Map([
    [
      "ltv-to-cac-calculator",
      ["Read ratio and payback together", "When a good ratio can still mislead you"],
    ],
    [
      "cac-payback-period-calculator",
      ["What different payback ranges suggest", "What to inspect before scaling"],
    ],
  ]);

  for (const [slug, titles] of expectedTitles) {
    const chunk = getCalculatorChunk(slug);

    assert.ok(chunk, `expected calculator ${slug} to exist`);
    assert.match(chunk, /guide:\s*\[/, `expected ${slug} to expose interpretation guidance`);

    for (const title of titles) {
      assert.match(
        chunk,
        new RegExp(`title:\\s*"${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`),
        `expected ${slug} to include the interpretation section "${title}"`,
      );
    }
  }
});

test("Priority calculators expose calculator-level updatedAt values", () => {
  const calculatorSources = [
    readFileSync(new URL("./calculators/definitions.part1.ts", import.meta.url), "utf8"),
    readFileSync(new URL("./calculators/definitions.part2.ts", import.meta.url), "utf8"),
    readFileSync(new URL("./calculators/definitions.part3.ts", import.meta.url), "utf8"),
  ];

  const getCalculatorChunk = (slug: string) => {
    for (const source of calculatorSources) {
      const marker = `slug: "${slug}"`;
      const start = source.indexOf(marker);
      if (start === -1) continue;

      const nextStart = source.indexOf('\n    },\n  {', start + marker.length);
      return source.slice(start, nextStart === -1 ? undefined : nextStart);
    }

    return "";
  };

  for (const slug of [
    "unit-economics-calculator",
    "cohort-ltv-forecast-calculator",
    "ltv-to-cac-calculator",
    "cac-payback-period-calculator",
  ]) {
    const chunk = getCalculatorChunk(slug);

    assert.ok(chunk, `expected calculator ${slug} to exist`);
    assert.match(
      chunk,
      /updatedAt:\s*"2026-05-26"/,
      `expected ${slug} to expose a calculator-level updatedAt`,
    );
  }
});

test("Priority content templates expose a shared trust panel with visible ownership signals", () => {
  const pageSources = [
    readFileSync(new URL("../app/[category]/[slug]/page.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../app/guides/[slug]/page.tsx", import.meta.url), "utf8"),
    readFileSync(new URL("../app/glossary/[slug]/page.tsx", import.meta.url), "utf8"),
  ];

  for (const source of pageSources) {
    assert.match(source, /TrustPanel/, "expected the page template to use the shared TrustPanel");
    assert.match(
      source,
      /siteConfig\.methodologyPath/,
      "expected the page template to expose a methodology path",
    );
    assert.match(
      source,
      /siteConfig\.editorialPolicyPath/,
      "expected the page template to expose an editorial policy path",
    );
    assert.match(
      source,
      /siteConfig\.contactPath/,
      "expected the page template to expose a contact path",
    );
    assert.match(source, /Written by/, "expected the page template to keep the Written by signal");
    assert.match(source, /Reviewed by/, "expected the page template to keep the Reviewed by signal");
    assert.match(source, /Updated/, "expected the page template to keep the Updated signal");
  }
});
