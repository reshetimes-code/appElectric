import { readJson, writeJson } from "@/lib/server/fileStore";
import { genId } from "@/lib/utils";
import type { Supplier } from "@/lib/types";

const FILE = "suppliers.json";

export async function getSuppliers(): Promise<Supplier[]> {
  return readJson<Supplier[]>(FILE, []);
}

export async function getSupplierById(id: string): Promise<Supplier | undefined> {
  return (await getSuppliers()).find((s) => s.id === id);
}

export interface SupplierInput {
  name: string;
  email: string;
  whatsapp: string;
}

export async function createSupplier(input: SupplierInput): Promise<Supplier> {
  const all = await getSuppliers();
  const supplier: Supplier = { id: genId("sup"), ...input, createdAt: new Date().toISOString() };
  await writeJson(FILE, [...all, supplier]);
  return supplier;
}

export async function deleteSupplier(id: string): Promise<boolean> {
  const all = await getSuppliers();
  const next = all.filter((s) => s.id !== id);
  const changed = next.length !== all.length;
  if (changed) await writeJson(FILE, next);
  return changed;
}
