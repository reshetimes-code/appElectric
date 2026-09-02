"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { products as staticProducts } from "@/lib/data/products";
import type { Product } from "@/lib/types";

interface CatalogContextValue {
  allProducts: Product[];
  hydrated: boolean;
  getProductsByIds: (ids: string[]) => Product[];
  getProductBySlug: (slug: string) => Product | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

/**
 * Merges the static demo catalog with admin-added products (fetched once from
 * the public /api/products endpoint) so client-only flows — cart, favorites,
 * compare — which only ever store product IDs in localStorage, can resolve an
 * admin-added product just like a seed one.
 */
export function CatalogProvider({ children }: { children: ReactNode }) {
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAdminProducts(data.products ?? []);
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

  const value: CatalogContextValue = {
    allProducts,
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
