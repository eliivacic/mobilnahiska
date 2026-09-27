"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type InquiryStatus = "new" | "contacted" | "closed";

// Seller-scoped status update — RLS (`inquiries_update_own_listings`) only
// allows this to succeed when the inquiry's listing_submission_id belongs to
// the caller, so there's no need to re-check ownership here.
export async function updateOwnInquiryStatus(inquiryId: string, status: InquiryStatus): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Za to dejanje se morate prijaviti." };

  const { error } = await supabase.from("inquiries").update({ status }).eq("id", inquiryId);
  if (error) return { error: "Statusa ni bilo mogoče posodobiti." };

  revalidatePath("/moj-racun/povprasevanja");
  return {};
}
