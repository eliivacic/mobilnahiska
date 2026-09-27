// Cookie-consent state, shared between the banner, the analytics script
// loader, and the event tracker. A plain cookie (not localStorage) so a
// server component could read it too if ever needed — today only client
// components read/write it.

export interface ConsentState {
  necessary: true; // always granted, never actually asked about
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_COOKIE_NAME = "mh_cookie_consent";

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function readConsentCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
      return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing };
    }
    return null;
  } catch {
    return null;
  }
}

export function writeConsentCookie(state: Omit<ConsentState, "necessary">): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify({ analytics: state.analytics, marketing: state.marketing }));
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${oneYear}; SameSite=Lax`;
}
