"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { deleteUser } from "@/lib/supabase/admin-actions";

export function DeleteUserButton({ userId, displayName }: { userId: string; displayName: string }) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Uporabnik izbrisan.");
    });
  }

  return (
    <ConfirmDialog
      trigger={
        <Button size="sm" variant="destructive" disabled={pending}>
          Izbriši
        </Button>
      }
      title={`Trajno izbriši uporabnika "${displayName}"?`}
      description="Skupaj z računom se nepovratno izbrišejo tudi vsi njegovi oglasi, komentarji, priljubljeni, plačila in naročnine. Tega dejanja ni mogoče razveljaviti."
      confirmLabel="Izbriši"
      destructive
      onConfirm={handleDelete}
    />
  );
}
