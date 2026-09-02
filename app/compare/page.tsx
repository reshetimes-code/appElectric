"use client";

import Link from "next/link";
import { X, Scale } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ApplianceArt } from "@/components/product/ApplianceArt";
import { AvailabilityBadge } from "@/components/product/AvailabilityBadge";
import { Button } from "@/components/ui/Button";
import { useCompare } from "@/lib/context/CompareContext";
import { useCatalog } from "@/lib/context/CatalogContext";
import { getBrandBySlug } from "@/lib/data/brands";
import { brands } from "@/lib/data/brands";
import { formatPrice, AVAILABILITY_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

function brandName(id: string) {
  return brands.find((b) => b.id === id)?.nameHe ?? "";
}
void getBrandBySlug;

interface Row {
  label: string;
  get: (p: Product) => string;
}

const ROWS: Row[] = [
  { label: "מותג", get: (p) => brandName(p.brandId) },
  { label: "דגם", get: (p) => p.model },
  { label: "מחיר", get: (p) => formatPrice(p.price) },
  {
    label: "מידות המוצר",
    get: (p) => [p.dimensions.widthMm && `רוחב ${p.dimensions.widthMm}`, p.dimensions.heightMm && `גובה ${p.dimensions.heightMm}`, p.dimensions.depthMm && `עומק ${p.dimensions.depthMm}`].filter(Boolean).join(" · ") || "—",
  },
  {
    label: "מידות נישה",
    get: (p) => {
      const n = p.nicheDimensions;
      if (!n) return "—";
      return [n.widthMm && `רוחב ${n.widthMm}`, n.heightMm && `גובה ${n.heightMm}`, n.depthMm && `עומק ${n.depthMm}`].filter(Boolean).join(" · ") || "—";
    },
  },
  { label: "קיבולת", get: (p) => (p.capacityValue ? `${p.capacityValue} ${p.capacityUnit ?? ""}` : "—") },
  { label: "דירוג אנרגטי", get: (p) => p.energyRating ?? "—" },
  { label: "רמת רעש", get: (p) => (p.noiseDb ? `${p.noiseDb} dB` : "—") },
  { label: "תכונות", get: (p) => p.featureIds.join(", ") || "—" },
  { label: "אחריות", get: (p) => p.warrantyText },
  { label: "זמינות", get: (p) => AVAILABILITY_LABELS[p.availabilityStatus] },
];

export default function ComparePage() {
  const compare = useCompare();
  const { getProductsByIds } = useCatalog();
  const products = getProductsByIds(compare.ids);

  if (!compare.hydrated) return null;

  return (
    <Container className="flex flex-col gap-6 py-8 sm:py-10">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">השוואת מוצרים</h1>
        <p className="mt-2 text-sm text-charcoal-500">ניתן להשוות עד {compare.max} מוצרים בו-זמנית. שדות שונים בין המוצרים מודגשים.</p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-sand-300 py-20 text-center">
          <Scale size={32} className="text-charcoal-300" />
          <p className="font-heading text-lg font-semibold text-charcoal-800">עדיין לא בחרתם מוצרים להשוואה</p>
          <p className="text-sm text-charcoal-500">לחצו על סמל המאזניים בכרטיס מוצר כדי להוסיף אותו להשוואה.</p>
          <Button href="/shop" className="mt-2">מעבר לחנות</Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="w-40" />
                {products.map((p) => (
                  <th key={p.id} className="p-3 text-start align-top">
                    <div className="relative rounded-[var(--radius-card)] border border-sand-300 bg-white p-3">
                      <button
                        onClick={() => compare.remove(p.id)}
                        aria-label={`הסר את ${p.nameHe} מההשוואה`}
                        className="absolute end-2 top-2 rounded-full bg-white p-1 text-charcoal-400 hover:text-charcoal-800"
                      >
                        <X size={14} />
                      </button>
                      <ApplianceArt kind={p.artKind} className="mb-2 aspect-square rounded-lg" />
                      <Link href={`/product/${p.slug}`} className="block text-sm font-semibold text-charcoal-900 hover:text-brand-700">
                        {p.nameHe}
                      </Link>
                      <div className="mt-2">
                        <AvailabilityBadge status={p.availabilityStatus} />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => {
                const values = products.map((p) => row.get(p));
                const differs = new Set(values).size > 1;
                return (
                  <tr key={row.label}>
                    <td className="border-t border-sand-200 p-3 text-sm font-medium text-charcoal-500">{row.label}</td>
                    {values.map((v, i) => (
                      <td key={i} className={cn("border-t border-sand-200 p-3 text-sm text-charcoal-800", differs && "bg-brand-50 font-medium")}>
                        {v}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
