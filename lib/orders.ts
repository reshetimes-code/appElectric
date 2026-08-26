"use client";

import { genId } from "@/lib/utils";
import type { CartLine } from "@/lib/types";

const KEY = "appelectric:orders";

export interface DemoOrder {
  orderNumber: string;
  createdAt: string;
  lines: CartLine[];
  subtotal: number;
  deliveryOption: string;
  customer: { name: string; phone: string; email?: string; address: string; city: string };
  notes?: string;
}

// Demo/dev checkout — no live payment gateway is connected (see build plan Phase C).
// The order is generated and persisted locally so the confirmation flow is fully real
// end-to-end without implying an actual charge occurred.
export function saveOrder(order: Omit<DemoOrder, "orderNumber" | "createdAt">): DemoOrder {
  const full: DemoOrder = {
    ...order,
    orderNumber: genId("AE").toUpperCase(),
    createdAt: new Date().toISOString(),
  };
  try {
    const raw = window.localStorage.getItem(KEY);
    const existing: DemoOrder[] = raw ? JSON.parse(raw) : [];
    window.localStorage.setItem(KEY, JSON.stringify([...existing, full]));
  } catch {
    // ignore
  }
  return full;
}

export function getOrder(orderNumber: string): DemoOrder | undefined {
  try {
    const raw = window.localStorage.getItem(KEY);
    const existing: DemoOrder[] = raw ? JSON.parse(raw) : [];
    return existing.find((o) => o.orderNumber === orderNumber);
  } catch {
    return undefined;
  }
}
