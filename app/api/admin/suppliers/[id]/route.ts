import { NextResponse } from "next/server";
import { deleteSupplier } from "@/lib/server/suppliers";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteSupplier(id);
  if (!ok) return NextResponse.json({ error: "ספק לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
