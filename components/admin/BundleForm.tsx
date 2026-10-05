"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, X, ImagePlus } from "lucide-react";
import { MAX_BUNDLE_ITEMS } from "@/lib/bundleLimits";
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
  image?: string;
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
  const [coverUrl, setCoverUrl] = useState(bundle?.coverUrl ?? "");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [uploadingCover, setUploadingCover] = useState(false);
  const [items, setItems] = useState<ItemRow[]>(
    bundle?.items.map((it) => ({ key: crypto.randomUUID(), productId: it.productId, price: String(it.price) })) ?? [],
  );
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  const productMap = new Map(products.map((p) => [p.id, p]));

  function addProduct(productId: string) {
    setPickerOpen(false);
    setSearch("");
    if (!productId || items.length >= MAX_BUNDLE_ITEMS || items.some((r) => r.productId === productId)) return;
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

  async function uploadCover(file: File | undefined) {
    if (!file) return;
    setUploadingCover(true);
    const form = new FormData();
    form.set("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setUploadingCover(false);
    if (res?.ok && data?.url) setCoverUrl(data.url);
    else showError(data?.error || "העלאת התמונה נכשלה");
  }

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
      coverUrl: coverUrl || "",
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
      <div>
        <label className="mb-1 block text-sm text-charcoal-600">תמונה גדולה של הסט (אופציונלי – אחרת תיווצר קולאז' אוטומטי)</label>
        {coverUrl && (
          <div className="relative mb-2 aspect-[16/10] w-full max-w-md overflow-hidden rounded-[var(--radius-control)] bg-sand-100">
            <Image src={coverUrl} alt="תמונת הסט" fill sizes="448px" className="object-cover" />
            <button
              type="button"
              onClick={() => setCoverUrl("")}
              aria-label="הסרת התמונה"
              className="absolute end-2 top-2 rounded-full bg-white/90 p-1.5 text-charcoal-700 hover:bg-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] border border-dashed border-sand-400 bg-sand-50 px-4 text-sm font-medium text-charcoal-700 hover:bg-sand-100">
          <ImagePlus size={16} />
          {uploadingCover ? "מעלה..." : coverUrl ? "החלפת תמונה" : "בחירת תמונה"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingCover} onChange={(e) => { uploadCover(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal-700">
        <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-sand-400 text-brand-600 focus:ring-brand-500" />
        הסט פעיל ומוצג באתר
      </label>

      <div>
        <label className="mb-1 block text-sm text-charcoal-600">הוספת מוצר לסט (עד {MAX_BUNDLE_ITEMS} מוצרים)</label>
        <button
          type="button"
          disabled={items.length >= MAX_BUNDLE_ITEMS}
          onClick={() => setPickerOpen((o) => !o)}
          className="flex h-11 w-full items-center justify-between rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm disabled:opacity-50"
        >
          {items.length >= MAX_BUNDLE_ITEMS ? `הגעתם למקסימום של ${MAX_BUNDLE_ITEMS} מוצרים` : "בחרו מוצר להוספה..."}
          <span aria-hidden>{pickerOpen ? "▲" : "▼"}</span>
        </button>
        {pickerOpen && items.length < MAX_BUNDLE_ITEMS && (
          <div className="mt-2 rounded-[var(--radius-control)] border border-sand-300 p-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש מוצר..."
              className="mb-3 h-10 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
            />
            <div className="grid max-h-96 grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-3">
              {availableProducts
                .filter((p) => p.nameHe.toLowerCase().includes(search.trim().toLowerCase()))
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addProduct(p.id)}
                    className="flex flex-col overflow-hidden rounded-lg border border-sand-200 text-start hover:border-brand-500"
                  >
                    <div className="relative aspect-square w-full bg-sand-100">
                      {p.image && <Image src={p.image} alt={p.nameHe} fill sizes="160px" className="object-cover" />}
                    </div>
                    <div className="p-2">
                      <p className="line-clamp-2 text-xs font-medium text-charcoal-900">{p.nameHe}</p>
                      <p className="text-xs text-charcoal-500">{formatPrice(p.price)}</p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-charcoal-600">מוצרים בסט *</label>
        <div className="flex flex-col gap-3">
          {items.map((row) => {
            const product = productMap.get(row.productId);
            return (
              <div key={row.key} className="flex flex-col gap-2 rounded-[var(--radius-control)] border border-sand-200 p-3 sm:flex-row sm:items-end">
                <div className="relative h-16 w-16 shrink-0 self-center overflow-hidden rounded-lg bg-sand-100">
                  {product?.image && <Image src={product.image} alt={product.nameHe} fill sizes="64px" className="object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-xs text-charcoal-500">מוצר</p>
                  <p className="h-11 flex items-center text-sm text-charcoal-900">{product?.nameHe ?? "מוצר לא ידוע"}</p>
                  {product && <p className="text-xs text-charcoal-400">מחיר בקטלוג: {formatPrice(product.price)}</p>}
                  {product?.image && coverUrl !== product.image && (
                    <button type="button" onClick={() => setCoverUrl(product.image!)} className="mt-1 text-xs font-medium text-brand-700 hover:underline">
                      השתמש בתמונה זו כתמונת הסט
                    </button>
                  )}
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
