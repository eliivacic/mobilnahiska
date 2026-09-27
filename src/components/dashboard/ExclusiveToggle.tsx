"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleListingExclusive } from "@/lib/supabase/admin-actions";

export function ExclusiveToggle({ submissionId, isExclusive }: { submissionId: string; isExclusive: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant={isExclusive ? "default" : "outline"}
      className={isExclusive ? "bg-primary text-primary-foreground hover:bg-brand-hover" : ""}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleListingExclusive(submissionId, !isExclusive);
          toast.success(isExclusive ? "Ekskluzivnost odstranjena." : "Zemljišče označeno kot ekskluzivno.");
        })
      }
    >
      {isExclusive ? "Ekskluzivno ✓" : "Označi ekskluzivno"}
    </Button>
  );
}
