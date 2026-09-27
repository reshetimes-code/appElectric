import { readJson, writeJson } from "@/lib/server/fileStore";
import { screenSizes as seedScreenSizes } from "@/lib/data/screenSizes";

const FILE = "admin-screen-sizes.json";

/**
 * Screen sizes (inches) added ad-hoc by an admin from the product form, in
 * addition to the fixed list in lib/data/screenSizes.ts — parallel to
 * lib/server/adminBrands.ts.
 */
export async function getAdminScreenSizes(): Promise<number[]> {
  return readJson<number[]>(FILE, []);
}

/** Static + admin-added screen sizes, deduplicated and sorted — what the product form and catalog filter offer. */
export async function getAllScreenSizes(): Promise<number[]> {
  const admin = await getAdminScreenSizes();
  return [...new Set([...seedScreenSizes, ...admin])].sort((a, b) => a - b);
}

export async function createAdminScreenSize(size: number): Promise<number[]> {
  if (!Number.isFinite(size) || size <= 0) throw new Error("גודל מסך לא תקין");

  const all = await getAllScreenSizes();
  if (all.includes(size)) return all;

  const admin = await getAdminScreenSizes();
  await writeJson(FILE, [...admin, size]);
  return getAllScreenSizes();
}
