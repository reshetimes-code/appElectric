import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId } from "@/lib/utils";
import type { CustomerOrder, CartLine, OrderStatus } from "@/lib/types";

const FILE = "orders.json";

export function getOrders(): CustomerOrder[] {
  return readJson<CustomerOrder[]>(FILE, []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getOrderByNumber(orderNumber: string): CustomerOrder | undefined {
  return getOrders().find((o) => o.orderNumber === orderNumber);
}

export function getOrderById(id: string): CustomerOrder | undefined {
  return getOrders().find((o) => o.id === id);
}

export interface OrderInput {
  lines: CartLine[];
  subtotal: number;
  deliveryOption: string;
  customer: { name: string; phone: string; email?: string; address: string; city: string };
  notes?: string;
}

export function createOrder(input: OrderInput): CustomerOrder {
  const all = readJson<CustomerOrder[]>(FILE, []);
  const order: CustomerOrder = {
    id: genId("order"),
    orderNumber: genId("AE").toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...input,
  };
  writeJson(FILE, [...all, order]);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus): CustomerOrder | undefined {
  const all = readJson<CustomerOrder[]>(FILE, []);
  const existing = all.find((o) => o.id === id);
  if (!existing) return undefined;
  const updated = { ...existing, status };
  writeJson(
    FILE,
    all.map((o) => (o.id === id ? updated : o)),
  );
  return updated;
}
