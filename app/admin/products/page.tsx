import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/product/AvailabilityBadge";
import { getAdminProducts } from "@/lib/server/adminProducts";
import { products as seedProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const adminProducts = getAdminProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900">מוצרים</h1>
          <p className="mt-1 text-sm text-charcoal-500">{adminProducts.length} מוצרים שהוספת, {seedProducts.length} מוצרי דמו בקטלוג הבסיסי</p>
        </div>
        <Button href="/admin/products/new">
          <Plus size={17} />
          הוספת מוצר
        </Button>
      </div>

      <div>
        <h2 className="mb-3 font-heading text-base font-semibold text-charcoal-900">המוצרים שהוספת</h2>
        {adminProducts.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-sand-300 p-8 text-center text-sm text-charcoal-500">
            עדיין לא הוספת מוצרים. לחצו על &quot;הוספת מוצר&quot; כדי להתחיל.
          </div>
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
            {adminProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 border-b border-sand-200 p-4 last:border-none">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-sand-100">
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.nameHe} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-charcoal-300">
                      <ImageOff size={18} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal-900">{p.nameHe}</p>
                  <p className="text-xs text-charcoal-500">מק&quot;ט {p.sku}</p>
                </div>
                <AvailabilityBadge status={p.availabilityStatus} />
                <p className="w-24 shrink-0 text-start text-sm font-semibold text-charcoal-900">{formatPrice(p.price)}</p>
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/product/${p.slug}`} target="_blank" className="text-sm text-brand-700 hover:underline">
                    צפייה
                  </Link>
                  <Link href={`/admin/products/${p.id}/edit`} className="text-sm text-charcoal-600 hover:underline">
                    עריכה
                  </Link>
                  <DeleteProductButton id={p.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-heading text-base font-semibold text-charcoal-900">קטלוג הדמו (לקריאה בלבד)</h2>
        <p className="mb-3 text-sm text-charcoal-500">
          {seedProducts.length} מוצרים שנטענו מראש כנתוני הדגמה — אלו אינם ניתנים לעריכה דרך הממשק (מוגדרים בקוד ב-
          <code className="mx-1 rounded bg-sand-100 px-1 py-0.5 text-xs">lib/data/products.ts</code>).
        </p>
      </div>
    </div>
  );
}
