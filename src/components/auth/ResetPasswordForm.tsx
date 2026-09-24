"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword, type UpdatePasswordState } from "@/lib/supabase/actions";

const initialState: UpdatePasswordState = {};

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  if (state.success) {
    return (
      <div className="space-y-4">
        <p role="status" className="rounded-[10px] bg-secondary/40 px-3 py-2.5 text-sm text-foreground">
          Geslo je bilo uspešno posodobljeno.
        </p>
        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/moj-racun">Nadaljuj na moj račun</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
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

      {state.error && (
        <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : "Nastavi novo geslo"}
      </Button>
    </form>
  );
}
