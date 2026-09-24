import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import type { Seller } from "@/types/listing";
import { slugifySellerName } from "@/data/listings";

export function SellerCard({ seller }: { seller: Seller }) {
  const isProvider = seller.type === "Profesionalni prodajalec";
  const providerHref = isProvider ? `/ponudniki/${slugifySellerName(seller.name)}` : undefined;

  const content = (
    <>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-xl font-semibold text-brand">
        {seller.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <p className="truncate font-semibold text-foreground">{seller.name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {isProvider && <BadgeCheck className="h-3.5 w-3.5 text-brand" />}
          {seller.type}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {seller.location}, {seller.country}
        </p>
      </div>
    </>
  );

  if (providerHref) {
    return (
      <Link
        href={providerHref}
        className="flex items-start gap-3 rounded-[12px] border border-border p-4 transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex items-start gap-3 rounded-[12px] border border-border p-4">{content}</div>;
}
