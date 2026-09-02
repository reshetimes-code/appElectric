import { readJson, writeJson } from "@/lib/server/fileStore";

const FILE = "product-images.json";

/** Per-product image overrides, keyed by product id — used for the 68 seed
 * products (whose other fields live in code, in lib/data/products.ts) so we
 * can attach real photos without touching/regenerating any other field. */
export function getProductImageOverrides(): Record<string, string[]> {
  return readJson<Record<string, string[]>>(FILE, {});
}

export function setProductImages(id: string, images: string[]): void {
  const all = getProductImageOverrides();
  if (images.length === 0) {
    delete all[id];
  } else {
    all[id] = images;
  }
  writeJson(FILE, all);
}
