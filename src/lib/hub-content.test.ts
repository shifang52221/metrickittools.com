import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  guideDecisionPaths,
  glossaryHubHighlightSlugs,
} from "./content/hubHighlights.ts";

test("guides hub exposes five decision-oriented entry paths", () => {
  assert.equal(guideDecisionPaths.length, 5);

  for (const path of guideDecisionPaths) {
    assert.ok(path.title, "expected every guide path to have a title");
    assert.ok(path.description, "expected every guide path to explain when it helps");
    assert.match(path.primary.href, /^\/guides\/[^/]+$/);
    assert.ok(path.primary.label, "expected every guide path to have a primary label");
  }
});

test("glossary hub highlights the core definitions users need first", () => {
  assert.deepEqual(glossaryHubHighlightSlugs, [
    "arr",
    "mrr",
    "cac",
    "ltv",
    "gross-margin",
    "payback-period",
    "roas",
    "mer",
    "net-debt",
  ]);
});

test("hub pages render the shared decision and core-definition sections", () => {
  const guidesPage = readFileSync(
    new URL("../app/guides/page.tsx", import.meta.url),
    "utf8",
  );
  const glossaryPage = readFileSync(
    new URL("../app/glossary/page.tsx", import.meta.url),
    "utf8",
  );

  assert.match(guidesPage, /guideDecisionPaths/);
  assert.match(guidesPage, /Start from the decision/);
  assert.match(glossaryPage, /glossaryHubHighlightSlugs/);
  assert.match(glossaryPage, /Core definitions to start with/);
});
