"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useDelayedPending } from "@/lib/hooks/useDelayedPending";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { showError } from "@/lib/alert";
import { AVAILABILITY_LABELS } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface FormBrand { id: string; nameHe: string }
interface FormCategory { id: string; nameHe: string; subcategories: { id: string; nameHe: string }[] }

const AVAILABILITY_OPTIONS: Product["availabilityStatus"][] = [
  "immediate",
  "in-stock",
  "limited",
  "personal-import",
  "out-of-stock",
];

export function ProductForm({
  brands,
  categories,
  initial,
  productId,
  mode = "full",
}: {
  brands: FormBrand[];
  categories: FormCategory[];
  initial?: Product;
  productId?: string;
  /** "full" (default): create/edit an admin-added product, images included.
   * "details": edit only the non-image fields of any product (used for the
   * 68 seed products, whose images have their own dedicated page/endpoint). */
  mode?: "full" | "details";
}) {
  const router = useRouter();
  const [nameHe, setNameHe] = useState(initial?.nameHe ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [shortDescriptionHe, setShortDescriptionHe] = useState(initial?.shortDescriptionHe ?? "");
  const [descriptionHe, setDescriptionHe] = useState(initial?.descriptionHe ?? "");
  const [brandId, setBrandId] = useState(initial?.brandId ?? brands[0]?.id ?? "");
  const [categoryList, setCategoryList] = useState<FormCategory[]>(categories);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(initial?.subcategoryId ?? categories[0]?.subcategories[0]?.id ?? "");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [compareAtPrice, setCompareAtPrice] = useState(initial?.compareAtPrice ?? 0);
  const [stockQuantity, setStockQuantity] = useState(initial?.stockQuantity ?? 0);
  const [availabilityStatus, setAvailabilityStatus] = useState<Product["availabilityStatus"]>(
    initial?.availabilityStatus ?? "in-stock",
  );
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  const activeCategory = categoryList.find((c) => c.id === categoryId);

  async function createCategory() {
    if (!newCategoryName.trim()) {
      showError("יש להזין שם קטגוריה");
      return;
    }
    setCreatingCategory(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nameHe: newCategoryName }),
    });
    setCreatingCategory(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "יצירת הקטגוריה נכשלה");
      return;
    }
    const { category } = await res.json();
    setCategoryList((prev) => [...prev, category]);
    setCategoryId(category.id);
    setSubcategoryId(category.subcategories[0]?.id ?? "");
    setNewCategoryName("");
    setAddingCategory(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameHe.trim() || !sku.trim() || !brandId || !categoryId || !subcategoryId) {
      showError("יש למלא את כל שדות החובה");
      return;
    }
    setSaving(true);
    const payload = {
      nameHe,
      sku,
      model,
      shortDescriptionHe,
      descriptionHe,
      brandId,
      categoryId,
      subcategoryId,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      ...(mode === "full" ? { images } : {}),
      stockQuantity: Number(stockQuantity),
      availabilityStatus,
    };
    const url =
      mode === "details"
        ? `/api/admin/products/${productId}/details`
        : productId
          ? `/api/admin/products/${productId}`
          : "/api/admin/products";
    const res = await fetch(url, {
      method: productId || mode === "details" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "שמירה נכשלה");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      {mode === "full" && (
        <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
          <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">תמונות המוצר</h2>
          <ImageUploader images={images} onChange={setImages} />
          <p className="mt-2 text-xs text-charcoal-400">התמונה הראשונה תוצג ככרטיס המוצר הראשי.</p>
        </div>
      )}

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">פרטי מוצר</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-charcoal-600">שם המוצר *</label>
            <input value={nameHe} onChange={(e) => setNameHe(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">מק&quot;ט (SKU) *</label>
            <input value={sku} onChange={(e) => setSku(e.target.value)} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">דגם</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-charcoal-600">תיאור קצר</label>
            <input value={shortDescriptionHe} onChange={(e) => setShortDescriptionHe(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-charcoal-600">תיאור מלא</label>
            <textarea value={descriptionHe} onChange={(e) => setDescriptionHe(e.target.value)} rows={3} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">סיווג</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">מותג *</label>
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
              {brands.map((b) => (
                <option key={b.id} value={b.id}>{b.nameHe}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">קטגוריה *</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                const cat = categoryList.find((c) => c.id === e.target.value);
                setSubcategoryId(cat?.subcategories[0]?.id ?? "");
              }}
              className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
            >
              {categoryList.map((c) => (
                <option key={c.id} value={c.id}>{c.nameHe}</option>
              ))}
            </select>
            {!addingCategory ? (
              <button
                type="button"
                onClick={() => setAddingCategory(true)}
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
              >
                <Plus size={13} />
                קטגוריה חדשה
              </button>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5">
                <input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createCategory();
                    }
                  }}
                  placeholder="שם הקטגוריה החדשה"
                  autoFocus
                  className="h-9 flex-1 rounded-[var(--radius-control)] border border-sand-300 px-2.5 text-sm"
                />
                <Button type="button" onClick={createCategory} size="sm" disabled={creatingCategory}>
                  {creatingCategory ? <Spinner size={15} /> : "הוסף"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingCategory(false);
                    setNewCategoryName("");
                  }}
                  aria-label="ביטול"
                  className="rounded-full p-1.5 text-charcoal-400 hover:bg-sand-100"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">תת-קטגוריה *</label>
            <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
              {activeCategory?.subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.nameHe}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">מחיר ומלאי</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">מחיר (₪) *</label>
            <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">מחיר קודם (מבצע)</label>
            <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">כמות במלאי</label>
            <input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">זמינות</label>
            <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value as Product["availabilityStatus"])} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
              {AVAILABILITY_OPTIONS.map((s) => (
                <option key={s} value={s}>{AVAILABILITY_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {showSpinner ? <Spinner size={17} /> : <Save size={17} />}
          {saving ? "שומר..." : "שמירת מוצר"}
        </Button>
        <Button href="/admin/products" variant="secondary" size="lg">
          ביטול
        </Button>
      </div>
    </form>
  );
}
