"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { submitComment, type CommentActionState } from "@/lib/supabase/comments";

const initialState: CommentActionState = {};

export function CommentForm({ articleSlug }: { articleSlug: string }) {
  const [state, formAction, pending] = useActionState(submitComment, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="articleSlug" value={articleSlug} />
      <textarea
        name="content"
        rows={3}
        required
        placeholder="Napišite komentar…"
        className="w-full rounded-[12px] border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
      />
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-primary">Komentar je oddan in čaka na odobritev.</p>
      )}
      <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Pošiljanje …" : "Objavi komentar"}
      </Button>
    </form>
  );
}
