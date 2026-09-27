import { readJson, writeJson } from "@/lib/server/fileStore";
import { getProductImageOverrides, setProductImages } from "@/lib/server/productImages";
import {
  getProductDetailOverrides,
  setProductDetails,
  type ProductDetailOverride,
} from "@/lib/server/productDetailOverrides";
import { genId, slugify } from "@/lib/utils";
import { getAllCategories } from "@/lib/server/adminCategories";
import { getAllBrands } from "@/lib/server/adminBrands";
import { getAllScreenSizes } from "@/lib/server/adminScreenSizes";
import { products as seedProducts } from "@/lib/data/products";
import type { Product } from "@/lib/types";

const FILE = "admin-products.json";
const isSeedId = (id: string) => !id.startsWith("admin-");

export async function getAdminProducts(): Promise<Product[]> {
  return readJson<Product[]>(FILE, []);
}

export async function getAdminProductById(id: string): Promise<Product | undefined> {
  return (await getAdminProducts()).find((p) => p.id === id);
}

export async function getAdminProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getAdminProducts()).find((p) => p.slug === slug);
}

/**
 * Static demo catalog (with any uploaded-image overrides applied) + admin-added
 * products, for use in Server Components/pages. This is what customers see.
 */
export async function getAllProducts(): Promise<Product[]> {
  const [imageOverrides, detailOverrides] = await Promise.all([
    getProductImageOverrides(),
    getProductDetailOverrides(),
  ]);
  const seedWithOverrides = await Promise.all(
    seedProducts.map(async (p) => {
      const withDetails = detailOverrides[p.id] ? await applyDetailOverride(p, detailOverrides[p.id]) : p;
      return imageOverrides[p.id] ? { ...withDetails, images: imageOverrides[p.id] } : withDetails;
    }),
  );
  return [...seedWithOverrides, ...(await getAdminProducts())];
}

/** Any product (seed or admin-added), with image overrides applied — for the admin UI. */
export async function getAnyProductById(id: string): Promise<Product | undefined> {
  return (await getAllProducts()).find((p) => p.id === id);
}

/**
 * Updates only the images of a product, whichever kind it is: for a seed
 * product this writes a lightweight image override (data-store/product-images.json)
 * without touching any of its other fields (dimensions, spec groups, energy
 * rating, etc. all stay exactly as defined in code); for an admin-added
 * product it patches that product's own record directly.
 */
export async function updateProductImages(id: string, images: string[]): Promise<Product | undefined> {
  if (isSeedId(id)) {
    if (!seedProducts.some((p) => p.id === id)) return undefined;
    await setProductImages(id, images);
    return getAnyProductById(id);
  }
  const all = await getAdminProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return undefined;
  const updated = { ...existing, images };
  await writeJson(
    FILE,
    all.map((p) => (p.id === id ? updated : p)),
  );
  return updated;
}

export interface AdminProductInput {
  nameHe: string;
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
  screenSizeInch?: number;
}

async function buildFromInput(
  id: string,
  slug: string,
  input: AdminProductInput,
  createdAt: string,
  sku: string,
): Promise<Product> {
  const category = (await getAllCategories()).find((c) => c.id === input.categoryId);
  return {
    id,
    slug,
    sku,
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
    screenSizeInch: input.screenSizeInch,
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

/** Applies an editable-fields patch (see ProductDetailOverride) on top of a
 * seed product — everything structural that only lives in code (dimensions,
 * spec groups, feature ids, reviews, images...) stays exactly as defined. */
async function applyDetailOverride(product: Product, override: ProductDetailOverride): Promise<Product> {
  const category = (await getAllCategories()).find((c) => c.id === override.categoryId);
  return {
    ...product,
    nameHe: override.nameHe,
    model: override.model,
    shortDescriptionHe: override.shortDescriptionHe,
    descriptionHe: override.descriptionHe || override.shortDescriptionHe,
    brandId: override.brandId,
    categoryId: override.categoryId,
    subcategoryId: override.subcategoryId,
    departmentId: category?.departmentId ?? product.departmentId,
    price: override.price,
    compareAtPrice: override.compareAtPrice,
    installmentsMonths: override.price >= 4000 ? 12 : override.price >= 1500 ? 6 : undefined,
    warrantyText: override.warrantyText || product.warrantyText,
    screenSizeInch: override.screenSizeInch,
    stockQuantity: override.stockQuantity,
    availabilityStatus: override.availabilityStatus,
  };
}

/**
 * Updates the editable details (name, price, category, stock...) of a
 * product, whichever kind it is: for a seed product this writes a detail
 * override (parallel to the images override) without touching the
 * code-defined structural fields; for an admin-added product it patches that
 * product's own record directly, keeping its existing images.
 */
export async function updateProductDetails(id: string, input: ProductDetailOverride): Promise<Product | undefined> {
  if (isSeedId(id)) {
    if (!seedProducts.some((p) => p.id === id)) return undefined;
    await setProductDetails(id, input);
    return getAnyProductById(id);
  }
  const all = await getAdminProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return undefined;
  const updated = await buildFromInput(
    id,
    existing.slug,
    { ...input, images: existing.images },
    existing.createdAt,
    existing.sku,
  );
  await writeJson(
    FILE,
    all.map((p) => (p.id === id ? updated : p)),
  );
  return updated;
}

export async function createAdminProduct(input: AdminProductInput): Promise<Product> {
  const all = await getAdminProducts();
  const id = `admin-${genId()}`;
  const existingSlugs = new Set([...seedProducts, ...all].map((p) => p.slug));
  const baseSlug = slugify(input.nameHe) || id;
  let slug = baseSlug;
  let n = 2;
  while (existingSlugs.has(slug)) slug = `${baseSlug}-${n++}`;
  // SKU is no longer collected from the admin — it was only ever used
  // internally for the slug/search/SEO, so it's derived from the id instead.
  const sku = id.toUpperCase();
  const product = await buildFromInput(id, slug, input, new Date().toISOString(), sku);
  await writeJson(FILE, [...all, product]);
  return product;
}

export async function updateAdminProduct(id: string, input: AdminProductInput): Promise<Product | undefined> {
  const all = await getAdminProducts();
  const existing = all.find((p) => p.id === id);
  if (!existing) return undefined;
  const updated = await buildFromInput(id, existing.slug, input, existing.createdAt, existing.sku);
  await writeJson(
    FILE,
    all.map((p) => (p.id === id ? updated : p)),
  );
  return updated;
}

export async function deleteAdminProduct(id: string): Promise<boolean> {
  const all = await getAdminProducts();
  const next = all.filter((p) => p.id !== id);
  const changed = next.length !== all.length;
  if (changed) await writeJson(FILE, next);
  return changed;
}

export async function listBrandsAndCategoriesForForm() {
  const [brands, categories, screenSizes] = await Promise.all([getAllBrands(), getAllCategories(), getAllScreenSizes()]);
  return {
    brands: brands.map((b) => ({ id: b.id, nameHe: b.nameHe })),
    categories: categories.map((c) => ({
      id: c.id,
      nameHe: c.nameHe,
      subcategories: c.subcategories.map((s) => ({ id: s.id, nameHe: s.nameHe })),
    })),
    screenSizes,
  };
}
