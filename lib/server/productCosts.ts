import { readJson, writeJson } from "@/lib/server/fileStore";

const FILE = "product-costs.json";

/** The owner's private purchase cost per product, keyed by product id. Kept apart
 * from the Product record on purpose: Product objects are rendered by public pages
 * and passed to client components, so a cost on them could leak to customers.
 * Only admin pages/routes read this. */
export async function getProductCosts(): Promise<Record<string, number>> {
  return readJson<Record<string, number>>(FILE, {});
}

export async function setProductCost(id: string, cost: number | undefined): Promise<void> {
  const all = await getProductCosts();
  if (cost === undefined || !Number.isFinite(cost) || cost <= 0) {
    if (!(id in all)) return;
    delete all[id];
  } else {
    all[id] = cost;
  }
  await writeJson(FILE, all);
}
