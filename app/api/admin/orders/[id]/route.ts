import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/server/orders";
import type { OrderStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as { status: OrderStatus };
  const order = updateOrderStatus(id, body.status);
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  return NextResponse.json({ order });
}
