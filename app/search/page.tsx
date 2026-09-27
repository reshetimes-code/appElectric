import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getProducts, parseFilters, getFacetCounts } from "@/lib/repo/products";
import { getAllProducts } from "@/lib/server/adminProducts";
import { getAllCategories } from "@/lib/server/adminCategories";
import { getAllBrands } from "@/lib/server/adminBrands";
import { getAllScreenSizes } from "@/lib/server/adminScreenSizes";

export const metadata: Metadata = { title: "תוצאות חיפוש" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const filters = parseFilters(sp);
  const [allProducts, allCategories, brands, screenSizes] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getAllBrands(),
    getAllScreenSizes(),
  ]);
  const products = getProducts(filters, allProducts, allCategories);
  const facetCounts = getFacetCounts(allProducts, filters, allCategories);
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "";

  const buildPageHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  return (
    <CatalogPage
      title={q ? `תוצאות חיפוש עבור "${q}"` : "חיפוש מוצרים"}
      description={!q ? "הקלידו מונח חיפוש בשורת החיפוש למעלה." : undefined}
      breadcrumb={[{ label: "חיפוש" }]}
      products={products}
      brands={brands}
      screenSizes={screenSizes}
      facetCounts={facetCounts}
      page={page}
      buildPageHref={buildPageHref}
    />
  );
}
