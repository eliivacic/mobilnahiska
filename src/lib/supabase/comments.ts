"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CommentActionState {
  error?: string;
  success?: boolean;
}

export async function submitComment(
  _prevState: CommentActionState,
  formData: FormData
): Promise<CommentActionState> {
  const articleSlug = String(formData.get("articleSlug") ?? "");
  const content = String(formData.get("content") ?? "").trim();

  if (!articleSlug) return { error: "Manjka članek." };
  if (content.length < 2) return { error: "Komentar je prekratek." };
  if (content.length > 2000) return { error: "Komentar je predolg (največ 2000 znakov)." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Za komentiranje se morate prijaviti." };

  const { error } = await supabase.from("comments").insert({
    article_slug: articleSlug,
    user_id: user.id,
    content,
  });

  if (error) return { error: "Komentarja ni bilo mogoče oddati. Poskusite znova." };

  revalidatePath(`/vodici/${articleSlug}`);
  return { success: true };
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  created_at: string;
  author: string;
}

export async function getApprovedComments(articleSlug: string): Promise<CommentWithAuthor[]> {
  // Approved comments and their author's display name are intentionally
  // public once approved, but the author's own profile row is RLS-locked to
  // themselves — read with the admin client to join the display name safely.
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("comments")
    .select("id, content, created_at, profiles(full_name)")
    .eq("article_slug", articleSlug)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((row) => {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    return {
      id: row.id,
      content: row.content,
      created_at: row.created_at,
      author: profile?.full_name || "Uporabnik",
    };
  });
}
