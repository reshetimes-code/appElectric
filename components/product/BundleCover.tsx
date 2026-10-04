import Image from "next/image";
import { BundleArt } from "@/components/product/BundleArt";
import type { ApplianceArtKind } from "@/components/product/ApplianceArt";
import { cn } from "@/lib/utils";

/** The set's large picture: the uploaded cover image when there is one, otherwise
 * the generated BundleArt card. */
export function BundleCover({
  coverUrl,
  artKinds,
  nameHe,
  itemCount,
  className,
  priority,
}: {
  coverUrl?: string;
  artKinds: ApplianceArtKind[];
  nameHe: string;
  itemCount: number;
  className?: string;
  priority?: boolean;
}) {
  if (!coverUrl) return <BundleArt artKinds={artKinds} nameHe={nameHe} itemCount={itemCount} className={className} />;
  return (
    <div className={cn("relative overflow-hidden bg-sand-100", className)}>
      <Image
        src={coverUrl}
        alt={nameHe}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
        <p className="font-heading text-lg font-semibold text-white">{nameHe}</p>
        <p className="text-xs text-white/80">{itemCount} מוצרים בסט</p>
      </div>
    </div>
  );
}
