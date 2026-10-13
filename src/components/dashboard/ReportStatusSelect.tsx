"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  reviewed: "Pregledano",
  dismissed: "Zavrnjeno",
};

export function ReportStatusSelect({
  reportId,
  status,
  onUpdate,
}: {
  reportId: string;
  status: string;
  onUpdate: (reportId: string, status: "new" | "reviewed" | "dismissed") => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      try {
        await onUpdate(reportId, value as "new" | "reviewed" | "dismissed");
        toast.success("Status posodobljen.");
      } catch {
        toast.error("Napaka pri posodabljanju statusa.");
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
