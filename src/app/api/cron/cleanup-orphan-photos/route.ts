import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BUCKET = "listing-photos";
const ORPHAN_AGE_MS = 48 * 60 * 60 * 1000; // 48h grace period before a file is even considered

function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

// Files land in storage the moment a user picks them in /oddaj-oglas or the
// edit form — before the listing itself is ever saved. Someone who uploads
// photos and then abandons the form leaves those files behind forever with
// no other cleanup path. This finds files older than the grace period whose
// path isn't referenced by ANY listing_submissions row (any status — a
// pending/rejected/deactivated listing's photos are still real and must
// never be touched) and deletes only those.
//
// Dry-run by default (?dryRun=false to actually delete) — this touches real
// user uploads, so the safe default is to only report what it would delete.
export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") !== "false";

  const admin = createAdminClient();

  const { data: submissions } = await admin.from("listing_submissions").select("photo_urls");
  const referencedPaths = new Set<string>();
  for (const submission of submissions ?? []) {
    for (const photoUrl of submission.photo_urls ?? []) {
      const marker = `/storage/v1/object/public/${BUCKET}/`;
      const index = photoUrl.indexOf(marker);
      if (index !== -1) referencedPaths.add(photoUrl.slice(index + marker.length));
    }
  }

  const { data: userFolders, error: listError } = await admin.storage.from(BUCKET).list("", { limit: 1000 });
  if (listError) {
    return NextResponse.json({ error: "Failed to list storage folders", detail: listError.message }, { status: 500 });
  }

  const now = Date.now();
  const orphans: string[] = [];

  for (const folder of userFolders ?? []) {
    // Bucket root only ever contains per-user folders (uploadListingPhoto
    // always writes to `${userId}/...`) — skip anything that isn't one.
    if (folder.id !== null) continue;

    const { data: files } = await admin.storage.from(BUCKET).list(folder.name, { limit: 1000 });
    for (const file of files ?? []) {
      const path = `${folder.name}/${file.name}`;
      if (referencedPaths.has(path)) continue;

      const createdAt = file.created_at ? new Date(file.created_at).getTime() : 0;
      if (now - createdAt > ORPHAN_AGE_MS) orphans.push(path);
    }
  }

  if (!dryRun && orphans.length > 0) {
    await admin.storage.from(BUCKET).remove(orphans);
  }

  return NextResponse.json({ ok: true, dryRun, orphanCount: orphans.length, orphans });
}
