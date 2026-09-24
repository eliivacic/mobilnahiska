"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, type RequestPasswordResetState } from "@/lib/supabase/actions";

const initialState: RequestPasswordResetState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  if (state.submitted) {
    return (
      <p role="status" className="rounded-[10px] bg-secondary/40 px-3 py-2.5 text-sm text-foreground">
        Če e-poštni naslov obstaja v naši bazi, smo nanj poslali povezavo za ponastavitev gesla. Preverite tudi
        mapo z vsiljeno pošto.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">E-poštni naslov</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      {state.error && (
        <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Pošiljanje …" : "Pošlji povezavo za ponastavitev"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/prijava" className="font-semibold text-primary hover:underline">
          Nazaj na prijavo
        </Link>
      </p>
    </form>
  );
}
