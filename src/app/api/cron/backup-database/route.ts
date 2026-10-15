import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildDatabaseBackupSql } from "@/lib/backup/export-database";
import { sendTransactionalEmail, isNotificationEnabled } from "@/lib/email/send";

export const dynamic = "force-dynamic";

const BUCKET = "db-backups";
// Weekly cron (see vercel.json) — keep roughly a quarter's worth so a slow-
// to-notice problem still has a recoverable point, without the bucket
// growing unbounded.
const RETENTION_COUNT = 12;

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = `mobilnahiska-backup-${timestamp}.sql`;

  try {
    const sql = await buildDatabaseBackupSql(admin);

    const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, sql, {
      contentType: "application/sql",
      upsert: false,
    });
    if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

    // Prune old backups beyond RETENTION_COUNT, oldest first.
    const { data: existing } = await admin.storage.from(BUCKET).list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "asc" },
    });
    const toDelete = (existing ?? []).slice(0, Math.max(0, (existing?.length ?? 0) - RETENTION_COUNT));
    if (toDelete.length > 0) {
      await admin.storage.from(BUCKET).remove(toDelete.map((f) => f.name));
    }

    if (await isNotificationEnabled("email_notify_admin")) {
      const { data: setting } = await admin
        .from("portal_settings")
        .select("value")
        .eq("key", "contact_email")
        .single();
      if (setting?.value) {
        await sendTransactionalEmail({
          to: setting.value,
          subject: "Tedenski backup baze uspešno izveden | mobilnahiska.si",
          html: `<p>Tedenski backup podatkovne baze je bil uspešno izveden in shranjen.</p><p>Datoteka: <code>${path}</code><br/>Velikost: ${(sql.length / 1024).toFixed(1)} KB</p><p>Najdeš jo v Supabase Dashboard → Storage → ${BUCKET}.</p>`,
          emailType: "db_backup_success",
          dedupKey: `db_backup:${path}`,
        });
      }
    }

    return NextResponse.json({ ok: true, path, sizeBytes: sql.length, pruned: toDelete.length });
  } catch (error) {
    console.error("[cron/backup-database] Failed", error);

    if (await isNotificationEnabled("email_notify_admin")) {
      const { data: setting } = await admin
        .from("portal_settings")
        .select("value")
        .eq("key", "contact_email")
        .single();
      if (setting?.value) {
        await sendTransactionalEmail({
          to: setting.value,
          subject: "POZOR: tedenski backup baze NI uspel | mobilnahiska.si",
          html: `<p>Avtomatski backup podatkovne baze ta teden ni uspel.</p><p>Napaka: ${
            error instanceof Error ? error.message : String(error)
          }</p><p>Preveri Vercel function loge za podrobnosti.</p>`,
          emailType: "db_backup_failed",
          dedupKey: `db_backup_failed:${timestamp}`,
        });
      }
    }

    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}
