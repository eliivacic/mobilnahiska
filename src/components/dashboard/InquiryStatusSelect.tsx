"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  contacted: "Kontaktirano",
  closed: "Zaključeno",
};

export function InquiryStatusSelect({
  inquiryId,
  status,
  onUpdate,
}: {
  inquiryId: string;
  status: string;
  onUpdate: (inquiryId: string, status: "new" | "contacted" | "closed") => Promise<{ error?: string } | void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      const result = await onUpdate(inquiryId, value as "new" | "contacted" | "closed");
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Status posodobljen.");
      }
    });
  }

  return (
    <Select value={status} onValueChange={handleChange} disabled={pending}>
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
