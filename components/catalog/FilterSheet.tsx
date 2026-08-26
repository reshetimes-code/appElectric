"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterControls } from "@/components/catalog/FilterControls";
import { useFilterParams } from "@/lib/hooks/useFilterParams";
import type { Category } from "@/lib/types";

export function FilterSheet({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false);
  const { activeCount } = useFilterParams();

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 start-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-charcoal-900 px-5 py-3 text-sm font-medium text-white shadow-xl rtl:translate-x-1/2"
      >
        <SlidersHorizontal size={16} />
        סינון
        {activeCount > 0 && <span className="rounded-full bg-brand-500 px-1.5 py-0.5 text-[10px]">{activeCount}</span>}
      </button>

      {open && (
        <div className="fixed inset-0 z-[80]">
          <div className="absolute inset-0 bg-charcoal-950/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 pb-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-charcoal-900">סינון מוצרים</span>
              <button onClick={() => setOpen(false)} aria-label="סגור סינון" className="rounded-full p-2 hover:bg-sand-100">
                <X size={20} />
              </button>
            </div>
            <FilterControls category={category} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="sticky bottom-0 mt-4 w-full rounded-full bg-brand-600 py-3 text-sm font-medium text-white"
            >
              הצג תוצאות
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
