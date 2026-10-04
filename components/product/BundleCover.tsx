import Image from "next/image";
import { BundleArt } from "@/components/product/BundleArt";
import type { ApplianceArtKind } from "@/components/product/ApplianceArt";
import { cn } from "@/lib/utils";

/** The set's large picture: the uploaded cover image when there is one, otherwise
 * the generated BundleArt card. */
export function BundleCover({
  coverUrl,
  productImages = [],
  artKinds,
  nameHe,
  itemCount,
  className,
  priority,
}: {
  coverUrl?: string;
  /** First photo of each included product — shown as a collage when no cover was uploaded. */
  productImages?: string[];
  artKinds: ApplianceArtKind[];
  nameHe: string;
  itemCount: number;
  className?: string;
  priority?: boolean;
}) {
  if (!coverUrl && productImages.length > 0) {
    const shown = productImages.slice(0, 4);
    const cols = shown.length === 1 ? "grid-cols-1" : "grid-cols-2";
    return (
      <div className={cn("relative overflow-hidden bg-sand-100", className)}>
        <div className={cn("grid h-full w-full gap-0.5", cols, shown.length > 2 && "grid-rows-2")}>
          {shown.map((src, i) => (
            <div key={i} className={cn("relative bg-white", shown.length === 3 && i === 0 && "row-span-2")}>
              <Image src={src} alt="" fill priority={priority} sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
          <p className="font-heading text-lg font-semibold text-white">{nameHe}</p>
          <p className="text-xs text-white/80">{itemCount} מוצרים בסט</p>
        </div>
      </div>
    );
  }
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
