"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// /admin renders its own dedicated shell (AdminSidebar + AdminTopbar), so the
// public marketing header/footer must not wrap it.
export function ConditionalChrome({
  userEmail,
  isAdmin,
  children,
}: {
  userEmail?: string;
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <Header userEmail={userEmail} isAdmin={isAdmin} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
