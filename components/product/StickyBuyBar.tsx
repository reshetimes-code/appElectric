"use client";

import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";
import type { Product } from "@/lib/types";

export function StickyBuyBar({ product }: { product: Product }) {
  const cart = useCart();
  const toast = useToast();
  const outOfStock = product.availabilityStatus === "out-of-stock";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-sand-300 bg-white/95 p-3 backdrop-blur pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-charcoal-500">{product.nameHe}</p>
        <p className="font-heading text-lg font-semibold text-charcoal-900">{formatPrice(product.price)}</p>
      </div>
      <button
        type="button"
        disabled={outOfStock}
        onClick={() => {
          cart.addItem(product.id, 1);
          toast.show(`${product.nameHe} נוסף לסל`);
        }}
        className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-6 text-sm font-medium text-white disabled:opacity-40"
      >
        <ShoppingBag size={17} />
        {outOfStock ? "אזל מהמלאי" : "הוסף לסל"}
      </button>
    </div>
  );
}
