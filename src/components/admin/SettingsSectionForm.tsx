"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updatePortalSettingsBatch } from "@/lib/supabase/admin-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SettingsField {
  key: string;
  label: string;
  defaultValue: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
}

export function SettingsSectionForm({ fields }: { fields: SettingsField[] }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    const entries: Record<string, string> = {};
    for (const field of fields) {
      entries[field.key] = String(formData.get(field.key) ?? "");
    }
    startTransition(async () => {
      try {
        await updatePortalSettingsBatch(entries);
        toast.success("Nastavitve shranjene.");
      } catch {
        toast.error("Napaka pri shranjevanju nastavitev.");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.type === "textarea" ? (
            <textarea
              id={field.key}
              name={field.key}
              defaultValue={field.defaultValue}
              placeholder={field.placeholder}
              rows={3}
              className="w-full rounded-[8px] border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <Input
              id={field.key}
              name={field.key}
              type={field.type ?? "text"}
              defaultValue={field.defaultValue}
              placeholder={field.placeholder}
            />
          )}
        </div>
      ))}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Shranjujem …" : "Shrani spremembe"}
      </Button>
    </form>
  );
}
