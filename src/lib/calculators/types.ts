export type CalculatorCategorySlug = "saas-metrics" | "paid-ads" | "finance";

export type CalculatorCategory = {
  slug: CalculatorCategorySlug;
  title: string;
  description: string;
};

export type InputField = {
  key: string;
  label: string;
  help?: string;
  placeholder?: string;
  suffix?: string;
  prefix?: string;
  step?: number;
  min?: number;
  defaultValue: string;
};

export type ResultValue = {
  key: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent" | "multiple" | "months" | "ratio";
  currency?: string;
  maxFractionDigits?: number;
  detail?: string;
};

export type CalculatorDefinition = {
  slug: string;
  title: string;
  description: string;
  category: CalculatorCategorySlug;
  featured?: boolean;
  guideSlug?: string;
  inputs: InputField[];
  compute: (values: Record<string, number>) => {
    headline: ResultValue;
    secondary?: ResultValue[];
    breakdown?: ResultValue[];
    warnings?: string[];
  };
  formula: string;
  assumptions: string[];
  faqs: Array<{ question: string; answer: string }>;
  guide?: Array<{
    title: string;
    bullets: string[];
  }>;
};
