"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, type AuthActionState } from "@/lib/supabase/actions";

const initialState: AuthActionState = {};

export function LoginForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const errorRef = useRef<HTMLParagraphElement>(null);
  // Controlled so a failed login doesn't force retyping the email too —
  // React resets uncontrolled <form> inputs after every action call.
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (state.error) errorRef.current?.focus();
  }, [state.error]);

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <div className="space-y-1.5">
        <Label htmlFor="email">E-poštni naslov</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Geslo</Label>
          <Link href="/pozabljeno-geslo" className="text-sm font-medium text-primary hover:underline">
            Pozabljeno geslo?
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      {state.error && (
        <p
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive outline-none"
        >
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Prijavljanje …" : "Prijava"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nimate računa?{" "}
        <Link
          href={returnTo ? `/registracija?returnTo=${encodeURIComponent(returnTo)}` : "/registracija"}
          className="font-semibold text-primary hover:underline"
        >
          Registrirajte se
        </Link>
      </p>
    </form>
  );
}
