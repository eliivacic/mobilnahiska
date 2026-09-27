import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types/article";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string[];
  cover_image_url: string | null;
  author: string;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  comments_enabled: boolean;
  published_at: string | null;
  created_at: string;
};

function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt,
    date: row.published_at ?? row.created_at,
    image: row.cover_image_url ?? "",
    content: row.content,
    author: row.author,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    status: row.status,
    commentsEnabled: row.comments_enabled,
  };
}

const SELECT =
  "id, slug, title, category, excerpt, content, cover_image_url, author, seo_title, seo_description, status, comments_enabled, published_at, created_at";

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .returns<ArticleRow[]>();

  return (data ?? []).map(toArticle);
}

export async function getLatestArticles(count = 3): Promise<Article[]> {
  return (await getPublishedArticles()).slice(0, count);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select(SELECT)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle<ArticleRow>();

  if (!data) return null;
  return toArticle(data);
}
