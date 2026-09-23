import Link from "next/link";

const CATEGORIES = [
  { label: "Vse", href: "/oglasi" },
  { label: "Mobilne hiške", href: "/oglasi?type=mobilna" },
  { label: "Modularne hiše", href: "/oglasi?type=modularna" },
  { label: "Nove", href: "/oglasi?condition=nova" },
  { label: "Rabljene", href: "/oglasi?condition=rabljena" },
  { label: "Do 30.000 €", href: "/oglasi?priceMax=30000" },
  { label: "Do 50.000 €", href: "/oglasi?priceMax=50000" },
];

export function QuickCategories() {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((category, index) => (
        <Link
          key={category.label}
          href={category.href}
          className={
            index === 0
              ? "whitespace-nowrap rounded-[4px] bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground transition-colors hover:bg-brand-hover sm:px-3.5 sm:text-sm"
              : "whitespace-nowrap rounded-[4px] bg-secondary/40 px-3 py-1.5 text-xs font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground sm:px-3.5 sm:text-sm"
          }
        >
          {category.label}
        </Link>
      ))}
    </div>
  );
}
