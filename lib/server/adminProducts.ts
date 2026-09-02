import { readJson, writeJson } from "@/lib/server/fileStore";
import { getProductImageOverrides, setProductImages } from "@/lib/server/productImages";
import { genId, slugify } from "@/lib/utils";
import { categories } from "@/lib/data/categories";
import { brands } from "@/lib/data/brands";
import { products as seedProducts } from "@/lib/data/products";
import type { Product } from "@/lib/types";

const FILE = "admin-products.json";
const isSeedId = (id: string) => !id.startsWith("admin-");

export function getAdminProducts(): Product[] {
  return readJson<Product[]>(FILE, []);
}

export function getAdminProductById(id: string): Product | undefined {
  return getAdminProducts().find((p) => p.id === id);
}

export function getAdminProductBySlug(slug: string): Product | undefined {
  return getAdminProducts().find((p) => p.slug === slug);
}

/**
 * Static demo catalog (with any uploaded-image overrides applied) + admin-added
 * products, for use in Server Components/pages. This is what customers see.
 */
export function getAllProducts(): Product[] {
  const imageOverrides = getProductImageOverrides();
  const seedWithImages = seedProducts.map((p) =>
    imageOverrides[p.id] ? { ...p, images: imageOverrides[p.id] } : p,
  );
  return [...seedWithImages, ...getAdminProducts()];
}

/** Any product (seed or admin-added), with image overrides applied — for the admin UI. */
export function getAnyProductById(id: string): Product | undefined {
  return getAllProducts().find((p) => p.id === id);
}

/**
 * Updates only the images of a product, whichever kind it is: for a seed
 * product this writes a lightweight image override (data-store/product-images.json)
 * without touching any of its other fields (dimensions, spec groups, energy
 * rating, etc. all stay exactly as defined in code); for an admin-added
 * product it patches that product's own record directly.
 */
export function updateProductImages(id: string, images: string[]): Product | undefined {
  if (isSeedId(id)) {
    if (!seedProducts.some((p) => p.id === id)) return undefined;
    setProductImages(id, images);
    return getAnyProductById(id);
  }
  const all = getAdminProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return undefined;
  const updated = { ...existing, images };
  writeJson(
    FILE,
    all.map((p) => (p.id === id ? updated : p)),
  );
  return updated;
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
