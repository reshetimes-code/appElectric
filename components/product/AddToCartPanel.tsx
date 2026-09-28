"use client";

import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";
import type { Product } from "@/lib/types";

export function AddToCartPanel({ product }: { product: Product }) {
  const cart = useCart();
  const toast = useToast();
  const router = useRouter();
  const outOfStock = product.availabilityStatus === "out-of-stock";
  const callMeBack = product.availabilityStatus === "call-me-back";

  function addToCart() {
    cart.addItem(product.id, 1);
    toast.show(`${product.nameHe} נוסף לסל`);
  }

  function buyNow() {
    cart.addItem(product.id, 1);
    router.push("/checkout");
  }

  if (callMeBack) {
    return (
      <Button
        href={`https://wa.me/972524094468?text=${encodeURIComponent(`שלום, אשמח לפרטים ומחיר לגבי ${product.nameHe} דגם ${product.model}.`)}`}
        target="_blank"
        rel="noopener noreferrer"
        size="lg"
        fullWidth
      >
        <MessageCircle size={17} />
        צרו קשר לגבי מוצר זה
      </Button>
    );
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
