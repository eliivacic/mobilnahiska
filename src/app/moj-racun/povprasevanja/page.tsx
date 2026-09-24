import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Povpraševanja | mobilnahiska.si" };

// Inquiries need a listing to be sent through — since listings aren't
// database-backed yet, there's no way for a buyer to actually submit one.
// Real empty state, no fake rows.
export default function PovprasevanjaPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Povpraševanja</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Sporočila kupcev, prejeta preko vaših oglasov.
      </p>

      <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground">Za vaše oglase še ni novih povpraševanj.</p>
        <p className="text-sm text-muted-foreground">
          Ta razdelek bo zaživel, ko bo oddaja oglasov povezana s podatkovno bazo.
        </p>
      </div>
    </div>
  );
}
