"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { PageShell } from "@/components/layout/PageShell";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Mobilne hiške", href: "/oglasi?type=mobilna", match: "/oglasi" },
  { label: "Modularne hiše", href: "/oglasi?type=modularna", match: "/oglasi" },
  { label: "Zazidljiva zemljišča", href: "/zemljisca", match: "/zemljisca" },
  { label: "Vodiči", href: "/vodici", match: "/vodici" },
  { label: "Ponudniki", href: "/ponudniki", match: "/ponudniki" },
];

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`group relative py-1 text-[15px] font-medium transition-colors ${
        active ? "text-brand-foreground" : "text-brand-foreground/65 hover:text-brand-foreground"
      }`}
    >
      {label}
      <span
        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-brand-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />
    </Link>
  );
}

export function Header({ userEmail, isAdmin = false }: { userEmail?: string | null; isAdmin?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="absolute top-0 h-px w-full" aria-hidden="true" />
      <header
        className={`sticky top-0 z-40 border-b border-transparent bg-brand transition-shadow duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled ? "shadow-lift backdrop-blur-md" : ""
        }`}
      >
      <PageShell className="flex h-24 items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo variant="onLight" className="h-16 sm:h-20" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.match || pathname.startsWith(`${link.match}/`)}
            />
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          {isAdmin ? (
            <>
              <NavLink href="/moj-racun" label="Moj račun" active={pathname === "/moj-racun"} />
              <Button asChild className="gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" />
                  Admin nadzorna plošča
                </Link>
              </Button>
            </>
          ) : userEmail ? (
            <>
              <NavLink href="/moj-racun" label="Moj račun" active={pathname === "/moj-racun"} />
              <Button asChild className="gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
                <Link href="/oddaj-oglas">
                  <Plus className="h-4 w-4" />
                  Oddaj oglas
                </Link>
              </Button>
            </>
          ) : (
            <>
              <NavLink href="/prijava" label="Prijava" active={pathname === "/prijava"} />
              <Button asChild className="gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
                <Link href="/oddaj-oglas">
                  <Plus className="h-4 w-4" />
                  Oddaj oglas
                </Link>
              </Button>
            </>
          )}
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 border-brand-foreground/25 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 md:hidden"
              aria-label="Odpri meni"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-brand-foreground/10 bg-brand text-brand-foreground">
            <SheetHeader>
              <SheetTitle className="sr-only">mobilnahiska.si</SheetTitle>
              <Logo variant="onLight" className="h-14 self-start" />
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <SheetClose asChild key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-sm px-2 py-2.5 text-base font-medium text-brand-foreground hover:bg-brand-foreground/10"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="flex flex-col gap-2 border-t border-brand-foreground/15 px-4 pt-4">
              <SheetClose asChild>
                <Link
                  href={userEmail ? "/moj-racun" : "/prijava"}
                  className="py-2 text-sm font-medium text-brand-foreground/80"
                >
                  {userEmail ? "Moj račun" : "Prijava"}
                </Link>
              </SheetClose>
              <SheetClose asChild>
                {isAdmin ? (
                  <Button asChild className="w-full gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
                    <Link href="/admin">
                      <LayoutDashboard className="h-4 w-4" />
                      Admin nadzorna plošča
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
                    <Link href="/oddaj-oglas">
                      <Plus className="h-4 w-4" />
                      Oddaj oglas
                    </Link>
                  </Button>
                )}
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </PageShell>
      </header>
    </>
  );
}
