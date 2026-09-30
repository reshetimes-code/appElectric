import { NextResponse } from "next/server";
import { validateProductSize, saveFailedResponse } from "@/lib/server/productValidation";
import { updateAdminProduct, deleteAnyProduct, type AdminProductInput } from "@/lib/server/adminProducts";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as AdminProductInput;
  const sizeError = validateProductSize(body);
  if (sizeError) return NextResponse.json({ error: sizeError }, { status: 400 });
  try {
    const product = await updateAdminProduct(id, body);
    if (!product) return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    return saveFailedResponse(e);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteAnyProduct(id);
  if (!ok) return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
