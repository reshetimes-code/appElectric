import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { brands } from "@/lib/data/brands";
import type { Product } from "@/lib/types";

export interface ProductFilters {
  category?: string; // category slug
  subcategory?: string; // subcategory slug
  brand?: string[]; // brand slugs
  priceMin?: number;
  priceMax?: number;
  availability?: string[];
  energyRating?: string[];
  premium?: boolean;
  personalImport?: boolean;
  deals?: boolean;
  widthMin?: number;
  widthMax?: number;
  q?: string;
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
}

function brandSlug(brandId: string) {
  return brands.find((b) => b.id === brandId)?.slug ?? brandId;
}

function categorySlug(categoryId: string) {
  return categories.find((c) => c.id === categoryId)?.slug ?? categoryId;
}

export function matchesFilters(product: Product, filters: ProductFilters): boolean {
  if (!product.active) return false;
  if (filters.category && categorySlug(product.categoryId) !== filters.category) return false;
  if (filters.subcategory && product.subcategoryId !== filters.subcategory) {
    // subcategory ids are stable slugs used directly (see categories.ts subcategory.id)
    const category = categories.find((c) => c.id === product.categoryId);
    const sub = category?.subcategories.find((s) => s.slug === filters.subcategory);
    if (!sub || sub.id !== product.subcategoryId) return false;
  }
  if (filters.brand?.length && !filters.brand.includes(brandSlug(product.brandId))) return false;
  if (filters.priceMin != null && product.price < filters.priceMin) return false;
  if (filters.priceMax != null && product.price > filters.priceMax) return false;
  if (filters.availability?.length && !filters.availability.includes(product.availabilityStatus)) return false;
  if (filters.energyRating?.length && (!product.energyRating || !filters.energyRating.includes(product.energyRating)))
    return false;
  if (filters.premium && !product.premium) return false;
  if (filters.personalImport && product.availabilityStatus !== "personal-import") return false;
  if (filters.deals && !product.compareAtPrice) return false;
  if (filters.widthMin != null && (!product.dimensions.widthMm || product.dimensions.widthMm < filters.widthMin))
    return false;
  if (filters.widthMax != null && (!product.dimensions.widthMm || product.dimensions.widthMm > filters.widthMax))
    return false;
  if (filters.q) {
    const q = filters.q.trim().toLowerCase();
    const haystack = `${product.nameHe} ${product.model} ${product.sku} ${product.shortDescriptionHe}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

export function sortProducts(list: Product[], sort: ProductFilters["sort"]) {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "newest":
      return copy.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    default:
      return copy.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

type SearchParamsLike = { [key: string]: string | string[] | undefined };

/** Parses the URL search params (as received by a Server Component page) into ProductFilters. */
export function parseFilters(sp: SearchParamsLike): ProductFilters {
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const list = (v: string | string[] | undefined) => {
    const value = str(v);
    return value ? value.split(",").filter(Boolean) : undefined;
  };
  const num = (v: string | string[] | undefined) => {
    const value = str(v);
    return value ? Number(value) : undefined;
  };
  return {
    subcategory: str(sp.subcategory),
    brand: list(sp.brand),
    priceMin: num(sp.priceMin),
    priceMax: num(sp.priceMax),
    availability: list(sp.availability),
    energyRating: list(sp.energyRating),
    premium: str(sp.premium) === "1",
    personalImport: str(sp.personalImport) === "1",
    deals: str(sp.deals) === "1",
    widthMin: num(sp.widthMin),
    widthMax: num(sp.widthMax),
    q: str(sp.q),
    sort: (str(sp.sort) as ProductFilters["sort"]) ?? "relevance",
  };
}

// Every lookup below accepts an optional `list` override (defaulting to the
// static demo catalog) so Server Components can pass in the static catalog
// merged with admin-added products (see lib/server/adminProducts.ts) without
// this file — which is also imported by client components — ever touching fs.

export function getProducts(filters: ProductFilters = {}, list: Product[] = products): Product[] {
  const filtered = list.filter((p) => matchesFilters(p, filters));
  return sortProducts(filtered, filters.sort);
}

export function getFeaturedProducts(limit = 8, list: Product[] = products) {
  return list.filter((p) => p.featured && p.active).slice(0, limit);
}

export function getPriceBounds(list: Product[] = products) {
  const prices = list.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function searchProducts(query: string, limit = 8, list: Product[] = products) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return list
    .filter((p) => p.active && `${p.nameHe} ${p.model} ${p.sku} ${p.shortDescriptionHe}`.toLowerCase().includes(q))
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4, list: Product[] = products) {
  const explicit = product.relatedProductIds ?? [];
  const explicitProducts = explicit.map((id) => list.find((p) => p.id === id)).filter(Boolean) as Product[];
  if (explicitProducts.length >= limit) return explicitProducts.slice(0, limit);
  const sameCategory = list.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId && p.active,
  );
  const merged = [...explicitProducts];
  for (const p of sameCategory) {
    if (merged.length >= limit) break;
    if (!merged.find((m) => m.id === p.id)) merged.push(p);
  }
  return merged.slice(0, limit);
}

export interface NicheQuery {
  widthMm: number;
  heightMm?: number;
  depthMm?: number;
  categorySlug?: string;
  toleranceMm?: number;
}

/** Matches products whose *installation niche* dimensions fit the entered opening. */
export function findByNiche(query: NicheQuery, list: Product[] = products): Product[] {
  const tolerance = query.toleranceMm ?? 10;
  return list.filter((p) => {
    if (!p.active) return false;
    if (query.categorySlug && categorySlug(p.categoryId) !== query.categorySlug) return false;
    const niche = p.nicheDimensions ?? p.dimensions;
    if (!niche.widthMm) return false;
    const fitsWidth = niche.widthMm <= query.widthMm + tolerance;
    const fitsHeight = !query.heightMm || !niche.heightMm || niche.heightMm <= query.heightMm + tolerance;
    const fitsDepth = !query.depthMm || !niche.depthMm || niche.depthMm <= query.depthMm + tolerance;
    return fitsWidth && fitsHeight && fitsDepth;
  });
}
