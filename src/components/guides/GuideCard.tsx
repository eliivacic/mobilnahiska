import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Guide } from "@/data/guides";
import { formatDate } from "@/lib/format";

export function GuideCard({ guide }: { guide: Guide }) {
  return (
    <Link
      href={`/vodici/${guide.slug}`}
      className="group flex flex-col overflow-hidden rounded-[14px] border border-border/40 bg-card transition-colors hover:border-border"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={guide.image}
          alt={guide.title}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
          {guide.category}
        </span>
        <h3 className="mt-1.5 line-clamp-2 text-[16px] font-semibold text-foreground">{guide.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {guide.excerpt}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="text-muted-foreground">{formatDate(guide.date)}</span>
          <span className="flex items-center gap-1 font-semibold text-primary">
            Preberi več
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
