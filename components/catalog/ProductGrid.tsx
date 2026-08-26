import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/types";
import { PackageSearch } from "lucide-react";

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-sand-300 py-20 text-center">
        <PackageSearch size={32} className="text-charcoal-300" />
        <p className="font-heading text-lg font-semibold text-charcoal-800">לא נמצאו מוצרים התואמים את הסינון</p>
        <p className="text-sm text-charcoal-500">נסו להסיר חלק מהמסננים או לחפש קטגוריה אחרת.</p>
        <Button href="/shop" variant="secondary" className="mt-2">נקה סינון וחזור לכל המוצרים</Button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
