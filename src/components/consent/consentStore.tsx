"use client";

import { useSyncExternalStore } from "react";

export type ConsentValue = "accepted" | "denied";

const CONSENT_KEY = "mk_cookie_consent";
const CONSENT_EVENT = "mk-consent-change";

function readStoredConsent(): ConsentValue | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "accepted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  return readStoredConsent();
}

function emitConsentChange() {
  try {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  } catch {
    // ignore
  }
}

export function setConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // ignore
  }
  emitConsentChange();
}

export function clearConsent() {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
  emitConsentChange();
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener(CONSENT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(CONSENT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribe, getConsent, () => null);
}

export function consentBannerEnabled(): boolean {
  const env = process.env.NEXT_PUBLIC_CONSENT_BANNER_ENABLED;
  if (env === "false") return false;
  if (env === "true") return true;
  const adsEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";
  const gaEnabled = process.env.NEXT_PUBLIC_GA_ENABLED === "true";
  return adsEnabled || gaEnabled;
}
