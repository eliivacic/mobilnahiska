import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";
import { RoleSelect } from "@/components/dashboard/RoleSelect";

export const metadata: Metadata = { title: "Uporabniki | Admin | mobilnahiska.si" };

export default async function AdminUporabnikiPage() {
  const admin = createAdminClient();
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name, role, company_name, created_at")
    .order("created_at", { ascending: false });

  const { data: authUsers } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const emailById = new Map(authUsers?.users.map((u) => [u.id, u.email]) ?? []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Uporabniki</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{profiles?.length ?? 0} registriranih uporabnikov.</p>

      <div className="mt-6 hidden overflow-hidden rounded-[14px] border border-border md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Ime</th>
              <th className="px-4 py-3">E-pošta</th>
              <th className="px-4 py-3">Podjetje</th>
              <th className="px-4 py-3">Registracija</th>
              <th className="px-4 py-3">Vloga</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium text-foreground">{profile.full_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{emailById.get(profile.id) ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{profile.company_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(profile.created_at)}</td>
                <td className="px-4 py-3">
                  <RoleSelect userId={profile.id} role={profile.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-3 md:hidden">
        {(profiles ?? []).map((profile) => (
          <div key={profile.id} className="rounded-[14px] border border-border bg-card p-4">
            <p className="font-semibold text-foreground">{profile.full_name || "Brez imena"}</p>
            <p className="text-sm text-muted-foreground">{emailById.get(profile.id) ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground">Registracija: {formatDate(profile.created_at)}</p>
            <div className="mt-3">
              <RoleSelect userId={profile.id} role={profile.role} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
