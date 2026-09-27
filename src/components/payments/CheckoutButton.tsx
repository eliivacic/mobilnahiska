"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createCheckoutSession, type CreateCheckoutInput } from "@/lib/payments/checkout";
import { trackEvent } from "@/lib/analytics";

const REASON_MESSAGES: Record<string, string> = {
  not_authenticated: "Za nakup se morate najprej prijaviti.",
  not_configured: "Plačilni sistem še ni aktiviran.",
  unknown_product: "Produkta ni bilo mogoče najti.",
  missing_price_mapping: "Plačilni sistem še ni aktiviran.",
  stripe_error: "Prišlo je do napake pri povezavi s plačilnim ponudnikom. Poskusite znova.",
};

// Renders as a normal-looking button everywhere so the UI is ready the
// moment Stripe is connected — but every click still goes through
// createCheckoutSession, which itself refuses to proceed (with a clear
// Slovenian message, not a fake success) until STRIPE_SECRET_KEY and the
// product's stripe_price_id are actually set. Nothing here can simulate a
// paid state client-side.
export function CheckoutButton({
  input,
  label,
  className,
  // Computed server-side (isStripeConfigured() + the product's
  // stripe_price_id presence) and passed down — the button never guesses its
  // own active state on the client, and in production stays visibly
  // disabled with this exact message until the provider is really wired up.
  configured,
}: {
  input: CreateCheckoutInput;
  label: string;
  className?: string;
  configured: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (!configured) {
    return (
      <div className="flex flex-col gap-1">
        <Button disabled className={className}>
          {label}
        </Button>
        <p className="text-xs text-muted-foreground">Plačilni sistem še ni aktiviran.</p>
      </div>
    );
  }

  function handleClick() {
    startTransition(async () => {
      const result = await createCheckoutSession(input);
      if (result.ok) {
        trackEvent("checkout_started", { product_type: input.productType, product_id: input.productId });
        window.location.href = result.url;
        return;
      }
      toast.error(REASON_MESSAGES[result.reason] ?? "Nakupa trenutno ni mogoče izvesti.");
    });
  }

  return (
    <Button onClick={handleClick} disabled={pending} className={className}>
      {pending ? "Preusmerjanje …" : label}
    </Button>
  );
}
