import * as Sentry from "@sentry/nextjs";

// Browser-side error monitoring. NEXT_PUBLIC_SENTRY_DSN is not a secret —
// Sentry's DSN is meant to be shipped to the client by design (it only
// allows submitting new events, nothing else). No-ops safely if unset.
if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0,
  });
}
