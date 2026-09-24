"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import {
  MAX_PHOTOS,
  validatePhotoFile,
  uploadListingPhoto,
} from "@/lib/supabase/listing-photo-upload";

interface PhotoUploaderProps {
  userId: string;
  photoUrls: string[];
  onChange: (urls: string[]) => void;
}

export function PhotoUploader({ userId, photoUrls, onChange }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const files = Array.from(fileList);
    if (photoUrls.length + files.length > MAX_PHOTOS) {
      setError(`Največ ${MAX_PHOTOS} fotografij na oglas.`);
      return;
    }

    const validationErrors = files.map(validatePhotoFile).filter((message): message is string => !!message);
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: files.length });

    const uploaded: string[] = [];
    for (const file of files) {
      const result = await uploadListingPhoto(file, userId);
      if ("error" in result) {
        setError(result.error);
        setUploading(false);
        if (uploaded.length > 0) onChange([...photoUrls, ...uploaded]);
        return;
      }
      uploaded.push(result.url);
      setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    onChange([...photoUrls, ...uploaded]);
    setUploading(false);
  }

  function removePhoto(url: string) {
    onChange(photoUrls.filter((item) => item !== url));
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photoUrls.map((url) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-[10px] bg-muted">
            <Image src={url} alt="" fill sizes="150px" className="object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(url)}
              aria-label="Odstrani fotografijo"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {photoUrls.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-border text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-xs">
                  {progress.done}/{progress.total}
                </span>
              </>
            ) : (
              <>
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Dodaj fotografijo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

      <p className="mt-2 text-xs text-muted-foreground">
        JPEG, PNG ali WebP, največ 8 MB na fotografijo, do {MAX_PHOTOS} fotografij.
      </p>

      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
