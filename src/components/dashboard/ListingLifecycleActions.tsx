"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { deactivateListingSubmission, reactivateListingSubmission } from "@/lib/supabase/listing-submissions";

export function ListingLifecycleActions({ submissionId, status }: { submissionId: string; status: string }) {
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (status === "deactivated") {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await reactivateListingSubmission(submissionId);
            if (result.error) toast.error(result.error);
            else toast.success("Oglas je bil poslan v ponoven pregled.");
          })
        }
      >
        Ponovno omogoči
      </Button>
    );
  }

  if (status === "rejected") return null;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
        Deaktiviraj
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Deaktiviraj oglas?"
        description="Oglas ne bo več javno viden. Kadarkoli ga lahko znova omogočite — takrat bo šel ponovno v pregled."
        confirmLabel="Deaktiviraj"
        destructive
        onConfirm={() =>
          startTransition(async () => {
            const result = await deactivateListingSubmission(submissionId);
            if (result.error) toast.error(result.error);
            else toast.success("Oglas deaktiviran.");
          })
        }
      />
    </>
  );
}
