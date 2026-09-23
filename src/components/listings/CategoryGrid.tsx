import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { label: "Mobilne hiške do 30.000 €", href: "/oglasi?type=mobilna&priceMax=30000" },
  { label: "Mobilne hiške do 50.000 €", href: "/oglasi?type=mobilna&priceMax=50000" },
  { label: "Rabljene mobilne hiške", href: "/oglasi?type=mobilna&condition=rabljena" },
  { label: "Modularne hiše", href: "/oglasi?type=modularna" },
  { label: "3 ali več spalnic", href: "/oglasi?bedroomsMin=3" },
  { label: "Dostava v Slovenijo", href: "/oglasi?delivery=true" },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {CATEGORIES.map((category) => (
        <Link
          key={category.label}
          href={category.href}
          className="group flex items-center justify-between rounded-[6px] border border-border/60 px-5 py-4 transition-colors hover:border-border hover:bg-secondary/20"
        >
          <span className="text-sm font-medium text-foreground">{category.label}</span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:text-brand" />
        </Link>
      ))}
    </div>
  );
}
