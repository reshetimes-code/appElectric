import { cache } from "react";
import { readJson, writeJson } from "@/lib/server/fileStore";
import type { SiteContentData } from "@/lib/siteContent";

const FILE = "site-content.json";

/** Per-request cached: several home-page sections each ask for it. */
export const getSiteContent = cache(async (): Promise<SiteContentData> => {
  const data = await readJson<Partial<SiteContentData>>(FILE, {});
  return { images: data.images ?? {}, texts: data.texts ?? {} };
});

/** Merges a patch into the store. A null/empty value removes the override (back to the default). */
export async function updateSiteContent(patch: {
  images?: Record<string, string | null>;
  texts?: Record<string, string | null>;
}): Promise<SiteContentData> {
  const current = await getSiteContent();
  const next: SiteContentData = { images: { ...current.images }, texts: { ...current.texts } };
  for (const [key, value] of Object.entries(patch.images ?? {})) {
    if (value) next.images[key] = value;
    else delete next.images[key];
  }
  for (const [key, value] of Object.entries(patch.texts ?? {})) {
    if (value && value.trim()) next.texts[key] = value;
    else delete next.texts[key];
  }
  await writeJson(FILE, next);
  return next;
}
