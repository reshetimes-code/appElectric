"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Info, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { calculateEnergySavings, LEGACY_CLASS_BASELINE_KWH } from "@/lib/energy";
import { formatPrice, formatNumber } from "@/lib/utils";

export default function EnergyCalculatorPage() {
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [knowOldUsage, setKnowOldUsage] = useState(true);
  const [oldKnownKwh, setOldKnownKwh] = useState(500);
  const [oldClass, setOldClass] = useState<"A" | "B" | "C" | "D">("C");
  const [newProductId, setNewProductId] = useState<string>("");
  const [manualNewKwh, setManualNewKwh] = useState(280);
  const [pricePerKwh, setPricePerKwh] = useState(0.6);
  const [years, setYears] = useState(5);

  const categoryProducts = useMemo(
    () => products.filter((p) => p.categoryId === categoryId && p.annualEnergyKwh),
    [categoryId],
  );
  const selectedProduct = categoryProducts.find((p) => p.id === newProductId);

  const oldAnnualKwh = knowOldUsage ? oldKnownKwh : LEGACY_CLASS_BASELINE_KWH[categoryId]?.[oldClass] ?? 500;
  const newAnnualKwh = selectedProduct?.annualEnergyKwh ?? manualNewKwh;

  const result = calculateEnergySavings({ oldAnnualKwh, newAnnualKwh, pricePerKwh, years });

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "מחשבון חיסכון באנרגיה" }]} />
      <div className="max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand-600">
          <Zap size={16} /> מחשבון חיסכון באנרגיה
        </p>
        <h1 className="font-heading text-3xl font-bold text-charcoal-900 sm:text-4xl">כמה תוכלו לחסוך במעבר למכשיר חדש?</h1>
        <p className="mt-3 leading-relaxed text-charcoal-600">
          הזינו את נתוני המכשיר הישן והחדש כדי לקבל הערכת חיסכון שנתית וכוללת. החישוב מתבסס על צריכת אנרגיה שנתית בפועל היכן שידועה.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6 rounded-[var(--radius-card)] border border-sand-300 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-charcoal-700">סוג המכשיר</label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setNewProductId("");
              }}
              className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameHe}</option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-charcoal-700">צריכת המכשיר הישן</p>
            <div className="mb-3 flex gap-2">
              <button
                type="button"
                onClick={() => setKnowOldUsage(true)}
                className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium ${knowOldUsage ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-charcoal-600"}`}
              >
                יודע/ת צריכה שנתית מדויקת
              </button>
              <button
                type="button"
                onClick={() => setKnowOldUsage(false)}
                className={`flex-1 rounded-full border px-3 py-2 text-xs font-medium ${!knowOldUsage ? "border-brand-600 bg-brand-50 text-brand-700" : "border-sand-300 text-charcoal-600"}`}
              >
                לפי דירוג אנרגטי ישן משוער
              </button>
            </div>
            {knowOldUsage ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={oldKnownKwh}
                  onChange={(e) => setOldKnownKwh(Number(e.target.value))}
                  className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
                />
                <span className="text-sm text-charcoal-500">קוט&quot;ש לשנה</span>
              </div>
            ) : (
              <select value={oldClass} onChange={(e) => setOldClass(e.target.value as "A" | "B" | "C" | "D")} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
                {Object.entries(LEGACY_CLASS_BASELINE_KWH[categoryId] ?? {}).map(([cls, kwh]) => (
                  <option key={cls} value={cls}>דירוג {cls} — כ-{kwh} קוט&quot;ש לשנה (הערכה)</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-charcoal-700">המכשיר החדש</p>
            {categoryProducts.length > 0 ? (
              <select value={newProductId} onChange={(e) => setNewProductId(e.target.value)} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm">
                <option value="">בחרו מוצר מהקטלוג (מומלץ)</option>
                {categoryProducts.map((p) => (
                  <option key={p.id} value={p.id}>{p.nameHe} — {p.annualEnergyKwh} קוט&quot;ש לשנה</option>
                ))}
              </select>
            ) : null}
            {!selectedProduct && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  value={manualNewKwh}
                  onChange={(e) => setManualNewKwh(Number(e.target.value))}
                  className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm"
                />
                <span className="text-sm text-charcoal-500">קוט&quot;ש לשנה (הזנה ידנית)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">מחיר לקוט&quot;ש (₪)</label>
              <input type="number" step="0.01" value={pricePerKwh} onChange={(e) => setPricePerKwh(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-charcoal-700">תקופת שימוש (שנים)</label>
              <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="h-11 w-full rounded-[var(--radius-control)] border border-sand-300 px-3 text-sm" />
            </div>
          </div>
        </div>

        <div className="h-fit flex flex-col gap-4 rounded-[var(--radius-card)] border border-brand-200 bg-brand-50 p-6">
          <h2 className="font-heading text-lg font-semibold text-charcoal-900">תוצאות משוערות</h2>
          <div>
            <p className="text-xs text-charcoal-500">חיסכון שנתי בצריכה</p>
            <p className="font-heading text-2xl font-bold text-brand-700">{formatNumber(Math.round(result.annualKwhSavings))} קוט&quot;ש</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-500">חיסכון כספי שנתי</p>
            <p className="font-heading text-2xl font-bold text-brand-700">{formatPrice(Math.round(result.annualCostSavings))}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-500">חיסכון כולל ל-{years} שנים</p>
            <p className="font-heading text-2xl font-bold text-brand-700">{formatPrice(Math.round(result.totalCostSavings))}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal-500">הפחתת צריכה</p>
            <p className="font-heading text-lg font-semibold text-charcoal-800">{result.consumptionDifferencePct.toFixed(0)}%</p>
          </div>
          <p className="flex items-start gap-2 text-xs leading-relaxed text-charcoal-500">
            <Info size={14} className="mt-0.5 shrink-0" />
            החישוב הינו הערכה בלבד ומבוסס על הנתונים שהוזנו. הצריכה בפועל עשויה להשתנות בהתאם להרגלי שימוש, תעריף חשמל בפועל ותנאי התקנה.
          </p>
          <Link href={`/category/${categoryId}`} className="text-sm font-medium text-brand-700 hover:underline">
            לצפייה במוצרים חסכוניים בקטגוריה זו →
          </Link>
        </div>
      </div>
    </Container>
  );
}
