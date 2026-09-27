"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updatePromotionAddon } from "@/lib/supabase/admin-actions";
import type { PromotionAddon } from "@/types/pricing";

export function PromotionAddonEditRow({ addon }: { addon: PromotionAddon }) {
  const [price, setPrice] = useState(String(addon.price_cents / 100));
  const [durationDays, setDurationDays] = useState(String(addon.duration_days));
  const [isActive, setIsActive] = useState(addon.is_active);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await updatePromotionAddon(addon.id, {
          priceCents: Math.round(Number(price) * 100),
          durationDays: Number(durationDays || 0),
          isActive,
        });
        toast.success(`"${addon.name}" posodobljen.`);
      } catch {
        toast.error("Napaka pri shranjevanju.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-[14px] border border-border bg-card p-4">
      <div className="min-w-[140px]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Dodatek</p>
        <p className="mt-1 font-semibold text-foreground">{addon.name}</p>
      </div>
      <div className="w-28 space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Cena (€)</Label>
        <Input type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} />
      </div>
      <div className="w-32 space-y-1.5">
        <Label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Trajanje (dni)
        </Label>
        <Input
          type="number"
          min={1}
          value={durationDays}
          onChange={(event) => setDurationDays(event.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(checked === true)} />
        Aktiven
      </label>
      <Button onClick={handleSave} disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : "Shrani"}
      </Button>
    </div>
  );
}
