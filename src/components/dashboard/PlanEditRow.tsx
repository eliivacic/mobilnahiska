"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updatePlan } from "@/lib/supabase/admin-actions";
import { BILLING_PERIOD_LABELS, type Plan } from "@/types/pricing";

export function PlanEditRow({ plan }: { plan: Plan }) {
  const [name, setName] = useState(plan.name);
  const [price, setPrice] = useState(String(plan.price_cents / 100));
  const [unlimited, setUnlimited] = useState(plan.max_active_listings === null);
  const [maxListings, setMaxListings] = useState(String(plan.max_active_listings ?? ""));
  const [description, setDescription] = useState(plan.description ?? "");
  const [features, setFeatures] = useState(plan.features.join("\n"));
  const [ctaLabel, setCtaLabel] = useState(plan.cta_label ?? "");
  const [durationDays, setDurationDays] = useState(String(plan.duration_days ?? ""));
  const [isActive, setIsActive] = useState(plan.is_active);
  const [isFeatured, setIsFeatured] = useState(plan.is_featured);
  const [pending, startTransition] = useTransition();

  const isOneTime = plan.billing_period === "one_time";

  function handleSave() {
    startTransition(async () => {
      try {
        await updatePlan(plan.id, {
          name,
          priceCents: Math.round(Number(price) * 100),
          maxActiveListings: unlimited ? null : Number(maxListings || 0),
          description,
          features: features
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          ctaLabel,
          durationDays: isOneTime ? Number(durationDays || 0) : null,
          isActive,
          isFeatured,
        });
        toast.success(`Paket "${name}" posodobljen.`);
      } catch {
        toast.error("Napaka pri shranjevanju paketa.");
      }
    });
  }

  return (
    <div className="rounded-[14px] border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-semibold text-foreground">{plan.name}</p>
        <span className="rounded-[4px] bg-muted px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {BILLING_PERIOD_LABELS[plan.billing_period]}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Naziv paketa</Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Cena (€{isOneTime ? "" : " / mesec"})</Label>
          <Input type="number" min={0} value={price} onChange={(event) => setPrice(event.target.value)} />
        </div>

        {isOneTime ? (
          <div className="space-y-1.5">
            <Label>Obdobje (dni)</Label>
            <Input
              type="number"
              min={1}
              value={durationDays}
              onChange={(event) => setDurationDays(event.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-1.5">
            <Label>Maks. aktivnih oglasov</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                value={maxListings}
                disabled={unlimited}
                onChange={(event) => setMaxListings(event.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 pt-1 text-sm text-muted-foreground">
              <Checkbox checked={unlimited} onCheckedChange={(checked) => setUnlimited(checked === true)} />
              Neomejeno
            </label>
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Besedilo gumba (CTA)</Label>
          <Input value={ctaLabel} onChange={(event) => setCtaLabel(event.target.value)} />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label>Opis</Label>
        <Input value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>

      <div className="mt-4 space-y-1.5">
        <Label>Funkcije paketa (ena na vrstico)</Label>
        <textarea
          value={features}
          onChange={(event) => setFeatures(event.target.value)}
          rows={5}
          className="w-full rounded-[10px] border border-border bg-background p-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox checked={isActive} onCheckedChange={(checked) => setIsActive(checked === true)} />
          Aktiven (prikazan na /cene)
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <Checkbox checked={isFeatured} onCheckedChange={(checked) => setIsFeatured(checked === true)} />
          Označen kot &ldquo;Najbolj priljubljen&rdquo;
        </label>
      </div>

      <Button
        onClick={handleSave}
        disabled={pending}
        className="mt-5 bg-primary text-primary-foreground hover:bg-brand-hover"
      >
        {pending ? "Shranjevanje …" : "Shrani spremembe"}
      </Button>
    </div>
  );
}
