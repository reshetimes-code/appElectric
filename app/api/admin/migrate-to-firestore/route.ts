import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { Firestore } from "@google-cloud/firestore";
import { writeJson } from "@/lib/server/fileStore";

// One-time, protected migration endpoint: copies the bundled seed data-store
// JSON files (data-store/*.json — the real pre-Firestore production data:
// 68 seed products' image overrides, suppliers, purchase orders, customer
// orders, admin-added products) into Firestore. Idempotent — a filename
// whose Firestore doc already exists is skipped, so calling this more than
// once is safe.

const FILES = [
  "admin-products.json",
  "product-images.json",
  "purchase-orders.json",
  "suppliers.json",
  "orders.json",
];

const firestore = new Firestore({ projectId: "appelectric" });

export async function POST(request: Request) {
  const secret = request.headers.get("x-migration-secret");
  if (!secret || secret !== process.env.MIGRATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const STORE_DIR = path.join(process.cwd(), "data-store");
  const result: Record<string, string> = {};

  for (const filename of FILES) {
    const docId = filename.slice(0, -".json".length);
    const existing = await firestore.collection("dataStore").doc(docId).get();
    if (existing.exists) {
      result[filename] = "skipped (already exists)";
      continue;
    }

    const filePath = path.join(STORE_DIR, filename);
    let parsed: unknown = filename === "product-images.json" ? {} : [];
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        if (raw.trim()) parsed = JSON.parse(raw);
      } catch {
        // fall back to the default above
      }
    }

    await writeJson(filename, parsed);
    result[filename] = "migrated";
  }

  return NextResponse.json(result);
}
