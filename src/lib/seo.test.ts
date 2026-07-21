import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { clampMetaDescription, clampMetaTitle } from "./seo.ts";
import { editorialPolicyTitle } from "./static-metadata.ts";

test("clampMetaTitle preserves short titles", () => {
  assert.equal(
    clampMetaTitle("ARR guide: formula, examples, and mistakes"),
    "ARR guide: formula, examples, and mistakes",
  );
});

test("clampMetaTitle trims long titles on word boundaries", () => {
  assert.equal(
    clampMetaTitle(
      "Liquidation preference explained: 1x non-participating, conversion, and exit payouts",
    ),
    "Liquidation preference explained: 1x non-participating...",
  );
});

test("clampMetaDescription preserves existing behavior", () => {
  assert.equal(
    clampMetaDescription(
      "Net debt is total debt minus cash, adjusted for debt-like items when needed.",
    ),
    "Net debt is total debt minus cash, adjusted for debt-like items when needed.",
  );
});

test("audited titles stay within the 60 character SEO budget", () => {
  const calculatorPart2Source = readFileSync(
    new URL("./calculators/definitions.part2.ts", import.meta.url),
    "utf8",
  );
  const calculatorPart3Source = readFileSync(
    new URL("./calculators/definitions.part3.ts", import.meta.url),
    "utf8",
  );
  const saasExtraSource = readFileSync(
    new URL("./glossary/terms/saasExtra.ts", import.meta.url),
    "utf8",
  );
  const magicNumberChunk = calculatorPart2Source.match(
    /slug:\s*"saas-magic-number-calculator"[\s\S]*?title:\s*"([^"]+)"/,
  );
  const mrrForecastChunk = calculatorPart3Source.match(
    /slug:\s*"mrr-forecast-calculator"[\s\S]*?title:\s*"([^"]+)"/,
  );
  const quotaCarryingRepsChunk = saasExtraSource.match(
    /slug:\s*"quota-carrying-reps"[\s\S]*?title:\s*"([^"]+)"/,
  );
  const magicNumberTitle = magicNumberChunk?.[1] ?? null;
  const mrrForecastTitle = mrrForecastChunk?.[1] ?? null;
  const quotaCarryingRepsTitle = quotaCarryingRepsChunk?.[1] ?? null;

  const auditedTitles = [
    editorialPolicyTitle,
    magicNumberTitle,
    mrrForecastTitle,
    quotaCarryingRepsTitle,
  ];

  for (const title of auditedTitles) {
    assert.ok(title, "expected the audited title to exist");
    assert.ok(title.length <= 60, `expected "${title}" to stay within 60 characters`);
  }
});
