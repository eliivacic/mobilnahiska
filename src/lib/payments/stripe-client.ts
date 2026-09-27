import "server-only";
import Stripe from "stripe";

let cachedClient: Stripe | null | undefined;

// Returns null (not a thrown error) when STRIPE_SECRET_KEY isn't set yet —
// every caller must handle the "not configured" case explicitly rather than
// crashing, since Stripe is intentionally left disconnected until the final
// go-live step (see AGENTS.md / HANDOVER_CHECKLIST.md).
export function getStripeClient(): Stripe | null {
  if (cachedClient !== undefined) return cachedClient;
  const apiKey = process.env.STRIPE_SECRET_KEY;
  cachedClient = apiKey ? new Stripe(apiKey) : null;
  return cachedClient;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
