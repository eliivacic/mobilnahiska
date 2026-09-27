"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { updatePortalSettingsBatch } from "@/lib/supabase/admin-actions";

const NOTIFICATION_TYPES: { key: string; label: string; hint: string }[] = [
  { key: "email_notify_welcome", label: "Dobrodošlica", hint: "Po potrditvi e-poštnega naslova." },
  {
    key: "email_notify_listing_status",
    label: "Status oglasa",
    hint: "Prejem, odobritev, zavrnitev in opozorilo pred potekom oglasa.",
  },
  { key: "email_notify_inquiry", label: "Novo povpraševanje", hint: "Ob prejemu povpraševanja za oglas." },
  { key: "email_notify_expiry", label: "Potek oglasa/paketa", hint: "Opozorilo 3 dni pred potekom." },
  { key: "email_notify_admin", label: "Obvestila za administratorja", hint: "Nov oglas, novo povpraševanje." },
];

export function EmailNotificationToggles({ initialValues }: { initialValues: Record<string, boolean> }) {
  const [values, setValues] = useState(initialValues);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        const entries = Object.fromEntries(
          NOTIFICATION_TYPES.map((item) => [item.key, values[item.key] ? "true" : "false"])
        );
        await updatePortalSettingsBatch(entries);
        toast.success("Nastavitve obvestil shranjene.");
      } catch {
        toast.error("Napaka pri shranjevanju.");
      }
    });
  }

  return (
    <div className="space-y-3">
      {NOTIFICATION_TYPES.map((item) => (
        <label
          key={item.key}
          className="flex items-start gap-3 rounded-[10px] border border-border bg-card p-3.5"
        >
          <Checkbox
            checked={values[item.key] ?? true}
            onCheckedChange={(checked) => setValues((prev) => ({ ...prev, [item.key]: checked === true }))}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm font-medium text-foreground">{item.label}</span>
            <span className="block text-xs text-muted-foreground">{item.hint}</span>
          </span>
        </label>
      ))}
      <Button onClick={handleSave} disabled={pending} className="mt-1">
        {pending ? "Shranjujem …" : "Shrani spremembe"}
      </Button>
    </div>
  );
}
