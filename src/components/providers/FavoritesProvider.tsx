"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type FavoriteKind = "listing" | "land";

interface FavoritesContextValue {
  isFavorite: (kind: FavoriteKind, slug: string) => boolean;
  toggleFavorite: (kind: FavoriteKind, slug: string) => void;
  ready: boolean;
  signedIn: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function key(kind: FavoriteKind, slug: string) {
  return `${kind}:${slug}`;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!user) {
        setSignedIn(false);
        setReady(true);
        return;
      }

      setSignedIn(true);
      setUserId(user.id);

      const { data } = await supabase.from("favorites").select("kind, item_slug");
      if (cancelled) return;

      setFavorites(new Set((data ?? []).map((row) => key(row.kind as FavoriteKind, row.item_slug))));
      setReady(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isFavorite = useCallback((kind: FavoriteKind, slug: string) => favorites.has(key(kind, slug)), [favorites]);

  const toggleFavorite = useCallback(
    (kind: FavoriteKind, slug: string) => {
      if (!signedIn || !userId) {
        router.push("/prijava");
        return;
      }

      const k = key(kind, slug);
      const wasFavorite = favorites.has(k);

      setFavorites((prev) => {
        const next = new Set(prev);
        if (wasFavorite) {
          next.delete(k);
        } else {
          next.add(k);
        }
        return next;
      });

      const supabase = createClient();
      if (wasFavorite) {
        supabase.from("favorites").delete().eq("user_id", userId).eq("kind", kind).eq("item_slug", slug).then();
      } else {
        supabase.from("favorites").insert({ user_id: userId, kind, item_slug: slug }).then();
      }
    },
    [favorites, signedIn, userId, router]
  );

  return (
    <FavoritesContext.Provider value={{ isFavorite, toggleFavorite, ready, signedIn }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
