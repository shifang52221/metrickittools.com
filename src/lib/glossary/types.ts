export type GlossaryCategorySlug = "saas-metrics" | "paid-ads" | "finance";

export type GlossarySection =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] };

export type GlossaryFaq = { question: string; answer: string };

export type GlossaryTerm = {
  slug: string;
  title: string;
  description: string;
  category: GlossaryCategorySlug;
  updatedAt: string; // YYYY-MM-DD
  sections: GlossarySection[];
  faqs?: GlossaryFaq[];
  relatedGuideSlugs?: string[];
  relatedCalculatorSlugs?: string[];
};

