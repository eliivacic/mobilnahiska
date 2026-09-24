import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import type { Provider } from "@/data/listings";
import { pluralizeSl } from "@/lib/format";

const COLUMNS = 4;

export function ProviderGrid({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) return null;

  const remainder = providers.length % COLUMNS;
  const placeholderCount = remainder === 0 ? 0 : COLUMNS - remainder;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {providers.map((provider) => (
        <Link
          key={provider.slug}
          href={`/ponudniki/${provider.slug}`}
          className="group flex items-center gap-3 rounded-[14px] border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/40 text-lg font-semibold text-brand">
            {provider.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{provider.name}</p>
            <p className="truncate text-[13px] text-muted-foreground">
              {provider.country} &middot; {provider.activeListings}{" "}
              {pluralizeSl(provider.activeListings, ["oglas", "oglasa", "oglasi", "oglasov"])}
            </p>
          </div>
        </Link>
      ))}

      {Array.from({ length: placeholderCount }).map((_, index) => (
        <Link
          key={`placeholder-${index}`}
          href="/cene"
          className="group flex items-center gap-3 rounded-[14px] border border-dashed border-border/60 p-4 transition-colors hover:border-border hover:bg-secondary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-muted-foreground">
            <Plus className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-muted-foreground">Prostor za tvoje podjetje</p>
            <p className="flex items-center gap-1 truncate text-[13px] text-muted-foreground">
              Postanite ponudnik
              <ArrowRight className="h-3 w-3 shrink-0" />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
