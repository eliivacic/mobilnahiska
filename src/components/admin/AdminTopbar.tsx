"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, X } from "lucide-react";
import { adminGlobalSearch, type AdminSearchResult } from "@/lib/supabase/admin-search";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Nadzorna plošča",
  "/admin/oglasi": "Oglasi",
  "/admin/zemljisca": "Zemljišča",
  "/admin/ponudniki": "Ponudniki",
  "/admin/povprasevanja": "Povpraševanja",
  "/admin/uporabniki": "Uporabniki",
  "/admin/placila": "Plačila",
  "/admin/paketi": "Paketi in cene",
  "/admin/promocije": "Promocije",
  "/admin/vodici": "Vodiči",
  "/admin/komentarji": "Komentarji",
  "/admin/statistika": "Statistika",
  "/admin/nastavitve": "Nastavitve",
};

function pageTitleFor(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = "/" + pathname.split("/").slice(1, 3).join("/");
  return PAGE_TITLES[base] ?? "Admin";
}

export function AdminTopbar({
  adminName,
  adminEmail,
  pendingCommentsCount,
}: {
  adminName: string;
  adminEmail: string;
  pendingCommentsCount: number;
}) {
  const pathname = usePathname();
  const title = pageTitleFor(pathname);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AdminSearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const timeout = setTimeout(() => {
      startTransition(async () => {
        const res = await adminGlobalSearch(query);
        setResults(res);
        setOpen(true);
      });
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  function handleQueryChange(value: string) {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
    }
  }

  const initial = adminName.trim().charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card px-4 lg:px-6">
      <AdminMobileNav adminName={adminName} adminEmail={adminEmail} />

      <h1 className="hidden shrink-0 text-base font-semibold text-foreground lg:block">{title}</h1>

      <div ref={containerRef} className="relative ml-0 flex-1 lg:ml-4 lg:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => handleQueryChange(event.target.value)}
          onFocus={() => query.trim().length >= 2 && setOpen(true)}
          type="text"
          placeholder="Išči uporabnike, komentarje …"
          className="h-9 w-full rounded-[8px] border border-border bg-background pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {open && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1.5 max-h-96 overflow-y-auto rounded-[10px] border border-border bg-card shadow-lg">
            {isPending && <p className="p-3 text-sm text-muted-foreground">Iščem …</p>}
            {!isPending && results.length === 0 && query.trim().length >= 2 && (
              <p className="p-3 text-sm text-muted-foreground">Ni zadetkov za &ldquo;{query}&rdquo;.</p>
            )}
            {!isPending &&
              results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  href={result.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-muted"
                >
                  <p className="truncate text-sm font-medium text-foreground">{result.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{result.subtitle}</p>
                </Link>
              ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setNotifOpen((value) => !value)}
          className="relative flex h-9 w-9 items-center justify-center rounded-[8px] text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Obvestila"
        >
          <Bell className="h-[18px] w-[18px]" />
          {pendingCommentsCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {pendingCommentsCount > 9 ? "9+" : pendingCommentsCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 top-full z-40 mt-1.5 w-72 rounded-[10px] border border-border bg-card shadow-lg">
            <p className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Obvestila
            </p>
            {pendingCommentsCount > 0 ? (
              <Link
                href="/admin/komentarji"
                onClick={() => setNotifOpen(false)}
                className="block px-3 py-2.5 text-sm text-foreground hover:bg-muted"
              >
                {pendingCommentsCount} {pendingCommentsCount === 1 ? "komentar čaka" : "komentarjev čaka"} na
                odobritev
              </Link>
            ) : (
              <p className="px-3 py-3 text-sm text-muted-foreground">Ni novih obvestil.</p>
            )}
          </div>
        )}
      </div>

      <div className="hidden items-center gap-2 border-l border-border pl-3 lg:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initial}
        </div>
        <div className="max-w-[140px]">
          <p className="truncate text-sm font-medium text-foreground">{adminName}</p>
          <p className="truncate text-xs text-muted-foreground">{adminEmail}</p>
        </div>
      </div>
    </header>
  );
}
