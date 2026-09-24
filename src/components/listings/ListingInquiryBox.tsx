"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SellerCard } from "@/components/listings/SellerCard";
import type { Listing } from "@/types/listing";
import { formatPrice } from "@/lib/format";

export function ListingInquiryBox({ listing }: { listing: Listing }) {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="rounded-[14px] border border-border bg-card p-5 shadow-lift">
      <span className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground">
        {formatPrice(listing.price)}
      </span>

      <div className="mt-4 space-y-2">
        <Button className="w-full bg-brand text-brand-foreground hover:bg-brand-hover">
          Pošlji povpraševanje
        </Button>
        <Button variant="outline" className="w-full gap-2" onClick={() => setShowPhone(true)}>
          <Phone className="h-4 w-4" />
          {showPhone ? listing.seller.phone : "Prikaži telefon"}
        </Button>
      </div>

      <div className="mt-5">
        <SellerCard seller={listing.seller} />
      </div>
    </div>
  );
}
