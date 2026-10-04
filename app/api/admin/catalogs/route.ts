import { NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import { genId } from "@/lib/utils";
import { addCatalog } from "@/lib/server/catalogs";

const BUCKET = "appelectric-510209-uploads";
const MAX_SIZE = 30 * 1024 * 1024; // Cloud Run request bodies are capped at 32MB
const storage = new Storage({ projectId: "appelectric-510209" });

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const title = String(formData.get("title") ?? "").trim();

  if (!title) return NextResponse.json({ error: "יש להזין שורת טקסט שתופיע מעל ה-PDF" }, { status: 400 });
  if (title.length > 300) return NextResponse.json({ error: "שורת הטקסט ארוכה מדי (מקסימום 300 תווים)" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "לא נשלח קובץ" }, { status: 400 });
  if (file.type !== "application/pdf") return NextResponse.json({ error: "יש להעלות קובץ PDF בלבד" }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "הקובץ גדול מדי (מקסימום 30MB)" }, { status: 400 });

  const id = genId("catalog");
  const filename = `catalogs/${id}.pdf`;
  try {
    await storage.bucket(BUCKET).file(filename).save(Buffer.from(await file.arrayBuffer()), {
      contentType: "application/pdf",
      resumable: false,
    });
    const catalog = { id, title, url: `https://storage.googleapis.com/${BUCKET}/${filename}`, createdAt: new Date().toISOString() };
    await addCatalog(catalog);
    return NextResponse.json({ catalog }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "העלאת הקובץ נכשלה, נסו שוב" }, { status: 502 });
  }
}
