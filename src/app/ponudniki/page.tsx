import type { Metadata } from "next";
import { getProviders } from "@/data/listings";
import { ProviderGrid } from "@/components/listings/ProviderGrid";

export const metadata: Metadata = { title: "Ponudniki | mobilnahiska.si" };

export default function PonudnikiPage() {
  const providers = getProviders();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        Ponudniki
      </h1>
      <p className="mt-1.5 text-sm font-medium text-muted-foreground">
        Profesionalni prodajalci mobilnih in modularnih hišk na mobilnahiska.si
      </p>
      <div className="mt-8">
        <ProviderGrid providers={providers} />
      </div>
    </div>
  );
}
