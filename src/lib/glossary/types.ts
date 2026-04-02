export type GlossaryCategorySlug = "saas-metrics" | "paid-ads" | "finance";

export type GlossarySection =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "bullets"; items: string[] };

export type GlossaryFaq = { question: string; answer: string };

export type GlossarySeo = {
  title?: string;
  description?: string;
  heroNote?: string;
  nextStepLabel?: string;
  nextStepHref?: string;
};

export type GlossaryPageModuleKey =
  | "compareWith"
  | "misusedWhen"
  | "measuredAs"
  | "operatorTakeaway"
  | "nextDecision";

export type GlossaryPageModuleValue = string | string[];

export type GlossaryPageModules = Partial<
  Record<GlossaryPageModuleKey, GlossaryPageModuleValue>
>;

export type GlossaryPageModule = {
  key: GlossaryPageModuleKey;
  title: string;
  items: string[];
};

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
  seo?: GlossarySeo;
  modules?: GlossaryPageModules;
};

