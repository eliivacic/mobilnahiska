import type { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { ArticleRowActions } from "@/components/admin/ArticleRowActions";

export const metadata: Metadata = { title: "Vodiči | Admin | mobilnahiska.si" };

export default async function AdminVodiciPage() {
  const admin = createAdminClient();
  const { data: articles } = await admin
    .from("articles")
    .select("id, title, category, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">
            Vodiči — Od parcele do hiške
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Ustvarite, uredite in objavite članke.</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/admin/vodici/nov">Nov članek</Link>
        </Button>
      </div>

      {!articles || articles.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Še ni ustvarjenih člankov.</p>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-[14px] border border-border md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Naslov</th>
                  <th className="px-4 py-3">Kategorija</th>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dejanja</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-foreground">{article.title}</td>
                    <td className="px-4 py-3 text-muted-foreground">{article.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(article.published_at ?? article.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${
                          article.status === "published"
                            ? "bg-secondary text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {article.status === "published" ? "Objavljeno" : "Osnutek"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ArticleRowActions articleId={article.id} status={article.status} slug={article.slug} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {articles.map((article) => (
              <div key={article.id} className="rounded-[14px] border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-foreground">{article.title}</p>
                  <span
                    className={`shrink-0 rounded-[4px] px-2 py-0.5 text-[11px] font-semibold ${
                      article.status === "published" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {article.status === "published" ? "Objavljeno" : "Osnutek"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {article.category} &middot; {formatDate(article.published_at ?? article.created_at)}
                </p>
                <div className="mt-3">
                  <ArticleRowActions articleId={article.id} status={article.status} slug={article.slug} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
