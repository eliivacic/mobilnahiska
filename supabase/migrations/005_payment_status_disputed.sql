-- Adds "disputed" to payment_status, for charge.dispute.created webhook
-- handling (src/app/api/webhooks/stripe/route.ts) — a chargeback is a
-- distinct state from a voluntary refund and needs its own value to record
-- accurately rather than overloading "refunded" or "failed" for it.
alter type public.payment_status add value if not exists 'disputed';
