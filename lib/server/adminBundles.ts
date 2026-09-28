import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId, slugify } from "@/lib/utils";
import type { Bundle, BundleItem, Product } from "@/lib/types";

const FILE = "bundles.json";

export async function getBundles(): Promise<Bundle[]> {
  return (await readJson<Bundle[]>(FILE, [])).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getActiveBundles(): Promise<Bundle[]> {
  return (await getBundles()).filter((b) => b.active);
}

export async function getBundleById(id: string): Promise<Bundle | undefined> {
  return (await getBundles()).find((b) => b.id === id);
}

export async function getBundleBySlug(slug: string): Promise<Bundle | undefined> {
  return (await getBundles()).find((b) => b.slug === slug);
}

export interface BundleInput {
  nameHe: string;
  description?: string;
  items: BundleItem[];
  active: boolean;
}

export async function createBundle(input: BundleInput): Promise<Bundle> {
  const all = await readJson<Bundle[]>(FILE, []);
  const id = genId("bundle");
  const existingSlugs = new Set(all.map((b) => b.slug));
  const baseSlug = slugify(input.nameHe) || id;
  let slug = baseSlug;
  let n = 2;
  while (existingSlugs.has(slug)) slug = `${baseSlug}-${n++}`;
  const bundle: Bundle = { id, slug, ...input, createdAt: new Date().toISOString() };
  await writeJson(FILE, [...all, bundle]);
  return bundle;
}

export async function updateBundle(id: string, input: BundleInput): Promise<Bundle | undefined> {
  const all = await readJson<Bundle[]>(FILE, []);
  const existing = all.find((b) => b.id === id);
  if (!existing) return undefined;
  const updated: Bundle = { ...existing, ...input };
  await writeJson(
    FILE,
    all.map((b) => (b.id === id ? updated : b)),
  );
  return updated;
}

export interface ResolvedBundleItem {
  product: Product;
  price: number; // admin-set price for this product within the bundle
}

/** Resolves a bundle's item ids against the current catalog and computes the
 * price comparison shown on bundle cards/pages — pass a pre-built product
 * map (from getAllProducts()) so listing several bundles doesn't re-fetch
 * the catalog per bundle. Items whose product was since deleted are skipped. */
export function resolveBundleItems(bundle: Bundle, productMap: Map<string, Product>) {
  const items: ResolvedBundleItem[] = bundle.items
    .map((it) => {
      const product = productMap.get(it.productId);
      return product ? { product, price: it.price } : undefined;
    })
    .filter((it): it is ResolvedBundleItem => !!it);
  const combined = items.reduce((sum, it) => sum + it.product.price, 0);
  const total = items.reduce((sum, it) => sum + it.price, 0);
  const savings = Math.max(0, combined - total);
  return { items, combined, total, savings };
}

export async function deleteBundle(id: string): Promise<boolean> {
  const all = await readJson<Bundle[]>(FILE, []);
  const next = all.filter((b) => b.id !== id);
  const changed = next.length !== all.length;
  if (changed) await writeJson(FILE, next);
  return changed;
}
