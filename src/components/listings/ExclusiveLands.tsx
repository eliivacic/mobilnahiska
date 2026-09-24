import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Land } from "@/types/land";
import { LandCard } from "@/components/listings/LandCard";
import { PageShell } from "@/components/layout/PageShell";

export function ExclusiveLands({ lands }: { lands: Land[] }) {
  if (lands.length === 0) return null;

  return (
    <section className="bg-secondary/30">
      <PageShell className="py-12">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
              Ekskluzivna ponudba zemljišč
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Izbrana zazidljiva zemljišča za vaš naslednji projekt.
            </p>
          </div>
          <Link
            href="/zemljisca"
            className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
          >
            Vsa zemljišča
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lands.slice(0, 4).map((land) => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      </PageShell>
    </section>
  );
}
