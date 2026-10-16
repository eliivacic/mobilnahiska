"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, type UpdatePasswordState } from "@/lib/supabase/actions";

const initialState: UpdatePasswordState = {};

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="password">Novo geslo</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <p className="text-xs text-muted-foreground">Vsaj 8 znakov.</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="passwordConfirm">Ponovite novo geslo</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Geslo je bilo uspešno posodobljeno.</p>}

      <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : "Spremeni geslo"}
      </Button>
    </form>
  );
}
