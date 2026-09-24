import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { CommentModerationRow } from "@/components/dashboard/CommentModerationRow";

export const metadata: Metadata = { title: "Komentarji | Admin | mobilnahiska.si" };

export default async function AdminKomentarjiPage() {
  const admin = createAdminClient();
  const { data: comments } = await admin
    .from("comments")
    .select("id, article_slug, content, status, user_id, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Komentarji</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Odobrite, skrijte ali izbrišite komentarje pod vodiči.</p>

      {!comments || comments.length === 0 ? (
        <p className="mt-6 rounded-[14px] border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Trenutno ni komentarjev.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {comments.map((comment) => {
            const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
            return (
              <CommentModerationRow
                key={comment.id}
                id={comment.id}
                articleSlug={comment.article_slug}
                author={profile?.full_name || "Uporabnik"}
                content={comment.content}
                status={comment.status}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
