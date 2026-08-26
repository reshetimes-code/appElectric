import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/types";

/**
 * Renders a brand's official logo image when we have one (see IMAGE_SOURCES.md),
 * otherwise falls back to a styled wordmark so every brand still reads as a mark,
 * not a plain link.
 */
export function BrandLogo({ brand, className }: { brand: Brand; className?: string }) {
  if (brand.logo) {
    return (
      <div className={cn("flex h-10 items-center", className)}>
        <Image
          src={brand.logo}
          alt={brand.nameHe}
          width={140}
          height={40}
          className="h-full w-auto object-contain"
        />
      </div>
    );
  }
  return (
    <span className={cn("font-heading text-lg font-semibold tracking-tight text-charcoal-700", className)}>
      {brand.nameHe}
    </span>
  );
}
