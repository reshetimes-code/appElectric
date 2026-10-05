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
import { useGlobalLoading } from "@/lib/context/GlobalLoadingContext";
import { PRODUCT_LIMITS } from "@/lib/productLimits";
import type { Product } from "@/lib/types";

function CharCount({ length, max }: { length: number; max: number }) {
  return (
    <p className={`mt-1 text-xs ${length > max ? "text-red-600" : "text-charcoal-500"}`}>
      {length.toLocaleString("he-IL")} / {max.toLocaleString("he-IL")} תווים
    </p>
  );
}

interface FormBrand { id: string; nameHe: string }
interface FormCategory { id: string; nameHe: string; subcategories: { id: string; nameHe: string }[] }

const AVAILABILITY_OPTIONS: Product["availabilityStatus"][] = [
  "immediate",
  "in-stock",
  "limited",
  "personal-import",
  "out-of-stock",
  "call-me-back",
];

// There's no manual "כמות במלאי" field in the form anymore — availability
// status is the single source of truth, and stock quantity (still needed
// for the admin low-stock alert, see app/admin/(dashboard)/page.tsx) is
// derived from it. "limited" lands at the low-stock threshold on purpose.
function stockQuantityForStatus(status: Product["availabilityStatus"], previous: number): number {
  if (status === "out-of-stock") return 0;
  if (status === "limited") return 3;
  if (status === "personal-import") return 0;
  if (status === "call-me-back") return 0;
  return previous > 0 ? previous : 20;
}

