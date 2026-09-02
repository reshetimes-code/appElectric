import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId } from "@/lib/utils";
import type { Supplier } from "@/lib/types";

const FILE = "suppliers.json";

export function getSuppliers(): Supplier[] {
  return readJson<Supplier[]>(FILE, []);
}

export function getSupplierById(id: string): Supplier | undefined {
  return getSuppliers().find((s) => s.id === id);
}

export interface SupplierInput {
  name: string;
  email: string;
  whatsapp: string;
}

export function createSupplier(input: SupplierInput): Supplier {
  const all = getSuppliers();
  const supplier: Supplier = { id: genId("sup"), ...input, createdAt: new Date().toISOString() };
  writeJson(FILE, [...all, supplier]);
  return supplier;
}

export function deleteSupplier(id: string): boolean {
  const all = getSuppliers();
  const next = all.filter((s) => s.id !== id);
  const changed = next.length !== all.length;
  if (changed) writeJson(FILE, next);
  return changed;
}
