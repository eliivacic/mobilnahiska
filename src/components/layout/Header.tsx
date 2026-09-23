"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Mobilne hiške", href: "/oglasi?type=mobilna" },
  { label: "Modularne hiše", href: "/oglasi?type=modularna" },
  { label: "Rabljene", href: "/oglasi?condition=rabljena" },
  { label: "Ponudniki", href: "/ponudniki" },
  { label: "Vodiči", href: "/vodici" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative py-1 text-[15px] font-medium text-brand-foreground/70 transition-colors hover:text-brand-foreground"
    >
      {label}
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-brand-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-x-100" />
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

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
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-white.png"
            alt="mobilnahiska.si"
            width={2172}
            height={724}
            priority
            className="h-14 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <NavLink href="/prijava" label="Prijava" />
          <Button asChild className="gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
            <Link href="/oddaj-oglas">
              <Plus className="h-4 w-4" />
              Oddaj oglas
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="border-brand-foreground/25 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 md:hidden"
              aria-label="Odpri meni"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-brand-foreground/10 bg-brand text-brand-foreground">
            <SheetHeader>
              <SheetTitle className="sr-only">mobilnahiska.si</SheetTitle>
              <Image
                src="/logo-white.png"
                alt="mobilnahiska.si"
                width={2172}
                height={724}
                className="h-9 w-auto self-start"
              />
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
                <Link href="/prijava" className="py-2 text-sm font-medium text-brand-foreground/80">
                  Prijava
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild className="w-full gap-1.5 bg-brand-foreground text-brand hover:bg-secondary">
                  <Link href="/oddaj-oglas">
                    <Plus className="h-4 w-4" />
                    Oddaj oglas
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      </header>
    </>
  );
}
