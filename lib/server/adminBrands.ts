import { readJson, writeJson } from "@/lib/server/fileStore";
import { brands as seedBrands } from "@/lib/data/brands";
import { PHOTOS } from "@/lib/images";
import { slugify } from "@/lib/utils";
import type { Brand } from "@/lib/types";

const FILE = "admin-brands.json";

/**
 * Brands created ad-hoc by an admin from the product form, in addition to
 * the fixed catalog in lib/data/brands.ts — parallel to
 * lib/server/adminCategories.ts. `id` is set equal to `slug` (as every seed
 * brand already does) so the existing synchronous `getBrandBySlug` lookups
 * elsewhere keep matching on `product.brandId` without every call site
 * needing to switch to this async list.
 */
export async function getAdminBrands(): Promise<Brand[]> {
  return readJson<Brand[]>(FILE, []);
}

/** Static catalog brands + admin-added ones — what the product form offers. */
export async function getAllBrands(): Promise<Brand[]> {
  return [...seedBrands, ...(await getAdminBrands())];
}

export async function createAdminBrand(nameHe: string): Promise<Brand> {
  const trimmed = nameHe.trim();
  if (!trimmed) throw new Error("שם מותג חסר");

  const all = await getAllBrands();
  const baseSlug = slugify(trimmed) || `brand-${Date.now().toString(36)}`;
  let slug = baseSlug;
  let n = 2;
  while (all.some((b) => b.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }

  const brand: Brand = {
    id: slug,
    slug,
    nameHe: trimmed,
    logo: "",
    description: "",
    heroImage: PHOTOS.kitchenBright,
    premium: false,
  };

  const adminBrands = await getAdminBrands();
  await writeJson(FILE, [...adminBrands, brand]);
  return brand;
}
