"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { type ConsentState, DEFAULT_CONSENT, readConsentCookie, writeConsentCookie } from "@/lib/consent";

interface ConsentContextValue {
  consent: ConsentState;
  hasChosen: boolean;
  setConsent: (next: { analytics: boolean; marketing: boolean }) => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  // Starts as "not chosen" on both server and first client render (avoids a
  // hydration mismatch), then syncs from the real cookie right after mount —
  // nothing that depends on consent (the GA scripts) renders before this
  // effect runs, so there's no window where analytics could fire ungated.
  const [consent, setConsentState] = useState<ConsentState>(DEFAULT_CONSENT);
  const [hasChosen, setHasChosen] = useState(false);

  useEffect(() => {
    // Deferred to a microtask so the setState calls happen asynchronously,
    // not synchronously within the effect body — same pattern this codebase
    // already uses in FavoritesProvider for the equivalent "sync from an
    // external source after mount" case.
    queueMicrotask(() => {
      const existing = readConsentCookie();
      if (existing) {
        setConsentState(existing);
        setHasChosen(true);
      }
    });
  }, []);

  const setConsent = useCallback((next: { analytics: boolean; marketing: boolean }) => {
    const state: ConsentState = { necessary: true, ...next };
    setConsentState(state);
    setHasChosen(true);
    writeConsentCookie(state);
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, hasChosen, setConsent }}>{children}</ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within ConsentProvider");
  return ctx;
}
