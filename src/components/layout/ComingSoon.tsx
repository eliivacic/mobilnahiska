import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-light tracking-[-0.01em] text-foreground sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-6 bg-brand text-brand-foreground hover:bg-brand-hover">
        <Link href="/oglasi">Prikaži oglase</Link>
      </Button>
    </div>
  );
}
