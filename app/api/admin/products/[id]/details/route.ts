import { NextResponse } from "next/server";
import { validateProductSize, saveFailedResponse } from "@/lib/server/productValidation";
import { setProductCost } from "@/lib/server/productCosts";
import { updateProductDetails } from "@/lib/server/adminProducts";
import type { ProductDetailOverride } from "@/lib/server/productDetailOverrides";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { myCost, ...body } = (await request.json()) as ProductDetailOverride & { myCost?: number };
  const sizeError = validateProductSize(body);
  if (sizeError) return NextResponse.json({ error: sizeError }, { status: 400 });
  try {
    const product = await updateProductDetails(id, body);
    if (!product) return NextResponse.json({ error: "מוצר לא נמצא" }, { status: 404 });
    await setProductCost(id, myCost);
    return NextResponse.json({ product });
  } catch (e) {
    return saveFailedResponse(e);
  }
}
