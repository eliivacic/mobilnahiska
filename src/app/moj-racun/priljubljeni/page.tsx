import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getListingBySlug } from "@/data/listings";
import { getLandBySlug } from "@/data/land";
import { ListingCard } from "@/components/listings/ListingCard";
import { LandCard } from "@/components/listings/LandCard";
import type { Listing } from "@/types/listing";
import type { Land } from "@/types/land";

export const metadata: Metadata = { title: "Priljubljeni | mobilnahiska.si" };

export default async function PriljubljeniPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: favorites } = await supabase
    .from("favorites")
    .select("kind, item_slug")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const favoriteListings: Listing[] = [];
  const favoriteLands: Land[] = [];

  for (const favorite of favorites ?? []) {
    if (favorite.kind === "listing") {
      const listing = getListingBySlug(favorite.item_slug);
      if (listing) favoriteListings.push(listing);
    } else {
      const land = getLandBySlug(favorite.item_slug);
      if (land) favoriteLands.push(land);
    }
  }

  const isEmpty = favoriteListings.length === 0 && favoriteLands.length === 0;

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Priljubljeni</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Oglasi in zemljišča, ki ste jih shranili.</p>

      {isEmpty ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground">Še nimate shranjenih oglasov.</p>
          <p className="text-sm text-muted-foreground">
            Kliknite ikono srca na kateremkoli oglasu ali zemljišču, da ga shranite sem.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {favoriteListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
          {favoriteLands.map((land) => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      )}
    </div>
  );
}
