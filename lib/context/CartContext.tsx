"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/lib/hooks/useLocalStorage";
import { useCatalog } from "@/lib/context/CatalogContext";
import { genId } from "@/lib/utils";
import type { CartLine, CartServiceSelection } from "@/lib/types";

interface CartContextValue {
  lines: CartLine[];
  hydrated: boolean;
  addItem: (productId: string, quantity?: number, services?: CartServiceSelection[]) => void;
  addBundle: (bundleId: string, productIds: string[]) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines, hydrated] = useLocalStorage<CartLine[]>("appelectric:cart", []);
  const { getProductsByIds } = useCatalog();

  const addItem: CartContextValue["addItem"] = (productId, quantity = 1, services = []) => {
    setLines((prev) => {
      const signature = services.map((s) => s.vipServiceId).sort().join(",");
      const existing = prev.find(
        (l) => l.productId === productId && !l.bundleId && l.services.map((s) => s.vipServiceId).sort().join(",") === signature,
      );
      if (existing) {
        return prev.map((l) => (l.id === existing.id ? { ...l, quantity: l.quantity + quantity } : l));
      }
      return [...prev, { id: genId("line"), productId, quantity, services }];
    });
  };

  const addBundle: CartContextValue["addBundle"] = (bundleId, productIds) => {
    setLines((prev) => [
      ...prev,
      ...productIds.map((productId) => ({
        id: genId("line"),
        productId,
        quantity: 1,
        services: [] as CartServiceSelection[],
        bundleId,
      })),
    ]);
  };

  const removeLine = (lineId: string) => setLines((prev) => prev.filter((l) => l.id !== lineId));

  const setQuantity = (lineId: string, quantity: number) =>
    setLines((prev) => prev.map((l) => (l.id === lineId ? { ...l, quantity: Math.max(1, quantity) } : l)));

  const clear = () => setLines([]);

  const { count, subtotal } = useMemo(() => {
    const productMap = new Map(getProductsByIds(lines.map((l) => l.productId)).map((p) => [p.id, p]));
    let count = 0;
    let subtotal = 0;
    for (const line of lines) {
      const product = productMap.get(line.productId);
      if (!product) continue;
      count += line.quantity;
      subtotal += product.price * line.quantity;
      subtotal += line.services.reduce((sum, s) => sum + s.price, 0) * line.quantity;
    }
    return { count, subtotal };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  const value: CartContextValue = {
    lines,
    hydrated,
    addItem,
    addBundle,
    removeLine,
    setQuantity,
    clear,
    count,
    subtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
