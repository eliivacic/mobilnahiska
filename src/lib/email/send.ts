import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SendTransactionalEmailParams {
  to: string;
  subject: string;
  html: string;
  emailType: string;
  // Unique per logical event (e.g. `welcome:${userId}`,
  // `listing_expiring:${submissionId}`) — enforced unique in email_log, so
  // sending the same transactional email twice is a no-op, not a duplicate.
  dedupKey: string;
  userId?: string | null;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface SendTransactionalEmailResult {
  sent: boolean;
  reason?: "not_configured" | "provider_error" | "network_error" | "duplicate";
}

let settingsCache: { senderName: string; senderAddress: string; replyTo: string } | null = null;

async function getSenderSettings() {
  if (settingsCache) return settingsCache;
  const admin = createAdminClient();
  const { data } = await admin
    .from("portal_settings")
    .select("key, value")
    .in("key", ["email_sender_name", "email_sender_address", "email_reply_to"]);

  const map = Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? ""]));
  settingsCache = {
    senderName: map.email_sender_name || "mobilnahiska.si",
    senderAddress: map.email_sender_address || "obvestila@mobilnahiska.si",
    replyTo: map.email_reply_to || "info@mobilnahiska.si",
  };
  return settingsCache;
}

// Sends a branded transactional email, but only once per dedupKey — the
// insert into email_log has a unique constraint on dedup_key, so a second
// call with the same key is rejected by the database before anything is
// sent, race-safe against concurrent calls (e.g. two overlapping cron runs).
export async function sendTransactionalEmail(
  params: SendTransactionalEmailParams
): Promise<SendTransactionalEmailResult> {
  const admin = createAdminClient();

  const apiKey = process.env.RESEND_API_KEY;
  const { senderName, senderAddress, replyTo } = await getSenderSettings();

  if (!apiKey) {
    // Still log the attempt (status skipped_no_provider) so admins can see,
    // in /admin/nastavitve, exactly what would have been sent once a
    // provider is connected — without ever pretending it was delivered.
    const { error: logError } = await admin.from("email_log").insert({
      email_type: params.emailType,
      recipient_email: params.to,
      dedup_key: params.dedupKey,
      user_id: params.userId ?? null,
      related_entity_type: params.relatedEntityType ?? null,
      related_entity_id: params.relatedEntityId ?? null,
      status: "skipped_no_provider",
    });
    if (logError?.code === "23505") return { sent: false, reason: "duplicate" };
    console.warn(`[email] RESEND_API_KEY not configured — skipped "${params.emailType}" to ${params.to}.`);
    return { sent: false, reason: "not_configured" };
  }

  // Reserve the dedup key before actually sending — if this fails on the
  // unique constraint, someone already sent (or is sending) this exact
  // email, so we stop here rather than sending a duplicate.
  const { error: reserveError } = await admin.from("email_log").insert({
    email_type: params.emailType,
    recipient_email: params.to,
    dedup_key: params.dedupKey,
    user_id: params.userId ?? null,
    related_entity_type: params.relatedEntityType ?? null,
    related_entity_id: params.relatedEntityId ?? null,
    status: "sent",
  });

  if (reserveError) {
    if (reserveError.code === "23505") return { sent: false, reason: "duplicate" };
    console.error("[email] Failed to reserve dedup key", reserveError);
    return { sent: false, reason: "network_error" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${senderName} <${senderAddress}>`,
        reply_to: replyTo,
        to: params.to,
        subject: params.subject,
        html: params.html,
      }),
    });

    if (!response.ok) {
      console.error("[email] Resend request failed", response.status, await response.text());
      await admin.from("email_log").update({ status: "failed" }).eq("dedup_key", params.dedupKey);
      return { sent: false, reason: "provider_error" };
    }

    return { sent: true };
  } catch (error) {
    console.error("[email] Failed to send email", error);
    await admin.from("email_log").update({ status: "failed" }).eq("dedup_key", params.dedupKey);
    return { sent: false, reason: "network_error" };
  }
}

export const NOTIFICATION_TOGGLE_KEYS = [
  "email_notify_welcome",
  "email_notify_listing_status",
  "email_notify_inquiry",
  "email_notify_expiry",
  "email_notify_admin",
] as const;

export type NotificationToggleKey = (typeof NOTIFICATION_TOGGLE_KEYS)[number];

export async function isNotificationEnabled(key: NotificationToggleKey): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin.from("portal_settings").select("value").eq("key", key).single();
  // Default to enabled if the setting row is somehow missing — an admin
  // explicitly turns notifications off, absence shouldn't silently do that.
  return data?.value !== "false";
}
