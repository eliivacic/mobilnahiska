"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type AuthActionState } from "@/lib/supabase/actions";

const initialState: AuthActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-poštni naslov</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Geslo</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Prijavljanje …" : "Prijava"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nimate računa?{" "}
        <Link href="/registracija" className="font-semibold text-primary hover:underline">
          Registrirajte se
        </Link>
      </p>
    </form>
  );
}
