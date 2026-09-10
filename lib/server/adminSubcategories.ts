import { readJson, writeJson } from "@/lib/server/fileStore";
import type { Subcategory } from "@/lib/types";

const FILE = "admin-subcategories.json";

/**
 * Subcategories created ad-hoc by an admin from the product form, layered on
 * top of an existing category (seed or admin-added) — parallel to how
 * lib/server/adminCategories.ts layers whole admin categories on top of the
 * fixed catalog. Keyed by parent category id; merged into
 * `adminCategories.getAllCategories()`.
 *
 * This module intentionally does not import adminCategories.ts (which
 * imports this one to do that merge) — callers that need to validate a
 * categoryId or dedupe slugs against the live category list should load it
 * via getAllCategories() themselves (see app/api/admin/subcategories/route.ts).
 */
export async function getAdminSubcategories(): Promise<Record<string, Subcategory[]>> {
  return readJson<Record<string, Subcategory[]>>(FILE, {});
}

export async function addAdminSubcategory(categoryId: string, subcategory: Subcategory): Promise<void> {
  const all = await getAdminSubcategories();
  const forCategory = all[categoryId] ?? [];
  await writeJson(FILE, { ...all, [categoryId]: [...forCategory, subcategory] });
}
