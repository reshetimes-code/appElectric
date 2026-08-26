import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/lib/types";

export function ProductRail({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <div className="hide-scrollbar-x -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} className="min-w-[240px] snap-start sm:min-w-0" />
      ))}
    </div>
  );
}
