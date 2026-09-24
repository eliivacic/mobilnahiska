import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

// Records who did what to which record, for the admin audit trail (see
// migration 003_admin_audit_settings.sql). Never pass passwords, tokens, or
// payment details as `before`/`after` — those fields are stored as-is.
export async function logAdminAction(params: {
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
}) {
  const admin = createAdminClient();
  await admin.from("admin_audit_log").insert({
    admin_id: params.adminId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    before: params.before ?? null,
    after: params.after ?? null,
  });
}
