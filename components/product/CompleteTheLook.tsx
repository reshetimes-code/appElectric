import { SectionHeading } from "@/components/ui/Container";
import { ProductRail } from "@/components/home/ProductRail";
import type { Product } from "@/lib/types";

export function CompleteTheLook({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <div className="flex flex-col gap-5">
      <SectionHeading eyebrow="השלימו את החזון" title="משלים את הפינה" description="מוצרים תואמים מאותה משפחת עיצוב או קטגוריה." />
      <ProductRail products={products} />
    </div>
  );
}
