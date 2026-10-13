-- Adds the "Prijavi oglas" (report listing) feature referenced in the legal
-- terms (Splošni pogoji uporabe, 6. Moderiranje in prijava nezakonitih
-- vsebin) — previously only an email-based process, now backed by a real
-- table so admins have a reviewable queue instead of relying solely on inbox
-- triage.

create type public.listing_report_status as enum ('new', 'reviewed', 'dismissed');

create table public.listing_reports (
  id uuid default gen_random_uuid() not null,
  listing_submission_id uuid,
  listing_slug text not null,
  listing_title text not null,
  listing_url text not null,
  reporter_name text not null,
  reporter_email text not null,
  reason text not null,
  message text not null,
  status listing_report_status default 'new' not null,
  created_at timestamp with time zone default now() not null,
  reviewed_at timestamp with time zone,
  reviewed_by uuid,
  PRIMARY KEY (id)
);

alter table public.listing_reports
  add constraint listing_reports_listing_submission_id_fkey
  foreign key (listing_submission_id) references public.listing_submissions(id) on delete set null;

alter table public.listing_reports
  add constraint listing_reports_reviewed_by_fkey
  foreign key (reviewed_by) references auth.users(id) on delete set null;

create index listing_reports_created_at_idx on public.listing_reports using btree (created_at desc);
create index listing_reports_status_idx on public.listing_reports using btree (status);

alter table public.listing_reports enable row level security;

-- Anyone (including anonymous visitors) can file a report — same shape as
-- inquiries_insert_anyone. The server action actually inserts via the
-- service-role client (so it can read the new row's id back for the email
-- dedup key), but this policy keeps the table consistent/defensible if ever
-- queried with the anon/authenticated client directly.
create policy "listing_reports_insert_anyone" on public.listing_reports for insert to anon, authenticated
  with check (true);

create policy "listing_reports_select_admin" on public.listing_reports for select to authenticated
  using ((exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'::user_role)));

create policy "listing_reports_update_admin" on public.listing_reports for update to authenticated
  using ((exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'::user_role)));
