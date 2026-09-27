# Supabase Auth email templates (manual install)

These two emails (signup confirmation, password recovery) are sent by
**Supabase Auth itself**, not by the app's own email system in
`src/lib/email/`. Composio's Supabase management wrapper doesn't expose the
`mailer_templates_*` / `mailer_subjects_*` fields, so they couldn't be
applied via a migration — they need to be pasted in once, manually:

1. Open the Supabase Dashboard → **Authentication → Email Templates**
   (project `uwqnbsjatixrmiugxtkn`).
2. **Confirm signup** template:
   - Subject: `Potrdite svoj e-mail | mobilnahiska.si`
   - Body: paste the contents of `confirmation.html`.
3. **Reset password** template:
   - Subject: `Ponastavitev gesla | mobilnahiska.si`
   - Body: paste the contents of `recovery.html`.

Both keep Supabase's `{{ .ConfirmationURL }}` placeholder as the button
link — don't remove it. No other auth behavior changes; this only reskins
the two emails Supabase already sends.

Until custom SMTP is configured on the Supabase project, these still send
through Supabase's own rate-limited default mailer (not Resend) — see the
main technical report for the SMTP recommendation.
