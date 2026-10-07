/** Clé localStorage pour le choix de la bannière cookies. */
export const COOKIE_CONSENT_STORAGE_KEY = "portfolio_cookie_consent";

/** Incrémenter si le texte légal ou les traceurs changent. */
export const COOKIE_CONSENT_VERSION = 1;

export type CookieConsentChoice = "accepted";

export type CookieConsentRecord = {
  version: number;
  choice: CookieConsentChoice;
  at: string;
};
