"use client";

import { PhoneReveal } from "@/components/listings/PhoneReveal";
import { InquiryModal } from "@/components/listings/InquiryModal";
import { Button } from "@/components/ui/button";
import { SellerCard } from "@/components/listings/SellerCard";
import type { Listing } from "@/types/listing";
import { formatPrice } from "@/lib/format";

export function ListingInquiryBox({ listing }: { listing: Listing }) {
  return (
    <div className="rounded-[14px] border border-border bg-card p-5 shadow-lift">
      <span className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground">
        {formatPrice(listing.price)}
      </span>

      <div className="mt-4 space-y-2">
        <InquiryModal
          listingSlug={listing.slug}
          listingTitle={listing.title}
          sellerName={listing.seller.name}
          trigger={
            <Button className="w-full bg-brand text-brand-foreground hover:bg-brand-hover">
              Pošlji povpraševanje
            </Button>
          }
        />
        <PhoneReveal phone={listing.seller.phone} />
      </div>

      <div className="mt-5">
        <SellerCard seller={listing.seller} />
      </div>
    </div>
  );
}
