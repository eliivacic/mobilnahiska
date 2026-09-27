"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-2xl font-light tracking-[-0.01em] text-foreground sm:text-3xl">
        Podatkov trenutno ni bilo mogoče naložiti.
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Prišlo je do nepričakovane napake. Poskusite znova ali se vrnite na naslovnico.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} className="bg-brand text-brand-foreground hover:bg-brand-hover">
          Poskusi znova
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Na naslovnico</Link>
        </Button>
      </div>
    </div>
  );
}
