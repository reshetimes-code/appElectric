import { NextResponse } from "next/server";
import { updateProductDetails } from "@/lib/server/adminProducts";
import type { ProductDetailOverride } from "@/lib/server/productDetailOverrides";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as ProductDetailOverride;
  const product = await updateProductDetails(id, body);
  if (!product) return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
  return NextResponse.json({ product });
}
