"use client";

import { useState } from "react";
import { Phone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizePhoneForTel } from "@/lib/format";

export function PhoneReveal({ phone }: { phone: string }) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!revealed) {
    return (
      <Button variant="outline" className="w-full gap-2" onClick={() => setRevealed(true)}>
        <Phone className="h-4 w-4" />
        Prikaži telefon
      </Button>
    );
  }

  const telHref = `tel:${normalizePhoneForTel(phone)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can be unavailable (e.g. insecure context) — the
      // number is still visible and callable, so this is a soft failure.
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" className="flex-1 gap-2">
        <a href={telHref} aria-label={`Pokliči ${phone}`}>
          <Phone className="h-4 w-4" />
          {phone}
        </a>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleCopy}
        aria-label={copied ? "Številka kopirana" : "Kopiraj telefonsko številko"}
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
