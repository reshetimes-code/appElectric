import type { MetadataRoute } from "next";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { brands } from "@/lib/data/brands";
import { getActiveBundles } from "@/lib/server/adminBundles";

const BASE_URL = "https://appelectric.co.il";

// Metadata routes like this aren't children of the root layout, so its
// app-wide force-dynamic doesn't cover this file — without repeating it
// here, Next tries to prerender the sitemap at build time, which fails with
// no Firestore credentials available in the build environment (see the
// force-dynamic comment in app/layout.tsx for the same underlying reason).
export const dynamic = "force-dynamic";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/bundles",
  "/personal-import",
  "/vip",
  "/trade-in",
  "/tools/energy-calculator",
  "/tools/niche-finder",
  "/compare",
  "/favorites",
  "/about",
  "/contact",
  "/faq",
  "/shipping-installation",
  "/warranty-returns",
  "/terms",
  "/privacy",
  "/accessibility",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bundles = await getActiveBundles();

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.6,
  }));

  for (const c of categories) entries.push({ url: `${BASE_URL}/category/${c.slug}`, changeFrequency: "weekly", priority: 0.8 });
  for (const b of brands) entries.push({ url: `${BASE_URL}/brand/${b.slug}`, changeFrequency: "weekly", priority: 0.6 });
  for (const bundle of bundles) entries.push({ url: `${BASE_URL}/bundles/${bundle.slug}`, changeFrequency: "weekly", priority: 0.6 });
  for (const p of products) entries.push({ url: `${BASE_URL}/product/${p.slug}`, changeFrequency: "weekly", priority: 0.7 });

  return entries;
}
