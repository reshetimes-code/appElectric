"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Tag, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ApplianceArt } from "@/components/product/ApplianceArt";
import { useCart } from "@/lib/context/CartContext";
import { useCatalog } from "@/lib/context/CatalogContext";
import { formatPrice } from "@/lib/utils";

const VALID_COUPON = "APPELECTRIC10";

export default function CartPage() {
  const cart = useCart();
  const { getProductsByIds } = useCatalog();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  if (!cart.hydrated) return null;

  const productMap = new Map(getProductsByIds(cart.lines.map((l) => l.productId)).map((p) => [p.id, p]));
  const discount = appliedCoupon ? Math.round(cart.subtotal * 0.1) : 0;
  const total = cart.subtotal - discount;

  function applyCoupon() {
    if (couponInput.trim().toUpperCase() === VALID_COUPON) {
      setAppliedCoupon(VALID_COUPON);
      setCouponError("");
    } else {
      setCouponError("קוד קופון לא תקין.");
    }
  }

  if (cart.lines.length === 0) {
    return (
      <Container className="flex flex-col items-center gap-3 py-24 text-center">
        <ShoppingBag size={32} className="text-charcoal-300" />
        <p className="font-heading text-lg font-semibold text-charcoal-800">העגלה שלכם ריקה</p>
        <p className="text-sm text-charcoal-500">גלו את קולקציית הפרימיום שלנו והתחילו לקנות.</p>
        <Button href="/shop" className="mt-2">מעבר לחנות</Button>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-8 sm:py-10">
      <h1 className="font-heading text-2xl font-semibold text-charcoal-900 sm:text-3xl">עגלת קניות</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {cart.lines.map((line) => {
            const product = productMap.get(line.productId);
            if (!product) return null;
            const servicesTotal = line.services.reduce((s, sv) => s + sv.price, 0);
            return (
              <div key={line.id} className="flex gap-4 rounded-[var(--radius-card)] border border-sand-300 p-4">
                <Link href={`/product/${product.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                  {product.images[0] ? (
                    <Image src={product.images[0]} alt={product.nameHe} fill className="object-cover" />
                  ) : (
                    <ApplianceArt kind={product.artKind} className="h-full w-full" />
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {line.bundleId && <span className="mb-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-600">חלק ממארז</span>}
                      <Link href={`/product/${product.slug}`} className="block text-sm font-semibold text-charcoal-900 hover:text-brand-700">
                        {product.nameHe}
                      </Link>
                      <p className="text-xs text-charcoal-500">דגם {product.model}</p>
                    </div>
                    <button
                      onClick={() => cart.removeLine(line.id)}
                      aria-label="הסר מהעגלה"
                      className="rounded-full p-1.5 text-charcoal-400 hover:bg-sand-100 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {line.services.length > 0 && (
                    <ul className="text-xs text-charcoal-500">
                      {line.services.map((s) => (
                        <li key={s.vipServiceId}>+ {s.name} ({s.price > 0 ? formatPrice(s.price) : "ללא עלות"})</li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border border-sand-300">
                      <button
                        onClick={() => cart.setQuantity(line.id, line.quantity - 1)}
                        disabled={line.quantity <= 1}
                        aria-label="הפחת כמות"
                        className="p-2 disabled:opacity-30"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm">{line.quantity}</span>
                      <button onClick={() => cart.setQuantity(line.id, line.quantity + 1)} aria-label="הוסף כמות" className="p-2">
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-heading text-sm font-semibold text-charcoal-900">
                      {formatPrice((product.price + servicesTotal) * line.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={cart.clear} className="self-start text-sm text-charcoal-400 hover:text-red-500">
            רוקן עגלה
          </button>
        </div>

        <aside className="h-fit flex flex-col gap-4 rounded-[var(--radius-card)] border border-sand-300 bg-sand-50 p-5">
          <h2 className="font-heading text-lg font-semibold text-charcoal-900">סיכום הזמנה</h2>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-charcoal-400" />
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="קוד קופון"
                className="h-10 w-full rounded-[var(--radius-control)] border border-sand-300 bg-white ps-9 pe-3 text-sm"
              />
            </div>
            <Button onClick={applyCoupon} variant="secondary" size="sm">
              החל
            </Button>
          </div>
          {couponError && <p className="text-xs text-red-500">{couponError}</p>}
          {appliedCoupon && <p className="text-xs text-brand-700">קופון {appliedCoupon} הופעל (10% הנחה)</p>}

          <div className="flex flex-col gap-2 border-t border-sand-300 pt-4 text-sm">
            <div className="flex justify-between text-charcoal-600">
              <span>סכום ביניים</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-700">
                <span>הנחת קופון</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-charcoal-500">
              <Truck size={14} />
              משלוח והתקנה מתואמים לאחר ההזמנה
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-sand-300 pt-4">
            <span className="font-heading text-base font-semibold text-charcoal-900">סה&quot;כ לתשלום</span>
            <span className="font-heading text-xl font-bold text-charcoal-900">{formatPrice(total)}</span>
          </div>

          <Button href="/checkout" size="lg" fullWidth>
            מעבר לקופה
          </Button>
        </aside>
      </div>
    </Container>
  );
}
