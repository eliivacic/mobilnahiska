export type ArticleStatus = "draft" | "published";

// Mirrors the shape the UI already used for the static `Guide` type
// (src/data/guides.ts) field-for-field where possible, so GuideCard and the
// vodiči pages needed only an import change, not a rewrite.
export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  image: string;
  content: string[];
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
  status: ArticleStatus;
  commentsEnabled: boolean;
}
