import { NextResponse } from "next/server";
import { validateProductSize, saveFailedResponse } from "@/lib/server/productValidation";
import { setProductCost } from "@/lib/server/productCosts";
import { getAdminProducts, createAdminProduct, type AdminProductInput } from "@/lib/server/adminProducts";

export async function GET() {
  return NextResponse.json({ products: await getAdminProducts() });
}

export async function POST(request: Request) {
  const { myCost, ...body } = (await request.json()) as AdminProductInput & { myCost?: number };

  if (!body.nameHe?.trim() || !body.brandId || !body.categoryId || !body.subcategoryId) {
    return NextResponse.json({ error: "יש למלא את כל שדות החובה" }, { status: 400 });
  }
  if (body.availabilityStatus !== "call-me-back" && (!Number.isFinite(body.price) || body.price <= 0)) {
    return NextResponse.json({ error: "מחיר לא תקין" }, { status: 400 });
  }

  const sizeError = validateProductSize(body);
  if (sizeError) return NextResponse.json({ error: sizeError }, { status: 400 });

  try {
    const product = await createAdminProduct({
      ...body,
      images: body.images ?? [],
      stockQuantity: body.stockQuantity ?? 0,
      availabilityStatus: body.availabilityStatus || "in-stock",
    });
    await setProductCost(product.id, myCost);
    return NextResponse.json({ product }, { status: 201 });
  } catch (e) {
    return saveFailedResponse(e);
  }
}
