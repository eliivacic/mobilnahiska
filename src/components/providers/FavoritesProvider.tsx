"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type FavoriteKind = "listing" | "land";

const PENDING_FAVORITE_KEY = "mh_pending_favorite";

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

function savePendingFavorite(kind: FavoriteKind, slug: string) {
  try {
    sessionStorage.setItem(PENDING_FAVORITE_KEY, JSON.stringify({ kind, slug }));
  } catch {
    // sessionStorage can throw in private browsing — the favorite just
    // won't auto-restore after login, which is a safe degradation.
  }
}

function hasPendingFavorite(): boolean {
  try {
    return sessionStorage.getItem(PENDING_FAVORITE_KEY) !== null;
  } catch {
    return false;
  }
}

function takePendingFavorite(): { kind: FavoriteKind; slug: string } | null {
  try {
    const raw = sessionStorage.getItem(PENDING_FAVORITE_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(PENDING_FAVORITE_KEY);
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.kind === "listing" || parsed.kind === "land") && typeof parsed.slug === "string") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const appliedPendingRef = useRef(false);
  const signedInRef = useRef(false);

  const loadForUser = useCallback(async (uid: string) => {
    const supabase = createClient();
    setSignedIn(true);
    signedInRef.current = true;
    setUserId(uid);

    const { data } = await supabase.from("favorites").select("kind, item_slug");
    const loaded = new Set((data ?? []).map((row) => key(row.kind as FavoriteKind, row.item_slug)));

    // If the user just logged in to save something (see toggleFavorite
    // below), finish that action now instead of requiring a second click.
    if (!appliedPendingRef.current) {
      appliedPendingRef.current = true;
      const pending = takePendingFavorite();
      if (pending && !loaded.has(key(pending.kind, pending.slug))) {
        loaded.add(key(pending.kind, pending.slug));
        await supabase.from("favorites").insert({ user_id: uid, kind: pending.kind, item_slug: pending.slug });
        toast.success("Oglas je bil shranjen med priljubljene.");
      }
    }

    setFavorites(loaded);
    setReady(true);
  }, []);

  // A plain `getUser()` on mount only reflects the session that already
  // existed when this provider first mounted. Since it lives in the root
  // layout and is never unmounted, it would otherwise never notice a login
  // that happens via a client-side redirect (e.g. after the /prijava server
  // action) — onAuthStateChange covers same-tab auth transitions instead.
  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return;
      if (!session?.user) {
        setSignedIn(false);
        signedInRef.current = false;
        setUserId(null);
        setFavorites(new Set());
        setReady(true);
        return;
      }
      loadForUser(session.user.id);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadForUser]);

  // Belt-and-braces: if a favorite is still waiting to be restored after a
  // route change (e.g. landing back on /oglasi right after login) but we
  // still think we're signed out, re-check directly — onAuthStateChange
  // should normally already have fired by then, but session propagation
  // timing after a redirect isn't guaranteed.
  useEffect(() => {
    if (signedInRef.current || !hasPendingFavorite()) return;
    const supabase = createClient();
    let cancelled = false;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (cancelled || !user || signedInRef.current) return;
      loadForUser(user.id);
    });

    return () => {
      cancelled = true;
    };
  }, [pathname, loadForUser]);

  const isFavorite = useCallback((kind: FavoriteKind, slug: string) => favorites.has(key(kind, slug)), [favorites]);

  const toggleFavorite = useCallback(
    (kind: FavoriteKind, slug: string) => {
      if (!signedIn || !userId) {
        savePendingFavorite(kind, slug);
        toast.info("Za shranjevanje priljubljenih se morate prijaviti.");
        router.push(`/prijava?returnTo=${encodeURIComponent(pathname)}`);
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
    [favorites, signedIn, userId, router, pathname]
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
