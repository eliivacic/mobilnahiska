"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { checkRateLimit } from "@/lib/rate-limit";
import { slugify } from "@/lib/slug";

export interface AuthActionState {
  error?: string;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip") ?? "unknown";
}

export async function signIn(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const returnTo = safeRedirectPath(String(formData.get("returnTo") ?? ""), "/moj-racun");

  const ip = await getClientIp();
  const [byIp, byEmail] = await Promise.all([
    checkRateLimit({ key: `login_ip:${ip}`, limit: 20, windowMinutes: 15 }),
    checkRateLimit({ key: `login_email:${email.toLowerCase()}`, limit: 8, windowMinutes: 15 }),
  ]);
  if (!byIp.allowed || !byEmail.allowed) {
    return { error: "Preveč neuspešnih poskusov prijave. Poskusite znova čez nekaj minut." };
  }

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
  // Defaults to the homepage (not /moj-racun) so confirming an email with no
  // specific returnTo in flight lands the user on mobilnahiska.si itself —
  // an explicit returnTo (e.g. from /oddaj-oglas) still takes priority.
  const returnTo = safeRedirectPath(String(formData.get("returnTo") ?? ""), "/");

  const fieldErrors: Record<string, string> = {};
  if (!fullName) fieldErrors.fullName = "Vnesite ime in priimek.";
  if (!email) fieldErrors.email = "Vnesite e-poštni naslov.";
  if (password.length < 8) fieldErrors.password = "Geslo mora imeti vsaj 8 znakov.";
  if (password !== passwordConfirm) fieldErrors.passwordConfirm = "Gesli se ne ujemata.";
  if (!termsAccepted) fieldErrors.termsAccepted = "Za registracijo morate sprejeti pogoje uporabe.";

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const ip = await getClientIp();
  const rateLimit = await checkRateLimit({ key: `signup_ip:${ip}`, limit: 10, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { error: "Preveč registracij v kratkem času s te naprave. Poskusite znova čez nekaj časa." };
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

  const ip = await getClientIp();
  const [byIp, byEmail] = await Promise.all([
    checkRateLimit({ key: `password_reset_ip:${ip}`, limit: 10, windowMinutes: 60 }),
    checkRateLimit({ key: `password_reset_email:${email.toLowerCase()}`, limit: 3, windowMinutes: 60 }),
  ]);
  // Still report success either way — this must not reveal whether the
  // rate limit (or the email's existence) triggered the no-op, otherwise it
  // becomes an account-enumeration oracle.
  if (!byIp.allowed || !byEmail.allowed) {
    return { submitted: true };
  }

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
  const description = String(formData.get("description") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const logoUrl = String(formData.get("logoUrl") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Za urejanje profila se morate prijaviti." };

  const { data: currentProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isDealer = currentProfile?.role === "dealer";

  const update: Record<string, unknown> = {
    full_name: fullName || null,
    phone: phone || null,
    company_name: companyName || null,
  };

  // Provider profile fields only apply to (and are only shown to) dealer
  // accounts — regenerated from company_name every save so the slug can
  // never silently drift from what SellerCard/public pages re-derive.
  if (isDealer) {
    Object.assign(update, {
      description: description || null,
      website: website || null,
      location: location || null,
      logo_url: logoUrl || null,
      provider_slug: companyName ? slugify(companyName) : null,
    });
  }

  const { error } = await supabase.from("profiles").update(update).eq("id", user.id);

  if (error) return { error: "Profila ni bilo mogoče posodobiti. Poskusite znova." };

  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
