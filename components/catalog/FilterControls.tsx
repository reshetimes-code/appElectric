"use client";

import { useFilterParams } from "@/lib/hooks/useFilterParams";
import { getPriceBounds } from "@/lib/repo/products";
import { AVAILABILITY_LABELS } from "@/lib/utils";
import type { Category, Brand } from "@/lib/types";
import { cn } from "@/lib/utils";

const AVAILABILITY_KEYS = ["immediate", "in-stock", "limited", "personal-import", "out-of-stock"];
const ENERGY_KEYS = ["A+++", "A++", "A+", "A", "B", "C"];

function CheckRow({
  checked,
  onChange,
  label,
  count,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-charcoal-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-sand-400 text-brand-600 focus:ring-brand-500"
      />
      {count != null && <span className="text-xs text-charcoal-400">({count})</span>}
      {label}
    </label>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-sand-200 py-5 first:pt-0 last:border-none">
      <p className="mb-2 break-keep text-sm font-semibold text-charcoal-900">{title}</p>
      {children}
    </div>
  );
}

export interface FacetCounts {
  brand: Record<string, number>;
  screenSizeInch: Record<number, number>;
}

export function FilterControls({
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
  const { filters, toggleListValue, setParam, clearAll, activeCount } = useFilterParams();
  const priceBounds = getPriceBounds();

  const sortedBrands = [...brands]
    .filter((b) => (facetCounts.brand[b.slug] ?? 0) > 0)
    .sort((a, b) => a.nameHe.localeCompare(b.nameHe));
  const availableScreenSizes = screenSizes.filter((s) => (facetCounts.screenSizeInch[s] ?? 0) > 0);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-charcoal-900">סינון</p>
        {activeCount > 0 && (
          <button type="button" onClick={clearAll} className="text-sm text-brand-700 hover:underline">
            נקה הכל ({activeCount})
          </button>
        )}
      </div>

      {category && category.subcategories.length > 0 && (
        <FilterGroup title="תת-קטגוריה">
          {category.subcategories.map((sub) => (
            <CheckRow
              key={sub.id}
              checked={!!filters.subcategory?.includes(sub.slug)}
              onChange={() => toggleListValue("subcategory", sub.slug)}
              label={sub.nameHe}
            />
          ))}
        </FilterGroup>
      )}

      {sortedBrands.length > 0 && (
        <FilterGroup title="מותג">
          {sortedBrands.map((b) => (
            <CheckRow
              key={b.id}
              checked={!!filters.brand?.includes(b.slug)}
              onChange={() => toggleListValue("brand", b.slug)}
              label={b.nameHe}
              count={facetCounts.brand[b.slug]}
            />
          ))}
        </FilterGroup>
      )}

      {availableScreenSizes.length > 0 && (
        <FilterGroup title="גודל מסך">
          {availableScreenSizes.map((size) => (
            <CheckRow
              key={size}
              checked={!!filters.screenSizeInch?.includes(size)}
              onChange={() => toggleListValue("screenSizeInch", String(size))}
              label={`${size}"`}
              count={facetCounts.screenSizeInch[size]}
            />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="טווח מחיר">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={String(priceBounds.min)}
            defaultValue={filters.priceMin ?? ""}
            onBlur={(e) => setParam("priceMin", e.target.value || undefined)}
            className="h-9 w-full rounded-[var(--radius-control)] border border-sand-300 px-2 text-sm"
            aria-label="מחיר מינימום"
          />
          <span className="text-charcoal-400">—</span>
          <input
            type="number"
            placeholder={String(priceBounds.max)}
            defaultValue={filters.priceMax ?? ""}
            onBlur={(e) => setParam("priceMax", e.target.value || undefined)}
            className="h-9 w-full rounded-[var(--radius-control)] border border-sand-300 px-2 text-sm"
            aria-label="מחיר מקסימום"
          />
        </div>
      </FilterGroup>

      <FilterGroup title="זמינות">
        {AVAILABILITY_KEYS.map((key) => (
          <CheckRow
            key={key}
            checked={!!filters.availability?.includes(key)}
            onChange={() => toggleListValue("availability", key)}
            label={AVAILABILITY_LABELS[key]}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="דירוג אנרגטי">
        <div className="flex flex-wrap gap-2">
          {ENERGY_KEYS.map((key) => {
            const active = !!filters.energyRating?.includes(key);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleListValue("energyRating", key)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium",
                  active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-charcoal-600 hover:border-charcoal-400",
                )}
              >
                {key}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup title="נוסף">
        <CheckRow checked={!!filters.premium} onChange={() => setParam("premium", !filters.premium)} label="קולקציית פרימיום / יוקרה" />
        <CheckRow checked={!!filters.personalImport} onChange={() => setParam("personalImport", !filters.personalImport)} label="ייבוא אישי" />
        <CheckRow checked={!!filters.deals} onChange={() => setParam("deals", !filters.deals)} label="במבצע" />
      </FilterGroup>
    </div>
  );
}
