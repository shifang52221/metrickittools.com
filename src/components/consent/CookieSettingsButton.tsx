"use client";

import { useState } from "react";
import { clearConsent, consentBannerEnabled } from "@/components/consent/ConsentBanner";

export function CookieSettingsButton() {
  const enabled = consentBannerEnabled();
  const cmpProvider = (process.env.NEXT_PUBLIC_CMP_PROVIDER || "").trim();
  const fcSrc = (process.env.NEXT_PUBLIC_GOOGLE_FC_SCRIPT_SRC || "").trim();
  const [status, setStatus] = useState<"idle" | "done">("idle");
  const fcEnabled = cmpProvider === "google-funding-choices" && Boolean(fcSrc);
  if (!enabled && !fcEnabled) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (fcEnabled) {
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
        : fcEnabled
          ? "Privacy choices"
          : "Cookie settings"}
    </button>
  );
}
