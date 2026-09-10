import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { genId } from "@/lib/utils";

// Product image uploads go to Cloud Storage, not local disk: Cloud Run
// instances have no shared/persistent writable filesystem (same reason the
// rest of the data layer moved to Firestore — see lib/server/fileStore.ts),
// so a file saved to public/uploads/ would only exist on the one container
// instance that handled the request and vanish on the next restart/scale
// event, or simply not be visible to other instances serving reads.
const BUCKET = "appelectric-uploads";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

const storage = new Storage({ projectId: "appelectric" });

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "לא נשלח קובץ" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "סוג קובץ לא נתמך — יש להעלות JPG, PNG, WEBP או GIF" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "הקובץ גדול מדי (מקסימום 8MB)" }, { status: 400 });
  }

  // Filename is entirely server-generated (never derived from the client's
  // original filename), so there's no path-traversal surface here.
  const ext = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const filename = `products/${genId("img")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    await storage.bucket(BUCKET).file(filename).save(buffer, {
      contentType: file.type,
      resumable: false,
    });
  } catch {
    return NextResponse.json({ error: "העלאת הקובץ נכשלה, נסו שוב" }, { status: 502 });
  }

  return NextResponse.json({ url: `https://storage.googleapis.com/${BUCKET}/${filename}` });
}
