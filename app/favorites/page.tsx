"use client";

import { Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { useCatalog } from "@/lib/context/CatalogContext";

export default function FavoritesPage() {
  const favorites = useFavorites();
  const { getProductsByIds } = useCatalog();
  const products = getProductsByIds(favorites.ids);

  if (!favorites.hydrated) return null;

  return (
    <Container className="flex flex-col gap-6 py-8 sm:py-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">מועדפים</h1>
        <p className="mt-2 text-sm text-charcoal-500">המוצרים שסימנתם נשמרים בדפדפן זה.</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-sand-300 py-20 text-center">
          <Heart size={32} className="text-charcoal-300" />
          <p className="font-heading text-lg font-semibold text-charcoal-800">רשימת המועדפים שלכם ריקה</p>
          <p className="text-sm text-charcoal-500">לחצו על סמל הלב בכרטיס מוצר כדי לשמור אותו כאן.</p>
          <Button href="/shop" className="mt-2">מעבר לחנות</Button>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </Container>
  );
}
