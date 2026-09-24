import { createClient } from "@/lib/supabase/client";

export const MAX_PHOTOS = 12;
export const MAX_PHOTO_SIZE_BYTES = 8 * 1024 * 1024; // 8MB — matches the storage bucket's own limit.
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validatePhotoFile(file: File): string | null {
  if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
    return `${file.name}: dovoljene so samo slike JPEG, PNG ali WebP.`;
  }
  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return `${file.name}: datoteka je prevelika (največ 8 MB).`;
  }
  return null;
}

export async function uploadListingPhoto(
  file: File,
  userId: string
): Promise<{ url: string } | { error: string }> {
  const validationError = validatePhotoFile(file);
  if (validationError) return { error: validationError };

  const supabase = createClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from("listing-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { error: `${file.name}: nalaganje ni uspelo.` };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("listing-photos").getPublicUrl(path);

  return { url: publicUrl };
}
