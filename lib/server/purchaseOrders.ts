import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId } from "@/lib/utils";
import type { PurchaseOrder, PurchaseOrderStatus } from "@/lib/types";

const FILE = "purchase-orders.json";

export function getPurchaseOrders(): PurchaseOrder[] {
  return readJson<PurchaseOrder[]>(FILE, []).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getPurchaseOrderById(id: string): PurchaseOrder | undefined {
  return getPurchaseOrders().find((po) => po.id === id);
}

export interface PurchaseOrderInput {
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  supplierWhatsapp: string;
  productName: string;
  costPrice: number;
  quantity: number;
  deliveryAddress: string;
  notes?: string;
}

let poCounter = 1000;

export function createPurchaseOrder(input: PurchaseOrderInput): PurchaseOrder {
  const all = readJson<PurchaseOrder[]>(FILE, []);
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
  writeJson(FILE, [...all, po]);
  return po;
}

export function updatePurchaseOrderStatus(
  id: string,
  status: PurchaseOrderStatus,
  sentVia?: "whatsapp" | "email",
): PurchaseOrder | undefined {
  const all = readJson<PurchaseOrder[]>(FILE, []);
  const existing = all.find((po) => po.id === id);
  if (!existing) return undefined;
  const updated: PurchaseOrder = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
    sentAt: status === "sent" && !existing.sentAt ? new Date().toISOString() : existing.sentAt,
    sentVia: sentVia ? Array.from(new Set([...(existing.sentVia ?? []), sentVia])) : existing.sentVia,
  };
  writeJson(
    FILE,
    all.map((po) => (po.id === id ? updated : po)),
  );
  return updated;
}

export function deletePurchaseOrder(id: string): boolean {
  const all = readJson<PurchaseOrder[]>(FILE, []);
  const next = all.filter((po) => po.id !== id);
  const changed = next.length !== all.length;
  if (changed) writeJson(FILE, next);
  return changed;
}
