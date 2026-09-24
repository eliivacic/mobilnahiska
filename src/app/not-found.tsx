import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Stran ni najdena | mobilnahiska.si",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <span className="font-heading text-7xl font-light tracking-[-0.01em] text-brand sm:text-8xl">
        404
      </span>
      <h1 className="mt-4 font-heading text-2xl font-light tracking-[-0.01em] text-foreground sm:text-3xl">
        Stran ni najdena
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Stran, ki jo iščete, ne obstaja ali je bila premaknjena.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="bg-brand text-brand-foreground hover:bg-brand-hover">
          <Link href="/oglasi">Nazaj na oglase</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Domov</Link>
        </Button>
      </div>
    </div>
  );
}
