"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products as staticProducts } from "@/lib/data/products";
import { categories as staticCategories } from "@/lib/data/categories";
import type { Category, Product } from "@/lib/types";

interface CatalogContextValue {
  allProducts: Product[];
  categories: Category[];
  hydrated: boolean;
  getProductsByIds: (ids: string[]) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * Merges the static demo catalog with admin-added products/categories (fetched
 * once from the public /api/products and /api/categories endpoints) so
 * client-only flows — cart/favorites/compare, and the storefront nav — can
 * resolve/display an admin-added product or category just like a seed one.
 *
 * The root layout fetches the same admin data server-side and passes it as
 * `initialProducts`/`initialCategories`, so the nav/department cards render
 * with the full catalog on first paint instead of only the static seed
 * catalog for a beat — which used to show as a visible pop-in on every
 * refresh once real admin categories existed. The client-side fetch below
 * still runs so the data stays live if an admin changes something mid-visit.
 */
export function CatalogProvider({
  children,
  initialProducts = [],
  initialCategories = [],
}: {
  children: ReactNode;
  initialProducts?: Product[];
  initialCategories?: Category[];
}) {
  const [adminProducts, setAdminProducts] = useState<Product[]>(initialProducts);
  const [adminCategories, setAdminCategories] = useState<Category[]>(initialCategories);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/categories").then((res) => res.json()),
    ])
      .then(([productsData, categoriesData]) => {
        if (cancelled) return;
        setAdminProducts(productsData.products ?? []);
        setAdminCategories(categoriesData.categories ?? []);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allProducts = [...staticProducts, ...adminProducts];
  const categories = [...staticCategories, ...adminCategories];

  const value: CatalogContextValue = {
    allProducts,
    categories,
    hydrated,
    getProductsByIds: (ids) => ids.map((id) => allProducts.find((p) => p.id === id)).filter((p): p is Product => Boolean(p)),
    getProductBySlug: (slug) => allProducts.find((p) => p.slug === slug),
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider");
  return ctx;
}
