import { isAdSenseEnabled } from "@/lib/adsense";

function isConsentModeEnabled() {
  const explicit = process.env.NEXT_PUBLIC_GCM_ENABLED;
  if (explicit !== undefined) return explicit === "true";
  return process.env.NODE_ENV === "production";
}

function getConsentModeDefaults() {
  const adsEnabled = isAdSenseEnabled();
  const gaEnabled = process.env.NEXT_PUBLIC_GA_ENABLED === "true";
  const shouldSet = adsEnabled || gaEnabled;
  return { shouldSet };
}

function getCmpProvider() {
  return (process.env.NEXT_PUBLIC_CMP_PROVIDER || "").trim();
}

function getFundingChoicesScriptSrc() {
  return (process.env.NEXT_PUBLIC_GOOGLE_FC_SCRIPT_SRC || "").trim();
}

export function GoogleConsentHead() {
  const enabled = isConsentModeEnabled();
  const { shouldSet } = getConsentModeDefaults();
  const provider = getCmpProvider();
  const fcSrc = getFundingChoicesScriptSrc();

  if (!enabled || !shouldSet) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
          `.trim(),
        }}
      />
      {provider === "google-funding-choices" && fcSrc ? (
        <script async src={fcSrc} />
      ) : null}
    </>
  );
}

