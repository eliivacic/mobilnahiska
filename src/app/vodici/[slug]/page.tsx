import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getGuideBySlug, guides } from "@/data/guides";
import { formatDate } from "@/lib/format";
import { CommentSection } from "@/components/comments/CommentSection";
import { PageShell } from "@/components/layout/PageShell";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: PageProps<"/vodici/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: `${guide.title} | mobilnahiska.si`,
    description: guide.excerpt,
  };
}

export default async function GuidePage(props: PageProps<"/vodici/[slug]">) {
  const { slug } = await props.params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <PageShell className="py-8">
      <article>
        <nav aria-label="Breadcrumbs" className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Domov
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/vodici" className="hover:text-foreground">
            Od parcele do hiške
          </Link>
        </nav>

        <div className="mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">
            {guide.category}
          </span>
          <h1 className="mt-2 text-balance font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{formatDate(guide.date)}</p>
        </div>

        <div className="mt-8 space-y-5">
          {guide.content.map((paragraph, index) => (
            <p key={index} className="text-[17px] leading-relaxed text-foreground/90">
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          <CommentSection articleSlug={guide.slug} />
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <Link href="/vodici" className="text-sm font-semibold text-primary hover:underline">
            ← Nazaj na vse vodiče
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
