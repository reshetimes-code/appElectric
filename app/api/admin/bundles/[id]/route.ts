import { NextResponse } from "next/server";
import { MAX_BUNDLE_ITEMS } from "@/lib/bundleLimits";
import { updateBundle, deleteBundle, type BundleInput } from "@/lib/server/adminBundles";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as BundleInput;
  if (!body.nameHe?.trim()) {
    return NextResponse.json({ error: "יש למלא שם לסט" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "יש להוסיף לפחות מוצר אחד לסט" }, { status: 400 });
  }
  if (body.items.length > MAX_BUNDLE_ITEMS) {
    return NextResponse.json({ error: `אפשר להוסיף עד ${MAX_BUNDLE_ITEMS} מוצרים לסט` }, { status: 400 });
  }
  if (body.coverUrl && !body.coverUrl.startsWith("https://storage.googleapis.com/appelectric-510209-uploads/")) {
    return NextResponse.json({ error: "תמונת הסט לא תקינה" }, { status: 400 });
  }
  const bundle = await updateBundle(id, body);
  if (!bundle) return NextResponse.json({ error: "סט לא נמצא" }, { status: 404 });
  return NextResponse.json({ bundle });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteBundle(id);
  if (!ok) return NextResponse.json({ error: "סט לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
