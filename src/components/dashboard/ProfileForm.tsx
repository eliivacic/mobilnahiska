"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile, type ProfileActionState } from "@/lib/supabase/actions";

const initialState: ProfileActionState = {};

export function ProfileForm({
  defaultFullName,
  defaultPhone,
  defaultCompanyName,
}: {
  defaultFullName: string;
  defaultPhone: string;
  defaultCompanyName: string;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="max-w-md space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Ime in priimek</Label>
        <Input id="fullName" name="fullName" defaultValue={defaultFullName} autoComplete="name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Telefon</Label>
        <Input id="phone" name="phone" type="tel" defaultValue={defaultPhone} autoComplete="tel" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="companyName">Podjetje (za profesionalne ponudnike)</Label>
        <Input id="companyName" name="companyName" defaultValue={defaultCompanyName} autoComplete="organization" />
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-primary">Profil je posodobljen.</p>}

      <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : "Shrani spremembe"}
      </Button>
    </form>
  );
}
