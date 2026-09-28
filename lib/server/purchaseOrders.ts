import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId } from "@/lib/utils";
import type { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from "@/lib/types";

const FILE = "purchase-orders.json";

// Purchase orders used to hold a single product (flat productName/costPrice/
// quantity fields) before multi-item orders were supported. Existing records
// in Firestore are still in that shape — this upgrades them to `items` on
// read, without touching what's stored, so old orders keep displaying and
// sending correctly.
type StoredPurchaseOrder = Omit<PurchaseOrder, "items"> & {
  items?: PurchaseOrderItem[];
  productName?: string;
  costPrice?: number;
  quantity?: number;
};

function normalize(raw: StoredPurchaseOrder): PurchaseOrder {
  if (raw.items?.length) return raw as PurchaseOrder;
  const { productName, costPrice, quantity, ...rest } = raw;
  return {
    ...rest,
    items: [{ productName: productName ?? "", costPrice: costPrice ?? 0, quantity: quantity ?? 1 }],
  };
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
  const all = await readJson<StoredPurchaseOrder[]>(FILE, []);
  return all.map(normalize).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder | undefined> {
  return (await getPurchaseOrders()).find((po) => po.id === id);
}

export interface PurchaseOrderInput {
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierWhatsapp: string;
  items: PurchaseOrderItem[];
  deliveryAddress: string;
  notes?: string;
}

let poCounter = 1000;

export async function createPurchaseOrder(input: PurchaseOrderInput): Promise<PurchaseOrder> {
  const all = await readJson<StoredPurchaseOrder[]>(FILE, []);
  poCounter = Math.max(poCounter, all.length + 1000);
  const now = new Date().toISOString();
  const po: PurchaseOrder = {
    id: genId("po"),
    poNumber: `PO-${poCounter + 1}`,
    ...input,
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  await writeJson(FILE, [...all, po]);
  return po;
}

export async function updatePurchaseOrderStatus(
  id: string,
  status: PurchaseOrderStatus,
  sentVia?: "whatsapp" | "email",
): Promise<PurchaseOrder | undefined> {
  const all = await readJson<StoredPurchaseOrder[]>(FILE, []);
  const existing = all.find((po) => po.id === id);
  if (!existing) return undefined;
  const updated: StoredPurchaseOrder = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
    sentAt: status === "sent" && !existing.sentAt ? new Date().toISOString() : existing.sentAt,
    sentVia: sentVia ? Array.from(new Set([...(existing.sentVia ?? []), sentVia])) : existing.sentVia,
  };
  await writeJson(
    FILE,
    all.map((po) => (po.id === id ? updated : po)),
  );
  return normalize(updated);
}

export async function deletePurchaseOrder(id: string): Promise<boolean> {
  const all = await readJson<StoredPurchaseOrder[]>(FILE, []);
  const next = all.filter((po) => po.id !== id);
  const changed = next.length !== all.length;
  if (changed) await writeJson(FILE, next);
  return changed;
}
