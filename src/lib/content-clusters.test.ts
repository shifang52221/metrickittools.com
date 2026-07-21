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

test("High-impression ARR, MRR, and CAC glossary pages expose decision-oriented modules", () => {
  const terms = new Map(
    [...termsCore, ...termsSaas].map((term) => [term.slug, term]),
  );

  const moduleText = (slug: string, key: keyof NonNullable<(typeof termsCore)[number]["modules"]>) => {
    const value = terms.get(slug)?.modules?.[key];
    return Array.isArray(value) ? value.join(" ") : value ?? "";
  };

  for (const slug of ["arr", "mrr", "cac"]) {
    const term = terms.get(slug);
    assert.ok(term, `expected ${slug} to exist`);
    assert.equal(term.updatedAt, "2026-07-21", `expected ${slug} to be refreshed`);
    assert.ok(term.modules, `expected ${slug} to expose custom glossary modules`);
    assert.match(moduleText(slug, "compareWith"), /vs|versus|difference/i);
    assert.match(moduleText(slug, "measuredAs"), /formula|divide|MRR|spend|customer/i);
    assert.match(moduleText(slug, "misusedWhen"), /cash|bookings|revenue|paid|loaded|denominator/i);
    assert.match(moduleText(slug, "operatorTakeaway"), /retention|margin|payback|waterfall|cohort/i);
    assert.match(moduleText(slug, "nextDecision"), /guide|calculator|waterfall|payback|LTV:CAC/i);
  }
});

