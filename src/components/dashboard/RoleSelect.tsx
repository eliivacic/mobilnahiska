"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { updateUserRole } from "@/lib/supabase/admin-actions";

const ROLES = ["user", "dealer", "admin"] as const;
type Role = (typeof ROLES)[number];

export function RoleSelect({ userId, role }: { userId: string; role: string }) {
  const [pending, startTransition] = useTransition();
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  function applyRoleChange(nextRole: Role) {
    startTransition(async () => {
      try {
        await updateUserRole(userId, nextRole);
        toast.success(`Vloga posodobljena na "${nextRole}".`);
      } catch {
        toast.error("Napaka pri spreminjanju vloge.");
      }
    });
  }

  function handleValueChange(value: string) {
    const nextRole = value as Role;
    // Changes to or away from admin grant/revoke full portal control, so they
    // require an explicit confirmation — everything else applies right away.
    if (nextRole === "admin" || role === "admin") {
      setPendingRole(nextRole);
      return;
    }
    applyRoleChange(nextRole);
  }

  return (
    <>
      <Select value={role} disabled={pending} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <ConfirmDialog
        open={pendingRole !== null}
        onOpenChange={(open) => !open && setPendingRole(null)}
        title={pendingRole === "admin" ? "Podeli administratorske pravice?" : "Odvzemi administratorske pravice?"}
        description={
          pendingRole === "admin"
            ? "Uporabnik bo dobil popoln nadzor nad celotnim portalom, vključno z uporabniki, plačili in nastavitvami."
            : "Uporabnik bo izgubil dostop do administratorske nadzorne plošče."
        }
        confirmLabel="Potrdi"
        destructive={pendingRole !== "admin"}
        onConfirm={() => {
          if (pendingRole) applyRoleChange(pendingRole);
          setPendingRole(null);
        }}
      />
    </>
  );
}
