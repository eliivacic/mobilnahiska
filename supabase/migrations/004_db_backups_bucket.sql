-- Private Storage bucket for the automated weekly database backup
-- (src/app/api/cron/backup-database/route.ts). Unlike listing-photos, this
-- bucket is NOT public — it holds a full logical export of every table,
-- including profiles, payments and audit logs. No RLS policy is created on
-- storage.objects for this bucket on purpose: with zero policies, only the
-- service-role client (used server-side by the cron route, and the
-- Supabase Dashboard's own elevated access) can read or write to it at all.
insert into storage.buckets (id, name, public, file_size_limit)
values ('db-backups', 'db-backups', false, 52428800)
on conflict (id) do nothing;
