import { Firestore } from "@google-cloud/firestore";

// Guards against accidental import from client bundles (Firestore isn't available there).
if (typeof window !== "undefined") {
  throw new Error("lib/server/fileStore.ts must only be imported from server code");
}

// Firestore-backed persistence for the admin area (products, suppliers,
// purchase orders, orders, product images). Cloud Run instances have no
// shared/persistent writable filesystem — each instance gets its own
// ephemeral copy and any local writes would be lost on scale-down/restart —
// so this module stores data in Firestore (collection "dataStore", one
// document per former JSON filename) instead of on disk. The Firestore
// Node SDK is async-only, which is why readJson/writeJson are async here:
// every caller (and every caller of those callers) must await them.

const COLLECTION = "dataStore";

const firestore = new Firestore({ projectId: "appelectric" });

function docIdFor(filename: string): string {
  return filename.endsWith(".json") ? filename.slice(0, -".json".length) : filename;
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  const docId = docIdFor(filename);
  const snap = await firestore.collection(COLLECTION).doc(docId).get();
  if (!snap.exists) return fallback;
  const data = snap.data()?.data;
  return (data === undefined ? fallback : data) as T;
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const docId = docIdFor(filename);
  await firestore.collection(COLLECTION).doc(docId).set({ data });
}
