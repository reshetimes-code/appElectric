import { NextResponse } from "next/server";
import { getPurchaseOrders, createPurchaseOrder, type PurchaseOrderInput } from "@/lib/server/purchaseOrders";

export async function GET() {
  return NextResponse.json({ purchaseOrders: await getPurchaseOrders() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as PurchaseOrderInput;
  if (!body.supplierId || !body.deliveryAddress?.trim()) {
    return NextResponse.json({ error: "יש למלא ספק וכתובת להספקה" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "יש להוסיף לפחות מוצר אחד" }, { status: 400 });
  }
  for (const item of body.items) {
    if (!item.productName?.trim()) {
      return NextResponse.json({ error: "יש למלא שם מוצר לכל פריט" }, { status: 400 });
    }
    if (!Number.isFinite(item.costPrice) || item.costPrice < 0) {
      return NextResponse.json({ error: "מחיר עלות לא תקין" }, { status: 400 });
    }
  }
  const po = await createPurchaseOrder({
    ...body,
    items: body.items.map((item) => ({ ...item, quantity: item.quantity || 1 })),
  });
  return NextResponse.json({ purchaseOrder: po }, { status: 201 });
}
