import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORY_IMAGES } from "@/data/images";

const CATEGORIES = [
  {
    title: "Mobilne hiške",
    description: "Nove in rabljene mobilne hiške priznanih proizvajalcev, pripravljene za dostavo.",
    href: "/oglasi?type=mobilna",
    image: CATEGORY_IMAGES.mobilna,
  },
  {
    title: "Modularne hiše",
    description: "Modularne rešitve za trajno bivanje, prilagojene vašim željam in zemljišču.",
    href: "/oglasi?type=modularna",
    image: CATEGORY_IMAGES.modularna,
  },
  {
    title: "Zemljišča",
    description: "Zazidljiva, kmetijska in gozdna zemljišča za vaš naslednji projekt.",
    href: "/zemljisca",
    image: CATEGORY_IMAGES.zemljisce,
  },
] as const;

export function ExploreCategories() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {CATEGORIES.map((category, index) => (
        <Link
          key={category.title}
          href={category.href}
          className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[14px] border border-border/60 bg-primary sm:aspect-[3/4]"
        >
          <Image
            src={category.image}
            alt={category.title}
            fill
            priority={index === 0}
            sizes="(min-width: 640px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="relative p-5">
            <h3 className="font-heading text-xl font-light tracking-[-0.01em] text-white sm:text-2xl">
              {category.title}
            </h3>
            <p className="mt-1.5 max-w-[26ch] text-sm leading-relaxed text-white/80">
              {category.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white">
              Oglej si ponudbo
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
