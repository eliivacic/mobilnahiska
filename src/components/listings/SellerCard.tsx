import { BadgeCheck, MapPin } from "lucide-react";
import type { Seller } from "@/types/listing";

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-border p-4">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-xl font-semibold text-brand">
        {seller.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{seller.name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {seller.type === "Profesionalni prodajalec" && (
            <BadgeCheck className="h-3.5 w-3.5 text-brand" />
          )}
          {seller.type}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {seller.location}, {seller.country}
        </p>
      </div>
    </div>
  );
}
