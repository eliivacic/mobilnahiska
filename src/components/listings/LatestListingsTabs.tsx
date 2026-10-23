"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Listing } from "@/types/listing";
import type { Land } from "@/types/land";
import { ListingCard } from "@/components/listings/ListingCard";
import { LandCard } from "@/components/listings/LandCard";
import { PlaceholderCard } from "@/components/listings/PlaceholderCard";

const TABS = [
  { value: "vse", label: "Vse" },
  { value: "mobilna", label: "Mobilne hiške" },
  { value: "modularna", label: "Modularne hiše" },
  { value: "zemljisce", label: "Zemljišča" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

// Every tab always shows this many cards, padding with PlaceholderCard when a
// category doesn't have enough listings yet — so the grid never jumps in
// size when switching tabs.
const CARD_COUNT = 8;

function sortByNewest<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => Number(b.id) - Number(a.id));
}

export function LatestListingsTabs({ listings, lands }: { listings: Listing[]; lands: Land[] }) {
  const [tab, setTab] = useState<TabValue>("vse");

  const items = useMemo(() => {
    if (tab === "zemljisce") {
      return sortByNewest(lands).slice(0, CARD_COUNT);
    }
    const pool = tab === "vse" ? listings : listings.filter((listing) => listing.type === tab);
    return sortByNewest(pool).slice(0, CARD_COUNT);
  }, [listings, lands, tab]);

  const placeholderCount = CARD_COUNT - items.length;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTab(option.value)}
            className={`whitespace-nowrap rounded-[8px] px-3.5 py-1.5 text-sm font-medium transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.97] ${
              tab === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground/70 hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-4 flex flex-col items-center rounded-[14px] border border-dashed border-border py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
            <Plus className="h-5 w-5 text-brand" />
          </div>
          <p className="mt-4 text-sm font-semibold text-foreground">
            V tej kategoriji še ni objavljenih oglasov.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Bodite prvi, ki objavi svoj oglas.</p>
          <Link
            href="/oddaj-oglas"
            className="mt-5 inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-hover"
          >
            Oddaj oglas
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {tab === "zemljisce"
            ? items.map((land) => <LandCard key={land.id} land={land as Land} />)
            : items.map((listing) => <ListingCard key={listing.id} listing={listing as Listing} />)}
          {Array.from({ length: placeholderCount }).map((_, index) => (
            <PlaceholderCard key={`placeholder-${index}`} />
          ))}
        </div>
      )}
    </div>
  );
}
