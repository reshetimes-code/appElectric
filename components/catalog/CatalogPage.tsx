import { Container } from "@/components/ui/Container";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { FilterSheet } from "@/components/catalog/FilterSheet";
import { SortSelect } from "@/components/catalog/SortSelect";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Pagination } from "@/components/catalog/Pagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { Category, Product } from "@/lib/types";

const PAGE_SIZE = 12;

export function CatalogPage({
  title,
  description,
  breadcrumb,
  products,
  category,
  page,
  buildPageHref,
}: {
  title: string;
  description?: string;
  breadcrumb: { label: string; href?: string }[];
  products: Product[];
  category?: Category;
  page: number;
  buildPageHref: (page: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const pageItems = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="py-8 sm:py-10">
      <Container className="flex flex-col gap-6">
        <Breadcrumbs items={breadcrumb} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal-500">{description}</p>}
        </div>

        <div className="flex gap-8">
          <FilterPanel category={category} />
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-charcoal-500">{products.length} מוצרים</p>
              <SortSelect />
            </div>
            <ProductGrid products={pageItems} />
            <Pagination page={currentPage} totalPages={totalPages} buildHref={buildPageHref} />
          </div>
        </div>
      </Container>
      <FilterSheet category={category} />
    </div>
  );
}
