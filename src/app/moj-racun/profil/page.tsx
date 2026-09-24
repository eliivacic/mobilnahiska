import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/dashboard/ProfileForm";

export const metadata: Metadata = { title: "Profil | mobilnahiska.si" };

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, company_name")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Profil</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{user!.email}</p>

      <div className="mt-6">
        <ProfileForm
          defaultFullName={profile?.full_name ?? ""}
          defaultPhone={profile?.phone ?? ""}
          defaultCompanyName={profile?.company_name ?? ""}
        />
      </div>
    </div>
  );
}
