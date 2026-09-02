import { NextResponse } from "next/server";
import { getAdminProducts, createAdminProduct, type AdminProductInput } from "@/lib/server/adminProducts";

export async function GET() {
  return NextResponse.json({ products: getAdminProducts() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as AdminProductInput;

  if (!body.nameHe?.trim() || !body.sku?.trim() || !body.brandId || !body.categoryId || !body.subcategoryId) {
    return NextResponse.json({ error: "יש למלא את כל שדות החובה" }, { status: 400 });
  }
  if (!Number.isFinite(body.price) || body.price <= 0) {
    return NextResponse.json({ error: "מחיר לא תקין" }, { status: 400 });
  }

  const product = createAdminProduct({
    ...body,
    images: body.images ?? [],
    stockQuantity: body.stockQuantity ?? 0,
    availabilityStatus: body.availabilityStatus || "in-stock",
  });
  return NextResponse.json({ product }, { status: 201 });
}
