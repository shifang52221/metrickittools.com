export type GuideSection =
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | {
      type: "table";
      columns: string[];
      rows: string[][];
    };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  category: "saas-metrics" | "paid-ads" | "finance";
  updatedAt: string; // YYYY-MM-DD
  sections: GuideSection[];
  relatedCalculatorSlugs: string[];
  faqs?: Array<{ question: string; answer: string }>;
  examples?: Array<{
    label: string;
    calculatorSlug: string;
    params: Record<string, string>;
    note?: string;
  }>;
};
