import Image from "next/image";

// public/logo-mark.png is dark-brown line art on a transparent background —
// reads directly on any light/sage-green surface (the whole site, post
// redesign). `onDark` wraps it in a light chip for the rare case it ever
// needs to sit on a dark surface, where the brown mark alone would vanish.
const LOGO_SRC = "/logo-mark.png";
const LOGO_WIDTH = 1536;
const LOGO_HEIGHT = 1024;

export function Logo({
  variant = "onLight",
  className = "h-10",
}: {
  variant?: "onLight" | "onDark";
  className?: string;
}) {
  if (variant === "onDark") {
    return (
      <span className={`inline-flex items-center rounded-[10px] bg-background px-3 py-1.5 ${className}`}>
        <Image
          src={LOGO_SRC}
          alt="mobilnahiska.si"
          width={LOGO_WIDTH}
          height={LOGO_HEIGHT}
          priority
          className="h-full w-auto object-contain"
        />
      </span>
    );
  }

  return (
    <Image
      src={LOGO_SRC}
      alt="mobilnahiska.si"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority
      className={`w-auto object-contain ${className}`}
    />
  );
}
