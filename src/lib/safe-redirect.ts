// Validates a `returnTo` value before using it in a redirect, to prevent
// open-redirect attacks (e.g. `returnTo=https://evil.example` or
// `returnTo=//evil.example`). Only same-origin, path-relative values are
// allowed; anything else falls back to the given default.
export function safeRedirectPath(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.includes("\\")) return fallback;
  try {
    const url = new URL(value, "https://mobilnahiska.si");
    if (url.origin !== "https://mobilnahiska.si") return fallback;
    return `${url.pathname}${url.search}${url.hash}` || fallback;
  } catch {
    return fallback;
  }
}
