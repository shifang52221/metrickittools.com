"use client";

import { useState } from "react";
import Link from "next/link";

import { consentBannerEnabled, setConsent, useConsent } from "./consentStore";

export function ConsentBanner() {
  const enabled = consentBannerEnabled();
  const consent = useConsent();
  const [visible, setVisible] = useState(() => {
    if (!enabled) return false;
    if (typeof window === "undefined") return false;
    return true;
  });

  if (!enabled || !visible || consent !== null) return null;

  const accept = () => {
    setConsent("accepted");
    setVisible(false);
  };

  const decline = () => {
    setConsent("denied");
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-zinc-700 dark:text-zinc-300">
          We use cookies to serve ads and measure performance. You can accept or
          decline non-essential cookies. See our{" "}
          <Link className="underline" href="/privacy">
            Privacy Policy
          </Link>
          .
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export { consentBannerEnabled } from "./consentStore";
export { clearConsent, getConsent as readConsent } from "./consentStore";
