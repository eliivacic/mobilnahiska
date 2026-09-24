import Image from "next/image";

// The current mark (public/logo-mark.png) is white artwork on a transparent
// background, so it only reads on a dark surface. On light surfaces we wrap
// it in a dark chip so it stays visible. Once a header-ready (dark ink)
// variant of the logo exists, swap the `src` below and drop the chip wrapper
// for `onLight` — the rest of the layout won't need to change.
const LOGO_SRC = "/logo-mark.png";
const LOGO_WIDTH = 1686;
const LOGO_HEIGHT = 933;

export function Logo({
  variant = "onLight",
  className = "h-10",
}: {
  variant?: "onLight" | "onDark";
  className?: string;
}) {
  if (variant === "onDark") {
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

  return (
    <span className={`inline-flex items-center rounded-[10px] bg-primary px-3 py-1.5 ${className}`}>
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
