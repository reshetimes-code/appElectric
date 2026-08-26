"use client";

import { useFilterParams } from "@/lib/hooks/useFilterParams";

const OPTIONS = [
  { value: "relevance", label: "רלוונטיות" },
  { value: "price-asc", label: "מחיר: מהנמוך לגבוה" },
  { value: "price-desc", label: "מחיר: מהגבוה לנמוך" },
  { value: "newest", label: "חדש ביותר" },
];

export function SortSelect() {
  const { filters, setParam } = useFilterParams();
  return (
    <select
      value={filters.sort}
      onChange={(e) => setParam("sort", e.target.value === "relevance" ? undefined : e.target.value)}
      aria-label="מיין לפי"
      className="h-10 rounded-[var(--radius-control)] border border-sand-300 bg-white px-3 text-sm text-charcoal-700"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          מיון: {o.label}
        </option>
      ))}
    </select>
  );
}
