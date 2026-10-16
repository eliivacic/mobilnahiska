import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { PasswordChangeForm } from "@/components/dashboard/PasswordChangeForm";

export const metadata: Metadata = { title: "Profil | mobilnahiska.si" };

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, company_name, role, description, website, location, logo_url")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Profil</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{user!.email}</p>

      <div className="mt-6">
        <ProfileForm
          isDealer={profile?.role === "dealer"}
          defaultFullName={profile?.full_name ?? ""}
          defaultPhone={profile?.phone ?? ""}
          defaultCompanyName={profile?.company_name ?? ""}
          defaultDescription={profile?.description ?? ""}
          defaultWebsite={profile?.website ?? ""}
          defaultLocation={profile?.location ?? ""}
          defaultLogoUrl={profile?.logo_url ?? ""}
        />
      </div>

      <div className="mt-10 border-t border-border pt-6">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Geslo</h2>
        <div className="mt-4">
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
}
