-- Adds a third moderation outcome, distinct from the terminal "rejected":
-- admin can send a submission back for corrections. The submitter can
-- already edit/resubmit from any non-"deactivated" status (RLS + the
-- existing updateListingSubmission() action both allow it, unconditioned
-- on status) — this value just gives that path its own honest label and
-- email, instead of overloading "rejected" for something that is not final.
alter type public.listing_submission_status add value if not exists 'needs_revision';
