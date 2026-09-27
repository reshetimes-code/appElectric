import { FilterControls, type FacetCounts } from "@/components/catalog/FilterControls";
import type { Category, Brand } from "@/lib/types";

export function FilterPanel({
  category,
  brands,
  screenSizes,
  facetCounts,
}: {
  category?: Category;
  brands: Brand[];
  screenSizes: number[];
  facetCounts: FacetCounts;
}) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <FilterControls category={category} brands={brands} screenSizes={screenSizes} facetCounts={facetCounts} />
      </div>
    </aside>
  );
}
