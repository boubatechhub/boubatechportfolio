import { useCallback, useEffect, useState } from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  type CookieConsentRecord,
} from "../constants/cookies";

function readConsent(): CookieConsentRecord | null {
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (
      parsed?.version !== COOKIE_CONSENT_VERSION ||
      parsed?.choice !== "accepted"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function useCookieConsent() {
  const [hydrated, setHydrated] = useState(false);
  const [consent, setConsent] = useState<CookieConsentRecord | null>(null);

  useEffect(() => {
    setConsent(readConsent());
    setHydrated(true);
  }, []);

  const accept = useCallback(() => {
    const record: CookieConsentRecord = {
      version: COOKIE_CONSENT_VERSION,
      choice: "accepted",
      at: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record));
    setConsent(record);
  }, []);

  return {
    hydrated,
    consent,
    showBanner: hydrated && consent === null,
    accept,
  };
}
