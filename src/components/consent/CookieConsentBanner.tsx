"use client";

import { useState } from "react";
import { useConsent } from "@/components/consent/ConsentProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function CookieConsentBanner() {
  const { hasChosen, setConsent } = useConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (hasChosen) return null;

  if (settingsOpen) {
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
              onClick={() => setConsent({ analytics, marketing })}
            >
              Shrani nastavitve
            </Button>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Nazaj
            </Button>
          </div>
        </div>
      </div>
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
          <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
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
