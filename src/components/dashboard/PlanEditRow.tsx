"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePlan } from "@/lib/supabase/admin-actions";

interface Props {
  id: string;
  name: string;
  priceCents: number;
  maxActiveListings: number;
  isActive: boolean;
}

export function PlanEditRow({ id, name, priceCents, maxActiveListings, isActive }: Props) {
  const [price, setPrice] = useState(String(priceCents / 100));
  const [maxListings, setMaxListings] = useState(String(maxActiveListings));
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      try {
        await updatePlan(id, {
          priceCents: Math.round(Number(price) * 100),
          maxActiveListings: Number(maxListings),
          isActive,
        });
        toast.success(`Paket "${name}" posodobljen.`);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        toast.error("Napaka pri shranjevanju paketa.");
      }
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-[14px] border border-border bg-card p-4">
      <div className="min-w-[100px]">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Paket</p>
        <p className="mt-1 font-semibold text-foreground">{name}</p>
      </div>
      <div className="w-28">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Cena (€/mes.)
        </label>
        <Input type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} />
      </div>
      <div className="w-36">
        <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Maks. aktivnih oglasov
        </label>
        <Input
          type="number"
          min={1}
          value={maxListings}
          onChange={(event) => setMaxListings(event.target.value)}
        />
      </div>
      <Button onClick={handleSave} disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : saved ? "Shranjeno ✓" : "Shrani"}
      </Button>
    </div>
  );
}
