import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDate } from "@/lib/format";
import { isStripeConfigured } from "@/lib/payments/stripe-client";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import { ListingLifecycleActions } from "@/components/dashboard/ListingLifecycleActions";
import type { PromotionAddon } from "@/types/pricing";

export const metadata: Metadata = { title: "Moji oglasi | mobilnahiska.si" };
export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending_review: { label: "V pregledu", className: "bg-accent text-primary" },
  published: { label: "Objavljeno", className: "bg-secondary text-primary" },
  rejected: { label: "Zavrnjeno", className: "bg-destructive/10 text-destructive" },
  deactivated: { label: "Deaktivirano", className: "bg-muted text-muted-foreground" },
};

export default async function MojiOglasiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: submissions } = await supabase
    .from("listing_submissions")
    .select("id, title, price, location, status, created_at, photo_urls, is_top, top_until, is_featured_homepage, featured_until")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const { data: addons } = await supabase
    .from("promotion_addons")
    .select("*")
    .eq("is_active", true)
    .returns<PromotionAddon[]>();
  const topAddon = addons?.find((a) => a.id === "top-listing");
  const featureAddon = addons?.find((a) => a.id === "homepage-feature");
  const stripeReady = isStripeConfigured();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Moji oglasi</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Pregled oddanih oglasov in njihovega statusa pregleda.
          </p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-brand-hover">
          <Link href="/oddaj-oglas">Oddaj oglas</Link>
        </Button>
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
          <p className="text-sm font-semibold text-foreground">Trenutno še nimate oddanih oglasov.</p>
          <p className="text-sm text-muted-foreground">Oddajte svoj prvi oglas in spremljajte njegov status tukaj.</p>
          <Button asChild className="mt-3 bg-primary text-primary-foreground hover:bg-brand-hover">
            <Link href="/oddaj-oglas">Oddaj oglas</Link>
          </Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {submissions.map((submission) => {
            const status = STATUS_LABELS[submission.status] ?? STATUS_LABELS.pending_review;
            const isPublished = submission.status === "published";
            // is_top/is_featured_homepage are set once at payment time and
            // never flip back automatically — top_until/featured_until are
            // the real source of truth for whether the promotion is still
            // active, so the badge and the "buy again" button both need to
            // check the date, not just the boolean.
            const topActive = submission.is_top && (!submission.top_until || new Date(submission.top_until) > new Date());
            const featuredActive =
              submission.is_featured_homepage && (!submission.featured_until || new Date(submission.featured_until) > new Date());
            return (
              <li
                key={submission.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-card p-4"
              >
                <div>
                  <p className="font-semibold text-foreground">{submission.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.location} &middot; {formatPrice(submission.price)} &middot; oddano{" "}
                    {formatDate(submission.created_at)}
                  </p>
                  {isPublished && (topActive || featuredActive) && (
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {topActive && "TOP oglas"}
                      {topActive && featuredActive && " · "}
                      {featuredActive && "Izpostavljeno na naslovnici"}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {submission.status !== "deactivated" && (
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/moj-racun/oglasi/${submission.id}/uredi`}>Uredi</Link>
                    </Button>
                  )}
                  <ListingLifecycleActions submissionId={submission.id} status={submission.status} />
                  {isPublished && !topActive && topAddon && (
                    <CheckoutButton
                      input={{ productType: "top_addon", productId: topAddon.id, relatedEntityId: submission.id }}
                      label={topAddon.cta_label ?? "Kupi TOP oglas"}
                      configured={stripeReady && Boolean(topAddon.stripe_price_id)}
                    />
                  )}
                  {isPublished && !featuredActive && featureAddon && (
                    <CheckoutButton
                      input={{ productType: "homepage_addon", productId: featureAddon.id, relatedEntityId: submission.id }}
                      label={featureAddon.cta_label ?? "Izpostavi na naslovnici"}
                      configured={stripeReady && Boolean(featureAddon.stripe_price_id)}
                    />
                  )}
                  <span className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold ${status.className}`}>
                    {status.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
