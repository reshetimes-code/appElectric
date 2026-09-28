import Link from "next/link";
import { Plus, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DeleteEntityButton } from "@/components/admin/DeleteEntityButton";
import { getBundles, resolveBundleItems } from "@/lib/server/adminBundles";
import { getAllProducts } from "@/lib/server/adminProducts";
import { formatPrice } from "@/lib/utils";

export default async function AdminBundlesPage() {
  const [bundles, allProducts] = await Promise.all([getBundles(), getAllProducts()]);
  const productMap = new Map(allProducts.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900">סטי פרימיום</h1>
          <p className="mt-1 text-sm text-charcoal-500">יצירה ועריכה של סטים — כמה מוצרים עם מחיר משלהם, מוצגים יחד באתר.</p>
        </div>
        <Button href="/admin/bundles/new">
          <Plus size={17} />
          סט חדש
        </Button>
      </div>

      {bundles.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-sand-300 p-8 text-center text-sm text-charcoal-500">
          <PackageOpen size={24} className="mx-auto mb-2 text-charcoal-300" />
          עדיין אין סטים.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
          {bundles.map((bundle) => {
            const { items, total } = resolveBundleItems(bundle, productMap);
            return (
              <div key={bundle.id} className="relative flex flex-wrap items-center gap-3 border-b border-sand-200 p-4 last:border-none hover:bg-sand-50">
                <Link href={`/admin/bundles/${bundle.id}/edit`} className="absolute inset-0" aria-label={bundle.nameHe} />
                <div className="pointer-events-none min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal-900">{bundle.nameHe}</p>
                  <p className="text-xs text-charcoal-500">{items.length} מוצרים</p>
                </div>
                <span className="pointer-events-none w-24 shrink-0 text-sm text-charcoal-600">{formatPrice(total)}</span>
                <div className="pointer-events-none">
                  <Badge tone={bundle.active ? "success" : "muted"}>{bundle.active ? "פעיל" : "לא פעיל"}</Badge>
                </div>
                <DeleteEntityButton
                  endpoint={`/api/admin/bundles/${bundle.id}`}
                  confirmMessage={`למחוק את הסט "${bundle.nameHe}"?`}
                  label="מחיקת סט"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
