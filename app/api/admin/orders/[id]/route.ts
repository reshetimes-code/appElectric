import { NextResponse } from "next/server";
import { updateOrder, deleteOrder } from "@/lib/server/orders";
import type { OrderEditInput } from "@/lib/server/orders";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await request.json()) as OrderEditInput;
  const order = await updateOrder(id, body);
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  return NextResponse.json({ order });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteOrder(id);
  if (!ok) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
