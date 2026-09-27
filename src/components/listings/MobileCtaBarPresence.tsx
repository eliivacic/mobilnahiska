"use client";

import { useEffect } from "react";

// Signals to CookieConsentBanner (via a CSS variable, not a prop — they
// don't share a DOM ancestor) that a page-level fixed bottom bar is present,
// so the banner stacks above it instead of overlapping and blocking its
// buttons. Without this, on a fresh visit the consent banner and the mobile
// sticky "Pošlji povpraševanje" bar would occupy the same screen area and
// each could block the other's clicks — caught by e2e/mobile.spec.ts.
export function MobileCtaBarPresence({ heightPx = 76 }: { heightPx?: number }) {
  useEffect(() => {
    document.documentElement.style.setProperty("--mobile-cta-bar-offset", `${heightPx}px`);
    return () => {
      document.documentElement.style.setProperty("--mobile-cta-bar-offset", "0px");
    };
  }, [heightPx]);

  return null;
}
