import type { Metadata } from "next";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = { title: "Nov članek | Admin | mobilnahiska.si" };

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Nov članek</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Shranjen bo kot osnutek — za javno objavo ga po shranitvi potrdite s &quot;Objavi&quot;.
      </p>
      <div className="mt-6">
        <ArticleForm
          mode="create"
          defaults={{
            title: "",
            excerpt: "",
            content: "",
            category: "",
            coverImageUrl: "",
            author: "mobilnahiska.si",
            seoTitle: "",
            seoDescription: "",
            commentsEnabled: true,
          }}
        />
      </div>
    </div>
  );
}
