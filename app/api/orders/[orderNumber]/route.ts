import { NextResponse } from "next/server";
import { getOrderByNumber } from "@/lib/server/orders";
import { checkRateLimit, getClientIp } from "@/lib/server/rateLimit";

// Public, single-order lookup by order number — used by the order-confirmation
// page. The order number itself acts as the access token (standard pattern for
// a guest checkout confirmation page), so it's rate-limited per IP to make
// guessing/enumerating other customers' order numbers impractical.
export async function GET(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const ip = getClientIp(request);
  const allowed = await checkRateLimit("order-lookup", ip, 20, 5 * 60 * 1000);
  if (!allowed) return NextResponse.json({ error: "יותר מדי בקשות — נסו שוב בעוד כמה דקות" }, { status: 429 });

  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  return NextResponse.json({ order });
}
