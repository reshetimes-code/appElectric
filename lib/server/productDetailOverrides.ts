import { readJson, writeJson } from "@/lib/server/fileStore";
import type { Product } from "@/lib/types";

const FILE = "product-detail-overrides.json";

/** Everything about a seed product that's safe to let an admin edit, short of
 * its images (which have their own dedicated override — see productImages.ts)
 * and the structural fields that live only in code (dimensions, spec groups,
 * feature ids, reviews...). */
export interface ProductDetailOverride {
  nameHe: string;
  model: string;
  shortDescriptionHe: string;
  descriptionHe?: string;
  brandId: string;
  categoryId: string;
  subcategoryId: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  availabilityStatus: Product["availabilityStatus"];
  warrantyText?: string;
  screenSizeInch?: number;
}

/** Per-product detail overrides, keyed by product id — used for the 68 seed
 * products (whose baseline fields live in code, in lib/data/products.ts) so
 * an admin can correct/update them without touching the code. */
export async function getProductDetailOverrides(): Promise<Record<string, ProductDetailOverride>> {
  return readJson<Record<string, ProductDetailOverride>>(FILE, {});
}

export async function setProductDetails(id: string, override: ProductDetailOverride): Promise<void> {
  const all = await getProductDetailOverrides();
  all[id] = override;
  await writeJson(FILE, all);
}
