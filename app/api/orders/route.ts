import { NextResponse } from "next/server";
import { createOrder, type OrderInput } from "@/lib/server/orders";

// Public: checkout submits here to place an order. Demo/dev checkout — no live
// payment gateway is connected (see README "What's next"). The order is
// generated and persisted server-side (visible to admin at /admin/orders) so
// the confirmation flow is fully real end-to-end without implying an actual
// charge occurred.
export async function POST(request: Request) {
  const body = (await request.json()) as OrderInput;
  if (!body.customer?.name || !body.customer?.phone || !body.customer?.address || !body.lines?.length) {
    return NextResponse.json({ error: "פרטי הזמנה חסרים" }, { status: 400 });
  }
  const order = createOrder(body);
  return NextResponse.json({ order }, { status: 201 });
}
