"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";
import { vipServices } from "@/lib/data/vipServices";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const [selected, setSelected] = useState<string[]>([]);
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const outOfStock = product.availabilityStatus === "out-of-stock";

  const services = vipServices
    .filter((s) => selected.includes(s.id))
    .map((s) => ({ vipServiceId: s.id, name: s.name, price: s.price }));

  function addToCart() {
    cart.addItem(product.id, 1, services);
    toast.show(`${product.nameHe} נוסף לסל`);
  }

  function buyNow() {
    cart.addItem(product.id, 1, services);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
      {vipServices.length > 0 && (
        <div className="rounded-[var(--radius-card)] border border-sand-300 p-4">
          <p className="mb-2 text-sm font-semibold text-charcoal-900">שירותי VIP נלווים (אופציונלי)</p>
          <div className="flex flex-col gap-2">
            {vipServices.map((s) => (
              <label key={s.id} className="flex cursor-pointer items-start gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={selected.includes(s.id)}
                  onChange={() =>
                    setSelected((prev) => (prev.includes(s.id) ? prev.filter((id) => id !== s.id) : [...prev, s.id]))
                  }
                  className="mt-0.5 h-4 w-4 rounded border-sand-400 text-brand-600"
                />
                <span className="flex-1">
                  <span className="block text-charcoal-800">{s.name}</span>
                  <span className="block text-xs text-charcoal-500">{s.description}</span>
                </span>
                <span className="shrink-0 text-xs font-medium text-charcoal-600">{s.price > 0 ? formatPrice(s.price) : "ללא עלות"}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={addToCart} disabled={outOfStock} size="lg" fullWidth>
          <ShoppingBag size={17} />
          הוסף לסל
        </Button>
        <Button onClick={buyNow} disabled={outOfStock} variant="dark" size="lg" fullWidth>
          <Zap size={17} />
          קנייה מיידית
        </Button>
      </div>
      <Button
        href={`https://wa.me/972500000000?text=${encodeURIComponent(`שלום, אשמח לייעוץ VIP לגבי ${product.nameHe} דגם ${product.model}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        variant="secondary"
        fullWidth
      >
        ייעוץ VIP בוואטסאפ על מוצר זה
      </Button>
    </div>
  );
}
