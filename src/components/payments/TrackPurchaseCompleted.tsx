"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

// Fires once per successful checkout-success page view. Placed on the
// success page (never the webhook, which is server-side and has no client
// gtag context) — ready for the real Stripe flow: the moment Stripe is
// connected and a redirect actually reaches this page with a paid payment,
// this event fires with no further code changes needed.
export function TrackPurchaseCompleted({
  productType,
  productId,
  amountCents,
}: {
  productType: string;
  productId: string;
  amountCents: number;
}) {
  useEffect(() => {
    trackEvent("purchase_completed", {
      product_type: productType,
      product_id: productId,
      value: amountCents / 100,
      currency: "EUR",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
