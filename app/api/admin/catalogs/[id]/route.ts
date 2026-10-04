import { NextResponse } from "next/server";
import { deleteCatalog, setCatalogCover } from "@/lib/server/catalogs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { coverUrl } = (await request.json().catch(() => ({}))) as { coverUrl?: string };
  if (!coverUrl || !coverUrl.startsWith("https://storage.googleapis.com/appelectric-510209-uploads/")) {
    return NextResponse.json({ error: "תמונה לא תקינה" }, { status: 400 });
  }
  const ok = await setCatalogCover(id, coverUrl);
  if (!ok) return NextResponse.json({ error: "קטלוג לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteCatalog(id);
  if (!ok) return NextResponse.json({ error: "קטלוג לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
