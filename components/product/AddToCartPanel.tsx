"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";
import type { Product } from "@/lib/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const outOfStock = product.availabilityStatus === "out-of-stock";

  function addToCart() {
    cart.addItem(product.id, 1);
    toast.show(`${product.nameHe} נוסף לסל`);
  }

  function buyNow() {
    cart.addItem(product.id, 1);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
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
