import { NextResponse } from "next/server";
import { getPurchaseOrders, createPurchaseOrder, type PurchaseOrderInput } from "@/lib/server/purchaseOrders";

export async function GET() {
  return NextResponse.json({ purchaseOrders: getPurchaseOrders() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as PurchaseOrderInput;
  if (!body.supplierId || !body.productName?.trim() || !body.deliveryAddress?.trim()) {
    return NextResponse.json({ error: "יש למלא ספק, שם מוצר וכתובת להספקה" }, { status: 400 });
  }
  if (!Number.isFinite(body.costPrice) || body.costPrice < 0) {
    return NextResponse.json({ error: "מחיר עלות לא תקין" }, { status: 400 });
  }
  const po = createPurchaseOrder({ ...body, quantity: body.quantity || 1 });
  return NextResponse.json({ purchaseOrder: po }, { status: 201 });
}
