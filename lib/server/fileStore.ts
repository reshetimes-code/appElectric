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

// ignoreUndefinedProperties: the app's types have many optional fields
// (compareAtPrice, installmentsMonths, warrantyText...) that legitimately end
// up `undefined` rather than omitted (e.g. `input.compareAtPrice` when the
// admin leaves the sale-price field blank) — without this, Firestore throws
// "Cannot use 'undefined' as a Firestore value" and the whole write (a new
// product, an edited product's details, ...) is silently lost.
const firestore = new Firestore({ projectId: "appelectric-510209", ignoreUndefinedProperties: true });

function docIdFor(filename: string): string {
  return filename.endsWith(".json") ? filename.slice(0, -".json".length) : filename;
}

// Firestore caps a single document at 1MB, and a whole collection (e.g. every
// admin product) is stored as one value — once the catalog grew past that,
// every product save failed with "exceeds the maximum allowed size". Values
// whose JSON is larger than INLINE_LIMIT are therefore split across several
// documents: the main doc holds {chunks: n} and the pieces live in
// "<id>__c0".."<id>__c<n-1>". Small values keep the original {data} shape, so
// existing documents keep working unchanged. The limit is in characters, kept
// well under 1MB because Hebrew text takes 2 bytes per character.
const INLINE_LIMIT = 250_000;
const CHUNK_SIZE = 250_000;

const chunkId = (docId: string, i: number) => `${docId}__c${i}`;

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  const docId = docIdFor(filename);
  const snap = await firestore.collection(COLLECTION).doc(docId).get();
  if (!snap.exists) return fallback;
  const chunks = snap.data()?.chunks;
  if (typeof chunks === "number") {
    const parts = await Promise.all(
      Array.from({ length: chunks }, (_, i) => firestore.collection(COLLECTION).doc(chunkId(docId, i)).get()),
    );
    return JSON.parse(parts.map((p) => p.data()?.text ?? "").join("")) as T;
  }
  const data = snap.data()?.data;
  return (data === undefined ? fallback : data) as T;
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const docId = docIdFor(filename);
  const ref = firestore.collection(COLLECTION).doc(docId);
  const json = JSON.stringify(data);
  const previous = (await ref.get()).data()?.chunks;
  const oldCount = typeof previous === "number" ? previous : 0;

  if (json.length <= INLINE_LIMIT) {
    const batch = firestore.batch();
    batch.set(ref, { data });
    for (let i = 0; i < oldCount; i++) batch.delete(firestore.collection(COLLECTION).doc(chunkId(docId, i)));
    await batch.commit();
    return;
  }

  const count = Math.ceil(json.length / CHUNK_SIZE);
  const batch = firestore.batch();
  for (let i = 0; i < count; i++) {
    batch.set(firestore.collection(COLLECTION).doc(chunkId(docId, i)), {
      text: json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
    });
  }
  batch.set(ref, { chunks: count });
  for (let i = count; i < oldCount; i++) batch.delete(firestore.collection(COLLECTION).doc(chunkId(docId, i)));
  await batch.commit();
}
