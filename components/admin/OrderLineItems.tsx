"use client";

import { useState } from "react";
import Link from "next/link";
import { PackagePlus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface LineItem {
  lineId: string;
  name: string;
  quantity: number;
  unitPrice?: number;
}

/**
 * Each order line keeps its own "הזמן מהספק" link (unchanged — sends just
 * that one line to a new purchase order). Checkboxes are additional: select
 * any subset (or all) and "הזמנת רכש לנבחרים" sends them together as one
 * multi-item purchase order instead of creating one PO per product.
 */
export function OrderLineItems({
  items,
  deliveryAddress,
  notesFor,
}: {
  items: LineItem[];
  deliveryAddress: string;
  notesFor: (lineId: string) => string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allSelected = items.length > 0 && selected.size === items.length;

  function toggle(lineId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.lineId)));
  }

  function poHref(lineIds: string[]) {
    const chosen = items.filter((i) => lineIds.includes(i.lineId));
    const params = new URLSearchParams({
      items: JSON.stringify(chosen.map((i) => ({ productName: i.name, quantity: i.quantity }))),
      deliveryAddress,
      notes: notesFor(lineIds[0]),
    });
    return `/admin/purchase-orders/new?${params.toString()}`;
  }

  return (
    <div>
      {items.length > 1 && (
        <label className="mb-2 flex items-center gap-2 text-xs text-charcoal-500">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="h-4 w-4 rounded border-sand-400 text-brand-600 focus:ring-brand-500" />
          בחר הכל
        </label>
      )}
      <div className="flex flex-col divide-y divide-sand-200">
        {items.map((item) => (
          <div key={item.lineId} className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <input
                type="checkbox"
                checked={selected.has(item.lineId)}
                onChange={() => toggle(item.lineId)}
                aria-label={`בחר ${item.name}`}
                className="h-4 w-4 shrink-0 rounded border-sand-400 text-brand-600 focus:ring-brand-500"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal-900">{item.name} × {item.quantity}</p>
                {item.unitPrice != null && <p className="text-xs text-charcoal-500">{formatPrice(item.unitPrice)} ליחידה</p>}
              </div>
            </div>
            <Link
              href={poHref([item.lineId])}
              className="flex items-center gap-1.5 rounded-full border border-brand-600 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
            >
              <PackagePlus size={14} />
              הזמן מהספק
            </Link>
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex justify-end border-t border-sand-200 pt-3">
          {selected.size > 0 ? (
            <Link
              href={poHref([...selected])}
              className="flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              <PackagePlus size={15} />
              הזמנת רכש לנבחרים ({selected.size})
            </Link>
          ) : (
            <p className="text-xs text-charcoal-400">סמנו פריטים כדי ליצור עבורם הזמנת רכש אחת משותפת</p>
          )}
        </div>
      )}
    </div>
  );
}
