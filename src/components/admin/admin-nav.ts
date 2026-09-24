export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  { title: "Pregled", items: [{ label: "Nadzorna plošča", href: "/admin" }] },
  {
    title: "Marketplace",
    items: [
      { label: "Oglasi", href: "/admin/oglasi" },
      { label: "Zemljišča", href: "/admin/zemljisca" },
      { label: "Ponudniki", href: "/admin/ponudniki" },
      { label: "Povpraševanja", href: "/admin/povprasevanja" },
    ],
  },
  { title: "Uporabniki", items: [{ label: "Uporabniki", href: "/admin/uporabniki" }] },
  {
    title: "Monetizacija",
    items: [
      { label: "Plačila", href: "/admin/placila" },
      { label: "Paketi", href: "/admin/paketi" },
      { label: "Promocije", href: "/admin/promocije" },
    ],
  },
  {
    title: "Vsebine",
    items: [
      { label: "Vodiči", href: "/admin/vodici" },
      { label: "Komentarji", href: "/admin/komentarji" },
    ],
  },
  { title: "Analitika", items: [{ label: "Statistika", href: "/admin/statistika" }] },
  { title: "Sistem", items: [{ label: "Nastavitve", href: "/admin/nastavitve" }] },
];
