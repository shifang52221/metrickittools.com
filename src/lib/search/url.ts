import type { ReadonlyURLSearchParams } from "next/navigation";

export function buildSearchHref(query: string): string {
  const q = query.trim();
  return q ? `/search?q=${encodeURIComponent(q)}` : "/search";
}

export function readSearchQuery(params: ReadonlyURLSearchParams): string {
  return params.get("q") ?? "";
}
