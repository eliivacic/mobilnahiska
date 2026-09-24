"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { signOut } from "@/lib/supabase/actions";
import { ADMIN_NAV_GROUPS } from "@/components/admin/admin-nav";

export function AdminMobileNav({ adminName, adminEmail }: { adminName: string; adminEmail: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen(true)}
        className="shrink-0 lg:hidden"
        aria-label="Odpri meni"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <SheetContent side="left" className="flex w-3/4 flex-col p-0">
        <SheetHeader className="border-b border-border">
          <SheetTitle asChild>
            <Link href="/" className="flex items-center">
              <Logo variant="onLight" className="h-8" />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded-[8px] px-2.5 py-2 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/75 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 px-2.5">
            <p className="truncate text-sm font-semibold text-foreground">{adminName}</p>
            <p className="truncate text-xs text-muted-foreground">{adminEmail}</p>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="w-full gap-2">
              <LogOut className="h-4 w-4" />
              Odjava
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
