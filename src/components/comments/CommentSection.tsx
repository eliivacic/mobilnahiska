import { createClient } from "@/lib/supabase/server";
import { getApprovedComments } from "@/lib/supabase/comments";
import { CommentForm } from "@/components/comments/CommentForm";
import { formatDate } from "@/lib/format";

export async function CommentSection({ articleSlug }: { articleSlug: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const comments = await getApprovedComments(articleSlug);

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-heading text-[21px] font-light tracking-[-0.01em] text-foreground">
        Komentarji {comments.length > 0 && `(${comments.length})`}
      </h2>

      <div className="mt-4">
        {user ? (
          <CommentForm articleSlug={articleSlug} />
        ) : (
          <p className="rounded-[12px] border border-dashed border-border p-4 text-sm text-muted-foreground">
            <a
              href={`/prijava?returnTo=${encodeURIComponent(`/vodici/${articleSlug}`)}`}
              className="font-semibold text-primary hover:underline"
            >
              Prijavite se
            </a>
            , da lahko komentirate.
          </p>
        )}
      </div>

      {comments.length > 0 && (
        <ul className="mt-6 space-y-5">
          {comments.map((comment) => (
            <li key={comment.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">{comment.author}</p>
                <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
