import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId, slugify } from "@/lib/utils";
import { categories } from "@/lib/data/categories";
import { brands } from "@/lib/data/brands";
import { products as seedProducts } from "@/lib/data/products";
import type { Product } from "@/lib/types";

const FILE = "admin-products.json";

export function getAdminProducts(): Product[] {
  return readJson<Product[]>(FILE, []);
}

export function getAdminProductById(id: string): Product | undefined {
  return getAdminProducts().find((p) => p.id === id);
}

export function getAdminProductBySlug(slug: string): Product | undefined {
  return getAdminProducts().find((p) => p.slug === slug);
}

/** Static demo catalog + admin-added products, for use in Server Components/pages. */
export function getAllProducts(): Product[] {
  return [...seedProducts, ...getAdminProducts()];
}

export interface AdminProductInput {
  nameHe: string;
  sku: string;
  model: string;
  shortDescriptionHe: string;
  descriptionHe?: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  compareAtPrice?: number;
  images: string[]; // uploaded file URLs, e.g. /uploads/products/xxx.jpg
  stockQuantity: number;
  availabilityStatus: Product["availabilityStatus"];
  warrantyText?: string;
}

function buildFromInput(id: string, slug: string, input: AdminProductInput, createdAt: string): Product {
  const category = categories.find((c) => c.id === input.categoryId);
  return {
    id,
    slug,
    sku: input.sku,
    model: input.model,
    nameHe: input.nameHe,
    shortDescriptionHe: input.shortDescriptionHe,
    descriptionHe: input.descriptionHe || input.shortDescriptionHe,
    brandId: input.brandId,
    categoryId: input.categoryId,
    subcategoryId: input.subcategoryId,
    departmentId: category?.departmentId ?? input.categoryId,
    price: input.price,
    compareAtPrice: input.compareAtPrice,
    currency: "ILS",
    installmentsMonths: input.price >= 4000 ? 12 : input.price >= 1500 ? 6 : undefined,
    images: input.images,
    artKind: "fridge", // unused when images[] is populated — see ProductCard/Gallery fallback order
    dimensions: {},
    specGroups: [],
    featureIds: [],
    warrantyText: input.warrantyText || "אחריות יצרן לשנתיים.",
    stockQuantity: input.stockQuantity,
    manageStock: true,
    availabilityStatus: input.availabilityStatus,
    premium: false,
    featured: false,
    active: true,
    reviews: [],
    createdAt,
  };
}

export function createAdminProduct(input: AdminProductInput): Product {
  const all = getAdminProducts();
  const id = `admin-${genId()}`;
  const slug = slugify(`${input.nameHe}-${input.sku}`) || id;
  const product = buildFromInput(id, slug, input, new Date().toISOString());
  writeJson(FILE, [...all, product]);
  return product;
}

export function updateAdminProduct(id: string, input: AdminProductInput): Product | undefined {
  const all = getAdminProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return undefined;
  const updated = buildFromInput(id, existing.slug, input, existing.createdAt);
  writeJson(
    FILE,
    all.map((p) => (p.id === id ? updated : p)),
  );
  return updated;
}

export function deleteAdminProduct(id: string): boolean {
  const all = getAdminProducts();
  const next = all.filter((p) => p.id !== id);
  const changed = next.length !== all.length;
  if (changed) writeJson(FILE, next);
  return changed;
}

export function listBrandsAndCategoriesForForm() {
  return {
    brands: brands.map((b) => ({ id: b.id, nameHe: b.nameHe })),
    categories: categories.map((c) => ({
      id: c.id,
      nameHe: c.nameHe,
      subcategories: c.subcategories.map((s) => ({ id: s.id, nameHe: s.nameHe })),
    })),
  };
}
