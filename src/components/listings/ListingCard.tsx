"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Truck } from "lucide-react";
import type { Listing } from "@/types/listing";
import { formatPrice } from "@/lib/format";

export function ListingCard({ listing }: { listing: Listing }) {
  const [favorite, setFavorite] = useState(false);
  const badgeLabel = listing.featured
    ? "Izpostavljeno"
    : listing.condition === "nova"
      ? "Nova"
      : "Rabljena";

  return (
    <Link
      href={`/oglasi/${listing.slug}`}
      className="group block overflow-hidden rounded-[6px] border border-border/40 bg-card transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-border"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={listing.images[0]}
          alt={listing.title}
          fill
          sizes="(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 90vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
        />

        <div className="absolute left-2.5 top-2.5">
          <span
            className={`rounded-[4px] px-2 py-1 text-[11px] font-semibold tracking-wide ${
              listing.featured
                ? "bg-brand text-brand-foreground"
                : "bg-background/95 text-foreground"
            }`}
          >
            {badgeLabel.toUpperCase()}
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            setFavorite((value) => !value);
          }}
          aria-label={favorite ? "Odstrani iz priljubljenih" : "Dodaj med priljubljene"}
          aria-pressed={favorite}
          className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-110 hover:bg-background active:scale-95"
        >
          <Heart className={favorite ? "h-4 w-4 fill-brand text-brand" : "h-4 w-4"} />
        </button>
      </div>

      <div className="space-y-1 p-3.5">
        <h3 className="truncate text-[15px] font-semibold text-foreground">{listing.title}</h3>
        <p className="truncate text-[13px] text-muted-foreground">{listing.manufacturer}</p>
        <p className="truncate text-[13px] text-muted-foreground">
          {listing.area} m² &middot; {listing.bedrooms}{" "}
          {listing.bedrooms === 1 ? "spalnica" : "spalnice"} &middot; {listing.year}
        </p>
        <p className="truncate text-[13px] text-muted-foreground">
          {listing.location}, {listing.country}
        </p>

        <div className="flex flex-col gap-1 pt-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
          <span className="font-heading text-[18px] font-light tracking-[-0.01em] text-foreground sm:text-[22px]">
            {formatPrice(listing.price)}
          </span>
          {listing.deliveryAvailable && (
            <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[12px] font-medium text-muted-foreground">
              <Truck className="h-3.5 w-3.5 shrink-0" />
              Dostava možna
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
