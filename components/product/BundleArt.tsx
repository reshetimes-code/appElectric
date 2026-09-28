import { ApplianceArt, type ApplianceArtKind } from "@/components/product/ApplianceArt";
import { cn } from "@/lib/utils";

const MAX_ICONS = 4;

/**
 * Bundles have no uploaded photo — the admin only names the set and picks
 * products/prices. This generates a card instead: a strip of the included
 * products' own appliance-art icons plus the bundle name and item count, so
 * there's still a distinctive, informative visual per bundle.
 */
export function BundleArt({
  artKinds,
  nameHe,
  itemCount,
  className,
}: {
  artKinds: ApplianceArtKind[];
  nameHe: string;
  itemCount: number;
  className?: string;
}) {
  const shown = artKinds.slice(0, MAX_ICONS);
  const overflow = artKinds.length - shown.length;

  return (
    <div className={cn("relative flex flex-col justify-end overflow-hidden bg-gradient-to-br from-charcoal-900 to-charcoal-700 p-6", className)}>
      <div className="mb-4 flex flex-wrap gap-2">
        {shown.map((kind, i) => (
          <div key={i} className="h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/15">
            <ApplianceArt kind={kind} className="h-full w-full p-1.5" />
          </div>
        ))}
        {overflow > 0 && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-semibold text-white ring-1 ring-white/15">
            +{overflow}
          </div>
        )}
      </div>
      <p className="font-heading text-lg font-bold leading-snug text-white sm:text-xl">{nameHe}</p>
      <p className="text-sm text-white/70">{itemCount} מוצרים בסט</p>
    </div>
  );
}
