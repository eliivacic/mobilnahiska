"use server";

import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminSearchResult {
  type: "user" | "comment";
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

// Searches only what actually exists in the database today (users,
// comments). Listings/providers aren't DB-backed yet, so they can't be
// searched here honestly — see ŠE NI IMPLEMENTIRANO in the admin summary.
export async function adminGlobalSearch(query: string): Promise<AdminSearchResult[]> {
  await requireAdmin();
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const admin = createAdminClient();

  const [usersRes, commentsRes] = await Promise.all([
    admin
      .from("profiles")
      .select("id, full_name, company_name")
      .or(`full_name.ilike.%${trimmed}%,company_name.ilike.%${trimmed}%`)
      .limit(5),
    admin.from("comments").select("id, content, article_slug").ilike("content", `%${trimmed}%`).limit(5),
  ]);

  const results: AdminSearchResult[] = [];

  for (const user of usersRes.data ?? []) {
    results.push({
      type: "user",
      id: user.id,
      title: user.full_name || "Uporabnik brez imena",
      subtitle: user.company_name || "Uporabnik",
      href: `/admin/uporabniki/${user.id}`,
    });
  }

  for (const comment of commentsRes.data ?? []) {
    results.push({
      type: "comment",
      id: comment.id,
      title: comment.content.slice(0, 60),
      subtitle: `Komentar na /vodici/${comment.article_slug}`,
      href: `/admin/komentarji`,
    });
  }

  return results;
}
