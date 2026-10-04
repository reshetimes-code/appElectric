import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { CATALOG_BUCKET, CATALOG_CHUNK_BYTES, CATALOG_MAX_CHUNKS, isValidUploadId } from "@/lib/server/catalogUpload";

// One slice of a large catalog PDF. Cloud Run rejects request bodies over ~32MB
// (and the middleware buffers only ~10MB), so the browser sends the file in small
// slices; they're stitched together server-side by the finalize call in ../route.ts.
const storage = new Storage({ projectId: "appelectric-510209" });

export async function POST(request: Request) {
  const url = new URL(request.url);
  const uploadId = url.searchParams.get("uploadId") ?? "";
  const index = Number(url.searchParams.get("index"));

  if (!isValidUploadId(uploadId) || !Number.isInteger(index) || index < 0 || index >= CATALOG_MAX_CHUNKS) {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const buffer = Buffer.from(await request.arrayBuffer());
  if (buffer.length === 0 || buffer.length > CATALOG_CHUNK_BYTES * 2) {
    return NextResponse.json({ error: "חלק קובץ לא תקין" }, { status: 400 });
  }
  if (index === 0 && buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json({ error: "הקובץ אינו PDF תקין" }, { status: 400 });
  }

  try {
    await storage
      .bucket(CATALOG_BUCKET)
      .file(`catalogs/tmp/${uploadId}/${String(index).padStart(5, "0")}`)
      .save(buffer, { contentType: "application/octet-stream", resumable: false });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "העלאת חלק מהקובץ נכשלה" }, { status: 502 });
  }
}
