import type { CalculatorDefinition } from "@/lib/calculators/types";
import type { Guide } from "@/lib/guides/types";
import type {
  GlossaryPageModule,
  GlossaryPageModuleKey,
  GlossaryPageModuleValue,
  GlossarySection,
  GlossaryTerm,
} from "./types";

type GlossaryModuleContext = {
  relatedCalculators: CalculatorDefinition[];
  relatedGuides: Guide[];
};

const moduleTitles: Record<GlossaryPageModuleKey, string> = {
  compareWith: "Compare it with",
  misusedWhen: "Misused when",
  measuredAs: "Measured as",
  operatorTakeaway: "Operator takeaway",
  nextDecision: "Next decision",
};

function normalizeItems(value: GlossaryPageModuleValue | undefined): string[] {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(items: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
}

function collectSectionBody(
  sections: GlossarySection[],
): Array<{ heading: string; items: string[] }> {
  const groups: Array<{ heading: string; items: string[] }> = [];
  let currentHeading = "";

  for (const section of sections) {
    if (section.type === "h2") {
      currentHeading = section.text;
      groups.push({ heading: currentHeading, items: [] });
      continue;
    }

    if (!groups.length) continue;

    if (section.type === "p") {
      groups.at(-1)?.items.push(section.text);
      continue;
    }

    groups.at(-1)?.items.push(...section.items);
  }

  return groups;
}

function getSectionItems(
  groups: Array<{ heading: string; items: string[] }>,
  pattern: RegExp,
): string[] {
  return groups
    .filter((group) => pattern.test(group.heading))
    .flatMap((group) => group.items);
}

function categoryFallbackTakeaway(term: GlossaryTerm): string[] {
  if (term.category === "paid-ads") {
    return [
      `Use ${term.title} only inside a stable attribution rule, conversion definition, and time window so campaign comparisons stay honest.`,
      "If performance changes, check whether the metric moved for a real business reason or because the measurement setup changed underneath you.",
    ];
  }

  if (term.category === "finance") {
    return [
      `Tie ${term.title} to the same balance-sheet date, scenario, and decision memo you are using elsewhere in the model.`,
      "Document which claims, costs, or adjustments your team includes before comparing numbers across forecasts, covenants, or valuation work.",
    ];
  }

  return [
    `Keep ${term.title} consistent by cohort, segment, and period before you use it as a decision signal in planning or reporting.`,
    "Interpret the metric alongside retention, margin, or payback so one ratio does not hide the real operating trade-off.",
  ];
}

function categoryFallbackMeasuredAs(term: GlossaryTerm): string[] {
  if (term.category === "paid-ads") {
    return [
      `Measure ${term.title} with a fixed attribution window, conversion event, and spend basis before comparing campaigns or creative tests.`,
    ];
  }

  if (term.category === "finance") {
    return [
      `Measure ${term.title} with the same date, unit basis, and accounting or policy definitions used in the rest of your model.`,
    ];
  }

  return [
    `Measure ${term.title} on the same customer segment, time window, and revenue basis each time you review it.`,
  ];
}

function categoryFallbackDecisionItems(term: GlossaryTerm): string[] {
  if (term.category === "paid-ads") {
    return [
      `Decide which report owns ${term.title} before comparing campaigns, channels, or creative tests.`,
      "If the number moves, check attribution, tracking, and conversion definitions before changing budget.",
    ];
  }

  if (term.category === "finance") {
    return [
      `Decide whether ${term.title} belongs in cash planning, valuation, or debt monitoring so the number is used in the right model.`,
      "If the number changes, trace the timing, policy, or balance-sheet assumption behind it before you react.",
    ];
  }

  return [
    `Decide whether ${term.title} is a growth, retention, or efficiency signal before you set targets around it.`,
    "If the number improves, confirm the change came from a real operating shift rather than a cohort, pricing, or period mismatch.",
  ];
}

function buildNextDecisionItems(term: GlossaryTerm, context: GlossaryModuleContext): string[] {
  const items: string[] = [];

  if (context.relatedCalculators.length) {
    items.push(
      `Quantify the impact with ${context.relatedCalculators[0].title} if you need to turn the definition into an operating assumption.`,
    );
  }

  if (context.relatedGuides.length) {
    items.push(
      `Read ${context.relatedGuides[0].title} if the decision depends on interpretation, policy, or trade-offs beyond the raw formula.`,
    );
  }

  for (const fallbackItem of categoryFallbackDecisionItems(term)) {
    if (items.length >= 2) break;
    items.push(fallbackItem);
  }

  return items;
}

export function getGlossaryPageModules(
  term: GlossaryTerm,
  context: GlossaryModuleContext,
): GlossaryPageModule[] {
  const groups = collectSectionBody(term.sections);
  const measuredAs = unique([
    ...normalizeItems(term.modules?.measuredAs),
    ...getSectionItems(groups, /^formula$/i),
    ...(!term.modules?.measuredAs &&
    !getSectionItems(groups, /^formula$/i).length
      ? categoryFallbackMeasuredAs(term)
      : []),
  ]);
  const misusedWhen = unique([
    ...normalizeItems(term.modules?.misusedWhen),
    ...getSectionItems(groups, /^common mistakes$/i),
  ]);
  const operatorTakeaway = unique([
    ...normalizeItems(term.modules?.operatorTakeaway),
    ...getSectionItems(groups, /^how to use it$/i).slice(0, 3),
    ...(!term.modules?.operatorTakeaway ? categoryFallbackTakeaway(term) : []),
  ]);
  const compareWith = unique(normalizeItems(term.modules?.compareWith));
  const nextDecision = unique([
    ...normalizeItems(term.modules?.nextDecision),
    ...buildNextDecisionItems(term, context),
  ]);

  const moduleItems: Array<[GlossaryPageModuleKey, string[]]> = [
    ["compareWith", compareWith],
    ["measuredAs", measuredAs],
    ["misusedWhen", misusedWhen],
    ["operatorTakeaway", operatorTakeaway],
    ["nextDecision", nextDecision],
  ];

  return moduleItems
    .filter(([, items]) => items.length)
    .map(([key, items]) => ({
      key,
      title: moduleTitles[key],
      items,
    }));
}
