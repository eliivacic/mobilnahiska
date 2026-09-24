"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { signUp, type SignUpActionState } from "@/lib/supabase/actions";

const initialState: SignUpActionState = {};

export function RegisterForm({ returnTo }: { returnTo?: string }) {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const fieldErrors = state.fieldErrors ?? {};

  // Controlled fields: React resets uncontrolled <form> inputs after every
  // action call (success or failure) — without this, a single validation
  // error (e.g. mismatched passwords) would wipe every field, including the
  // name and email the user already typed correctly.
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  if (state.awaitingConfirmation) {
    return (
      <p role="status" className="rounded-[10px] bg-secondary/40 px-3 py-2.5 text-sm text-foreground">
        Račun je bil ustvarjen. Na vaš e-poštni naslov smo poslali povezavo za potrditev — kliknite nanjo, da
        dokončate prijavo.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}

      <div className="space-y-1.5">
        <Label htmlFor="fullName">Ime in priimek</Label>
        <Input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          aria-invalid={!!fieldErrors.fullName}
          aria-describedby={fieldErrors.fullName ? "fullName-error" : undefined}
        />
        {fieldErrors.fullName && (
          <p id="fullName-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.fullName}
          </p>
        )}
      </div>

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
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Geslo</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-invalid={!!fieldErrors.password}
          aria-describedby={fieldErrors.password ? "password-error" : "password-hint"}
        />
        {fieldErrors.password ? (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.password}
          </p>
        ) : (
          <p id="password-hint" className="text-xs text-muted-foreground">
            Vsaj 8 znakov.
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="passwordConfirm">Ponovite geslo</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={passwordConfirm}
          onChange={(event) => setPasswordConfirm(event.target.value)}
          aria-invalid={!!fieldErrors.passwordConfirm}
          aria-describedby={fieldErrors.passwordConfirm ? "passwordConfirm-error" : undefined}
        />
        {fieldErrors.passwordConfirm && (
          <p id="passwordConfirm-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.passwordConfirm}
          </p>
        )}
      </div>

      <div className="space-y-2.5">
        <label className="flex items-start gap-2.5 text-sm text-foreground">
          <Checkbox
            id="termsAccepted"
            name="termsAccepted"
            required
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
            aria-invalid={!!fieldErrors.termsAccepted}
            aria-describedby={fieldErrors.termsAccepted ? "termsAccepted-error" : undefined}
            className="mt-0.5"
          />
          <span>
            Strinjam se s{" "}
            <Link href="/pogoji" className="font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              pogoji uporabe
            </Link>{" "}
            in{" "}
            <Link href="/zasebnost" className="font-medium text-primary hover:underline" target="_blank" rel="noopener noreferrer">
              politiko zasebnosti
            </Link>
            .
          </span>
        </label>
        {fieldErrors.termsAccepted && (
          <p id="termsAccepted-error" role="alert" className="text-sm text-destructive">
            {fieldErrors.termsAccepted}
          </p>
        )}

        <label className="flex items-start gap-2.5 text-sm text-foreground">
          <Checkbox
            id="marketingOptIn"
            name="marketingOptIn"
            checked={marketingOptIn}
            onCheckedChange={(checked) => setMarketingOptIn(checked === true)}
            className="mt-0.5"
          />
          <span className="text-muted-foreground">
            Želim prejemati novice in ponudbe po e-pošti (neobvezno).
          </span>
        </label>
      </div>

      {state.error && (
        <p role="alert" className="rounded-[10px] bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Ustvarjanje računa …" : "Ustvari račun"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Že imate račun?{" "}
        <Link
          href={returnTo ? `/prijava?returnTo=${encodeURIComponent(returnTo)}` : "/prijava"}
          className="font-semibold text-primary hover:underline"
        >
          Prijavite se
        </Link>
      </p>
    </form>
  );
}
