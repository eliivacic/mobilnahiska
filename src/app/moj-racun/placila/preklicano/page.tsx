import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Plačilo preklicano | mobilnahiska.si" };

export default function PlaciloPreklicanoPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[14px] border border-border bg-card p-8 text-center">
      <XCircle className="h-10 w-10 text-muted-foreground" />
      <h1 className="font-heading text-xl font-light tracking-[-0.01em] text-foreground">Plačilo preklicano</h1>
      <p className="text-sm text-muted-foreground">Naročilo ni bilo zaključeno. Poskusite lahko znova kadarkoli.</p>
      <Button asChild className="mt-2">
        <Link href="/cene">Nazaj na cenik</Link>
      </Button>
    </div>
  );
}
