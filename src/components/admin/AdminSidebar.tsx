"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { signOut } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV_GROUPS } from "@/components/admin/admin-nav";

export function AdminSidebar({
  adminName,
  adminEmail,
}: {
  adminName: string;
  adminEmail: string;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden shrink-0 border-r border-border bg-card lg:flex lg:flex-col ${
        collapsed ? "lg:w-[72px]" : "lg:w-[240px]"
      } transition-[width] duration-200`}
    >
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <Link href="/" className="flex items-center">
          <Logo variant="onLight" className="h-9" />
        </Link>
        {!collapsed && <span className="text-sm font-semibold text-foreground">Admin</span>}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-2.5 py-4">
        {ADMIN_NAV_GROUPS.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {group.title}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center rounded-[8px] px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/75 hover:bg-muted hover:text-foreground"
                    } ${collapsed ? "justify-center" : ""}`}
                  >
                    {collapsed ? item.label.charAt(0) : item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2.5">
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className="mb-2 flex w-full items-center justify-center gap-2 rounded-[8px] px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
        {!collapsed && (
          <div className="mb-2 px-2.5">
            <p className="truncate text-sm font-semibold text-foreground">{adminName}</p>
            <p className="truncate text-xs text-muted-foreground">{adminEmail}</p>
          </div>
        )}
        <form action={signOut}>
          <Button type="submit" variant="outline" className="w-full">
            {collapsed ? <LogOut className="h-4 w-4" /> : "Odjava"}
          </Button>
        </form>
      </div>
    </aside>
  );
}
