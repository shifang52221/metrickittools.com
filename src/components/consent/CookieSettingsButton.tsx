"use client";

import { useState } from "react";
import { clearConsent, consentBannerEnabled } from "@/components/consent/ConsentBanner";

export function CookieSettingsButton() {
  const enabled = consentBannerEnabled();
  const cmpProvider = (process.env.NEXT_PUBLIC_CMP_PROVIDER || "").trim();
  const [status, setStatus] = useState<"idle" | "done">("idle");
  if (!enabled && cmpProvider !== "google-funding-choices") return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (cmpProvider === "google-funding-choices") {
          const fc = (window as unknown as { googlefc?: { showConsentTool?: () => void } })
            .googlefc;
          if (fc?.showConsentTool) {
            fc.showConsentTool();
            return;
          }
        }
        clearConsent();
        setStatus("done");
        window.setTimeout(() => window.location.reload(), 150);
      }}
      className="hover:underline"
    >
      {status === "done"
        ? "Updating..."
        : cmpProvider === "google-funding-choices"
          ? "Privacy choices"
          : "Cookie settings"}
    </button>
  );
}
