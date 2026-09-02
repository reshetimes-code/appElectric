import { NextResponse } from "next/server";
import { updateProductImages } from "@/lib/server/adminProducts";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { images: string[] };
  if (!Array.isArray(body.images)) {
    return NextResponse.json({ error: "רשימת תמונות לא תקינה" }, { status: 400 });
  }
  const product = updateProductImages(id, body.images);
  if (!product) return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
  return NextResponse.json({ product });
}
