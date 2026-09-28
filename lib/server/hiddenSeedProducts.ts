import { readJson, writeJson } from "@/lib/server/fileStore";

const FILE = "hidden-seed-products.json";

/**
 * Seed products (lib/data/products.ts) can't be deleted — they live in code,
 * not a data store — so "deleting" one from the admin instead hides it here,
 * the same pattern lib/server/adminCategories.ts uses for stray categories.
 */
export async function getHiddenSeedProductIds(): Promise<string[]> {
  return readJson<string[]>(FILE, []);
}

export async function hideSeedProduct(id: string): Promise<void> {
  const all = await getHiddenSeedProductIds();
  if (!all.includes(id)) await writeJson(FILE, [...all, id]);
}
