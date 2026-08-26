import type { MetadataRoute } from "next";
import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { brands } from "@/lib/data/brands";
import { bundles } from "@/lib/data/bundles";

const BASE_URL = "https://appelectric.example";

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

export default function sitemap(): MetadataRoute.Sitemap {
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
