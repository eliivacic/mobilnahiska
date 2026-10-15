import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

// Every public-schema table, in a safe dependency order (parents before
// children) so a restore onto an empty schema never hits a dangling foreign
// key mid-file. Keep this in sync with supabase/migrations/ — add new tables
// here when a new migration adds one.
const TABLES = [
  "profiles",
  "plans",
  "promotion_addons",
  "portal_settings",
  "articles",
  "subscriptions",
  "listing_submissions",
  "favorites",
  "inquiries",
  "listing_reports",
  "comments",
  "payments",
  "payment_provider_events",
  "email_log",
  "admin_audit_log",
  "rate_limit_hits",
] as const;

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return "ARRAY[]::text[]";
    // Every array column in this schema (features, photo_urls, content) is
    // text[] — scalars inside are always strings for these columns.
    const inner = value.map((v) => `'${String(v).replace(/'/g, "''")}'`).join(", ");
    return `ARRAY[${inner}]`;
  }
  if (typeof value === "object") {
    const json = JSON.stringify(value).replace(/'/g, "''");
    return `'${json}'::jsonb`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildInsertStatements(table: string, rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return `-- ${table}: 0 rows\n`;
  const lines = [`-- ${table}: ${rows.length} row(s)`];
  for (const row of rows) {
    const cols = Object.keys(row);
    const colList = cols.map((c) => `"${c}"`).join(", ");
    const valList = cols.map((c) => sqlLiteral(row[c])).join(", ");
    lines.push(`INSERT INTO public."${table}" (${colList}) VALUES (${valList});`);
  }
  return lines.join("\n") + "\n";
}

// Builds a restorable logical backup (not a pg_dump) of every row in every
// public-schema table, as one big SQL file of plain INSERT statements. Used
// by the weekly backup cron (src/app/api/cron/backup-database/route.ts).
// Restore procedure is documented in the header this function writes into
// the file itself, so it travels with the backup wherever it ends up.
export async function buildDatabaseBackupSql(admin: SupabaseClient): Promise<string> {
  const generatedAt = new Date().toISOString();

  const parts: string[] = [];
  for (const table of TABLES) {
    const { data, error } = await admin.from(table).select("*");
    if (error) throw new Error(`Failed to export table "${table}": ${error.message}`);
    parts.push(buildInsertStatements(table, data ?? []));
  }

  const header = `-- mobilnahiska.si — automated weekly database backup
-- Generated: ${generatedAt}
-- Source: Supabase project (public schema), via the service-role client —
-- NOT a pg_dump. Covers every row in every application table at the time
-- of generation.
--
-- RESTORE PROCEDURE:
--   1. On a NEW, EMPTY Supabase project, apply in this exact order:
--        supabase/migrations/000_baseline_schema.sql
--        supabase/migrations/002_active_listing_limit_trigger.sql
--        supabase/migrations/003_listing_reports.sql
--        supabase/migrations/004_db_backups_bucket.sql
--      SKIP 001_seed_reference_data.sql — this backup already contains
--      that same data (plans, promotion_addons, portal_settings, articles)
--      and would conflict on primary/unique keys if 001 is applied too.
--   2. Recreate each real user in Supabase Auth first (auth.users rows),
--      preserving the same UUIDs — this backup only covers public-schema
--      tables; auth.users is managed separately by Supabase Auth.
--   3. Run this file.
--
-- Contains real user data (profiles, payments, etc.) — keep private.

begin;

`;
  const footer = "\ncommit;\n";

  return header + parts.join("\n") + footer;
}
