import { NextResponse } from "next/server";
import { Storage, type File } from "@google-cloud/storage";
import { genId } from "@/lib/utils";
import { addCatalog } from "@/lib/server/catalogs";
import { CATALOG_BUCKET, CATALOG_MAX_BYTES, CATALOG_MAX_CHUNKS, isValidUploadId } from "@/lib/server/catalogUpload";

const storage = new Storage({ projectId: "appelectric-510209" });
const COMPOSE_LIMIT = 32; // Cloud Storage composes at most 32 objects per call

/** Finalizes a chunked upload (see ./chunk/route.ts): joins the slices into one PDF and registers it. */
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { uploadId?: string; chunks?: number; title?: string };
  const title = String(body.title ?? "").trim();
  const uploadId = body.uploadId ?? "";
  const chunks = Number(body.chunks);

  if (!title) return NextResponse.json({ error: "יש להזין שורת טקסט שתופיע מעל ה-PDF" }, { status: 400 });
  if (title.length > 300) return NextResponse.json({ error: "שורת הטקסט ארוכה מדי (מקסימום 300 תווים)" }, { status: 400 });
  if (!isValidUploadId(uploadId) || !Number.isInteger(chunks) || chunks < 1 || chunks > CATALOG_MAX_CHUNKS) {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const bucket = storage.bucket(CATALOG_BUCKET);
  const tmpPrefix = `catalogs/tmp/${uploadId}/`;
  const id = genId("catalog");
  const filename = `catalogs/${id}.pdf`;

  try {
    let parts: File[] = [];
    for (let i = 0; i < chunks; i++) parts.push(bucket.file(`${tmpPrefix}${String(i).padStart(5, "0")}`));

    // More than 32 slices: compose in rounds through intermediate objects.
    let round = 0;
    while (parts.length > COMPOSE_LIMIT) {
      const next: File[] = [];
      for (let i = 0; i < parts.length; i += COMPOSE_LIMIT) {
        const merged = bucket.file(`${tmpPrefix}r${round}-${i / COMPOSE_LIMIT}`);
        await bucket.combine(parts.slice(i, i + COMPOSE_LIMIT), merged);
        next.push(merged);
      }
      parts = next;
      round++;
    }

    const final = bucket.file(filename);
    if (parts.length === 1) await parts[0].copy(final);
    else await bucket.combine(parts, final);

    const [meta] = await final.getMetadata();
    if (Number(meta.size) > CATALOG_MAX_BYTES) {
      await final.delete().catch(() => {});
      return NextResponse.json({ error: "הקובץ גדול מדי (מקסימום 500MB)" }, { status: 400 });
    }
    await final.setMetadata({ contentType: "application/pdf" });
    await bucket.deleteFiles({ prefix: tmpPrefix }).catch(() => {});

    const catalog = { id, title, url: `https://storage.googleapis.com/${CATALOG_BUCKET}/${filename}`, createdAt: new Date().toISOString() };
    await addCatalog(catalog);
    return NextResponse.json({ catalog }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "חיבור הקובץ נכשל, נסו שוב" }, { status: 502 });
  }
}
