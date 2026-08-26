"use client";

import Link from "next/link";
import { Heart, Scale, ShoppingBag } from "lucide-react";
import { ApplianceArt } from "@/components/product/ApplianceArt";
import { AvailabilityBadge } from "@/components/product/AvailabilityBadge";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { useCompare } from "@/lib/context/CompareContext";
import { useCart } from "@/lib/context/CartContext";
import { getBrandBySlug } from "@/lib/data/brands";
import { brands } from "@/lib/data/brands";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";

function brandName(brandId: string) {
  return brands.find((b) => b.id === brandId)?.nameHe ?? "";
}
void getBrandBySlug;

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const favorites = useFavorites();
  const compare = useCompare();
  const cart = useCart();
  const toast = useToast();

  const active = favorites.isFavorite(product.id);
  const selectedForCompare = compare.isSelected(product.id);
  const outOfStock = product.availabilityStatus === "out-of-stock";

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white transition-shadow hover:shadow-lg",
        className,
      )}
    >
      <div className="relative">
        <Link href={`/product/${product.slug}`} className="block">
          <ApplianceArt kind={product.artKind} className="aspect-[4/3] transition-transform duration-300 group-hover:scale-[1.03]" />
        </Link>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {product.compareAtPrice ? <Badge tone="amber">מבצע</Badge> : <span />}
          <button
            type="button"
            onClick={() => favorites.toggle(product.id)}
            aria-pressed={active}
            aria-label={active ? "הסר ממועדפים" : "הוסף למועדפים"}
            className="rounded-full bg-white/90 p-2 text-charcoal-700 shadow-sm transition-colors hover:text-brand-600"
          >
            <Heart size={16} className={active ? "fill-brand-600 text-brand-600" : ""} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-xs text-charcoal-500">
          <span>{brandName(product.brandId)}</span>
          {product.energyRating && <Badge tone="success">{product.energyRating}</Badge>}
        </div>
        <Link href={`/product/${product.slug}`} className="font-heading text-sm font-semibold leading-snug text-charcoal-900 hover:text-brand-700">
          {product.nameHe}
        </Link>
        <p className="line-clamp-2 text-xs leading-relaxed text-charcoal-500">{product.shortDescriptionHe}</p>
        <div className="mt-auto flex flex-col gap-2 pt-2">
          <AvailabilityBadge status={product.availabilityStatus} />
          <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} installmentsMonths={product.installmentsMonths} size="sm" />
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => {
              cart.addItem(product.id, 1);
              toast.show(`${product.nameHe} נוסף לסל`);
            }}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-control)] bg-charcoal-900 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
          >
            <ShoppingBag size={15} />
            {outOfStock ? "אזל מהמלאי" : "הוסף לסל"}
          </button>
          <button
            type="button"
            onClick={() => {
              const res = compare.toggle(product.id);
              if (!res.ok && res.reason === "full") {
                toast.show(`ניתן להשוות עד ${compare.max} מוצרים בו-זמנית`);
              }
            }}
            aria-pressed={selectedForCompare}
            aria-label="הוסף להשוואה"
            title="הוסף להשוואה"
            className={cn(
              "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-control)] border transition-colors",
              selectedForCompare ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-charcoal-600 hover:border-charcoal-400",
            )}
          >
            <Scale size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
