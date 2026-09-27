-- Closes a real TOCTOU race in the application-level active-listing-limit
-- check added this session: two near-simultaneous submissions from the same
-- user could both read the same "count so far" before either insert
-- commits, both pass, and the limit gets exceeded by more than one.
--
-- pg_advisory_xact_lock serializes concurrent inserts for the SAME user_id
-- (released automatically at transaction end, no manual unlock needed) so
-- the count this trigger sees is always accurate relative to any other
-- submission from that same user racing it. The application-level check in
-- submitListingSubmission stays as-is — it gives a fast, friendly error on
-- the common case; this trigger is the actual guarantee.
create or replace function public.enforce_active_listing_limit()
returns trigger as $$
declare
  v_max_listings integer;
  v_plan_id text;
  v_active_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(new.user_id::text));

  select s.plan_id, p.max_active_listings
    into v_plan_id, v_max_listings
    from public.subscriptions s
    join public.plans p on p.id = s.plan_id
    where s.user_id = new.user_id and s.status = 'active';

  -- No active paid subscription, or plan has no cap (Dealer) — a plain
  -- "Zasebni oglas" buyer pays per listing with no concurrent-count limit.
  if v_plan_id is null or v_plan_id = 'free' or v_max_listings is null then
    return new;
  end if;

  select count(*) into v_active_count
    from public.listing_submissions
    where user_id = new.user_id
      and (
        status = 'pending_review'
        or (status = 'published' and (expires_at is null or expires_at > now()))
      );

  -- The row being inserted isn't counted yet at BEFORE INSERT time, so the
  -- limit is exceeded once existing active rows alone already reach it.
  if v_active_count >= v_max_listings then
    raise exception 'active_listing_limit_exceeded'
      using detail = format('%s/%s', v_active_count, v_max_listings);
  end if;

  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists listing_submissions_enforce_limit on public.listing_submissions;
create trigger listing_submissions_enforce_limit
  before insert on public.listing_submissions
  for each row execute function public.enforce_active_listing_limit();
