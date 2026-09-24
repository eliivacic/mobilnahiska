import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { listings, getProviders } from "@/data/listings";
import { lands } from "@/data/land";
import { guides } from "@/data/guides";
import { formatDateTimeSl } from "@/lib/format";

export const metadata: Metadata = { title: "Admin | mobilnahiska.si" };

const QUICK_ACTIONS = [
  { label: "Preglej komentarje", href: "/admin/komentarji" },
  { label: "Uredi pakete in cene", href: "/admin/paketi" },
  { label: "Nastavitve portala", href: "/admin/nastavitve" },
  { label: "Uporabniki", href: "/admin/uporabniki" },
];

export default async function AdminPregledPage() {
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: pendingComments },
    { count: totalComments },
    { data: recentProfiles },
    { data: recentComments },
    { data: recentAuditLog },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }),
    admin.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("comments").select("id", { count: "exact", head: true }),
    admin.from("profiles").select("id, full_name, role, created_at").order("created_at", { ascending: false }).limit(5),
    admin
      .from("comments")
      .select("id, article_slug, created_at, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    admin.from("admin_audit_log").select("id, admin_id, action, entity_type, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const mobilnaCount = listings.filter((listing) => listing.type === "mobilna").length;
  const modularnaCount = listings.filter((listing) => listing.type === "modularna").length;
  const providersCount = getProviders().length;
  const publishedGuidesCount = guides.length;

  const primaryKpis = [
    { label: "Skupno uporabnikov", value: totalUsers ?? 0, href: "/admin/uporabniki" },
    { label: "Mobilne hiške", value: mobilnaCount, href: "/admin/oglasi" },
    { label: "Modularne hiške", value: modularnaCount, href: "/admin/oglasi" },
    { label: "Zemljišča", value: lands.length, href: "/admin/zemljisca" },
  ];

  const secondaryKpis = [
    { label: "Ponudniki", value: providersCount },
    { label: "Vodiči objavljeni", value: publishedGuidesCount },
    { label: "Komentarji čakajo", value: pendingComments ?? 0 },
    { label: "Komentarji skupaj", value: totalComments ?? 0 },
  ];

  const needsAction = [
    pendingComments && pendingComments > 0
      ? {
          label: `${pendingComments} ${pendingComments === 1 ? "komentar čaka" : "komentarji/-jev čaka(jo)"} na pregled`,
          href: "/admin/komentarji",
        }
      : null,
  ].filter(Boolean) as { label: string; href: string }[];

  type ActivityItem = { id: string; label: string; timestamp: string };

  const activity: ActivityItem[] = [
    ...(recentProfiles ?? []).map((profile) => ({
      id: `profile-${profile.id}`,
      label: `Nova registracija: ${profile.full_name || "Uporabnik"} (${profile.role})`,
      timestamp: profile.created_at,
    })),
    ...(recentComments ?? []).map((comment) => {
      const author = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
      return {
        id: `comment-${comment.id}`,
        label: `Nov komentar od ${author?.full_name || "uporabnika"} na /vodici/${comment.article_slug}`,
        timestamp: comment.created_at,
      };
    }),
    ...(recentAuditLog ?? []).map((entry) => ({
      id: `audit-${entry.id}`,
      label: `Admin dejanje: ${entry.action} (${entry.entity_type})`,
      timestamp: entry.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Pregled portala</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {primaryKpis.map((kpi) => (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="rounded-[14px] border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 font-heading text-2xl font-light tracking-[-0.01em] text-foreground">{kpi.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {secondaryKpis.map((kpi) => (
          <div key={kpi.label} className="rounded-[10px] border border-border bg-muted/40 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{kpi.label}</p>
            <p className="mt-0.5 text-lg font-semibold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Zahteva ukrepanje</h2>
        {needsAction.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Odlično – trenutno ni odprtih opravil.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {needsAction.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center justify-between rounded-[12px] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary/40"
                >
                  {item.label}
                  <span className="text-primary">Odpri →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Zadnja aktivnost</h2>
          {activity.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">Ni nedavne aktivnosti.</p>
          ) : (
            <ul className="mt-3 divide-y divide-border rounded-[14px] border border-border bg-card">
              {activity.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-foreground">{item.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatDateTimeSl(item.timestamp)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">Hitre akcije</h2>
          <div className="mt-3 space-y-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block rounded-[12px] border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:border-primary/40"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Prihodki in plačila</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ta razdelek bo prikazoval prave finančne podatke, ko bo povezan plačilni ponudnik.
        </p>
      </div>

      <div className="mt-6 rounded-[14px] border border-dashed border-border p-6 text-center">
        <p className="text-sm font-semibold text-foreground">Aktivnost trga in najuspešnejši oglasi</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ta razdelek zahteva sledenje ogledom in povpraševanjem po oglasih, kar še ni implementirano — glej
          &ldquo;ŠE NI IMPLEMENTIRANO&rdquo; v tehničnem poročilu.
        </p>
      </div>
    </div>
  );
}
