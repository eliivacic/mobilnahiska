import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { PageShell } from "@/components/layout/PageShell";

const columns = [
  {
    title: "Oglasi",
    links: [
      { label: "Mobilne hiške", href: "/oglasi?type=mobilna" },
      { label: "Modularne hiše", href: "/oglasi?type=modularna" },
      { label: "Zemljišča", href: "/zemljisca" },
      { label: "Oddaj oglas", href: "/oddaj-oglas" },
    ],
  },
  {
    title: "Portal",
    links: [
      { label: "Ponudniki", href: "/ponudniki" },
      { label: "Od parcele do hiške", href: "/vodici" },
      { label: "Paketi in cenik", href: "/cene" },
      { label: "Kontakt", href: "mailto:info@mobilnahiska.si" },
    ],
  },
  {
    title: "Informacije",
    links: [
      { label: "Pogoji uporabe", href: "/pogoji" },
      { label: "Politika zasebnosti", href: "/zasebnost" },
      { label: "Piškotki", href: "/piskotki" },
      { label: "Pravno obvestilo", href: "/impresum" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-header">
      <PageShell className="py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center">
              <Logo variant="onLight" className="h-16" />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-header-foreground/75">
              Slovenski marketplace za mobilne in modularne hiške ter zemljišča.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-header-foreground/75">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-header-foreground/80 transition-colors hover:text-header-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-header-foreground/15 pt-6 text-sm text-header-foreground/75 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} mobilnahiska.si. Vse pravice pridržane.</p>
        </div>
      </PageShell>
    </footer>
  );
}
