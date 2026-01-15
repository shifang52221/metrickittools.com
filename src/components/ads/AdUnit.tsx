"use client";

import { useEffect, useId } from "react";
import {
  consentBannerEnabled,
  useConsent,
} from "@/components/consent/consentStore";
import { getAdSenseClient, isAdSenseEnabled } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdUnitProps = {
  slot?: string;
  className?: string;
  style?: React.CSSProperties;
};

export function AdUnit({ slot, className, style }: AdUnitProps) {
  const enabled = isAdSenseEnabled();
  const client = getAdSenseClient();
  const gated = consentBannerEnabled();
  const consent = useConsent();
  const id = useId();
  const isDev = process.env.NODE_ENV === "development";
  const showDebug = isDev
    ? process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS !== "false"
    : false;

  useEffect(() => {
    if (!enabled || !client || !slot) return;
    if (gated && consent !== "accepted") return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // ignore
    }
  }, [client, consent, enabled, gated, slot]);

  if (showDebug) {
    const statusLines: string[] = [];
    statusLines.push(`AdSense enabled: ${enabled ? "yes" : "no"}`);
    statusLines.push(`AdSense client: ${client ? "set" : "missing"}`);
    statusLines.push(`Ad slot: ${slot ? "set" : "missing"}`);
    statusLines.push(
      `Consent: ${consent ?? "unset"} (needs accepted to load ads)`,
    );
    return (
      <div
        className={[
          "rounded-2xl border border-dashed border-zinc-300 bg-white p-4 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-400",
          className ?? "",
        ].join(" ")}
        style={style}
        data-ad-debug={id}
      >
        <div className="font-medium text-zinc-900 dark:text-zinc-100">
          Ad placeholder
        </div>
        <div className="mt-2 space-y-1">
          {statusLines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
    );
  }

  if (!enabled || !client || !slot) return null;
  if (gated && consent !== "accepted") return null;

  return (
    <div
      className={[
        "rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-black",
        className ?? "",
      ].join(" ")}
      style={style}
      data-ad-unit={id}
    >
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
