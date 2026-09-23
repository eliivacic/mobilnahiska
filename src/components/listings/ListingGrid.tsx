import { SearchX } from "lucide-react";
import type { Listing } from "@/types/listing";
import { ListingCard } from "@/components/listings/ListingCard";
import { Button } from "@/components/ui/button";

export function ListingGrid({
  listings,
  dense = false,
  spacious = false,
  onResetFilters,
}: {
  listings: Listing[];
  dense?: boolean;
  spacious?: boolean;
  onResetFilters?: () => void;
}) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[6px] border border-dashed border-border py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
          <SearchX className="h-5 w-5 text-brand" />
        </div>
        <p className="mt-4 text-sm font-semibold text-foreground">
          Ni oglasov, ki bi ustrezali izbranim filtrom.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Poskusite spremeniti ali ponastaviti filtre.
        </p>
        {onResetFilters && (
          <Button variant="outline" className="mt-5" onClick={onResetFilters}>
            Ponastavi filtre
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        spacious
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          : `grid grid-cols-2 gap-4 md:grid-cols-3 ${dense ? "lg:grid-cols-4 xl:grid-cols-5" : "lg:grid-cols-4"}`
      }
    >
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
