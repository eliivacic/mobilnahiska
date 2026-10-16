"use client";

import { useState } from "react";
import { Cookie } from "lucide-react";
import { useConsent } from "@/components/consent/ConsentProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function CookieConsentBanner() {
  const { consent, hasChosen, setConsent } = useConsent();
  // Separate from hasChosen on purpose: hasChosen tracks whether the visitor
  // has EVER made a choice, panelOpen tracks whether the settings panel is
  // open right now — reopened later via the persistent icon, or on first
  // visit via "Nastavitve" in the initial banner. Both paths land here.
  const [panelOpen, setPanelOpen] = useState(false);
  const [analytics, setAnalytics] = useState(consent.analytics);
  const [marketing, setMarketing] = useState(consent.marketing);

  function openPanel() {
    // Re-seed from the current saved choice each time it's reopened, so
    // editing later doesn't show stale values from the first visit.
    setAnalytics(consent.analytics);
    setMarketing(consent.marketing);
    setPanelOpen(true);
  }

  if (panelOpen) {
    return (
      <div
        role="dialog"
        aria-label="Nastavitve piškotkov"
        style={{ bottom: "var(--mobile-cta-bar-offset, 0px)" }}
        className="fixed inset-x-0 z-50 border-t border-border bg-card p-4 shadow-[0_-8px_24px_-12px_rgba(48,37,33,0.2)] sm:p-6"
      >
        <div className="mx-auto max-w-3xl">
          <p className="font-heading text-lg font-light tracking-[-0.01em] text-foreground">Nastavitve piškotkov</p>
          <div className="mt-3 space-y-2.5 text-sm">
            <label className="flex items-center gap-2 text-foreground/70">
              <Checkbox checked disabled />
              Nujni — vedno omogočeni, potrebni za osnovno delovanje portala.
            </label>
            <label className="flex items-center gap-2 text-foreground">
              <Checkbox checked={analytics} onCheckedChange={(v) => setAnalytics(v === true)} />
              Analitični — pomagajo nam razumeti uporabo portala (Google Analytics).
            </label>
            <label className="flex items-center gap-2 text-foreground">
              <Checkbox checked={marketing} onCheckedChange={(v) => setMarketing(v === true)} />
              Marketinški — trenutno se ne uporabljajo.
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="bg-primary text-primary-foreground hover:bg-brand-hover"
              onClick={() => {
                setConsent({ analytics, marketing });
                setPanelOpen(false);
              }}
            >
              Shrani nastavitve
            </Button>
            {/* Before a first choice exists there's nothing to go "back" to
                other than the initial banner, so only offer Cancel once a
                real saved choice is already in place. */}
            {hasChosen && (
              <Button variant="outline" onClick={() => setPanelOpen(false)}>
                Prekliči
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (hasChosen) {
    // Persistent, always-reachable way back into cookie settings — without
    // this, a visitor who already chose has no way to change their mind
    // short of clearing cookies manually.
    return (
      <button
        type="button"
        aria-label="Nastavitve piškotkov"
        title="Nastavitve piškotkov"
        onClick={openPanel}
        style={{ bottom: "calc(var(--mobile-cta-bar-offset, 0px) + 16px)" }}
        className="fixed right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground/70 shadow-[0_4px_16px_-4px_rgba(48,37,33,0.25)] transition-colors hover:text-foreground"
      >
        <Cookie className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      style={{ bottom: "var(--mobile-cta-bar-offset, 0px)" }}
      className="fixed inset-x-0 z-50 border-t border-border bg-card p-4 shadow-[0_-8px_24px_-12px_rgba(48,37,33,0.2)] sm:p-6"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/90">
          Uporabljamo piškotke za osnovno delovanje portala in, z vašim soglasjem, za analitiko obiska. Več v{" "}
          <a href="/piskotki" className="font-semibold text-primary hover:underline">
            politiki piškotkov
          </a>
          .
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={openPanel}>
            Nastavitve
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConsent({ analytics: false, marketing: false })}>
            Zavrni nenujne
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-brand-hover"
            onClick={() => setConsent({ analytics: true, marketing: true })}
          >
            Sprejmi vse
          </Button>
        </div>
      </div>
    </div>
  );
}
