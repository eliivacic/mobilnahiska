"use client";

import { useState } from "react";
import Image from "next/image";

export function ListingGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_180px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-muted shadow-lift lg:aspect-[16/11]">
        <Image
          src={images[activeIndex]}
          alt={title}
          fill
          priority
          sizes="(min-width: 1024px) 65vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Prikaži fotografijo ${index + 1}`}
            aria-current={index === activeIndex}
            className={`relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-[4px] bg-muted transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] lg:w-full ${
              index === activeIndex ? "ring-2 ring-brand" : "opacity-75 hover:opacity-100"
            }`}
          >
            <Image src={image} alt="" fill sizes="180px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
