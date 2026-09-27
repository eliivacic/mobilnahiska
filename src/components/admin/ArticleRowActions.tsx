"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { useState } from "react";
import { publishArticle, unpublishArticle, deleteArticle } from "@/lib/supabase/articles";

export function ArticleRowActions({
  articleId,
  status,
  slug,
}: {
  articleId: string;
  status: "draft" | "published";
  slug: string;
}) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/vodici/${articleId}/uredi`}>Uredi</Link>
      </Button>
      {status === "published" ? (
        <>
          <Button asChild variant="outline" size="sm">
            <Link href={`/vodici/${slug}`} target="_blank">
              Predogled
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await unpublishArticle(articleId);
                toast.success("Članek odstranjen iz objave.");
              })
            }
          >
            Odstrani iz objave
          </Button>
        </>
      ) : (
        <Button
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-brand-hover"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await publishArticle(articleId);
              toast.success("Članek objavljen.");
            })
          }
        >
          Objavi
        </Button>
      )}
      <Button variant="outline" size="sm" className="text-destructive" onClick={() => setConfirmDelete(true)}>
        Izbriši
      </Button>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Izbriši članek?"
        description="Članek in njegova povezava do komentarjev bosta trajno izbrisana. Tega ni mogoče razveljaviti."
        confirmLabel="Izbriši"
        destructive
        onConfirm={() =>
          startTransition(async () => {
            await deleteArticle(articleId);
            toast.success("Članek izbrisan.");
          })
        }
      />
    </div>
  );
}
