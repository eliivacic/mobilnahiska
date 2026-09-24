import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/supabase/actions";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/layout/PageShell";

const NAV_ITEMS = [
  { label: "Pregled", href: "/moj-racun" },
  { label: "Moji oglasi", href: "/moj-racun/oglasi" },
  { label: "Povpraševanja", href: "/moj-racun/povprasevanja" },
  { label: "Priljubljeni", href: "/moj-racun/priljubljeni" },
  { label: "Moj paket", href: "/moj-racun/paket" },
  { label: "Profil", href: "/moj-racun/profil" },
];

export default async function MojRacunLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/prijava");
  }

  return (
    <PageShell className="py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <DashboardNav items={NAV_ITEMS} />
          <form action={signOut} className="mt-4 border-t border-border pt-4">
            <Button type="submit" variant="outline" className="w-full">
              Odjava
            </Button>
          </form>
        </aside>
        <div>{children}</div>
      </div>
    </PageShell>
  );
}
