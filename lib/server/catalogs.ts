import { readJson, writeJson } from "@/lib/server/fileStore";

const FILE = "catalogs.json";

export interface Catalog {
  id: string;
  /** The text line shown above the PDF on the public page. */
  title: string;
  url: string;
  /** Optional cover image (uploaded to the uploads bucket) shown on the public page. */
  coverUrl?: string;
  createdAt: string;
}

export async function getCatalogs(): Promise<Catalog[]> {
  const all = await readJson<Catalog[]>(FILE, []);
  return [...all].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function addCatalog(catalog: Catalog): Promise<void> {
  const all = await readJson<Catalog[]>(FILE, []);
  await writeJson(FILE, [...all, catalog]);
}

export async function deleteCatalog(id: string): Promise<boolean> {
  const all = await readJson<Catalog[]>(FILE, []);
  const next = all.filter((c) => c.id !== id);
  if (next.length === all.length) return false;
  await writeJson(FILE, next);
  return true;
}