export function ProductForm({
  brands,
  categories,
  screenSizes,
  initial,
  initialCost,
  productId,
  mode = "full",
}: {
  brands: FormBrand[];
  categories: FormCategory[];
  screenSizes: number[];
  initial?: Product;
  /** The owner's private cost for this product (admin-only, never shown on the site). */
  initialCost?: number;
  productId?: string;
  /** "full" (default): create/edit an admin-added product, images included.
   * "details": edit only the non-image fields of any product (used for the
   * 68 seed products, whose images have their own dedicated page/endpoint). */
  mode?: "full" | "details";
}) {
  const router = useRouter();
  const { withLoading } = useGlobalLoading();
  const [nameHe, setNameHe] = useState(initial?.nameHe ?? "");
  const [model, setModel] = useState(initial?.model ?? "");
  const [shortDescriptionHe, setShortDescriptionHe] = useState(initial?.shortDescriptionHe ?? "");
  const [descriptionHe, setDescriptionHe] = useState(initial?.descriptionHe ?? "");
  const [brandList, setBrandList] = useState<FormBrand[]>(brands);
  const [brandId, setBrandId] = useState(initial?.brandId ?? brands[0]?.id ?? "");
  const [addingBrand, setAddingBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [categoryList, setCategoryList] = useState<FormCategory[]>(categories);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [subcategoryId, setSubcategoryId] = useState(initial?.subcategoryId ?? categories[0]?.subcategories[0]?.id ?? "");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [addingSubcategory, setAddingSubcategory] = useState(false);
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [creatingSubcategory, setCreatingSubcategory] = useState(false);
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : "");
  const [myCost, setMyCost] = useState(initialCost ? String(initialCost) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(initial?.compareAtPrice ? String(initial.compareAtPrice) : "");
  const [availabilityStatus, setAvailabilityStatus] = useState<Product["availabilityStatus"]>(
    initial?.availabilityStatus ?? "in-stock",
  );
  const [screenSizeList, setScreenSizeList] = useState<number[]>(screenSizes);
  const [screenSizeInch, setScreenSizeInch] = useState(initial?.screenSizeInch ? String(initial.screenSizeInch) : "");
  const [addingScreenSize, setAddingScreenSize] = useState(false);
  const [newScreenSize, setNewScreenSize] = useState("");
  const [creatingScreenSize, setCreatingScreenSize] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [saving, setSaving] = useState(false);
  const showSpinner = useDelayedPending(saving, 500);

  const activeCategory = categoryList.find((c) => c.id === categoryId);

  async function createBrand() {
    if (!newBrandName.trim()) {
      showError("יש להזין שם מותג");
      return;
    }
    setCreatingBrand(true);
    const res = await withLoading(() =>
      fetch("/api/admin/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameHe: newBrandName }),
      }),
    );
    setCreatingBrand(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "יצירת המותג נכשלה");
      return;
    }
    const { brand } = await res.json();
    setBrandList((prev) => [...prev, brand]);
    setBrandId(brand.id);
    setNewBrandName("");
    setAddingBrand(false);
  }

  async function createSubcategory() {
    if (!newSubcategoryName.trim()) {
      showError("יש להזין שם תת-קטגוריה");
      return;
    }
    setCreatingSubcategory(true);
    const res = await withLoading(() =>
      fetch("/api/admin/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, nameHe: newSubcategoryName }),
      }),
    );
    setCreatingSubcategory(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "יצירת תת-הקטגוריה נכשלה");
      return;
    }
    const { subcategory } = await res.json();
    setCategoryList((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, subcategories: [...c.subcategories, subcategory] } : c)),
    );
    setSubcategoryId(subcategory.id);
    setNewSubcategoryName("");
    setAddingSubcategory(false);
  }

  async function createScreenSize() {
    const size = Number(newScreenSize);
    if (!Number.isFinite(size) || size <= 0) {
      showError("יש להזין גודל מסך תקין");
      return;
    }
    setCreatingScreenSize(true);
    const res = await withLoading(() =>
      fetch("/api/admin/screen-sizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size }),
      }),
    );
    setCreatingScreenSize(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      showError(data.error || "הוספת גודל המסך נכשלה");
      return;
    }
    const { screenSizes: updated } = await res.json();
    setScreenSizeList(updated);
    setScreenSizeInch(String(size));
    setNewScreenSize("");
    setAddingScreenSize(false);
  }

  async function createCategory() {
    if (!newCategoryName.trim()) {
      showError("יש להזין שם קטגוריה");
      return;
    }
    setCreatingCategory(true);
    const res = await withLoading(() =>
      fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameHe: newCategoryName }),
      }),
    );
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
    if (!nameHe.trim() || !brandId || !categoryId || !subcategoryId) {
      showError("יש למלא את כל שדות החובה");
      return;
    }
    setSaving(true);
    const payload = {
      nameHe,
      model,
      shortDescriptionHe,
      descriptionHe,
      brandId,
      categoryId,
      subcategoryId,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      myCost: myCost ? Number(myCost) : undefined,
      ...(mode === "full" ? { images } : {}),
      stockQuantity: stockQuantityForStatus(availabilityStatus, initial?.stockQuantity ?? 0),
      availabilityStatus,
      screenSizeInch: screenSizeInch ? Number(screenSizeInch) : undefined,
    };
    const url =
      mode === "details"
        ? `/api/admin/products/${productId}/details`
        : productId
          ? `/api/admin/products/${productId}`
          : "/api/admin/products";
    const res = await withLoading(() =>
      fetch(url, {
        method: productId || mode === "details" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    );
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
            <label className="mb-1 block text-sm text-charcoal-600">דגם</label>
            <input value={model} onChange={(e) => setModel(e.target.value)} dir="ltr" className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-charcoal-600">תיאור קצר</label>
            <textarea value={shortDescriptionHe} onChange={(e) => setShortDescriptionHe(e.target.value)} rows={3} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
            <CharCount length={shortDescriptionHe.length} max={PRODUCT_LIMITS.shortDescriptionHe} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm text-charcoal-600">תיאור מלא</label>
            <textarea value={descriptionHe} onChange={(e) => setDescriptionHe(e.target.value)} rows={6} className="w-full rounded-[var(--radius-control)] border border-sand-300 p-3 text-sm" />
            <CharCount length={descriptionHe.length} max={PRODUCT_LIMITS.descriptionHe} />
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">סיווג</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">מותג *</label>
            <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
              {brandList.map((b) => (
                <option key={b.id} value={b.id}>{b.nameHe}</option>
              ))}
            </select>
            {!addingBrand ? (
              <button
                type="button"
                onClick={() => setAddingBrand(true)}
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
              >
                <Plus size={13} />
                מותג חדש
              </button>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5">
                <input
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createBrand();
                    }
                  }}
                  placeholder="שם המותג החדש"
                  autoFocus
                  className="h-9 flex-1 rounded-[var(--radius-control)] border border-sand-300 px-2.5 text-sm"
                />
                <Button type="button" onClick={createBrand} size="sm" disabled={creatingBrand}>
                  {creatingBrand ? <Spinner size={15} /> : "הוסף"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingBrand(false);
                    setNewBrandName("");
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
            <label className="mb-1 block text-sm text-charcoal-600">קטגוריה *</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                const cat = categoryList.find((c) => c.id === e.target.value);
                setSubcategoryId(cat?.subcategories[0]?.id ?? "");
                setAddingSubcategory(false);
                setNewSubcategoryName("");
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
            {!addingSubcategory ? (
              <button
                type="button"
                onClick={() => setAddingSubcategory(true)}
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
              >
                <Plus size={13} />
                תת-קטגוריה חדשה
              </button>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5">
                <input
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createSubcategory();
                    }
                  }}
                  placeholder="שם תת-הקטגוריה החדשה"
                  autoFocus
                  className="h-9 flex-1 rounded-[var(--radius-control)] border border-sand-300 px-2.5 text-sm"
                />
                <Button type="button" onClick={createSubcategory} size="sm" disabled={creatingSubcategory}>
                  {creatingSubcategory ? <Spinner size={15} /> : "הוסף"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingSubcategory(false);
                    setNewSubcategoryName("");
                  }}
                  aria-label="ביטול"
                  className="rounded-full p-1.5 text-charcoal-400 hover:bg-sand-100"
                >
                  <X size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-[var(--radius-card)] border border-sand-300 bg-white p-5">
        <h2 className="mb-4 font-heading text-base font-semibold text-charcoal-900">מחיר ומלאי</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">
              מחיר (₪) {availabilityStatus !== "call-me-back" && "*"}
            </label>
            <input type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
            {availabilityStatus === "call-me-back" && (
              <p className="mt-1 text-xs text-charcoal-400">לא חובה במצב &quot;חזרו אליי&quot; — המחיר לא יוצג באתר.</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">עלות שלי (₪)</label>
            <input type="number" placeholder="0" value={myCost} onChange={(e) => setMyCost(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
            <p className="mt-1 text-xs text-charcoal-400">פנימי — מוצג רק באדמין, לא באתר.</p>
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">מחיר קודם (מבצע)</label>
            <input type="number" placeholder="0" value={compareAtPrice} onChange={(e) => setCompareAtPrice(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">זמינות</label>
            <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value as Product["availabilityStatus"])} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
              {AVAILABILITY_OPTIONS.map((s) => (
                <option key={s} value={s}>{AVAILABILITY_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm text-charcoal-600">גודל מסך (אינץ&apos;)</label>
            <select value={screenSizeInch} onChange={(e) => setScreenSizeInch(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
              <option value="">לא רלוונטי</option>
              {screenSizeList.map((s) => (
                <option key={s} value={s}>{s}&quot;</option>
              ))}
            </select>
            {!addingScreenSize ? (
              <button
                type="button"
                onClick={() => setAddingScreenSize(true)}
                className="mt-1.5 flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800"
              >
                <Plus size={13} />
                גודל חדש
              </button>
            ) : (
              <div className="mt-1.5 flex items-center gap-1.5">
                <input
                  type="number"
                  value={newScreenSize}
                  onChange={(e) => setNewScreenSize(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createScreenSize();
                    }
                  }}
                  placeholder="גודל באינץ'"
                  autoFocus
                  className="h-9 flex-1 rounded-[var(--radius-control)] border border-sand-300 px-2.5 text-sm"
                />
                <Button type="button" onClick={createScreenSize} size="sm" disabled={creatingScreenSize}>
                  {creatingScreenSize ? <Spinner size={15} /> : "הוסף"}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setAddingScreenSize(false);
                    setNewScreenSize("");
                  }}
                  aria-label="ביטול"
                  className="rounded-full p-1.5 text-charcoal-400 hover:bg-sand-100"
                >
                  <X size={15} />
                </button>
              </div>
            )}
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
