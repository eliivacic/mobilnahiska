import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface RateLimitParams {
  // Should already include the action name, e.g. `login:${ip}` or
  // `password_reset:${email}` — this module has no idea what it's limiting.
  key: string;
  limit: number;
  windowMinutes: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

// A DB-backed fixed-window rate limiter: every attempt (allowed or not)
// inserts a row, and the check counts rows for that key within the window.
// This runs server-side only (server actions, route handlers) — it is
// never something the client can bypass by skipping a client-side check,
// because there is no client-side check; every call site awaits this before
// doing the real work.
//
// Chosen over an in-memory counter because Vercel serverless functions don't
// share memory across invocations/regions — an in-memory limiter would reset
// on every cold start and not coordinate across instances. Postgres already
// exists in this stack, so no new infrastructure (e.g. Upstash Redis) is
// required to get a real, production-safe limit.
export async function checkRateLimit({ key, limit, windowMinutes }: RateLimitParams): Promise<RateLimitResult> {
  // Rate limiting protects against adversarial traffic on a deployed
  // instance — it has no purpose against a trusted developer's own `next
  // dev` (used by both local development and the e2e suite via
  // playwright.config.ts's webServer), where it only causes friction (e.g.
  // the e2e suite logging in as the same test account across many spec
  // files well within a real attacker's rate). `next build` — what Vercel
  // runs for both Preview and Production — always sets NODE_ENV=production,
  // so this stays fully active on every real deployment.
  if (process.env.NODE_ENV !== "production") {
    return { allowed: true, remaining: limit };
  }

  const admin = createAdminClient();
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();

  const { count } = await admin
    .from("rate_limit_hits")
    .select("id", { count: "exact", head: true })
    .eq("bucket_key", key)
    .gte("created_at", windowStart);

  const currentCount = count ?? 0;
  if (currentCount >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await admin.from("rate_limit_hits").insert({ bucket_key: key });

  // Opportunistic cleanup so the table doesn't grow unbounded — no separate
  // cron needed. ~1 in 200 calls sweeps rows older than a day.
  if (Math.random() < 0.005) {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await admin.from("rate_limit_hits").delete().lt("created_at", cutoff);
  }

  return { allowed: true, remaining: limit - currentCount - 1 };
}
