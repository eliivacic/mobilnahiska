"use client";

import { readConsentCookie } from "@/lib/consent";

// GA4 events for the marketplace funnel. Never pass PII (name, email,
// phone, message content) as an event parameter — only ids/slugs/categorical
// values. Silently no-ops if analytics consent hasn't been granted or gtag
// hasn't loaded yet (e.g. consent granted this session but the script is
// still fetching) — tracking is always best-effort, never something a user
// flow depends on.
export function trackEvent(name: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  const consent = readConsentCookie();
  if (!consent?.analytics) return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name, params);
}