test("Core SaaS glossary pages explain their highest-impression search distinctions", () => {
  const arr = termsCore.find((term) => term.slug === "arr");
  const mrr = termsCore.find((term) => term.slug === "mrr");
  const cac = termsCore.find((term) => term.slug === "cac");

  assert.ok(arr && mrr && cac, "expected core SaaS glossary terms to exist");

  const text = (term: NonNullable<typeof arr>) =>
    JSON.stringify(term).toLowerCase();

  assert.match(text(arr), /bookings/);
  assert.match(text(arr), /waterfall/);
  assert.match(text(mrr), /cash collections|cash collected/);
  assert.match(text(mrr), /expansion mrr/);
  assert.match(text(mrr), /contraction mrr/);
  assert.match(text(cac), /fully-loaded cac/);
  assert.match(text(cac), /payback/);
  assert.match(text(cac), /ltv:cac/);
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

test("Priority calculators expose next-action guidance and the calculator client renders it", () => {
  const clientSource = readFileSync(
    new URL("../components/calculators/CalculatorPageClient.tsx", import.meta.url),
    "utf8",
  );
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

  assert.match(clientSource, /NextActionPanel/, "expected the calculator client to render NextActionPanel");
  assert.match(clientSource, /Result/, "expected the calculator client to keep the Result heading");

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
      /nextAction:\s*\{/,
      `expected ${slug} to expose calculator-level next-action guidance`,
    );
  }
});

test("Priority guides expose stronger calculator example actions", () => {
  const guidePageSource = readFileSync(
    new URL("../app/guides/[slug]/page.tsx", import.meta.url),
    "utf8",
  );
  const guidesSource = readFileSync(new URL("./guides/index.ts", import.meta.url), "utf8");

  const getGuideChunk = (slug: string) => {
    const marker = `slug: "${slug}"`;
    const start = guidesSource.indexOf(marker);
    if (start === -1) return "";

    const nextStart = guidesSource.indexOf('\n  },\n  {', start + marker.length);
    return guidesSource.slice(start, nextStart === -1 ? undefined : nextStart);
  };

  assert.match(
    guidePageSource,
    /Try it in a calculator/,
    "expected the guide page template to keep the calculator example section",
  );
  assert.match(
    guidePageSource,
    /Opens the calculator with this scenario/,
    "expected the guide page template to render stronger calculator action phrasing",
  );

  for (const slug of [
    "unit-economics-guide",
    "ltv-cac-guide",
    "cac-payback-guide",
    "cohort-ltv-forecast-guide",
  ]) {
    const chunk = getGuideChunk(slug);

    assert.ok(chunk, `expected guide ${slug} to exist`);
    assert.match(
      chunk,
      /decisionNote:/,
      `expected ${slug} to expose example-level decision guidance`,
    );
  }
});

test("Core SaaS guides expose a calculator-led decision handoff", () => {
  const expected = new Map([
    ["arr-guide", { calculatorSlug: "arr-calculator", next: /waterfall|bookings|net new arr/i }],
    ["mrr-forecast-guide", { calculatorSlug: "mrr-forecast-calculator", next: /nrr|grr|waterfall/i }],
    ["cac-guide", { calculatorSlug: "cac-calculator", next: /payback|ltv:cac|gross margin/i }],
    ["cac-payback-guide", { calculatorSlug: "cac-payback-period-calculator", next: /cash|ltv|break-even/i }],
  ]);

  for (const [slug, expectation] of expected) {
    const guide = getGuide(slug);

    assert.ok(guide, `expected ${slug} to exist`);
    assert.equal(guide.updatedAt, "2026-07-21", `expected ${slug} to be refreshed`);
    assert.ok(guide.examples?.length, `expected ${slug} to expose a worked example`);
    assert.ok(
      guide.examples?.some((example) => example.calculatorSlug === expectation.calculatorSlug),
      `expected ${slug} to use ${expectation.calculatorSlug} in an example`,
    );
    assert.ok(
      guide.examples?.some((example) => example.decisionNote),
      `expected ${slug} examples to explain the decision`,
    );
    assert.match(
      JSON.stringify(guide),
      expectation.next,
      `expected ${slug} to expose a next-decision handoff`,
    );
  }
});

test("MER cluster keeps the blended metric, guide, and calculator roles distinct", () => {
  const glossarySource = readFileSync(
    new URL("./glossary/terms/paidAds.ts", import.meta.url),
    "utf8",
  );
  const guideSource = readFileSync(new URL("./guides/index.ts", import.meta.url), "utf8");
  const calculatorSource = readFileSync(
    new URL("./calculators/definitions.part3.ts", import.meta.url),
    "utf8",
  );

  const glossaryChunk = (() => {
    const marker = 'slug: "mer"';
    const start = glossarySource.indexOf(marker);
    if (start === -1) return "";
    const nextStart = glossarySource.indexOf('\n  },\n  {', start + marker.length);
    return glossarySource.slice(start, nextStart === -1 ? undefined : nextStart);
  })();

  const guideChunk = (() => {
    const marker = 'slug: "mer-guide"';
    const start = guideSource.indexOf(marker);
    if (start === -1) return "";
    const nextStart = guideSource.indexOf('\n  },\n  {', start + marker.length);
    return guideSource.slice(start, nextStart === -1 ? undefined : nextStart);
  })();

  const calculatorChunk = (() => {
    const marker = 'slug: "mer-calculator"';
    const start = calculatorSource.indexOf(marker);
    if (start === -1) return "";
    const nextStart = calculatorSource.indexOf('\n  },\n  {', start + marker.length);
    return calculatorSource.slice(start, nextStart === -1 ? undefined : nextStart);
  })();

  assert.ok(glossaryChunk, "expected the MER glossary entry to exist");
  assert.ok(guideChunk, "expected the MER guide to exist");
  assert.ok(calculatorChunk, "expected the MER calculator to exist");

  assert.match(glossaryChunk, /mer-guide/, "expected MER glossary to point to the full guide");
  assert.match(
    glossaryChunk,
    /heroNote:|nextStepLabel:|nextStepHref:/,
    "expected MER glossary to frame itself as a quick definition with a stronger next step",
  );
  assert.match(
    guideChunk,
    /mer-calculator/,
    "expected MER guide to keep the calculator as the main worked example",
  );
  assert.match(
    guideChunk,
    /marginal-roas|incrementality/,
    "expected MER guide to send users to marginal ROAS or incrementality next",
  );
  assert.match(
    guideChunk,
    /decisionNote:/,
    "expected MER guide examples to explain why the calculator scenario matters",
  );
  assert.match(
    calculatorChunk,
    /benchmark/i,
    "expected MER calculator to expose decision-oriented benchmark guidance",
  );
  assert.match(
    calculatorChunk,
    /nextAction:\s*\{/,
    "expected MER calculator to expose a stronger next action",
  );
  assert.match(
    calculatorChunk,
    /incrementality|marginal ROAS|ROAS/i,
    "expected MER calculator to frame the next step beyond blended MER",
  );
});

test("Paid ads efficiency cluster connects MER, target ROAS, and marginal ROAS roles", () => {
  const glossarySource = readFileSync(
    new URL("./glossary/terms/paidAds.ts", import.meta.url),
    "utf8",
  );
  const guideSource = readFileSync(new URL("./guides/index.ts", import.meta.url), "utf8");
  const targetCalculatorSource = readFileSync(
    new URL("./calculators/definitions.part1.ts", import.meta.url),
    "utf8",
  );
  const merCalculatorSource = readFileSync(
    new URL("./calculators/definitions.part3.ts", import.meta.url),
    "utf8",
  );

  const chunkFrom = (source: string, marker: string) => {
    const start = source.indexOf(marker);
    if (start === -1) return "";
    const nextStart = source.indexOf('\n  },\n  {', start + marker.length);
    return source.slice(start, nextStart === -1 ? undefined : nextStart);
  };

  const targetGuideChunk = chunkFrom(guideSource, 'slug: "target-roas-guide"');
  const merGuideChunk = chunkFrom(guideSource, 'slug: "mer-guide"');
  const marginalGlossaryChunk = chunkFrom(glossarySource, 'slug: "marginal-roas"');
  const targetCalculatorChunk = chunkFrom(
    targetCalculatorSource,
    'slug: "target-roas-calculator"',
  );
  const merCalculatorChunk = chunkFrom(merCalculatorSource, 'slug: "mer-calculator"');

  assert.ok(targetGuideChunk, "expected target-roas-guide to exist");
  assert.ok(merGuideChunk, "expected mer-guide to exist");
  assert.ok(marginalGlossaryChunk, "expected marginal-roas glossary to exist");
  assert.ok(targetCalculatorChunk, "expected target-roas-calculator to exist");
  assert.ok(merCalculatorChunk, "expected mer-calculator to exist");

  assert.match(
    targetGuideChunk,
    /target-roas-calculator/,
    "expected target ROAS guide to keep the calculator as its worked example",
  );
  assert.match(
    targetGuideChunk,
    /mer-guide|mer-calculator/i,
    "expected target ROAS guide to route users toward MER for top-down validation",
  );
  assert.match(
    targetGuideChunk,
    /marginal-roas/i,
    "expected target ROAS guide to connect targets to next-dollar efficiency",
  );
  assert.match(
    targetCalculatorChunk,
    /nextAction:\s*\{/,
    "expected target ROAS calculator to expose a next action",
  );
  assert.match(
    targetCalculatorChunk,
    /break-even ROAS|planning constraint|profit buffer/i,
    "expected target ROAS calculator to distinguish break-even floors from planning targets",
  );
  assert.match(
    merCalculatorChunk,
    /next dollar|next dollars|next spend decision/i,
    "expected MER calculator to distinguish blended health from next-dollar spend decisions",
  );
  assert.match(
    marginalGlossaryChunk,
    /mer-guide|mer-calculator/i,
    "expected marginal ROAS glossary to connect back to the MER decision path",
  );
  assert.match(
    marginalGlossaryChunk,
    /nextStepLabel:|nextStepHref:/,
    "expected marginal ROAS glossary to send users to a practical next step",
  );
});

test("MRR forecast cluster keeps the definition, guide, and calculator roles distinct", () => {
  const glossarySource = readFileSync(
    new URL("./glossary/terms/core.ts", import.meta.url),
    "utf8",
  );
  const guideSource = readFileSync(new URL("./guides/index.ts", import.meta.url), "utf8");
  const calculatorSource = readFileSync(
    new URL("./calculators/definitions.part3.ts", import.meta.url),
    "utf8",
  );

  const glossaryChunk = (() => {
    const marker = 'slug: "mrr"';
    const start = glossarySource.indexOf(marker);
    if (start === -1) return "";
    const nextStart = glossarySource.indexOf('\n  },\n  {', start + marker.length);
    return glossarySource.slice(start, nextStart === -1 ? undefined : nextStart);
  })();

  const guideChunk = (() => {
    const marker = 'slug: "mrr-forecast-guide"';
    const start = guideSource.indexOf(marker);
    if (start === -1) return "";
    const nextStart = guideSource.indexOf('\n  },\n  {', start + marker.length);
    return guideSource.slice(start, nextStart === -1 ? undefined : nextStart);
  })();

  const calculatorChunk = (() => {
    const marker = 'slug: "mrr-forecast-calculator"';
    const start = calculatorSource.indexOf(marker);
    if (start === -1) return "";
    const nextStart = calculatorSource.indexOf('\n  },\n  {', start + marker.length);
    return calculatorSource.slice(start, nextStart === -1 ? undefined : nextStart);
  })();

  assert.ok(glossaryChunk, "expected the MRR glossary entry to exist");
  assert.ok(guideChunk, "expected the MRR forecast guide to exist");
  assert.ok(calculatorChunk, "expected the MRR forecast calculator to exist");

  assert.match(
    glossaryChunk,
    /mrr-forecast-guide/,
    "expected the MRR glossary to point to the forecast guide",
  );
  assert.match(
    glossaryChunk,
    /heroNote:|nextStepLabel:|nextStepHref:/,
    "expected the MRR glossary to frame itself as a fast definition with a stronger next step",
  );
  assert.match(
    guideChunk,
    /mrr-forecast-calculator/,
    "expected the MRR forecast guide to keep the calculator as the main worked example",
  );
  assert.match(
    guideChunk,
    /nrr|grr|mrr-waterfall/i,
    "expected the MRR forecast guide to send users toward retention-aware next steps",
  );
  assert.match(
    guideChunk,
    /decisionNote:/,
    "expected the MRR forecast guide example to explain why the calculator scenario matters",
  );
  assert.match(
    calculatorChunk,
    /benchmark/i,
    "expected the MRR forecast calculator to expose planning-oriented benchmark guidance",
  );
  assert.match(
    calculatorChunk,
    /nextAction:\s*\{/,
    "expected the MRR forecast calculator to expose a stronger next action",
  );
  assert.match(
    calculatorChunk,
    /nrr|grr|waterfall/i,
    "expected the MRR forecast calculator to frame the next step beyond the projection",
  );
});
