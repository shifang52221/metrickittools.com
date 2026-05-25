import test from "node:test";
import assert from "node:assert/strict";
import { clampMetaDescription, clampMetaTitle } from "./seo.ts";

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
