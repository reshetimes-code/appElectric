import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId } from "@/lib/utils";
import { getAllProducts } from "@/lib/server/adminProducts";
import { sendNewOrderEmail } from "@/lib/server/email";
import type { CustomerOrder, CartLine, OrderStatus } from "@/lib/types";

const FILE = "orders.json";

export async function getOrders(): Promise<CustomerOrder[]> {
  return (await readJson<CustomerOrder[]>(FILE, [])).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getOrderByNumber(orderNumber: string): Promise<CustomerOrder | undefined> {
  return (await getOrders()).find((o) => o.orderNumber === orderNumber);
}

export async function getOrderById(id: string): Promise<CustomerOrder | undefined> {
  return (await getOrders()).find((o) => o.id === id);
}

export interface OrderInput {
  lines: CartLine[];
  subtotal: number;
  deliveryOption: string;
  customer: { name: string; phone: string; email?: string; address: string; city: string };
  notes?: string;
}

export async function createOrder(input: OrderInput): Promise<CustomerOrder> {
  const all = await readJson<CustomerOrder[]>(FILE, []);
  const order: CustomerOrder = {
    id: genId("order"),
    orderNumber: genId("AE").toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...input,
  };
  await writeJson(FILE, [...all, order]);

  // Fire-and-forget: never let a slow/failed email delay or fail the checkout.
  getAllProducts()
    .then((products) => sendNewOrderEmail(order, new Map(products.map((p) => [p.id, p.nameHe]))))
    .catch((err) => console.error("[orders] failed to send new-order admin email:", err));

  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<CustomerOrder | undefined> {
  const all = await readJson<CustomerOrder[]>(FILE, []);
  const existing = all.find((o) => o.id === id);
  if (!existing) return undefined;
  const updated = { ...existing, status };
  await writeJson(
    FILE,
    all.map((o) => (o.id === id ? updated : o)),
  );
  return updated;
}
