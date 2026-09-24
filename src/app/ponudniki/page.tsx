import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { getProviders } from "@/data/listings";
import { ProviderGrid } from "@/components/listings/ProviderGrid";

export const metadata: Metadata = { title: "Ponudniki | mobilnahiska.si" };

export default function PonudnikiPage() {
  const providers = getProviders();

  return (
    <PageShell className="py-8">
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        Preverjeni ponudniki
      </h1>
      <p className="mt-1.5 text-sm font-medium text-muted-foreground">
        Poiščite ponudnike mobilnih in modularnih hišk na enem mestu.
      </p>
      <div className="mt-8">
        <ProviderGrid providers={providers} />
      </div>
    </PageShell>
  );
}
