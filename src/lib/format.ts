export function toNumber(value: string): number | null {
  const normalized = value.replaceAll(",", "").trim();
  if (!normalized) return null;
  const asNumber = Number(normalized);
  return Number.isFinite(asNumber) ? asNumber : null;
}

export function clampNonNegative(value: number): number {
  return value < 0 ? 0 : value;
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, maxFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

export function formatPercent(value: number, maxFractionDigits = 2): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: maxFractionDigits,
  }).format(value);
}

