"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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

    // One bad file (wrong type, too large) must not discard the rest of the
    // batch — split up front, upload only the valid ones, and report every
    // rejection at the end instead of stopping at the first problem.
    const failures: string[] = [];
    const validFiles: File[] = [];
    for (const file of files) {
      const validationError = validatePhotoFile(file);
      if (validationError) failures.push(validationError);
      else validFiles.push(file);
    }

    setUploading(true);
    setProgress({ done: 0, total: validFiles.length });

    const uploaded: string[] = [];
    for (const file of validFiles) {
      const result = await uploadListingPhoto(file, userId);
      if ("error" in result) {
        failures.push(result.error);
      } else {
        uploaded.push(result.url);
      }
      setProgress((prev) => ({ ...prev, done: prev.done + 1 }));
    }

    if (uploaded.length > 0) onChange([...photoUrls, ...uploaded]);
    setUploading(false);
    if (failures.length > 0) {
      setError(
        failures.length === 1
          ? failures[0]
          : `${failures.length} fotografij ni bilo mogoče naložiti: ${failures.join(" ")}`
      );
    }
  }

  function removePhoto(url: string) {
    onChange(photoUrls.filter((item) => item !== url));
  }

  // Arrow buttons rather than drag-and-drop — reliable on touch, where drag
  // reordering in a scrollable grid is notoriously unreliable (see spec:
  // "če drag-and-drop na touch napravah ni zanesljiv, omogoči drugo jasno
  // rešitev"). The first photo is always the listing's main/cover image —
  // ListingCard, the homepage, and search results all use images[0].
  function moveLeft(index: number) {
    if (index === 0) return;
    const next = [...photoUrls];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  }

  function moveRight(index: number) {
    if (index === photoUrls.length - 1) return;
    const next = [...photoUrls];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {photoUrls.map((url, index) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-[10px] bg-muted">
            <Image src={url} alt="" fill sizes="150px" className="object-cover" />

            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-primary/90 px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                Glavna
              </span>
            )}

            <button
              type="button"
              onClick={() => removePhoto(url)}
              aria-label="Odstrani fotografijo"
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {photoUrls.length > 1 && (
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => moveLeft(index)}
                  disabled={index === 0}
                  aria-label="Premakni fotografijo prej"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveRight(index)}
                  disabled={index === photoUrls.length - 1}
                  aria-label="Premakni fotografijo kasneje"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
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
