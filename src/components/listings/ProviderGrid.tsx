import Link from "next/link";
import type { Provider } from "@/data/listings";
import { pluralizeSl } from "@/lib/format";

export function ProviderGrid({ providers }: { providers: Provider[] }) {
  if (providers.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <Link
          key={provider.slug}
          href={`/ponudniki/${provider.slug}`}
          className="group flex items-center gap-3 rounded-[6px] border border-border/60 p-4 transition-colors hover:border-border hover:bg-secondary/20"
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
    </div>
  );
}
