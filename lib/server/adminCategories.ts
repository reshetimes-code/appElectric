import { readJson, writeJson } from "@/lib/server/fileStore";
import { categories as seedCategories } from "@/lib/data/categories";
import { getAdminSubcategories } from "@/lib/server/adminSubcategories";
import { PHOTOS } from "@/lib/images";
import { genId, slugify } from "@/lib/utils";
import type { Category } from "@/lib/types";

const FILE = "admin-categories.json";

// Stray/duplicate categories created while testing the "add category" flow from
// the product form (e.g. a category that already exists as a subcategory under
// a fixed department). Hidden here rather than deleted from the store so no
// admin-entered data is lost, and any product already filed under them keeps working.
const HIDDEN_ADMIN_CATEGORY_IDS = new Set([
  "admin-cat-id-mtvi66vq-46520t276p4n1v2v3f0m5x49", // קטגוריית בדיקה חיה
  "admin-cat-id-mtvim7bk-373l1v623q1f4d3p2f1k350f", // טלוויזיה (already a subcategory of multimedia)
  "admin-cat-id-mufcq3r0-16056a1u2a3z434b47343x16", // כיריים אינדוקציה (already a subcategory of cooking)
]);

/**
 * Categories created ad-hoc by an admin from the product form (in addition to
 * the fixed catalog structure in lib/data/categories.ts). Each starts with
 * one default "כללי" subcategory so a product can be filed under it right
 * away — parallel to how lib/server/adminProducts.ts layers admin-added
 * products on top of the seed catalog.
 */
export async function getAdminCategories(): Promise<Category[]> {
  const all = await readJson<Category[]>(FILE, []);
  return all.filter((c) => !HIDDEN_ADMIN_CATEGORY_IDS.has(c.id));
}

/** Static catalog categories + admin-added ones, each with any admin-added
 * subcategories merged in — what customers browse (nav, category pages) and
 * what the product form offers. */
export async function getAllCategories(): Promise<Category[]> {
  const [adminCategories, adminSubcategories] = await Promise.all([getAdminCategories(), getAdminSubcategories()]);
  return [...seedCategories, ...adminCategories].map((c) =>
    adminSubcategories[c.id]?.length
      ? { ...c, subcategories: [...c.subcategories, ...adminSubcategories[c.id]] }
      : c,
  );
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
