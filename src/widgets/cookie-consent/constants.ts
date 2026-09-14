export const COOKIE_CONSENT_KEY = "lizok-cookie-consent";
export const COOKIE_CONSENT_EVENT = "lizok:cookie-consent";

export const hasCookieConsent = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
};
