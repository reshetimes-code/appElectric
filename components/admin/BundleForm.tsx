"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import { showError } from "@/lib/alert";
import { formatPrice } from "@/lib/utils";
import type { Bundle } from "@/lib/types";

export interface ProductOption {
  id: string;
  nameHe: string;
  price: number;
}

interface ItemRow {
  key: string;
  productId: string;
  price: string;
}

export function BundleForm({
  products,
  bundle,
}: {
  products: ProductOption[];
  bundle?: Bundle;
}) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [nameHe, setNameHe] = useState(bundle?.nameHe ?? "");
  const [description, setDescription] = useState(bundle?.description ?? "");
  const [active, setActive] = useState(bundle?.active ?? true);
  const [addProductId, setAddProductId] = useState("");
  const [items, setItems] = useState<ItemRow[]>(
    bundle?.items.map((it) => ({ key: crypto.randomUUID(), productId: it.productId, price: String(it.price) })) ?? [],
  );
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  const productMap = new Map(products.map((p) => [p.id, p]));

  function addProduct(productId: string) {
    setAddProductId("");
    if (!productId || items.some((r) => r.productId === productId)) return;
    const product = productMap.get(productId);
    setItems((rows) => [...rows, { key: crypto.randomUUID(), productId, price: product ? String(product.price) : "" }]);
  }

  function removeRow(key: string) {
    setItems((rows) => rows.filter((r) => r.key !== key));
  }

  function updateRow(key: string, price: string) {
    setItems((rows) => rows.map((r) => (r.key === key ? { ...r, price } : r)));
  }

  const total = items.reduce((sum, r) => sum + (Number(r.price) || 0), 0);
  const availableProducts = products.filter((p) => !items.some((r) => r.productId === p.id));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameHe.trim() || items.length === 0) {
      showError("יש למלא שם לסט ולהוסיף לפחות מוצר אחד");
      return;
    }
    setSaving(true);
    const payload = {
      nameHe,
      description: description || undefined,
      active,
      items: items.map((r) => ({ productId: r.productId, price: Number(r.price) || 0 })),
    };
    const res = await withLoading(() =>
      fetch(bundle ? `/api/admin/bundles/${bundle.id}` : "/api/admin/bundles", {
        method: bundle ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
    setSaving(false);
    if (res.ok) {
      router.push("/admin/bundles");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "השמירה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-white p-6">
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">שם הסט *</label>
        <input value={nameHe} onChange={(e) => setNameHe(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
      </div>
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">תיאור (אופציונלי)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal-700">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-sand-400 text-brand-600 focus:ring-brand-500" />
        הסט פעיל ומוצג באתר
      </label>

      <div>
        <label className="mb-1 block text-sm text-charcoal-600">הוספת מוצר לסט</label>
        <select
          value={addProductId}
          onChange={(e) => addProduct(e.target.value)}
          className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
        >
          <option value="">בחרו מוצר להוספה...</option>
          {availableProducts.map((p) => (
            <option key={p.id} value={p.id}>{p.nameHe} — {formatPrice(p.price)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-charcoal-600">מוצרים בסט *</label>
        <div className="flex flex-col gap-3">
          {items.map((row) => {
            const product = productMap.get(row.productId);
            return (
              <div key={row.key} className="flex flex-col gap-2 rounded-[var(--radius-control)] border border-sand-200 p-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <p className="mb-1 text-xs text-charcoal-500">מוצר</p>
                  <p className="h-11 flex items-center text-sm text-charcoal-900">{product?.nameHe ?? "מוצר לא ידוע"}</p>
                  {product && <p className="text-xs text-charcoal-400">מחיר בקטלוג: {formatPrice(product.price)}</p>}
                </div>
                <div className="sm:w-40">
                  <label className="mb-1 block text-xs text-charcoal-500">מחיר בסט (₪)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={row.price}
                    onChange={(e) => updateRow(row.key, e.target.value)}
                    className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(row.key)}
                  aria-label="הסרת מוצר מהסט"
                  className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-[var(--radius-control)] text-charcoal-400 hover:bg-sand-100 hover:text-charcoal-800"
                >
                  <X size={18} />
                </button>
              </div>
            );
          })}
          {items.length === 0 && <p className="text-sm text-charcoal-400">עדיין לא הוספתם מוצרים לסט.</p>}
        </div>
        {items.length > 0 && (
          <p className="mt-2 text-sm text-charcoal-600">
            סה&quot;כ מחיר הסט: <span className="font-semibold text-charcoal-900">{formatPrice(total)}</span>
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={saving} className="self-start">
        {showSpinner ? <Spinner size={17} /> : <Send size={17} />}
        {saving ? "שומר..." : bundle ? "שמירת שינויים" : "יצירת הסט"}
      </Button>
    </form>
  );
}
