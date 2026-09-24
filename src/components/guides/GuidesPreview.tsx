import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLatestGuides } from "@/data/guides";
import { GuideCard } from "@/components/guides/GuideCard";
import { PageShell } from "@/components/layout/PageShell";

export function GuidesPreview() {
  const guides = getLatestGuides(3);

  return (
    <PageShell className="py-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-heading text-[26px] font-light tracking-[-0.01em] text-foreground">
            Od parcele do hiške
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            Praktični vodiči za izbiro zemljišča, nakup hiške, pripravo terena in postavitev.
          </p>
        </div>
        <Link
          href="/vodici"
          className="hidden items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground sm:flex"
        >
          Vsi vodiči
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((guide) => (
          <GuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </PageShell>
  );
}
