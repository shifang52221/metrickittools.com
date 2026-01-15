"use client";

import Script from "next/script";
import {
  consentBannerEnabled,
  useConsent,
} from "@/components/consent/consentStore";
import { getAdSenseClient, isAdSenseEnabled } from "@/lib/adsense";

export function AdSenseLoader() {
  const client = getAdSenseClient();
  const enabled = isAdSenseEnabled();
  const gated = consentBannerEnabled();
  const consent = useConsent();

  if (!enabled || !client) return null;

  if (gated) {
    if (consent !== "accepted") return null;
  }

  return (
    <Script
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        client,
      )}`}
      crossOrigin="anonymous"
    />
  );
}
