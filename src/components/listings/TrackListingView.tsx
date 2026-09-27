"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function TrackListingView({ slug, kind }: { slug: string; kind: "listing" | "land" }) {
  useEffect(() => {
    trackEvent("listing_view", { listing_slug: slug, kind });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
