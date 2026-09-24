import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export function PlaceholderCard() {
  return (
    <Link
      href="/oddaj-oglas"
      className="group flex flex-col overflow-hidden rounded-[14px] border border-dashed border-border/60 bg-transparent transition-colors hover:border-border hover:bg-secondary/10"
    >
      <div className="flex aspect-[4/3] w-full items-center justify-center bg-secondary/10">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/30 text-muted-foreground">
          <Plus className="h-5 w-5" />
        </div>
      </div>
      <div className="space-y-1 p-3.5 text-center">
        <p className="text-[15px] font-semibold text-muted-foreground">Ta oglas še ni objavljen</p>
        <p className="flex items-center justify-center gap-1 text-[13px] text-muted-foreground">
          Oddajte svoj oglas
          <ArrowRight className="h-3 w-3" />
        </p>
      </div>
    </Link>
  );
}
