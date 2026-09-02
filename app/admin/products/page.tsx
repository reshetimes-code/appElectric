import Link from "next/link";
import Image from "next/image";
import { Plus, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/product/AvailabilityBadge";
import { getAdminProducts, getAllProducts } from "@/lib/server/adminProducts";
import { formatPrice } from "@/lib/utils";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const adminProducts = getAdminProducts();
  const allProducts = getAllProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal-900">מוצרים</h1>
          <p className="mt-1 text-sm text-charcoal-500">{allProducts.length} מוצרים בקטלוג ({adminProducts.length} שהוספת בעצמך)</p>
        </div>
        <Button href="/admin/products/new">
          <Plus size={17} />
          הוספת מוצר חדש
        </Button>
      </div>

      <p className="rounded-[var(--radius-control)] bg-brand-50 p-3 text-sm text-charcoal-700">
        לכל מוצר — כולל 68 מוצרי הדמו — אפשר ללחוץ <strong>&quot;תמונות&quot;</strong> כדי להעלות תמונות אמיתיות משלכם.
        זה לא נוגע לשום שדה אחר של המוצר. עריכה מלאה של שאר הפרטים זמינה רק למוצרים שהוספתם בעצמכם.
      </p>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-sand-300 bg-white">
        {allProducts.map((p) => {
          const isAdminOwned = p.id.startsWith("admin-");
          return (
            <div key={p.id} className="flex flex-col gap-3 border-b border-sand-200 p-4 last:border-none sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-3 sm:contents">
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
                  <p className="text-xs text-charcoal-500">
                    מק&quot;ט {p.sku} {isAdminOwned && <span className="text-brand-600">· נוסף על ידך</span>}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                <AvailabilityBadge status={p.availabilityStatus} />
                <p className="text-sm font-semibold text-charcoal-900 sm:w-24 sm:text-start">{formatPrice(p.price)}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:shrink-0">
                <Link href={`/product/${p.slug}`} target="_blank" className="text-sm text-brand-700 hover:underline">
                  צפייה
                </Link>
                <Link href={`/admin/products/${p.id}/images`} className="text-sm text-charcoal-600 hover:underline">
                  תמונות
                </Link>
                {isAdminOwned && (
                  <>
                    <Link href={`/admin/products/${p.id}/edit`} className="text-sm text-charcoal-600 hover:underline">
                      עריכה מלאה
                    </Link>
                    <DeleteProductButton id={p.id} />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
