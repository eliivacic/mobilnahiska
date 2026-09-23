import Link from "next/link";
import Image from "next/image";

const columns = [
  {
    title: "Marketplace",
    links: [
      { label: "Mobilne hiške", href: "/oglasi?type=mobilna" },
      { label: "Modularne hiše", href: "/oglasi?type=modularna" },
      { label: "Nove hiške", href: "/oglasi?condition=nova" },
      { label: "Rabljene hiške", href: "/oglasi?condition=rabljena" },
    ],
  },
  {
    title: "Podjetje",
    links: [
      { label: "Ponudniki", href: "/ponudniki" },
      { label: "Vodiči", href: "/vodici" },
      { label: "Oddaj oglas", href: "/oddaj-oglas" },
      { label: "Cenik / Paketi za ponudnike", href: "/cene" },
    ],
  },
  {
    title: "Pravno",
    links: [
      { label: "Pogoji uporabe", href: "/pogoji" },
      { label: "Zasebnost", href: "/zasebnost" },
      { label: "Piškotki", href: "/piskotki" },
    ],
  },
  {
    title: "Kontakt",
    links: [{ label: "info@mobilnahiska.si", href: "mailto:info@mobilnahiska.si" }],
  },
];

export function Footer() {
  return (
    <footer className="bg-brand">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-5">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-white.png"
                alt="mobilnahiska.si"
                width={2172}
                height={724}
                className="h-16 w-auto"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-brand-foreground/60">
              Marketplace za mobilne in modularne hiške v Sloveniji in regiji.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-semibold uppercase tracking-wide text-brand-foreground/50">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-foreground/70 transition-colors hover:text-brand-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 text-sm text-brand-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} mobilnahiska.si. Vse pravice pridržane.</p>
        </div>
      </div>
    </footer>
  );
}
