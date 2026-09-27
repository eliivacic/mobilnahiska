// Shared slugify — used for listing slugs (from title), provider slugs (from
// company name), and anywhere else a human-readable string needs to become a
// URL segment. Keep this the single implementation; don't re-derive it.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Appends a short suffix derived from an id so two listings with the same
// title never collide — generated once at insert time and never changed
// afterwards (stable URLs matter for SEO and sharing).
export function slugifyWithSuffix(value: string, id: string): string {
  return `${slugify(value)}-${id.slice(0, 8)}`;
}
