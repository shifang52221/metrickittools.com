"use client";

import Script from "next/script";
import {
  consentBannerEnabled,
  useConsent,
} from "@/components/consent/consentStore";

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const enabled = process.env.NEXT_PUBLIC_GA_ENABLED === "true";
  const gated = consentBannerEnabled();
  const consent = useConsent();

  if (process.env.NODE_ENV !== "production") return null;
  if (!enabled || !measurementId) return null;
  if (gated && consent !== "accepted") return null;

  return (
    <>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js-id=${encodeURIComponent(
          measurementId,
        )}`}
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}

