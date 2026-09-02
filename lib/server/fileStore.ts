import fs from "node:fs";
import path from "node:path";

// Guards against accidental import from client bundles (fs isn't available there).
if (typeof window !== "undefined") {
  throw new Error("lib/server/fileStore.ts must only be imported from server code");
}

// Simple JSON-file-backed persistence for the admin area (products, suppliers,
// purchase orders). This suits the current single-instance local/VM deployment —
// it needs a writable, persistent filesystem, so it will NOT work as-is on
// typical serverless/edge hosts (e.g. Vercel's read-only filesystem outside
// /tmp). Swapping this module for a real database (Postgres/Prisma) is the
// Phase C upgrade; nothing above this layer (API routes, admin UI) would need
// to change since they only call the typed functions in lib/server/*.

const STORE_DIR = path.join(process.cwd(), "data-store");

function ensureStoreDir() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
}

export function readJson<T>(filename: string, fallback: T): T {
  ensureStoreDir();
  const file = path.join(STORE_DIR, filename);
  if (!fs.existsSync(file)) return fallback;
  try {
    const raw = fs.readFileSync(file, "utf8");
    return raw.trim() ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(filename: string, data: T): void {
  ensureStoreDir();
  const file = path.join(STORE_DIR, filename);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}
