import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = { title: "Uredi članek | Admin | mobilnahiska.si" };

export default async function EditArticlePage(props: PageProps<"/admin/vodici/[id]/uredi">) {
  const { id } = await props.params;
  const admin = createAdminClient();
  const { data: article } = await admin
    .from("articles")
    .select("id, title, excerpt, content, category, cover_image_url, author, seo_title, seo_description, comments_enabled")
    .eq("id", id)
    .maybeSingle();

  if (!article) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Uredi članek</h1>
      <div className="mt-6">
        <ArticleForm
          mode="edit"
          articleId={article.id}
          defaults={{
            title: article.title,
            excerpt: article.excerpt,
            content: (article.content as string[]).join("\n\n"),
            category: article.category,
            coverImageUrl: article.cover_image_url ?? "",
            author: article.author,
            seoTitle: article.seo_title ?? "",
            seoDescription: article.seo_description ?? "",
            commentsEnabled: article.comments_enabled,
          }}
        />
      </div>
    </div>
  );
}
