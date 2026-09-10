import { NextResponse } from "next/server";
import { createOrder, type OrderInput } from "@/lib/server/orders";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";

// Public: checkout submits here to place an order. Demo/dev checkout — no live
// payment gateway is connected (see README "What's next"). The order is
// generated and persisted server-side (visible to admin at /admin/orders) so
// the confirmation flow is fully real end-to-end without implying an actual
// charge occurred.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const allowed = await checkRateLimit("order-create", ip, 15, 60 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "יותר מדי הזמנות — נסו שוב מאוחר יותר" }, { status: 429 });

  const body = (await request.json().catch(() => null)) as OrderInput | null;
  if (
    !body ||
    typeof body.customer?.name !== "string" ||
    !body.customer.name.trim() ||
    typeof body.customer?.phone !== "string" ||
    !body.customer.phone.trim() ||
    typeof body.customer?.address !== "string" ||
    !body.customer.address.trim() ||
    !Array.isArray(body.lines) ||
    body.lines.length === 0 ||
    body.lines.length > 50 ||
    typeof body.subtotal !== "number" ||
    !Number.isFinite(body.subtotal) ||
    body.subtotal < 0
  ) {
    return NextResponse.json({ error: "פרטי הזמנה חסרים" }, { status: 400 });
  }
  const order = await createOrder(body);
  return NextResponse.json({ order }, { status: 201 });
}
