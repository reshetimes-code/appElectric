import { readJson, writeJson } from "@/lib/server/fileStore";
import { categories as seedCategories } from "@/lib/data/categories";
import { PHOTOS } from "@/lib/images";
import { genId, slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

const FILE = "admin-categories.json";

/**
 * Categories created ad-hoc by an admin from the product form (in addition to
 * the fixed catalog structure in lib/data/categories.ts). Each starts with
 * one default "כללי" subcategory so a product can be filed under it right
 * away — parallel to how lib/server/adminProducts.ts layers admin-added
 * products on top of the seed catalog.
 */
export async function getAdminCategories(): Promise<Category[]> {
  return readJson<Category[]>(FILE, []);
}

/** Static catalog categories + admin-added ones — what customers browse
 * (nav, category pages) and what the product form offers. */
export async function getAllCategories(): Promise<Category[]> {
  return [...seedCategories, ...(await getAdminCategories())];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return (await getAllCategories()).find((c) => c.slug === slug);
}

export async function createAdminCategory(nameHe: string): Promise<Category> {
  const trimmed = nameHe.trim();
  if (!trimmed) throw new Error("שם קטגוריה חסר");

  const all = await getAllCategories();
  const baseSlug = slugify(trimmed) || genId("category");
  let slug = baseSlug;
  let n = 2;
  while (all.some((c) => c.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }

  const id = `admin-cat-${genId()}`;
  const category: Category = {
    id,
    slug,
    nameHe: trimmed,
    departmentId: id,
    image: PHOTOS.kitchenBright,
    filterKind: "generic",
    subcategories: [{ id: `${id}-general`, slug: "general", nameHe: "כללי" }],
  };

  const adminCategories = await getAdminCategories();
  await writeJson(FILE, [...adminCategories, category]);
  return category;
}
