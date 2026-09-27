"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/slug";

export interface ArticleFormState {
  error?: string;
}

function parseContent(raw: string): string[] {
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function readArticleFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const contentRaw = String(formData.get("content") ?? "");
  const category = String(formData.get("category") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim() || "mobilnahiska.si";
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const seoDescription = String(formData.get("seoDescription") ?? "").trim();
  const commentsEnabled = formData.get("commentsEnabled") === "on";

  return { title, excerpt, contentRaw, category, coverImageUrl, author, seoTitle, seoDescription, commentsEnabled };
}

export async function createArticle(_prevState: ArticleFormState, formData: FormData): Promise<ArticleFormState> {
  await requireAdmin();
  const { title, excerpt, contentRaw, category, coverImageUrl, author, seoTitle, seoDescription, commentsEnabled } =
    readArticleFields(formData);

  if (title.length < 5) return { error: "Naslov mora imeti vsaj 5 znakov." };
  if (excerpt.length < 10) return { error: "Povzetek mora imeti vsaj 10 znakov." };
  if (!category) return { error: "Vnesite kategorijo." };
  if (!coverImageUrl) return { error: "Vnesite naslovno fotografijo (URL)." };
  const content = parseContent(contentRaw);
  if (content.length === 0) return { error: "Vnesite vsebino članka." };

  const admin = createAdminClient();
  const baseSlug = slugify(title);
  const { data: existing } = await admin.from("articles").select("slug").ilike("slug", `${baseSlug}%`);
  const slug = existing && existing.length > 0 ? `${baseSlug}-${existing.length + 1}` : baseSlug;

  const { data: inserted, error } = await admin
    .from("articles")
    .insert({
      slug,
      title,
      excerpt,
      content,
      category,
      cover_image_url: coverImageUrl,
      author,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      comments_enabled: commentsEnabled,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !inserted) return { error: "Članka ni bilo mogoče shraniti." };

  revalidatePath("/admin/vodici");
  redirect(`/admin/vodici/${inserted.id}/uredi`);
}

export async function updateArticle(
  articleId: string,
  _prevState: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  await requireAdmin();
  const { title, excerpt, contentRaw, category, coverImageUrl, author, seoTitle, seoDescription, commentsEnabled } =
    readArticleFields(formData);

  if (title.length < 5) return { error: "Naslov mora imeti vsaj 5 znakov." };
  if (excerpt.length < 10) return { error: "Povzetek mora imeti vsaj 10 znakov." };
  if (!category) return { error: "Vnesite kategorijo." };
  if (!coverImageUrl) return { error: "Vnesite naslovno fotografijo (URL)." };
  const content = parseContent(contentRaw);
  if (content.length === 0) return { error: "Vnesite vsebino članka." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("articles")
    .update({
      title,
      excerpt,
      content,
      category,
      cover_image_url: coverImageUrl,
      author,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
      comments_enabled: commentsEnabled,
    })
    .eq("id", articleId);

  if (error) return { error: "Sprememb ni bilo mogoče shraniti." };

  revalidatePath("/admin/vodici");
  revalidatePath(`/admin/vodici/${articleId}/uredi`);
  return {};
}

export async function publishArticle(articleId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: article } = await admin.from("articles").select("published_at").eq("id", articleId).single();

  // Re-publishing after an unpublish keeps the original published_at (first
  // publish date) rather than bumping it, matching how most CMSes treat a
  // re-publish.
  await admin
    .from("articles")
    .update({ status: "published", published_at: article?.published_at ?? new Date().toISOString() })
    .eq("id", articleId);

  revalidatePath("/admin/vodici");
  revalidatePath("/vodici");
}

export async function unpublishArticle(articleId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("articles").update({ status: "draft" }).eq("id", articleId);
  revalidatePath("/admin/vodici");
  revalidatePath("/vodici");
}

export async function deleteArticle(articleId: string) {
  await requireAdmin();
  const admin = createAdminClient();
  await admin.from("articles").delete().eq("id", articleId);
  revalidatePath("/admin/vodici");
  revalidatePath("/vodici");
}
