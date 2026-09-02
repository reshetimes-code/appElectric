import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getProducts, parseFilters } from "@/lib/repo/products";
import { getAllProducts } from "@/lib/server/adminProducts";

export const metadata: Metadata = {
  title: "כל המוצרים",
  description: "עיינו במלוא קטלוג מכשירי החשמל והמטבח הפרימיום של AppElectric.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const products = getProducts(filters, getAllProducts());
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key === "page" || value == null) continue;
      params.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/shop?${qs}` : "/shop";
  };

  return (
    <CatalogPage
      title={filters.premium ? "קולקציית הפרימיום" : "כל המוצרים"}
      description="קירור, בישול, כביסה, מדיחים ומולטימדיה — כל המחלקות במקום אחד."
      breadcrumb={[{ label: "כל המוצרים" }]}
      products={products}
      page={page}
      buildPageHref={buildPageHref}
    />
  );
}
