import { NextResponse } from "next/server";
import { updatePurchaseOrderStatus, deletePurchaseOrder } from "@/lib/server/purchaseOrders";
import type { PurchaseOrderStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status: PurchaseOrderStatus; sentVia?: "whatsapp" | "email" };
  const po = updatePurchaseOrderStatus(id, body.status, body.sentVia);
  if (!po) return NextResponse.json({ error: "הזמנת רכש לא נמצאה" }, { status: 404 });
  return NextResponse.json({ purchaseOrder: po });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deletePurchaseOrder(id);
  if (!ok) return NextResponse.json({ error: "הזמנת רכש לא נמצאה" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
