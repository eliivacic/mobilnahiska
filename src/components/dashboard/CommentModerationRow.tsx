"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { moderateComment, deleteComment } from "@/lib/supabase/admin-actions";

interface Props {
  id: string;
  articleSlug: string;
  author: string;
  content: string;
  status: "pending" | "approved" | "hidden";
}

export function CommentModerationRow({ id, articleSlug, author, content, status }: Props) {
  const [pending, startTransition] = useTransition();

  function handleModerate(nextStatus: "approved" | "hidden") {
    startTransition(async () => {
      try {
        await moderateComment(id, nextStatus);
        toast.success(nextStatus === "approved" ? "Komentar odobren." : "Komentar skrit.");
      } catch {
        toast.error("Napaka pri posodabljanju komentarja.");
      }
    });
  }

  async function handleDelete() {
    try {
      await deleteComment(id);
      toast.success("Komentar izbrisan.");
    } catch {
      toast.error("Napaka pri brisanju komentarja.");
    }
  }

  return (
    <div className="rounded-[14px] border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">
          {author} <span className="font-normal text-muted-foreground">na /vodici/{articleSlug}</span>
        </p>
        <span
          className={`rounded-[4px] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
            status === "approved"
              ? "bg-secondary text-primary"
              : status === "pending"
                ? "bg-accent text-primary"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {status}
        </span>
      </div>
      <p className="mt-2 text-sm text-foreground/90">{content}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {status !== "approved" && (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => handleModerate("approved")}
            className="bg-primary text-primary-foreground hover:bg-brand-hover"
          >
            Odobri
          </Button>
        )}
        {status !== "hidden" && (
          <Button size="sm" variant="outline" disabled={pending} onClick={() => handleModerate("hidden")}>
            Skrij
          </Button>
        )}
        <ConfirmDialog
          trigger={
            <Button size="sm" variant="outline" disabled={pending} className="text-destructive hover:text-destructive">
              Izbriši
            </Button>
          }
          title="Izbriši komentar?"
          description="Komentarja po izbrisu ni mogoče obnoviti. Avtor bo moral objaviti novega, če želi ponovno komentirati."
          confirmLabel="Izbriši"
          destructive
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
}
