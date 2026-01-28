export function clampMetaDescription(
  description: string | null | undefined,
  maxLength: number = 160,
): string | undefined {
  if (!description) return undefined;
  const cleaned = description.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  const cutoff = cleaned.slice(0, Math.max(0, maxLength - 3));
  const lastSpace = cutoff.lastIndexOf(" ");
  const trimmed = lastSpace > 60 ? cutoff.slice(0, lastSpace) : cutoff;
  return `${trimmed}...`;
}
