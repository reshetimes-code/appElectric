import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/server/orders";

// Public, single-order lookup by order number — used by the order-confirmation
// page. The order number itself acts as the access token (standard pattern for
// a guest checkout confirmation page).
export async function GET(_request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const order = getOrderByNumber(orderNumber);
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  return NextResponse.json({ order });
}
