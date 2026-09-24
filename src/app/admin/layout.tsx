import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();

  const [{ data: profile }, { count: pendingCommentsCount }] = await Promise.all([
    admin.from("profiles").select("full_name").eq("id", user.id).single(),
    admin.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const adminName = profile?.full_name || "Administrator";
  const adminEmail = user.email ?? "";

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar adminName={adminName} adminEmail={adminEmail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar adminName={adminName} adminEmail={adminEmail} pendingCommentsCount={pendingCommentsCount ?? 0} />
        <main className="flex-1 bg-background px-4 py-6 lg:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
