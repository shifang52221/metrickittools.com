"use client";

import { useEffect } from "react";
import { useConsent } from "@/components/consent/consentStore";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function GoogleConsentSync() {
  const consent = useConsent();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    if (consent === null) return;

    const granted = consent === "accepted" ? "granted" : "denied";
    window.gtag("consent", "update", {
      ad_storage: granted,
      analytics_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
    });
  }, [consent]);

  return null;
}

