import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateSiteContent } from "@/lib/server/siteContent";
import { isValidImageKey, isValidTextKey } from "@/lib/siteContent";

const IMAGE_URL = /^(\/images\/[\w./-]+|https:\/\/storage\.googleapis\.com\/appelectric-510209-uploads\/[\w./-]+)$/;
const MAX_TEXT = 2000;

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  const images: Record<string, string | null> = {};
  for (const [key, value] of Object.entries(body.images ?? {})) {
    if (!isValidImageKey(key)) return NextResponse.json({ error: `שדה תמונה לא מוכר: ${key}` }, { status: 400 });
    if (value !== null && (typeof value !== "string" || !IMAGE_URL.test(value))) {
      return NextResponse.json({ error: "כתובת תמונה לא תקינה" }, { status: 400 });
    }
    images[key] = value as string | null;
  }

  const texts: Record<string, string | null> = {};
  for (const [key, value] of Object.entries(body.texts ?? {})) {
    if (!isValidTextKey(key)) return NextResponse.json({ error: `שדה טקסט לא מוכר: ${key}` }, { status: 400 });
    if (value !== null && typeof value !== "string") return NextResponse.json({ error: "טקסט לא תקין" }, { status: 400 });
    if (typeof value === "string" && value.length > MAX_TEXT) {
      return NextResponse.json({ error: `הטקסט ארוך מדי (מקסימום ${MAX_TEXT} תווים)` }, { status: 400 });
    }
    texts[key] = value as string | null;
  }

  const content = await updateSiteContent({ images, texts });
  revalidatePath("/", "layout");
  return NextResponse.json({ content });
}
