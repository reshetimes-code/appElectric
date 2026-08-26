import { FilterControls } from "@/components/catalog/FilterControls";
import type { Category } from "@/lib/types";

export function FilterPanel({ category }: { category?: Category }) {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <FilterControls category={category} />
      </div>
    </aside>
  );
}
