import { Bath, Bed, Calendar, Maximize2, Ruler, Users } from "lucide-react";
import type { Listing } from "@/types/listing";

export function ListingSpecs({ listing }: { listing: Listing }) {
  const specs = [
    { icon: Maximize2, label: `${listing.area} m²` },
    { icon: Ruler, label: `${listing.length} × ${listing.width} m` },
    {
      icon: Bed,
      label: `${listing.bedrooms} ${listing.bedrooms === 1 ? "spalnica" : "spalnice"}`,
    },
    {
      icon: Bath,
      label: `${listing.bathrooms} ${listing.bathrooms === 1 ? "kopalnica" : "kopalnici"}`,
    },
    { icon: Users, label: `${listing.capacity} oseb` },
    { icon: Calendar, label: `${listing.year}` },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 rounded-[4px] border border-border p-4 sm:grid-cols-6">
      {specs.map((spec) => (
        <div key={spec.label} className="flex flex-col items-center gap-1.5 text-center">
          <spec.icon className="h-5 w-5 text-brand" />
          <span className="text-sm font-medium text-foreground">{spec.label}</span>
        </div>
      ))}
    </div>
  );
}
