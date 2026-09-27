import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { getPublishedArticles } from "@/lib/articles/public";
import { GuideCard } from "@/components/guides/GuideCard";

export const metadata: Metadata = {
  title: "Od parcele do hiške | mobilnahiska.si",
  description:
    "Praktični vodiči za izbiro zemljišča, nakup mobilne ali modularne hiške, pripravo terena in postavitev.",
};

export const dynamic = "force-dynamic";

export default async function VodiciPage() {
  const guides = await getPublishedArticles();

  return (
    <PageShell className="py-8">
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        Od parcele do hiške
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Praktični vodiči za izbiro zemljišča, nakup hiške, pripravo terena in postavitev.
      </p>

      {guides.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">Trenutno ni objavljenih vodičev.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
