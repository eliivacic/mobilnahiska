"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { logAdminAction } from "@/lib/supabase/audit";

export async function moderateComment(commentId: string, status: "approved" | "hidden") {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("comments").select("status").eq("id", commentId).single();
  await admin.from("comments").update({ status }).eq("id", commentId);
  await logAdminAction({
    adminId: user.id,
    action: "comment.moderate",
    entityType: "comment",
    entityId: commentId,
    before,
    after: { status },
  });
  revalidatePath("/admin/komentarji");
  revalidatePath("/admin");
  revalidatePath("/vodici", "layout");
}

export async function deleteComment(commentId: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("comments").select("*").eq("id", commentId).single();
  await admin.from("comments").delete().eq("id", commentId);
  await logAdminAction({
    adminId: user.id,
    action: "comment.delete",
    entityType: "comment",
    entityId: commentId,
    before,
    after: null,
  });
  revalidatePath("/admin/komentarji");
  revalidatePath("/admin");
  revalidatePath("/vodici", "layout");
}

export interface UpdatePlanInput {
  name: string;
  priceCents: number;
  maxActiveListings: number | null;
  description: string;
  features: string[];
  isActive: boolean;
  isFeatured: boolean;
  ctaLabel: string;
  durationDays: number | null;
}

export async function updatePlan(planId: string, data: UpdatePlanInput) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin
    .from("plans")
    .select("name, price_cents, max_active_listings, description, features, is_active, is_featured, cta_label, duration_days")
    .eq("id", planId)
    .single();

  const after = {
    name: data.name,
    price_cents: data.priceCents,
    max_active_listings: data.maxActiveListings,
    description: data.description || null,
    features: data.features,
    is_active: data.isActive,
    is_featured: data.isFeatured,
    cta_label: data.ctaLabel || null,
    duration_days: data.durationDays,
  };

  await admin.from("plans").update(after).eq("id", planId);
  await logAdminAction({
    adminId: user.id,
    action: "plan.update",
    entityType: "plan",
    entityId: planId,
    before,
    after,
  });
  revalidatePath("/admin/paketi");
  revalidatePath("/moj-racun/paket");
  revalidatePath("/cene");
}

export async function updatePromotionAddon(
  addonId: string,
  data: { priceCents: number; durationDays: number; isActive: boolean }
) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin
    .from("promotion_addons")
    .select("price_cents, duration_days, is_active")
    .eq("id", addonId)
    .single();

  const after = {
    price_cents: data.priceCents,
    duration_days: data.durationDays,
    is_active: data.isActive,
    updated_at: new Date().toISOString(),
  };

  await admin.from("promotion_addons").update(after).eq("id", addonId);
  await logAdminAction({
    adminId: user.id,
    action: "promotion_addon.update",
    entityType: "promotion_addon",
    entityId: addonId,
    before,
    after,
  });
  revalidatePath("/admin/paketi");
  revalidatePath("/cene");
}

export async function updateUserRole(userId: string, role: "user" | "dealer" | "admin") {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("profiles").select("role").eq("id", userId).single();
  // Uses the service-role client on purpose: profiles.role is protected by a
  // trigger that only accepts role changes from the service role, so a
  // regular authenticated update (even from an admin's own session) would be
  // silently reverted. See migration 001_profiles.sql.
  await admin.from("profiles").update({ role }).eq("id", userId);
  await logAdminAction({
    adminId: user.id,
    action: "user.role_change",
    entityType: "user",
    entityId: userId,
    before,
    after: { role },
  });
  revalidatePath("/admin/uporabniki");
}

export async function updatePortalSetting(key: string, value: string) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const { data: before } = await admin.from("portal_settings").select("value").eq("key", key).single();
  await admin.from("portal_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  await logAdminAction({
    adminId: user.id,
    action: "setting.update",
    entityType: "portal_setting",
    entityId: key,
    before,
    after: { value },
  });
  revalidatePath("/admin/nastavitve");
}

export async function updatePortalSettingsBatch(entries: Record<string, string>) {
  const { user } = await requireAdmin();
  const admin = createAdminClient();
  const keys = Object.keys(entries);
  const { data: beforeRows } = await admin.from("portal_settings").select("key, value").in("key", keys);
  const before = Object.fromEntries((beforeRows ?? []).map((row) => [row.key, row.value]));

  await admin.from("portal_settings").upsert(
    keys.map((key) => ({ key, value: entries[key], updated_at: new Date().toISOString() }))
  );

  await logAdminAction({
    adminId: user.id,
    action: "setting.update_batch",
    entityType: "portal_setting",
    entityId: keys.join(","),
    before,
    after: entries,
  });
  revalidatePath("/admin/nastavitve");
}
