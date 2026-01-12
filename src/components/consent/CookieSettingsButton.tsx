"use client";

import { useState } from "react";
import { clearConsent, consentBannerEnabled } from "@/components/consent/ConsentBanner";

export function CookieSettingsButton() {
  const enabled = consentBannerEnabled();
  const [status, setStatus] = useState<"idle" | "done">("idle");
  if (!enabled) return null;

  return (
    <button
      type="button"
      onClick={() => {
        clearConsent();
        setStatus("done");
        window.setTimeout(() => window.location.reload(), 150);
      }}
      className="hover:underline"
    >
      {status === "done" ? "Updating..." : "Cookie settings"}
    </button>
  );
}
