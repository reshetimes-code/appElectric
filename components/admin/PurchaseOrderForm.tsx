"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { showError } from "@/lib/alert";
import { formatPrice } from "@/lib/utils";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import type { Supplier } from "@/lib/types";

export interface OrderOption {
  value: string;
  label: string;
  productName: string;
  quantity: number;
  deliveryAddress: string;
  notes: string;
}

interface ItemRow {
  key: string;
  productName: string;
  costPrice: string;
  quantity: string;
}

function emptyRow(): ItemRow {
  return { key: crypto.randomUUID(), productName: "", costPrice: "", quantity: "1" };
}

export function PurchaseOrderForm({
  suppliers,
  orderOptions = [],
  initialProductName = "",
  initialDeliveryAddress = "",
  initialNotes = "",
}: {
  suppliers: Supplier[];
  orderOptions?: OrderOption[];
  initialProductName?: string;
  initialDeliveryAddress?: string;
  initialNotes?: string;
}) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id ?? "");
  const [addFromOrder, setAddFromOrder] = useState("");
  const [items, setItems] = useState<ItemRow[]>(
    initialProductName ? [{ key: crypto.randomUUID(), productName: initialProductName, costPrice: "", quantity: "1" }] : [emptyRow()],
  );
  const [deliveryAddress, setDeliveryAddress] = useState(initialDeliveryAddress);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  // Multiple products can go into one purchase order (e.g. several line
  // items from the same customer order, all shipping to the same address) —
  // picking an option here appends a row instead of replacing the form, so
  // the dropdown can be used again and again to build up the list.
  function addFromOrderOption(value: string) {
    setAddFromOrder("");
    const opt = orderOptions.find((o) => o.value === value);
    if (!opt) return;
    setItems((rows) => {
      const withoutBlankFirst = rows.length === 1 && !rows[0].productName.trim() ? [] : rows;
      return [...withoutBlankFirst, { key: crypto.randomUUID(), productName: opt.productName, costPrice: "", quantity: String(opt.quantity) }];
    });
    // Only prefill address/notes the first time something is added, so it
    // doesn't clobber edits made after adding earlier items.
    if (!deliveryAddress.trim()) setDeliveryAddress(opt.deliveryAddress);
    if (!notes.trim()) setNotes(opt.notes);
  }

  function addBlankRow() {
    setItems((rows) => [...rows, emptyRow()]);
  }

  function removeRow(key: string) {
    setItems((rows) => (rows.length > 1 ? rows.filter((r) => r.key !== key) : rows));
  }

  function updateRow(key: string, patch: Partial<ItemRow>) {
    setItems((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  const supplier = suppliers.find((s) => s.id === supplierId);
  const total = items.reduce((sum, r) => sum + (Number(r.costPrice) || 0) * (Number(r.quantity) || 1), 0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const filledItems = items.filter((r) => r.productName.trim());
    if (!supplier || filledItems.length === 0 || !deliveryAddress.trim()) {
      showError("יש למלא ספק, לפחות מוצר אחד וכתובת להספקה");
      return;
    }
    setSaving(true);
    const res = await withLoading(() =>
      fetch("/api/admin/purchase-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplierId: supplier.id,
          supplierName: supplier.name,
          supplierEmail: supplier.email,
          supplierWhatsapp: supplier.whatsapp,
          items: filledItems.map((r) => ({
            productName: r.productName,
            costPrice: Number(r.costPrice) || 0,
            quantity: Number(r.quantity) || 1,
          })),
          deliveryAddress,
          notes: notes || undefined,
        }),
      }),
    );
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/admin/purchase-orders/${data.purchaseOrder.id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "יצירת ההזמנה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
      {orderOptions.length > 0 && (
        <div>
          <label className="mb-1 block text-sm text-charcoal-600">הוספת מוצר מהזמנת לקוח (אופציונלי)</label>
          <select
            value={addFromOrder}
            onChange={(e) => addFromOrderOption(e.target.value)}
            className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
          >
            <option value="">בחרו פריט להוספה...</option>
            {orderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-charcoal-400">
            אפשר לבחור כמה פריטים ברצף כדי לצרף כמה מוצרים לאותה הזמנת רכש — כל בחירה מוסיפה שורה חדשה. מחיר העלות תמיד נשאר לקביעה ידנית.
          </p>
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">ספק *</label>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name} — {s.email}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-charcoal-600">מוצרים *</label>
        <div className="flex flex-col gap-3">
          {items.map((row) => (
            <div key={row.key} className="flex flex-col gap-2 rounded-[var(--radius-control)] border border-sand-200 p-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-charcoal-500">שם המוצר</label>
                <input
                  value={row.productName}
                  onChange={(e) => updateRow(row.key, { productName: e.target.value })}
                  className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
                />
              </div>
              <div className="sm:w-32">
                <label className="mb-1 block text-xs text-charcoal-500">מחיר עלות (₪)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={row.costPrice}
                  onChange={(e) => updateRow(row.key, { costPrice: e.target.value })}
                  className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
                />
              </div>
              <div className="sm:w-24">
                <label className="mb-1 block text-xs text-charcoal-500">כמות</label>
                <input
                  type="number"
                  min={1}
                  value={row.quantity}
                  onChange={(e) => updateRow(row.key, { quantity: e.target.value })}
                  className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRow(row.key)}
                disabled={items.length === 1}
                aria-label="הסרת מוצר"
                className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-[var(--radius-control)] text-charcoal-400 hover:bg-sand-100 hover:text-charcoal-800 disabled:opacity-30"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addBlankRow}
          className="mt-2 flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline"
        >
          <Plus size={15} />
          הוספת מוצר ידנית
        </button>
        {items.length > 1 && (
          <p className="mt-2 text-sm text-charcoal-600">
            סה&quot;כ: <span className="font-semibold text-charcoal-900">{formatPrice(total)}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">כתובת להספקה *</label>
          <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-charcoal-600">הערות (אופציונלי)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
        </div>
      </div>

      <Button type="submit" size="lg" disabled={saving} className="self-start">
        {showSpinner ? <Spinner size={17} /> : <Send size={17} />}
        {saving ? "יוצר..." : "יצירת הזמנת רכש"}
      </Button>
    </form>
  );
}
