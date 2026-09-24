"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";

export interface AuthActionState {
  error?: string;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const returnTo = safeRedirectPath(String(formData.get("returnTo") ?? ""), "/moj-racun");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Napačen e-poštni naslov ali geslo." };
  }

  redirect(returnTo);
}

export interface SignUpActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  awaitingConfirmation?: boolean;
}

export async function signUp(_prevState: SignUpActionState, formData: FormData): Promise<SignUpActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const termsAccepted = formData.get("termsAccepted") === "on";
  const returnTo = safeRedirectPath(String(formData.get("returnTo") ?? ""), "/moj-racun");

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = "Vnesite ime in priimek.";
  if (!email) fieldErrors.email = "Vnesite e-poštni naslov.";
  if (password.length < 8) fieldErrors.password = "Geslo mora imeti vsaj 8 znakov.";
  if (password !== passwordConfirm) fieldErrors.passwordConfirm = "Gesli se ne ujemata.";
  if (!termsAccepted) fieldErrors.termsAccepted = "Za registracijo morate sprejeti pogoje uporabe.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, marketing_opt_in: formData.get("marketingOptIn") === "on" },
      emailRedirectTo: `${origin}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
    },
  });

  if (error) {
    return {
      error:
        error.message === "User already registered"
          ? "Ta e-poštni naslov je že registriran."
          : "Registracija ni uspela. Poskusite znova.",
    };
  }

  // With email confirmation required, signUp succeeds but returns no
  // session yet — sending the user straight to /moj-racun would just
  // bounce them back to /prijava with no explanation.
  if (!data.session) {
    return { awaitingConfirmation: true };
  }

  redirect(returnTo);
}

export interface RequestPasswordResetState {
  submitted?: boolean;
  error?: string;
}

export async function requestPasswordReset(
  _prevState: RequestPasswordResetState,
  formData: FormData
): Promise<RequestPasswordResetState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Vnesite e-poštni naslov." };

  const origin = await getOrigin();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?type=recovery`,
  });

  // Always report success, regardless of whether the address is registered —
  // otherwise this endpoint could be used to enumerate registered emails.
  return { submitted: true };
}

export interface UpdatePasswordState {
  error?: string;
  success?: boolean;
}

export async function updatePassword(
  _prevState: UpdatePasswordState,
  formData: FormData
): Promise<UpdatePasswordState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (password.length < 8) return { error: "Geslo mora imeti vsaj 8 znakov." };
  if (password !== passwordConfirm) return { error: "Gesli se ne ujemata." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: "Gesla ni bilo mogoče posodobiti. Povezava je morda potekla — poskusite znova." };
  }

  return { success: true };
}

export interface ProfileActionState {
  error?: string;
  success?: boolean;
}

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Za urejanje profila se morate prijaviti." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName || null, phone: phone || null, company_name: companyName || null })
    .eq("id", user.id);

  if (error) return { error: "Profila ni bilo mogoče posodobiti. Poskusite znova." };

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
