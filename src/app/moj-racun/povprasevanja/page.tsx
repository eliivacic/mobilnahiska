import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDateTimeSl } from "@/lib/format";
import { InquiryStatusSelect } from "@/components/dashboard/InquiryStatusSelect";
import { updateOwnInquiryStatus } from "@/lib/supabase/inquiry-status";

export const metadata: Metadata = { title: "Povpraševanja | mobilnahiska.si" };

export default async function PovprasevanjaPage() {
  const supabase = await createClient();
  // RLS (`inquiries_select_own_listings`) scopes this to inquiries on
  // listings this user actually owns — no explicit .eq(user_id) needed or
  // even possible, since the ownership check is via listing_submissions.
  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("id, listing_title, name, email, phone, message, status, created_at")
    .order("created_at", { ascending: false });

  const rows = inquiries ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground">Povpraševanja</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Sporočila kupcev, prejeta preko vaših oglasov.</p>

      {rows.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-2 rounded-[14px] border border-dashed border-border p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/40">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <p className="text-sm font-semibold text-foreground">Za vaše oglase še ni novih povpraševanj.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((inquiry) => (
            <li key={inquiry.id} className="rounded-[14px] border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">{inquiry.listing_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {inquiry.name} &middot; {inquiry.email}
                    {inquiry.phone && ` · ${inquiry.phone}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTimeSl(inquiry.created_at)}</p>
                </div>
                <InquiryStatusSelect inquiryId={inquiry.id} status={inquiry.status} onUpdate={updateOwnInquiryStatus} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{inquiry.message}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
