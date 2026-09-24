"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { submitComment, type CommentActionState } from "@/lib/supabase/comments";

const initialState: CommentActionState = {};

export function CommentForm({ articleSlug }: { articleSlug: string }) {
  const [state, formAction, pending] = useActionState(submitComment, initialState);
  // Controlled so a validation error doesn't wipe what the user typed —
  // React resets uncontrolled <form> inputs after every action call.
  const [content, setContent] = useState("");
  // Clear only once, right when a submission succeeds (adjusting state
  // during render instead of an effect — see react.dev's guidance on
  // adjusting state when a value changes).
  const [clearedForSuccess, setClearedForSuccess] = useState(state);
  if (state !== clearedForSuccess) {
    setClearedForSuccess(state);
    if (state.success) setContent("");
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="articleSlug" value={articleSlug} />
      <textarea
        name="content"
        rows={3}
        required
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Napišite komentar…"
        className="w-full rounded-[12px] border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none"
      />
      {state.error && <p role="alert" className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p role="status" className="text-sm text-primary">Komentar je oddan in čaka na odobritev.</p>
      )}
      <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Pošiljanje …" : "Objavi komentar"}
      </Button>
    </form>
  );
}
