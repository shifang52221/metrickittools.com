import type { CalculatorCategory, CalculatorDefinition } from "./types";
import { calculatorsPart1 } from "./definitions.part1";
import { calculatorsPart2 } from "./definitions.part2";
import { calculatorsPart3 } from "./definitions.part3";
import { calculatorsPart4 } from "./definitions.part4";
import { calculatorsPart5 } from "./definitions.part5";

export const categories: CalculatorCategory[] = [
  {
    slug: "saas-metrics",
    title: "SaaS Metrics",
    description:
      "SaaS unit economics and retention calculators for CAC, LTV, payback, churn, and growth quality.",
  },
  {
    slug: "paid-ads",
    title: "Paid Ads",
    description:
      "Paid ads performance calculators for ROAS, CPA, break-even targets, and budget decisions.",
  },
  {
    slug: "finance",
    title: "Finance",
    description:
      "Finance calculators for runway, burn, cash flow, and valuation planning.",
  },
];

export const calculators: CalculatorDefinition[] = [
  ...calculatorsPart1,
  ...calculatorsPart2,
  ...calculatorsPart3,
  ...calculatorsPart4,
  ...calculatorsPart5,
];
