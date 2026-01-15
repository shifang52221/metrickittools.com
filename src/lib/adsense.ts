export const defaultAdSenseConfig = {
  client: "ca-pub-8677561632094995",
  slots: {
    paidAdsCalculator: "5561416389",
  },
} as const;

export function isAdSenseEnabled() {
  const explicit = process.env.NEXT_PUBLIC_ADSENSE_ENABLED;
  if (explicit !== undefined) return explicit === "true";
  return process.env.NODE_ENV === "production";
}

export function getAdSenseClient() {
  const explicit = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (explicit || defaultAdSenseConfig.client).trim();
}

