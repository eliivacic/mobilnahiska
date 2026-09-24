// The one horizontal-width wrapper every route uses. Its left/right edges
// are always max-w-7xl + px-4 sm:px-6 lg:px-8 — the same pattern as the
// header — so page content always lines up with the logo and the
// "Oddaj oglas" button, on every page, without exception.
//
// Rule: every new page's outermost element is <PageShell>, never a
// hand-typed "mx-auto max-w-7xl px-4 ... sm:px-6 lg:px-8" div. Vertical
// spacing (py-*, pt-*, pb-*) varies by page, so pass it via `className` —
// but never touch the horizontal classes baked in here.
//
// If a page needs a narrower reading column for body text, apply
// max-w-* (no mx-auto) to that inner text block only — never to anything
// that contains the page's own heading, or the heading re-indents away
// from this shared edge.
export function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}
