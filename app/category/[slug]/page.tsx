import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogPage } from "@/components/catalog/CatalogPage";
import { getCategoryBySlug, categories } from "@/lib/data/categories";
import { getProducts, parseFilters } from "@/lib/repo/products";
import { getAllProducts } from "@/lib/server/adminProducts";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  return {
    title: category.nameHe,
    description: `${category.nameHe} — מכשירי חשמל פרימיום ממיטב המותגים, ב-AppElectric.`,
  };
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const filters = { ...parseFilters(sp), category: slug };
  const products = getProducts(filters, getAllProducts());
  const page = sp.page ? Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) : 1;

  const buildPageHref = (p: number) => {
    const params2 = new URLSearchParams();
    for (const [key, value] of Object.entries(sp)) {
      if (key === "page" || value == null) continue;
      params2.set(key, Array.isArray(value) ? value.join(",") : value);
    }
    if (p > 1) params2.set("page", String(p));
    const qs = params2.toString();
    return qs ? `/category/${slug}?${qs}` : `/category/${slug}`;
  };

  return (
    <CatalogPage
      title={category.nameHe}
      description={`מבחר ${category.nameHe} ממיטב המותגים העולמיים, עם אפשרות ייבוא אישי לדגמים נבחרים.`}
      breadcrumb={[{ label: category.nameHe }]}
      products={products}
      category={category}
      page={page}
      buildPageHref={buildPageHref}
    />
  );
}
