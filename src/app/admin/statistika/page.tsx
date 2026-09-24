import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminBarChart } from "@/components/admin/AdminBarChart";

export const metadata: Metadata = { title: "Statistika | Admin | mobilnahiska.si" };

const DAYS = 30;

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

function bucketByDay(dates: string[], days: string[]): number[] {
  const counts = new Map(days.map((day) => [day, 0]));
  for (const iso of dates) {
    const day = iso.slice(0, 10);
    if (counts.has(day)) counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return days.map((day) => counts.get(day) ?? 0);
}

export default async function AdminStatistikaPage() {
  const admin = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - DAYS);

  const [{ data: profiles }, { data: comments }] = await Promise.all([
    admin.from("profiles").select("created_at").gte("created_at", since.toISOString()),
    admin.from("comments").select("created_at").gte("created_at", since.toISOString()),
  ]);

  const days = lastNDays(DAYS);
  const signupCounts = bucketByDay((profiles ?? []).map((p) => p.created_at), days);
  const commentCounts = bucketByDay((comments ?? []).map((c) => c.created_at), days);

  const signupPoints = days.map((day, i) => ({ label: day, value: signupCounts[i] }));
  const commentPoints = days.map((day, i) => ({ label: day, value: commentCounts[i] }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Statistika</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Podatki so prikazani samo za dogodke, ki jih portal dejansko beleži.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[14px] border border-border bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Nove registracije (zadnjih {DAYS} dni)
          </p>
          <p className="mt-1 text-2xl font-light text-foreground">{signupCounts.reduce((a, b) => a + b, 0)}</p>
          <div className="mt-4">
            <AdminBarChart points={signupPoints} unit="registracij" />
          </div>
        </div>

        <div className="rounded-[14px] border border-border bg-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Novi komentarji (zadnjih {DAYS} dni)
          </p>
          <p className="mt-1 text-2xl font-light text-foreground">{commentCounts.reduce((a, b) => a + b, 0)}</p>
          <div className="mt-4">
            <AdminBarChart points={commentPoints} unit="komentarjev" />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Ogledi, konverzije in prodajni lijak</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Portal še ne beleži ogledov oglasov, klikov na kontakt ali drugih dogodkov, zato tu ni prikazan izmišljen
          prodajni lijak. Ko bo dodano sledenje dogodkom, se bo ta razdelek napolnil z realnimi podatki.
        </p>
      </div>
    </div>
  );
}
