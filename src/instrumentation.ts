import * as Sentry from "@sentry/nextjs";

// Server + edge runtime error monitoring. Reads SENTRY_DSN — if unset,
// Sentry.init() is a safe no-op (same "quietly inactive until configured"
// pattern already used for Stripe/Resend elsewhere in this codebase).
export async function register() {
  if (!process.env.SENTRY_DSN) return;

  if (process.env.NEXT_RUNTIME === "nodejs" || process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      // Error capture is independent of this — it only controls performance
      // trace volume, left at 0 to keep this strictly an error monitor and
      // avoid burning free-tier quota on data nobody asked for.
      tracesSampleRate: 0,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
