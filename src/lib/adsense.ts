export const defaultAdSenseConfig = {
  client: "ca-pub-8677561632094995",
  slots: {
    homeMid: "5105480188",
    categoryMid: "6454220877",
    guidesIndexMid: "3087667414",
    guideBottom: "5141139208",
    calculatorSidebar: "7178955666",
  },
} as const;

const slotsFromEnv = {
  homeMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID,
  categoryMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CATEGORY_MID,
  guidesIndexMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDES_INDEX_MID,
  guideBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_BOTTOM,
  calculatorSidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CALCULATOR_SIDEBAR,
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

export type AdSenseSlotName = keyof typeof slotsFromEnv;

export function getAdSenseSlot(name: AdSenseSlotName) {
  const explicit = slotsFromEnv[name];
  const fallback = defaultAdSenseConfig.slots[name];
  return (explicit || fallback || "").trim();
}
