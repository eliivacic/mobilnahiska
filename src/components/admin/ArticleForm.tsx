"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createArticle, updateArticle, type ArticleFormState } from "@/lib/supabase/articles";

const initialState: ArticleFormState = {};

export interface ArticleFormDefaults {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  author: string;
  seoTitle: string;
  seoDescription: string;
  commentsEnabled: boolean;
}

export function ArticleForm({
  mode,
  articleId,
  defaults,
}: {
  mode: "create" | "edit";
  articleId?: string;
  defaults: ArticleFormDefaults;
}) {
  const action = mode === "create" ? createArticle : updateArticle.bind(null, articleId!);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-2xl space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Naslov</Label>
        <Input id="title" name="title" defaultValue={defaults.title} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Povzetek</Label>
        <textarea
          id="excerpt"
          name="excerpt"
          rows={2}
          defaultValue={defaults.excerpt}
          className="w-full rounded-[10px] border border-border bg-background p-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="content">Vsebina (ločite odstavke s prazno vrstico)</Label>
        <textarea
          id="content"
          name="content"
          rows={14}
          defaultValue={defaults.content}
          className="w-full rounded-[10px] border border-border bg-background p-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="category">Kategorija</Label>
          <Input id="category" name="category" defaultValue={defaults.category} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="author">Avtor</Label>
          <Input id="author" name="author" defaultValue={defaults.author} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="coverImageUrl">Naslovna fotografija (URL)</Label>
        <Input id="coverImageUrl" name="coverImageUrl" type="url" defaultValue={defaults.coverImageUrl} required />
      </div>
      <div className="border-t border-border pt-4">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-foreground/70">SEO</p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="seoTitle">SEO title (neobvezno)</Label>
        <Input id="seoTitle" name="seoTitle" defaultValue={defaults.seoTitle} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="seoDescription">SEO description (neobvezno)</Label>
        <Input id="seoDescription" name="seoDescription" defaultValue={defaults.seoDescription} />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" name="commentsEnabled" defaultChecked={defaults.commentsEnabled} className="h-4 w-4" />
        Omogoči komentarje
      </label>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="bg-primary text-primary-foreground hover:bg-brand-hover">
        {pending ? "Shranjevanje …" : mode === "create" ? "Ustvari osnutek" : "Shrani spremembe"}
      </Button>
    </form>
  );
}
