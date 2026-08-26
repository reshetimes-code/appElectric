import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/types";

// The source logo files carry very different amounts of internal whitespace
// (official brand "clear space" margins, tagline text, etc.), so a single fixed
// height makes them read as wildly different sizes. These per-brand heights are
// calibrated by eye so the visible marks feel like one consistent size.
const LOGO_HEIGHT: Record<string, string> = {
  samsung: "h-6 sm:h-7",
  electrolux: "h-8 sm:h-9",
  "de-dietrich": "h-12 sm:h-14",
  miele: "h-9 sm:h-10",
};

/**
 * Renders a brand's official logo image when we have one (see IMAGE_SOURCES.md),
 * otherwise falls back to a styled wordmark so every brand still reads as a mark,
 * not a plain link.
 */
export function BrandLogo({ brand, className }: { brand: Brand; className?: string }) {
  if (brand.logo) {
    return (
      <div className={cn("flex h-10 items-center justify-center sm:h-12", className)}>
        <Image
          src={brand.logo}
          alt={brand.nameHe}
          width={200}
          height={56}
          className={cn("w-auto object-contain", LOGO_HEIGHT[brand.id] ?? "h-9 sm:h-10")}
        />
      </div>
    );
  }
  return (
    <div className={cn("flex h-10 items-center justify-center sm:h-12", className)}>
      <span className="font-heading text-xl font-semibold tracking-tight text-charcoal-700 sm:text-2xl">
        {brand.nameHe}
      </span>
    </div>
  );
}
