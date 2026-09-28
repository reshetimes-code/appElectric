"use client";

import { PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/context/CartContext";
import { useToast } from "@/components/ui/ToastProvider";

export function AddBundleButton({
  bundleId,
  items,
  bundleName,
  disabled,
}: {
  bundleId: string;
  items: { productId: string; price: number }[];
  bundleName: string;
  disabled?: boolean;
}) {
  const cart = useCart();
  const toast = useToast();

  return (
    <Button
      size="lg"
      disabled={disabled}
      onClick={() => {
        cart.addBundle(bundleId, items);
        toast.show(`${bundleName} נוסף לסל`);
      }}
    >
      <PackagePlus size={18} />
      הוסף מארז שלם לסל
    </Button>
  );
}
